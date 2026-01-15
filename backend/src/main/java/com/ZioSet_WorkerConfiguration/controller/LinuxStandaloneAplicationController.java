package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.LinuxStandalonApplication;
import com.ZioSet_WorkerConfiguration.model.MacStandalonApplication;
import com.ZioSet_WorkerConfiguration.repo.LinuxStandaloneApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/linux/standaloneApplicationController"})
public class LinuxStandaloneAplicationController {
	
	@Autowired
	LinuxStandaloneApplicationRepo standalonApplicationRepo;
	
	@GetMapping({"/getActiveList"})
	  @ResponseBody
	  public List<LinuxStandalonApplication> getStandalonApplicationList() {
	    List<LinuxStandalonApplication> list = new ArrayList<>();
	    try {
	      list = this.standalonApplicationRepo.getActiveStandalonApplicationList();
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return list;
	  }
	
	
	
	@PostMapping({"/addNewStandaloneApplication"})
	  @ResponseBody
	  public ResponceObj addNewStandalonApplication(@RequestBody LinuxStandalonApplication standalonApplication)  {
		  ResponceObj status = new ResponceObj();
	    try {
			standalonApplication.setAddedDate(LocalDateTime.now().toString());
			standalonApplication.setActive(1);
	    	standalonApplicationRepo.save(standalonApplication);

	    		status.setCode(200);
	          status.setMessage("StandalonApplication Added.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	@PostMapping({"/deleteStandaloneApplication"})
	  @ResponseBody
	  public ResponceObj delteStandalonApplication(@RequestBody LinuxStandalonApplication standalonApplication )  {
		  ResponceObj status = new ResponceObj();
	    try {

	    	standalonApplicationRepo.delete(standalonApplication);
	        status.setCode(200);
	          status.setMessage("StandalonApplication Deleted.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	
	
	@PostMapping({"/updatedStatus"})
	  @ResponseBody
	  public ResponceObj updatedStatus(@RequestBody LinuxStandalonApplication standalonApplication )  {
		  ResponceObj status = new ResponceObj();
	    try {
	    	if(standalonApplication.getActive()==1) {
	    		standalonApplication.setActive(0);
	    		
	    	}else {
	    		standalonApplication.setActive(1);
	    	}
	 
	    	
	    	standalonApplicationRepo.save(standalonApplication);
	        status.setCode(200);
	          status.setMessage("StandalonApplication Status Updated .... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }

	  @GetMapping({"/getAllStandaloneApplications"})
	  @ResponseBody
	  public List<LinuxStandalonApplication> getAllStandaloneApplications(){
		return this.standalonApplicationRepo.findAll();
	  }

	  @GetMapping({"/getStandaloneApplicationCount"})
	  @ResponseBody
	  public int getStandalonApplicationCount() {
	    int count = 0;
	    try {
	      count = (int)this.standalonApplicationRepo.count();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return count;
	  }


	@PostMapping({"/getAllLinuxStandalonApplicationByLimitAndGroupSearch"})
	public List<LinuxStandalonApplication> getAllLinuxStandalonApplicationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
		List<LinuxStandalonApplication> list = new ArrayList<>();
		try {
			list = standalonApplicationRepo.getAllLinuxStandalonApplicationByLimitAndGroupSearch(groupSearchDTO);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@PostMapping({"/getCountAllLinuxStandalonApplicationByLimitAndGroupSearch"})
	public int getCountAllLinuxStandalonApplicationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
		int count = 0;
		try {
			count = standalonApplicationRepo.getCountAllLinuxStandalonApplicationByLimitAndGroupSearch(groupSearchDTO);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@GetMapping({"/getLinuxStandalonApplicationByLimit"})
	public List<LinuxStandalonApplication> getLinuxStandalonApplicationApplicationByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
		List<LinuxStandalonApplication> list = new ArrayList<>();
		try {
			list = standalonApplicationRepo.getLinuxStandalonApplicationByLimit(pageNo, perPage);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}


}

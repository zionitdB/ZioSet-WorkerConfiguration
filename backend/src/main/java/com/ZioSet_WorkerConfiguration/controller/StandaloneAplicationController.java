package com.ZioSet_WorkerConfiguration.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ZioSet_WorkerConfiguration.dto.CammandDTO;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;
import com.ZioSet_WorkerConfiguration.model.StandalonApplication;
import com.ZioSet_WorkerConfiguration.repo.StandalonApplicationRepo;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/standaloneApplicationController"})
public class StandaloneAplicationController {
	
	
	
	
	
	@Autowired 
	StandalonApplicationRepo standalonApplicationRepo;
	
	@GetMapping({"/getStandalonApplicationList"})
	  @ResponseBody
	  public List<StandalonApplication> getStandalonApplicationList() {
	    List<StandalonApplication> list = new ArrayList<StandalonApplication>();
	    try {
	      list = this.standalonApplicationRepo.getActiveStandalonApplicationList();
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return list;
	  }
	
	
	
	@PostMapping({"/addNewStandaloneApplication"})
	  @ResponseBody
	  public ResponceObj addNewStandalonApplication(@RequestBody StandalonApplication standalonApplication)  {
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
	  public ResponceObj delteStandalonApplication(@RequestBody StandalonApplication standalonApplication )  {
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
	  public ResponceObj updatedStatus(@RequestBody StandalonApplication standalonApplication )  {
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
	  public List<StandalonApplication> getAllStandaloneApplications(){
		return this.standalonApplicationRepo.findAll();
	  }
	
	
	
	  @GetMapping({"/getStandaloneApplicationByLimit"})
	  @ResponseBody
	  public List<StandalonApplication> getStandalonApplicationByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
	    List<StandalonApplication> list = new ArrayList<StandalonApplication>();
	    try {
	      list = this.standalonApplicationRepo.getStandalonApplicationByLimit(pageNo, perPage);
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
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
	  
	  
	  
	  
	  @PostMapping({"/getAllStandaloneApplicationByLimitAndGroupSearch"})
	  @ResponseBody
	  public List<StandalonApplication> getAllStandalonApplicationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    List<StandalonApplication> list = new ArrayList<StandalonApplication>();
	    try {
	      list = this.standalonApplicationRepo.getAllStandalonApplicationByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  @PostMapping({"/getCountAllStandaloneApplicationByLimitAndGroupSearch"})
	  @ResponseBody
	  public int getCountAllStandalonApplicationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    int count = 0;
	    try {
	      count = this.standalonApplicationRepo.getCountAllStandalonApplicationByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return count;
	  }
	
}

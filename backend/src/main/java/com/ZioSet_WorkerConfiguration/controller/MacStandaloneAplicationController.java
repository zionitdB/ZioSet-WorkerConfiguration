package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.MacStandalonApplication;
import com.ZioSet_WorkerConfiguration.repo.MacStandaloneApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/mac/standaloneApplicationController"})
public class MacStandaloneAplicationController {
	
	
	
	
	
	@Autowired
	MacStandaloneApplicationRepo standalonApplicationRepo;
	
	@GetMapping({"/getActiveList"})
	  @ResponseBody
	  public List<MacStandalonApplication> getStandalonApplicationList() {
	    List<MacStandalonApplication> list = new ArrayList<>();
	    try {
	      list = this.standalonApplicationRepo.getActiveStandalonApplicationList();
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return list;
	  }
	
	
	
	@PostMapping({"/addNewStandaloneApplication"})
	  @ResponseBody
	  public ResponceObj addNewStandalonApplication(@RequestBody MacStandalonApplication standalonApplication)  {
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
	  public ResponceObj delteStandalonApplication(@RequestBody MacStandalonApplication standalonApplication )  {
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
	  public ResponceObj updatedStatus(@RequestBody MacStandalonApplication standalonApplication )  {
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
	  public List<MacStandalonApplication> getAllStandaloneApplications(){
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

}

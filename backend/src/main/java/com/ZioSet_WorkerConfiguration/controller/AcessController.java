package com.ZioSet_WorkerConfiguration.controller;

import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.repo.UserRepo;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/access"})
public class AcessController {
	
	
	@Autowired
	  UserRepo userRepo;
	
	
	
	  @PostMapping(value = {"/login"}, consumes = {"application/json"})
	  @ResponseBody
	  public ResponceObj loginUser(@RequestBody UserInfo user) {
		  ResponceObj responceObj = new ResponceObj ();
	    try {
	    	  Optional<UserInfo> optional = this.userRepo.getUsersByUsername(user.getUsername());
	      System.out.println("USER " + user.getUsername());
	      if (optional.isPresent()) {
		    	  if(optional.get().getPassword().equals(user.getPassword())) {
		    		  responceObj.setCode(200);
			    	  responceObj.setMessage("Login Successfully...........!!");
			    	  responceObj.setData(optional.get());
		    	  }else {
		    		  responceObj.setCode(500);
			    	  responceObj.setMessage("Invalid Password");
		    	  }
	      }else {
	    	  responceObj.setCode(500);
	    	  responceObj.setMessage("Invalid Username");
	      }
	     
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return responceObj;
	  }
}

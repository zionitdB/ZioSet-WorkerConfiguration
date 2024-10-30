package com.ZioSet_WorkerConfiguration.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
import com.ZioSet_WorkerConfiguration.dto.CategoryTreeDTO;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.Action;
import com.ZioSet_WorkerConfiguration.model.Category;
import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;
import com.ZioSet_WorkerConfiguration.repo.ActionRepo;
import com.ZioSet_WorkerConfiguration.repo.CategoryRepo;
import com.ZioSet_WorkerConfiguration.repo.CommandConfigurationRepo;




@RestController
@CrossOrigin({"*"})
@RequestMapping({"/configuration"})
public class ConfigurationController {
	
	
	
	
	@Autowired
	CategoryRepo categoryRepop;
	@Autowired
	ActionRepo actionRepo;
	@Autowired
	CommandConfigurationRepo commandConfigurationRepo;
	
	
	@PostMapping({"/addNewCommandConfiguration"})
	  @ResponseBody
	  public ResponceObj addNewCommandConfiguration(@RequestBody CommandConfiguration commandConfiguration )  {
		  ResponceObj status = new ResponceObj();
	    try {
	   
	 
	   
	  
	    	for(CammandDTO cammandDTO:commandConfiguration.getList()) {
	    		CommandConfiguration commandConfigurationNew= new CommandConfiguration();
	    		  System.out.println("Config "+commandConfiguration.toString());
	    		commandConfigurationNew.setAction(commandConfiguration.getAction());
	    		commandConfigurationNew.setCommandstr(cammandDTO.getCommandstr());
	    		commandConfigurationNew.setSchemastr(cammandDTO.getSchemastr());
	    		commandConfigurationRepo.save(commandConfigurationNew);
	    	}
	    	
	    							status.setCode(200);
	          status.setMessage("CommandConfiguration Added.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	@PostMapping({"/updateCommandConfiguration"})
	  @ResponseBody
	  public ResponceObj updateCommandConfiguration(@RequestBody CommandConfiguration commandConfiguration )  {
		  ResponceObj status = new ResponceObj();
	    try {
	   
	   System.out.println("Config "+commandConfiguration.toString());
	    	
	    	commandConfigurationRepo.save(commandConfiguration);
	        status.setCode(200);
	          status.setMessage("CommandConfiguration Updated.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	
	
	@PostMapping({"/delteCommandConfiguration"})
	  @ResponseBody
	  public ResponceObj delteCommandConfiguration(@RequestBody CommandConfiguration commandConfiguration )  {
		  ResponceObj status = new ResponceObj();
	    try {
	   
	   System.out.println("Config "+commandConfiguration.toString());
	    	
	    	commandConfigurationRepo.delete(commandConfiguration);
	        status.setCode(200);
	          status.setMessage("CommandConfiguration Deleted.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	  @GetMapping({"/getAllCommandConfigurations"})
	  @ResponseBody
	  public List<CommandConfiguration> getAllCommandConfigurations() {
	    List<CommandConfiguration> list = new ArrayList<CommandConfiguration>();
	    try {
	      list = this.commandConfigurationRepo.findAll();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	
	  @GetMapping({"/getCommandConfigurationByLimit"})
	  @ResponseBody
	  public List<CommandConfiguration> getCommandConfigurationsByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
	    List<CommandConfiguration> list = new ArrayList<CommandConfiguration>();
	    try {
	      list = this.commandConfigurationRepo.getCommandConfigurationsByLimit(pageNo, perPage);
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	  @GetMapping({"/getCommandConfigurationCount"})
	  @ResponseBody
	  public int getCommandConfigurationCount() {
	    int count = 0;
	    try {
	      count = (int)this.commandConfigurationRepo.count();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return count;
	  }
	  
	  
	  @GetMapping({"/getAllCommandConfigurationByActionId"})
	  @ResponseBody
	  public List<CommandConfiguration> getAllCommandConfigurationByActionId(@RequestParam("actionId") int actionId) {
	    List<CommandConfiguration> list = new ArrayList<CommandConfiguration>();
	    try {
	      list = this.commandConfigurationRepo.getAllCommandConfigurationByActionId(actionId);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	  @PostMapping({"/getAllCommandConfigurationByLimitAndGroupSearch"})
	  @ResponseBody
	  public List<CommandConfiguration> getAllCommandConfigurationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    List<CommandConfiguration> list = new ArrayList<CommandConfiguration>();
	    try {
	      list = this.commandConfigurationRepo.getAllCommandConfigurationByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  @PostMapping({"/getCountAllCommandConfigurationByLimitAndGroupSearch"})
	  @ResponseBody
	  public int getCountAllCommandConfigurationByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    int count = 0;
	    try {
	      count = this.commandConfigurationRepo.getCountAllCommandConfigurationByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return count;
	  }
	
	
//*******************************************************************************************************************************************************************************************
	  @PostMapping({"/addNewAction"})
	  @ResponseBody
	  public ResponceObj addNewAction(@RequestBody Action action)  {
		  ResponceObj status = new ResponceObj();
	    try {
	   
	   
	    	
	    	actionRepo.save(action);
	        status.setCode(200);
	          status.setMessage("Action Added.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	  @PostMapping({"/deleteAction"})
	  @ResponseBody
	  public ResponceObj deleteAction(@RequestBody Action action)  {
		  ResponceObj status = new ResponceObj();
	    try {
	   
	   
	    	
	    	actionRepo.delete(action);
	        status.setCode(200);
	          status.setMessage("Action Deleted.... Successfully");
	      
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	  @GetMapping({"/getAllActions"})
	  @ResponseBody
	  public List<Action> getAllActions() {
	    List<Action> list = new ArrayList<Action>();
	    try {
	      list = this.actionRepo.findAll();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	
	  @GetMapping({"/getActionByLimit"})
	  @ResponseBody
	  public List<Action> getActionsByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
	    List<Action> list = new ArrayList<Action>();
	    try {
	      list = this.actionRepo.getActionsByLimit(pageNo, perPage);
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	  @GetMapping({"/getActionCount"})
	  @ResponseBody
	  public int getActionCount() {
	    int count = 0;
	    try {
	      count = (int)this.actionRepo.count();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return count;
	  }
	  
	  
	  @PostMapping({"/getAllActionByLimitAndGroupSearch"})
	  @ResponseBody
	  public List<Action> getAllActionByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    List<Action> list = new ArrayList<Action>();
	    try {
	      list = this.actionRepo.getAllActionByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  @PostMapping({"/getCountAllActionByLimitAndGroupSearch"})
	  @ResponseBody
	  public int getCountAllActionByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    int count = 0;
	    try {
	      count = this.actionRepo.getCountAllActionByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return count;
	  }
	
	
	
	
	//**************************************************************************************************************************************************************//
	
	  @PostMapping({"/addNewCategory"})
	  @ResponseBody
	  public ResponceObj addNewCategory		(@RequestBody Category category) {
		  ResponceObj status = new ResponceObj();
	    try {
	      Optional<Category> optional = this.categoryRepop.getCategoryByName(category.getCategoryname());
	      if (optional.isPresent()) {

	    	  status.setCode(500);
	        status.setMessage("Category Name already Exits");
	      } else {
	    	  category.setCreatedDate(new Date());
	    	  categoryRepop.save(category);
	        status.setCode(200);
	          status.setMessage("Category Added.... Successfully");
	      } 
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	  @PostMapping({"/deleteCategory"})
	  @ResponseBody
	  public ResponceObj deleteCategory		(@RequestBody Category category) {
		  ResponceObj status = new ResponceObj();
	    try {
	    
	      categoryRepop.delete(category);
	      status.setCode(200);
          status.setMessage("Category Deleted.... Successfully");
	    } catch (Exception e) {
	      e.printStackTrace();
	      status.setCode(500);
	      status.setMessage("Something Wrong");
	    } 
	    return status;
	  }
	
	  @GetMapping({"/getAllCategories"})
	  @ResponseBody
	  public List<Category> getAllCategories() {
	    List<Category> list = new ArrayList<Category>();
	    try {
	      list = this.categoryRepop.findAll();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  @GetMapping({"/getAllCategoryByParentId"})
	  @ResponseBody
	  public List<Category> getAllCategoryByParentId(@RequestParam("parentCategoryId") int parentCategoryId) {
	    List<Category> list = new ArrayList<Category>();
	    try {
	      list = this.categoryRepop.getAllCategoryByParentId(parentCategoryId);
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	  
	  @GetMapping({"/getAllCategoriesTreeById"})
	  @ResponseBody
	  public  CategoryTreeDTO getAllCategoriesTreeById(@RequestParam("categoryId") int categoryId) {
		  CategoryTreeDTO treeDTO = new CategoryTreeDTO();
	    try {
	      Optional<Category>  optional= this.categoryRepop.findById(categoryId);
	     
	      System.out.println("CAT NAME "+optional.get().getCategoryname());
	      if(optional.get().getParrentCategory()!=null) {
		      System.out.println("Parent NAME "+optional.get().getParrentCategory().getCategoryname());
		      treeDTO.setParent(optional.get().getParrentCategory());
	      }
	     List<Category> categories=categoryRepop.getChildByCategoryId(categoryId);
	      System.out.println("Clinds -------------------------------");
	      treeDTO.setChilds(categories);
	   
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return treeDTO;
	  }
	
	
	  @GetMapping({"/getCategoryByLimit"})
	  @ResponseBody
	  public List<Category> getCategorysByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
	    List<Category> list = new ArrayList<Category>();
	    try {
	      list = this.categoryRepop.getCategorysByLimit(pageNo, perPage);
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  
	  @GetMapping({"/getCategoryCount"})
	  @ResponseBody
	  public int getCategoryCount() {
	    int count = 0;
	    try {
	      count = (int)this.categoryRepop.count();
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return count;
	  }
	  
	  
	  @PostMapping({"/getAllCategoryByLimitAndGroupSearch"})
	  @ResponseBody
	  public List<Category> getAllCategoryByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    List<Category> list = new ArrayList<>();
	    try {
	      list = this.categoryRepop.getAllCategoryByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    } 
	    return list;
	  }
	  @PostMapping({"/getCountAllCategoryByLimitAndGroupSearch"})
	  @ResponseBody
	  public int getCountAllCategoryByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
	    int count = 0;
	    try {
	      count = this.categoryRepop.getCountAllCategoryByLimitAndGroupSearch(groupSearchDTO);
	      boolean bool = false;
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	    return count;
	  }

}

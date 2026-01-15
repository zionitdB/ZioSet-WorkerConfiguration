package com.ZioSet_WorkerConfiguration.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import com.ZioSet_WorkerConfiguration.model.AgentConfigManual;
import com.ZioSet_WorkerConfiguration.model.Category;
import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;
import com.ZioSet_WorkerConfiguration.repo.ActionRepo;
import com.ZioSet_WorkerConfiguration.repo.AgentConfigManualRepo;
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


	@Autowired
	AgentConfigManualRepo agentConfigManualRepo;


	@PostMapping({"/addAgentConfigManual"})
	@ResponseBody
	public ResponceObj addAgentConfigManual(@RequestBody AgentConfigManual agentConfigManual)  {
		ResponceObj status = new ResponceObj();
		try {


			agentConfigManualRepo.save(agentConfigManual);
			status.setCode(200);
			status.setMessage("AgentConfigManual Added.... Successfully");

		} catch (Exception e) {
			e.printStackTrace();
			status.setCode(500);
			status.setMessage("Something Wrong");
		}
		return status;
	}

	@PostMapping({"/updateAgentConfigManual"})
	@ResponseBody
	public ResponceObj updateAgentConfigManual(@RequestBody AgentConfigManual agentConfigManual)  {
		ResponceObj status = new ResponceObj();
		try {


			agentConfigManualRepo.save(agentConfigManual);
			status.setCode(200);
			status.setMessage("AgentConfigManual Updated.... Successfully");

		} catch (Exception e) {
			e.printStackTrace();
			status.setCode(500);
			status.setMessage("Something Wrong");
		}
		return status;
	}

	@PostMapping({"/deleteAgentConfigManual"})
	@ResponseBody
	public ResponceObj deleteAgentConfigManual(@RequestBody AgentConfigManual agentConfigManual)  {
		ResponceObj status = new ResponceObj();
		try {


			agentConfigManualRepo.delete(agentConfigManual);
			status.setCode(200);
			status.setMessage("AgentConfigManual Deleted.... Successfully");

		} catch (Exception e) {
			e.printStackTrace();
			status.setCode(500);
			status.setMessage("Something Wrong");
		}
		return status;
	}
	@GetMapping({"/getAllAgentConfigManual"})
	@ResponseBody
	public List<AgentConfigManual> getAllAgentConfigManual() {
		List<AgentConfigManual> list = new ArrayList<AgentConfigManual>();
		try {
			list = this.agentConfigManualRepo.findAll();
			boolean bool = false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}


	@GetMapping("/getCommandsByCommandId")
	@ResponseBody
	public List<CommandConfiguration> getCommnadsByCommandId(@RequestParam("commandId") String commandId) {
		return this.commandConfigurationRepo.getCommandsByCommandId(commandId);
	}

	@GetMapping("/getCommandsByCommandIdPage")
	@ResponseBody
	public Page<CommandConfiguration> getCommnadsByCommandId(@RequestParam int pageNo,
															 @RequestParam int perPage,
															 @RequestParam("commandId") String commandId) {
		Pageable pageable = PageRequest.of(--pageNo,perPage);
		return this.commandConfigurationRepo.getCommandsByCommandId(commandId,pageable);
	}

	@GetMapping("/getCommandIdListByAction")
	@ResponseBody
	public List<String> getCommandIdListByAction(@RequestParam("actionId") int actionId) {
		return this.commandConfigurationRepo.getCommandIdListByAction(actionId);
	}

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
				commandConfigurationNew.setCommandId(cammandDTO.getCommandId());
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
			Optional<CommandConfiguration> optional=commandConfigurationRepo.findById(commandConfiguration.getId());
			System.out.println(" OP IS "+optional.isPresent());

			CommandConfiguration commandConfiguration2=optional.get();
			commandConfiguration2.setCommandstr(commandConfiguration.getList().get(0).getCommandstr());
			commandConfiguration2.setSchemastr(commandConfiguration.getList().get(0).getSchemastr());
			commandConfigurationRepo.save(commandConfiguration2);
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


	@GetMapping({"/getNewCommandId"})
	@ResponseBody
	public String getNewCommandId() {
		String commandId = null ;
		try {


			LocalDate currentdate = LocalDate.now();
			int currentYear = currentdate.getYear();
			int currentMonth=currentdate.getMonthValue();
			String month;
			if(currentMonth<9){
				month ="0"+Integer.toString(currentMonth);
			}else{
				month=Integer.toString(currentMonth);
			}
			String year=Integer.toString(currentYear).substring(2,4);
			String maxCode=commandConfigurationRepo.getMaxCode(year+month);

			commandId=year+month+maxCode;
			System.out.println("configuration :: "+commandId);

			//String commandId = this.commandConfigurationRepo.getNewCommandId();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return commandId;
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

package com.ZioSet_WorkerConfiguration.rolepermission.controller;

import java.util.*;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.rolepermission.dto.*;
import com.ZioSet_WorkerConfiguration.rolepermission.model.*;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.*;
import com.ZioSet_WorkerConfiguration.rolepermission.service.AccessService;
import com.ZioSet_WorkerConfiguration.rolepermission.service.UserServicesZioSet;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.repo.UserRepo;

@RestController
@CrossOrigin({"*"})
@RequestMapping({"/access"})
public class AccessController {

	@Autowired
	UserRepo userRepo;

	@Autowired
	private AccessService accessService;

	@Autowired
	private UserServicesZioSet userService;

	@Autowired
	RolePermissionActionRepo rolePermissionActionRepo;

	@Autowired
	PermissionActionRepo permissionActionRepo;


	@Autowired
	PermissionsRepo permissionRepo;
	@Autowired
	PermissionRequestRepo permissionRequestRepo;
	@Autowired
	RolePermissionRepo rolePermissionRepo;

	@PostMapping({"/addPermissionRequest"})
	public ResponceObj addPermissionRequest(@RequestBody PermissionRequestDTO permissionRequest) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			System.out.println("Per "+permissionRequest.toString());
			Optional<Permissions> optional=permissionRepo.findById(permissionRequest.getPermissionsId());
			System.out.println("Per By Id  "+optional.isPresent()+" "+permissionRequest.getPermissionsId());
			if(optional.isPresent()) {
				int i=1;
				for(PermissionAction permissionAction:permissionRequest.getActions()) {
					Optional<PermissionAction> optionalAcion=permissionActionRepo.getPermissionActionBYPermissionIdAndActionName(permissionRequest.getPermissionsId(), permissionAction.getActionName());
					System.out.println("Per By Id  "+optional.isPresent()+" "+permissionRequest.getPermissionsId()+" "+ permissionAction.getActionName());
					System.out.println("PermissionAction "+optionalAcion.isPresent());

					UserInfo userOp=userService.getUserById(permissionRequest.getUserId());
					PermissionRequest permissionRequestnew= new PermissionRequest();
					permissionRequestnew.setPermissionAction(optionalAcion.get());
					permissionRequestnew.setPermissions(optional.get());
					permissionRequestnew.setRemark(permissionRequest.getRemark());
					permissionRequestnew.setApproved(0);
					permissionRequestnew.setUserInfo(userOp);
					Optional<PermissionRequest> optionalReq=permissionRequestRepo.getPermisionRequestByPermisionIdUserANdAction(permissionRequestnew.getPermissions().getPermissionsId(),permissionRequestnew.getPermissionAction().getPermissionAsactionId(),permissionRequestnew.getUserInfo().getUserId());

					if(!optionalReq.isPresent()) {
						i++;
						permissionRequestRepo.save(permissionRequestnew);
					}

				}
				if(i==permissionRequest.getActions().size()) {
					responceDTO.setCode(200);
					responceDTO.setMessage("Request Has Created");
				}else {
					responceDTO.setCode(200);
					responceDTO.setMessage("Request Has Created: Some action are already requested");
				}

			}
			return responceDTO;
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return responceDTO;
		}
	}


	@PostMapping({"/approvePermissionRequest"})
	public ResponceObj approvePermissionRequest(@RequestBody PermissionRequest permissionRequest) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			permissionRequest.setApproved(1);
			permissionRequestRepo.save(permissionRequest);
			responceDTO.setCode(200);
			responceDTO.setMessage("Approved Successfully");
			return responceDTO;
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return responceDTO;
		}
	}



	@GetMapping({"/getAllPermissionRequests"})
	@ResponseBody
	public List<PermissionRequest> getAllPermissionRequests() {
		List<PermissionRequest> list = new ArrayList<PermissionRequest>();
		try {
			list = this.permissionRequestRepo.getAllPermissionRequests();

		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}


	@GetMapping({"/getUserInfoByLimit/{page_no}/{item_per_page}"})
	@ResponseBody
	public List<UserInfo> getUserInfoByLimit(@PathVariable int page_no, @PathVariable int item_per_page) {
		List<UserInfo> list = new ArrayList<>();
		try {
			list = this.userService.getUserInfoByLimit(page_no, item_per_page);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@GetMapping({"/getUserInfoCount"})
	@ResponseBody
	public int getUserInfoCount() {
		int count = 0;
		try {
			count = this.userService.getUserInfoCount();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@PostMapping({"/getUserInfoByLimitAndGroupSearch"})
	@ResponseBody
	public List<UserInfo> getUserInfoByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
		List<UserInfo> list = new ArrayList<>();
		try {
			list = this.userService.getUserInfoByLimitAndGroupSearch(groupSearchDTO);

			boolean bool = false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@PostMapping({"/getCountUserInfoByLimitAndGroupSearch"})
	@ResponseBody
	public int getUserInfoCountByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
		int count = 0;
		try {
			count = this.userService.getUserInfoCountByLimitAndGroupSearch(groupSearchDTO);
			boolean bool = false;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@PostMapping({"/addUser"})
	public ResponseEntity addUser(@RequestBody UserInfo userInfo) {
		ResponceObj responceDTO = new ResponceObj();
		try {

		} catch (Exception e) {
			e.printStackTrace();
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
		return null;
	}

	@PostMapping({"/updateRolePermission"})
	public ResponseEntity<ResponceObj> saveRolePermission(@RequestBody SaveRolePermissionDTO rolePermissions) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			Role role = this.accessService.getRoleById(rolePermissions.getRoleId());
			Permissions permissions = this.accessService.getPermissionsById(rolePermissions.getPermissionId());

			int roleId = (int) role.getRoleId();
			int permissionId = (int) permissions.getPermissionsId();

			Optional<RolePermission> optional2 = this.accessService.getRolePermissionByRoleAndPermission(roleId, permissionId);

			if (rolePermissions.isSelected()) {
				if (optional2.isPresent()) {
					RolePermission rolePer = optional2.get();
					this.accessService.saveRolePermission(rolePer);
				} else {
					RolePermission rolePer = new RolePermission();
					rolePer.setPermissions(permissions);
					rolePer.setRole(role);
					this.accessService.saveRolePermission(rolePer);
				}
			} else {
				RolePermission rolePer = optional2.get();
				this.accessService.deleteRolePermission(rolePer);
			}

			responceDTO.setCode(200);
			responceDTO.setMessage("Permission Updated Successfully");
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		}
	}


	@PostMapping({"/updateRolePermissionAction"})
	public ResponseEntity<ResponceObj> updateRolePermissionAction(@RequestBody SaveRolePermissionDTO rolePermissions) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			Role role = this.accessService.getRoleById(rolePermissions.getRoleId());
			Permissions permissions = this.accessService.getPermissionsById(rolePermissions.getPermissionId());

			Optional<RolePermission> optional2 = this.accessService.getRolePermissionByRoleAndPermission(
					(int) role.getRoleId(), (int) permissions.getPermissionsId());

			Optional<PermissionAction> optional = this.accessService.getPermissionActionBYPermissionIdAndActionName(
					(int) permissions.getPermissionsId(), rolePermissions.getActionName());

			Optional<RolePermissionAction> rolePerActionOp = this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
					((PermissionAction) optional.get()).getPermissionAsactionId(), (int) role.getRoleId());

			if (rolePermissions.isSelected()) {
				if (rolePerActionOp.isPresent()) {
					RolePermissionAction rolePer = rolePerActionOp.get();
					this.rolePermissionActionRepo.save(rolePer);
				} else {
					RolePermissionAction rolePer = new RolePermissionAction();
					rolePer.setPermissionsAction(optional.get());
					rolePer.setRole(role);
					this.rolePermissionActionRepo.save(rolePer);
				}
			} else {
				Optional<PermissionAction> optional1 = this.accessService.getPermissionActionBYPermissionIdAndActionName(
						(int) permissions.getPermissionsId(), rolePermissions.getActionName());

				Optional<RolePermissionAction> rolePerActionOp1 = this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
						((PermissionAction) optional1.get()).getPermissionAsactionId(), (int) role.getRoleId());

				rolePermissionActionRepo.delete(rolePerActionOp1.get());

				RolePermission rolePer = optional2.get();
				// this.accessService.deleteRolePermission(rolePer);
			}

			responceDTO.setCode(200);
			responceDTO.setMessage("Action Updated Successfully");
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@GetMapping({"/getPermissionsAndActionByRole1"})
	@ResponseBody
	public PermissionsDTO getPermissionsAndActionByRole1(@RequestParam int roleId) {
		PermissionsDTO permissionsDTO = new PermissionsDTO();
		try {
			List<Permissions> masterPermission = this.accessService.getPermissionsByCategory("Master");
			List<Permissions> transactionPermission = this.accessService.getPermissionsByCategory("Transaction");
			List<Permissions> reportPermission = this.accessService.getPermissionsByCategory("Report");
			List<Permissions> dashboardPermission = this.accessService.getPermissionsByCategory("Dashboard");
			List<Permissions> configurationPermission = this.accessService.getPermissionsByCategory("Configuration");
			List<Permissions> hrPermission = this.accessService.getPermissionsByCategory("Hr");

			System.out.println("MASTER " + masterPermission.size());
			System.out.println("TRANS  " + transactionPermission.size());
			System.out.println("REPORT " + reportPermission.size());
			System.out.println("Dashboard  " + dashboardPermission.size());
			System.out.println("Configuration " + configurationPermission.size());
			System.out.println("Hr " + hrPermission.size());


			for (Permissions permission : masterPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				System.out.println("roleId " + roleId + " PERMo" + permission.getPermissionsId() + "  " + optional.isPresent());
				if (optional.isPresent()) {
					permission.setSelected(true);
				} else {
					permission.setSelected(false);
				}
				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}

			for (Permissions permission : transactionPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}


				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}

			for (Permissions permission : reportPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);





			}

			for (Permissions permission : dashboardPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//  continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}

			for (Permissions permission : configurationPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);

			}


			for (Permissions permission : hrPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);

			}







			permissionsDTO.setDashboardPermission(dashboardPermission);
			permissionsDTO.setMasterPermission(masterPermission);
			permissionsDTO.setReportPermission(reportPermission);
			permissionsDTO.setTransactionPermission(transactionPermission);
			permissionsDTO.setConfigurationPermission(configurationPermission);
			permissionsDTO.setHrPermission(hrPermission);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return permissionsDTO;
	}


	public static boolean isNamePresent(List<Permissions> people, String name) {
		for (Permissions person : people) {
			if (person.getPermissionsName().equals(name)) {
				return true;
			}
		}
		return false;
	}
	@GetMapping({"/getPermissionsAndActionByRole"})
	@ResponseBody
	public PermissionsDTO getPermissionsAndActionByRole(@RequestParam int roleId,int userId) {
		PermissionsDTO permissionsDTO = new PermissionsDTO();
		try {
			List<Permissions> masterPermission = new ArrayList<Permissions>();
			List<Permissions> transactionPermission = new ArrayList<Permissions>();
			List<Permissions> congigurationPermission = new ArrayList<Permissions>();
			List<Permissions> reportPermission = new ArrayList<Permissions>();
			List<Permissions> dashbaordPermission = new ArrayList<Permissions>();




			for (Permissions permission : this.accessService.getPermissionsByCategory("Master")) {

				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

					Set<ActionDto> dtos = new HashSet<>();

					for (PermissionAction action :permissionActions) {

						List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());


						if(permissionRequests.size()!=0) {
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							PermissionRequest permissionRequest=permissionRequests.get(0);
							if(permissionRequest.getApproved()==1) {
								actionDto.setSelected(true);
							}else {
								Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
								if(optionalAction.isPresent())
								{
									actionDto.setSelected(true);
								}
								else {
									actionDto.setSelected(false);
								}
							}


							permission.setActions(dtos);
							permission.setActions(dtos);
							dtos.add(actionDto);
						}
						else {
							Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							if(optionalAction.isPresent())
							{
								actionDto.setSelected(true);
							}
							else {
								actionDto.setSelected(false); }
							dtos.add(actionDto);
						}
						permission.setActions(dtos);
					}

					permission.setActions(dtos);
					masterPermission.add(permission);

				}

			}

			for (Permissions permission : this.accessService.getPermissionsByCategory("Transaction")) {

				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

					Set<ActionDto> dtos = new HashSet<>();

					for (PermissionAction action :permissionActions) {

						List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());


						if(permissionRequests.size()!=0) {
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							PermissionRequest permissionRequest=permissionRequests.get(0);
							if(permissionRequest.getApproved()==1) {
								actionDto.setSelected(true);
							}else {
								Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
								if(optionalAction.isPresent())
								{
									actionDto.setSelected(true);
								}
								else {
									actionDto.setSelected(false);
								}
							}


							permission.setActions(dtos);
							permission.setActions(dtos);
							dtos.add(actionDto);
						}
						else {
							Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							if(optionalAction.isPresent())
							{
								actionDto.setSelected(true);
							}
							else {
								actionDto.setSelected(false); }
							dtos.add(actionDto);
						}
						permission.setActions(dtos);
					}

					permission.setActions(dtos);
					transactionPermission.add(permission);

				}

			}



			for (Permissions permission : this.accessService.getPermissionsByCategory("Configuration")) {

				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

					Set<ActionDto> dtos = new HashSet<>();

					for (PermissionAction action :permissionActions) {

						List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());


						if(permissionRequests.size()!=0) {
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							PermissionRequest permissionRequest=permissionRequests.get(0);
							if(permissionRequest.getApproved()==1) {
								actionDto.setSelected(true);
							}else {
								Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
								if(optionalAction.isPresent())
								{
									actionDto.setSelected(true);
								}
								else {
									actionDto.setSelected(false);
								}
							}


							permission.setActions(dtos);
							permission.setActions(dtos);
							dtos.add(actionDto);
						}
						else {
							Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							if(optionalAction.isPresent())
							{
								actionDto.setSelected(true);
							}
							else {
								actionDto.setSelected(false); }
							dtos.add(actionDto);
						}
						permission.setActions(dtos);
					}

					permission.setActions(dtos);
					congigurationPermission.add(permission);

				}

			}
			for (Permissions permission : this.accessService.getPermissionsByCategory("Report")) {

				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

					Set<ActionDto> dtos = new HashSet<>();

					for (PermissionAction action :permissionActions) {

						List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());


						if(permissionRequests.size()!=0) {
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							PermissionRequest permissionRequest=permissionRequests.get(0);
							if(permissionRequest.getApproved()==1) {
								actionDto.setSelected(true);
							}else {
								Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
								if(optionalAction.isPresent())
								{
									actionDto.setSelected(true);
								}
								else {
									actionDto.setSelected(false);
								}
							}


							permission.setActions(dtos);
							permission.setActions(dtos);
							dtos.add(actionDto);
						}
						else {
							Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							if(optionalAction.isPresent())
							{
								actionDto.setSelected(true);
							}
							else {
								actionDto.setSelected(false); }
							dtos.add(actionDto);
						}
						permission.setActions(dtos);
					}

					permission.setActions(dtos);
					reportPermission.add(permission);

				}

			}
			for (Permissions permission : this.accessService.getPermissionsByCategory("Dashboard")) {

				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

					Set<ActionDto> dtos = new HashSet<>();

					for (PermissionAction action :permissionActions) {

						List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());


						if(permissionRequests.size()!=0) {
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							PermissionRequest permissionRequest=permissionRequests.get(0);
							if(permissionRequest.getApproved()==1) {
								actionDto.setSelected(true);
							}else {
								Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
								if(optionalAction.isPresent())
								{
									actionDto.setSelected(true);
								}
								else {
									actionDto.setSelected(false);
								}
							}


							permission.setActions(dtos);
							permission.setActions(dtos);
							dtos.add(actionDto);
						}
						else {
							Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
							ActionDto actionDto = new ActionDto();
							actionDto.setActionName(action.getActionName());
							if(optionalAction.isPresent())
							{
								actionDto.setSelected(true);
							}
							else {
								actionDto.setSelected(false); }
							dtos.add(actionDto);
						}
						permission.setActions(dtos);
					}

					permission.setActions(dtos);
					dashbaordPermission.add(permission);

				}

			}
			permissionsDTO.setMasterPermission(masterPermission);
			permissionsDTO.setTransactionPermission(transactionPermission);
			permissionsDTO.setConfigurationPermission(congigurationPermission);
			permissionsDTO.setReportPermission(reportPermission);
			permissionsDTO.setDashboardPermission(dashbaordPermission);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return permissionsDTO;
	}
	@GetMapping({"/getPermissionsAndActionByRoleOld"})
	@ResponseBody
	public PermissionsDTO getPermissionsAndActionByRoleOld(@RequestParam int roleId,int userId) {
		PermissionsDTO permissionsDTO = new PermissionsDTO();
		try {
			System.out.println("ROLE "+roleId+" USER "+userId);
			List<Permissions> masterPermission = this.accessService.getPermissionsByCategory("Master");
			List<Permissions> transactionPermission = this.accessService.getPermissionsByCategory("Transaction");
			List<Permissions> reportPermission = this.accessService.getPermissionsByCategory("Report");
			List<Permissions> dashboardPermission = this.accessService.getPermissionsByCategory("Dashboard");
			List<Permissions> configurationPermission = this.accessService.getPermissionsByCategory("Configuration");

			System.out.println("MASTER " + masterPermission.size());
			System.out.println("TRANS  " + transactionPermission.size());
			System.out.println("REPORT " + reportPermission.size());
			System.out.println("Dashboard  " + dashboardPermission.size());
			System.out.println("Configuration " + configurationPermission.size());


			for (Permissions permission : masterPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());

				if (optional.isPresent()) {
					permission.setSelected(true);
				} else {
					permission.setSelected(false);
				}
				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());
				System.out.println("roleId " + roleId + " PERMo" + permission.getPermissionsName() + "  " + optional.isPresent()+" Action "+permissionActions.size());
				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					System.out.println("Action  "+action.getActionName());
					List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());

					//  System.out.println("permissionRequests  uid  "+userId+"  Per "+permission.getPermissionsId()+" Acr "+action.getPermissionAsactionId()+"  "+permissionRequests.size());
					if(permissionRequests.size()!=0) {
						System.out.println("REQ AC "+action.getActionName());
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						actionDto.setSelected(true);
						permission.setActions(dtos);

						dtos.add(actionDto);
					}else {
						System.out.println("PER AC "+action.getActionName());
						Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
						ActionDto actionDto = new ActionDto();


						actionDto.setActionName(action.getActionName());
						if(optionalAction.isPresent())
						{
							actionDto.setSelected(true);
						}
						else {
							actionDto.setSelected(false); }
						dtos.add(actionDto);
					}
					permission.setActions(dtos);
				}

				permission.setActions(dtos);
			}



			for (Permissions permission : transactionPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}


				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				/*
				 * for (PermissionAction action :permissionActions) {
				 * Optional<RolePermissionAction> optionalAction
				 * =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
				 * action.getPermissionAsactionId(), roleId); ActionDto actionDto = new
				 * ActionDto(); actionDto.setActionName(action.getActionName());
				 * if(optionalAction.isPresent()) { actionDto.setSelected(true); } else {
				 * actionDto.setSelected(false); } dtos.add(actionDto); }
				 */
				for (PermissionAction action :permissionActions) {

					List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());
					if(permissionRequests.size()!=0) {
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						actionDto.setSelected(true);
						permission.setActions(dtos);
						permission.setActions(dtos);
					}else {
						Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						if(optionalAction.isPresent())
						{
							actionDto.setSelected(true);
						}
						else {
							actionDto.setSelected(false); } dtos.add(actionDto);
					}
					permission.setActions(dtos);
				}

				permission.setActions(dtos);
			}
			for (Permissions permission : reportPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				/*
				 * for (PermissionAction action :permissionActions) {
				 * Optional<RolePermissionAction> optionalAction
				 * =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
				 * action.getPermissionAsactionId(), roleId); ActionDto actionDto = new
				 * ActionDto(); actionDto.setActionName(action.getActionName());
				 * if(optionalAction.isPresent()) { actionDto.setSelected(true); } else {
				 * actionDto.setSelected(false); } dtos.add(actionDto); }
				 */
				for (PermissionAction action :permissionActions) {

					List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());
					if(permissionRequests.size()!=0) {
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						actionDto.setSelected(true);
						permission.setActions(dtos);
						permission.setActions(dtos);
					}else {
						Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						if(optionalAction.isPresent())
						{
							actionDto.setSelected(true);
						}
						else {
							actionDto.setSelected(false); } dtos.add(actionDto);
					}
					permission.setActions(dtos);
				}
				permission.setActions(dtos);





			}
			for (Permissions permission : dashboardPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//  continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				/*
				 * for (PermissionAction action :permissionActions) {
				 * Optional<RolePermissionAction> optionalAction
				 * =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
				 * action.getPermissionAsactionId(), roleId); ActionDto actionDto = new
				 * ActionDto(); actionDto.setActionName(action.getActionName());
				 * if(optionalAction.isPresent()) { actionDto.setSelected(true); } else {
				 * actionDto.setSelected(false); } dtos.add(actionDto); }
				 */
				for (PermissionAction action :permissionActions) {

					List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());
					if(permissionRequests.size()!=0) {
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						actionDto.setSelected(true);
						permission.setActions(dtos);
						permission.setActions(dtos);
					}else {
						Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						if(optionalAction.isPresent())
						{
							actionDto.setSelected(true);
						}
						else {
							actionDto.setSelected(false); } dtos.add(actionDto);
					}
					permission.setActions(dtos);
				}
				permission.setActions(dtos);
			}
			for (Permissions permission : configurationPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				/*
				 * for (PermissionAction action :permissionActions) {
				 * Optional<RolePermissionAction> optionalAction
				 * =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(
				 * action.getPermissionAsactionId(), roleId); ActionDto actionDto = new
				 * ActionDto(); actionDto.setActionName(action.getActionName());
				 * if(optionalAction.isPresent()) { actionDto.setSelected(true); } else {
				 * actionDto.setSelected(false); } dtos.add(actionDto); }
				 */
				for (PermissionAction action :permissionActions) {

					List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUserPermissionAndAction(userId,permission.getPermissionsId(),action.getActionName());
					if(permissionRequests.size()!=0) {
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						actionDto.setSelected(true);
						permission.setActions(dtos);
						permission.setActions(dtos);
					}else {
						Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
						ActionDto actionDto = new ActionDto();
						actionDto.setActionName(action.getActionName());
						if(optionalAction.isPresent())
						{
							actionDto.setSelected(true);
						}
						else {
							actionDto.setSelected(false); } dtos.add(actionDto);
					}
					permission.setActions(dtos);
				}
				permission.setActions(dtos);

			}

			/*
			 * List<PermissionRequest> permissionRequests=
			 * permissionRequestRepo.getApprovedPermissionRequestByUser(userId);
			 *
			 * List<Permissions> permissionsByUser= new ArrayList<Permissions>();
			 * Set<Permissions> permissions= new HashSet<Permissions>();
			 * for(PermissionRequest permissionRequest:permissionRequests) {
			 * permissions.add(permissionRequest.getPermissions());
			 *
			 * } for(Permissions permissions2:permissionsByUser) {
			 *
			 * List<PermissionRequest> permissionRequestsByPermision=
			 * permissionRequestRepo.getApprovedPermissionRequestByUserAndPermission(userId,
			 * permissions2.getPermissionsId()); Set<ActionDto> dtos = new HashSet<>();
			 *
			 * for(PermissionRequest request:permissionRequestsByPermision) { ActionDto
			 * actionDto = new ActionDto();
			 * actionDto.setActionName(request.getPermissionAction().getActionName());
			 * actionDto.setSelected(true); dtos.add(actionDto);
			 *
			 * } permissions2.setActions(dtos);
			 *
			 * if(permissions2.getCategory().equalsIgnoreCase("Master")) {
			 * if(!isNamePresent(masterPermission,permissions2.getPermissionsName())) {
			 * masterPermission.add(permissions2); }
			 *
			 *
			 * } if(permissions2.getCategory().equalsIgnoreCase("Transaction")) { //
			 * transactionPermission.add(permissions2);
			 * if(!isNamePresent(transactionPermission,permissions2.getPermissionsName())) {
			 * transactionPermission.add(permissions2); }
			 * System.out.println("Transaction "+isNamePresent(masterPermission,permissions2
			 * .getPermissionsName())+"     "+permissions2.getPermissionsName()); }
			 * if(permissions2.getCategory().equalsIgnoreCase("Report")) {
			 *
			 * if(!isNamePresent(reportPermission,permissions2.getPermissionsName())) {
			 * reportPermission.add(permissions2); } // reportPermission.add(permissions2);
			 * // System.out.println("Report "+isNamePresent(masterPermission,permissions2.
			 * getPermissionsName())+"     "+permissions2.getPermissionsName()); }
			 * if(permissions2.getCategory().equalsIgnoreCase("Dashboard")) {
			 * if(!isNamePresent(dashboardPermission,permissions2.getPermissionsName())) {
			 * dashboardPermission.add(permissions2); }
			 * dashboardPermission.add(permissions2);
			 * System.out.println("Dashboard"+isNamePresent(masterPermission,permissions2.
			 * getPermissionsName())+"     "+permissions2.getPermissionsName()); }
			 * if(permissions2.getCategory().equalsIgnoreCase("Configuration")) {
			 * configurationPermission.add(permissions2);
			 * if(!isNamePresent(configurationPermission,permissions2.getPermissionsName()))
			 * { configurationPermission.add(permissions2); }
			 *
			 * System.out.println("Configuration"+isNamePresent(masterPermission,
			 * permissions2.getPermissionsName())+"     "+permissions2.getPermissionsName())
			 * ; } //permissionsByUser.add(permissions2); }
			 *
			 *
			 *
			 */


			permissionsDTO.setDashboardPermission(dashboardPermission);
			permissionsDTO.setMasterPermission(masterPermission);
			permissionsDTO.setReportPermission(reportPermission);
			permissionsDTO.setTransactionPermission(transactionPermission);
			permissionsDTO.setConfigurationPermission(configurationPermission);
			//   permissionsDTO.setUserPermissions(permissionsByUser);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return permissionsDTO;
	}
	@GetMapping({"/getPermissionsAndActionByRole2"})
	@ResponseBody
	public PermissionsDTO getPermissionsAndActionByRole2(@RequestParam int roleId ,int userId) {
		PermissionsDTO permissionsDTO = new PermissionsDTO();
		try {
			List<Permissions> masterPermission = this.accessService.getPermissionsByCategory("Master");
			List<Permissions> transactionPermission = this.accessService.getPermissionsByCategory("Transaction");
			List<Permissions> reportPermission = this.accessService.getPermissionsByCategory("Report");
			List<Permissions> dashboardPermission = this.accessService.getPermissionsByCategory("Dashboard");
			List<Permissions> configurationPermission = this.accessService.getPermissionsByCategory("Configuration");

			System.out.println("MASTER " + masterPermission.size());
			System.out.println("TRANS  " + transactionPermission.size());
			System.out.println("REPORT " + reportPermission.size());
			System.out.println("Dashboard  " + dashboardPermission.size());
			System.out.println("Configuration " + configurationPermission.size());


			for (Permissions permission : masterPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				System.out.println("roleId " + roleId + " PERMo" + permission.getPermissionsId() + "  " + optional.isPresent());
				if (optional.isPresent()) {
					permission.setSelected(true);
				} else {
					permission.setSelected(false);
				}
				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}



			for (Permissions permission : transactionPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}


				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}
			for (Permissions permission : reportPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					// continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);





			}
			for (Permissions permission : dashboardPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//  continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);
			}
			for (Permissions permission : configurationPermission) {
				Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permission.getPermissionsId());
				if (optional.isPresent()) {
					permission.setSelected(true);
					//continue;
				} else {
					permission.setSelected(false);
				}

				List<PermissionAction> permissionActions = this.accessService.getPermissionActionBYPermissionId(permission.getPermissionsId());

				Set<ActionDto> dtos = new HashSet<>();
				for (PermissionAction action :permissionActions) {
					Optional<RolePermissionAction> optionalAction =this.rolePermissionActionRepo.getRolePermissionActionByRoleAndPermission(action.getPermissionAsactionId(), roleId);
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(action.getActionName());
					if(optionalAction.isPresent())
					{
						actionDto.setSelected(true);
					}
					else {
						actionDto.setSelected(false); } dtos.add(actionDto);
				}

				permission.setActions(dtos);

			}
			// int userId=1;
			List<PermissionRequest> permissionRequests= permissionRequestRepo.getApprovedPermissionRequestByUser(userId);

			List<Permissions> permissionsByUser= new ArrayList<Permissions>();
			Set<Permissions> permissions= new HashSet<Permissions>();
			for(PermissionRequest permissionRequest:permissionRequests) {
				permissions.add(permissionRequest.getPermissions());

			}
			for(Permissions permissions2:permissions) {

				List<PermissionRequest> permissionRequestsByPermision= permissionRequestRepo.getApprovedPermissionRequestByUserAndPermission(userId,permissions2.getPermissionsId());
				Set<ActionDto> dtos = new HashSet<>();

				for(PermissionRequest request:permissionRequestsByPermision) {
					ActionDto actionDto = new ActionDto();
					actionDto.setActionName(request.getPermissionAction().getActionName());
					actionDto.setSelected(true);
					dtos.add(actionDto);

				}
				permissions2.setActions(dtos);

				if(permissions2.getCategory().equalsIgnoreCase("Master")) {
					masterPermission.add(permissions2);
				}
				if(permissions2.getCategory().equalsIgnoreCase("Transaction")) {
					transactionPermission.add(permissions2);
				}
				if(permissions2.getCategory().equalsIgnoreCase("Report")) {
					reportPermission.add(permissions2);
				}
				if(permissions2.getCategory().equalsIgnoreCase("Dashboard")) {
					dashboardPermission.add(permissions2);
				}
				if(permissions2.getCategory().equalsIgnoreCase("Configuration")) {
					configurationPermission.add(permissions2);
				}
				//permissionsByUser.add(permissions2);
			}










			permissionsDTO.setDashboardPermission(dashboardPermission);
			permissionsDTO.setMasterPermission(masterPermission);
			permissionsDTO.setReportPermission(reportPermission);
			permissionsDTO.setTransactionPermission(transactionPermission);
			permissionsDTO.setConfigurationPermission(configurationPermission);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return permissionsDTO;
	}

	@GetMapping({"/getRoles"})
	@ResponseBody
	public List<Role> getRoles() {
		List<Role> list = new ArrayList<>();
		try {
			list = this.accessService.getAllRoles();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	@PutMapping("/edit/{id}")
	@ResponseBody
	public Role editRoleById(@PathVariable Long id, @RequestBody Role updatedRoleData) {
		return accessService.updateRoleById(id, updatedRoleData);
	}

	@DeleteMapping("/delete/{id}")
	@ResponseBody
	public String deleteRole(@PathVariable Long id) {
		try {
			accessService.deleteRole(id);
			return "Role deleted successfully";
		} catch (Exception e) {
			e.printStackTrace();
			return "Error deleting role";
		}
	}


	@GetMapping({"/getPermissionAction"})
	@ResponseBody
	public List<PermissionAction> getPermissionAction() {
		List<PermissionAction> list = new ArrayList<>();
		try {
			list = this.permissionActionRepo.findAll();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@PostMapping({"/addPermissionAction"})
	public ResponseEntity<ResponceObj> addPermissionAction(@RequestBody PermissionAction permissionAction) {
		ResponceObj responseDTO = new ResponceObj();
		try {
			List<PermissionAction> list=permissionActionRepo.getPermissionActionBYPermissionIdAndActionName1(permissionAction.getPermissions().getPermissionsId(), permissionAction.getActionName());

			if(list.size()!=0) {
				responseDTO.setCode(500);
				responseDTO.setMessage("Permission Action aleady exits");
			}else {
				this.permissionActionRepo.save(permissionAction);
				responseDTO.setCode(200);
				responseDTO.setMessage("Permission Action Added Success");
			}

			return new ResponseEntity(responseDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setCode(500);
			responseDTO.setMessage(e.getMessage());
			return new ResponseEntity(responseDTO, HttpStatus.ACCEPTED);
		}
	}

	@GetMapping({"/getRolesPermission"})
	@ResponseBody
	public List<RolePermissionDto> getRolesPermission() {
		List<RolePermissionDto> list = new ArrayList<>();
		try {
			List<Role> roles = this.userService.getAllRoles();
			List<Permissions> permissions = this.accessService.getAllPermission();
			System.out.println("PER " + permissions.size());
			for (Role role : roles) {
				RolePermissionDto rolePermissionDto = new RolePermissionDto();
				rolePermissionDto.setRole(role);
				List<PermissionDTO> dtos = new ArrayList<>();
				for (Permissions permission : permissions) {
					PermissionDTO permissionDTO = new PermissionDTO();
					permissionDTO.setPermissionName(permission.getPermissionsName());
					permissionDTO.setCategory(permission.getCategory());
					Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(
							(int) role.getRoleId(), (int) permission.getPermissionsId());
					if (optional.isPresent()) {
						permissionDTO.setPermissionAvailable(true);
					} else {
						permissionDTO.setPermissionAvailable(false);
					}
					permissionDTO.setEditTab(false);
					dtos.add(permissionDTO);
				}
				rolePermissionDto.setPermissions(dtos);
				list.add(rolePermissionDto);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}


	@GetMapping({"/getPermissionsByRole"})
	@ResponseBody
	public List<Permissions> getPermissionsByRole(@RequestParam int roleId) {
		List<Permissions> list = new ArrayList<>();
		try {
			List<RolePermission> rolepermissions = this.accessService.getPermissionsByRole(roleId);
			for (RolePermission rolePermission : rolepermissions)
				list.add(rolePermission.getPermissions());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@GetMapping({"/getDashboardPermissionsByRole"})
	@ResponseBody
	public DashboardPermissionsDTO getDashboardPermissionsByRole(@RequestParam int roleId) {
		DashboardPermissionsDTO dashboardPermissionsDTO = new DashboardPermissionsDTO();
		try {
			List<RolePermission> rolepermissions = this.accessService.getPermissionsByRoleAndCategory(roleId, "Dashboard");
			for (RolePermission rolePermission : rolepermissions) {
				if (rolePermission.getPermissions().getPermissionsName().equalsIgnoreCase("Overview"))
					dashboardPermissionsDTO.setOverview(true);
				if (rolePermission.getPermissions().getPermissionsName().equalsIgnoreCase("System"))
					dashboardPermissionsDTO.setSystem(true);
				if (rolePermission.getPermissions().getPermissionsName().equalsIgnoreCase("Install"))
					dashboardPermissionsDTO.setInstall(true);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return dashboardPermissionsDTO;
	}

	@PostMapping({"/saveRolePermission"})
	public ResponseEntity<ResponceObj> saveRolePermission(@RequestBody RolePermissionDto rolePermissions) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			Role role = rolePermissions.getRole();
			for (PermissionDTO permissions : rolePermissions.getPermissions()) {
				Optional<Permissions> optional = this.accessService.getPermissionsByName(permissions.getPermissionName());
				Optional<RolePermission> optional2 = this.accessService.getRolePermissionByRoleAndPermission(
						(int) role.getRoleId(), (int) optional.get().getPermissionsId());
				if (permissions.isPermissionAvailable()) {
					if (optional2.isEmpty()) {
						RolePermission rolepermission = new RolePermission();
						rolepermission.setPermissions(optional.get());
						rolepermission.setRole(role);
						this.accessService.saveRolePermission(rolepermission);
						for (int i = 1; i <= 5; i++) {
							PermissionAction action = new PermissionAction();
							action.setPermissions(rolepermission.getPermissions());
							switch (i) {
								case 1 -> {
									action.setActionName("Add");
									action.setAvailable(false);
									this.accessService.savePermissionAction(action);
								}
								case 2 -> {
									action.setActionName("Edit");
									action.setAvailable(false);
									this.accessService.savePermissionAction(action);
								}
								case 3 -> {
									action.setActionName("View");
									action.setAvailable(false);
									this.accessService.savePermissionAction(action);
								}
								case 4 -> {
									action.setActionName("Delete");
									action.setAvailable(false);
									this.accessService.savePermissionAction(action);
								}
								case 5 -> {
									action.setActionName("Upload");
									action.setAvailable(false);
									this.accessService.savePermissionAction(action);
								}
							}
						}
					}
					continue;
				}
				optional2.ifPresent(rolePermission -> this.accessService.deleteRolePermission(rolePermission));
			}
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		}
	}


	@PostMapping({"/addPermission"})
	public ResponseEntity<ResponceObj> addPermission(@RequestBody Permissions permissions) {
		ResponceObj responceDTO = new ResponceObj();
		permissions.setPermissionsName(permissions.getPermissionsName().trim());
		Optional<Permissions> optional = this.accessService.getPermissionsByName(permissions.getPermissionsName());
		try {
			//    Optional<Permissions> optional = this.accessService.getPermissionsByNameAndCategory(permissions.getCategory(), permissions.getPermissionsName());
			if(permissions.getPermissionsId()==0) {
				if(optional.isPresent()) {
					responceDTO.setCode(500);
					responceDTO.setMessage("Permission Name already Exits");
					System.out.println("permission EXITS.........................");
				}else {
					this.accessService.addPermission(permissions);
					responceDTO.setCode(200);
					responceDTO.setMessage("Permission  Added Successfully");
					System.out.println("permission Added.........................");
				}
			}else {
				if (optional.isPresent() && optional.get().getPermissionsId() != permissions.getPermissionsId()) {
					responceDTO.setCode(500);
					responceDTO.setMessage("Permission Name already Exits");
					System.out.println("permission EXITS.........................");
				} else {
					this.accessService.addPermission(permissions);
					responceDTO.setCode(200);
					responceDTO.setMessage("Permission  Updated Successfully");
					System.out.println("permission Updated.........................");
				}
			}
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			e.printStackTrace();
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@PostMapping({"/deletePermission"})
	public ResponseEntity<ResponceObj> deletePermission(@RequestBody Permissions permissions) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			Optional<Permissions> optional = null;
			System.out.println("Saving Permission " + permissions.getPermissionsName());
			if (optional.isPresent()) {
				responceDTO.setCode(500);
				responceDTO.setMessage("Permissions Are used someever so can not be deleted");
			} else {
				permissions.setActive(1);
				this.accessService.deletePermission(permissions);
				responceDTO.setCode(200);
				responceDTO.setMessage("Permissions Deleted Successfully");
			}
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@PostMapping({"/changeStatusPermission"})
	public ResponseEntity<ResponceObj> changeStatusPermission(@RequestBody Permissions permissions) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			if (permissions.getActive() == 1) {
				permissions.setActive(0);
			} else {
				permissions.setActive(1);
			}
			this.accessService.addPermission(permissions);
			responceDTO.setCode(200);
			responceDTO.setMessage("Status Changed Successfully");
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@PostMapping({"/changePassword"})
	public ResponseEntity<ResponceObj> changePassword(@RequestBody ChangePasswordDTO changePassword) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			Optional<UserInfo> optional=userService.getUserById1(changePassword.getUserId());
			if(optional.isPresent()) {
				UserInfo userInfo= optional.get();
				if(userInfo.getPassword().equalsIgnoreCase(changePassword.getCurrentPassword())) {
					userInfo.setPassword(changePassword.getNewPassword());
					userService.saveUser(userInfo);
					responceDTO.setCode(200);
					responceDTO.setMessage("Password Change Successfully");
				}else {
					responceDTO.setCode(500);
					responceDTO.setMessage("Current Password Is Invalid");
				}

			}


			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
	}


	@GetMapping({"/getPermissionsByPagination/{page_no}/{item_per_page}"})
	@ResponseBody
	public List<Permissions> getPermissionsByPagination(@PathVariable int page_no, @PathVariable int item_per_page) {
		List<Permissions> list = new ArrayList<>();
		try {
			list = this.accessService.getPermissionsByLimit(page_no, item_per_page);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@GetMapping({"/getPermissionsByPaginationAndSearch"})
	@ResponseBody
	public List<Permissions> getPermissionsByPaginationAndSearch(@RequestParam int page_no, @RequestParam int item_per_page, @RequestParam String search) {
		List<Permissions> list = new ArrayList<>();
		try {
			list = this.accessService.getPermissionsByLimitAndSearch(page_no, item_per_page, search);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@GetMapping({"/getAllPermissions"})
	@ResponseBody
	public List<Permissions> getAllPermissions() {
		List<Permissions> list = new ArrayList<>();
		try {
			list = this.accessService.getAllPermissions();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@GetMapping({"/getPermissionsCount"})
	@ResponseBody
	public int getPermissionsCount() {
		int count = 0;
		try {
			count = this.accessService.getPermissionsCount();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@GetMapping({"/getCategoryWisePermissionsCount"})
	@ResponseBody
	public CategoryPermissionCountDto getCategoryWisePermissionsCount() {
		CategoryPermissionCountDto categoryPermissionCountDto = new CategoryPermissionCountDto();
		int count = 0;
		try {
			int mastercount = this.accessService.getPermissionsCountByCategory("Master");
			int transactioncount = this.accessService.getPermissionsCountByCategory("Transaction");
			int reportcount = this.accessService.getPermissionsCountByCategory("Report");
			int dashbaoedcount = this.accessService.getPermissionsCountByCategory("Dashboard");
			categoryPermissionCountDto.setDashboardCount(dashbaoedcount);
			categoryPermissionCountDto.setReportCount(reportcount);
			categoryPermissionCountDto.setTransactionCount(transactioncount);
			categoryPermissionCountDto.setMasterCount(mastercount);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return categoryPermissionCountDto;
	}

	@GetMapping({"/getCategoryWiseTotalPermisions"})
	@ResponseBody
	public CategoryPermissionCountDto getCategoryWiseTotalPermisions() {
		CategoryPermissionCountDto categoryPermissionCountDto = new CategoryPermissionCountDto();
		int count = 0;
		try {
			int masterCount = this.accessService.getPermissionsMasterCategory("Master");
			int transactionCount = this.accessService.getPermissionsMasterCategory("Transaction");
			int reportCount = this.accessService.getPermissionsMasterCategory("Report");
			int dashboardCount = this.accessService.getPermissionsMasterCategory("Dashboard");
			categoryPermissionCountDto.setDashboardCount(dashboardCount);
			categoryPermissionCountDto.setReportCount(reportCount);
			categoryPermissionCountDto.setTransactionCount(transactionCount);
			categoryPermissionCountDto.setMasterCount(masterCount);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return categoryPermissionCountDto;
	}

	@GetMapping({"/getPermissionsCountBySearch/{search}"})
	@ResponseBody
	public int getPermissionsCountBySearch(@PathVariable String search) {
		int count = 0;
		try {
			count = this.accessService.getPermissionsCountBySearch(search);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@GetMapping({"/checkPermissionName"})
	@ResponseBody
	public ResponceObj checkPermissionName(@RequestParam String permissionName) {
		ResponceObj responceObj = new ResponceObj();
		try {
			Optional<Permissions> optional = this.accessService.getPermissionsByName(permissionName);
			if (optional.isPresent()) {
				responceObj.setCode(500);
				responceObj.setMessage("Permission name already Exit");
			} else {
				responceObj.setCode(200);
				responceObj.setMessage("Permission name is valid");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return responceObj;
	}

	@GetMapping({"/checkRoleName"})
	@ResponseBody
	public ResponceObj checkRoleName(@RequestParam String roleName) {
		ResponceObj responceObj = new ResponceObj();
		try {
			Optional<Role> optional = this.accessService.getRoleByName(roleName);
			if (optional.isPresent()) {
				responceObj.setCode(500);
				responceObj.setMessage("Role name already Exit");
			} else {
				responceObj.setCode(200);
				responceObj.setMessage("Role name is valid");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return responceObj;
	}

	@PostMapping({"/addRole"})
	public ResponseEntity<ResponceObj> addRole(@RequestBody Role role) {
		ResponceObj responceDTO = new ResponceObj();
		role.setRoleName(role.getRoleName().trim());
		Optional<Role> optional=accessService.getRoleByName(role.getRoleName());
		try {
			if(role.getRoleId()==0) {
				if(optional.isPresent()) {
					System.out.println("Exits....................");
					responceDTO.setCode(500);
					responceDTO.setMessage("Role Name is already Exits");
				}else {
					System.out.println("Added....................");
					this.accessService.addRole(role);
					responceDTO.setCode(200);
					responceDTO.setMessage("Role  is added Successfully");
				}
			}else {
				if (optional.isPresent() && optional.get().getRoleId() != role.getRoleId()){
					System.out.println("Exits....................");
					responceDTO.setCode(500);
					responceDTO.setMessage("Role Name is already Exits");
				}else{
					System.out.println("updated....................");
					this.accessService.addRole(role);
					responceDTO.setCode(200);
					responceDTO.setMessage("Role  is updated Successfully");
				}
			}

			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			e.printStackTrace();
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@GetMapping({"/getPermisssionActionByRoleAndPermission"})
	@ResponseBody
	public List<PermissionAction>  getPermisssionActionByRoleAndPermission(@RequestParam int roleId, @RequestParam int permissionsId) {
		List<PermissionAction>  permissionActions = new ArrayList<PermissionAction> ();
		try {
			Optional<RolePermission> optional = this.accessService.getRolePermissionByRoleAndPermission(roleId, permissionsId);
			permissionActions=permissionActionRepo.getPermissionActionBYPermissionId(permissionsId) ;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return permissionActions;
	}

	@PostMapping({"/updatePermissionAction"})
	public ResponseEntity<ResponceObj> updatePermissionAction(@RequestBody PermissionAction permissionAction) {
		ResponceObj responceDTO = new ResponceObj();
		try {
			this.accessService.savePermissionAction(permissionAction);
			return new ResponseEntity(responceDTO, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			e.printStackTrace();
			responceDTO.setCode(500);
			responceDTO.setMessage(e.getMessage());
			return new ResponseEntity<>(responceDTO, HttpStatus.ACCEPTED);
		}
	}

	@GetMapping("/categories")
	public ResponseEntity<Object> getUniqueCategories() {
		List<String> categories = accessService.findDistinctCategories();
		return ResponseGenerator.generateResponse("Fetched unique categories", HttpStatus.OK, categories);
	}


	@GetMapping("/permissionsByRoleAndCategory/{roleId}")
	public ResponseEntity<Object> getPermissionsList(@PathVariable int roleId, @RequestParam String category) {
		List<RolePermission> rolepermissions = accessService.getPermissionsByRoleAndCategory(roleId, category);
		return ResponseGenerator.generateResponse("Fetched unique categories", HttpStatus.OK, rolepermissions);
	}

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

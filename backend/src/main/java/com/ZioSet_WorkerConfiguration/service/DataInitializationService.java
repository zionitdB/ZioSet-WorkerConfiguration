package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.constants.PermissionsConstants;
import com.ZioSet_WorkerConfiguration.dto.AddUserDTO;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.repo.UserRepo;
import com.ZioSet_WorkerConfiguration.rolepermission.model.PermissionBackend;
import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.PermissionBackendRepository;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.RoleRepo;
import com.ZioSet_WorkerConfiguration.rolepermission.service.UserServicesZioSet;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Service
public class DataInitializationService {

    private final PermissionBackendRepository permissionRepository;
    private final RoleRepo roleRepository;
    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserServicesZioSet userService;

    @Transactional
    @PostConstruct
    public void initializeDefaultData() {
        log.info("Initializing default data...");

        // Create default permissions
        createDefaultPermissions();

        log.info("Default data initialization completed");
    }

    private void createDefaultPermissions() {
        String[] defaultPermissions = {
                PermissionsConstants.VIEW_SCRIPT_TEMPLATE, PermissionsConstants.DELETE_SCRIPT_TEMPLATE, PermissionsConstants.CREATE_SCRIPT_TEMPLATE
                ,PermissionsConstants.DELETE_SCRIPT_TEMPLATE,PermissionsConstants.CREATE_SCRIPT,PermissionsConstants.DELETE_SCRIPT
                ,PermissionsConstants.EDIT_SCRIPT,PermissionsConstants.VIEW_SCRIPT
        };

        for (String permissionName : defaultPermissions) {
            if (!permissionRepository.existsByName(permissionName)) {
                PermissionBackend permission = PermissionBackend.builder()
                        .name(permissionName)
                        .build();
                permissionRepository.save(permission);
                log.info("Created permission: {}", permissionName);
            }
        }
        createSuperAdminRole();
        createSuperAdminUser();
    }

    private void createSuperAdminRole() {

        if (!roleRepository.existsByRoleName("SUPER_ADMIN")) {
            Set<PermissionBackend> allPermissions = new HashSet<>(permissionRepository.findAll());

            Role superAdminRole = new Role("SUPER_ADMIN",1,allPermissions);
            roleRepository.save(superAdminRole);
            log.info("Created SUPER_ADMIN role with all permissions ");
        }
    }

    private void createSuperAdminUser() {
        String superAdminEmail = "superadmin@zionit.in";
        String superAdminPassword = "12345";
        String userName = "superadmin";

        if (!userRepository.existsByEmail(superAdminEmail)) {
            Role role = roleRepository.getRoleByName("SUPER_ADMIN")
                    .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));

            AddUserDTO userDTO = AddUserDTO.builder()
                    .email(superAdminEmail).active(1)
                    .username(userName).password(superAdminPassword)
                    .firstName("superadmin")
                    .roleIds(List.of(role.getRoleId())).lastName(null).build();

            userService.saveUser(userDTO);
            log.info("Created super admin user with email: {}", superAdminEmail);
        }
    }


}

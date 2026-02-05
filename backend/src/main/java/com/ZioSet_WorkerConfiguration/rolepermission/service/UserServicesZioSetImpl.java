package com.ZioSet_WorkerConfiguration.rolepermission.service;


import com.ZioSet_WorkerConfiguration.dto.AddUserDTO;
import com.ZioSet_WorkerConfiguration.dto.AdminChangePasswordDTO;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.repo.UserRepo;
import com.ZioSet_WorkerConfiguration.rolepermission.dto.UserDto;
import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.RoleRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServicesZioSetImpl implements UserServicesZioSet {
    @Autowired
    UserRepo userRepo;

    @Autowired
    RoleRepo roleRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String generateRandomCode() {
        int digits = 4;
        Random random = new Random();
        StringBuilder codeBuilder = new StringBuilder();
        for (int i = 0; i < digits; i++) {
            int digit = random.nextInt(10);
            codeBuilder.append(digit);
        }
        return codeBuilder.toString();
    }


    @Override
    public UserInfo getUserById(int userId) {
        Optional<UserInfo> list = this.userRepo.findById(Integer.valueOf(userId));
        return list.isPresent() ? list.get() : null;
    }

    @Override
    public UserInfo saveUser(AddUserDTO dto) {

        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new RuntimeException("Username is required");
        }

        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepo.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepo.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        Set<Role> roles = dto.getRoleIds().stream()
                .map(roleId -> roleRepo.findById(roleId)
                        .orElseThrow(() -> new RuntimeException("Invalid role id: " + roleId)))
                .collect(Collectors.toSet());

        UserInfo user = new UserInfo();
        user.setUsername(dto.getUsername());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setActive(dto.getActive());
        user.setRoles(roles);

        // Encrypt password
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return userRepo.save(user);
    }

    @Override
    public UserInfo updateUser(UserInfo userInfo) {

        UserInfo dbUser = userRepo.findById(userInfo.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!dbUser.getUsername().equals(userInfo.getUsername()) &&
                userRepo.existsByUsername(userInfo.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (!dbUser.getEmail().equals(userInfo.getEmail()) &&
                userRepo.existsByEmail(userInfo.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // update allowed fields
        dbUser.setUsername(userInfo.getUsername());
        dbUser.setFirstName(userInfo.getFirstName());
        dbUser.setLastName(userInfo.getLastName());
        dbUser.setEmail(userInfo.getEmail());
        dbUser.setActive(userInfo.getActive());
        dbUser.setRoles(userInfo.getRoles());
        return userRepo.save(dbUser);
    }

    public void adminChangePassword(AdminChangePasswordDTO dto) {

        if (dto.getNewPassword() == null || dto.getNewPassword().isBlank()) {
            throw new RuntimeException("New password is required");
        }

        UserInfo user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }


    @Override
    public List<UserInfo> getAllUsers() {
        return this.userRepo.findAll();
    }

    @Override
    public List<Role> getAllRoles() {
        return this.roleRepo.findAll();
    }

    @Override
    public void deleteUser(Integer id) {
        UserInfo userInfo = userRepo.findById(id).orElseThrow(()-> new RuntimeException("User not found."));
        this.userRepo.delete(userInfo);
    }

    @Override
    public List<UserInfo> getUserByLimit(int page_no, int item_per_page) {
        return this.userRepo.getUserByLimit(page_no, item_per_page);
    }

    @Override
    public List<UserInfo> getUserByLimitAndSearch(String searchText, int pageNo, int perPage) {
        return this.userRepo.getUserByLimitAndSearch(searchText, pageNo, perPage);
    }

    @Override
    public int getUserCountAndSearch(String searchText) {
        return this.userRepo.getUserCountAndSearch(searchText);
    }

    @Override
    public int getUserCount() {
        return this.userRepo.getUserCount();
    }

    @Override
    public Optional<UserInfo> getUserByUserName(String userName) {
        return this.userRepo.getUsersByUsername(userName);
    }

    public UserDto loginWithOutOTP(UserInfo user) {
        UserDto dto = new UserDto();
        Optional<UserInfo> list = this.getUserByUserName(user.getUsername());
        System.out.println("SIZE " + list.isPresent());
        if (list.isPresent()) {
            UserInfo info = list.get();
            if (info.getPassword().equals(user.getPassword())) {
                dto.setCode(200);
                dto.setMassage("Sucessfully");
                dto.setData(info);
            } else {
                dto.setCode(500);
                dto.setMassage("Password Invalid");
            }
        } else {
            dto.setCode(500);
            dto.setMassage("User name Invalid");
        }
        return dto;
    }

    @Override
    public List<UserInfo> getUserBySpecificSearch(String searchText, String columns, int pageNo, int perPage) {
        return this.userRepo.getUserBySpecificSearch(searchText, columns, pageNo, perPage);
    }

    @Override
    public int getUserCountBySpecificSearch(String searchText, String columns) {
        return this.userRepo.getUserCountBySpecificSearch(searchText, columns);
    }

    @Override
    public UserInfo addUser(UserInfo userInfo) {
        return (UserInfo) this.userRepo.save(userInfo);
    }

    @Override
    public List<UserInfo> getUserInfoByLimit(int page_no, int item_per_page) {
        return this.userRepo.getUserByLimit(page_no, item_per_page);
    }

    public int getUserInfoCount() {
        return this.userRepo.getUserCount();
    }

    @Override
    public List<UserInfo> getUserInfoByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return this.userRepo.getUserInfoByLimitAndGroupSearch(groupSearchDTO);
    }

    @Override
    public int getUserInfoCountByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO) {
        return this.userRepo.getUserInfoCountByLimitAndGroupSearch(groupSearchDTO);
    }

    @Override
    public Optional<UserInfo> getUserById1(int userId) {
        return userRepo.findById(userId);
    }
}

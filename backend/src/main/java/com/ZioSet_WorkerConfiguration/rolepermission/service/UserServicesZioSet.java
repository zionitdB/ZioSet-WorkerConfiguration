package com.ZioSet_WorkerConfiguration.rolepermission.service;


import com.ZioSet_WorkerConfiguration.dto.AddUserDTO;
import com.ZioSet_WorkerConfiguration.dto.AdminChangePasswordDTO;
import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.UserInfo;
import com.ZioSet_WorkerConfiguration.rolepermission.dto.UserDto;
import com.ZioSet_WorkerConfiguration.rolepermission.model.Role;

import java.util.List;
import java.util.Optional;

public interface UserServicesZioSet {
    UserInfo getUserById(int paramInt);

    UserInfo saveUser(AddUserDTO paramUserInfo);

    UserInfo updateUser(UserInfo paramUserInfo);

    void adminChangePassword(AdminChangePasswordDTO dto);

    List<UserInfo> getAllUsers();

    List<Role> getAllRoles();

    void deleteUser(Integer id);

    List<UserInfo> getUserByLimit(int paramInt1, int paramInt2);

    List<UserInfo> getUserByLimitAndSearch(String paramString, int paramInt1, int paramInt2);

    int getUserCountAndSearch(String paramString);

    int getUserCount();

    Optional<UserInfo> getUserByUserName(String paramString);

    String generateRandomCode();

    UserDto loginWithOutOTP(UserInfo paramUserInfo);

    List<UserInfo> getUserBySpecificSearch(String paramString1, String paramString2, int paramInt1, int paramInt2);

    int getUserCountBySpecificSearch(String paramString1, String paramString2);

    UserInfo addUser(UserInfo paramUserInfo);

    List<UserInfo> getUserInfoByLimit(int paramInt1, int paramInt2);

    int getUserInfoCount();

    List<UserInfo> getUserInfoByLimitAndGroupSearch(GroupSearchDTO paramGroupSearchDTO);

    int getUserInfoCountByLimitAndGroupSearch(GroupSearchDTO paramGroupSearchDTO);

    Optional<UserInfo> getUserById1(int userId);
}


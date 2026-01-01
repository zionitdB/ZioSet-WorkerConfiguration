package com.ZioSet_WorkerConfiguration.rolepermission.repository;


import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.UserInfo;

import java.util.List;

public interface UserCustomRepo {
    List<UserInfo> getUserByLimit(int paramInt1, int paramInt2);

    List<UserInfo> getUserByLimitAndSearch(String paramString, int paramInt1, int paramInt2);

    int getUserCountAndSearch(String paramString);

    int getUserCount();

    List<UserInfo> getUserBySpecificSearch(String paramString1, String paramString2, int paramInt1, int paramInt2);

    int getUserCountBySpecificSearch(String paramString1, String paramString2);

    List<UserInfo> getUserInfoByLimitAndGroupSearch(GroupSearchDTO paramGroupSearchDTO);

    int getUserInfoCountByLimitAndGroupSearch(GroupSearchDTO paramGroupSearchDTO);
}

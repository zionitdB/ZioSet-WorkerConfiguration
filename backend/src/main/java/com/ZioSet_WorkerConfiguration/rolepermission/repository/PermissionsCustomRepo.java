package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Permissions;

import java.util.List;

public interface PermissionsCustomRepo {
    List<Permissions> getPermissionsLimit(int paramInt1, int paramInt2);

    List<Permissions> getPermissionsLimitAndSearch(int paramInt1, int paramInt2, String paramString);

//    int getPermissionsCount();

   // int getPermissionsCountSearch(String paramString);
}


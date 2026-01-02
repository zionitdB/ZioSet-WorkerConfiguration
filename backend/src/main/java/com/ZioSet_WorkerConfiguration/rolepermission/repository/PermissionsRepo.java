package com.ZioSet_WorkerConfiguration.rolepermission.repository;

import com.ZioSet_WorkerConfiguration.rolepermission.model.Permissions;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PermissionsRepo extends JpaRepository<Permissions, Integer> {
    @Query("From Permissions p where trim(p.permissionsName)=?1")
    Optional<Permissions> getPermissionsByName(String paramString);

    @Query("From Permissions p where p.category=?1 and p.permissionsName=?2")
    Optional<Permissions> getPermissionsByNameAndCategory(String paramString1, String paramString2);


    @Query("From Permissions p where p.category=?1 and p.permissionsName=?2 and p.module.moduleId = ?3")
    Optional<Permissions> getPermissionsByNameAndCategoryAndModuleId(String paramString1, String paramString2, Integer moduleId);

    @Query("From Permissions p where p.category=?1")
    List<Permissions> getPermissionByCategory(String paramString);

    @Query("select count(p) From Permissions p where p.category=?1")
    int getPermissionsMasterCategory(String paramString);

    @Query("From Permissions p where p.category=?1")
    List<Permissions> getPermissionsByCategory(String paramString);


    @Query("From Permissions p where p.category=?1 AND p.module.moduleName = ?2")
    List<Permissions> getPermissionsByCategoryAndModuleName(String paramString1, String paramString2);

    @Query("SELECT DISTINCT p.category FROM Permissions p")
    List<String> findDistinctCategories();
    @Query("select count(p) From Permissions p where p.permissionsName=?1")
    int getPermissionsCountSearch(String search);
    @Query("From Permissions p where trim(p.permissionsName)=?1")
    List<Permissions> getPermissionsByNameAndPageLim(Pageable pageable, String search);

    @Query("""
        SELECT DISTINCT p
        FROM Permissions p
        LEFT JOIN FETCH p.module
        WHERE p.active = 1
        """)
    List<Permissions> findAllActivePermissions();
}

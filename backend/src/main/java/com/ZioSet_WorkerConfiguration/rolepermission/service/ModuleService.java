package com.ZioSet_WorkerConfiguration.rolepermission.service;

import com.ZioSet_WorkerConfiguration.rolepermission.model.ModulePermission;
import com.ZioSet_WorkerConfiguration.rolepermission.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModulePermission addModule(ModulePermission module){
        if (!moduleRepository.existsByModuleName(module.getModuleName())) {
            return moduleRepository.save(module);
        }
        throw new RuntimeException("Module Name already present.");
    }

    public List<ModulePermission> getAll(){
        return moduleRepository.findAll();
    }
}

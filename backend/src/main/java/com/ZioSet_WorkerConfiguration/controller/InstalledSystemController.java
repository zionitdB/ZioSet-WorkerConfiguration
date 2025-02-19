package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.repo.InstalledSystemRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/installed-systems")
public class InstalledSystemController {
    private final InstalledSystemRepository repository;

    public InstalledSystemController(InstalledSystemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/get-all-list")
    public List<InstalledSystemEntity> getAllList(){
        return repository.findAll();
    }

    @GetMapping("/get-installed-systems-list")
    public List<InstalledSystemEntity> getInstalledSystemsList(){
        return repository.findAll().stream().filter(InstalledSystemEntity::isInstalled).collect(Collectors.toList());
    }

    @GetMapping("/get-not-installed-systems-list")
    public List<InstalledSystemEntity> getNotInstalledSystemsList(){
        return repository.findAll().stream().filter((e) -> !e.isInstalled()).collect(Collectors.toList());
    }

    @GetMapping("delete-by-system-serial-number")
    public ResponceObj deleteBySystemSerialNumber(String serialNumber){
        ResponceObj status = new ResponceObj();
        try{
            Optional<InstalledSystemEntity> systemEntityOp = repository.findBySystemSerialNo(serialNumber);
            if (systemEntityOp.isEmpty()){
                status.setCode(400);
                status.setMessage("System not found");
            }else{
                repository.delete(systemEntityOp.get());
                status.setCode(200);
                status.setMessage("Deleted successfully");
            }

        } catch(Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }

        return status;
    }
}

package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.repo.MACInstalledSystemRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/mac-installed-systems")
public class MACInstalledSystemController {
    private final MACInstalledSystemRepository repository;

    public MACInstalledSystemController(MACInstalledSystemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/get-all-list")
    public List<MACInstalledSystemEntity> getAllList() {
        return repository.findAll();
    }

    @GetMapping("/get-installed-systems-list")
    public List<MACInstalledSystemEntity> getInstalledSystemsList() {
        return repository.findAll().stream().filter(MACInstalledSystemEntity::isInstalled).collect(Collectors.toList());
    }

    @GetMapping("/get-not-installed-systems-list")
    public List<MACInstalledSystemEntity> getNotInstalledSystemsList() {
        return repository.findAll().stream().filter((e) -> !e.isInstalled()).collect(Collectors.toList());
    }

    @GetMapping("delete-by-system-serial-number")
    public ResponceObj deleteBySystemSerialNumber(String serialNumber) {
        ResponceObj status = new ResponceObj();
        try {
            Optional<MACInstalledSystemEntity> systemEntityOp = repository.findBySystemSerialNo(serialNumber);
            if (systemEntityOp.isEmpty()) {
                status.setCode(400);
                status.setMessage("System not found");
            } else {
                repository.delete(systemEntityOp.get());
                status.setCode(200);
                status.setMessage("Deleted successfully");
            }

        } catch (Exception e) {
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }

        return status;
    }
}

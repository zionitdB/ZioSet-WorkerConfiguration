package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.LinuxInstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.repo.LinuxInstalledSystemRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/linux-installed-systems")
public class LinuxInstalledSystemController {
    private final LinuxInstalledSystemRepository repository;

    public LinuxInstalledSystemController(LinuxInstalledSystemRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/get-all-list")
    public List<LinuxInstalledSystemEntity> getAllList() {
        return repository.findAll();
    }

    @GetMapping("/get-installed-systems-list")
    public List<LinuxInstalledSystemEntity> getInstalledSystemsList() {
        return repository.findAll().stream().filter(LinuxInstalledSystemEntity::isInstalled).collect(Collectors.toList());
    }

    @GetMapping("/get-not-installed-systems-list")
    public List<LinuxInstalledSystemEntity> getNotInstalledSystemsList() {
        return repository.findAll().stream().filter((e) -> !e.isInstalled()).collect(Collectors.toList());
    }

    @GetMapping("delete-by-system-serial-number")
    public ResponceObj deleteBySystemSerialNumber(String serialNumber) {
        ResponceObj status = new ResponceObj();
        try {
            Optional<LinuxInstalledSystemEntity> systemEntityOp = repository.findBySystemSerialNo(serialNumber);
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

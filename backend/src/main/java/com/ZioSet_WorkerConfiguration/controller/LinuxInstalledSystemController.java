package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.MultipleSerialNumberDto;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.LinuxInstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.repo.LinuxInstalledSystemRepo;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import com.ZioSet_WorkerConfiguration.utils.SerialNumberExcelParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/linux-installed-systems")
public class LinuxInstalledSystemController {
    private final LinuxInstalledSystemRepo repository;

    public LinuxInstalledSystemController(LinuxInstalledSystemRepo repository) {
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

    @GetMapping("/count")
    public ResponseEntity<Object> getAllCount() {
        var count= repository.count();
        return ResponseGenerator.generateResponse("Count", HttpStatus.OK,count);
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

    @PostMapping("/delete-multiple-using-excel")
    public ResponceObj deleteMultipleUsingExcel(@RequestParam("file") MultipartFile file, @RequestParam("deletedById") String deletedById){
        ResponceObj status = new ResponceObj();
        try{
            SerialNumberExcelParser serialNumberExcelParser = new SerialNumberExcelParser(file);
            List<String> serialNumbers = serialNumberExcelParser.getSystemSerialNumbersList();

            List<LinuxInstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers);
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No linux systems found");
            }else{
                repository.deleteAll(systemEntities);
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


    @PostMapping("/delete-multiple-serial_numbers")
    public ResponceObj deleteMultipleSerialNumbers(@RequestBody MultipleSerialNumberDto serialNumbers){
        ResponceObj status = new ResponceObj();
        try{
            List<LinuxInstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers.getSerialNumbers());
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No linux systems found");
            }else{
                repository.deleteAll(systemEntities);
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

    @PostMapping({"/getAllLinuxInstalledSystemEntityByLimitAndGroupSearch"})
    public List<LinuxInstalledSystemEntity> getAllLinuxInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<LinuxInstalledSystemEntity> list = new ArrayList<>();
        try {
            list = this.repository.getAllLinuxInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllLinuxInstalledSystemEntityByLimitAndGroupSearch"})
    public int getCountAllLinuxInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.repository.getCountAllLinuxInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getLinuxInstalledSystemEntityByLimit"})
    public List<LinuxInstalledSystemEntity> getInstalledSystemEntityByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<LinuxInstalledSystemEntity> list = new ArrayList<>();
        try {
            list = this.repository.getLinuxInstalledSystemByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

}

package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.MultipleSerialNumberDto;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.DeletedSystems;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.model.SystemOs;
import com.ZioSet_WorkerConfiguration.repo.MACInstalledSystemRepository;
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

    @GetMapping("/count")
    public ResponseEntity<Object> getAllCount() {
        var count= repository.count();
        return ResponseGenerator.generateResponse("Count", HttpStatus.OK,count);
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

    @PostMapping("/delete-multiple-using-excel")
    public ResponceObj deleteMultipleUsingExcel(@RequestParam("file") MultipartFile file, @RequestParam("deletedById") String deletedById){
        ResponceObj status = new ResponceObj();
        try{
            SerialNumberExcelParser serialNumberExcelParser = new SerialNumberExcelParser(file);
            List<String> serialNumbers = serialNumberExcelParser.getSystemSerialNumbersList();

            List<MACInstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers);
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No mac systems found");
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
            List<MACInstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers.getSerialNumbers());
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No mac systems found");
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

    @PostMapping({"/getAllMACInstalledSystemEntityByLimitAndGroupSearch"})
    public List<MACInstalledSystemEntity> getAllMACInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<MACInstalledSystemEntity> list = new ArrayList<>();
        try {
            list = this.repository.getAllMACInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllMACInstalledSystemEntityByLimitAndGroupSearch"})
    public int getCountAllMacInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.repository.getCountAllMACInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getMACInstalledSystemEntityByLimit"})
    public List<MACInstalledSystemEntity> getInstalledSystemEntityByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<MACInstalledSystemEntity> list = new ArrayList<>();
        try {
            list = this.repository.getMACInstalledSystemByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }





}

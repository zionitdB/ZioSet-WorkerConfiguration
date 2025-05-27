package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.MultipleSerialNumberDto;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.DeletedSystems;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.model.SystemOs;
import com.ZioSet_WorkerConfiguration.repo.DeletedSystemsRepo;
import com.ZioSet_WorkerConfiguration.repo.InstalledSystemRepository;
import com.ZioSet_WorkerConfiguration.utils.SerialNumberExcelParser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/installed-systems")
public class InstalledSystemController {
    private final InstalledSystemRepository repository;
    private final DeletedSystemsRepo deletedSystemsRepo;

    public InstalledSystemController(InstalledSystemRepository repository, DeletedSystemsRepo deletedSystemsRepo) {
        this.repository = repository;
        this.deletedSystemsRepo = deletedSystemsRepo;
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
    public ResponceObj deleteBySystemSerialNumber(String serialNumber, String deletedById){
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

                saveDeletedSystem(systemEntityOp.get(), deletedById);
            }

        } catch(Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }

        return status;
    }

    @PostMapping("delete-multiple-serial_numbers")
    public ResponceObj deleteMultipleSerialNumbers(@RequestBody MultipleSerialNumberDto serialNumbers){
        ResponceObj status = new ResponceObj();
        try{
            List<InstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers.getSerialNumbers());
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No systems found");
            }else{
                repository.deleteAll(systemEntities);
                status.setCode(200);
                status.setMessage("Deleted successfully");

                for (InstalledSystemEntity systemEntity : systemEntities) {
                    saveDeletedSystem(systemEntity, serialNumbers.getDeletedById());
                }
            }

        } catch(Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }

        return status;
    }

    @PostMapping("delete-multiple-using-excel")
    public ResponceObj deleteMultipleUsingExcel(@RequestParam("file") MultipartFile file, @RequestParam("deletedById") String deletedById){
        ResponceObj status = new ResponceObj();
        try{
            SerialNumberExcelParser serialNumberExcelParser = new SerialNumberExcelParser(file);
            List<String> serialNumbers = serialNumberExcelParser.getSystemSerialNumbersList();

            List<InstalledSystemEntity> systemEntities = repository.findAllBySystemSerialNoIn(serialNumbers);
            if (systemEntities.isEmpty()){
                status.setCode(400);
                status.setMessage("No systems found");
            }else{
                repository.deleteAll(systemEntities);
                status.setCode(200);
                status.setMessage("Deleted successfully");

                for (InstalledSystemEntity systemEntity : systemEntities) {
                    saveDeletedSystem(systemEntity, deletedById);
                }
            }

        } catch(Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }

        return status;
    }

    private void saveDeletedSystem(InstalledSystemEntity systemEntity, String deletedById){
        try{
            DeletedSystems deletedSystem = new DeletedSystems();
            deletedSystem.setSystemSerialNumber(systemEntity.getSystemSerialNo());
            deletedSystem.setSystemOs(SystemOs.WINDOWS);
            deletedSystem.setDeletedById(deletedById);

            deletedSystemsRepo.save(deletedSystem);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

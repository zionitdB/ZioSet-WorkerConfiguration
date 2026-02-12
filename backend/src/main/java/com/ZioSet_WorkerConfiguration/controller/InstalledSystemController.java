package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.dto.MultipleSerialNumberDto;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.DeletedSystems;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.model.SystemOs;
import com.ZioSet_WorkerConfiguration.repo.DeletedSystemsRepo;
import com.ZioSet_WorkerConfiguration.repo.InstalledSystemRepo;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import com.ZioSet_WorkerConfiguration.utils.SerialNumberExcelParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/installed-systems")
public class InstalledSystemController {
    private final InstalledSystemRepo repository;
    private final DeletedSystemsRepo deletedSystemsRepo;

    public InstalledSystemController(InstalledSystemRepo repository, DeletedSystemsRepo deletedSystemsRepo) {
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

    @GetMapping("/count")
    public ResponseEntity<Object> getAllAssetsCount() {
        var count= repository.count();
        return ResponseGenerator.generateResponse("Count", HttpStatus.OK, count);
    }

    @GetMapping("/get-installed-systems-by-date-range")
    public List<InstalledSystemEntity> getInstalledSystemsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {

        // Parse as LocalDate
        LocalDate startLocalDate = LocalDate.parse(startDate);
        LocalDate endLocalDate = LocalDate.parse(endDate);

        // Convert to LocalDateTime
        LocalDateTime startDateTime = startLocalDate.atStartOfDay();
        LocalDateTime endDateTime = endLocalDate.atTime(LocalTime.MAX);

        return repository.findByInstalledAtBetweenAndInstalledIsTrue(startDateTime, endDateTime);
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

    @PostMapping({"/getAllInstalledSystemEntityByLimitAndGroupSearch"})
    @ResponseBody
    public List<InstalledSystemEntity> getAllInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<InstalledSystemEntity> list = new ArrayList<>();
        try {
            list = this.repository.getAllInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllInstalledSystemEntityByLimitAndGroupSearch"})
    @ResponseBody
    public int getCountAllInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.repository.getCountAllInstalledSystemByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getInstalledSystemEntityByLimit"})
    @ResponseBody
    public List<InstalledSystemEntity> getInstalledSystemEntityByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<InstalledSystemEntity> list = new ArrayList<InstalledSystemEntity>();
        try {
            list = this.repository.getInstalledSystemByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


}

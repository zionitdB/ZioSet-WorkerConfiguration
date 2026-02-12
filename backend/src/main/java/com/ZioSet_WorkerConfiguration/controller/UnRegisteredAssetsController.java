package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import com.ZioSet_WorkerConfiguration.model.UnRegisteredAssets;
import com.ZioSet_WorkerConfiguration.repo.UnRegisteredAssetsRepository;
import com.ZioSet_WorkerConfiguration.utils.ResponseGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/unregistered-assets")
@CrossOrigin(origins = "*")
class UnRegisteredAssetsController {

    private final UnRegisteredAssetsRepository unregisteredAssetsRepo;

    UnRegisteredAssetsController(UnRegisteredAssetsRepository unregisteredAssetsRepo) {
        this.unregisteredAssetsRepo = unregisteredAssetsRepo;
    }

    @GetMapping("/get-all-list")
    public ResponseEntity<List<UnRegisteredAssets>> getAllAssets() {
        var list= unregisteredAssetsRepo.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/count")
    public ResponseEntity<Object> getAllAssetsCount() {
        var count= unregisteredAssetsRepo.count();
        return ResponseGenerator.generateResponse("Count", HttpStatus.OK,count);
    }

    @DeleteMapping("/delete-by-system-serial-number")
    public ResponseEntity<Void> deleteById(@RequestParam String serialNumber) {
        unregisteredAssetsRepo.deleteBySystemSerialNumber(serialNumber);
        return ResponseEntity.ok().build();
    }

    @PostMapping({"/getAllUnRegisteredAssetsByLimitAndGroupSearch"})
    @ResponseBody
    public List<UnRegisteredAssets> getAllInstalledSystemEntityByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        List<UnRegisteredAssets> list = new ArrayList<>();
        try {
            list = this.unregisteredAssetsRepo.getAllUnRegisteredAssetsByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @PostMapping({"/getCountAllUnRegisteredAssetsByLimitAndGroupSearch"})
    @ResponseBody
    public int getCountAllUnRegisteredAssetsByLimitAndGroupSearch(@RequestBody GroupSearchDTO groupSearchDTO) {
        int count = 0;
        try {
            count = this.unregisteredAssetsRepo.getCountAllUnRegisteredAssetsByLimitAndGroupSearch(groupSearchDTO);
            boolean bool = false;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return count;
    }

    @GetMapping({"/getUnRegisteredAssetsByLimit"})
    @ResponseBody
    public List<UnRegisteredAssets> getInstalledSystemEntityByLimit(@RequestParam int pageNo, @RequestParam int perPage) {
        List<UnRegisteredAssets> list = new ArrayList<UnRegisteredAssets>();
        try {
            list = this.unregisteredAssetsRepo.getUnRegisteredAssetsByLimit(pageNo, perPage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


}

package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.model.UnRegisteredAssets;
import com.ZioSet_WorkerConfiguration.repo.UnRegisteredAssetsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/delete-by-system-serial-number")
    public ResponseEntity<Void> deleteById(@RequestParam String serialNumber) {
        unregisteredAssetsRepo.deleteBySystemSerialNumber(serialNumber);
        return ResponseEntity.ok().build();
    }
}

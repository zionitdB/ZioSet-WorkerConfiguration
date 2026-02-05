package com.ZioSet_WorkerConfiguration.scheduler;


import com.ZioSet_WorkerConfiguration.service.AssetSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssetDataSyncScheduler {

    private final AssetSyncService assetSyncService;

    @Scheduled(cron = "0 30 10 * * ?")
//    @Scheduled(cron = "0 */2 * * * ?")
    public void syncAssets() {
        log.info("In Asset Syncing");
        log.info("Syncing Started");
        assetSyncService.syncAssets();
        log.info("Syncing ends");
    }
}

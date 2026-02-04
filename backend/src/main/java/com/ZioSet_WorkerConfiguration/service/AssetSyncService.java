package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.AssetSyncDto;
import com.ZioSet_WorkerConfiguration.model.Asset;
import com.ZioSet_WorkerConfiguration.repo.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetSyncService {
    private final AssetRepository assetRepository;
    private final RestTemplate restTemplate;
    private static final String ASSET_API_COUNT_URL = "https://zensar.zioset.com/asset/getAllAssetCountByDate";
    private static final String ASSET_API_LIST_URL = "https://zensar.zioset.com/asset/getAllAssetByPaginationByDate";

    public void syncAssets(){
        LocalDate syncDate = LocalDate.now();
        long totalCount = assetCountApi(syncDate);
//        long totalCount = 100;
        log.info("Total count={}",totalCount);

        int pageSize = 1000;
        int totalPages = (int) Math.ceil( (double) totalCount / pageSize);

        log.info("Total assets={} | pageSize={} | totalPages={}",
                totalCount, pageSize, totalPages);

        for (int pageNo = 1; pageNo <= totalPages; pageNo++) {

            List<AssetSyncDto> apiAssets =
                    assetListApi(syncDate, pageNo, pageSize);

            if (!apiAssets.isEmpty()) {
                syncBatch(apiAssets);
            }

            log.info("Synced page {}/{}", pageNo, totalPages);
        }

        log.info("Asset sync completed successfully for date {}", syncDate);
    }


    private void syncBatch(List<AssetSyncDto> apiAssets) {

        Set<String> assetIds = apiAssets.stream()
                .map(AssetSyncDto::getAssetId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Asset> existingAssetsMap =
                assetRepository.findByAssetIdIn(assetIds)
                        .stream()
                        .collect(Collectors.toMap(Asset::getAssetId, a -> a));

        List<Asset> assetsToSave = new ArrayList<>();

        for (AssetSyncDto dto : apiAssets) {

            try {
                Asset asset = existingAssetsMap
                        .getOrDefault(dto.getAssetId(), new Asset());

                boolean isNew = asset.getId() == null;
                boolean changed = mapIfChanged(dto, asset);

                if (isNew || changed) {
                    asset.setSyncId(dto.getAssetId());
                    assetsToSave.add(asset);
                }

            } catch (Exception ex) {
                log.error("Failed to sync assetId={}", dto.getAssetId(), ex);
            }
        }

        if (!assetsToSave.isEmpty()) {
            assetRepository.saveAll(assetsToSave);
        }
    }


    private boolean mapIfChanged(AssetSyncDto dto, Asset asset) {

        boolean changed = false;

        changed |= update(asset::getSerialNo, asset::setSerialNo, dto.getSerialNo());
        changed |= update(asset::getComputerName, asset::setComputerName, dto.getComputerName());
        changed |= update(asset::getDomainName, asset::setDomainName, dto.getDomainName());
        changed |= update(asset::getEmployeeNo, asset::setEmployeeNo, dto.getEmployeeNo());
        changed |= update(asset::getEmployeeName, asset::setEmployeeName, dto.getEmployeeName());
        changed |= update(asset::getSystemIp, asset::setSystemIp, dto.getSystemIp());
        changed |= update(asset::getAssetType, asset::setAssetType, dto.getAssetType());
        changed |= update(asset::getModel, asset::setModel, dto.getModel());
        changed |= update(asset::getProjectId, asset::setProjectId, dto.getProjectId());
        changed |= update(asset::getProjectName, asset::setProjectName, dto.getProjectName());
        changed |= update(asset::getLastActive, asset::setLastActive, dto.getLastActive());

        if (dto.getLocation() != null) {
            changed |= update(asset::getLocationName, asset::setLocationName, dto.getLocation().getLocationName());
        }

        asset.setAssetId(dto.getAssetId());
        return changed;
    }

    private <T> boolean update(Supplier<T> getter, Consumer<T> setter, T newValue) {
        if (!Objects.equals(getter.get(), newValue)) {
            setter.accept(newValue);
            return true;
        }
        return false;
    }


    private long assetCountApi(LocalDate date){
        UriComponentsBuilder uri = UriComponentsBuilder
                .fromHttpUrl(ASSET_API_COUNT_URL)
                .queryParam("date",date
                        .format(DateTimeFormatter
                                .ofPattern("dd-MM-yyyy")));
        System.out.println("Count api ="+uri.toUriString());

        ResponseEntity<Long> response =
                restTemplate.getForEntity(uri.toUriString(), Long.class);

        return Optional.ofNullable(response.getBody()).orElse(0L);
    }

    private List<AssetSyncDto> assetListApi(LocalDate date,int pageNo, int perPage){
        UriComponentsBuilder uri = UriComponentsBuilder
                .fromHttpUrl(ASSET_API_LIST_URL)
                .queryParam("pageNo",pageNo)
                .queryParam("perPage",perPage)
                .queryParam("date",date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));

        System.out.println("Asset uri get list\n"+uri.toUriString());

        ResponseEntity<List<AssetSyncDto>> response =
                restTemplate.exchange(
                        uri.toUriString(),
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<AssetSyncDto>>() {}
                );

        return Optional.ofNullable(response.getBody()).orElse(Collections.emptyList());
    }
}

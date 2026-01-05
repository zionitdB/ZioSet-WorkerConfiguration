package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.dto.GroupSearchDTO;
import com.ZioSet_WorkerConfiguration.model.UnRegisteredAssets;

import java.util.List;

public interface UnRegisteredAssetsCustomRepo {
    List<UnRegisteredAssets> getUnRegisteredAssetsByLimit(int pageNo, int perPage);

    List<UnRegisteredAssets> getAllUnRegisteredAssetsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

    int getCountAllUnRegisteredAssetsByLimitAndGroupSearch(GroupSearchDTO groupSearchDTO);

}

package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.repo.ActionRepo;
import com.ZioSet_WorkerConfiguration.repo.CategoryRepo;
import com.ZioSet_WorkerConfiguration.repo.CommandConfigurationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgentConfigurationDashBoardService {
    private final CategoryRepo categoryRepo;
    private final ActionRepo actionRepo;
    private final CommandConfigurationRepo commandConfigurationRepo;

    public long getCategoryCount(){
        return categoryRepo.count();
    }
    public long getActionCount(){
        return actionRepo.count();
    }
    public long getCommandCount(){
        return commandConfigurationRepo.count();
    }

    public Map<String,Object> getDashboardCount(){
        return Map.of("Category",getCategoryCount(),
                "Action",getActionCount(),
                "Command",getCommandCount());
    }


}

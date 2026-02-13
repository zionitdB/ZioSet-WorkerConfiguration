package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.model.CommandConfiguration;
import com.ZioSet_WorkerConfiguration.model.LinuxStandalonApplication;
import com.ZioSet_WorkerConfiguration.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgentConfigurationDashBoardService {
    private final CategoryRepo categoryRepo;
    private final ActionRepo actionRepo;
    private final CommandConfigurationRepo commandConfigurationRepo;
    private final LinuxStandaloneApplicationRepo linuxStandaloneApplicationRepo;
    private final MacStandaloneApplicationRepo macStandaloneApplicationRepo;
    private final StandalonApplicationRepo standalonApplicationRepo;

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

    public List<Map<String, Object>> getActionCountPerCategory() {

        List<Object[]> result = actionRepo.countActionsPerCategory();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("categoryId", row[0]);
            map.put("categoryName", row[1]);
            map.put("actionCount", row[2]);
            response.add(map);
        }

        return response;
    }

    public List<Map<String, Object>> getActionCountPerCategoryAndSubCategory() {

        List<Object[]> result = actionRepo.countActionsPerCategoryAndSubCategory();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("categoryId", row[0]);
            map.put("categoryName", row[1]);
            map.put("subCategoryName", row[2]);
            map.put("actionCount", row[3]);
            response.add(map);
        }

        return response;
    }

    public List<CommandConfiguration> getCommandData(){
        return commandConfigurationRepo.getCommandList();
    }

    public List<Map<String, Object>> getCommandCountPerAction() {

        List<Object[]> result = commandConfigurationRepo.countCommandsPerAction();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] row : result) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("actionId", row[0]);
            map.put("actionName", row[1]);
            map.put("commandCount", row[2]);
            response.add(map);
        }

        return response;
    }

    public Map<String,Long> getStandAloneCount(){
        return Map.of("Linux", linuxStandaloneApplicationRepo.count(),
                      "Mac", macStandaloneApplicationRepo.count(),
                      "Window", standalonApplicationRepo.count());
    }


}

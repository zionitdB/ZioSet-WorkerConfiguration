package com.ZioSet_WorkerConfiguration.controller;

import com.ZioSet_WorkerConfiguration.dto.AgentUpdateCreateDto;
import com.ZioSet_WorkerConfiguration.dto.ResponceObj;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateEntity;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import com.ZioSet_WorkerConfiguration.service.AgentUpdateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/agent-update")
public class AgentUpdateController {

    private final AgentUpdateService agentUpdateService;

    public AgentUpdateController(AgentUpdateService agentUpdateService) {
        this.agentUpdateService = agentUpdateService;
    }

    @PostMapping("/add-update")
    public ResponceObj addAgentUpdate(@RequestBody AgentUpdateCreateDto agentUpdate) {
        ResponceObj status = new ResponceObj();
        try {
            agentUpdateService.addAgentUpdate(agentUpdate);
            status.setCode(200);
            status.setMessage("Agent update added successfully");
        } catch (Exception e){
            status.setCode(500);
            status.setMessage("Error while adding agent update");
            e.printStackTrace();
        }
        return status;
    }

    @GetMapping("/delete-update/{updateId}")
    public ResponceObj deleteAgentUpdate(@PathVariable long updateId) {
        ResponceObj status = new ResponceObj();
        try {
            agentUpdateService.deleteAgentUpdate(updateId);
            status.setCode(200);
            status.setMessage("Agent update deleted successfully");
        } catch (Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting agent update");
        }
        return status;
    }

    @GetMapping("/get-all-updates")
    public List<AgentUpdateEntity> getAllAgentUpdates() {
        return agentUpdateService.getAllAgentUpdates();
    }

    @GetMapping("/get-systems/{updateUuid}")
    public List<AgentUpdateSystemsEntity> getSystemsByUpdateUuid(@PathVariable String updateUuid) {
        return agentUpdateService.getSystemsByUpdateUuid(updateUuid);
    }

    @GetMapping("/delete-target-system-by-id/{targetSystemId}")
    public ResponceObj deleteTargetSystemById(@PathVariable long targetSystemId) {
        ResponceObj status = new ResponceObj();
        try {
            agentUpdateService.deleteTargetSystemById(targetSystemId);
            status.setCode(200);
            status.setMessage("Target system deleted successfully");
        } catch (Exception e){
            e.printStackTrace();
            status.setCode(500);
            status.setMessage("Error while deleting target system");
        }
        return status;
    }

}

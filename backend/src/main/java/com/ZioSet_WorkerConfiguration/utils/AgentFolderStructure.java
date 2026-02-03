package com.ZioSet_WorkerConfiguration.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

public class AgentFolderStructure {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class FolderResponse{
        String folderName;
        String description;
    }

    public static List<FolderResponse> getServerFolders(){
        var list = new ArrayList<FolderResponse>();
        list.add(new FolderResponse("application", "contains files for application root like app_wrapper_system, extension_process, processlist db file, system_info etc"));
        list.add(new FolderResponse("system", "contains file/executabels for communication with server like api_comm_grt_process, api_comm_standalone, getstandalone_plugin etc"));
        list.add(new FolderResponse("plugins", "contains plugins to execute specific type of command like api_powershell, api_chrome_extension_installer, api_cmd etc"));
        list.add(new FolderResponse("tmp", "contains json files , can include actual command to run by plugins"));
        list.add(new FolderResponse("certs", "contains public certificates"));
        return list;
    }

    public static List<FolderResponse> getLocalFolders(){
        var list = new ArrayList<FolderResponse>();
        list.add(new FolderResponse("system", "root folder of agent, contains files required to run agent like process_control, communication files, services etc"));
        list.add(new FolderResponse("plugins", "contains plugins to execute specific type of command like api_powershell, api_chrome_extension_installer, api_cmd etc"));
        list.add(new FolderResponse("tmp", "contains json files , can include actual command to run by plugins"));
        list.add(new FolderResponse("certs", "contains public certificates"));
        return list;
    }
}

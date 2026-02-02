package com.ZioSet_WorkerConfiguration.utils.scriptsecurity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ApprovalDigest {
    private int version;
    private String script_id;
    private String script_type;
    private String entry_hash;           // sha512:...
    private List<String> dependency_hashes;
    private Map<String, String> arguments;
    private List<String> platforms;
}
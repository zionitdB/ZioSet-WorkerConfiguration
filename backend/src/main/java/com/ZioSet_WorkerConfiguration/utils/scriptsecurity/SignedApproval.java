package com.ZioSet_WorkerConfiguration.utils.scriptsecurity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignedApproval {
    private String digestJson;
    private String signatureBase64;
}

package com.ZioSet_WorkerConfiguration.parsing;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class FinalJsonParser implements ExecutionResultParser {

    @Override
    public void parse() {

    }

    private String extractJsonBlock(String stdout) {
        return StringUtils.substringBetween(
                stdout, "Process_Start", "Process_End"
        );
    }
}

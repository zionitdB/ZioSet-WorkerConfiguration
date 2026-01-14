package com.ZioSet_WorkerConfiguration.placholder.service;

import com.ZioSet_WorkerConfiguration.enums.ParamType;
import com.ZioSet_WorkerConfiguration.model.TemplateParameter;
import com.ZioSet_WorkerConfiguration.placholder.parser.TextParameterParser;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ScriptParserService {

    private final TextParameterParser textParameterParser;

    public ScriptParserService(TextParameterParser textParameterParser) {
        this.textParameterParser = textParameterParser;
    }

    public String parseScript(List<TemplateParameter> parameter , Map<String,String> paramValue){
        String finalScript = null;

        for (TemplateParameter param : parameter) {

            if (param.getParamType() == ParamType.TEXT) {

                finalScript = textParameterParser.parse(
                        param.getDefaultValue(),
                        paramValue
                );

                break;
            }
        }
        return finalScript;
    }
}

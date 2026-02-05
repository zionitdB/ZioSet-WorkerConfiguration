package com.ZioSet_WorkerConfiguration.placholder.service;

import com.ZioSet_WorkerConfiguration.enums.ParamType;
import com.ZioSet_WorkerConfiguration.model.TemplateParameter;
import com.ZioSet_WorkerConfiguration.placholder.parser.TextParameterParser;
import org.springframework.stereotype.Service;

import java.util.HashMap;
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

    public Map<String, String> extractScriptArguments(
            List<TemplateParameter> parameters,
            Map<String, String> parameterValuesFromDto) {

        Map<String, String> scriptArgs = new HashMap<>();

        for (TemplateParameter param : parameters) {

            if (param.getParamType() == ParamType.SCRIPT_ARGUMENT) {

                String value = parameterValuesFromDto.get(param.getParamName());

                if (value != null) {
                    scriptArgs.put(param.getParamName(), value);
                }
            }
        }

        return scriptArgs;
    }

}

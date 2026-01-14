package com.ZioSet_WorkerConfiguration.placholder.parser;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TextParameterParser {

    private static final Pattern PLACEHOLDER = Pattern.compile("\\$\\{(.+?)}");

    public String parse(String templateText, Map<String, String> paramValues) {

        Matcher matcher = PLACEHOLDER.matcher(templateText);
        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String paramName = matcher.group(1);
            String value = paramValues.getOrDefault(paramName, "");
            matcher.appendReplacement(
                    result,
                    Matcher.quoteReplacement(value)
            );
        }

        matcher.appendTail(result);
        return result.toString();
    }
}

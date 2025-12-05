package com.ZioSet_WorkerConfiguration.service;


import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import org.springframework.data.jpa.domain.Specification;

public class ScriptExecutionResultSpecs {

    public static Specification<ScriptExecutionResultEntity> filter(ExecutionResultFilterDTO f) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (f.getSerialNumber() != null && !f.getSerialNumber().isEmpty()) {
                predicates.getExpressions().add(
                        cb.equal(root.get("systemSerialNumber"), f.getSerialNumber())
                );
            }

            if (f.getScriptId() != null) {
                predicates.getExpressions().add(
                        cb.equal(root.get("script").get("id"), f.getScriptId())
                );
            }

            if (f.getFinishedAfter() != null) {
                predicates.getExpressions().add(
                        cb.greaterThanOrEqualTo(root.get("finishedAt"), f.getFinishedAfter())
                );
            }

            if (f.getFinishedBefore() != null) {
                predicates.getExpressions().add(
                        cb.lessThanOrEqualTo(root.get("finishedAt"), f.getFinishedBefore())
                );
            }

            return predicates;
        };
    }
}

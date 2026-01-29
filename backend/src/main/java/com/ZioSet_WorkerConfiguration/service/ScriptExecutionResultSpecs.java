package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.ExecutionResultFilterDTO;
import com.ZioSet_WorkerConfiguration.model.ScriptExecutionResultEntity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ScriptExecutionResultSpecs {

    public static Specification<ScriptExecutionResultEntity> filter(ExecutionResultFilterDTO f) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (hasText(f.getSerialNumberOrHostName())) {
                predicates.add(
                        cb.or(
                                cb.equal(root.get("systemSerialNumber"), f.getSerialNumberOrHostName().trim()),
                                cb.equal(root.get("hostName"), f.getSerialNumberOrHostName().trim())
                        )
                );
            }

            if (f.getScriptId() != null) {
                predicates.add(
                        cb.equal(root.join("script", JoinType.INNER).get("id"), f.getScriptId())
                );
            }

            Instant after = f.getFinishedAfter();
            Instant before = f.getFinishedBefore();

            if (after != null || before != null) {
                predicates.add(cb.isNotNull(root.get("finishedAt")));
            }

            if (after != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("finishedAt"), after));
            }

            if (before != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("finishedAt"), before));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean hasText(String s) {
        return s != null && !s.trim().isEmpty();
    }
}

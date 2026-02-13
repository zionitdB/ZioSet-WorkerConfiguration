package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.MACInstalledSystemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MACInstalledSystemRepository extends JpaRepository<MACInstalledSystemEntity, Long>, MACInstalledSystemCustomRepo {
    Optional<MACInstalledSystemEntity> findBySystemSerialNo(String serialNumber);

    List<MACInstalledSystemEntity> findAllBySystemSerialNoIn(List<String> serialNumbers);

    @Query("""
            select count(m) from MACInstalledSystemEntity m
            where m.installedAt=:today""")
    long getTodayInstalledCount(@Param("today") LocalDate today);

    @Query("""
    SELECT FUNCTION('DATE', i.installedAt), COUNT(i)
    FROM MACInstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :fromDate
    GROUP BY FUNCTION('DATE', i.installedAt)
    ORDER BY FUNCTION('DATE', i.installedAt)
""")
    List<Object[]> countLast10Days(@Param("fromDate") LocalDateTime fromDate);

    @Query("""
    SELECT i.installedAt
    FROM MACInstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :start
    AND i.installedAt < :end
""")
    List<LocalDateTime> findInstalledInMonth(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    Page<MACInstalledSystemEntity> findByInstalledTrueOrderByInstalledAtDesc(Pageable pageable);

}

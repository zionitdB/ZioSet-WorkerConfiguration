package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.LinuxInstalledSystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LinuxInstalledSystemRepo extends JpaRepository<LinuxInstalledSystemEntity, Long> , LinuxInstalledSystemCustomeRepo {
    Optional<LinuxInstalledSystemEntity> findBySystemSerialNo(String serialNumber);
    List<LinuxInstalledSystemEntity> findAllBySystemSerialNoIn(List<String> serialNumbers);

    @Query("""
            select count(l) from LinuxInstalledSystemEntity l
            where l.installedAt=:today""")
    long getTodayInstalledCount(@Param("today")LocalDate today);

    @Query("""
    SELECT FUNCTION('DATE', i.installedAt), COUNT(i)
    FROM LinuxInstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :fromDate
    GROUP BY FUNCTION('DATE', i.installedAt)
    ORDER BY FUNCTION('DATE', i.installedAt) ASC
""")
    List<Object[]> countLast10Days(@Param("fromDate") LocalDateTime fromDate);

    @Query("""
    SELECT i.installedAt
    FROM LinuxInstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :start
    AND i.installedAt < :end
""")
    List<LocalDateTime> findInstalledInMonth(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}

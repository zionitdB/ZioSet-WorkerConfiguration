package com.ZioSet_WorkerConfiguration.repo;

import com.ZioSet_WorkerConfiguration.model.InstalledSystemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InstalledSystemRepo extends JpaRepository<InstalledSystemEntity, Long>
        , InstalledSystemCustomeRepo
{
    Optional<InstalledSystemEntity> findBySystemSerialNo(String serialNumber);

    List<InstalledSystemEntity> findAllBySystemSerialNoIn(List<String> serialNumbers);

    List<InstalledSystemEntity> findByInstalledAtBetweenAndInstalledIsTrue(LocalDateTime startDate, LocalDateTime endDate);

    @Query("""
            select count(m) from InstalledSystemEntity m
            where m.installedAt=:today""")
    long getTodayInstalledCount(@Param("today") LocalDate today);

    @Query("""
    SELECT FUNCTION('DATE', i.installedAt), COUNT(i)
    FROM InstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :fromDate
    GROUP BY FUNCTION('DATE', i.installedAt)
    ORDER BY FUNCTION('DATE', i.installedAt)
""")
    List<Object[]> countLast10Days(@Param("fromDate") LocalDateTime fromDate);

    @Query("""
    SELECT i.installedAt
    FROM InstalledSystemEntity i
    WHERE i.installed = true
    AND i.installedAt >= :start
    AND i.installedAt < :end
""")
    List<LocalDateTime> findInstalledInMonth(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    Page<InstalledSystemEntity> findByInstalledTrueOrderByInstalledAtDesc(Pageable pageable);


}

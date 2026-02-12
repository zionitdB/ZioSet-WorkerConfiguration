package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AgentDashBoardService {
    private final LinuxInstalledSystemRepo linuxInstalledSystemRepo;
    private final MACInstalledSystemRepository macInstalledSystemRepository;
    private final InstalledSystemRepo installedSystemRepo;
    private final AgentUpdateRepository agentUpdateRepository;

    public long getLinuxCount(){
        return linuxInstalledSystemRepo.count();
    }
    public long getMacCount(){
        return macInstalledSystemRepository.count();
    }
    public long getWindowCount(){
        return installedSystemRepo.count();
    }

    public Map<String,Object> getSystemsCount(){
        return Map.of("Linux",getLinuxCount(),
                            "Mac",getMacCount(),
                                "Window",getWindowCount());
    }



    public Map<String,Object> getAllTodayCount(){
        LocalDate today = LocalDate.now();
        return Map.of("Linux",linuxInstalledSystemRepo.getTodayInstalledCount(today),
                "Mac",macInstalledSystemRepository.getTodayInstalledCount(today),
                "Window",installedSystemRepo.getTodayInstalledCount(today));
    }

    public Long getAgentUpdatesCount(){
        return agentUpdateRepository.count();
    }

    public Long getAgentUpdateTodayCount(){
        LocalDate today = LocalDate.now();
        return agentUpdateRepository.getAgentUpdateTodayCount(today);
    }

    public Map<String,Object> getLast10DaysInstalledCount(){
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(9);

        LocalDateTime fromDateTime = startDate.atStartOfDay();

        List<Object[]> windowList = installedSystemRepo.countLast10Days(fromDateTime);
        List<Object[]> macList = linuxInstalledSystemRepo.countLast10Days(fromDateTime);
        List<Object[]> linuxList = macInstalledSystemRepository.countLast10Days(fromDateTime);

        return Map.of("Windows",getLast10DaysInstalledCount(windowList,startDate),
                      "Mac",getLast10DaysInstalledCount(macList,startDate),
                      "Linux",getLast10DaysInstalledCount(linuxList,startDate));
    }

    public Map<LocalDate, Long> getLast10DaysInstalledCount(List<Object[]> dbRes,LocalDate startDate) {

        Map<LocalDate, Long> dbMap = new HashMap<>();
        for (Object[] row : dbRes) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            Long count = (Long) row[1];
            dbMap.put(date, count);
        }

//        Map<LocalDate, Long> finalMap = new LinkedHashMap<>();
//
//        for (int i = 0; i < 10; i++) {
//            LocalDate date = startDate.plusDays(i);
//            finalMap.put(date, dbMap.getOrDefault(date, 0L));
//        }

        return dbMap;
    }

    public Map<String,Object> getWeeklyInstalledCount(int year, int month){
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        LocalDateTime startDateTime = firstDay.atStartOfDay();
        LocalDateTime endDateTime = lastDay.plusDays(1).atStartOfDay();

        List<LocalDateTime> installedDates = installedSystemRepo.findInstalledInMonth(startDateTime, endDateTime);
        List<LocalDateTime> macInstalledDates = linuxInstalledSystemRepo.findInstalledInMonth(startDateTime, endDateTime);
        List<LocalDateTime> linuxInstalledDates = macInstalledSystemRepository.findInstalledInMonth(startDateTime, endDateTime);

        return Map.of("Windows",getWeeklyCountByMonth(installedDates),
                "Mac",getWeeklyCountByMonth(macInstalledDates),
                "Linux",getWeeklyCountByMonth(linuxInstalledDates));
    }


    public Map<Integer, Long> getWeeklyCountByMonth(List<LocalDateTime> installedDates) {

        Map<Integer, Long> weekMap = new LinkedHashMap<>();

        // Initialize week 1–5 with 0
        for (int i = 1; i <= 5; i++) {
            weekMap.put(i, 0L);
        }

        for (LocalDateTime dateTime : installedDates) {
            LocalDate date = dateTime.toLocalDate();

            int weekOfMonth = date.get(WeekFields.of(Locale.getDefault())
                    .weekOfMonth());

            weekMap.put(weekOfMonth,
                    weekMap.getOrDefault(weekOfMonth, 0L) + 1);
        }

        return weekMap;
    }





}

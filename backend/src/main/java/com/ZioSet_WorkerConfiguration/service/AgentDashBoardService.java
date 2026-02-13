package com.ZioSet_WorkerConfiguration.service;

import com.ZioSet_WorkerConfiguration.dto.RecentInstalledDTO;
import com.ZioSet_WorkerConfiguration.model.AgentUpdateSystemsEntity;
import com.ZioSet_WorkerConfiguration.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final AgentUpdateSystemsRepository agentUpdateSystemsRepository;

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


    public List<Map<String, Object>> getLast7DaysDashboard() {

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6);
        LocalDateTime fromDateTime = startDate.atStartOfDay();

        List<Object[]> dbResult = agentUpdateSystemsRepository.getLast7DaysCounts(fromDateTime);

        Map<LocalDate, long[]> dbMap = new HashMap<>();

        for (Object[] row : dbResult) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            long success = row[1] != null ? (Long) row[1] : 0L;
            long failed = row[2] != null ? (Long) row[2] : 0L;
            long pending = row[3] != null ? (Long) row[3] : 0L;

            dbMap.put(date, new long[]{success, failed, pending});
        }

        List<Map<String, Object>> response = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate date = startDate.plusDays(i);
            long[] counts = dbMap.getOrDefault(date, new long[]{0L, 0L, 0L});

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("date", date);
            map.put("success", counts[0]);
            map.put("failed", counts[1]);
            map.put("pending", counts[2]);

            response.add(map);
        }

        return response;
    }

    public Map<String, Long> getOverallDashboard() {

        Object[] result = agentUpdateSystemsRepository.getOverallDashboard();

        Long total   = result[0] != null ? (Long) result[0] : 0L;
        Long success = result[1] != null ? (Long) result[1] : 0L;
        Long failed = result[2] != null ? (Long) result[2] : 0L;
        Long pending = result[3] != null ? (Long) result[3] : 0L;

        Map<String, Long> response = new LinkedHashMap<>();
        response.put("TOTAL", total);
        response.put("SUCCESS", success);
        response.put("PENDING", pending);
        response.put("FAILED", failed);

        return response;
    }

    public List<AgentUpdateSystemsEntity> getLatestUpdateData(){
        return agentUpdateSystemsRepository.findAllData().stream().limit(15).toList();
    }

    public List<AgentUpdateSystemsEntity> getRecentAgentInstallationData(){
        return agentUpdateSystemsRepository.findAllData().stream().limit(15).toList();
    }

    public List<RecentInstalledDTO> getRecentInstalledCombined() {

        Pageable pageable = PageRequest.of(0, 5);

        List<RecentInstalledDTO> combined = new ArrayList<>();

        // Windows
        installedSystemRepo.findByInstalledTrueOrderByInstalledAtDesc(pageable)
                .forEach(w ->
                        combined.add(new RecentInstalledDTO(
                                w.getSystemSerialNo(),
                                w.getHostName(),
                                "WINDOWS",
                                w.getInstalledAt()
                        )));

        // Linux
        linuxInstalledSystemRepo.findByInstalledTrueOrderByInstalledAtDesc(pageable)
                .forEach(l ->
                        combined.add(new RecentInstalledDTO(
                                l.getSystemSerialNo(),
                                null,
                                "LINUX",
                                l.getInstalledAt()
                        )));

        // Mac
        macInstalledSystemRepository.findByInstalledTrueOrderByInstalledAtDesc(pageable)
                .forEach(m ->
                        combined.add(new RecentInstalledDTO(
                                m.getSystemSerialNo(),
                                null,
                                "MAC",
                                m.getInstalledAt()
                        )));

        combined.sort(Comparator.comparing(RecentInstalledDTO::installedAt).reversed());

        return combined.stream()
                .limit(15)
                .toList();
    }




}

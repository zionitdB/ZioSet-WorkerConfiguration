package com.ZioSet_WorkerConfiguration.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class SerialNumberExcelParser {
    private MultipartFile excelFile;

    public SerialNumberExcelParser(MultipartFile excelFile) {
        this.excelFile = excelFile;
    }

    public List<String> getSystemSerialNumbersList() {
        List<String> serialNumbers = new ArrayList<>();
        try (InputStream is = excelFile.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0); // first sheet
            boolean skipHeader = true;

            for (Row row : sheet) {
                if (skipHeader) {
                    skipHeader = false;
                    continue;
                }

                Cell cell = row.getCell(0); // first column (index 0)
                if (cell != null) {
                    serialNumbers.add(getCellValueAsString(cell));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return serialNumbers;
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return "";
        }
    }

}

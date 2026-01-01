package com.ZioSet_WorkerConfiguration.dto;

import lombok.Data;

import java.util.List;

public class GroupSearchDTO {
  private int pageNo;
  
  private int perPage;

  List<ColumnSearch> columns;

  public int getPageNo() {
    return pageNo;
  }

  public void setPageNo(int pageNo) {
    this.pageNo = pageNo;
  }

  public int getPerPage() {
    return perPage;
  }

  public void setPerPage(int perPage) {
    this.perPage = perPage;
  }

  public List<ColumnSearch> getColumns() {
    return columns;
  }

  public void setColumns(List<ColumnSearch> columns) {
    this.columns = columns;
  }
}

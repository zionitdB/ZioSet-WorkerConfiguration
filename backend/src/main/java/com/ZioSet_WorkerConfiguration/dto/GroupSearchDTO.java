package com.ZioSet_WorkerConfiguration.dto;

import java.util.List;

public class GroupSearchDTO {
  private int pageNo;
  
  private int perPage;
  
  List<ColumnSearch> columns;
  
  public int getPageNo() {
    return this.pageNo;
  }
  
  public void setPageNo(int pageNo) {
    this.pageNo = pageNo;
  }
  
  public int getPerPage() {
    return this.perPage;
  }
  
  public void setPerPage(int perPage) {
    this.perPage = perPage;
  }
  
  public List<ColumnSearch> getColumns() {
    return this.columns;
  }
  
  public void setColumns(List<ColumnSearch> columns) {
    this.columns = columns;
  }
}

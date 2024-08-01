package com.ZioSet_WorkerConfiguration.dto;

import java.util.List;

public class ResponceObj {
  private int code;
  
  private String message;
  
  private double volume;
  
  private List<String> month;
  
  private List<Integer> value;
  
  private List<String> costs;
  
  private Object data;
  
  public double getVolume() {
    return this.volume;
  }
  
  public void setVolume(double volume) {
    this.volume = volume;
  }
  
  public int getCode() {
    return this.code;
  }
  
  public void setCode(int code) {
    this.code = code;
  }
  
  public String getMessage() {
    return this.message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
  public Object getData() {
    return this.data;
  }
  
  public void setData(Object data) {
    this.data = data;
  }
  
  public List<String> getMonth() {
    return this.month;
  }
  
  public void setMonth(List<String> month) {
    this.month = month;
  }
  
  public List<Integer> getValue() {
    return this.value;
  }
  
  public void setValue(List<Integer> value) {
    this.value = value;
  }
  
  public List<String> getCosts() {
    return this.costs;
  }
  
  public void setCosts(List<String> costs) {
    this.costs = costs;
  }
}

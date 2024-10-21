package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "action")
public class Action {

	
	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	 
	  @Column(name = "action_name")
	  private String actionName;
	 
	 
	  public String getActionName() {
		return actionName;
	}


	public void setActionName(String actionName) {
		this.actionName = actionName;
	}


	@ManyToOne
	  @JoinColumn(name = "category_id")
	  private Category  category;
	  
	  @ManyToOne
	  @JoinColumn(name = "sub_category_id")
	  private Category  subCategory;
	  
	  @Column(name = "information_type")
	  private String informationtype;
	   
	  
	  @Column(name = "information_detail")
	  private String informationdetail ;


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Category getCategory() {
		return category;
	}


	public void setCategory(Category category) {
		this.category = category;
	}


	public Category getSubCategory() {
		return subCategory;
	}


	public void setSubCategory(Category subCategory) {
		this.subCategory = subCategory;
	}


	public String getInformationtype() {
		return informationtype;
	}


	public void setInformationtype(String informationtype) {
		this.informationtype = informationtype;
	}


	public String getInformationdetail() {
		return informationdetail;
	}


	public void setInformationdetail(String informationdetail) {
		this.informationdetail = informationdetail;
	}
	  
	  
	  
	  
	  
}

package com.ZioSet_WorkerConfiguration.model;


import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "category")
public class Category {

	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	  @Column(name = "category_name")
	  private String categoryname;
	  
	  @Column(name = "created_date")
	  private Date createdDate;
	  
	  @ManyToOne
	  @JoinColumn(name = "parent_id")
	  private Category  parrentCategory;
	  
	  @Transient
	  private List<Category> childs;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCategoryname() {
		return categoryname;
	}

	public void setCategoryname(String categoryname) {
		this.categoryname = categoryname;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Category getParrentCategory() {
		return parrentCategory;
	}

	public List<Category> getChilds() {
		return childs;
	}

	public void setChilds(List<Category> childs) {
		this.childs = childs;
	}

	public void setParrentCategory(Category parrentCategory) {
		this.parrentCategory = parrentCategory;
	}
	  
	  
	  
	  
}

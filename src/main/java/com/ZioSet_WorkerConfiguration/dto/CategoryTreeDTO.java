package com.ZioSet_WorkerConfiguration.dto;

import java.util.List;

import com.ZioSet_WorkerConfiguration.model.Category;

public class CategoryTreeDTO {
	private Category parent;
	private List<Category> childs;
	public Category getParent() {
		return parent;
	}
	public void setParent(Category parent) {
		this.parent = parent;
	}
	public List<Category> getChilds() {
		return childs;
	}
	public void setChilds(List<Category> childs) {
		this.childs = childs;
	}
	
	
	

}

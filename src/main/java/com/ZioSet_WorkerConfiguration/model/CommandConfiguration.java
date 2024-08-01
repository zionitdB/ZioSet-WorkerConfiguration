package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "commands_configuration")
public class CommandConfiguration {

	
	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	 
	  @ManyToOne
	  @JoinColumn(name = "category_id")
	  private Category  category;
	  
	  @ManyToOne
	  @JoinColumn(name = "sub_category_id")
	  private Category  subCategory;
	  
	  @Column(name = "commandstr")
	  private String commandstr;
	   
	  
	  @Column(name = "schemastr")
	  private String schemastr ;


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


	public String getCommandstr() {
		return commandstr;
	}


	public void setCommandstr(String commandstr) {
		this.commandstr = commandstr;
	}


	public String getSchemastr() {
		return schemastr;
	}


	public void setSchemastr(String schemastr) {
		this.schemastr = schemastr;
	}





	  
	  
	  
	  
}

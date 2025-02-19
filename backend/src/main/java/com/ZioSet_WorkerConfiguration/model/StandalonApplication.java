package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "standalone_applications_mst")
public class StandalonApplication {
	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	 
	 
	  @Column(name = "standalone_application_name")
	  private String standaloneApplicationName;
	  
	  
	  @Column(name = "added_date")
	  private String addedDate;
	  
	  
	  @Column(name = "active")
	  private int active;


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getStandaloneApplicationName() {
		return standaloneApplicationName;
	}


	public void setStandaloneApplicationName(String standaloneApplicationName) {
		this.standaloneApplicationName = standaloneApplicationName;
	}


	public String getAddedDate() {
		return addedDate;
	}


	public void setAddedDate(String addedDate) {
		this.addedDate = addedDate;
	}


	public int getActive() {
		return active;
	}


	public void setActive(int active) {
		this.active = active;
	}
	  
	  
	  
	  
	  
	  
	  
	  
}

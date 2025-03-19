package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mac_standalone_applications_mst")
public class MacStandalonApplication {
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

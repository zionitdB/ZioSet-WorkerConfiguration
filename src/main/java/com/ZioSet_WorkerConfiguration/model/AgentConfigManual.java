package com.ZioSet_WorkerConfiguration.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "agent_config_manual")
public class AgentConfigManual {

	
	
	

	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	  @Column(name = "action_id")
	  private int actionId;
	  
	  @Column(name = "command_id")
	  private String commandId ;
	  
	  
	  @Column(name = "update_type")
	  private String updateType;
	  
	  
	  @Column(name = "repeat_type")
	  private String repeatType;


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public int getActionId() {
		return actionId;
	}


	public void setActionId(int actionId) {
		this.actionId = actionId;
	}


	public String getCommandId() {
		return commandId;
	}


	public void setCommandId(String commandId) {
		this.commandId = commandId;
	}


	public String getUpdateType() {
		return updateType;
	}


	public void setUpdateType(String updateType) {
		this.updateType = updateType;
	}


	public String getRepeatType() {
		return repeatType;
	}


	public void setRepeatType(String repeatType) {
		this.repeatType = repeatType;
	}
	  
	  
	  
	  
	  
}

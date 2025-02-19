package com.ZioSet_WorkerConfiguration.model;

import java.util.List;

import com.ZioSet_WorkerConfiguration.dto.CammandDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "commands_configuration")
public class CommandConfiguration {

	
	 @Id
	  @GeneratedValue
	  @Column(name = "id")
	  private int id;
	  
	 
	 
	  
	  @ManyToOne
	  @JoinColumn(name = "action_id")
	  private Action  action;
	  
	  @Column(name = "commandstr")
	  private String commandstr;
	  
	  @Column(name = "command_id")
	  private String commandId;
	   
	  
	  public String getCommandId() {
		return commandId;
	}


	public void setCommandId(String commandId) {
		this.commandId = commandId;
	}


	@Column(name = "schemastr")
	  private String schemastr ;
	  
	  @Transient
	  List<CammandDTO> list;


	public List<CammandDTO> getList() {
		return list;
	}


	public void setList(List<CammandDTO> list) {
		this.list = list;
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public Action getAction() {
		return action;
	}


	public void setAction(Action action) {
		this.action = action;
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


	@Override
	public String toString() {
		return "CommandConfiguration [id=" + id + ", action=" + action + ", commandstr=" + commandstr + ", commandId="
				+ commandId + ", schemastr=" + schemastr + ", list=" + list + "]";
	}





	  
	  
	  
	  
}

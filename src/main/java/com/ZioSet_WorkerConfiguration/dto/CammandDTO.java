package com.ZioSet_WorkerConfiguration.dto;

public class CammandDTO {

	private String commandstr;
	  private String schemastr ;
	  private String commandId ;
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
	public String getCommandId() {
		return commandId;
	}
	public void setCommandId(String commandId) {
		this.commandId = commandId;
	}
	@Override
	public String toString() {
		return "CammandDTO [commandstr=" + commandstr + ", schemastr=" + schemastr + ", commandId=" + commandId + "]";
	}
	  
	  
}

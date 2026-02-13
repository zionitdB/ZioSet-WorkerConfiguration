package com.ZioSet_WorkerConfiguration.model;

import java.time.LocalDateTime;
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
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "commands_configuration")
@Data
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

	  @Column(name = "schemastr")
	  private String schemastr ;
	  
	  @Transient
	  List<CammandDTO> list;

	  @CreationTimestamp
	  private LocalDateTime createdAt;

	  @UpdateTimestamp
	  private LocalDateTime updatedAt;



	@Override
	public String toString() {
		return "CommandConfiguration [id=" + id + ", action=" + action + ", commandstr=" + commandstr + ", commandId="
				+ commandId + ", schemastr=" + schemastr + ", list=" + list + "]";
	}





	  
	  
	  
	  
}

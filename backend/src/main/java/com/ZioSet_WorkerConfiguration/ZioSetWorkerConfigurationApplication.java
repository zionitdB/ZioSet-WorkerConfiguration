package com.ZioSet_WorkerConfiguration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ZioSetWorkerConfigurationApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZioSetWorkerConfigurationApplication.class, args);
	}

}

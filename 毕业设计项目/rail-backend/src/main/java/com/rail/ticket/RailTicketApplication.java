package com.rail.ticket;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@MapperScan("com.rail.ticket.mapper")
public class RailTicketApplication {
  public static void main(String[] args) {
    SpringApplication.run(RailTicketApplication.class, args);
  }
}

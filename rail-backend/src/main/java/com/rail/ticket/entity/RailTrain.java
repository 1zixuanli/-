package com.rail.ticket.entity;

import lombok.Data;

@Data
public class RailTrain {
  private Long id;
  private String trainId;
  private String trainNo;
  private String fromStation;
  private String toStation;
  private String departTime;
  private String arriveTime;
  private String duration;
  private Integer isDeleted;
}

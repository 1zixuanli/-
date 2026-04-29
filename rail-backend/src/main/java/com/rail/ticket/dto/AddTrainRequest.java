package com.rail.ticket.dto;

import lombok.Data;

@Data
public class AddTrainRequest {
  private String trainId;
  private String trainNo;
  private String fromStation;
  private String toStation;
  private String departTime;
  private String arriveTime;
  private String duration;
  private Integer p2;
  private Integer p1;
  private Integer pb;
  private Integer s2;
  private Integer s1;
  private Integer sb;
  private Integer sn;
}

package com.rail.ticket.entity;

import lombok.Data;

@Data
public class RailTrainSeat {
  private Long id;
  private String trainId;
  private String seatType;
  private String seatName;
  private Integer price;
  private Integer baseRemain;
}

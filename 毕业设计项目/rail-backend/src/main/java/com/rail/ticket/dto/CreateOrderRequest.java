package com.rail.ticket.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
  private String trainId;
  private String trainNo;
  private String fromStation;
  private String toStation;
  private String travelDate;
  private String departTime;
  private String arriveTime;
  private String seatType;
  private Integer quantity;
  private String passengerName;
  private String idCard;
  private String ticketType;
}

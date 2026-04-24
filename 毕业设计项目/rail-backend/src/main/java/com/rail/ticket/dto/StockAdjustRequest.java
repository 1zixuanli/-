package com.rail.ticket.dto;

import lombok.Data;

@Data
public class StockAdjustRequest {
  private String trainId;
  private String seatType;
  private Integer delta;
}

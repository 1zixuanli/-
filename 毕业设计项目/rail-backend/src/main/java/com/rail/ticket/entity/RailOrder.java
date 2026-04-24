package com.rail.ticket.entity;

import lombok.Data;

@Data
public class RailOrder {
  private String orderId;
  private Long userId;
  private String username;
  private String trainId;
  private String trainNo;
  private String fromStation;
  private String toStation;
  private java.sql.Date travelDate;
  private String departTime;
  private String arriveTime;
  private String duration;
  private String seatType;
  private String seatName;
  private Integer quantity;
  private Integer unitPrice;
  private Integer price;
  private String passengerName;
  private String idCard;
  private String ticketType;
  private String status;
  private java.util.Date payDeadline;
  private java.util.Date createdAt;
  private java.util.Date paidAt;
  private java.util.Date refundedAt;
}

package com.rail.ticket.entity;

import lombok.Data;

import java.util.Date;

@Data
public class SysUser {
  private Long id;
  private String username;
  private String password;
  private String phone;
  private String idCard;
  private String role;
  private Date createdAt;
}

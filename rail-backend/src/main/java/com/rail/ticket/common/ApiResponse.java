package com.rail.ticket.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
  private int code;
  private String message;
  private T data;
  private Object meta;

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(0, "ok", data, null);
  }

  public static <T> ApiResponse<T> ok(T data, Object meta) {
    return new ApiResponse<>(0, "ok", data, meta);
  }

  public static ApiResponse<Void> okMsg(String message) {
    return new ApiResponse<>(0, message, null, null);
  }
}

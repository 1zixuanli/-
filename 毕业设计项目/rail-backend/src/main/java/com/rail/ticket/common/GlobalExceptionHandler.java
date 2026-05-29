package com.rail.ticket.common;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BizException.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleBiz(BizException e) {
    int c = e.getCode() > 0 ? e.getCode() : 1;
    return new ApiResponse<>(c, e.getMessage(), null, null);
  }

  @ExceptionHandler(BindException.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleBind(BindException e) {
    String msg = e.getBindingResult().getFieldErrors().isEmpty()
        ? "参数错误"
        : e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
    return new ApiResponse<>(1, msg, null, null);
  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.OK)
  public ApiResponse<Void> handleOther(Exception e) {
    e.printStackTrace();
    return new ApiResponse<>(1, e.getMessage() != null ? e.getMessage() : "服务器错误", null, null);
  }
}

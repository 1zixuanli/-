package com.rail.ticket.controller;

import com.rail.ticket.common.ApiResponse;
import com.rail.ticket.dto.CreateOrderRequest;
import com.rail.ticket.dto.OrderIdRequest;
import com.rail.ticket.service.OrderService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping("/create")
  public ApiResponse<Map<String, Object>> create(HttpServletRequest request, @RequestBody CreateOrderRequest body) {
    long userId = (Long) request.getAttribute("userId");
    String username = (String) request.getAttribute("username");
    return ApiResponse.ok(orderService.createOrder(userId, username, body));
  }

  @GetMapping("/list")
  public ApiResponse<List<Map<String, Object>>> list(HttpServletRequest request) {
    long userId = (Long) request.getAttribute("userId");
    return ApiResponse.ok(orderService.listForUser(userId));
  }

  @PostMapping("/cancel")
  public ApiResponse<Void> cancel(HttpServletRequest request, @RequestBody OrderIdRequest body) {
    long userId = (Long) request.getAttribute("userId");
    orderService.cancel(userId, body);
    return ApiResponse.okMsg("已取消");
  }

  @PostMapping("/pay")
  public ApiResponse<Map<String, Object>> pay(HttpServletRequest request, @RequestBody OrderIdRequest body) {
    long userId = (Long) request.getAttribute("userId");
    orderService.pay(userId, body);
    Map<String, Object> data = new java.util.HashMap<>();
    data.put("orderId", body.getOrderId());
    data.put("status", "paid");
    return ApiResponse.ok(data);
  }

  @PostMapping("/complete")
  public ApiResponse<Map<String, Object>> complete(HttpServletRequest request, @RequestBody OrderIdRequest body) {
    long userId = (Long) request.getAttribute("userId");
    orderService.complete(userId, body);
    Map<String, Object> data = new java.util.HashMap<>();
    data.put("orderId", body.getOrderId());
    data.put("status", "completed");
    return ApiResponse.ok(data);
  }

  @PostMapping("/refund")
  public ApiResponse<?> refund(HttpServletRequest request, @RequestBody OrderIdRequest body) {
    long userId = (Long) request.getAttribute("userId");
    orderService.refund(userId, body);
    Map<String, Object> data = new java.util.HashMap<>();
    data.put("orderId", body.getOrderId());
    return ApiResponse.ok(data);
  }
}

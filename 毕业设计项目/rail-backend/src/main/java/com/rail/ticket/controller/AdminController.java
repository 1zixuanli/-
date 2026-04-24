package com.rail.ticket.controller;

import com.rail.ticket.common.ApiResponse;
import com.rail.ticket.dto.AddTrainRequest;
import com.rail.ticket.dto.StockAdjustRequest;
import com.rail.ticket.mapper.RailStockAdjustMapper;
import com.rail.ticket.service.AdminStatsService;
import com.rail.ticket.service.OrderService;
import com.rail.ticket.service.TrainAdminService;
import com.rail.ticket.service.TrainService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final AdminStatsService adminStatsService;
  private final OrderService orderService;
  private final TrainService trainService;
  private final TrainAdminService trainAdminService;
  private final RailStockAdjustMapper stockAdjustMapper;

  public AdminController(AdminStatsService adminStatsService, OrderService orderService,
                         TrainService trainService, TrainAdminService trainAdminService,
                         RailStockAdjustMapper stockAdjustMapper) {
    this.adminStatsService = adminStatsService;
    this.orderService = orderService;
    this.trainService = trainService;
    this.trainAdminService = trainAdminService;
    this.stockAdjustMapper = stockAdjustMapper;
  }

  @GetMapping("/stats")
  public ApiResponse<Map<String, Object>> stats() {
    return ApiResponse.ok(adminStatsService.stats());
  }

  @GetMapping("/users")
  public ApiResponse<List<Map<String, Object>>> users() {
    return ApiResponse.ok(adminStatsService.listUsers().stream().map(u -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("userId", u.getId());
      m.put("username", u.getUsername());
      m.put("phone", u.getPhone() != null ? u.getPhone() : "");
      m.put("idCard", u.getIdCard() != null ? u.getIdCard() : "");
      m.put("role", u.getRole());
      m.put("registeredAt", u.getCreatedAt() != null ? u.getCreatedAt().toInstant().toString() : "");
      return m;
    }).collect(Collectors.toList()));
  }

  @GetMapping("/orders")
  public ApiResponse<List<Map<String, Object>>> orders() {
    return ApiResponse.ok(orderService.listAll());
  }

  @GetMapping("/trains")
  public ApiResponse<List<Map<String, Object>>> trains() {
    return ApiResponse.ok(trainService.listForAdmin());
  }

  @PostMapping("/stock/adjust")
  public ApiResponse<Map<String, String>> adjustStock(@RequestBody StockAdjustRequest req) {
    int d = req.getDelta() != null ? req.getDelta() : 0;
    stockAdjustMapper.addDelta(req.getTrainId(), req.getSeatType(), d);
    Map<String, String> data = new LinkedHashMap<>();
    data.put("trainId", req.getTrainId());
    data.put("seatType", req.getSeatType());
    return ApiResponse.ok(data);
  }

  @GetMapping("/sales/by-train")
  public ApiResponse<List<Map<String, Object>>> salesByTrain() {
    return ApiResponse.ok(orderService.salesByTrain());
  }

  @GetMapping("/train/manifest")
  public ApiResponse<List<Map<String, Object>>> manifest() {
    return ApiResponse.ok(trainService.trainManifest());
  }

  @PostMapping("/train")
  public ApiResponse<Void> addTrain(@RequestBody AddTrainRequest req) {
    trainAdminService.addTrain(req);
    return ApiResponse.okMsg("已添加");
  }

  @DeleteMapping("/train/{trainId}")
  public ApiResponse<Void> deleteTrain(@PathVariable String trainId) {
    trainAdminService.deleteTrain(trainId);
    return ApiResponse.okMsg("已删除");
  }
}

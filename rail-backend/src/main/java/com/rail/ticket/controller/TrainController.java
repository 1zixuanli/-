package com.rail.ticket.controller;

import com.rail.ticket.common.ApiResponse;
import com.rail.ticket.service.TrainService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/train")
public class TrainController {

  private final TrainService trainService;

  public TrainController(TrainService trainService) {
    this.trainService = trainService;
  }

  @GetMapping("/list")
  public ApiResponse<List<Map<String, Object>>> list(
      @RequestParam String from,
      @RequestParam String to,
      @RequestParam(required = false) String date,
      @RequestParam(required = false) String highSpeedOnly,
      @RequestParam(required = false) String ticketType) {
    Boolean hs = null;
    if (highSpeedOnly != null) {
      hs = "1".equals(highSpeedOnly) || "true".equalsIgnoreCase(highSpeedOnly);
    }
    List<Map<String, Object>> data = trainService.listForUser(from, to, date, hs);
    String tt = ticketType != null ? ticketType : "normal";
    return ApiResponse.ok(data, Collections.singletonMap("ticketType", tt));
  }
}

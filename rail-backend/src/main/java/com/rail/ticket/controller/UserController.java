package com.rail.ticket.controller;

import com.rail.ticket.common.ApiResponse;
import com.rail.ticket.dto.LoginRequest;
import com.rail.ticket.dto.RegisterRequest;
import com.rail.ticket.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/login")
  public ApiResponse<Map<String, Object>> login(@RequestBody LoginRequest req) {
    return ApiResponse.ok(userService.login(req));
  }

  @PostMapping("/register")
  public ApiResponse<Map<String, Object>> register(@RequestBody RegisterRequest req) {
    return ApiResponse.ok(userService.register(req));
  }

  @GetMapping("/profile")
  public ApiResponse<Map<String, Object>> profile(HttpServletRequest request) {
    long userId = (Long) request.getAttribute("userId");
    return ApiResponse.ok(userService.getProfile(userId));
  }

  @PutMapping("/profile")
  public ApiResponse<Map<String, Object>> updateProfile(HttpServletRequest request, @RequestBody Map<String, String> body) {
    long userId = (Long) request.getAttribute("userId");
    return ApiResponse.ok(userService.updateProfile(userId, body.get("phone"), body.get("idCard")));
  }
}

package com.rail.ticket.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rail.ticket.common.ApiResponse;
import io.jsonwebtoken.Claims;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final ObjectMapper objectMapper = new ObjectMapper();

  public JwtAuthFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  private static boolean isPublic(String uri) {
    return uri.startsWith("/api/user/login")
        || uri.startsWith("/api/user/register")
        || uri.startsWith("/api/train/");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String uri = request.getRequestURI();
    if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || isPublic(uri)) {
      chain.doFilter(request, response);
      return;
    }
    if (!uri.startsWith("/api/")) {
      chain.doFilter(request, response);
      return;
    }
    String auth = request.getHeader("Authorization");
    if (auth == null || !auth.startsWith("Bearer ")) {
      writeJson(response, 401, "未登录或 token 无效");
      return;
    }
    try {
      Claims c = jwtUtil.parse(auth.substring(7));
      request.setAttribute("userId", ((Number) c.get("userId")).longValue());
      request.setAttribute("username", (String) c.get("username"));
      request.setAttribute("role", (String) c.get("role"));
    } catch (Exception e) {
      writeJson(response, 401, "登录已过期，请重新登录");
      return;
    }
    if (uri.contains("/api/admin/") && !"admin".equals(request.getAttribute("role"))) {
      writeJson(response, 403, "无权限");
      return;
    }
    chain.doFilter(request, response);
  }

  private void writeJson(HttpServletResponse response, int code, String message) throws IOException {
    response.setStatus(200);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    response.getWriter().write(objectMapper.writeValueAsString(new ApiResponse<>(code, message, null, null)));
  }
}

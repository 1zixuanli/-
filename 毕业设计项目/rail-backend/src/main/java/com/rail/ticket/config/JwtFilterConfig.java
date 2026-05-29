package com.rail.ticket.config;

import com.rail.ticket.security.JwtAuthFilter;
import com.rail.ticket.security.JwtUtil;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * 显式注册 JWT 过滤器，避免仅 @Component 时顺序不确定；仅拦截 /api/*
 */
@Configuration
public class JwtFilterConfig {

  @Bean
  public JwtAuthFilter jwtAuthFilter(JwtUtil jwtUtil) {
    return new JwtAuthFilter(jwtUtil);
  }

  @Bean
  public FilterRegistrationBean<JwtAuthFilter> jwtFilterRegistration(JwtAuthFilter filter) {
    FilterRegistrationBean<JwtAuthFilter> reg = new FilterRegistrationBean<>();
    reg.setFilter(filter);
    reg.addUrlPatterns("/api/*");
    reg.setOrder(Ordered.HIGHEST_PRECEDENCE + 20);
    return reg;
  }
}

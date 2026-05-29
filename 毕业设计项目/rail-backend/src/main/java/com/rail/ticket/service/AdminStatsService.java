package com.rail.ticket.service;

import com.rail.ticket.entity.RailOrder;
import com.rail.ticket.entity.SysUser;
import com.rail.ticket.mapper.RailOrderMapper;
import com.rail.ticket.mapper.SysUserMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminStatsService {

  private final RailOrderMapper orderMapper;
  private final SysUserMapper userMapper;

  public AdminStatsService(RailOrderMapper orderMapper, SysUserMapper userMapper) {
    this.orderMapper = orderMapper;
    this.userMapper = userMapper;
  }

  public Map<String, Object> stats() {
    List<RailOrder> all = orderMapper.listAll();
    long unpaid = all.stream().filter(o -> "unpaid".equals(o.getStatus())).count();
    long paid = all.stream().filter(o -> "paid".equals(o.getStatus())).count();
    long cancelled = all.stream().filter(o -> "cancelled".equals(o.getStatus())).count();
    long refunded = all.stream().filter(o -> "refunded".equals(o.getStatus())).count();
    long revenue = all.stream()
        .filter(o -> "paid".equals(o.getStatus()) || "completed".equals(o.getStatus()))
        .mapToLong(o -> o.getPrice() != null ? o.getPrice() : 0)
        .sum();
    Map<String, Object> m = new HashMap<>();
    m.put("orderTotal", all.size());
    m.put("unpaid", unpaid);
    m.put("paid", paid);
    m.put("cancelled", cancelled);
    m.put("refunded", refunded);
    m.put("revenue", revenue);
    m.put("userCount", userMapper.count());
    return m;
  }

  public List<SysUser> listUsers() {
    return userMapper.listAll();
  }
}

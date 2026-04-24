package com.rail.ticket.service;

import com.rail.ticket.common.BizException;
import com.rail.ticket.dto.LoginRequest;
import com.rail.ticket.dto.RegisterRequest;
import com.rail.ticket.entity.SysUser;
import com.rail.ticket.mapper.SysUserMapper;
import com.rail.ticket.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

  private final SysUserMapper userMapper;
  private final JwtUtil jwtUtil;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public UserService(SysUserMapper userMapper, JwtUtil jwtUtil) {
    this.userMapper = userMapper;
    this.jwtUtil = jwtUtil;
  }

  public Map<String, Object> login(LoginRequest req) {
    if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
      throw new BizException("请输入用户名");
    }
    if (req.getPassword() == null || req.getPassword().isEmpty()) {
      throw new BizException("请输入密码");
    }
    SysUser u = userMapper.findByUsername(req.getUsername().trim());
    if (u == null) {
      throw new BizException("用户名或密码错误");
    }
    if (!encoder.matches(req.getPassword(), u.getPassword())) {
      throw new BizException("用户名或密码错误");
    }
    String token = jwtUtil.createToken(u.getId(), u.getUsername(), u.getRole());
    Map<String, Object> data = new HashMap<>();
    data.put("token", token);
    data.put("userId", u.getId());
    data.put("username", u.getUsername());
    data.put("role", u.getRole());
    return data;
  }

  public Map<String, Object> register(RegisterRequest req) {
    String username = req.getUsername() != null ? req.getUsername().trim() : "";
    if (username.length() < 3 || username.length() > 20) {
      throw new BizException("用户名 3～20 位");
    }
    if ("admin".equalsIgnoreCase(username)) {
      throw new BizException("该用户名不可注册");
    }
    if (req.getPassword() == null || req.getPassword().length() < 6 || req.getPassword().length() > 20) {
      throw new BizException("密码 6～20 位");
    }
    if (req.getPhone() == null || !req.getPhone().trim().matches("^1\\d{10}$")) {
      throw new BizException("手机号格式不正确");
    }
    if (userMapper.findByUsername(username) != null) {
      throw new BizException("用户名已存在");
    }
    if (userMapper.findByPhone(req.getPhone().trim()) != null) {
      throw new BizException("手机号已被注册");
    }
    SysUser u = new SysUser();
    u.setUsername(username);
    u.setPassword(encoder.encode(req.getPassword()));
    u.setPhone(req.getPhone().trim());
    u.setIdCard(req.getIdCard() != null ? req.getIdCard().trim() : "");
    u.setRole("user");
    userMapper.insert(u);
    Map<String, Object> data = new HashMap<>();
    data.put("userId", u.getId());
    data.put("username", u.getUsername());
    return data;
  }

  public Map<String, Object> getProfile(long userId) {
    SysUser u = userMapper.findById(userId);
    if (u == null) {
      throw new BizException("用户不存在");
    }
    Map<String, Object> m = new HashMap<>();
    m.put("userId", u.getId());
    m.put("username", u.getUsername());
    m.put("phone", u.getPhone() != null ? u.getPhone() : "");
    m.put("idCard", u.getIdCard() != null ? u.getIdCard() : "");
    return m;
  }

  public Map<String, Object> updateProfile(long userId, String phone, String idCard) {
    if (phone != null && !phone.trim().isEmpty() && !phone.trim().matches("^1\\d{10}$")) {
      throw new BizException("手机号格式不正确");
    }
    SysUser u = userMapper.findById(userId);
    if (u == null) {
      throw new BizException("用户不存在");
    }
    String p = phone != null ? phone.trim() : u.getPhone();
    String idc = idCard != null ? idCard.trim() : (u.getIdCard() != null ? u.getIdCard() : "");
    userMapper.updateProfile(userId, p, idc);
    Map<String, Object> m = new HashMap<>();
    m.put("phone", p);
    m.put("idCard", idc);
    return m;
  }
}

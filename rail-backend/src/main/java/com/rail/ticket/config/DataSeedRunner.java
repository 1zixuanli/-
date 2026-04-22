package com.rail.ticket.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rail.ticket.entity.RailTrain;
import com.rail.ticket.entity.RailTrainSeat;
import com.rail.ticket.entity.SysUser;
import com.rail.ticket.mapper.RailTrainMapper;
import com.rail.ticket.mapper.RailTrainSeatMapper;
import com.rail.ticket.mapper.SysUserMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
@Order(1)
public class DataSeedRunner implements CommandLineRunner {

  private final SysUserMapper userMapper;
  private final RailTrainMapper trainMapper;
  private final RailTrainSeatMapper seatMapper;
  private final ObjectMapper objectMapper = new ObjectMapper();
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public DataSeedRunner(SysUserMapper userMapper, RailTrainMapper trainMapper, RailTrainSeatMapper seatMapper) {
    this.userMapper = userMapper;
    this.trainMapper = trainMapper;
    this.seatMapper = seatMapper;
  }

  @Override
  public void run(String... args) throws Exception {
    if (userMapper.count() == 0) {
      SysUser admin = new SysUser();
      admin.setUsername("admin");
      admin.setPassword(encoder.encode("admin123"));
      admin.setPhone("13800000000");
      admin.setIdCard("");
      admin.setRole("admin");
      userMapper.insert(admin);

      SysUser demo = new SysUser();
      demo.setUsername("demo");
      demo.setPassword(encoder.encode("demo123"));
      demo.setPhone("13900000000");
      demo.setIdCard("");
      demo.setRole("user");
      userMapper.insert(demo);
    }

    if (trainMapper.countActive() == 0) {
      InputStream in = getClass().getClassLoader().getResourceAsStream("trains-seed.json");
      if (in == null) {
        return;
      }
      List<Map<String, Object>> trains = objectMapper.readValue(in, new TypeReference<List<Map<String, Object>>>() {});
      for (Map<String, Object> row : trains) {
        RailTrain t = new RailTrain();
        t.setTrainId((String) row.get("trainId"));
        t.setTrainNo((String) row.get("trainNo"));
        t.setFromStation((String) row.get("fromStation"));
        t.setToStation((String) row.get("toStation"));
        t.setDepartTime((String) row.get("departTime"));
        t.setArriveTime((String) row.get("arriveTime"));
        t.setDuration((String) row.get("duration"));
        trainMapper.insert(t);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> seatTypes = (List<Map<String, Object>>) row.get("seatTypes");
        if (seatTypes != null) {
          for (Map<String, Object> s : seatTypes) {
            RailTrainSeat seat = new RailTrainSeat();
            seat.setTrainId(t.getTrainId());
            seat.setSeatType((String) s.get("seatType"));
            seat.setSeatName((String) s.get("seatName"));
            seat.setPrice(((Number) s.get("price")).intValue());
            seat.setBaseRemain(((Number) s.get("remainCount")).intValue());
            seatMapper.insert(seat);
          }
        }
      }
    }
  }
}

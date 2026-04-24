package com.rail.ticket.service;

import com.rail.ticket.entity.RailTrain;
import com.rail.ticket.entity.RailTrainSeat;
import com.rail.ticket.mapper.RailOrderMapper;
import com.rail.ticket.mapper.RailStockAdjustMapper;
import com.rail.ticket.mapper.RailTrainMapper;
import com.rail.ticket.mapper.RailTrainSeatMapper;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class TrainService {

  private static final Pattern HIGH_SPEED = Pattern.compile("^[GDC].*");

  private final RailTrainMapper trainMapper;
  private final RailTrainSeatMapper seatMapper;
  private final RailOrderMapper orderMapper;
  private final RailStockAdjustMapper stockAdjustMapper;

  public TrainService(RailTrainMapper trainMapper, RailTrainSeatMapper seatMapper,
                      RailOrderMapper orderMapper, RailStockAdjustMapper stockAdjustMapper) {
    this.trainMapper = trainMapper;
    this.seatMapper = seatMapper;
    this.orderMapper = orderMapper;
    this.stockAdjustMapper = stockAdjustMapper;
  }

  public List<Map<String, Object>> listForUser(String from, String to, String dateStr,
                                                Boolean highSpeedOnly) {
    String f = from != null ? from.trim() : "";
    String t = to != null ? to.trim() : "";
    if (f.isEmpty() || t.isEmpty()) {
      return Collections.emptyList();
    }
    Date travelDate = Date.valueOf(dateStr != null && dateStr.length() >= 10 ? dateStr.substring(0, 10) : java.time.LocalDate.now().toString());
    List<RailTrain> trains = trainMapper.listByRoute(f, t);
    boolean onlyHs = Boolean.TRUE.equals(highSpeedOnly) || "true".equalsIgnoreCase(String.valueOf(highSpeedOnly)) || "1".equals(String.valueOf(highSpeedOnly));
    List<Map<String, Object>> out = new ArrayList<>();
    for (RailTrain tr : trains) {
      if (onlyHs && !HIGH_SPEED.matcher(tr.getTrainNo()).matches()) {
        continue;
      }
      out.add(buildTrainMap(tr, travelDate));
    }
    out.sort(Comparator.comparing(m -> (String) m.get("departTime")));
    return out;
  }

  private Map<String, Object> buildTrainMap(RailTrain tr, Date travelDate) {
    List<RailTrainSeat> seats = seatMapper.listByTrainId(tr.getTrainId());
    List<Map<String, Object>> seatTypes = new ArrayList<>();
    for (RailTrainSeat s : seats) {
      int sold = orderMapper.sumSoldBySeatDate(tr.getTrainId(), s.getSeatType(), travelDate);
      Integer adj = stockAdjustMapper.getDeltaSum(tr.getTrainId(), s.getSeatType());
      int a = adj != null ? adj : 0;
      int remain = Math.max(0, s.getBaseRemain() - sold + a);
      Map<String, Object> sm = new LinkedHashMap<>();
      sm.put("seatType", s.getSeatType());
      sm.put("seatName", s.getSeatName());
      sm.put("price", s.getPrice());
      sm.put("remainCount", remain);
      seatTypes.add(sm);
    }
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("trainId", tr.getTrainId());
    m.put("trainNo", tr.getTrainNo());
    m.put("fromStation", tr.getFromStation());
    m.put("toStation", tr.getToStation());
    m.put("departTime", tr.getDepartTime());
    m.put("arriveTime", tr.getArriveTime());
    m.put("duration", tr.getDuration());
    m.put("seatTypes", seatTypes);
    return m;
  }

  /** 管理端：当日余票演示（与 Mock 一致用当天日期） */
  public List<Map<String, Object>> listForAdmin() {
    Date today = Date.valueOf(java.time.LocalDate.now().toString());
    List<RailTrain> trains = trainMapper.listAllActive();
    List<Map<String, Object>> out = new ArrayList<>();
    for (RailTrain tr : trains) {
      List<RailTrainSeat> seats = seatMapper.listByTrainId(tr.getTrainId());
      List<Map<String, Object>> seatTypes = new ArrayList<>();
      for (RailTrainSeat s : seats) {
        int sold = orderMapper.sumSoldBySeatDate(tr.getTrainId(), s.getSeatType(), today);
        Integer adj = stockAdjustMapper.getDeltaSum(tr.getTrainId(), s.getSeatType());
        int a = adj != null ? adj : 0;
        int displayRemain = Math.max(0, s.getBaseRemain() - sold + a);
        Map<String, Object> sm = new LinkedHashMap<>();
        sm.put("seatType", s.getSeatType());
        sm.put("seatName", s.getSeatName());
        sm.put("price", s.getPrice());
        sm.put("remainCount", s.getBaseRemain());
        sm.put("baseRemain", s.getBaseRemain());
        sm.put("soldToday", sold);
        sm.put("stockAdjust", a);
        sm.put("displayRemain", displayRemain);
        seatTypes.add(sm);
      }
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("trainId", tr.getTrainId());
      m.put("trainNo", tr.getTrainNo());
      m.put("fromStation", tr.getFromStation());
      m.put("toStation", tr.getToStation());
      m.put("departTime", tr.getDepartTime());
      m.put("arriveTime", tr.getArriveTime());
      m.put("duration", tr.getDuration());
      m.put("seatTypes", seatTypes);
      out.add(m);
    }
    return out;
  }

  public List<Map<String, Object>> trainManifest() {
    List<RailTrain> trains = trainMapper.listAllActive();
    List<Map<String, Object>> out = new ArrayList<>();
    for (RailTrain tr : trains) {
      List<RailTrainSeat> seats = seatMapper.listByTrainId(tr.getTrainId());
      List<Map<String, Object>> seatTypes = new ArrayList<>();
      for (RailTrainSeat s : seats) {
        Map<String, Object> sm = new LinkedHashMap<>();
        sm.put("seatType", s.getSeatType());
        sm.put("seatName", s.getSeatName());
        sm.put("price", s.getPrice());
        sm.put("remainCount", s.getBaseRemain());
        seatTypes.add(sm);
      }
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("trainId", tr.getTrainId());
      m.put("trainNo", tr.getTrainNo());
      m.put("fromStation", tr.getFromStation());
      m.put("toStation", tr.getToStation());
      m.put("departTime", tr.getDepartTime());
      m.put("arriveTime", tr.getArriveTime());
      m.put("duration", tr.getDuration());
      m.put("seatTypes", seatTypes);
      out.add(m);
    }
    return out;
  }
}

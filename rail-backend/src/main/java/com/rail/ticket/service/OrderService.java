package com.rail.ticket.service;

import com.rail.ticket.common.BizException;
import com.rail.ticket.dto.CreateOrderRequest;
import com.rail.ticket.dto.OrderIdRequest;
import com.rail.ticket.entity.RailOrder;
import com.rail.ticket.entity.RailTrain;
import com.rail.ticket.entity.RailTrainSeat;
import com.rail.ticket.mapper.RailOrderMapper;
import com.rail.ticket.mapper.RailStockAdjustMapper;
import com.rail.ticket.mapper.RailTrainMapper;
import com.rail.ticket.mapper.RailTrainSeatMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

  public static final String SOLD_OUT_MSG = "当前车票已售完，无法预定";

  private final RailOrderMapper orderMapper;
  private final RailTrainMapper trainMapper;
  private final RailTrainSeatMapper seatMapper;
  private final RailStockAdjustMapper stockAdjustMapper;

  public OrderService(RailOrderMapper orderMapper, RailTrainMapper trainMapper,
                      RailTrainSeatMapper seatMapper, RailStockAdjustMapper stockAdjustMapper) {
    this.orderMapper = orderMapper;
    this.trainMapper = trainMapper;
    this.seatMapper = seatMapper;
    this.stockAdjustMapper = stockAdjustMapper;
  }

  private int effectiveRemain(String trainId, String seatType, Date travelDate) {
    RailTrainSeat seat = findSeat(trainId, seatType);
    if (seat == null) {
      return 0;
    }
    int sold = orderMapper.sumSoldBySeatDate(trainId, seatType, travelDate);
    Integer adj = stockAdjustMapper.getDeltaSum(trainId, seatType);
    int a = adj != null ? adj : 0;
    return Math.max(0, seat.getBaseRemain() - sold + a);
  }

  private RailTrainSeat findSeat(String trainId, String seatType) {
    for (RailTrainSeat s : seatMapper.listByTrainId(trainId)) {
      if (seatType.equals(s.getSeatType())) {
        return s;
      }
    }
    return null;
  }

  private int unitPriceForTicket(int base, String ticketType) {
    if ("student".equals(ticketType)) {
      return (int) Math.round(base * 0.75);
    }
    if ("group".equals(ticketType)) {
      return (int) Math.round(base * 0.95);
    }
    return base;
  }

  @Transactional(rollbackFor = Exception.class)
  public Map<String, Object> createOrder(long userId, String username, CreateOrderRequest body) {
    RailTrain train = trainMapper.findByTrainId(body.getTrainId());
    if (train == null) {
      throw new BizException("车次不存在");
    }
    String pname = body.getPassengerName() != null ? body.getPassengerName().trim() : "";
    if (pname.length() < 2) {
      throw new BizException("请填写乘车人姓名（至少 2 字）");
    }
    int qty = Math.max(1, body.getQuantity() != null ? body.getQuantity() : 1);
    Date travelDate = Date.valueOf(body.getTravelDate().substring(0, 10));
    int remain = effectiveRemain(body.getTrainId(), body.getSeatType(), travelDate);
    if (remain <= 0 || qty > remain) {
      throw new BizException(SOLD_OUT_MSG);
    }
    RailTrainSeat seat = findSeat(body.getTrainId(), body.getSeatType());
    if (seat == null) {
      throw new BizException("席别不存在");
    }
    String ticketType = body.getTicketType() != null ? body.getTicketType() : "normal";
    int unitPrice = unitPriceForTicket(seat.getPrice(), ticketType);
    int total = unitPrice * qty;

    String orderId = "ORD" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 5);
    Calendar cal = Calendar.getInstance();
    cal.add(Calendar.MINUTE, 30);
    java.util.Date payDeadline = cal.getTime();

    RailOrder o = new RailOrder();
    o.setOrderId(orderId);
    o.setUserId(userId);
    o.setUsername(username);
    o.setTrainId(body.getTrainId());
    o.setTrainNo(body.getTrainNo() != null ? body.getTrainNo() : train.getTrainNo());
    o.setFromStation(body.getFromStation() != null ? body.getFromStation() : train.getFromStation());
    o.setToStation(body.getToStation() != null ? body.getToStation() : train.getToStation());
    o.setTravelDate(travelDate);
    o.setDepartTime(body.getDepartTime() != null ? body.getDepartTime() : train.getDepartTime());
    o.setArriveTime(body.getArriveTime() != null ? body.getArriveTime() : train.getArriveTime());
    o.setDuration(train.getDuration());
    o.setSeatType(body.getSeatType());
    o.setSeatName(seat.getSeatName());
    o.setQuantity(qty);
    o.setUnitPrice(unitPrice);
    o.setPrice(total);
    o.setPassengerName(pname);
    o.setIdCard(body.getIdCard() != null ? body.getIdCard().trim() : "");
    o.setTicketType(ticketType);
    o.setStatus("unpaid");
    o.setPayDeadline(payDeadline);
    o.setCreatedAt(new java.util.Date());

    int again = effectiveRemain(body.getTrainId(), body.getSeatType(), travelDate);
    if (qty > again) {
      throw new BizException(SOLD_OUT_MSG);
    }
    orderMapper.insert(o);

    Map<String, Object> data = new HashMap<>();
    data.put("orderId", orderId);
    data.put("order", toOrderMap(o));
    return data;
  }

  private Map<String, Object> toOrderMap(RailOrder o) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("orderId", o.getOrderId());
    m.put("userId", o.getUserId());
    m.put("username", o.getUsername());
    m.put("trainId", o.getTrainId());
    m.put("trainNo", o.getTrainNo());
    m.put("fromStation", o.getFromStation());
    m.put("toStation", o.getToStation());
    m.put("travelDate", o.getTravelDate().toString());
    m.put("departTime", o.getDepartTime());
    m.put("arriveTime", o.getArriveTime());
    m.put("duration", o.getDuration());
    m.put("seatType", o.getSeatType());
    m.put("seatName", o.getSeatName());
    m.put("quantity", o.getQuantity());
    m.put("unitPrice", o.getUnitPrice());
    m.put("price", o.getPrice());
    m.put("passengerName", o.getPassengerName());
    m.put("idCard", o.getIdCard());
    m.put("ticketType", o.getTicketType());
    m.put("status", o.getStatus());
    m.put("payDeadline", formatIso(o.getPayDeadline()));
    m.put("createdAt", formatIso(o.getCreatedAt()));
    return m;
  }

  private String formatIso(java.util.Date d) {
    if (d == null) {
      return null;
    }
    return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(d);
  }

  public List<Map<String, Object>> listForUser(long userId) {
    return orderMapper.listByUser(userId).stream().map(this::toOrderMap).collect(Collectors.toList());
  }

  public List<Map<String, Object>> listAll() {
    return orderMapper.listAll().stream().map(this::toOrderMap).collect(Collectors.toList());
  }

  @Transactional(rollbackFor = Exception.class)
  public void cancel(long userId, OrderIdRequest req) {
    RailOrder o = orderMapper.findById(req.getOrderId());
    if (o == null || !o.getUserId().equals(userId)) {
      throw new BizException("订单不存在");
    }
    if ("cancelled".equals(o.getStatus()) || "refunded".equals(o.getStatus())) {
      throw new BizException("订单已关闭");
    }
    if ("paid".equals(o.getStatus()) || "completed".equals(o.getStatus())) {
      throw new BizException("请使用退票功能");
    }
    orderMapper.updateStatus(req.getOrderId(), "cancelled");
  }

  @Transactional(rollbackFor = Exception.class)
  public void pay(long userId, OrderIdRequest req) {
    RailOrder o = orderMapper.findById(req.getOrderId());
    if (o == null || !o.getUserId().equals(userId)) {
      throw new BizException("订单不存在");
    }
    if (!"unpaid".equals(o.getStatus())) {
      throw new BizException("仅待支付订单可支付");
    }
    orderMapper.markPaid(req.getOrderId());
  }

  @Transactional(rollbackFor = Exception.class)
  public void complete(long userId, OrderIdRequest req) {
    RailOrder o = orderMapper.findById(req.getOrderId());
    if (o == null || !o.getUserId().equals(userId)) {
      throw new BizException("订单不存在");
    }
    if (!"paid".equals(o.getStatus())) {
      throw new BizException("仅已支付订单可确认出行");
    }
    orderMapper.markCompleted(req.getOrderId());
  }

  @Transactional(rollbackFor = Exception.class)
  public void refund(long userId, OrderIdRequest req) {
    RailOrder o = orderMapper.findById(req.getOrderId());
    if (o == null || !o.getUserId().equals(userId)) {
      throw new BizException("订单不存在");
    }
    if (!"paid".equals(o.getStatus()) && !"completed".equals(o.getStatus())) {
      throw new BizException("仅已支付或已完成订单可退票");
    }
    orderMapper.markRefunded(req.getOrderId());
  }

  public List<Map<String, Object>> salesByTrain() {
    List<RailOrder> orders = orderMapper.listAll().stream()
        .filter(o -> "unpaid".equals(o.getStatus()) || "paid".equals(o.getStatus()) || "completed".equals(o.getStatus()))
        .collect(Collectors.toList());
    Map<String, Integer> map = new HashMap<>();
    for (RailOrder o : orders) {
      String k = o.getTrainNo() + "|" + o.getFromStation() + "|" + o.getToStation();
      map.merge(k, o.getQuantity(), Integer::sum);
    }
    List<Map<String, Object>> data = new ArrayList<>();
    for (Map.Entry<String, Integer> e : map.entrySet()) {
      String[] parts = e.getKey().split("\\|", 3);
      Map<String, Object> row = new LinkedHashMap<>();
      row.put("trainNo", parts[0]);
      row.put("fromStation", parts.length > 1 ? parts[1] : "");
      row.put("toStation", parts.length > 2 ? parts[2] : "");
      row.put("count", e.getValue());
      data.add(row);
    }
    data.sort((a, b) -> Integer.compare((Integer) b.get("count"), (Integer) a.get("count")));
    return data;
  }
}

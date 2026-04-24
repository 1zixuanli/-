package com.rail.ticket.service;

import com.rail.ticket.common.BizException;
import com.rail.ticket.dto.AddTrainRequest;
import com.rail.ticket.entity.RailTrain;
import com.rail.ticket.entity.RailTrainSeat;
import com.rail.ticket.mapper.RailTrainMapper;
import com.rail.ticket.mapper.RailTrainSeatMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrainAdminService {

  private final RailTrainMapper trainMapper;
  private final RailTrainSeatMapper seatMapper;

  public TrainAdminService(RailTrainMapper trainMapper, RailTrainSeatMapper seatMapper) {
    this.trainMapper = trainMapper;
    this.seatMapper = seatMapper;
  }

  @Transactional(rollbackFor = Exception.class)
  public void addTrain(AddTrainRequest req) {
    String tid = req.getTrainId() != null ? req.getTrainId().trim() : "";
    if (tid.isEmpty()) {
      throw new BizException("车次ID不能为空");
    }
    if (trainMapper.findByTrainId(tid) != null) {
      throw new BizException("车次ID已存在");
    }
    RailTrain t = new RailTrain();
    t.setTrainId(tid);
    t.setTrainNo(req.getTrainNo().trim());
    t.setFromStation(req.getFromStation().trim());
    t.setToStation(req.getToStation().trim());
    t.setDepartTime(req.getDepartTime() != null ? req.getDepartTime().trim() : "08:00");
    t.setArriveTime(req.getArriveTime() != null ? req.getArriveTime().trim() : "10:00");
    t.setDuration(req.getDuration() != null ? req.getDuration().trim() : "—");
    trainMapper.insert(t);

    int p2 = req.getP2() != null ? req.getP2() : 200;
    int p1 = req.getP1() != null ? req.getP1() : 320;
    int pb = req.getPb() != null ? req.getPb() : 600;
    int s2 = req.getS2() != null ? req.getS2() : 50;
    int s1 = req.getS1() != null ? req.getS1() : 10;
    int sb = req.getSb() != null ? req.getSb() : 2;
    int sn = req.getSn() != null ? req.getSn() : 80;
    int nonePrice = (int) Math.round(p2 * 0.52);

    insertSeat(tid, "second", "二等座", p2, s2);
    insertSeat(tid, "first", "一等座", p1, s1);
    insertSeat(tid, "business", "商务座", pb, sb);
    insertSeat(tid, "none", "无座", nonePrice, sn);
  }

  private void insertSeat(String trainId, String type, String name, int price, int remain) {
    RailTrainSeat s = new RailTrainSeat();
    s.setTrainId(trainId);
    s.setSeatType(type);
    s.setSeatName(name);
    s.setPrice(price);
    s.setBaseRemain(remain);
    seatMapper.insert(s);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteTrain(String trainId) {
    if (trainMapper.findByTrainId(trainId) == null) {
      throw new BizException("车次不存在");
    }
    trainMapper.softDelete(trainId);
    seatMapper.deleteByTrainId(trainId);
  }
}

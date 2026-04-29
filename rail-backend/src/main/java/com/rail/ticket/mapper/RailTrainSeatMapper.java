package com.rail.ticket.mapper;

import com.rail.ticket.entity.RailTrainSeat;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RailTrainSeatMapper {

  @Select("SELECT * FROM rail_train_seat WHERE train_id = #{trainId} ORDER BY FIELD(seat_type,'second','first','business','none')")
  List<RailTrainSeat> listByTrainId(String trainId);

  @Insert("INSERT INTO rail_train_seat(train_id, seat_type, seat_name, price, base_remain) VALUES(#{trainId}, #{seatType}, #{seatName}, #{price}, #{baseRemain})")
  int insert(RailTrainSeat seat);

  @Delete("DELETE FROM rail_train_seat WHERE train_id = #{trainId}")
  int deleteByTrainId(String trainId);
}

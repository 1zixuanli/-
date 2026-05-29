package com.rail.ticket.mapper;

import org.apache.ibatis.annotations.*;

@Mapper
public interface RailStockAdjustMapper {

  @Select("SELECT COALESCE(delta_sum, 0) FROM rail_stock_adjust WHERE train_id = #{trainId} AND seat_type = #{seatType}")
  Integer getDeltaSum(@Param("trainId") String trainId, @Param("seatType") String seatType);

  @Insert("INSERT INTO rail_stock_adjust(train_id, seat_type, delta_sum) VALUES(#{trainId}, #{seatType}, #{delta}) " +
      "ON DUPLICATE KEY UPDATE delta_sum = delta_sum + #{delta}")
  int addDelta(@Param("trainId") String trainId, @Param("seatType") String seatType, @Param("delta") int delta);
}

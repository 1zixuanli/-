package com.rail.ticket.mapper;

import com.rail.ticket.entity.RailTrain;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RailTrainMapper {

  @Select("SELECT COUNT(*) FROM rail_train WHERE is_deleted = 0")
  long countActive();

  @Select("SELECT * FROM rail_train WHERE train_id = #{trainId} AND is_deleted = 0")
  RailTrain findByTrainId(String trainId);

  @Select("SELECT * FROM rail_train WHERE from_station = #{from} AND to_station = #{to} AND is_deleted = 0 ORDER BY depart_time")
  List<RailTrain> listByRoute(@Param("from") String from, @Param("to") String to);

  @Insert("INSERT INTO rail_train(train_id, train_no, from_station, to_station, depart_time, arrive_time, duration, is_deleted) " +
      "VALUES(#{trainId}, #{trainNo}, #{fromStation}, #{toStation}, #{departTime}, #{arriveTime}, #{duration}, 0)")
  int insert(RailTrain train);

  @Update("UPDATE rail_train SET is_deleted = 1 WHERE train_id = #{trainId}")
  int softDelete(String trainId);

  @Select("SELECT * FROM rail_train WHERE is_deleted = 0 ORDER BY from_station, to_station, depart_time")
  List<RailTrain> listAllActive();
}

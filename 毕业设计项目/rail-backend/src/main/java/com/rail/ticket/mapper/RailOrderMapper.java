package com.rail.ticket.mapper;

import com.rail.ticket.entity.RailOrder;
import org.apache.ibatis.annotations.*;

import java.sql.Date;
import java.util.List;

@Mapper
public interface RailOrderMapper {

  @Insert("INSERT INTO rail_order(order_id, user_id, username, train_id, train_no, from_station, to_station, travel_date, " +
      "depart_time, arrive_time, duration, seat_type, seat_name, quantity, unit_price, price, passenger_name, id_card, ticket_type, status, pay_deadline, created_at) " +
      "VALUES(#{orderId}, #{userId}, #{username}, #{trainId}, #{trainNo}, #{fromStation}, #{toStation}, #{travelDate}, " +
      "#{departTime}, #{arriveTime}, #{duration}, #{seatType}, #{seatName}, #{quantity}, #{unitPrice}, #{price}, #{passengerName}, #{idCard}, #{ticketType}, #{status}, #{payDeadline}, #{createdAt})")
  int insert(RailOrder order);

  @Select("SELECT * FROM rail_order WHERE user_id = #{userId} ORDER BY created_at DESC")
  List<RailOrder> listByUser(Long userId);

  @Select("SELECT * FROM rail_order ORDER BY created_at DESC")
  List<RailOrder> listAll();

  @Select("SELECT * FROM rail_order WHERE order_id = #{orderId}")
  RailOrder findById(String orderId);

  @Select("SELECT COALESCE(SUM(quantity), 0) FROM rail_order WHERE train_id = #{trainId} AND seat_type = #{seatType} AND travel_date = #{travelDate} " +
      "AND status IN ('unpaid', 'paid', 'completed')")
  int sumSoldBySeatDate(@Param("trainId") String trainId, @Param("seatType") String seatType, @Param("travelDate") Date travelDate);

  @Update("UPDATE rail_order SET status = #{status} WHERE order_id = #{orderId}")
  int updateStatus(@Param("orderId") String orderId, @Param("status") String status);

  @Update("UPDATE rail_order SET status = 'paid', paid_at = NOW() WHERE order_id = #{orderId}")
  int markPaid(String orderId);

  @Update("UPDATE rail_order SET status = 'refunded', refunded_at = NOW() WHERE order_id = #{orderId}")
  int markRefunded(String orderId);

  @Update("UPDATE rail_order SET status = 'completed' WHERE order_id = #{orderId}")
  int markCompleted(String orderId);
}

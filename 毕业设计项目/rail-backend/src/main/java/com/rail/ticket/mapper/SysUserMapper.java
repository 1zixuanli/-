package com.rail.ticket.mapper;

import com.rail.ticket.entity.SysUser;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SysUserMapper {

  @Select("SELECT COUNT(*) FROM sys_user")
  long count();

  @Select("SELECT * FROM sys_user ORDER BY id")
  List<SysUser> listAll();

  @Select("SELECT * FROM sys_user WHERE username = #{username}")
  SysUser findByUsername(String username);

  @Select("SELECT * FROM sys_user WHERE id = #{id}")
  SysUser findById(Long id);

  @Select("SELECT * FROM sys_user WHERE phone = #{phone}")
  SysUser findByPhone(String phone);

  @Insert("INSERT INTO sys_user(username, password, phone, id_card, role) VALUES(#{username}, #{password}, #{phone}, #{idCard}, #{role})")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  int insert(SysUser user);

  @Update("UPDATE sys_user SET phone = #{phone}, id_card = #{idCard} WHERE id = #{id}")
  int updateProfile(@Param("id") Long id, @Param("phone") String phone, @Param("idCard") String idCard);
}

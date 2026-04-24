@echo off
chcp 65001 >nul
title 启动 MySQL（无需管理员）
set "INI=D:\mywork\src\tools\mysql84\my.ini"
set "MYSQLD=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"

echo.
echo [1] 检查 mysqld 是否存在...
if not exist "%MYSQLD%" (
  echo [错误] 找不到: %MYSQLD%
  echo 请确认已安装 MySQL 8.4，或把上面路径改成你本机实际路径。
  goto :end
)

echo [2] 检查 3306 端口...
netstat -ano | findstr ":3306 " | findstr LISTENING >nul
if %errorlevel%==0 (
  echo 端口 3306 已在监听，MySQL 多半已经启动，无需再开。
  goto :end
)

echo [3] 正在后台启动 mysqld...
rem 第一个引号是窗口标题；可执行文件路径必须单独用引号包起来
start "" /MIN "%MYSQLD%" --defaults-file="%INI%"

echo 等待 4 秒...
timeout /t 4 /nobreak >nul

netstat -ano | findstr ":3306 " | findstr LISTENING >nul
if %errorlevel%==0 (
  echo [成功] 已在监听 3306，可以启动后端了。
) else (
  echo [失败] 仍未监听 3306。请打开文件夹查看日志:
  echo   D:\mywork\mysql84-data
  echo 找扩展名为 .err 的文件，用记事本打开看最后几行英文错误。
)

:end
echo.
pause

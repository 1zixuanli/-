@echo off
chcp 65001 >nul
title Fix MySQL 8.4 service (run as Administrator)
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo [错误] 请右键本文件 — 以管理员身份运行
  pause
  exit /b 1
)

echo [1/4] 停止旧服务...
sc stop MySQL 2>nul
sc stop MySQL84 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] 删除旧服务名（避免仍指向 D 盘旧 mysqld）...
sc delete MySQL 2>nul
sc delete MySQL84 2>nul
timeout /t 2 /nobreak >nul

echo [3/4] 注册 MySQL 8.4 服务 MySQL84 ...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --install MySQL84 --defaults-file="D:\mywork\src\tools\mysql84\my.ini"
if errorlevel 1 (
  echo mysqld --install 失败
  pause
  exit /b 1
)

echo [4/4] 启动服务...
net start MySQL84
if errorlevel 1 (
  echo net start 失败
  pause
  exit /b 1
)

echo.
echo 完成。数据目录: D:\mywork\mysql84-data
echo 若使用 initialize-insecure，root 首次无密码，请尽快设置密码。
echo.
pause

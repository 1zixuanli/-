# 半自动：生成 reset-root.sql，并提示你手动完成「无密码启动」两步（最稳妥）
# 新密码默认设为 root，公开仓库中不要写个人本机密码
$ErrorActionPreference = 'Stop'
$newPass = 'root'
$out = Join-Path (Split-Path -Parent $PSScriptRoot) 'rail-backend\scripts\reset-root.sql'
$sql = @"
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '$newPass';
FLUSH PRIVILEGES;
"@
Set-Content -Path $out -Value $sql -Encoding UTF8
Write-Host "已写入: $out"
Write-Host ''
Write-Host '请按顺序在本机操作（管理员 PowerShell）：'
Write-Host '1) net stop MySQL   （若服务名是 MySQL80 则: net stop MySQL80）'
Write-Host '2) 进入你本机 mysqld.exe 所在目录的 bin，执行（窗口保持打开）：'
Write-Host '     mysqld --skip-grant-tables --console'
Write-Host '3) 再开一个普通命令行，同目录执行：'
Write-Host "     mysql -u root < `"$out`""
Write-Host '4) 关掉第 2 步的 mysqld 窗口，再执行: net start MySQL'
Write-Host '5) 测试: mysql -h127.0.0.1 -uroot -proot -e "select 1"'
Write-Host ''
Write-Host '若第 3 步报错没有 mysql 命令，请写全路径，例如:'
Write-Host '  "D:\mywork\mysql-5.7.17-winx64\bin\mysql.exe" -u root < "..."'

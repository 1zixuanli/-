# Import rail-backend/scripts/init_rail_ticket.sql into local MySQL
# Usage: MYSQL_ROOT_PASSWORD=xxx OR mysql-password.txt first line
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$sql = Join-Path $root 'rail-backend\scripts\init_rail_ticket.sql'
if (-not (Test-Path $sql)) {
  Write-Host 'Missing SQL. Run: node scripts/gen-mysql-init.mjs'
  exit 1
}

$pw = $env:MYSQL_ROOT_PASSWORD
if (-not $pw) {
  $pf = Join-Path $root 'mysql-password.txt'
  if (Test-Path $pf) {
    $pw = (Get-Content $pf -Raw -Encoding UTF8).Trim()
  }
}
if (-not $pw) {
  Write-Host 'Set MYSQL_ROOT_PASSWORD or create mysql-password.txt with one line (root password).'
  exit 1
}

$candidates = @(
  'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
  'C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe',
  'C:\Program Files\MariaDB 10.11\bin\mysql.exe',
  'C:\xampp\mysql\bin\mysql.exe',
  'D:\mywork\mysql-5.7.17-winx64\bin\mysql.exe'
)
$mysql = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $mysql) {
  Write-Host 'mysql.exe not found. Add your path to $candidates in this script.'
  exit 1
}

Write-Host "mysql client: $mysql"
$sqlText = Get-Content $sql -Raw -Encoding UTF8
$sqlText | & $mysql -h 127.0.0.1 -P 3306 -u root "--password=$pw" --default-character-set=utf8mb4
if ($LASTEXITCODE -ne 0 -and $null -ne $LASTEXITCODE) {
  Write-Host "Import failed (exit $LASTEXITCODE). Check password, port 3306, MySQL running."
  exit $LASTEXITCODE
}
Write-Host 'OK: database rail_ticket imported.'

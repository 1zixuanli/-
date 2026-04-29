# 启动 Spring 后端（需已安装 MySQL 并建好库 rail_ticket，见 rail-backend/README.md）
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$mavenHome = Join-Path $root 'tools\apache-maven-3.9.14'
$mvn = Join-Path $mavenHome 'bin\mvn.cmd'
$pom = Join-Path $root 'rail-backend\pom.xml'

if (-not (Test-Path $mvn)) {
  Write-Host '未找到 Maven，请先运行 scripts\install-tools.ps1'
  exit 1
}

# 优先使用 JDK 17（注册表），否则 JDK 8
$javaHome = $null
try {
  $jdkKey = Get-Item 'HKLM:\SOFTWARE\JavaSoft\JDK' -ErrorAction Stop
  $cur = (Get-ItemProperty $jdkKey.PSPath -ErrorAction Stop).CurrentVersion
  if ($cur) {
    $javaHome = (Get-ItemProperty "HKLM:\SOFTWARE\JavaSoft\JDK\$cur" -ErrorAction Stop).JavaHome
  }
} catch {}
if (-not $javaHome -or -not (Test-Path $javaHome)) {
  $javaHome = 'C:\Program Files\Java\jdk1.8.0_291'
}
$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"

Write-Host "JAVA_HOME=$env:JAVA_HOME"
& $mvn -f $pom spring-boot:run

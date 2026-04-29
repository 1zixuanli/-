# 下载 Apache Maven 到 tools/（无需单独安装 Maven）
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dest = Join-Path $root 'tools'
$mver = '3.9.14'
$dir = Join-Path $dest "apache-maven-$mver"
$zip = Join-Path $env:TEMP "apache-maven-$mver-bin.zip"
$url = "https://dlcdn.apache.org/maven/maven-3/$mver/binaries/apache-maven-$mver-bin.zip"

if (Test-Path (Join-Path $dir 'bin\mvn.cmd')) {
  Write-Host "Maven 已存在: $dir"
  exit 0
}
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Write-Host "正在下载 Maven $mver ..."
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
Expand-Archive -Path $zip -DestinationPath $dest -Force
Remove-Item $zip -Force
Write-Host "完成: $dir"

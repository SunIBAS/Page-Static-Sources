@echo off
setlocal enabledelayedexpansion

@REM compress_password.txt 文件中写入的是压缩包密码
REM 读取文件内容并将其赋值给变量
for /f "delims=" %%a in (compress_password.txt) do (
    set "pwd=%%a"
)

REM 输出变量内容
echo !pwd!
7z a -p!pwd! -r -mhe=on -t7z "source_data(mine name).zip" ./apis/apiLeft.json ./apis/apis.json ./datas/all.content.json ./datas/left.json ./sourceGeojson/*
endlocal

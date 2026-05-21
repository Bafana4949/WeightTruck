@echo off
echo ===================================================
echo   TonTrac / WeighTruck - Starting Spring Boot Backend
echo ===================================================
echo.

:: Check if mvn is installed globally
where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Found global Maven installation.
    set MVN_CMD=mvn
) else (
    :: Check if local Maven is already downloaded
    if exist "%~dp0maven\bin\mvn.cmd" (
        echo [INFO] Found local portable Maven installation.
        set MVN_CMD="%~dp0maven\bin\mvn.cmd"
    ) else (
        echo [WARN] Maven was not found in your PATH.
        echo [INFO] Downloading portable Apache Maven 3.9.6 (approx. 9MB)...
        powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip' -OutFile '%~dp0maven.zip'; echo '[INFO] Extracting Maven...'; Expand-Archive -Path '%~dp0maven.zip' -DestinationPath '%~dp0maven_temp'; $extracted = Get-ChildItem -Path '%~dp0maven_temp' -Directory | Select-Object -First 1; Move-Item -Path $extracted.FullName -Destination '%~dp0maven'; Remove-Item -Path '%~dp0maven_temp' -Force; Remove-Item -Path '%~dp0maven.zip' -Force; echo '[INFO] Portable Maven set up successfully!' } catch { echo '[ERROR] Failed to download Maven: $_'; exit 1 }"
        if not exist "%~dp0maven\bin\mvn.cmd" (
            echo.
            echo [ERROR] Failed to set up portable Maven.
            echo Please manually install Maven and add it to your PATH.
            pause
            exit /b 1
        )
        set MVN_CMD="%~dp0maven\bin\mvn.cmd"
    )
)

cd "%~dp0backend"
echo [INFO] Running Spring Boot Backend using %MVN_CMD%...
call %MVN_CMD% spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to start the Spring Boot application.
    echo Please make sure Java 17 is installed and configured on your PATH.
)
pause

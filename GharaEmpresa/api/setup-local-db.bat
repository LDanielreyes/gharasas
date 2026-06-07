@echo off
echo.
echo ========================================================
echo   CONFIGURANDO BASE DE DATOS LOCAL (SQLITE) PARA GHARA
echo ========================================================
echo.
echo Paso 1: Generando Cliente Prisma para SQLite...
call npx prisma generate --schema=prisma/schema.dev.prisma
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] No se pudo generar el cliente. Asegurate de haber detenido el servidor "node app.js" (Ctrl+C).
  pause
  exit /b %errorlevel%
)
echo.
echo Paso 2: Poblando la base de datos con productos de prueba...
call node prisma/seed.js
echo.
echo ========================================================
echo   ¡LISTO! Ahora puedes volver a iniciar: node app.js
echo ========================================================
pause

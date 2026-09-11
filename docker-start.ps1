Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        INICIANDO CONTENEDORES SENA-GDF                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Verificar que Docker Desktop esté corriendo
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker Desktop no está ejecutándose. Por favor ábrelo e intenta nuevamente." -ForegroundColor Red
    exit 1
}

Write-Host "-> Construyendo e iniciando contenedores..." -ForegroundColor Yellow
docker compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n-> Contenedores levantados con éxito!" -ForegroundColor Green
    Write-Host "`nEstado de los servicios:" -ForegroundColor Cyan
    docker compose ps
    Write-Host "`nAcceso a la aplicación:" -ForegroundColor Yellow
    Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  - Backend API: http://localhost:3001/api/test" -ForegroundColor White
    Write-Host "`nPara ver los logs en tiempo real ejecuta: docker compose logs -f" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Hubo un problema al iniciar los contenedores." -ForegroundColor Red
}

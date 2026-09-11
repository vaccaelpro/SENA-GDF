Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        DETENIENDO CONTENEDORES SENA-GDF                " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

docker compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n-> Contenedores y red detenidos correctamente." -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Ocurrió un error al detener los contenedores." -ForegroundColor Red
}

# Script de Deploy para Firebase Hosting
Write-Host "🚀 Iniciando deploy para Firebase Hosting..." -ForegroundColor Green

# Verificar se está logado
Write-Host "`n📋 Verificando autenticação..." -ForegroundColor Yellow
firebase projects:list 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Você precisa fazer login primeiro!" -ForegroundColor Red
    Write-Host "Execute: firebase login" -ForegroundColor Yellow
    exit 1
}

# Configurar projeto
Write-Host "`n⚙️ Configurando projeto..." -ForegroundColor Yellow
firebase use yurin3-fda82

# Fazer deploy
Write-Host "`n📤 Fazendo deploy..." -ForegroundColor Yellow
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Seu site está disponível em:" -ForegroundColor Cyan
    Write-Host "   https://yurin3-fda82.web.app" -ForegroundColor White
    Write-Host "   https://yurin3-fda82.firebaseapp.com" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro no deploy. Verifique as mensagens acima." -ForegroundColor Red
}


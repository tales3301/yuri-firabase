# Script para fazer upload do projeto para o GitHub
param(
    [string]$RepoName = "YuriN3"
)

Write-Host "🚀 Preparando upload para GitHub..." -ForegroundColor Green

# Verificar se o Git está instalado
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não está instalado!" -ForegroundColor Red
    Write-Host "📥 Baixe em: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "📋 Repositório Git já inicializado" -ForegroundColor Yellow
    $reset = Read-Host "Deseja reinicializar? (s/N)"
    if ($reset -eq "s" -or $reset -eq "S") {
        Remove-Item -Recurse -Force .git
        Write-Host "🔄 Reinicializando..." -ForegroundColor Yellow
    }
}

# Inicializar repositório (se necessário)
if (-not (Test-Path .git)) {
    Write-Host "`n📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
}

# Verificar se há mudanças
$status = git status --porcelain
if ($status) {
    Write-Host "`n📝 Adicionando arquivos..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: App Firebase com autenticação e chat IA"
} else {
    Write-Host "ℹ️ Nenhuma mudança para commitar" -ForegroundColor Cyan
}

# Verificar remote
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n🔗 Conectando ao repositório remoto..." -ForegroundColor Yellow
    $repoUrl = "https://github.com/tales3301/$RepoName.git"
    git remote add origin $repoUrl
    Write-Host "✅ Conectado a: $repoUrl" -ForegroundColor Green
} else {
    Write-Host "`n✅ Remote já configurado: $remote" -ForegroundColor Green
    $change = Read-Host "Deseja alterar o remote? (s/N)"
    if ($change -eq "s" -or $change -eq "S") {
        git remote set-url origin "https://github.com/tales3301/$RepoName.git"
    }
}

# Configurar branch main
Write-Host "`n🌿 Configurando branch main..." -ForegroundColor Yellow
git branch -M main

# Push
Write-Host "`n📤 Enviando para o GitHub..." -ForegroundColor Yellow
Write-Host "⚠️ Você precisará fazer login no GitHub na primeira vez" -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Upload concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Seu repositório está em:" -ForegroundColor Cyan
    Write-Host "   https://github.com/tales3301/$RepoName" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro no upload. Verifique:" -ForegroundColor Red
    Write-Host "   1. Se o repositório existe no GitHub" -ForegroundColor Yellow
    Write-Host "   2. Se você tem permissão para fazer push" -ForegroundColor Yellow
    Write-Host "   3. Se suas credenciais estão corretas" -ForegroundColor Yellow
}


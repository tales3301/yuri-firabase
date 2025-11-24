# 📤 Guia para Publicar no GitHub

## 1. Instalar o Git

Se você ainda não tem o Git instalado:

1. Baixe em: https://git-scm.com/download/win
2. Instale com as opções padrão
3. Reinicie o terminal/PowerShell após a instalação

## 2. Configurar o Git (primeira vez)

```bash
git config --global user.name "tales3301"
git config --global user.email "seu-email@exemplo.com"
```

## 3. Criar Repositório no GitHub

1. Acesse: https://github.com/tales3301
2. Clique em "New repository" (ou "+" > "New repository")
3. Nome do repositório: `YuriN3` (ou outro nome de sua preferência)
4. Deixe como **Público** ou **Privado** (sua escolha)
5. **NÃO** marque "Initialize with README"
6. Clique em "Create repository"

## 4. Fazer Upload do Projeto

Depois de instalar o Git e criar o repositório, execute os comandos abaixo:

```bash
# Navegar para a pasta do projeto (se não estiver)
cd C:\Users\Thalysson\Desktop\YuriN3

# Inicializar o repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: App Firebase com autenticação e chat IA"

# Conectar ao repositório remoto (substitua YuriN3 pelo nome que você escolheu)
git remote add origin https://github.com/tales3301/YuriN3.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

## 5. Autenticação

Na primeira vez, o Git pode pedir suas credenciais do GitHub:
- **Username**: tales3301
- **Password**: Use um **Personal Access Token** (não sua senha)

### Como criar um Personal Access Token:

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Marque: `repo` (acesso completo aos repositórios)
4. Gere e copie o token
5. Use esse token como senha quando o Git pedir

## ✅ Alternativa: Usar o Script Automático

Depois de instalar o Git e criar o repositório, você pode executar:

```powershell
.\upload-github.ps1
```

O script pedirá o nome do repositório e fará tudo automaticamente!


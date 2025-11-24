# 🚀 Guia de Deploy no Firebase Hosting

## Passo a Passo para Publicar

### 1. Fazer Login no Firebase

Abra o terminal/PowerShell e execute:

```bash
firebase login
```

Isso abrirá seu navegador para autenticação. Faça login com a mesma conta Google que você usa no Firebase Console.

### 2. Verificar o Projeto

Confirme que está usando o projeto correto:

```bash
firebase use yurin3-fda82
```

### 3. Fazer o Deploy

Execute o comando de deploy:

```bash
firebase deploy --only hosting
```

### 4. Acessar seu Site

Após o deploy, você receberá uma URL como:
```
https://yurin3-fda82.web.app
```
ou
```
https://yurin3-fda82.firebaseapp.com
```

## ⚙️ Configuração

Os arquivos `firebase.json` e `.firebaserc` já estão configurados com:
- Projeto: `yurin3-fda82`
- Diretório público: `.` (raiz do projeto)
- Arquivos ignorados: ZIPs, exemplos, README, etc.

## 🔄 Atualizar o Site

Sempre que fizer alterações, execute novamente:

```bash
firebase deploy --only hosting
```

## 📝 Notas

- O primeiro deploy pode levar alguns minutos
- Certifique-se de que todas as configurações (Firebase e Gemini) estão corretas antes do deploy
- A API key do Gemini ficará visível no código (considere usar variáveis de ambiente em produção)


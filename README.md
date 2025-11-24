# Aplicação Web com Firebase + IA

Aplicação web moderna com autenticação Firebase (email/senha e Google), Firestore para armazenamento de dados e integração com Gemini AI para chat inteligente.

## 🚀 Funcionalidades

- ✅ Autenticação com email e senha
- ✅ Autenticação com Google
- ✅ Registro de novos usuários
- ✅ Armazenamento de dados no Firestore
- ✅ **Chat com IA (Gemini)** 🤖
- ✅ Interface moderna e responsiva
- ✅ CRUD completo de itens

## 📋 Pré-requisitos

1. Conta no Firebase (https://firebase.google.com/)
2. Navegador moderno com suporte a ES6 modules

## 🔧 Configuração

### 1. Criar projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga as instruções para criar seu projeto

### 2. Habilitar Autenticação

1. No console do Firebase, vá em **Authentication**
2. Clique em **Get Started**
3. Habilite os seguintes métodos de autenticação:
   - **Email/Password**: Ative a opção
   - **Google**: Ative e configure (você precisará de um email de suporte)

### 3. Criar banco de dados Firestore

1. No console do Firebase, vá em **Firestore Database**
2. Clique em **Create database**
3. Escolha o modo de produção ou teste
4. Selecione uma localização para o banco de dados

### 4. Configurar regras de segurança do Firestore

No console do Firebase, vá em **Firestore Database** > **Rules** e configure:

javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reg```ras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para itens
    match /items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Obter credenciais do Firebase

1. No console do Firebase, vá em **Project Settings** (ícone de engrenagem)
2. Role até a seção **Your apps**
3. Clique no ícone **Web** (`</>`)
4. Registre seu app (ou use um existente)
5. Copie as credenciais do Firebase

### 6. Configurar o projeto

1. Abra o arquivo `firebase-config.js`
2. Substitua as configurações com suas credenciais:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

### 7. Configurar API do Gemini (Chat com IA)

1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key" (é gratuito!)
4. Copie a API key gerada
5. Abra o arquivo `gemini-config.js`
6. Cole sua API key:

```javascript
export const GEMINI_API_KEY = "SUA_API_KEY_AQUI";
```

**Nota:** O chat com IA funcionará apenas após configurar a API key do Gemini.

## 🏃 Como executar

### Opção 1: Servidor local simples

Você pode usar qualquer servidor HTTP local. Exemplos:

**Python:**
```bash
python -m http.server 8000
```

**Node.js (http-server):**
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### Opção 2: Live Server (VS Code)

Se você usa VS Code, instale a extensão "Live Server" e clique com o botão direito no `index.html` > "Open with Live Server"

## 📁 Estrutura do projeto

```
YuriN3/
├── index.html          # Estrutura HTML da aplicação
├── styles.css          # Estilos CSS
├── firebase-config.js  # Configuração do Firebase
├── gemini-config.js    # Configuração da API do Gemini
├── app.js             # Lógica da aplicação
└── README.md          # Este arquivo
```

## 🎨 Funcionalidades da Interface

- **Tela de Autenticação**: Login e registro com abas
- **Dashboard**: Interface para gerenciar itens
- **Chat com IA**: Conversa inteligente com Gemini AI 🤖
- **CRUD de Itens**: Criar, ler e deletar itens
- **Design Responsivo**: Funciona em desktop e mobile

## 🔒 Segurança

- As regras do Firestore garantem que usuários só acessem seus próprios dados
- Senhas são gerenciadas pelo Firebase Authentication
- Autenticação com Google usa OAuth 2.0

## 📝 Notas

- Esta aplicação usa os módulos ES6 do Firebase via CDN
- Não é necessário instalar dependências via npm
- Funciona diretamente no navegador
- A API do Gemini é gratuita para uso moderado (consulte os limites em [Google AI Studio](https://aistudio.google.com/))

## 🐛 Solução de Problemas

### Erro: "Firebase: Error (auth/popup-blocked)"
- Verifique se o popup não está sendo bloqueado pelo navegador
- Permita popups para o site

### Erro: "Firebase: Error (auth/operation-not-allowed)"
- Verifique se os métodos de autenticação estão habilitados no console do Firebase

### Erro: "Permission denied" no Firestore
- Verifique se as regras de segurança estão configuradas corretamente
- Certifique-se de que o usuário está autenticado

### Erro no Chat com IA: "Por favor, configure sua API key"
- Certifique-se de ter configurado a API key no arquivo `gemini-config.js`
- A API key deve ser obtida em [Google AI Studio](https://aistudio.google.com/apikey)

### Chat não responde ou dá erro
- Verifique se a API key do Gemini está correta
- Confirme que você tem créditos disponíveis na sua conta Google AI Studio
- Verifique o console do navegador (F12) para mais detalhes do erro

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.


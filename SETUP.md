# ⚙️ Configuração do Projeto

## 🔐 Credenciais Necessárias

Este projeto requer configuração de credenciais que **NÃO estão incluídas** no repositório por segurança.

### 1. Configurar Firebase

1. Crie um arquivo `firebase-config.js` na raiz do projeto
2. Use `firebase-config.example.js` como base
3. Preencha com suas credenciais do Firebase Console

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

### 2. Configurar Gemini AI (Opcional)

1. Crie um arquivo `gemini-config.js` na raiz do projeto
2. Use `gemini-config.example.js` como base
3. Obtenha sua API key em: https://aistudio.google.com/apikey

```javascript
export const GEMINI_API_KEY = "SUA_API_KEY_AQUI";
```

## 📚 Mais Informações

Consulte o `README.md` para instruções completas de instalação e uso.


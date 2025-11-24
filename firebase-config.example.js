// Arquivo de exemplo - Copie este arquivo para firebase-config.js
// e preencha com suas credenciais do Firebase

// Importar os módulos do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase
// IMPORTANTE: Substitua estas configurações pelas suas credenciais do Firebase
// Você pode encontrar essas credenciais em:
// Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-project-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();



// Importar funções do Firebase
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    query, 
    where,
    orderBy,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db, googleProvider } from './firebase-config.js';
import { GEMINI_API_KEY, GEMINI_API_URL } from './gemini-config.js';

// Elementos do DOM
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addItemForm = document.getElementById('add-item-form');
const itemsList = document.getElementById('items-list');
const logoutBtn = document.getElementById('logout-btn');
const userNameSpan = document.getElementById('user-name');
const googleLoginBtn = document.getElementById('google-login-btn');
const googleRegisterBtn = document.getElementById('google-register-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Variáveis globais
let currentUser = null;

// Verificar estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        showDashboard(user);
    } else {
        currentUser = null;
        showAuthScreen();
    }
});

// Tabs de autenticação
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Atualizar botões
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Atualizar formulários
        authForms.forEach(form => form.classList.remove('active'));
        if (tab === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
        
        // Limpar erros
        clearErrors();
    });
});

// Login com email e senha
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('auth-error');
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // O onAuthStateChanged vai lidar com a mudança de tela
    } catch (error) {
        showError(errorDiv, getErrorMessage(error.code));
    }
});

// Registro com email e senha
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorDiv = document.getElementById('register-error');
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Salvar nome do usuário no Firestore
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            name: name,
            email: email,
            createdAt: serverTimestamp()
        });
        
        // O onAuthStateChanged vai lidar com a mudança de tela
    } catch (error) {
        showError(errorDiv, getErrorMessage(error.code));
    }
});

// Login com Google
googleLoginBtn.addEventListener('click', async () => {
    clearErrors();
    const errorDiv = document.getElementById('auth-error');
    
    try {
        await signInWithPopup(auth, googleProvider);
        // O onAuthStateChanged vai lidar com a mudança de tela
    } catch (error) {
        showError(errorDiv, getErrorMessage(error.code));
    }
});

// Registro com Google
googleRegisterBtn.addEventListener('click', async () => {
    clearErrors();
    const errorDiv = document.getElementById('register-error');
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // Verificar se é um novo usuário e salvar no Firestore
        const userQuery = query(collection(db, 'users'), where('uid', '==', result.user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (userSnapshot.empty) {
            await addDoc(collection(db, 'users'), {
                uid: result.user.uid,
                name: result.user.displayName || 'Usuário Google',
                email: result.user.email,
                createdAt: serverTimestamp()
            });
        }
        
        // O onAuthStateChanged vai lidar com a mudança de tela
    } catch (error) {
        showError(errorDiv, getErrorMessage(error.code));
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        // O onAuthStateChanged vai lidar com a mudança de tela
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
});

// Adicionar item ao Firestore
addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('item-title').value;
    const description = document.getElementById('item-description').value;
    
    if (!currentUser) {
        alert('Você precisa estar logado para adicionar itens');
        return;
    }
    
    try {
        await addDoc(collection(db, 'items'), {
            title: title,
            description: description,
            userId: currentUser.uid,
            createdAt: serverTimestamp()
        });
        
        // Limpar formulário
        addItemForm.reset();
        
        // Recarregar lista
        loadItems();
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item. Tente novamente.');
    }
});

// Carregar itens do Firestore
async function loadItems() {
    if (!currentUser) return;
    
    itemsList.innerHTML = '<p class="empty-state">Carregando...</p>';
    
    try {
        const itemsQuery = query(
            collection(db, 'items'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(itemsQuery);
        
        if (querySnapshot.empty) {
            itemsList.innerHTML = '<p class="empty-state">Nenhum item encontrado. Adicione seu primeiro item!</p>';
            return;
        }
        
        itemsList.innerHTML = '';
        
        querySnapshot.forEach((docSnapshot) => {
            const item = docSnapshot.data();
            const itemElement = createItemElement(docSnapshot.id, item);
            itemsList.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        itemsList.innerHTML = '<p class="empty-state">Erro ao carregar itens. Tente novamente.</p>';
    }
}

// Criar elemento de item
function createItemElement(itemId, item) {
    const div = document.createElement('div');
    div.className = 'item';
    
    const createdAt = item.createdAt?.toDate ? 
        item.createdAt.toDate().toLocaleString('pt-BR') : 
        'Data não disponível';
    
    div.innerHTML = `
        <div class="item-header">
            <div class="item-title">${escapeHtml(item.title)}</div>
            <div class="item-actions">
                <button class="btn-icon btn-delete" data-item-id="${itemId}" title="Excluir">
                    🗑️
                </button>
            </div>
        </div>
        <div class="item-description">${escapeHtml(item.description)}</div>
        <div class="item-meta">Criado em: ${createdAt}</div>
    `;
    
    // Adicionar evento de exclusão
    const deleteBtn = div.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteItem(itemId));
    
    return div;
}

// Deletar item
async function deleteItem(itemId) {
    if (!confirm('Tem certeza que deseja excluir este item?')) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'items', itemId));
        loadItems();
    } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item. Tente novamente.');
    }
}

// Mostrar dashboard
async function showDashboard(user) {
    authScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    // Carregar nome do usuário
    try {
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            userNameSpan.textContent = `Olá, ${userData.name || user.email}!`;
        } else {
            userNameSpan.textContent = `Olá, ${user.displayName || user.email}!`;
        }
    } catch (error) {
        userNameSpan.textContent = `Olá, ${user.email}!`;
    }
    
    // Carregar itens
    loadItems();
}

// Mostrar tela de autenticação
function showAuthScreen() {
    dashboardScreen.classList.remove('active');
    authScreen.classList.add('active');
    
    // Limpar formulários
    loginForm.reset();
    registerForm.reset();
    clearErrors();
}

// Mostrar erro
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

// Limpar erros
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
}

// Traduzir mensagens de erro
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/email-already-in-use': 'Este email já está em uso.',
        'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
        'auth/invalid-email': 'Email inválido.',
        'auth/operation-not-allowed': 'Operação não permitida.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/popup-closed-by-user': 'Popup fechado pelo usuário.',
        'auth/cancelled-popup-request': 'Popup cancelado.',
        'auth/popup-blocked': 'Popup bloqueado pelo navegador.'
    };
    
    return errorMessages[errorCode] || 'Ocorreu um erro. Tente novamente.';
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== CHAT COM IA (GEMINI) ====================

// Enviar mensagem no chat
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Verificar se a API key está configurada
    if (GEMINI_API_KEY === "SUA_API_KEY_AQUI") {
        addChatMessage('bot', '⚠️ Por favor, configure sua API key do Gemini no arquivo gemini-config.js');
        return;
    }
    
    // Adicionar mensagem do usuário
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Mostrar indicador de digitação
    const typingIndicator = showTypingIndicator();
    
    try {
        // Chamar API do Gemini
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });
        
        removeTypingIndicator(typingIndicator);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        const botMessage = data.candidates[0].content.parts[0].text;
        
        addChatMessage('bot', botMessage);
    } catch (error) {
        removeTypingIndicator(typingIndicator);
        console.error('Erro ao chamar Gemini API:', error);
        addChatMessage('bot', '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se sua API key está correta.');
    }
});

// Adicionar mensagem no chat
function addChatMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mostrar indicador de digitação
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return typingDiv;
}

// Remover indicador de digitação
function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}



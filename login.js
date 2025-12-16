// URL do seu Google Apps Script (SUBSTITUA PELA SUA URL)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyLbjOMDiyzS0Vx0iL7ZJcbeNmqFkcsVBAbTB2z879-9Rd78P1r8LiIq66Hcvt8Ccx/exec";

// Função para fazer login
function logar() {
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Validação básica
    if (!login || !senha) {
        alert('Por favor, preencha usuário e senha.');
        return;
    }

    // --- NOVA ABORDAGEM: Submissão de Formulário para contornar CORS ---

    // 1. Criar um formulário dinamicamente
    let form = document.getElementById('loginForm');
    if (!form) {
        form = document.createElement('form');
        form.id = 'loginForm';
        form.method = 'POST';
        form.action = APPS_SCRIPT_URL;
        form.style.display = 'none'; // Esconder o formulário
        document.body.appendChild(form);
    } else {
        // Limpar campos anteriores
        form.innerHTML = '';
    }

    // 2. Adicionar campos de input
    const inputs = [
        { name: 'tipo', value: 'login' },
        { name: 'usuario', value: login },
        { name: 'senha', value: senha }
    ];

    inputs.forEach(data => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = data.name;
        input.value = data.value;
        form.appendChild(input);
    });

    // 3. Armazenar o usuário no localStorage ANTES de submeter
    // O Apps Script irá redirecionar, e o JS da página de destino fará a verificação
    localStorage.setItem('usuarioTentativa', login);

    // 4. Submeter o formulário
    form.submit();

    // O Apps Script irá redirecionar para 'melhoria.html' ou 'login.html?error=...'
}

// Função para fazer logout (mantida)
function logout() {
    // Limpar completamente a sessão
    localStorage.clear();
    sessionStorage.clear();
    
    alert('Você foi desconectado.');
    
    // Limpar o histórico antes de redirecionar
    for (let i = 0; i < 10; i++) {
        history.pushState(null, null, window.location.href);
    }
    
    // Redirecionar para a página de login
    window.location.replace("login.html");
}

// Função para verificar o resultado do login (chamada ao carregar a página)
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const usuarioTentativa = localStorage.getItem('usuarioTentativa');
    const erro = urlParams.get('error');
    const msg = urlParams.get('msg');
    const usuarioRetorno = urlParams.get('usuario');

    // --- Lógica de Pós-Login ---
    
    // 1. Se retornou da tentativa de login com sucesso
    if (usuarioRetorno && usuarioTentativa) {
        // Armazenar a sessão
        localStorage.setItem('usuarioLogado', usuarioTentativa);
        localStorage.setItem('dataLogin', new Date().toISOString());
        localStorage.setItem('sessionToken', 'token_' + Date.now());
        localStorage.removeItem('usuarioTentativa'); // Limpar a tentativa
        
        alert('Login realizado com sucesso!');
        
        // Redirecionar para a página limpa de melhorias
        window.location.replace("melhoria.html");
        return;
    }
    
    // 2. Se retornou da tentativa de login com erro
    if (erro) {
        alert(msg || 'Usuário ou senha incorretos.');
        localStorage.removeItem('usuarioTentativa'); // Limpar a tentativa
        
        // Limpar os parâmetros de erro da URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // Focar no campo de senha
        const senhaInput = document.getElementById('senha');
        if (senhaInput) {
            senhaInput.value = '';
            senhaInput.focus();
        }
        return;
    }

    // --- Lógica de Verificação de Sessão (mantida) ---

    // Verificar se está na página de login e se há uma sessão ativa
    if (window.location.pathname.includes('login.html')) {
        if (usuarioLogado) {
            // Se já está logado, redirecionar para a página de melhorias
            window.location.replace("melhoria.html");
        }
    }
    
    // Prevenir navegação pelo botão voltar (mantida)
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
});

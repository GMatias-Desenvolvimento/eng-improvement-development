// URL do seu Google Apps Script (SUBSTITUA PELA SUA URL)
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyLbjOMDiyzS0Vx0iL7ZJcbeNmqFkcsVBAbTB2z879-9Rd78P1r8LiIq66Hcvt8Ccx/exec";

// Função para fazer login
async function logar() {
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Validação básica
    if (!login || !senha) {
        alert('Por favor, preencha usuário e senha.');
        return;
    }

    // Dados a enviar para o Apps Script
    const data = {
        tipo: "login",
        usuario: login,
        senha: senha
    };

    try {
        // Enviar requisição para o Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
            mode: 'no-cors'
        });

        alert('Processando login...');
        
        // Aguardar um pouco para garantir que o Apps Script processou
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Armazenar a sessão no localStorage com um timestamp
        localStorage.setItem('usuarioLogado', login);
        localStorage.setItem('dataLogin', new Date().toISOString());
        localStorage.setItem('sessionToken', 'token_' + Date.now());

        alert('Login realizado com sucesso!');
        
        // Limpar o histórico antes de redirecionar
        for (let i = 0; i < 10; i++) {
            history.pushState(null, null, window.location.href);
        }
        
        // Redirecionar para a página de melhorias usando replace
        window.location.replace("melhoria.html");

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro ao fazer login. Verifique o console para detalhes.');
    }
}

// Função para fazer logout
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


// URL do Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyLbjOMDiyzS0Vx0iL7ZJcbeNmqFkcsVBAbTB2z879-9Rd78P1r8LiIq66Hcvt8Ccx/exec";

// ===== LOGIN =====
function logar() {
    const login = document.getElementById('login').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!login || !senha) {
        alert('Por favor, preencha usuário e senha.');
        return;
    }

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tipo: "login",
            usuario: login,
            senha: senha
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            localStorage.setItem("usuarioLogado", data.usuario);
            localStorage.setItem("dataLogin", new Date().toISOString());

            alert("Login realizado com sucesso!");
            window.location.replace("melhoria.html");
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    });
}

// ===== LOGOUT =====
function logout() {
    localStorage.clear();
    sessionStorage.clear();
    alert("Você foi desconectado.");
    window.location.replace("login.html");
}

// ===== PROTEÇÃO DE PÁGINA =====
window.addEventListener("load", () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    // Se não estiver logado e tentar acessar melhoria.html
    if (window.location.pathname.includes("melhoria.html") && !usuarioLogado) {
        window.location.replace("login.html");
    }

    // Se já estiver logado e tentar acessar login.html
    if (window.location.pathname.includes("login.html") && usuarioLogado) {
        window.location.replace("melhoria.html");
    }
});

// URL do Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyLbjOMDiyzS0Vx0iL7ZJcbeNmqFkcsVBAbTB2z879-9Rd78P1r8LiIq66Hcvt8Ccx/exec";

// ===== LOGIN =====
function logar() {
    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!login || !senha) {
        alert("Preencha usuário e senha");
        return;
    }

    const body = new URLSearchParams();
    body.append("tipo", "login");
    body.append("usuario", login);
    body.append("senha", senha);

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: body
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            localStorage.setItem("usuarioLogado", data.usuario);
            window.location.href = "melhoria.html";
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Erro de conexão");
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

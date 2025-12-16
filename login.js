// URL do Google Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyLbjOMDiyzS0Vx0iL7ZJcbeNmqFkcsVBAbTB2z879-9Rd78P1r8LiIq66Hcvt8Ccx/exec";

// ===== LOGIN =====
function processarLoginJSON(data) {
  // Blindagem total
  if (!data || !data.usuario || !data.senha) {
    return respostaJSON("error", "Dados inválidos");
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(LOGIN_SHEET_NAME);

  if (!sheet) {
    return respostaJSON("error", "Aba Login não encontrada");
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return respostaJSON("error", "Nenhum usuário cadastrado");
  }

  const values = sheet
    .getRange(2, 1, lastRow - 1, 2)
    .getValues();

  for (let i = 0; i < values.length; i++) {
    const usuario = String(values[i][0]).trim();
    const senha = String(values[i][1]).trim();

    if (usuario === data.usuario && senha === data.senha) {
      return respostaJSON("ok", "Login autorizado", usuario);
    }
  }

  return respostaJSON("error", "Usuário ou senha incorretos");
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

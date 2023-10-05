// Selecione os elementos do DOM
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const formulario = document.querySelector("form");
const mensagemErro = document.getElementById("mensagemErro");

// Adicione um ouvinte de evento para o envio do formulário
formulario.addEventListener('submit', function (event) {
  event.preventDefault(); // Impedir o envio padrão do formulário

  const emailValue = email.value.trim();
  const senhaValue = senha.value.trim();

  realizarLogin(emailValue, senhaValue);
});

// Função para limpar os campos de email e senha
function limpar() {
  email.value = "";
  senha.value = "";
}

// Função para realizar o login
async function realizarLogin(email, senha) {
  try {
    const response = await fetch(`http://localhost:8080/usuarios/login`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      }),
      credentials: 'include'
    });

    if (response.status === 200) {
      console.log("Login realizado com sucesso!");
      window.location.href = "/painel.html";
    } else {
      mensagemErro.textContent = "Email ou senha inválidos.";
      mensagemErro.style.display = "block";
      console.error("Falha na autenticação");
    }
  } catch (error) {
    console.error(error);
  }
}

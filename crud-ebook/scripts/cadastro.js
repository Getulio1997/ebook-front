const formulario = document.querySelector("form");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");

// Adicione um ouvinte de evento para o envio do formulário
formulario.addEventListener('submit', function (event) {
  event.preventDefault(); // Impedir o envio padrão do formulário

  const nomeValue = nome.value.trim();
  const emailValue = email.value.trim();
  const senhaValue = senha.value.trim();

  realizarCadastro(nomeValue, emailValue, senhaValue);
});

// Função para limpar os campos de email e senha
function limpar() {
  nome.value = "";
  email.value = "";
  senha.value = "";
}

// Função para realizar o login
async function realizarCadastro(nome, email, senha) {
  try {
    const response = await fetch(`https://ebookback.onrender.com/cadastro`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        senha
      }),
    });

    if (response.status === 200) {
      console.log("Cadastro realizado com sucesso!");
      window.location.href = "/login.html";
    } else {
      mensagemErro.textContent = "Email já cadastrado!.";
      mensagemErro.style.display = "block";
      console.error("Falha no cadastro");
    }
  } catch (error) {
    console.error(error);
  }
}

const formulario = document.querySelector("form");
const nome = document.querySelector("#nome");
const autor = document.querySelector("#autor");
const genero = document.querySelector("#genero");
const ano = document.querySelector("#ano");

// Adicione um ouvinte de evento para o envio do formulário
formulario.addEventListener('submit', function (event) {
  event.preventDefault(); // Impedir o envio padrão do formulário

  const nomeValue = nome.value.trim();
  const autorValue = autor.value.trim();
  const generoValue = genero.value.trim();
  const anoValue = ano.value.trim();

  realizarCadastro(nomeValue, autorValue, generoValue, anoValue);
});

// Função para limpar os campos de email e senha
function limpar() {
  nome.value = "";
  autor.value = "";
  genero.value = "";
  ano.value = "";
}

// Função para realizar o login
async function realizarCadastro(nome, autor, genero, ano) {
  try {
    const response = await fetch(`http://localhost:8080/livros`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        autor,
        genero,
        ano
      }),
    });

    if (response.status === 200) {
      console.log("Cadastro realizado com sucesso!");
      window.location.href = "/livros/painelLivros.html";
    } else {
      mensagemErro.textContent = "cadastro realizado com sucesso!.";
      mensagemErro.style.display = "block";
      console.error("Falha no cadastro");
    }
  } catch (error) {
    console.error(error);
  }
}

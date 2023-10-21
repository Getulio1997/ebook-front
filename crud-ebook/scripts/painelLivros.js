function listarLivros() {
  fetch("http://localhost:8080/livros")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao listar os livros: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const livros = data;
      const tableBody = document.querySelector("#livrosTable tbody");

      livros.forEach((livro) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${livro.nome}</td>  
                    <td>${livro.autor}</td>
                    <td>${livro.genero}</td>
                    <td>${livro.ano}</td>
                    <td>
                        <a href="/livros/editar.html?id=${livro.id}" class="btn btn-outline-warning">Editar</a>
                        <button class="btn btn-outline-danger excluirLivro" data-id="${livro.id}">Excluir</button>
                    </td>
                `;

        tableBody.appendChild(row);
      });

      const excluirLivroButtons = document.querySelectorAll(".excluirLivro");
      const modal = document.getElementById("modal");
      const confirmButton = document.getElementById("confirmButton");
      const cancelButton = document.getElementById("cancelButton");
      let livroIdToDelete;

      excluirLivroButtons.forEach((button) => {
        button.addEventListener("click", function (event) {
          event.preventDefault();

          const id = button.getAttribute("data-id"); // Obter o 'id' do botão clicado

          if (id) {
            livroIdToDelete = id;
            modal.style.display = "block";
          } else {
            console.error("ID do livro não encontrado no botão de exclusão");
          }
        });
      });

      // Adicione um evento de clique ao botão "Sim" da modal
      confirmButton.addEventListener("click", function () {
        if (livroIdToDelete) {
          excluirLivro(livroIdToDelete);
          modal.style.display = "none";
        }
      });

      // Adicione um evento de clique ao botão "Cancelar" da modal
      cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
  function excluirLivro(id) {
    fetch(`http://localhost:8080/livros/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Exclusão realizada com sucesso!");
          window.location.href = "/livros/painelLivros.html";
        } else {
          console.error("Falha ao excluir, status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir: " + error);
      });
  }
}

// Chame a função listarLivros para carregar a lista de livros quando a página for carregada
listarLivros();

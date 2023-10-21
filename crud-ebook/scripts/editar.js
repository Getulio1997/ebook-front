function carregarDetalhesDoLivro() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    // Certifique-se de que você tem o ID do livro
    if (id) {
        // Agora, você pode fazer uma solicitação para obter os detalhes do livro com esse ID
        fetch(`http://localhost:8080/livros/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar os detalhes do livro: ${response.status}`);
                }
                return response.json();
            })
            .then(livro => {
                // Agora, você tem os detalhes do livro e pode preencher os campos do formulário na página de edição
                document.querySelector('#nome').value = livro.nome;
                document.querySelector('#autor').value = livro.autor;
                document.querySelector('#genero').value = livro.genero;
                document.querySelector('#ano').value = livro.ano;
            })
            .catch(error => {
                console.error(error.message);
            });
    } else {
        console.error('ID do livro não encontrado na URL');
    }
}

const salvarAlteracaoButton = document.getElementById('salvarAlteracao');
salvarAlteracaoButton.addEventListener('click', function (event) {
    event.preventDefault(); // Impedir o comportamento padrão do botão
    const nomeValue = document.querySelector('#nome').value.trim();
    const autorValue = document.querySelector('#autor').value.trim();
    const generoValue = document.querySelector('#genero').value;
    const anoValue = document.querySelector('#ano').value.trim();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // Obtenha o ID novamente

    // Passe o 'id' como um parâmetro para a função salvarAlteracoesDoLivro
    salvarAlteracoesDoLivro(id, nomeValue, autorValue, generoValue, anoValue);
});

function salvarAlteracoesDoLivro(id, nome, autor, genero, ano) {
    // Aqui você pode fazer uma solicitação para salvar as alterações no livro com o ID especificado
    fetch(`http://localhost:8080/livros/${id}`, {
        method: "PUT",
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
    })
        .then(response => {
            if (response.status === 200) {
                console.log("Edição realizada com sucesso!");
                window.location.href = "/livros/painelLivros.html";
            } else {
                console.error("Falha ao editar");
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// Chame a função para carregar os detalhes do livro quando a página for carregada
carregarDetalhesDoLivro();
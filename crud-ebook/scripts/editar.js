let idImagem; 

document.addEventListener("DOMContentLoaded", function () {
    carregarDetalhesDoLivro();
});

function carregarDetalhesDoLivro() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Certifique-se de que você tem o ID do livro
  if (id) {
    // Agora, você pode fazer uma solicitação para obter os detalhes do livro com esse ID
    fetch(`http://localhost:8080/livros/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro ao carregar os detalhes do livro: ${response.status}`
          );
        }
        return response.json();
      })
      .then((livro) => {
        document.querySelector("#nome").value = livro.nome;
        document.querySelector("#autor").value = livro.autor;
        document.querySelector("#genero").value = livro.genero;
        document.querySelector("#ano").value = livro.ano;

        // Obtenha o ID da imagem associada ao livro
        idImagem = livro.idImagem;

        // Verifique se há um ID de imagem
        if (idImagem) {
          // Faça uma solicitação para obter a imagem
          fetch(`http://localhost:8080/upload/imagem/${idImagem}`)
            .then((response) => {
              if (response.ok) {
                return response.blob();
              } else {
                console.error(
                  `Erro ao carregar a imagem do livro: ${response.status}`
                );
              }
            })
            .then((imagemBlob) => {
              const livroImagem = document.getElementById("livroImagem");
              const imgUrl = URL.createObjectURL(imagemBlob);
              livroImagem.src   = imgUrl;
            })
            .catch((error) => {
              console.error(error.message);
            });
        } else {
          console.error("ID da imagem não encontrado para este livro");
        }
      });
  } else {
    console.error("ID do livro não encontrado na URL");
  }
}

let stream;
const cameraFeed = document.getElementById("cameraFeed");

async function startCamera() {
  const constraints = {
    video: true,
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraFeed.srcObject = stream;
    cameraFeed.style.display = "block";
    await cameraFeed.play(); // Inicie o vídeo manualmente
  } catch (error) {
    console.error("Erro ao acessar a câmera: " + error);
  }
}

let imagemCamera; // Variável para armazenar a imagem capturada pela câmera

async function captureFromCamera(nome, autor, genero, ano) {
  if (!stream) {
    console.error("A câmera não foi iniciada.");
    return;
  }

  const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

  try {
    const photoBlob = await imageCapture.takePhoto();
    const imagemCamera = new File([photoBlob], "captured-image.png", { type: photoBlob.type });

    console.log("Tipo MIME da imagem:", imagemCamera.type);

    const cameraFeed = document.getElementById("cameraFeed");
    const capturedImage = document.getElementById("capturedImage");

    // Ocultar o vídeo e exibir a imagem capturada
    cameraFeed.style.display = "none";
    capturedImage.style.display = "block";
    capturedImage.src = URL.createObjectURL(photoBlob);

    // Após capturar a imagem e verificar o formato, chame a função enviarImagem
    enviarImagem(nome, autor, genero, ano, imagemCamera);
    // Não feche a câmera aqui para manter a imagem disponível para envio
  } catch (error) {1
    console.error("Erro ao capturar imagem da câmera: " + error);
  }
}

// Função para enviar a imagem ao servidor
async function enviarImagem(nome, autor, genero, ano, imagemCamera) {
  if (imagemCamera) {
    const formData = new FormData();
    formData.append("imagem", imagemCamera);
    formData.append("nome", nome);
    formData.append("autor", autor);
    formData.append("genero", genero);
    formData.append("ano", ano);

    try {
      const response = await fetch(`http://localhost:8080/upload/imagem`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Imagem da câmera enviada com sucesso!");
        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (data.idImagem) {
          idImagem = data.idImagem;
          // Atualize a interface do usuário para exibir a nova imagem
          const livroImagem = document.getElementById("livroImagem");
          livroImagem.src = URL.createObjectURL(imagemCamera);
          
          salvarAlteracoesDoLivro(nome, autor, genero, ano, data.idImagem);
        } else {
          console.error("ID da imagem não recebido.");
        }
      } else {
        console.error("Falha ao enviar a imagem da câmera. Status:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    console.error("Nenhuma imagem da câmera disponível.");
  }
}

const salvarAlteracaoButton = document.getElementById("salvarAlteracao");

salvarAlteracaoButton.addEventListener("click", function (event) {
  event.preventDefault(); // Impedir o comportamento padrão do botão
  const nomeValue = document.querySelector("#nome").value.trim();
  const autorValue = document.querySelector("#autor").value.trim();
  const generoValue = document.querySelector("#genero").value;
  const anoValue = document.querySelector("#ano").value.trim();

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id"); // Obtenha o ID novamente

  const nomeInput = document.querySelector("#nome");
  const autorInput = document.querySelector("#autor");
  const anoInput = document.querySelector("#ano");
  const generoInput = document.querySelector("#genero");
  const mensagemErroNome = document.getElementById("mensagemErroNome");
  const mensagemErroAutor = document.getElementById("mensagemErroAutor");
  const mensagemErroAno = document.getElementById("mensagemErroAno");
  const mensagemErroGenero = document.getElementById("mensagemErroGenero");

  nomeInput.addEventListener("input", function () {
    const nomeValue = nomeInput.value.trim();

    if (nomeValue === "") {
      mensagemErroNome.textContent = "O campo 'Nome' não pode estar vazio.";
      mensagemErroNome.style.display = "block";
    } else {
      mensagemErroNome.textContent = "";
      mensagemErroNome.style.display = "none";
    }
  });

  autorInput.addEventListener("input", function () {
    const autorValue = autorInput.value.trim();

    if (autorValue === "") {
      mensagemErroAutor.textContent = "O campo 'Autor' não pode estar vazio.";
      mensagemErroAutor.style.display = "block";
    } else {
      mensagemErroAutor.textContent = "";
      mensagemErroAutor.style.display = "none";
    }
  });

  generoInput.addEventListener("input", function () {
    const generoValue = generoInput.value;

    if (generoValue === "Selecione o Gênero") {
      mensagemErroGenero.textContent = "O campo 'Gênero' não pode estar vazio.";
      mensagemErroGenero.style.display = "block";
    } else {
      mensagemErroGenero.textContent = "";
      mensagemErroGenero.style.display = "none";
    }
  });

  anoInput.addEventListener("input", function () {
    const anoValue = anoInput.value.trim();

    if (anoValue === "") {
      mensagemErroAno.textContent = "O campo 'Ano' não pode estar vazio.";
      mensagemErroAno.style.display = "block";
    } else {
      mensagemErroAno.textContent = "";
      mensagemErroAno.style.display = "none";
    }
  });

  // Passe o 'id' como um parâmetro para a função salvarAlteracoesDoLivro
  salvarAlteracoesDoLivro(id, nomeValue, autorValue, generoValue, anoValue, idImagem);
});

function salvarAlteracoesDoLivro(id, nome, autor, genero, ano, idImagem) {
  // Aqui você pode fazer uma solicitação para salvar as alterações no livro com o ID especificado
  fetch(`http://localhost:8080/livros/${id}`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      autor,
      genero,
      ano,
      idImagem
    }),
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Edição realizada com sucesso!");
        window.location.href = "/livros/painelLivros.html";
      } else {
        mensagemErroNome.textContent = "Esse nome já está cadastrado!.";
        mensagemErroNome.style.display = "block";
        console.error("Falha ao editar");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Chame a função para carregar os detalhes do livro quando a página for carregada
carregarDetalhesDoLivro();

const inputFile = document.querySelector("#picture__input_foto");
const imagemPerfil = document.querySelector("#imagem_perfil");

inputFile.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    console.log("Arquivo selecionado:", file);
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      console.log("Valor de reader.result:", reader.result);
      console.log("Imagem lida com sucesso!");
      imagemPerfil.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});
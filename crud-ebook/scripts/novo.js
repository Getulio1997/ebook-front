const formulario = document.querySelector("form");
const nome = document.querySelector("#nome");
const autor = document.querySelector("#autor");
const genero = document.querySelector("#genero");
const ano = document.querySelector("#ano");
const mensagemErro = document.getElementById("mensagemErro");



// formulario.addEventListener('submit', async function (event) {
//   event.preventDefault(); // Impedir o envio padrão do formulário
const cadastrarLivroButton = document.getElementById("cadastrarLivroButton");

cadastrarLivroButton.addEventListener('click', async function () {

// Em algum ponto do código onde você chama a função captureFromCamera, certifique-se de passar os valores apropriados, como a seguir:
document.querySelector("#picture__input_foto").addEventListener("change", function () {
  captureFromCamera(
    nome.value.trim(),
    autor.value.trim(),
    genero.value.trim(),
    ano.value.trim()
  );
});

  const nomeValue = nome.value.trim();
  const autorValue = autor.value.trim();
  const generoValue = genero.value.trim();
  const anoValue = ano.value.trim();

  if (generoValue === "Selecione o Gênero" || !nomeValue || !autorValue || !anoValue) {
    mensagemErro.textContent = "Preencha todos os campos do livro antes de capturar a imagem.";
    mensagemErro.style.display = "block";
  } else {
    if (stream) {
      // Chame a função para capturar a imagem da câmera e realizar o cadastro do livro
      captureFromCamera(nomeValue, autorValue, generoValue, anoValue);
    } else {
      mensagemErro.textContent = "Câmera não iniciada. Certifique-se de permitir o acesso à câmera.";
      mensagemErro.style.display = "block";
    }
  }
});

function validarCamposECapturarImagem() {
  const nomeValue = nome.value.trim();
  const autorValue = autor.value.trim();
  const generoValue = genero.value.trim();
  const anoValue = ano.value.trim();

  if (generoValue === "Selecione o Gênero" || !nomeValue || !autorValue || !anoValue) {
    mensagemErro.textContent = "Preencha todos os campos do livro antes de capturar a imagem.";
    mensagemErro.style.display = "block";
  } else {
    // Se os campos obrigatórios estiverem preenchidos, permita a captura da imagem
    captureFromCamera(nomeValue, autorValue, generoValue, anoValue);
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
      const response = await fetch(`https://ebookback.onrender.com/upload/imagem`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        console.log("Imagem da câmera enviada com sucesso!");
        const data = await response.json();
        console.log("Resposta do servidor:", data);

        if (data.idImagem) {
          realizarCadastro(nome, autor, genero, ano, data.idImagem);
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
    imagemCamera = new File([photoBlob], "captured-image.jpg", { type: photoBlob.type });

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
  } catch (error) {
    console.error("Erro ao capturar imagem da câmera: " + error);
  }
}

// Função para realizar o cadastro do livro
async function realizarCadastro(nome, autor, genero, ano, idImagem) {
  try {
    const response = await fetch(`https://ebookback.onrender.com/livros`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        autor,
        genero,
        ano,
        idImagem // Use o ID da imagem passado como argumento
      }),
    });

    if (response.status === 200) {
      console.log("Cadastro realizado com sucesso!");
      window.location.href = "/livros/painelLivros.html";
    } else {
      mensagemErro.textContent = "Esse nome já está cadastrado!";
      mensagemErro.style.display = "block";
      console.error("Falha no cadastro");
    }
  } catch (error) {
    console.error(error);
  }
}
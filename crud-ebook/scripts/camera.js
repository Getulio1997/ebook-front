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

async function captureFromCamera() {
  if (!stream) {
    console.error("A câmera não foi iniciada.");
    return;
  }

  const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

  try {
    const photoBlob = await imageCapture.takePhoto();
    const photoUrl = URL.createObjectURL(photoBlob);

    // Corrija o tipo MIME da imagem para corresponder ao conteúdo real
    const imageFile = new File([photoBlob], "captured-image.png", { type: photoBlob.type });

    console.log("Tipo MIME da imagem:", imageFile.type);

    const cameraFeed = document.getElementById("cameraFeed");
    const capturedImage = document.getElementById("capturedImage");

    // Ocultar o vídeo e exibir a imagem capturada
    cameraFeed.style.display = "none";
    capturedImage.style.display = "block";
    capturedImage.src = photoUrl;

    // Após capturar a imagem e verificar o formato, chame a função sendImageToServer
    sendImageToServer(imageFile);

    // Feche a câmera após tirar a foto
    stream.getVideoTracks()[0].stop();
  } catch (error) {
    console.error("Erro ao capturar imagem da câmera: " + error);
  }
}

async function sendImageToServer(imageFile) {
  console.log("Envio da imagem", imageFile);

  // Verifique o formato novamente, se necessário
  console.log("Tipo MIME da imagem a ser enviada:", imageFile.type);

  // Continuar com o envio da imagem para o servidor
  try {
    const formData = new FormData();
    formData.append("imagem", imageFile);

    const response = await fetch(`http://localhost:8080/upload/imagem`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.text();
      console.log("Resposta do servidor:", result);
    } else {
      console.error("Erro no servidor:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Erro ao enviar imagem para o servidor:", error);
  }
}
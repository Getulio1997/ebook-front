const formulario = document.querySelector("form");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");

function cadastro() {
    fetch("http://localhost:8080/usuarios", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({             
            nome: nome.value,
            email: email.value,
            senha: senha.value 
        })
    })
    .then(function (res) { 
        console.log(res);
        if (res.status === 200) {
            console.log("Cadastro realizado com sucesso!");
        }
    })
    .catch(function (res) { 
        console.log(res); 
    });
}

function limpar() {
    nome.value = "";
    email.value = "";
    senha.value = "";
}

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    cadastro();
    limpar();
});

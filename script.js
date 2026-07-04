async function gerarCodigo() {
  let textarea = document.querySelector(".texto-pagina").value;
  
  let resposta = await fetch("/api/gerar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ promptUsuario: textarea })
  });
  
  let dados = await resposta.json();
  let resultado = dados.content;
  
  let espacoCodigo = document.querySelector(".bloco-codigo");
  let espacoSite = document.querySelector(".bloco-site");
  
  espacoCodigo.textContent = resultado.replace(/```html/g, "").replace(/```/g, "").trim();
  espacoSite.srcdoc = resultado.replace(/```html/g, "").replace(/```/g, "").trim();
  
  console.log(resultado);
}


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
  let espacoSite = document.getElementById("preview-site");
  
  let codigoLimpo = resultado.replace(/```html/gi, "").replace(/```/g, "").trim();
  
  espacoCodigo.textContent = codigoLimpo;
  espacoSite.srcdoc = codigoLimpo;
  
  console.log(resultado);
}

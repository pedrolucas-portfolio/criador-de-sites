export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros integrados.
- Não use crases, markdown ou explicações.
- Não use tags <form>.
- O layout DEVE ser 100% responsivo, adaptando-se para celulares (telas pequenas). Garanta que os blocos de texto tenham largura de 100% ou auto no mobile para que as palavras não quebrem em colunas finas.
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Regras de IMAGENS (Correção de links quebrados):
- Você DEVE usar a tag <img> para ilustrar o negócio (banner principal, produtos, fotos de fundo, avatares de depoimentos).
- Para garantir que as imagens carreguem 100% das vezes sem erro, use obrigatoriamente a URL do Picsum Photos baseada em IDs ou termos genéricos.
- FORMATO OBRIGATÓRIO PARA IMAGEM GRANDE/HERO: <img src="https://picsum.photos/800/600" alt="Imagem do negocio">
- FORMATO OBRIGATÓRIO PARA FOTO DE PERFIL/AVATAR: <img src="https://picsum.photos/70/70" style="border-radius: 50%;" alt="Cliente">
- No CSS, sempre defina max-width: 100%; e height: auto; para as tags <img> para que elas caibam perfeitamente na tela do celular.

Regras de INTERAÇÃO:
- Todos os links de navegação <a> DEVEM usar href="#" e conter obrigatoriamente onclick="event.preventDefault(); alert('Você clicou em uma seção de simulação da página!')".
- Todos os botões <button> DEVEM conter obrigatoriamente onclick="alert('Ação simulada com sucesso! O formulário ou botão está funcionando.')".

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio.
- Escolha uma Google Font marcante via @import.
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte.

Estrutura da página:
- Header com nome do negócio e menu.
- Hero impactante com imagem, título, subtítulo e botão CTA.
- Seção de diferenciais com emojis ou ícones.
- Depoimento de cliente com a foto de avatar redonda ao lado ou acima do texto.
- Footer com contato.

Todo o conteúdo em português, criativo e específico para o negócio.`;

  try {
    const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${chaveSecreta}`
      },
      body: JSON.stringify({
        "model": "llama-3.3-70b-versatile",
        "messages": [
          { "role": "user", "content": promptUsuario },
          { "role": "system", "content": promptSystem }
        ]
      })
    });

    const dados = await resposta.json();
    const textoGerado = dados.choices[0].message.content;

    return res.status(200).json({ content: textoGerado });
  } catch (erro) {
    return res.status(500).json({ error: 'Erro ao falar com a IA' });
  }
}

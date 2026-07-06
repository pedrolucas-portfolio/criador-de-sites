export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros.
- Não use crases, markdown ou explicações.
- Não use tags <form>.
- O layout DEVE ser 100% responsivo, adaptando-se para celulares (telas pequenas).
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Regras de IMAGENS (Crucial para o visual):
- Você PODE e DEVE usar a tag <img> para banners, fotos de produtos, fundo ou equipe.
- Para os links das imagens, use SEMPRE o Unsplash Source de forma dinâmica baseado no tema do negócio.
- Formato obrigatório da URL: https://images.unsplash.com/photo-[ID_ALEATORIO]?auto=format&fit=crop&w=[LARGURA]&q=80 ou use o padrão de termos de busca caso prefira, ex: <img src="https://source.unsplash.com/featured/800x600/?gym" alt="Academia"> (substitua "gym" pelo termo em inglês do negócio).
- Garanta que as imagens tenham tamanhos adequados no CSS (ex: width: 100%, object-fit: cover) para não quebrar o layout.

Regras de INTERAÇÃO:
- Todos os links de navegação <a> DEVEM usar href="#" e conter obrigatoriamente onclick="event.preventDefault(); alert('Você clicou em uma seção de simulação da página!')".
- Todos os botões <button> DEVEM conter obrigatoriamente onclick="alert('Ação simulada com sucesso! O formulário ou botão está funcionando.')".

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio.
- Escolha uma Google Font marcante via @import.
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte.

Estrutura da página:
- Header com nome do negócio e menu.
- Hero impactante com imagem de fundo ou lateral, título, subtítulo e botão CTA.
- Seção de diferenciais com ícones/emojis ou pequenas imagens.
- Depoimento de cliente com uma foto de avatar de perfil redonda (use fotos de pessoas do Unsplash).
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

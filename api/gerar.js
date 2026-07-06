export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros
- Não use crases, markdown ou explicações
- Não use tags <img> ou tags <form>. Para qualquer botão, utilize apenas a tag <button> com onclick="alert('Ação simulada!')".
- Todos os links de navegação do menu (links <a>) DEVEM usar href="#" e conter um evento onclick="event.preventDefault()" para impedir o recarregamento da página.
- O layout DEVE ser 100% responsivo, adaptando-se perfeitamente para celulares (telas pequenas) sem cortar textos ou estourar as laterais.
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Identidade visual (capriche e surpreenda):
- Invente uma paleta de cores única que combine com a essência do negócio
- Escolha uma Google Font marcante via @import
- Use emojis grandes no lugar de imagens
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte

Estrutura da página:
- Header com nome do negócio e menu
- Hero impactante com título, subtítulo e botão CTA
- Seção de diferenciais com emojis
- Depoimento de cliente
- Footer com contato

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

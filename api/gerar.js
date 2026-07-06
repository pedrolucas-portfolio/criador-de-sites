export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros dentro de uma estrutura única.
- Não use crases, markdown (como \`\`\`html) ou qualquer tipo de explicação antes ou depois do código.
- Para QUALQUER imagem que a página necessite, você DEVE usar a estrutura da tag <img> com a URL do LoremFlickr.
- O formato da URL deve ser: https://loremflickr.com/LARGURA/ALTURA/TAGS?random=NUMERO_ALEATORIO
- Substitua "TAGS" por termos simples em inglês separados por vírgula que combinem com o elemento (ex: "barbecue" ou "person").
- O layout DEVE ser 100% responsivo, adaptando-se para celulares.
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio.
- Escolha uma Google Font marcante via @import.
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte.

Estrutura da página:
- Header com nome do negócio e menu
- Hero impactante com título, subtítulo, imagem principal e botão CTA
- Seção de diferenciais do negócio
- Seção de Depoimento de cliente contendo a foto de perfil do cliente em formato redondo (avatar)
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
        ],
        "temperature": 0.3
      })
    });

    const dados = await resposta.json();
    
    if (!dados.choices || !dados.choices[0]) {
      return res.status(500).json({ error: 'Resposta inválida da API Groq' });
    }

    let textoGerado = dados.choices[0].message.content;

    if (textoGerado.includes("```")) {
      textoGerado = textoGerado.replace(/```html/gi, "").replace(/```/g, "").trim();
    }

    const primeiroJson = textoGerado.indexOf("<!DOCTYPE");
    if (primeiroJson !== -1) {
      textoGerado = textoGerado.substring(primeiroJson);
    }

    return res.status(200).json({ content: textoGerado });
  } catch (erro) {
    return res.status(500).json({ error: 'Erro ao falar com a IA' });
  }
}

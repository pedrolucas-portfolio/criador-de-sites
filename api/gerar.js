export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  if (!promptUsuario) {
    return res.status(200).json({ content: '<h1>Erro: Prompt não enviado</h1>' });
  }

  const promptSystem = `Você é um designer web premiado e Programador especialista em Front-End Responsivo. 
Crie uma landing page COMPLETA, LINDA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

REGRAS DE RESPONSIVIDADE ABSOLUTA (MUITO IMPORTANTE):
- O layout DEVE ser 100% responsivo e fluido. Nunca, sob hipótese alguma, use larguras fixas em pixels (como width: 400px, 500px, etc) para seções, containers, cards ou blocos. Use sempre width: 100%, max-width ou porcentagens.
- Elementos lado a lado (como cards de diferenciais ou menus) DEVEM usar CSS Flexbox (com flex-wrap: wrap) ou CSS Grid para que quebrem de linha automaticamente e fiquem em uma única coluna em telas pequenas.
- Certifique-se de que nenhum texto, caixa ou emoji ultrapasse os limites laterais da tela do celular (evite estouros). Use paddings e margens controlados (ex: padding: 20px ou 5%).
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros dentro de uma estrutura única.
- Nunca use markdown como \`\`\`html ou \`\`\`. Comece direto no <!DOCTYPE html> e termine em </html>.
- Não inclua explicações, introduções ou notas fora do código.
- PROIBIDO usar a tag <img> ou links de imagens externas.
- Use EMOJIS GRANDES aplicados de forma moderna e elegante como os elementos visuais principais da página (dentro do Hero, nos diferenciais, etc).
- O menu de navegação do Header DEVE usar links internos com âncoras comuns (ex: href="#home", href="#features", href="#contato") para navegação suave, NUNCA use href="#" puro.

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio.
- Escolha uma Google Font marcante via @import.
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte.

Estrutura da página:
- Header com o nome do negócio e menu com links de âncoras funcionais.
- Hero impactante com título, subtítulo, um emoji gigante tematizado estilizado com CSS e o botão CTA.
- Seção de diferenciais do negócio destacando os tópicos com emojis grandes e representativos.
- Footer organizado contendo as informações de contato bem centralizadas.

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
        "temperature": 0.3, // Temperatura ligeiramente menor para manter a IA mais focada nas regras estruturais
        "max_tokens": 2300
      })
    });

    const dados = await resposta.json();
    
    if (!dados.choices || !dados.choices[0]) {
      return res.status(200).json({ content: '<h1>Erro na resposta da IA. Tente novamente.</h1>' });
    }

    let textoGerado = dados.choices[0].message.content.trim();

    textoGerado = textoGerado.replace(/```html/gi, "").replace(/```/g, "").trim();

    const posicaoInicio = textoGerado.indexOf("<!DOCTYPE");
    if (posicaoInicio !== -1) {
      textoGerado = textoGerado.substring(posicaoInicio);
    }

    return res.status(200).json({ content: textoGerado });

  } catch (erro) {
    return res.status(200).json({ content: `<h1>Erro ao gerar o site: ${erro.message}</h1>` });
  }
}

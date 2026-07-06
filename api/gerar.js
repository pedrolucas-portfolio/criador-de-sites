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
- O layout DEVE ser 100% responsivo, adaptando-se para celulares (telas pequenas).
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>.

Regras de IMAGENS (Fotos precisas e temáticas):
- Você DEVE usar a tag <img> para ilustrar o negócio (banner principal, produtos, fotos de fundo, avatares de depoimentos).
- Para garantir que as imagens tenham relação DIRETA com o tema do negócio, use a estrutura do Unsplash via redirecionamento de busca por palavra-chave em inglês.
- FORMATO OBRIGATÓRIO PARA IMAGEM GRANDE/HERO: <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" alt="Imagem do negocio"> (Caso o tema mude drasticamente, você pode usar termos dinâmicos como: https://images.unsplash.com/featured/800x600/?termo-em-ingles)
- Exemplo prático: Se for academia use o termo /?gym, se for hamburgueria use /?burger, se for mecânica use /?mechanic.
- FORMATO OBRIGATÓRIO PARA FOTO DE PERFIL/AVATAR: <img src="https://images.unsplash.com/featured/150x150/?person,portrait" style="border-radius: 50%; width: 70px; height: 70px; object-fit: cover;" alt="Cliente">
- No CSS, defina sempre max-width: 100%; e height: auto; para as imagens do layout.

Regras de INTERAÇÃO:
- Todos os links de navegação <a> DEVEM usar href="#" e conter obrigatoriamente onclick="event.preventDefault(); alert('Você clicou em uma seção de simulação da página!')".
- Todos os botões <button> DEVEM conter obrigatoriamente onclick="alert('Ação simulada com sucesso!')".

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio.
- Escolha uma Google Font marcante via @import.
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte.

Estrutura da página:
- Header com nome do negócio e menu.
- Hero impactante com imagem contextualizada, título, subtítulo e botão CTA.
- Seção de diferenciais com emojis ou ícones.
- Depoimento de cliente com a foto de avatar redonda.
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

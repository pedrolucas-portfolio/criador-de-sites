export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e programador front-end sênior. 
Crie uma landing page COMPLETA, VISUALMENTE IMPRESSIONANTE e INTERATIVA para o negócio descrito.

Regras CRUCIAIS de resposta (Siga rigorosamente):
- Responda APENAS com o código puro. Nunca use blocos de código markdown (sem aspas triplas ou \`\`\`html)
- Não inclua explicações, introduções ou notas de texto antes ou depois do código HTML. Comece direto em <!DOCTYPE html> e termine em </html>
- O layout DEVE ser 100% responsivo, adaptando-se perfeitamente para celulares (telas pequenas) sem cortar textos ou estourar as laterais
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>

Regras para Imagens Chamativas:
- Use tags <img> normais. A propriedade 'src' DEVE conter links dinâmicos e funcionais do LoremFlickr usando o formato: https://loremflickr.com/800/600/<termo-em-inglês-do-nicho> (Exemplo para clínica veterinária/petshop: https://loremflickr.com/800/600/dog,cat)
- Se precisar de imagens menores ou de perfil para depoimentos, mude o tamanho no link (Ex: https://loremflickr.com/150/150/person)
- Garanta que as imagens tenham tamanhos bem definidos no CSS, cantos arredondados (border-radius) e sombras sutis para um visual moderno

Regras para JavaScript e Botões Funcionais:
- Todo o JavaScript DEVE vir dentro de uma tag <script> antes do fechamento do <body>
- Os botões (CTAs, menus, formulários) NÃO podem ser estáticos. Use JavaScript real para dar vida a eles
- Adicione interatividade real: menus mobile (hambúrguer) que abrem e fecham ao clicar no celular, janelas de modal que abrem ao clicar em botões de ação (como "Garantir Vaga" ou "Fazer Orçamento") e alertas estilizados de sucesso ao simular o envio do formulário

Identidade visual e Design:
- Invente uma paleta de cores moderna e profissional que combine perfeitamente com a essência do negócio
- Escolha uma Google Font marcante via @import no CSS
- Use CSS moderno: gradientes bem trabalhados, transições suaves (transition: all 0.3s), hover effects atraentes nos botões e espaçamento generoso (padding) entre as seções

Estrutura obrigatória da página:
- Header com logo textula, nome do negócio e Menu Hamburguer funcional para celular
- Seção Hero impactante com título forte, subtítulo, imagem de destaque chamativa e botão CTA principal
- Seção de diferenciais ou serviços organizados em colunas limpas usando Grid ou Flexbox
- Seção de Depoimentos com foto/avatar dos clientes
- Formulário de contato funcional (com feedback visual em JavaScript ao clicar em enviar)
- Footer completo com informações de contato

Todo o conteúdo deve ser em português, altamente persuasivo e totalmente personalizado para o nicho solicitado.`;

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

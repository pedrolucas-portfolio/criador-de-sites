export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const chaveSecreta = process.env.GROQ_API_KEY;
  const { promptUsuario } = req.body;

  const promptSystem = `Você é um designer web premiado e programador front-end sênior. 
Crie uma landing page COMPLETA, VISUALMENTE IMPRESSIONANTE e INTERATIVA para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com o código puro (HTML, CSS e JavaScript juntos em um único bloco de texto)
- Não use crases extras para envelopar o código, markdown ou qualquer tipo de explicação de texto antes ou depois
- O layout DEVE ser 100% responsivo, adaptando-se perfeitamente para celulares (telas pequenas) sem cortar textos ou estourar as laterais
- O HTML gerado DEVE conter a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> dentro do <head>

Regras para Imagens Chamativas:
- Use tags <img> normais, mas a propriedade 'src' DEVE conter links reais e de alta qualidade do Unsplash usando o formato: https://images.unsplash.com/photo-... ou via source parametrizado (ex: https://source.unsplash.com/featured/?<palavra-chave-em-inglês>)
- Garanta que as imagens tenham tamanhos bem definidos no CSS, cantos arredondados (border-radius) e sombras sutis para um visual moderno e profissional

Regras para JavaScript e Botões Funcionais:
- Todo o JavaScript DEVE vir dentro de uma tag <script> antes do fechamento do <body>
- Os botões (CTAs, menus, formulários) NÃO podem ser estáticos. Use JavaScript real para dar vida a eles
- Adicione interatividade real: menus mobile que abrem e fecham ao clicar, modais de captura de lead (ex: uma janela que abre ao clicar em "Garantir Vaga" ou "Fazer Orçamento"), máscaras simples em campos de formulário e alertas estilizados de sucesso ao simular o envio de um formulário

Identidade visual e Design:
- Invente uma paleta de cores única e moderna que combine perfeitamente com a essência do negócio
- Escolha uma Google Font marcante via @import no CSS
- Use CSS moderno: gradientes bem trabalhados, transições suaves (transition: all 0.3s), hover effects atraentes nos botões e espaçamento generoso (padding) entre as seções

Estrutura obrigatória da página:
- Header com logo, nome do negócio e Menu Hamburguer funcional para celular
- Seção Hero impactante com título forte, subtítulo, imagem de fundo ou lateral chamativa e botão CTA principal
- Seção de diferenciais/serviços com ícones ou imagens pequenas organizadas em Grid/Flexbox
- Seção de Depoimentos com foto dos clientes (use avatares reais ou do Unsplash)
- Formulário de contato funcional (com validação e feedback visual via JS ao enviar)
- Footer completo com links e informações de contato

Todo o conteúdo deve ser em português, criativo, persuasivo e totalmente personalizado para o nicho solicitado.`;

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


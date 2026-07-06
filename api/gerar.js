export default async function handler(req, res) {
    const temaUsuario = req.body.tema || req.query.tema || "Churrascaria";

    const dicionario = {
        'churrascaria': 'barbecue,meat',
        'churrasco': 'barbecue,bbq',
        'pizzaria': 'pizza',
        'hamburgueria': 'burger,hamburger',
        'academia': 'gym,fitness',
        'mecanica': 'motorcycle,mechanic',
        'salao': 'hairdresser,beauty',
        'cliente': 'person,face,portrait'
    };

    const termoBaixo = temaUsuario.toLowerCase().trim();
    const termoImagemPrincipal = dicionario[termoBaixo] || termoBaixo;
    const termoImagemCliente = dicionario['cliente'];

    const random1 = Math.floor(Math.random() * 1000);
    const random2 = Math.floor(Math.random() * 1000);

    const urlImagemPrincipal = `https://loremflickr.com/800/500/${termoImagemPrincipal}?random=${random1}`;
    const urlImagemCliente = `https://loremflickr.com/150/150/${termoImagemCliente}?random=${random2}`;

    const htmlGerado = `
        <section class="hero-section" style="background-color: #fceade; padding: 40px 20px; text-align: center;">
            <div class="container" style="max-width: 600px; margin: 0 auto;">
                <div class="image-wrapper" style="margin-bottom: 20px;">
                    <img src="${urlImagemPrincipal}" alt="Imagem de ${temaUsuario}" style="width: 100%; max-width: 400px; border-radius: 8px; display: block; margin: 0 auto;">
                </div>
                <h1 style="font-size: 2.5rem; margin-bottom: 10px; text-transform: capitalize;">${temaUsuario}</h1>
                <p style="font-size: 1.2rem; color: #333; margin-bottom: 20px;">Desfrute do melhor da cidade.</p>
                <button style="background-color: #800020; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Faça sua reserva
                </button>
            </div>
        </section>

        <section class="depoimento-section" style="padding: 40px 20px; background-color: #ffffff; text-align: center;">
            <div class="container" style="max-width: 600px; margin: 0 auto;">
                <h2 style="font-size: 2rem; margin-bottom: 20px;">Depoimento de cliente</h2>
                <div class="card-depoimento" style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                    <img src="${urlImagemCliente}" alt="Cliente" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                    <p style="font-style: italic; color: #555; max-width: 400px; margin: 0;">
                        "Eu adorei a experiência aqui! O serviço estava muito saboroso e o atendimento foi excelente."
                    </p>
                </div>
            </div>
        </section>

        <footer style="background-color: #800020; color: white; padding: 20px; text-align: center;">
            <div class="container">
                <p style="margin: 0; font-size: 0.9rem;">Contato: (11) 1234-5678 | <a href="#" style="color: #4a90e2; text-decoration: underline;">enviar e-mail</a></p>
            </div>
        </footer>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlGerado);
}

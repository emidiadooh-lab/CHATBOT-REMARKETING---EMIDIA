export default async function handler(req, res) {
  // Garante que a requisição é segura (POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { phoneNumber, templateName, languageCode, templateParameters } = req.body;

    // Validação básica dos dados do prospecto
    if (!phoneNumber || !templateName) {
      return res.status(400).json({ error: 'Número de telefone e nome do template são obrigatórios.' });
    }

    // Credenciais da API da Meta (que virão das variáveis de ambiente na Vercel)
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

    // Montagem da payload exigida pela Meta para envio de templates de prospecção
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode || 'pt_BR'
        },
        components: templateParameters ? [
          {
            type: 'body',
            parameters: templateParameters
          }
        ] : []
      }
    };

    // Envio para a API Oficial do WhatsApp
    const response = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao enviar mensagem pela API da Meta');
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Erro no disparo do Outbound:', error);
    return res.status(500).json({ error: error.message });
  }
}

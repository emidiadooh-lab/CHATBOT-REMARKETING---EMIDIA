export default function handler(req, res) {
  // Tratamento para a verificação do Meta (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'wsf197530';

    console.log('Recebida requisição GET de verificação:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED com sucesso!');
      return res.status(200).send(challenge);
    }
    
    console.log('Falha na verificação. Token ou modo inválidos.');
    return res.status(403).json({ error: 'Token de verificação inválido' });
  }

  // Tratamento para recebimento de mensagens (POST)
  if (req.method === 'POST') {
    console.log('Evento POST recebido:', JSON.stringify(req.body, null, 2));
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}

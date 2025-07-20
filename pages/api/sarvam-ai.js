export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const sarvamRes = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_7z2b7vg3_VgNKNSNgbLKoMbhMV7tPnuUx',
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages: [
          { role: 'system', content: 'You are a debate coach AI. Give clear, constructive, and concise reply speeches.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });
    const data = await sarvamRes.json();
    console.log('Sarvam AI response:', data); // Add this line
    const aiReply = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: 'AI service error', details: err.message });
  }
} 
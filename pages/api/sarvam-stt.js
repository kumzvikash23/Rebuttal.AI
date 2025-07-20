export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the audio file from the request
    const audioFile = req.body.audio;
    if (!audioFile) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // Convert base64 to buffer if needed
    const audioBuffer = Buffer.from(audioFile, 'base64');

    const sarvamRes = await fetch('https://api.sarvam.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk_7z2b7vg3_VgNKNSNgbLKoMbhMV7tPnuUx',
      },
      body: (() => {
        const formData = new FormData();
        formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }), 'audio.wav');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'json');
        return formData;
      })(),
    });

    if (!sarvamRes.ok) {
      throw new Error(`Sarvam STT API error: ${sarvamRes.status}`);
    }

    const data = await sarvamRes.json();
    res.status(200).json({ text: data.text || '' });
  } catch (err) {
    console.error('Sarvam STT error:', err);
    res.status(500).json({ error: 'STT service error', details: err.message });
  }
} 
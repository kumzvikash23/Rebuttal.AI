export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, target_language_code = 'en-IN', speaker = 'anushka', pitch = 0, pace = 1, loudness = 1 } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  console.log('TTS Request:', {
    text: text.substring(0, 100) + '...',
    target_language_code,
    speaker,
    pitch,
    pace,
    loudness
  });

  try {
    const requestBody = {
      text: text,
      target_language_code: target_language_code,
      speaker: speaker,
      pitch: pitch,
      pace: pace,
      loudness: loudness,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v2',
      timestamp: Date.now() // Add timestamp to prevent caching
    };

    console.log('=== SARVAM API DEBUG ===');
    console.log('Speaker being sent to Sarvam:', speaker);
    console.log('Full request body:', requestBody);
    console.log('========================');

    const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': 'sk_7z2b7vg3_VgNKNSNgbLKoMbhMV7tPnuUx',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Sarvam response status:', sarvamRes.status);
    console.log('Sarvam response headers:', Object.fromEntries(sarvamRes.headers.entries()));

    if (!sarvamRes.ok) {
      const errorText = await sarvamRes.text();
      console.error('Sarvam TTS API error:', sarvamRes.status, errorText);
      return res.status(sarvamRes.status).json({ 
        error: 'Sarvam TTS API error', 
        status: sarvamRes.status,
        details: errorText 
      });
    }

    // Get the audio data as a buffer
    const audioBuffer = await sarvamRes.arrayBuffer();
    console.log('Audio buffer size:', audioBuffer.byteLength);
    
    // Convert to base64 for JSON response
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    // Return JSON with base64 audio data
    res.status(200).json({ 
      success: true,
      audio: base64Audio,
      size: audioBuffer.byteLength
    });
    
  } catch (err) {
    console.error('Sarvam TTS error:', err);
    res.status(500).json({ error: 'TTS service error', details: err.message });
  }
} 
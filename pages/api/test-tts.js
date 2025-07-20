export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Sarvam TTS API...');
    
    const testResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': 'sk_7z2b7vg3_VgNKNSNgbLKoMbhMV7tPnuUx',
      },
      body: JSON.stringify({
        text: "Hello, this is a test.",
        target_language_code: "en-IN",
        speaker: "anushka",
        pitch: 0,
        pace: 1,
        loudness: 1,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v2"
      }),
    });

    console.log('Test response status:', testResponse.status);
    console.log('Test response headers:', Object.fromEntries(testResponse.headers.entries()));

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error('Test failed:', errorText);
      return res.status(200).json({ 
        success: false, 
        status: testResponse.status,
        error: errorText 
      });
    }

    const audioBuffer = await testResponse.arrayBuffer();
    console.log('Test audio buffer size:', audioBuffer.byteLength);

    return res.status(200).json({ 
      success: true, 
      status: testResponse.status,
      audioSize: audioBuffer.byteLength 
    });

  } catch (err) {
    console.error('Test error:', err);
    return res.status(200).json({ 
      success: false, 
      error: err.message 
    });
  }
} 
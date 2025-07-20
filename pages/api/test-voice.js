export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { voice = 'hitesh' } = req.query;

  try {
    console.log(`Testing voice: ${voice}`);
    
    const testResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': 'sk_7z2b7vg3_VgNKNSNgbLKoMbhMV7tPnuUx',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        text: `Hello, this is ${voice} speaking. Testing voice selection.`,
        target_language_code: "en-IN",
        speaker: voice,
        pitch: 0,
        pace: 1,
        loudness: 1,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v2",
        timestamp: Date.now()
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
        error: errorText,
        voice: voice
      });
    }

    const audioBuffer = await testResponse.arrayBuffer();
    console.log('Test audio buffer size:', audioBuffer.byteLength);

    // Convert to base64 for JSON response
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return res.status(200).json({ 
      success: true, 
      status: testResponse.status,
      audioSize: audioBuffer.byteLength,
      voice: voice,
      audio: base64Audio
    });

  } catch (err) {
    console.error('Test error:', err);
    return res.status(200).json({ 
      success: false, 
      error: err.message,
      voice: voice
    });
  }
} 
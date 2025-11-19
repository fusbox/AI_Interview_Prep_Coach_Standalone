// Serverless function for natural voice synthesis using ElevenLabs API
// Expects POST { text: string }
// Environment variables required (configure in Vercel dashboard):
//  - ELEVENLABS_API_KEY
//  - ELEVENLABS_VOICE_ID (optional; falls back to a default public voice)
// Returns: { audioBase64: string }

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default voice id

    if (!apiKey) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }));
      return;
    }

    let body = req.body;
    // If body not parsed (depending on runtime), attempt manual parse
    if (!body) {
      const raw = await new Promise<string>((resolve) => {
        let data = '';
        req.on('data', (chunk: any) => { data += chunk; });
        req.on('end', () => resolve(data));
      });
      try {
        body = JSON.parse(raw);
      } catch (_) {
        body = {};
      }
    }

    const text: string = (body?.text || '').trim();
    if (!text) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing text' }));
      return;
    }

    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      res.statusCode = ttsResponse.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'TTS request failed', details: errorText }));
      return;
    }

    const buffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(buffer).toString('base64');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({ audioBase64 }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal error', details: err?.message }));
  }
}

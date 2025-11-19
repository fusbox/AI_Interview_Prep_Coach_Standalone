// Client-side helper to request natural voice narration from serverless TTS API
// Converts returned base64 audio to an object URL suitable for playback.

export async function synthesizeQuestion(text: string): Promise<string> {
  try {
    const resp = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!resp.ok) {
      return '';
    }
    const data = await resp.json();
    const base64 = data.audioBase64 as string;
    if (!base64) return '';
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (_) {
    return '';
  }
}

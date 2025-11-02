import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice, rate, pitch, volume, outputFormat } = body;

    // Convertir los valores a formato SSML correcto
    // Rate: convertir porcentaje a valor decimal (100% = 1.0)
    const rateValue = (rate / 100).toFixed(2);
    
    // Pitch: convertir a porcentaje relativo (100% = +0%, 150% = +50%, 50% = -50%)
    const pitchValue = pitch >= 100 ? `+${pitch - 100}%` : `${pitch - 100}%`;
    
    // Volume: convertir a valor relativo en dB (100% = +0dB, 50% = -6dB, 0% = silent)
    let volumeValue: string;
    if (volume === 0) {
      volumeValue = 'silent';
    } else if (volume <= 25) {
      volumeValue = 'x-soft';
    } else if (volume <= 50) {
      volumeValue = 'soft';
    } else if (volume <= 75) {
      volumeValue = 'medium';
    } else if (volume <= 90) {
      volumeValue = 'loud';
    } else {
      volumeValue = 'x-loud';
    }

    // Construir el SSML con los parámetros
    const ssml = `<speak version='1.0' xml:lang='es-AR'>
      <voice xml:lang='es-AR' name='${voice}'>
        <prosody rate='${rateValue}' pitch='${pitchValue}' volume='${volumeValue}'>
          ${text}
        </prosody>
      </voice>
    </speak>`;

    const apiKey = process.env.AZURE_TTS_API_KEY;
    const region = process.env.AZURE_TTS_REGION || 'eastus';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key no configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': outputFormat || 'audio-16khz-32kbitrate-mono-mp3',
        },
        body: ssml,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Error de Azure TTS: ${errorText}` },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error en TTS:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

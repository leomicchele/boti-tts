'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, Settings, Download } from 'lucide-react';

// Voces disponibles
const VOICES = [
  { value: 'es-AR-ElenaNeural', label: 'Elena - Argentina (Femenina)', locale: 'es-AR', styles: [] },
  { value: 'es-AR-TomasNeural', label: 'Tomás - Argentina (Masculina)', locale: 'es-AR', styles: [] },
  { value: 'es-MX-JorgeNeural', label: 'Jorge - México (Masculina)', locale: 'es-MX', styles: ['chat', 'cheerful'] },
  { value: 'es-MX-DaliaNeural', label: 'Dalia - México (Femenina)', locale: 'es-MX', styles: [] },
  { value: 'es-MX-BeatrizNeural', label: 'Beatriz - México (Femenina)', locale: 'es-MX', styles: [] },
  { value: 'es-MX-CandelaNeural', label: 'Candela - México (Femenina)', locale: 'es-MX', styles: [] },
  { value: 'es-MX-CarlotaNeural', label: 'Carlota - México (Femenina)', locale: 'es-MX', styles: [] },
  { value: 'es-MX-CecilioNeural', label: 'Cecilio - México (Masculina)', locale: 'es-MX', styles: [] },
  { value: 'es-MX-GerardoNeural', label: 'Gerardo - México (Masculina)', locale: 'es-MX', styles: [] },
];

// Formatos de salida disponibles
const OUTPUT_FORMATS = [
  { value: 'audio-16khz-32kbitrate-mono-mp3', label: 'MP3 16kHz 32kbps' },
  { value: 'audio-24khz-48kbitrate-mono-mp3', label: 'MP3 24kHz 48kbps' },
  { value: 'audio-48khz-96kbitrate-mono-mp3', label: 'MP3 48kHz 96kbps' },
  { value: 'audio-16khz-128kbitrate-mono-mp3', label: 'MP3 16kHz 128kbps' },
];

// Estilos emocionales disponibles
const ALL_STYLES = [
  { value: 'none', label: 'Sin estilo' },
  { value: 'chat', label: 'Conversacional' },
  { value: 'cheerful', label: 'Alegre' },
  { value: 'sad', label: 'Triste' },
  { value: 'angry', label: 'Enojado' },
  { value: 'excited', label: 'Emocionado' },
  { value: 'friendly', label: 'Amigable' },
  { value: 'hopeful', label: 'Esperanzado' },
  { value: 'shouting', label: 'Gritando' },
  { value: 'whispering', label: 'Susurrando' },
  { value: 'terrified', label: 'Aterrorizado' },
];


export default function Home() {
  const [text, setText] = useState('Hola, soy Boti, un asistente virtual que puede ayudarte con tus tareas diarias.');
  const [voice, setVoice] = useState('es-AR-ElenaNeural');
  const [rate, setRate] = useState(100);
  const [pitch, setPitch] = useState(100);
  const [volume, setVolume] = useState(100);
  const [outputFormat, setOutputFormat] = useState('audio-16khz-32kbitrate-mono-mp3');
  const [style, setStyle] = useState('none');
  const [styledegree, setStyledegree] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la voz seleccionada y sus estilos soportados
  const selectedVoice = VOICES.find(v => v.value === voice);
  const supportedStyles = selectedVoice?.styles || [];
  
  // Filtrar estilos disponibles según la voz
  const availableStyles = ALL_STYLES.filter(s => 
    s.value === 'none' || supportedStyles.includes(s.value)
  );

  // Resetear estilo si la voz cambia y el estilo actual no es soportado
  const handleVoiceChange = (newVoice: string) => {
    setVoice(newVoice);
    const newSelectedVoice = VOICES.find(v => v.value === newVoice);
    const newSupportedStyles = newSelectedVoice?.styles || [];
    if (style !== 'none' && !newSupportedStyles.includes(style)) {
      setStyle('none');
    }
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Por favor ingresa un texto');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          locale: selectedVoice?.locale || 'es-AR',
          rate,
          pitch,
          volume,
          outputFormat,
          style,
          styledegree,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el audio');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      
      // Limpiar URL anterior si existe
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
      
      // Reproducir automáticamente
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `azure-tts-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Azure TTS - BOTI
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Experimenta con el servicio de Text-to-Speech de Microsoft Azure
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Texto a sintetizar
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={4}
              placeholder="Escribe el texto que quieres convertir a voz..."
            />
          </div>

          {/* Voice Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voz
              </label>
              <select
                value={voice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {VOICES.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Formato de salida
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {OUTPUT_FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estilo emocional
              {supportedStyles.length === 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(no soportado por esta voz)</span>
              )}
              {supportedStyles.length > 0 && (
                <span className="text-xs text-green-600 dark:text-green-400 ml-2">✓ Soportado</span>
              )}
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={supportedStyles.length === 0}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableStyles.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Style Degree (solo visible si hay un estilo seleccionado) */}
          {style !== 'none' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Intensidad del estilo
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {styledegree}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="2"
                step="0.01"
                value={styledegree}
                onChange={(e) => setStyledegree(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Sutil (0.01)</span>
                <span>Normal (1)</span>
                <span>Intenso (2)</span>
              </div>
            </div>
          )}

          {/* Voice Parameters */}
          <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Parámetros de voz
              </h3>
            </div>

            {/* Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Velocidad
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {rate}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Lento (50%)</span>
                <span>Normal (100%)</span>
                <span>Rápido (200%)</span>
              </div>
            </div>

            {/* Pitch */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Tono
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {pitch}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Grave (50%)</span>
                <span>Normal (100%)</span>
                <span>Agudo (200%)</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Volumen
                </label>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {volume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Silencio (0%)</span>
                <span>Máximo (100%)</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              {isLoading ? 'Generando...' : 'Generar Audio'}
            </button>

            {audioUrl && (
              <>
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Reproducir
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Descargar
                </button>
              </>
            )}
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>

        {/* Footer Info */}
        {/* <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Powered by{' '}
            <a
              href="https://azure.microsoft.com/es-es/services/cognitive-services/text-to-speech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Azure Cognitive Services
            </a>
          </p>
        </div> */}
      </div>
    </main>
  );
}

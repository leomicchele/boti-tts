# Azure TTS Playground

Playground interactivo para experimentar con el servicio de Text-to-Speech de Microsoft Azure.

## Características

- 🎙️ Síntesis de voz en español argentino
- 🎛️ Control de parámetros de voz (velocidad, tono, volumen)
- 🔊 Reproducción de audio en tiempo real
- 💾 Descarga del audio generado
- 🎨 Interfaz moderna y responsive
- 🌙 Soporte para modo oscuro

## Voces Disponibles

- **Elena** (Femenina) - `es-AR-ElenaNeural`
- **Tomás** (Masculina) - `es-AR-TomasNeural`

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tu API key de Azure:

```env
AZURE_TTS_API_KEY=tu_api_key_aqui
AZURE_TTS_REGION=eastus
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Uso

1. **Escribe el texto** que quieres convertir a voz
2. **Selecciona la voz** (Elena o Tomás)
3. **Ajusta los parámetros**:
   - **Velocidad**: 50% (lento) a 200% (rápido)
   - **Tono**: 50% (grave) a 200% (agudo)
   - **Volumen**: 0% (silencio) a 100% (máximo)
4. **Elige el formato de salida** (MP3 en diferentes calidades)
5. Haz clic en **"Generar Audio"**
6. El audio se reproducirá automáticamente
7. Puedes **pausar/reproducir** o **descargar** el audio

## Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Azure Cognitive Services** - Text-to-Speech API

## API de Azure TTS

El proyecto utiliza la API de Azure Cognitive Services Text-to-Speech:

- **Endpoint**: `https://{region}.tts.speech.microsoft.com/cognitiveservices/v1`
- **Formato**: SSML (Speech Synthesis Markup Language)
- **Salida**: Audio MP3 en diferentes calidades

### Parámetros SSML

```xml
<speak version='1.0' xml:lang='es-AR'>
  <voice xml:lang='es-AR' name='es-AR-ElenaNeural'>
    <prosody rate='100%' pitch='100%' volume='100%'>
      Tu texto aquí
    </prosody>
  </voice>
</speak>
```

## Estructura del Proyecto

```
azure-tts/
├── app/
│   ├── api/
│   │   └── tts/
│   │       └── route.ts      # API route para Azure TTS
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal (playground)
├── .env.example              # Ejemplo de variables de entorno
├── package.json              # Dependencias
└── README.md                 # Este archivo
```

## Licencia

MIT

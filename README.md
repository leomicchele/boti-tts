# Azure TTS Playground

Playground interactivo para experimentar con el servicio de Text-to-Speech de Microsoft Azure.

## Características

- 🎙️ Síntesis de voz en español argentino
- 🎛️ Control de parámetros de voz (velocidad, tono, volumen)
- 🎭 Estilos emocionales (soporte limitado en voces es-AR)
- 🔊 Reproducción de audio en tiempo real
- 💾 Descarga del audio generado
- 🎨 Interfaz moderna y responsive
- 🌙 Soporte para modo oscuro

## Voces Disponibles

### Voces Argentinas (sin soporte de estilos)
- **Elena** (Femenina) - `es-AR-ElenaNeural`
- **Tomás** (Masculina) - `es-AR-TomasNeural`

### Voces Mexicanas
- **Jorge** (Masculina) - `es-MX-JorgeNeural` - ✓ Soporta estilos: `chat`, `cheerful`
- **Dalia** (Femenina) - `es-MX-DaliaNeural`
- **Beatriz** (Femenina) - `es-MX-BeatrizNeural`
- **Candela** (Femenina) - `es-MX-CandelaNeural`
- **Carlota** (Femenina) - `es-MX-CarlotaNeural`
- **Cecilio** (Masculina) - `es-MX-CecilioNeural`
- **Gerardo** (Masculina) - `es-MX-GerardoNeural`

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
2. **Selecciona la voz**:
   - Voces argentinas (Elena, Tomás) - sin estilos
   - Voces mexicanas (Jorge con estilos, Dalia, Beatriz, etc.)
3. **Elige el formato de salida** (MP3 en diferentes calidades)
4. **Selecciona un estilo emocional** (solo si la voz lo soporta):
   - **Jorge (México)**: Conversacional, Alegre
   - El selector se deshabilitará automáticamente si la voz no soporta estilos
5. **Ajusta los parámetros de voz**:
   - **Velocidad**: 50% (lento) a 200% (rápido)
   - **Tono**: 50% (grave) a 200% (agudo)
   - **Volumen**: 0% (silencio) a 100% (máximo)
   - **Intensidad del estilo**: 0.01 (sutil) a 2 (intenso) - solo si hay un estilo seleccionado
6. Haz clic en **"Generar Audio"**
7. El audio se reproducirá automáticamente
8. Puedes **pausar/reproducir** o **descargar** el audio

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

**SSML básico:**
```xml
<speak version='1.0' xml:lang='es-AR'>
  <voice xml:lang='es-AR' name='es-AR-ElenaNeural'>
    <prosody rate='1.0' pitch='+0%' volume='medium'>
      Tu texto aquí
    </prosody>
  </voice>
</speak>
```

**SSML con estilo emocional:**
```xml
<speak version='1.0' xml:lang='es-AR' xmlns:mstts="https://www.w3.org/2001/mstts">
  <voice xml:lang='es-AR' name='es-AR-ElenaNeural'>
    <mstts:express-as style='cheerful' styledegree='1.5'>
      <prosody rate='1.0' pitch='+0%' volume='medium'>
        Tu texto aquí
      </prosody>
    </mstts:express-as>
  </voice>
</speak>
```

### Soporte de estilos por idioma

- **Voces Argentinas (es-AR)**: No soportan estilos emocionales ni roles
- **Voces Mexicanas (es-MX)**: 
  - **Jorge**: Soporta `chat` (conversacional) y `cheerful` (alegre)
  - Otras voces mexicanas: Sin soporte de estilos actualmente
- **Roles de voz**: No soportados en español. El atributo `role` solo está disponible para algunas voces chinas (zh-CN)
- **Funcionalidad dinámica**: La interfaz detecta automáticamente qué estilos soporta cada voz y habilita/deshabilita el selector según corresponda

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

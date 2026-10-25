# FitAI 💪

App de fitness y nutrición con IA para Android. Entrenamiento personalizado, rutinas y planes de dieta generados por inteligencia artificial.

---

## 📱 Funcionalidades

- **Gimnasio**: Ejercicios por zona muscular con técnica, series y reps
- **Rutinas**: Generación de rutinas semanales según objetivo y días disponibles
- **Nutrición**: Planes de dieta con macros, menús y recetas
- **Perfil**: Guarda tus datos para respuestas más personalizadas
- **Historial**: Conversaciones guardadas localmente en el dispositivo

---

## 🚀 Inicio rápido

### Requisitos previos
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Cuenta en [Anthropic](https://console.anthropic.com) para tu API key
- **Expo Go SDK 53** en tu Android ([Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) — asegúrate de tener la versión más reciente

### 1. Crear los assets necesarios (obligatorio)

Expo requiere estos archivos de imagen para arrancar. Créalos antes de instalar:

```
assets/
  icon.png          (1024x1024 px)
  splash.png        (1284x2778 px)
  adaptive-icon.png (1024x1024 px)
```

Puedes usar imágenes de placeholder temporalmente — lo importante es que existan.
Herramienta gratuita para generarlas: https://www.appicon.co

### 2. Instalar dependencias

```bash
cd fitai
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env`:
```
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3001
```

> **¿Cuál es tu IP local?**
> - Windows: abre CMD y escribe `ipconfig` → busca "Dirección IPv4" (ej: 192.168.1.45)
> - Mac/Linux: escribe `ifconfig` → busca `inet` en la interfaz WiFi
>
> El móvil y el ordenador **deben estar en la misma red WiFi**.

### 4. Arrancar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `backend/.env`:
```
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX
PORT=3001
```

Arranca el servidor:
```bash
npm start
# ✅ FitAI Backend corriendo en http://localhost:3001
```

### 5. Arrancar la app

En otra terminal, desde la carpeta raíz:
```bash
npm start
```

Escanea el QR con **Expo Go** en tu Android. ¡Listo!

---

## 📁 Estructura del proyecto

```
fitai/
├── app/                    # Pantallas (Expo Router)
│   ├── _layout.tsx         # Layout raíz
│   └── (tabs)/
│       ├── _layout.tsx     # Navegación de tabs
│       ├── index.tsx       # Pantalla de inicio
│       ├── gym.tsx         # Gimnasio por zona muscular
│       ├── routines.tsx    # Generador de rutinas
│       ├── diet.tsx        # Planes nutricionales
│       └── profile.tsx     # Perfil de usuario
│
├── components/
│   ├── ChatBubble.tsx      # Burbuja de chat reutilizable
│   └── ChatInput.tsx       # Input del chat con envío
│
├── constants/
│   └── theme.ts            # Colores, espaciados, tipografía
│
├── hooks/
│   └── useChat.ts          # Lógica del chat con la IA
│
├── services/
│   ├── aiService.ts        # Llamadas al backend de IA
│   └── storage.ts          # Persistencia local (AsyncStorage)
│
├── types/
│   └── index.ts            # TypeScript types
│
├── backend/
│   ├── server.js           # Servidor Express (proxy seguro)
│   ├── package.json
│   └── .env.example
│
├── assets/                 # ⚠️ Debes crear las imágenes aquí
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🏗️ Tecnologías

| Parte | Tecnología | Versión |
|-------|-----------|---------|
| App | React Native + Expo | SDK 53 |
| Navegación | Expo Router | 5.x |
| Backend | Node.js + Express | - |
| IA | Anthropic Claude (claude-haiku) | - |
| Almacenamiento | AsyncStorage | - |
| Lenguaje | TypeScript | 5.8 |

---

## 📦 Publicar en Google Play

### 1. Cuenta de desarrollador
Ve a [play.google.com/console](https://play.google.com/console) — pago único de **25€**.

### 2. Instalar EAS CLI
```bash
npm install -g eas-cli
eas login
```

### 3. Configurar EAS
```bash
eas build:configure
```

### 4. Build de producción
```bash
eas build --platform android --profile production
```

### 5. Subir a Play Store
Descarga el `.aab` generado y súbelo desde la consola de Google Play.

---

## 💰 Costes estimados

| Servicio | Coste |
|---------|-------|
| Google Play Developer | 25€ (único) |
| Hosting backend (Railway/Render) | ~5-7€/mes |
| API Anthropic (claude-haiku) | ~0,001€/mensaje |
| Expo EAS Build | Gratis (tier básico) |

---

## 🔐 Seguridad

- La API key de Anthropic **nunca está en la app**, solo en el backend
- Rate limiting: máximo 20 peticiones/minuto por IP
- Validación de entrada en el servidor
- Historial limitado a 10 mensajes para controlar costes

---

## 🆘 Problemas comunes

**"This project is incompatible with this version of Expo Go"**
→ Asegúrate de usar `expo: "~53.0.0"` en package.json y tener Expo Go actualizado.

**"Network request failed"**
→ El backend debe estar corriendo. La IP en `.env` debe ser tu IP local (no localhost). Mismo WiFi en móvil y PC.

**"Cannot find module X"**
→ Ejecuta `npm install` en la carpeta raíz.

**La app no carga en Expo Go**
→ Prueba `expo start --clear` para limpiar la caché.

**Error de assets**
→ Crea los archivos en `assets/` (icon.png, splash.png, adaptive-icon.png) antes de arrancar.

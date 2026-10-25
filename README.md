# FitAI

App móvil de entrenamiento y nutrición hecha con **React Native + Expo** y **TypeScript**. Genera rutinas semanales según tu objetivo y los días que puedes entrenar, calcula un plan de dieta con tus macros y te enseña la técnica de cada ejercicio. Incluye un backend en Node.js preparado para conectar la app con un modelo de IA (Claude) sin exponer la API key.

<p align="center">
  <img src="docs/capturas.png" alt="Capturas de FitAI: inicio, gimnasio, rutinas y nutrición" width="100%">
</p>

## Funcionalidades

| | |
|---|---|
| **Gimnasio** | Catálogo de más de 100 ejercicios organizados por grupo muscular, con series, repeticiones, descanso, material, nivel y consejos de técnica. |
| **Generador de rutinas** | Eliges objetivo (masa, definición, fuerza o resistencia) y de 2 a 6 días por semana. La app monta un *split* adecuado, reparte ejercicios compuestos y de aislamiento sin repetirlos y ajusta series, repeticiones y descansos al objetivo. |
| **Plan de nutrición** | Calcula tu metabolismo basal y gasto diario (TDEE) a partir de peso, altura, edad, sexo y actividad; aplica superávit o déficit según el plan y reparte proteínas, carbohidratos y grasas en 5 comidas con una base de datos de más de 80 alimentos. Opción vegetariana. |
| **Perfil** | Guarda tus datos para personalizar los planes. Todo se almacena en el dispositivo (AsyncStorage). |
| **Backend de IA** | Servidor Express que hace de proxy hacia la API de Anthropic: la clave nunca viaja en la app, con *rate limiting* por IP, validación de entrada e historial recortado para controlar costes. |

## Stack

- **App:** React Native 0.81, Expo SDK 54, Expo Router (navegación por pestañas), TypeScript
- **Persistencia:** AsyncStorage
- **Backend:** Node.js + Express, `dotenv`, `cors`
- **IA:** API de Anthropic (Claude Haiku) a través del backend

## Estructura

```
app/(tabs)/        Pantallas: inicio, gimnasio, rutinas, nutrición y perfil
components/        Componentes reutilizables (chat)
data/              Bases de datos de ejercicios y alimentos
services/          Lógica: generador de rutinas, cálculo nutricional, IA y almacenamiento
hooks/             useChat
backend/server.js  Proxy seguro hacia la API de IA
```

## Cómo ejecutarla

Requisitos: Node.js 18+ y la app **Expo Go** en el móvil.

```bash
npm install
npx expo start          # escanea el QR con Expo Go
```

Para el backend de IA (opcional):

```bash
cd backend
npm install
cp .env.example .env    # añade tu ANTHROPIC_API_KEY
npm start               # http://localhost:3001
```

Y en la raíz, crea `.env` a partir de `.env.example` con `EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3001` (móvil y ordenador en la misma red WiFi).

Guía completa de instalación, publicación en Google Play y solución de problemas: [docs/guia-instalacion.md](docs/guia-instalacion.md).

---

Hecho por [Robert Valentin Moldovanu](https://www.linkedin.com/in/robert-moldovanu) · Estudiante de Ingeniería Informática (Universitat Jaume I)

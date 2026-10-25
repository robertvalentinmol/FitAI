import { Message, ChatContext } from '@/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

function buildSystemPrompt(context: ChatContext): string {
  switch (context.type) {
    case 'gym':
      return `Eres un entrenador personal experto llamado FitAI. El usuario quiere información sobre ejercicios de ${context.muscle}.
Responde en español de forma clara y motivadora.
Cuando menciones ejercicios, incluye: nombre, series x repeticiones y consejo de técnica clave.
Máximo 250 palabras por respuesta. Usa emojis con moderación.`;

    case 'routine':
      return `Eres un entrenador personal experto llamado FitAI.
El usuario tiene el objetivo de: ${context.goal} y puede entrenar ${context.days} días por semana.
Diseña rutinas detalladas con ejercicios, series, repeticiones, descansos y progresión.
Responde en español. Estructura la rutina por días claramente.
Máximo 400 palabras por respuesta.`;

    case 'diet':
      return `Eres un nutricionista deportivo experto llamado FitAI.
El usuario sigue una dieta de tipo: ${context.dietType}.
Proporciona planes nutricionales con calorías totales, macros (proteínas/carbos/grasas en gramos),
alimentos recomendados y ejemplos de menús diarios.
Responde en español de forma práctica y motivadora.
Máximo 400 palabras por respuesta.`;

    default:
      return 'Eres FitAI, un asistente de fitness y nutrición experto. Responde en español.';
  }
}

export async function sendMessage(
  userMessage: string,
  history: Message[],
  context: ChatContext
): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt: buildSystemPrompt(context),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error del servidor');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('No hay conexión con el servidor. Verifica que el backend esté corriendo.');
    }
    throw error;
  }
}

export async function generateRoutine(
  goal: string,
  days: number,
  userInfo?: string
): Promise<string> {
  const systemPrompt = `Eres FitAI, un entrenador personal experto.
Genera una rutina de gimnasio COMPLETA y detallada.
IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "name": "Nombre de la rutina",
  "description": "Descripción breve",
  "days": [
    {
      "day": 1,
      "name": "Nombre del día",
      "exercises": [
        {
          "name": "Nombre ejercicio",
          "sets": 4,
          "reps": "8-12",
          "rest": "90s",
          "notes": "Consejo técnico"
        }
      ]
    }
  ]
}`;

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Crea una rutina completa para objetivo: ${goal}, ${days} días/semana. ${userInfo || ''}`,
        history: [],
        systemPrompt,
      }),
    });

    const data = await response.json();
    return data.reply;
  } catch {
    throw new Error('Error generando la rutina');
  }
}

export async function generateDietPlan(
  dietType: string,
  userInfo: { weight: number; height: number; age: number; goal: string }
): Promise<string> {
  const systemPrompt = `Eres FitAI, un nutricionista deportivo experto.
Genera un plan nutricional COMPLETO.
IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "name": "Nombre del plan",
  "calories": 2500,
  "macros": { "protein": 180, "carbs": 280, "fat": 70 },
  "meals": [
    {
      "name": "Desayuno",
      "time": "08:00",
      "calories": 500,
      "foods": [
        { "name": "Avena", "amount": "80g", "calories": 300, "protein": 10 }
      ]
    }
  ],
  "tips": ["Consejo 1", "Consejo 2"]
}`;

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Crea plan de dieta ${dietType} para: ${JSON.stringify(userInfo)}`,
        history: [],
        systemPrompt,
      }),
    });

    const data = await response.json();
    return data.reply;
  } catch {
    throw new Error('Error generando el plan de dieta');
  }
}

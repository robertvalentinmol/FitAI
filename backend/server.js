// ============================================================
//  FitAI Backend — Node.js + Express
//  Archivo: backend/server.js
//
//  Instalación:
//    cd backend
//    npm install
//    cp .env.example .env   (y rellena ANTHROPIC_API_KEY)
//    node server.js
// ============================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ─────────────────────────────────────────────
app.use(cors({
  origin: '*', // En producción cambia esto a tu dominio
}));
app.use(express.json({ limit: '10kb' }));

// ─── Rate limiting simple ─────────────────────────────────────
const requestCounts = new Map();
const RATE_LIMIT = 20; // máx 20 peticiones por IP por minuto

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60_000; // 1 minuto

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, reset: now + windowMs });
    return next();
  }

  const data = requestCounts.get(ip);
  if (now > data.reset) {
    requestCounts.set(ip, { count: 1, reset: now + windowMs });
    return next();
  }

  if (data.count >= RATE_LIMIT) {
    return res.status(429).json({ message: 'Demasiadas peticiones. Espera un momento.' });
  }

  data.count++;
  next();
}

// ─── Validación ───────────────────────────────────────────────
function validateChatRequest(req, res, next) {
  const { message, systemPrompt } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'El mensaje es requerido.' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ message: 'Mensaje demasiado largo.' });
  }
  if (!systemPrompt || typeof systemPrompt !== 'string') {
    return res.status(400).json({ message: 'Sistema de prompt requerido.' });
  }

  next();
}

// ─── Endpoint principal (JSON, para generateRoutine / generateDietPlan) ──────
app.post('/api/chat', rateLimit, validateChatRequest, async (req, res) => {
  const { message, history = [], systemPrompt } = req.body;

  try {
    const trimmedHistory = history.slice(-10);
    const messages = [
      ...trimmedHistory,
      { role: 'user', content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic error:', err);
      return res.status(502).json({ message: 'Error del servicio de IA. Inténtalo de nuevo.' });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text;

    if (!reply) {
      return res.status(502).json({ message: 'Respuesta vacía de la IA.' });
    }

    res.json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// ─── Endpoint streaming (SSE) para el chat en tiempo real ────────────────────
app.post('/api/chat/stream', rateLimit, validateChatRequest, async (req, res) => {
  const { message, history = [], systemPrompt } = req.body;

  try {
    const trimmedHistory = history.slice(-10);
    const messages = [
      ...trimmedHistory,
      { role: 'user', content: message },
    ];

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      console.error('Anthropic error:', err);
      return res.status(502).json({ message: 'Error del servicio de IA. Inténtalo de nuevo.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
          }
        } catch {}
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error interno del servidor.' });
    } else {
      res.end();
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ FitAI Backend corriendo en http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY no configurada en .env');
  }
});

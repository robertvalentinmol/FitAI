import { useState, useCallback, useRef } from 'react';
import { Message, ChatContext, ChatSession } from '@/types';
import { sendMessage } from '@/services/aiService';
import { saveChatSession } from '@/services/storage';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function useChat(context: ChatContext) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(generateId());

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      // Placeholder visible inmediatamente mientras la IA responde
      const assistantId = generateId();
      const placeholder: Message = {
        id: assistantId,
        role: 'assistant',
        content: '...',
        timestamp: new Date(),
      };

      // Snapshot del historial antes de añadir los nuevos mensajes
      const historySnapshot = messages;

      setMessages((prev) => [...prev, userMsg, placeholder]);

      try {
        const reply = await sendMessage(text, historySnapshot, context);

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: reply } : m))
        );

        const session: ChatSession = {
          id: sessionIdRef.current,
          title: text.substring(0, 40),
          messages: [
            ...historySnapshot,
            userMsg,
            { id: assistantId, role: 'assistant', content: reply, timestamp: new Date() },
          ],
          context,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        saveChatSession(session).catch(console.error);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: `❌ ${msg}` } : m))
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, context, isLoading]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionIdRef.current = generateId();
  }, []);

  return { messages, isLoading, error, send, reset };
}

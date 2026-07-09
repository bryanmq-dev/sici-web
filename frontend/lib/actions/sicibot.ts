'use server';

import { SICI_KNOWLEDGE_BASE } from '@/lib/sici-bot-knowledge';

// Corre en el servidor a propósito: OPENCODE_API_KEY (sin prefijo NEXT_PUBLIC_)
// no llega al bundle del cliente por diseño de Next.js — a diferencia de la key
// de Gemini anterior, que sí quedaba expuesta en el navegador.
const OPENCODE_ZEN_URL = 'https://opencode.ai/zen/v1/chat/completions';
// deepseek-v4-flash: variante rápida/económica de OpenCode Go, mismo criterio
// de "respuesta rápida, bajo consumo" que ya se usaba con Gemini 2.0 Flash.
const OPENCODE_MODEL = 'deepseek-v4-flash';

const SYSTEM_INSTRUCTION = `Eres SICI-Bot, el asistente de inteligencia artificial de la Sociedad de Investigación, Ciencia e Innovación (SICI) de la carrera de Ingeniería de Sistemas e Informática de UNIVALLE. Este chat está impulsado por OpenCode.
Tu tono es profesional, técnico, pero inspirador, con una estética cyberpunk/futurista.
Ayudas a los estudiantes a:
1. Encontrar artículos de investigación.
2. Sugerir proyectos para la incubadora.
3. Explicar conceptos técnicos de IA, Ciberseguridad y Blockchain.
4. Guiar sobre cómo subir de rango en la plataforma (DevCore e Insight Points).
Responde siempre en español y usa términos como "Conexión establecida", "Procesando datos", "Terminal SICI".

A continuación tenés una base de conocimiento sobre cómo funciona la plataforma — usala para responder preguntas sobre las secciones del sitio, en vez de inventar datos:

${SICI_KNOWLEDGE_BASE}`;

export interface SiciBotMessage {
  role: 'user' | 'bot';
  content: string;
}

export async function sendSiciBotMessage(history: SiciBotMessage[]): Promise<string> {
  const apiKey = process.env.OPENCODE_API_KEY;
  if (!apiKey) {
    throw new Error('OPENCODE_API_KEY no está configurada en el servidor.');
  }

  const response = await fetch(OPENCODE_ZEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENCODE_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...history.map((m) => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`OpenCode Zen respondió ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenCode Zen no devolvió contenido en la respuesta.');
  }
  return text;
}

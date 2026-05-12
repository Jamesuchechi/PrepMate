import Groq from 'groq-sdk';
import { Mistral } from '@mistralai/mistralai';

// Initialize Clients
const groq = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY }) 
  : null;

const mistral = process.env.MISTRAL_API_KEY 
  ? new Mistral({ apiKey: process.env.MISTRAL_API_KEY }) 
  : null;

// Stable Models
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant'
];

const MISTRAL_MODELS = [
  'mistral-large-latest',
  'mistral-medium-latest',
  'mistral-small-latest'
];

export async function generateChatCompletion(params: {
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
  jsonMode?: boolean;
}) {
  const { messages, jsonMode } = params;
  
  // Try GROQ first
  if (groq) {
    for (const model of GROQ_MODELS) {
      try {
        console.log(`Trying GROQ with model: ${model}`);
        const completion = await groq.chat.completions.create({
          messages,
          model,
          temperature: 0.7,
          response_format: jsonMode ? { type: 'json_object' } : undefined,
        });
        
        const content = completion.choices[0]?.message?.content;
        if (content) return content;
      } catch (error) {
        console.error(`GROQ model ${model} failed:`, error);
        continue; // Try next GROQ model
      }
    }
  }

  // Fallback to Mistral
  if (mistral) {
    for (const model of MISTRAL_MODELS) {
      try {
        console.log(`Trying Mistral with model: ${model}`);
        const completion = await mistral.chat.complete({
          model,
          messages,
          temperature: 0.7,
          responseFormat: jsonMode ? { type: 'json_object' } : undefined,
        });
        
        const choice = completion.choices?.[0];
        let content: string | null = null;
        
        if (typeof choice?.message?.content === 'string') {
          content = choice.message.content;
        } else if (Array.isArray(choice?.message?.content)) {
          const firstChunk = choice.message.content[0];
          if (firstChunk && 'text' in firstChunk && typeof firstChunk.text === 'string') {
            content = firstChunk.text;
          }
        }

        if (content) return content;
      } catch (error) {
        console.error(`Mistral model ${model} failed:`, error);
        continue; // Try next Mistral model
      }
    }
  }

  throw new Error('All AI providers and models failed to respond.');
}

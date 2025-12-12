import { TextServiceClient } from '@google-ai/generativelanguage';
import { logger } from '../config/Logger';

const client = new TextServiceClient({
  apiKey: process.env.GOOGLE_API_KEY!,
});

/**
 * Generates a summary for a given text using Gemini.
 */
export const generateSummary = async (text: string): Promise<string> => {
  if (!text.trim()) return '';
  logger.info('Generating summary for text of length:', text.length);
  const response = await client.generateText({
    model: 'gemini-mini',
    prompt: `Summarize the following text in 1-2 sentences. You must ensure that the output remains smaller than the input text:\n\n${text}`,
    maxOutputTokens: 150,
  });

  const summary = response.output?.[0]?.content;
  return summary ?? '';
};

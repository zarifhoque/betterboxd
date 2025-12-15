import OpenAI from 'openai';
import { logger } from '../config/Logger';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export const generateSummary = async (text: string): Promise<string> => {
  if (!text.trim()) return '';
  logger.info('Generating summary for text length:', text.length);

  try {
    const response = await openai.chat.completions.create({
      model: 'gemini-2', // Use a valid Gemini model code name
      messages: [
        {
          role: 'system',
          content:
            'Summarize the following text in 2-3 sentences, highlighting key events. Do not just repeat the title.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 150,
    });

    return response.choices?.[0]?.message?.content ?? '';
  } catch (error) {
    logger.error('Error generating summary:', error);
    return '';
  }
};

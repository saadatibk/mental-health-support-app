import axios from 'axios';
import { CLAUDE_API_KEY } from '@env';

// Define the base URL for Claude API
const API_BASE_URL = 'https://api.anthropic.com/v1';

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Make sure to add your Claude API key in your .env file
// Also add a proper setup for environment variables in your project
// CLAUDE_API_KEY=your_api_key_here

// Create an axios instance with default headers
const claudeApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'x-api-key': CLAUDE_API_KEY || '',
  },
});

export const sendMessageToClaude = async (
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: string
): Promise<string> => {
  try {
    // Prepare the system prompt with mental health context
    const systemPrompt = `
      You are a supportive, empathetic AI assistant specializing in mental health support. 
      Your name is Claude, and you're here to listen, provide emotional support, and offer helpful perspectives.
      
      Guidelines:
      - Be warm, compassionate, and non-judgmental
      - Focus on active listening and validation
      - Suggest healthy coping strategies when appropriate
      - Recognize your limitations - you're not a replacement for professional therapy
      - For crisis situations, always recommend professional help and provide crisis resources
      - Never diagnose medical or psychological conditions
      - Use simple, clear language and avoid clinical jargon unless introduced by the user
      - Adapt your tone to match the user's emotional state
      - Respect privacy and maintain confidentiality
      
      ${userContext ? `User Context: ${userContext}` : ''}
      
      If the user appears to be in crisis or mentions self-harm, immediately provide crisis resources:
      - National Suicide Prevention Lifeline: 988 or 1-800-273-8255
      - Crisis Text Line: Text HOME to 741741
    `;

    const response = await claudeApi.post<ClaudeResponse>('/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    // Extract text from the response
    return response.data.content[0].text;
  } catch (error) {
    console.error('Error sending message to Claude:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', error.response?.data);
    }
    throw new Error('Failed to get response from Claude');
  }
};

// Function to detect concerning content
export const detectCrisis = (message: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'don\'t want to live',
    'self-harm', 'cut myself', 'hurt myself', 'die', 'death',
    'overdose', 'no reason to live', 'can\'t go on'
  ];
  
  return crisisKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
};
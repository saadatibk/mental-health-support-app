import { useState, useCallback } from 'react';
import { useChat } from '../context/ChatContext';
import { sendMessageToClaude, detectCrisis } from '../api/claudeAPI';

export const useClaudeChat = () => {
  const { messages, addMessage, userProfile, setIsTyping } = useChat();
  const [isCrisisDetected, setIsCrisisDetected] = useState(false);

  const sendMessage = useCallback(async (text: string, emotion?: Emotion) => {
    // Add user message
    addMessage(text, 'user', emotion);
    
    // Check for crisis keywords
    const crisis = detectCrisis(text);
    if (crisis) {
      setIsCrisisDetected(true);
    }
    
    try {
      // Prepare conversation history for Claude API
      const messageHistory = messages.map(msg => ({
        role: msg.sender as 'user' | 'assistant',
        content: msg.text
      }));
      
      // Add the new user message
      messageHistory.push({
        role: 'user',
        content: text
      });
      
      // User context for Claude
      let userContext = '';
      if (userProfile) {
        userContext = `User's name: ${userProfile.name}. `;
        if (userProfile.preferredName) {
          userContext += `Preferred name: ${userProfile.preferredName}. `;
        }
        if (userProfile.supportAreas && userProfile.supportAreas.length > 0) {
          userContext += `Areas they're seeking support with: ${userProfile.supportAreas.join(', ')}. `;
        }
      }
      
      // Set typing indicator
      setIsTyping(true);
      
      // Get response from Claude
      const response = await sendMessageToClaude(messageHistory, userContext);
      
      // Add Claude's response
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error in chat:', error);
      addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'assistant');
    } finally {
      setIsTyping(false);
    }
  }, [messages, addMessage, userProfile, setIsTyping]);

  return {
    sendMessage,
    isCrisisDetected,
    setIsCrisisDetected
  };
};
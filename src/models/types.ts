export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: number;
    emotion?: Emotion;
  }
  
  export type Emotion = 'happy' | 'sad' | 'anxious' | 'angry' | 'neutral' | 'calm';
  
  export interface UserProfile {
    name: string;
    preferredName?: string;
    goals?: string[];
    supportAreas?: string[];
  }
  
  export interface Resource {
    id: string;
    title: string;
    description: string;
    url?: string;
    category: 'crisis' | 'articles' | 'exercises' | 'community';
    tags: string[];
  }
  
  // File: src/context/ChatContext.tsx
  import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Message, UserProfile } from '../models/types';
  import { v4 as uuidv4 } from 'uuid';
  
  interface ChatContextProps {
    messages: Message[];
    addMessage: (text: string, sender: 'user' | 'assistant', emotion?: Emotion) => void;
    clearMessages: () => void;
    userProfile: UserProfile | null;
    updateUserProfile: (profile: UserProfile) => void;
    isTyping: boolean;
    setIsTyping: (typing: boolean) => void;
  }
  
  const ChatContext = createContext<ChatContextProps>({
    messages: [],
    addMessage: () => {},
    clearMessages: () => {},
    userProfile: null,
    updateUserProfile: () => {},
    isTyping: false,
    setIsTyping: () => {},
  });
  
  export const useChat = () => useContext(ChatContext);
  
  export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isTyping, setIsTyping] = useState(false);
  
    // Load saved data on start
    useEffect(() => {
      const loadData = async () => {
        try {
          const savedMessages = await AsyncStorage.getItem('chatMessages');
          const savedProfile = await AsyncStorage.getItem('userProfile');
          
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          } else {
            // Add initial welcome message
            const welcomeMessage: Message = {
              id: uuidv4(),
              text: "Hi there! I'm your mental health companion. How are you feeling today?",
              sender: 'assistant',
              timestamp: Date.now(),
              emotion: 'neutral'
            };
            setMessages([welcomeMessage]);
          }
          
          if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile));
          }
        } catch (error) {
          console.error('Error loading data', error);
        }
      };
      
      loadData();
    }, []);
  
    // Save messages when they change
    useEffect(() => {
      if (messages.length > 0) {
        AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      }
    }, [messages]);
  
    // Save user profile when it changes
    useEffect(() => {
      if (userProfile) {
        AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      }
    }, [userProfile]);
  
    const addMessage = (text: string, sender: 'user' | 'assistant', emotion?: Emotion) => {
      const newMessage: Message = {
        id: uuidv4(),
        text,
        sender,
        timestamp: Date.now(),
        emotion,
      };
      
      setMessages(prev => [...prev, newMessage]);
    };
  
    const clearMessages = () => {
      // Keep only the welcome message
      const welcomeMessage: Message = {
        id: uuidv4(),
        text: "Hi there! I'm your mental health companion. How are you feeling today?",
        sender: 'assistant',
        timestamp: Date.now(),
        emotion: 'neutral'
      };
      
      setMessages([welcomeMessage]);
    };
  
    const updateUserProfile = (profile: UserProfile) => {
      setUserProfile(profile);
    };
  
    return (
      <ChatContext.Provider
        value={{
          messages,
          addMessage,
          clearMessages,
          userProfile,
          updateUserProfile,
          isTyping,
          setIsTyping,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
  };
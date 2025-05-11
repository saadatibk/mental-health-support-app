import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Text,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import EmotionSelector from '../components/EmotionSelector';
import { useChat } from '../context/ChatContext';
import { useClaudeChat } from '../hooks/useClaudeChat';
import { useTheme } from '../theme/theme';
import { Message, Emotion } from '../models/types';

const ChatScreen: React.FC = () => {
  const { messages, isTyping } = useChat();
  const { sendMessage, isCrisisDetected, setIsCrisisDetected } = useClaudeChat();
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  // Crisis alert modal
  useEffect(() => {
    if (isCrisisDetected) {
      Alert.alert(
        'Are you in crisis?',
        'If you\'re experiencing thoughts of suicide or severe distress, please reach out for immediate help:\n\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741 (Crisis Text Line)\n• Call 911 or go to your nearest emergency room',
        [
          {
            text: 'See Resources',
            onPress: () => {
              navigation.navigate('Resources');
              setIsCrisisDetected(false);
            },
          },
          {
            text: 'OK',
            onPress: () => setIsCrisisDetected(false),
          },
        ],
        { cancelable: false }
      );
    }
  }, [isCrisisDetected, navigation]);
  
  const handleSendMessage = (text: string, emotion?: Emotion) => {
    sendMessage(text, emotion);
  };
  
  const handleSelectEmotion = (emotion: Emotion) => {
    setCurrentEmotion(emotion);
    setShowEmotionPicker(false);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Header 
        title="Mental Health Companion" 
        showResourcesButton 
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={[
          styles.messagesContainer,
          { paddingHorizontal: spacing.md }
        ]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isTyping && (
        <View style={[
          styles.typingIndicator,
          { 
            backgroundColor: colors.assistantBubble,
            borderRadius: 20,
            marginLeft: spacing.md,
            marginBottom: spacing.md,
          }
        ]}>
          <Text style={{ color: colors.text, marginRight: spacing.sm }}>Claude is typing</Text>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      
      {showEmotionPicker && (
        <EmotionSelector onSelect={handleSelectEmotion} />
      )}
      
      <ChatInput 
        onSend={handleSendMessage}
        showEmotionPicker={() => setShowEmotionPicker(true)}
        currentEmotion={currentEmotion}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

export default ChatScreen;
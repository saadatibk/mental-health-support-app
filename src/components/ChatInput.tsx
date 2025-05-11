import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';
import { Emotion } from '../models/types';

interface ChatInputProps {
  onSend: (message: string, emotion?: Emotion) => void;
  showEmotionPicker: () => void;
  currentEmotion?: Emotion;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  showEmotionPicker,
  currentEmotion
}) => {
  const [inputText, setInputText] = useState('');
  const { colors, spacing, borderRadius } = useTheme();
  
  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim(), currentEmotion);
      setInputText('');
      Keyboard.dismiss();
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[
        styles.container,
        { 
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.cardBackground }
          ]}
          onPress={showEmotionPicker}
        >
          <Ionicons 
            name={getEmotionIcon(currentEmotion)} 
            size={24} 
            color={getEmotionColor(currentEmotion, colors)}
          />
        </TouchableOpacity>
        
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.inputBackground,
              color: colors.text,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            }
          ]}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        
        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: inputText.trim() ? colors.primary : colors.cardBackground,
              opacity: inputText.trim() ? 1 : 0.5,
            }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={inputText.trim() ? 'white' : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Helper functions for emotion icons
const getEmotionIcon = (emotion?: Emotion): string => {
  switch (emotion) {
    case 'happy': return 'sunny';
    case 'calm': return 'water';
    case 'neutral': return 'remove';
    case 'anxious': return 'pulse';
    case 'sad': return 'rainy';
    case 'angry': return 'flame';
    default: return 'happy';
  }
};

// Reusing the emotion color function from EmotionSelector
const getEmotionColor = (colors: any, emotion?: Emotion): string => {
    switch (emotion) {
        case 'happy': return colors.success;
        case 'calm': return colors.info;
        case 'neutral': return colors.textSecondary;
        case 'anxious': return colors.warning;
        case 'sad': return colors.info;
        case 'angry': return colors.error;
        default: return colors.primary;
    }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ChatInput;

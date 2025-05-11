import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../theme/theme';
import { Message } from '../models/types';

interface ChatBubbleProps {
    message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { colors, spacing, borderRadius } = useTheme();
  const isUser = message.sender === 'user';

  // Choose the appropriate bubble color based on sender
  const bubbleColor = isUser ? colors.userBubble : colors.assistantBubble;
  const textColor = isUser ? colors.text : colors.text;

  // Format the timestamp
  const formattedTime = format(message.timestamp, 'h:mm a');

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../../assets/claude-avatar.png')} 
            style={styles.avatar}
          />
        </View>
      )}
      
      <View style={[
        styles.bubble,
        { 
          backgroundColor: bubbleColor,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginLeft: isUser ? spacing.md : 0,
          marginRight: isUser ? 0 : spacing.md,
        }
      ]}>
        <Text style={[styles.text, { color: textColor }]}>
          {message.text}
        </Text>
        
        <Text style={[
          styles.timestamp,
          { color: isUser ? colors.textSecondary : colors.textSecondary }
        ]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  bubble: {
    minWidth: 60,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  }
});

export default ChatBubble;

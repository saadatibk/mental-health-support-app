import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/theme';
import { Emotion } from '../models/types';

interface EmotionSelectorProps {
  onSelect: (emotion: Emotion) => void;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ onSelect }) => {
  const { colors, spacing, borderRadius } = useTheme();
  
  const emotions: Array<{ value: Emotion; label: string; icon: string }> = [
    { value: 'happy', label: 'Happy', icon: 'sunny' },
    { value: 'calm', label: 'Calm', icon: 'water' },
    { value: 'neutral', label: 'Neutral', icon: 'remove' },
    { value: 'anxious', label: 'Anxious', icon: 'pulse' },
    { value: 'sad', label: 'Sad', icon: 'rainy' },
    { value: 'angry', label: 'Angry', icon: 'flame' },
  ];
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        How are you feeling?
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.emotionsContainer}
      >
        {emotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.value}
            style={[
              styles.emotionButton,
              { 
                backgroundColor: colors.cardBackground,
                borderRadius: borderRadius.lg,
                marginRight: spacing.md,
                borderColor: colors.border,
              }
            ]}
            onPress={() => onSelect(emotion.value)}
          >
            <Ionicons 
              name={emotion.icon as any} 
              size={24} 
              color={getEmotionColor(emotion.value, colors)}
            />
            <Text style={[styles.emotionLabel, { color: colors.text }]}>
              {emotion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper function to get color based on emotion
const getEmotionColor = (emotion: Emotion, colors: any): string => {
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
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emotionsContainer: {
    paddingHorizontal: 16,
  },
  emotionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  emotionLabel: {
    marginTop: 4,
    fontSize: 14,
  }
});

export default EmotionSelector;
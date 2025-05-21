import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { useTheme } from '../theme/theme';

const OnboardingScreen: React.FC = () => {
  const { updateUserProfile } = useChat();
  const navigation = useNavigation();
  const { colors, spacing, borderRadius, fontSizes } = useTheme();
  
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const supportAreas = [
    { id: 'anxiety', label: 'Anxiety', icon: 'pulse' },
    { id: 'depression', label: 'Depression', icon: 'rainy' },
    { id: 'stress', label: 'Stress', icon: 'thunderstorm' },
    { id: 'sleep', label: 'Sleep Issues', icon: 'moon' },
    { id: 'relationships', label: 'Relationships', icon: 'people' },
    { id: 'self_esteem', label: 'Self-Esteem', icon: 'heart' },
    { id: 'grief', label: 'Grief & Loss', icon: 'flower' },
    { id: 'anger', label: 'Anger', icon: 'flame' },
    { id: 'focus', label: 'Focus & Productivity', icon: 'timer' },
  ];
  
  const toggleArea = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== areaId));
    } else {
      setSelectedAreas([...selectedAreas, areaId]);
    }
  };
  
  const handleContinue = () => {
    if (step === 0) {
      if (name.trim()) {
        setStep(1);
      }
    } else {
      // Save user profile and navigate to chat
      updateUserProfile({
        name: name.trim(),
        supportAreas: selectedAreas.map(id => 
          supportAreas.find(area => area.id === id)?.label || ''
        ).filter(Boolean),
      });
      
      navigation.navigate('Chat');
    }
  };
  
  const renderStep0 = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/app-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text, fontSize: fontSizes.xxl }]}>
            Your Mental Health Companion
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            A safe space to talk, reflect, and feel supported
          </Text>
        </View>
        
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>
            What should I call you?
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              }
            ]}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: name.trim() ? colors.primary : colors.primary + '50',
              borderRadius: borderRadius.md,
            }
          ]}
          onPress={handleContinue}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
  
  const renderStep1 = () => (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text, fontSize: fontSizes.xl }]}>
          What would you like support with?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select all that apply
        </Text>
        
        <View style={styles.areasGrid}>
          {supportAreas.map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.areaButton,
                { 
                  backgroundColor: selectedAreas.includes(area.id) 
                    ? colors.primary + '20' 
                    : colors.cardBackground,
                  borderColor: selectedAreas.includes(area.id)
                    ? colors.primary
                    : colors.border,
                  borderRadius: borderRadius.md,
                }
              ]}
              onPress={() => toggleArea(area.id)}
            >
              <Ionicons 
                name={area.icon as any} 
                size={24} 
                color={selectedAreas.includes(area.id) ? colors.primary : colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.areaLabel,
                  { 
                    color: selectedAreas.includes(area.id) 
                      ? colors.primary 
                      : colors.text 
                  }
                ]}
              >
                {area.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { 
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
            }
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            {selectedAreas.length > 0 ? 'Continue' : 'Skip'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {step === 0 ? renderStep0() : renderStep1()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  input: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E1E5EA',
  },
  button: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  areaButton: {
    width: '30%',
    margin: '1.66%',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    aspectRatio: 1,
  },
  areaLabel: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OnboardingScreen;

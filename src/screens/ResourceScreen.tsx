import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';
import TherapyResources from '../components/TherapyResources';
import { useTheme } from '../theme/theme';
import { Resource } from '../models/types';

const ResourcesScreen: React.FC = () => {
  const { colors } = useTheme();
  
  // Crisis resources
  const crisisResources: Resource[] = [
    {
      id: 'crisis-1',
      title: 'National Suicide Prevention Lifeline',
      description: 'Call or text 988 for 24/7 support if you are in crisis or emotional distress.',
      url: 'tel:988',
      category: 'crisis',
      tags: ['Suicide', 'Crisis', 'Immediate Help'],
    },
    {
      id: 'crisis-2',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741 to connect with a crisis counselor 24/7.',
      url: 'sms:741741&body=HOME',
      category: 'crisis',
      tags: ['Text', 'Crisis', 'Counseling'],
    },
    {
      id: 'crisis-3',
      title: 'Emergency Services',
      description: 'Call 911 immediately if you or someone you know is in immediate danger.',
      url: 'tel:911',
      category: 'crisis',
      tags: ['Emergency', 'Urgent', 'Immediate Help'],
    },
  ];
  
  // Self-help resources
  const selfHelpResources: Resource[] = [
    {
      id: 'self-1',
      title: 'Mindfulness Techniques',
      description: 'Learn practical mindfulness exercises to reduce stress and anxiety.',
      url: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
      category: 'exercises',
      tags: ['Mindfulness', 'Stress', 'Anxiety'],
    },
    {
      id: 'self-2',
      title: 'Self-Care Assessment',
      description: 'Evaluate your self-care routine with this comprehensive checklist.',
      url: 'https://www.therapistaid.com/therapy-worksheet/self-care-assessment',
      category: 'articles',
      tags: ['Self-Care', 'Assessment', 'Wellness'],
    },
    {
      id: 'self-3',
      title: 'Sleep Improvement Guide',
      description: 'Evidence-based strategies to improve your sleep quality.',
      url: 'https://www.sleepfoundation.org/sleep-hygiene',
      category: 'articles',
      tags: ['Sleep', 'Health', 'Habits'],
    },
    {
      id: 'self-4',
      title: 'Grounding Exercises',
      description: 'Techniques to help during moments of high anxiety or stress.',
      url: 'https://www.therapistaid.com/therapy-worksheet/grounding-techniques',
      category: 'exercises',
      tags: ['Anxiety', 'Grounding', 'Coping Skills'],
    },
  ];
  
  // Community resources
  const communityResources: Resource[] = [
    {
      id: 'comm-1',
      title: 'Mental Health America',
      description: 'Find local MHA affiliates and community resources near you.',
      url: 'https://mhanational.org/find-affiliate',
      category: 'community',
      tags: ['Community', 'Support', 'Local Resources'],
    },
    {
      id: 'comm-2',
      title: 'NAMI Support Groups',
      description: 'Free peer-led support groups for individuals living with mental health conditions.',
      url: 'https://www.nami.org/Support-Education/Support-Groups',
      category: 'community',
      tags: ['Support Groups', 'Peer Support', 'NAMI'],
    },
    {
      id: 'comm-3',
      title: 'Psychology Today Therapist Finder',
      description: 'Find therapists, counselors, and treatment centers in your area.',
      url: 'https://www.psychologytoday.com/us/therapists',
      category: 'community',
      tags: ['Therapy', 'Find Help', 'Professional'],
    },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Mental Health Resources" showBackButton />
      
      <ScrollView>
        <TherapyResources 
          resources={crisisResources} 
          title="Crisis Resources" 
        />
        
        <TherapyResources 
          resources={selfHelpResources} 
          title="Self-Help Resources" 
        />
        
        <TherapyResources 
          resources={communityResources} 
          title="Community & Professional Help" 
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ResourcesScreen;
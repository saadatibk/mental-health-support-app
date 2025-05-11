import { Platform } from 'react-native';

// Function to safely open links based on platform
export const safeLinkOpen = (url: string): boolean => {
  // For crisis resources, we want to handle phone/sms links differently
  if (url.startsWith('tel:') || url.startsWith('sms:')) {
    if (Platform.OS === 'web') {
      // On web, we can't directly use tel: or sms: protocols reliably
      return false;
    }
  }
  
  return true;
};

// Format time as relative (e.g. "just now", "5m ago", etc.)
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return new Date(timestamp).toLocaleDateString();
};

// Detect if the text might contain crisis indicators
export const detectCrisisKeywords = (text: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'don\'t want to live',
    'self-harm', 'cut myself', 'hurt myself', 'die', 'death',
    'overdose', 'no reason to live', 'can\'t go on'
  ];
  
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};
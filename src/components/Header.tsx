import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showResourcesButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = false,
  showResourcesButton = false 
}) => {
  const navigation = useNavigation();
  const { colors, spacing, fontSizes } = useTheme();
  
  return (
    <SafeAreaView edges={['top']}>
      <View style={[
        styles.container,
        { backgroundColor: colors.background, paddingHorizontal: spacing.md }
      ]}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        
        <Text style={[
          styles.title,
          { color: colors.text, fontSize: fontSizes.lg }
        ]}>
          {title}
        </Text>
        
        {showResourcesButton && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('Resources')}
            style={styles.button}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5EA',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Header;

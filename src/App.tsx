import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ChatProvider } from './context/ChatContext';
import OnboardingScreen from './screens/OnboardingScreen';
import ChatScreen from './screens/ChatScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import { ThemeProvider } from './theme/theme';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ChatProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Resources" component={ResourcesScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ChatProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};


export default App;

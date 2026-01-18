import "./global.css";
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import PickupLineScreen from './src/screens/PickupLineScreen';
import ReplyGeneratorScreen from './src/screens/ReplyGeneratorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Stack = createNativeStackNavigator();

const Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#7f13ec',
    background: '#191022',
    card: '#191022',
    text: '#ffffff',
    border: 'rgba(255, 255, 255, 0.1)',
    notification: '#7f13ec',
  },
};

function RootNavigator() {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#191022', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7f13ec" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#191022' },
        animation: 'ios_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        detachPreviousScreen: false,
      }}
    >
      {user ? (
        hasCompletedOnboarding ? (
          // Authenticated & Profile Complete
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PickupLine" component={PickupLineScreen} />
            <Stack.Screen name="ReplyGenerator" component={ReplyGeneratorScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          // Authenticated but Profile Incomplete
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )
      ) : (
        // Not Authenticated
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#191022' }}>
          <NavigationContainer theme={Theme}>
            <RootNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

import "./global.css";
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { enableScreens } from 'react-native-screens';

import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import PickupLineScreen from './src/screens/PickupLineScreen';
import ReplyGeneratorScreen from './src/screens/ReplyGeneratorScreen';

// enableScreens();
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
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#191022' }}>
        <NavigationContainer theme={Theme}>
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
            initialRouteName="Welcome"
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="PickupLine" component={PickupLineScreen} />
            <Stack.Screen name="ReplyGenerator" component={ReplyGeneratorScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

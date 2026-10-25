import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';

// SDK 53: preventAutoHideAsync es async pero se puede llamar en el nivel del módulo
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Ocultar splash screen en cuanto el layout esté montado
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

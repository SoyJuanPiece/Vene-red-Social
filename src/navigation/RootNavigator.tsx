import React, { useRef } from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Placeholder para screens de app (crear en fases posteriores)
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18 }}>{name} Screen</Text>
    <Text style={{ fontSize: 12, color: '#999' }}>Fase 1+</Text>
  </View>
);

// Navigation Types
type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
};

type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  Search: undefined;
  Explore: undefined;
  Messages: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppStackParamList>();

/**
 * Auth Stack - Splash, Login, SignUp
 */
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Splash"
        component={SplashScreen}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
      />
    </AuthStack.Navigator>
  );
};

/**
 * App Tab Navigator - Bottom tabs
 */
const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          borderTopColor: colors.border,
          borderTopWidth: 1,
          backgroundColor: colors.background,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={() => <PlaceholderScreen name="Home" />}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={() => <PlaceholderScreen name="Search" />}
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={() => <PlaceholderScreen name="Explore" />}
        options={{
          title: 'Crear',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={() => <PlaceholderScreen name="Messages" />}
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen name="Profile" />}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator - Switches between Auth and App
 */
export const RootNavigator = () => {
  const { isLoading, user } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoading ? (
          // Loading state
          <Stack.Screen
            name="Auth"
            component={SplashScreen}
            options={{
              animation: 'none',
            }}
          />
        ) : user ? (
          // User is logged in
          <Stack.Screen
            name="App"
            component={AppTabNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          // User is not logged in
          <Stack.Screen
            name="Auth"
            component={AuthStackNavigator}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

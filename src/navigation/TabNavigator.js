import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PlaceholderScreen from '../screens/PlaceholderScreen';
import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import CalcScreen from '../screens/CalcScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const icons = {
  Home: 'home',
  Diary: 'book',
  Stats: 'stats-chart',
  Calc: 'time',
  Relax: 'moon',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 10 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Головна' }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ title: 'Щоденник' }} />
      <Tab.Screen name="Stats" options={{ title: 'Статистика' }}>
        {() => <PlaceholderScreen title="Статистика" />}
      </Tab.Screen>
      <Tab.Screen name="Calc" component={CalcScreen} options={{ title: 'Розрахунок' }} />
      <Tab.Screen name="Relax" options={{ title: 'Релакс' }}>
        {() => <PlaceholderScreen title="Релакс" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
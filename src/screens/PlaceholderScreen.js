import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function PlaceholderScreen({ title }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.box}>
        <Text style={styles.text}>Екран у розробці 🌙</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  box: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.muted, fontSize: 16 },
});

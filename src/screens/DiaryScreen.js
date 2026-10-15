import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../theme';
import { QUALITIES } from '../constants';
import { formatDuration } from '../utils/time';

export default function DiaryScreen({ navigation }) {
  const entries = useSelector((s) => s.sleep.entries);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Щоденник сну</Text>
      <Text style={styles.subtitle}>Ваші записи про сон</Text>

      <FlatList
        style={{ marginTop: 16 }}
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Поки що немає записів. Додайте перший!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.range}>
                {item.bedtime} – {item.wake}
              </Text>
              <Text style={styles.meta}>
                {formatDuration(item.durationMin)} · {item.date}
              </Text>
              {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </View>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 24 }}>{QUALITIES[item.quality].emoji}</Text>
              <Ionicons
                name={item.synced ? 'cloud-done' : 'cloud-offline'}
                size={16}
                color={item.synced ? colors.success : colors.muted}
              />
            </View>
          </View>
        )}
      />

      <Pressable
        style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Ionicons name="add" size={20} color={colors.accentText} />
        <Text style={styles.addText}>Додати запис</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  range: { color: colors.text, fontSize: 20, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  notes: { color: colors.muted, fontSize: 13, marginTop: 8, fontStyle: 'italic' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginBottom: 12,
  },
  addText: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
});

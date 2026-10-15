import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../theme';
import { formatDuration } from '../utils/time';

const USER_NAME = 'Богдан';

const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Доброго ранку,';
  if (h >= 12 && h < 18) return 'Добрий день,';
  if (h >= 18 && h < 23) return 'Добрий вечір,';
  return 'Доброї ночі,';
};

const TILES = [
  { key: 'diary', title: 'Щоденник', icon: 'book', color: '#818CF8', tab: 'Diary' },
  { key: 'calc', title: 'Розрахунок', icon: 'calculator', color: colors.accent, tab: 'Calc' },
  { key: 'breath', title: 'Дихання', icon: 'water', color: '#38BDF8', tab: 'Relax' },
  { key: 'sounds', title: 'Звуки', icon: 'musical-notes', color: colors.success, tab: 'Relax' },
];

export default function HomeScreen({ navigation }) {
  const entries = useSelector((s) => s.sleep.entries);

  // Статистика за останні 7 записів
  const recent = entries.slice(0, 7);
  const hasData = recent.length > 0;
  const avgQuality = hasData ? recent.reduce((s, e) => s + e.quality, 0) / recent.length : 0;
  const percent = Math.round(((avgQuality + 1) / 5) * 100);
  const avgMin = hasData
    ? Math.round(recent.reduce((s, e) => s + e.durationMin, 0) / recent.length)
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>{greeting()}</Text>
            <Text style={styles.name}>{USER_NAME}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER_NAME[0]}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Якість сну</Text>
          {hasData ? (
            <>
              <Text style={styles.percent}>
                {percent}
                <Text style={styles.percentSign}>%</Text>
              </Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${percent}%` }]} />
              </View>
              <Text style={styles.cardText}>
                Середня оцінка за останні записи ({recent.length}). Середня тривалість сну:{' '}
                {formatDuration(avgMin)}.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.percent}>—</Text>
              <Text style={styles.cardText}>
                Додайте перший запис у щоденнику, і тут з’явиться ваша статистика.
              </Text>
            </>
          )}
        </View>

        <Text style={styles.section}>Швидкий доступ</Text>
        <View style={styles.grid}>
          {TILES.map((t) => (
            <Pressable
              key={t.key}
              style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate(t.tab)}
            >
              <View style={[styles.tileIcon, { backgroundColor: `${t.color}26` }]}>
                <Ionicons name={t.icon} size={20} color={t.color} />
              </View>
              <Text style={styles.tileTitle}>{t.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greet: { color: colors.muted, fontSize: 13 },
  name: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 2 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accentText, fontSize: 16, fontWeight: '800' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 20,
  },
  cardLabel: { color: colors.muted, fontSize: 13 },
  percent: { color: colors.text, fontSize: 40, fontWeight: '800', marginTop: 6 },
  percentSign: { fontSize: 20, color: colors.accent },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.input,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
  cardText: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 12 },
  section: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: 26, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    minHeight: 92,
    justifyContent: 'space-between',
  },
  tileIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 12 },
});
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../theme';
import { formatTime, formatDuration } from '../utils/time';
import {
  bedtimesForWake,
  wakeTimesForBed,
  cyclesWord,
  CYCLE_MIN,
  FALL_ASLEEP_MIN,
  OPTIMAL_CYCLES,
} from '../utils/sleepCycles';

const BADGES = { 4: 'Мінімум', 5: 'Оптимально', 6: 'Повноцінно' };

const makeTime = (h, m) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

export default function CalcScreen() {
  const [mode, setMode] = useState('wake'); // 'wake' = хочу прокинутись, 'bed' = хочу лягти
  const [wakeTime, setWakeTime] = useState(makeTime(7, 0));
  const [bedTime, setBedTime] = useState(new Date());
  const [picking, setPicking] = useState(false);
  const [results, setResults] = useState(null);

  const isWake = mode === 'wake';
  const time = isWake ? wakeTime : bedTime;

  const changeMode = (next) => {
    setMode(next);
    setPicking(false);
    setResults(null);
  };

  const onPickerChange = (event, selected) => {
    if (Platform.OS === 'android') setPicking(false);
    if (event.type === 'dismissed' || !selected) return;
    if (isWake) setWakeTime(selected);
    else setBedTime(selected);
    setResults(null);
  };

  const calculate = () => {
    setPicking(false);
    setResults(isWake ? bedtimesForWake(wakeTime) : wakeTimesForBed(bedTime));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.title}>Калькулятор сну</Text>
        <Text style={styles.subtitle}>Розрахунок {CYCLE_MIN}-хвилинних циклів</Text>

        <View style={styles.segment}>
          {[
            { key: 'wake', label: 'Хочу прокинутись' },
            { key: 'bed', label: 'Хочу лягти' },
          ].map((s) => {
            const active = mode === s.key;
            return (
              <Pressable
                key={s.key}
                style={[styles.segmentItem, active && styles.segmentActive]}
                onPress={() => changeMode(s.key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.timeWrap} onPress={() => setPicking(true)}>
          <Text style={styles.bigTime}>{formatTime(time)}</Text>
          <View style={styles.hintRow}>
            <Ionicons name={isWake ? 'alarm' : 'bed'} size={14} color={colors.accent} />
            <Text style={styles.hint}>
              {isWake ? 'Встановлено час підйому' : 'Встановлено час відбою'}
            </Text>
          </View>
          <Text style={styles.tapHint}>Торкніться часу, щоб змінити</Text>
        </Pressable>

        {picking && (
          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              themeVariant="dark"
              textColor={colors.text}
              onChange={onPickerChange}
            />
            {Platform.OS === 'ios' && (
              <Pressable style={styles.doneBtn} onPress={() => setPicking(false)}>
                <Text style={styles.doneText}>Готово</Text>
              </Pressable>
            )}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.calcBtn, pressed && { opacity: 0.85 }]}
          onPress={calculate}
        >
          <Text style={styles.calcText}>Розрахувати</Text>
        </Pressable>

        {results && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.resultsTitle}>
              {isWake ? 'РЕКОМЕНДОВАНО ЛЯГТИ:' : 'РЕКОМЕНДОВАНО ПРОКИНУТИСЬ:'}
            </Text>

            {results.map((r) => {
              const optimal = r.cycles === OPTIMAL_CYCLES;
              return (
                <View key={r.cycles} style={[styles.resultCard, optimal && styles.resultOptimal]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTime}>{formatTime(r.time)}</Text>
                    <Text style={styles.resultMeta}>
                      {r.cycles} {cyclesWord(r.cycles)} ({formatDuration(r.sleepMin)} сну)
                    </Text>
                  </View>
                  <View style={[styles.badge, optimal && styles.badgeOptimal]}>
                    <Text style={[styles.badgeText, optimal && styles.badgeTextOptimal]}>
                      {BADGES[r.cycles]}
                    </Text>
                  </View>
                </View>
              );
            })}

            <Text style={styles.note}>
              Враховано {FALL_ASLEEP_MIN} хв на засинання. Прокидатися наприкінці циклу легше, ніж
              посеред нього.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginTop: 20,
  },
  segmentItem: { flex: 1, paddingVertical: 11, borderRadius: radius.sm, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.input },
  segmentText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  segmentTextActive: { color: colors.text, fontWeight: '800' },
  timeWrap: { alignItems: 'center', marginTop: 28 },
  bigTime: { color: colors.text, fontSize: 76, fontWeight: '800', letterSpacing: 1 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  hint: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  tapHint: { color: colors.muted, fontSize: 11, marginTop: 6 },
  pickerWrap: {
    backgroundColor: colors.input,
    borderRadius: radius.md,
    marginTop: 14,
    paddingBottom: 8,
  },
  doneBtn: { alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 20 },
  doneText: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  calcBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  calcText: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
  resultsTitle: { color: colors.muted, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  resultOptimal: { borderColor: colors.accent },
  resultTime: { color: colors.text, fontSize: 24, fontWeight: '800' },
  resultMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  badge: {
    backgroundColor: colors.input,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeOptimal: { backgroundColor: 'rgba(251,191,36,0.18)' },
  badgeText: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  badgeTextOptimal: { color: colors.accent },
  note: { color: colors.muted, fontSize: 12, lineHeight: 17, marginTop: 6 },
});
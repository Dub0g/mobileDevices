import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';

import { colors, radius } from '../theme';
import { QUALITIES } from '../constants';
import { syncEntry, clearError } from '../store/sleepSlice';
import { calcDurationMinutes, formatDuration, formatTime, todayKey } from '../utils/time';

const makeTime = (h, m) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

function TimeBox({ label, value, onPress }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.timeBox} onPress={onPress}>
        <Text style={styles.timeText}>{formatTime(value)}</Text>
      </Pressable>
    </View>
  );
}

export default function AddEntryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { saving, error } = useSelector((s) => s.sleep);

  const [bedtime, setBedtime] = useState(makeTime(23, 30));
  const [wake, setWake] = useState(makeTime(7, 15));
  const [picking, setPicking] = useState(null); // 'bed' | 'wake' | null
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');

  const durationMin = calcDurationMinutes(bedtime, wake);

  const close = () => {
    dispatch(clearError());
    navigation.goBack();
  };

  const onPickerChange = (event, selected) => {
    if (Platform.OS === 'android') setPicking(null);
    if (event.type === 'dismissed' || !selected) return;
    if (picking === 'bed') setBedtime(selected);
    if (picking === 'wake') setWake(selected);
  };

  const onSave = async () => {
    const entry = {
      date: todayKey(),
      bedtime: formatTime(bedtime),
      wake: formatTime(wake),
      durationMin,
      quality,
      notes: notes.trim(),
    };
    await dispatch(syncEntry(entry));
    close();
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Додати запис 🌙</Text>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <TimeBox label="Ліг спати" value={bedtime} onPress={() => setPicking('bed')} />
              <View style={{ width: 14 }} />
              <TimeBox label="Прокинувся" value={wake} onPress={() => setPicking('wake')} />
            </View>

            {picking && (
              <View style={styles.pickerWrap}>
                <DateTimePicker
                  value={picking === 'bed' ? bedtime : wake}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  themeVariant="dark"
                  textColor={colors.text}
                  onChange={onPickerChange}
                />
                {Platform.OS === 'ios' && (
                  <Pressable style={styles.doneBtn} onPress={() => setPicking(null)}>
                    <Text style={styles.doneText}>Готово</Text>
                  </Pressable>
                )}
              </View>
            )}

            <Text style={styles.duration}>Тривалість: {formatDuration(durationMin)}</Text>

            <Text style={styles.label}>Якість сну</Text>
            <View style={styles.qualityRow}>
              {QUALITIES.map((q, i) => {
                const active = i === quality;
                return (
                  <Pressable
                    key={q.label}
                    onPress={() => setQuality(i)}
                    style={[styles.qualityItem, active && styles.qualityActive]}
                    accessibilityLabel={q.label}
                  >
                    <Text style={{ fontSize: active ? 28 : 22, opacity: active ? 1 : 0.55 }}>
                      {q.emoji}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.qualityLabel}>{QUALITIES[quality].label}</Text>

            <Text style={[styles.label, { marginTop: 14 }]}>Нотатки (необов’язково)</Text>
            <TextInput
              style={styles.notes}
              value={notes}
              onChangeText={setNotes}
              placeholder="Швидко заснув, але прокидався вночі..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={200}
            />

            {!!error && (
              <Text style={styles.error}>
                Не вдалося синхронізувати ({error}). Запис збережено локально.
              </Text>
            )}

            <Pressable
              style={({ pressed }) => [styles.saveBtn, (pressed || saving) && { opacity: 0.8 }]}
              onPress={onSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={colors.accentText} />
              ) : (
                <Text style={styles.saveText}>Зберегти</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(5,8,18,0.7)' },
  sheet: {
    backgroundColor: colors.sheet,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },
  row: { flexDirection: 'row' },
  label: { color: colors.muted, fontSize: 12, marginBottom: 6 },
  timeBox: {
    backgroundColor: colors.input,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: 14,
  },
  timeText: { color: colors.text, fontSize: 22, fontWeight: '700' },
  pickerWrap: {
    backgroundColor: colors.input,
    borderRadius: radius.md,
    marginTop: 10,
    paddingBottom: 8,
  },
  doneBtn: { alignSelf: 'center', paddingVertical: 6, paddingHorizontal: 20 },
  doneText: { color: colors.accent, fontWeight: '700', fontSize: 15 },
  duration: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.input,
    borderRadius: radius.lg,
    padding: 6,
  },
  qualityItem: {
    width: 52,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityActive: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.accent },
  qualityLabel: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 8 },
  notes: {
    backgroundColor: colors.input,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 10 },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  saveText: { color: colors.accentText, fontSize: 16, fontWeight: '700' },
});

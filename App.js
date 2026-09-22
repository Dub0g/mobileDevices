import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { vibrate } from './utils';
import CountdownDisplay from './components/CountdownDisplay';
import DurationInput from './components/DurationInput';

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

const WORK_COLOR = '#e0524a';
const BREAK_COLOR = '#3f9c6b';

export default function App() {
  // Введені користувачем тривалості (у хвилинах, зберігаються як текст,
  // щоб TextInput міг містити порожній рядок під час редагування).
  const [workMinutesText, setWorkMinutesText] = useState(String(DEFAULT_WORK_MINUTES));
  const [breakMinutesText, setBreakMinutesText] = useState(String(DEFAULT_BREAK_MINUTES));

  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  const minutesForMode = useCallback(
    (m) => {
      const text = m === 'work' ? workMinutesText : breakMinutesText;
      const parsed = parseInt(text, 10);
      return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    },
    [workMinutesText, breakMinutesText]
  );

  // Інтервал зворотного відліку
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Обробка досягнення 00:00 — вібрація та перемикання режиму
  useEffect(() => {
    if (secondsLeft <= 0 && isRunning) {
      vibrate();
      clearInterval(intervalRef.current);
      setIsRunning(false);

      const nextMode = mode === 'work' ? 'break' : 'work';
      setMode(nextMode);
      setSecondsLeft(minutesForMode(nextMode) * 60);
    }
  }, [secondsLeft, isRunning, mode, minutesForMode]);

  const handleStartPause = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(minutesForMode(mode) * 60);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(minutesForMode(mode) * 60);
  };

  const handleSwitchMode = () => {
    if (isRunning) return;
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setSecondsLeft(minutesForMode(nextMode) * 60);
  };

  const handleWorkChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setWorkMinutesText(cleaned);
    if (mode === 'work' && !isRunning) {
      const parsed = parseInt(cleaned, 10);
      setSecondsLeft((Number.isNaN(parsed) ? 0 : parsed) * 60);
    }
  };

  const handleBreakChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setBreakMinutesText(cleaned);
    if (mode === 'break' && !isRunning) {
      const parsed = parseInt(cleaned, 10);
      setSecondsLeft((Number.isNaN(parsed) ? 0 : parsed) * 60);
    }
  };

  const displayMinutes = Math.max(0, Math.floor(secondsLeft / 60));
  const displaySeconds = Math.max(0, secondsLeft % 60);
  const backgroundColor = mode === 'work' ? WORK_COLOR : BREAK_COLOR;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.flex, { backgroundColor }]}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Pomodoro</Text>
          </View>

          <CountdownDisplay
            minutes={displayMinutes}
            seconds={displaySeconds}
            mode={mode}
          />

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.mainButton, styles.startButton]}
              onPress={handleStartPause}
            >
              <Text style={styles.mainButtonText}>
                {isRunning ? 'Пауза' : 'Старт'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mainButton, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={[styles.mainButtonText, styles.resetButtonText]}>
                Скинути
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={handleSwitchMode}
            disabled={isRunning}
          >
            <Text style={styles.switchButtonText}>
              {isRunning
                ? ''
                : mode === 'work'
                ? 'Перейти до перерви ⇢'
                : '⇠ Перейти до роботи'}
            </Text>
          </TouchableOpacity>

          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Тривалість таймерів</Text>
            <View style={styles.inputsRow}>
              <DurationInput
                label="Робота"
                value={workMinutesText}
                onChange={handleWorkChange}
                editable={!isRunning}
                accentColor={WORK_COLOR}
              />
              <DurationInput
                label="Перерва"
                value={breakMinutesText}
                onChange={handleBreakChange}
                editable={!isRunning}
                accentColor={BREAK_COLOR}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffffe0',
    letterSpacing: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mainButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginHorizontal: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#ffffff',
  },
  resetButton: {
    backgroundColor: '#00000030',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  resetButtonText: {
    color: '#ffffff',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 8,
  },
  switchButtonText: {
    color: '#ffffffcc',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    marginTop: 'auto',
  },
  settingsTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 16,
    letterSpacing: 1,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
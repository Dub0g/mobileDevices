import { Vibration } from 'react-native';

// Патерн вібрації: коротка-пауза-коротка-пауза-довга,
// щоб користувач точно відчув сигнал, навіть якщо телефон у кишені.
const VIBRATION_PATTERN = [0, 300, 200, 300, 200, 500];

/**
 * Змушує телефон вібрувати, повідомляючи про завершення таймера.
 */
export function vibrate() {
  Vibration.vibrate(VIBRATION_PATTERN);
}
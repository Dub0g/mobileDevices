// Один цикл сну ≈ 90 хвилин, на засинання в середньому йде ≈ 15 хвилин.
export const CYCLE_MIN = 90;
export const FALL_ASLEEP_MIN = 15;
export const OPTIMAL_CYCLES = 5;

const shift = (date, minutes) => new Date(date.getTime() + minutes * 60000);

// Коли лягти, щоб прокинутись у час `wake` (наприкінці циклу).
export function bedtimesForWake(wake, cycles = [6, 5, 4]) {
  return cycles.map((n) => ({
    cycles: n,
    sleepMin: n * CYCLE_MIN,
    time: shift(wake, -(n * CYCLE_MIN + FALL_ASLEEP_MIN)),
  }));
}

// Коли прокинутись, якщо лягти у час `bed`.
export function wakeTimesForBed(bed, cycles = [4, 5, 6]) {
  return cycles.map((n) => ({
    cycles: n,
    sleepMin: n * CYCLE_MIN,
    time: shift(bed, FALL_ASLEEP_MIN + n * CYCLE_MIN),
  }));
}

// Правильна форма слова: 1 цикл, 2–4 цикли, 5+ циклів.
export function cyclesWord(n) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return 'циклів';
  if (last === 1) return 'цикл';
  if (last >= 2 && last <= 4) return 'цикли';
  return 'циклів';
}
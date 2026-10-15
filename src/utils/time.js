const pad = (n) => String(n).padStart(2, '0');

export const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

// Тривалість у хвилинах; якщо підйом "раніше" за відбій — вважаємо, що це наступна доба.
export const calcDurationMinutes = (bed, wake) => {
  const bedMin = bed.getHours() * 60 + bed.getMinutes();
  const wakeMin = wake.getHours() * 60 + wake.getMinutes();
  let diff = wakeMin - bedMin;
  if (diff <= 0) diff += 24 * 60;
  return diff;
};

export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} хв`;
  if (m === 0) return `${h} год`;
  return `${h} год ${m} хв`;
};

export const todayKey = () => new Date().toISOString().slice(0, 10);

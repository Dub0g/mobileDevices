import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Мережевий виклик: після збереження надсилаємо запис на тестовий REST-сервер.
// Якщо мережі немає — запис усе одно зберігається локально (synced: false).
export const syncEntry = createAsyncThunk(
  'sleep/syncEntry',
  async (entry, { rejectWithValue }) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          title: `sleep-entry-${entry.date}`,
          body: JSON.stringify(entry),
          userId: 1,
        }),
      });
      if (!res.ok) throw new Error(`Помилка сервера: ${res.status}`);
      const data = await res.json();
      return { remoteId: data.id };
    } catch (e) {
      return rejectWithValue(e.message || 'Немає з’єднання');
    }
  }
);

const sleepSlice = createSlice({
  name: 'sleep',
  initialState: {
    entries: [],
    saving: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncEntry.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(syncEntry.fulfilled, (state, action) => {
        state.saving = false;
        state.entries.unshift({
          ...action.meta.arg,
          id: Date.now().toString(),
          remoteId: action.payload.remoteId,
          synced: true,
        });
      })
      .addCase(syncEntry.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || action.error.message;
        state.entries.unshift({
          ...action.meta.arg,
          id: Date.now().toString(),
          synced: false,
        });
      });
  },
});

export const { clearError } = sleepSlice.actions;
export default sleepSlice.reducer;

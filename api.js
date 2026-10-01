// Отримайте безкоштовний ключ на http://www.omdbapi.com/apikey.aspx
export const API_KEY = '2befd807';
const BASE_URL = 'https://www.omdbapi.com/';

// Один запит повертає максимум 10 фільмів, тому підтримуємо сторінки (page).
export async function searchMovies(query, page = 1) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') return { movies: [], total: 0 };
    throw new Error(data.Error || 'Не вдалося виконати пошук');
  }
  return { movies: data.Search, total: parseInt(data.totalResults, 10) };
}

export async function getMovie(imdbID) {
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Не вдалося завантажити фільм');
  }
  return data;
}
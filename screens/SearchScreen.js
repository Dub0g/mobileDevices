import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies } from '../api';
import { colors } from '../theme';

const hasPoster = (m) => m.Poster && m.Poster !== 'N/A';

// OMDb інколи повторює фільми між сторінками — прибираємо дублікати
const dedupe = (list) => {
  const seen = new Set();
  return list.filter((m) => !seen.has(m.imdbID) && seen.add(m.imdbID));
};

function MovieRow({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {hasPoster(movie) ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noPoster]}>
          <Ionicons name="film-outline" size={28} color={colors.muted} />
        </View>
      )}
      <View style={styles.rowText}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </TouchableOpacity>
  );
}

MovieRow.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string,
    Poster: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const searchId = useRef(0); // захист від "застарілих" відповідей

  // Новий пошук із затримкою 400 мс після останнього символу
  useEffect(() => {
    const q = query.trim();
    const id = ++searchId.current;
    setError(null);
    setLoadingMore(false);

    if (q.length < 2) {
      setMovies([]);
      setTotal(0);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies(q, 1);
        if (id !== searchId.current) return;
        setMovies(dedupe(res.movies));
        setTotal(res.total);
        setPage(1);
      } catch (e) {
        if (id !== searchId.current) return;
        setMovies([]);
        setError(e.message);
      } finally {
        if (id === searchId.current) setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Підвантаження наступної сторінки під час прокрутки
  const loadMore = async () => {
    if (loading || loadingMore || movies.length === 0 || movies.length >= total) return;
    const id = searchId.current;
    setLoadingMore(true);
    try {
      const res = await searchMovies(query.trim(), page + 1);
      if (id !== searchId.current) return;
      setMovies((prev) => dedupe([...prev, ...res.movies]));
      setPage((p) => p + 1);
    } catch (e) {
      // тихо ігноруємо: користувач може прокрутити ще раз
    } finally {
      if (id === searchId.current) setLoadingMore(false);
    }
  };

  const showEmpty = !loading && query.trim().length >= 2 && !error && movies.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput
          style={styles.input}
          placeholder="Назва фільму"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </TouchableOpacity>
        )}
      </View>

      {total > 0 && (
        <Text style={styles.count}>
          Знайдено: {total} · показано {movies.length}
        </Text>
      )}

      {loading && <ActivityIndicator style={styles.center} color={colors.accent} size="large" />}
      {error && <Text style={[styles.message, { color: colors.error }]}>{error}</Text>}
      {showEmpty && <Text style={styles.message}>Нічого не знайдено. Спробуйте іншу назву.</Text>}
      {!loading && !error && query.trim().length < 2 && movies.length === 0 && (
        <Text style={styles.message}>Введіть щонайменше 2 символи, щоб знайти фільм.</Text>
      )}

      <FlatList
        data={movies}
        keyExtractor={(m) => m.imdbID}
        renderItem={({ item }) => (
          <MovieRow
            movie={item}
            onPress={() =>
              navigation.navigate('MovieDetail', { imdbID: item.imdbID, title: item.Title })
            }
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={styles.footer} color={colors.accent} /> : null
        }
      />
    </View>
  );
}

SearchScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
  },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12, paddingHorizontal: 8 },
  count: { color: colors.muted, marginHorizontal: 16, marginBottom: 8 },
  center: { marginTop: 24 },
  message: { color: colors.muted, textAlign: 'center', marginTop: 32, marginHorizontal: 24 },
  footer: { marginVertical: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  poster: { width: 56, height: 84, borderRadius: 4, backgroundColor: colors.surface },
  noPoster: { alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, marginHorizontal: 14 },
  title: { color: colors.text, fontSize: 17, fontWeight: '600' },
  year: { color: colors.muted, marginTop: 4 },
});
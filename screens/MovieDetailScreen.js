import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { getMovie } from '../api';
import { colors } from '../theme';

const has = (v) => v && v !== 'N/A';

function Fact({ label, value }) {
  if (!has(value)) return null;
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

Fact.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.string };

export default function MovieDetailScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMovie(imdbID)
      .then((m) => !cancelled && setMovie(m))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.error }}>{error}</Text>
      </View>
    );
  }
  if (!movie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const meta = [movie.Year, movie.Rated, movie.Runtime].filter(has).join('  ·  ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {has(movie.Poster) ? (
        <Image source={{ uri: movie.Poster }} style={styles.poster} resizeMode="contain" />
      ) : (
        <View style={[styles.poster, styles.center]}>
          <Ionicons name="film-outline" size={64} color={colors.muted} />
        </View>
      )}

      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.meta}>{meta}</Text>

      {has(movie.imdbRating) && (
        <View style={styles.rating}>
          <Ionicons name="star" size={20} color={colors.accent} />
          <Text style={styles.ratingText}>{movie.imdbRating}</Text>
          <Text style={styles.ratingSub}> / 10 · IMDb</Text>
        </View>
      )}

      {has(movie.Plot) && <Text style={styles.plot}>{movie.Plot}</Text>}

      <Fact label="Жанр" value={movie.Genre} />
      <Fact label="Режисер" value={movie.Director} />
      <Fact label="Сценарій" value={movie.Writer} />
      <Fact label="У ролях" value={movie.Actors} />
      <Fact label="Країна" value={movie.Country} />
      <Fact label="Мова" value={movie.Language} />
      <Fact label="Нагороди" value={movie.Awards} />
    </ScrollView>
  );
}

MovieDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({ imdbID: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  poster: { width: '100%', height: 380, borderRadius: 8, marginBottom: 20 },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  meta: { color: colors.muted, marginTop: 6, fontSize: 15 },
  rating: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  ratingText: { color: colors.text, fontSize: 20, fontWeight: '700', marginLeft: 6 },
  ratingSub: { color: colors.muted, fontSize: 14 },
  plot: { color: colors.text, fontSize: 16, lineHeight: 24, marginVertical: 20 },
  fact: { marginBottom: 14 },
  factLabel: { color: colors.accent, fontWeight: '600', marginBottom: 2 },
  factValue: { color: colors.text, fontSize: 15, lineHeight: 21 },
});
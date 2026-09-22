import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

function formatNumber(value) {
  return value < 10 ? `0${value}` : `${value}`;
}

export default function CountdownDisplay({ minutes, seconds, mode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.modeLabel}>
        {mode === 'work' ? 'ЧАС ПРАЦЮВАТИ' : 'ЧАС ВІДПОЧИВАТИ'}
      </Text>
      <Text style={styles.clock}>
        {formatNumber(minutes)}:{formatNumber(seconds)}
      </Text>
    </View>
  );
}

CountdownDisplay.propTypes = {
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(['work', 'break']).isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  modeLabel: {
    fontSize: 16,
    letterSpacing: 3,
    color: '#ffffffcc',
    marginBottom: 12,
    fontWeight: '600',
  },
  clock: {
    fontSize: 88,
    fontWeight: '200',
    color: '#ffffff',
    fontVariant: ['tabular-nums'],
  },
});
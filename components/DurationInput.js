import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function DurationInput({ label, value, onChange, editable, accentColor }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: accentColor, color: editable ? '#222' : '#999' },
        ]}
        keyboardType="number-pad"
        maxLength={3}
        editable={editable}
        value={value}
        onChangeText={onChange}
      />
      <Text style={styles.suffix}>хв</Text>
    </View>
  );
}

DurationInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  accentColor: PropTypes.string,
};

DurationInput.defaultProps = {
  editable: true,
  accentColor: '#555',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    width: 64,
    height: 48,
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
  },
  suffix: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
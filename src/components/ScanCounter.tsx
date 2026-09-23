import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ScanCounterProps {
  count: number;
  onScan: () => void;
  onReset: () => void;
}

export const ScanCounter: React.FC<ScanCounterProps> = ({ count, onScan, onReset }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="qrcode-scan" size={20} color="#00758F" />
        <Text style={styles.label}>GATE SCANS TODAY</Text>
      </View>
      <Text style={styles.count}>{count}</Text>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.scanButton]} onPress={onScan}>
          <MaterialCommunityIcons name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Simulate Scan</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.resetButton]} onPress={onReset}>
          <MaterialCommunityIcons name="refresh" size={16} color="#475569" />
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  count: {
    fontSize: 40,
    fontWeight: '800',
    color: '#00758F',
    marginVertical: 6,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  scanButton: {
    backgroundColor: '#00758F',
    borderColor: '#00758F',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  resetButton: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  resetButtonText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '800',
  },
});
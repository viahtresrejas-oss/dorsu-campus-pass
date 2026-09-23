import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBadgeProps } from '../types/student';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => {
  return (
    <View style={[styles.badge, isActive ? styles.activeBg : styles.inactiveBg]}>
      <View style={[styles.dot, isActive ? styles.activeDot : styles.inactiveDot]} />
      <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>
        {isActive ? 'ACTIVE STUDENT • PERMITTED' : 'SUSPENDED • GATE DENIED'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  activeBg: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
  },
  inactiveBg: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#16A34A',
  },
  inactiveDot: {
    backgroundColor: '#DC2626',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeText: {
    color: '#166534',
  },
  inactiveText: {
    color: '#991B1B',
  },
});
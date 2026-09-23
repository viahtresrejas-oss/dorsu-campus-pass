import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StudentProfile, EditableStudentProfile } from '../types/student';
import { StatusBadge } from './StatusBadge';

interface StudentCardProps {
  student: StudentProfile;
  isActive: boolean;
  onEditProfile?: () => void;
  onEditImage?: () => void;
  isEditable?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  isActive, 
  onEditProfile, 
  onEditImage, 
  isEditable = false 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: student.avatarUrl }} style={styles.avatar} />
          {isEditable && (
            <TouchableOpacity style={styles.cameraBadge} onPress={onEditImage}>
              <MaterialCommunityIcons name="camera-outline" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{student.name}</Text>
            {isEditable && (
              <TouchableOpacity onPress={onEditProfile} style={styles.editButton}>
                <MaterialCommunityIcons name="pencil-outline" size={16} color="#00758F" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.idNumber}>{student.idNumber}</Text>
          <Text style={styles.program}>{student.program}</Text>
          <Text style={styles.yearLevel}>{student.yearLevel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <StatusBadge isActive={isActive} />
      <Text style={styles.campus}>Campus: {student.campus}</Text>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#00758F',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    backgroundColor: '#00758F',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  editButton: {
    padding: 4,
  },
  idNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00758F',
    marginTop: 2,
  },
  program: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  yearLevel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  campus: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
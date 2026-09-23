import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StudentProfile } from './src/types/student';
import { StudentCard } from './src/components/StudentCard';
import { ScanCounter } from './src/components/ScanCounter';

const sampleStudent: StudentProfile = {
  name: 'Juan Carlos Dela Cruz',
  idNumber: '2024-008492-MT',
  program: 'BS in Information Technology',
  yearLevel: '3rd Year • Section IT 3F',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  campus: 'DOrSU Main Campus (Mati)',
};

const peerStudent: StudentProfile = {
  name: 'Maria Clara Santos',
  idNumber: '2024-009112-MT',
  program: 'BS in Information Systems',
  yearLevel: '2nd Year • Section IS 2A',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b293330?w=150',
  campus: 'DOrSU Main Campus (Mati)',
};

const STORAGE_KEY = 'dorsu-campus-pass:profile-data:v1';

export default function App() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [gateScans, setGateScans] = useState<number>(3);
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(sampleStudent);
  const [peerProfile, setPeerProfile] = useState<StudentProfile>(peerStudent);
  const [activeIsSelf, setActiveIsSelf] = useState<boolean>(true);
  const [editTarget, setEditTarget] = useState<'self' | 'peer'>('self');
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [editedIdNumber, setEditedIdNumber] = useState<string>(sampleStudent.idNumber);
  const [isProfileEditing, setIsProfileEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(sampleStudent.name);
  const [editedProgram, setEditedProgram] = useState<string>(sampleStudent.program);
  const [editedYearLevel, setEditedYearLevel] = useState<string>(sampleStudent.yearLevel);
  const [isPeerVisible, setIsPeerVisible] = useState<boolean>(true);

  // Load permanently saved profile data from device storage on first launch.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.activeProfile) setActiveProfile(data.activeProfile);
          if (data.peerProfile) setPeerProfile(data.peerProfile);
          if (typeof data.activeIsSelf === 'boolean') setActiveIsSelf(data.activeIsSelf);
          if (typeof data.isActive === 'boolean') setIsActive(data.isActive);
          if (typeof data.gateScans === 'number') setGateScans(data.gateScans);
          if (typeof data.isPeerVisible === 'boolean') setIsPeerVisible(data.isPeerVisible);
          else if (typeof data.showPeer === 'boolean') setIsPeerVisible(data.showPeer);
        }
      } catch (e) {
        // Storage unavailable — fall back to default demo data.
      }
      setHydrated(true);
    })();
  }, []);

  // Save profile data permanently whenever it changes (after initial load).
  useEffect(() => {
    if (!hydrated) return;
    const payload = JSON.stringify({ activeProfile, peerProfile, activeIsSelf, isActive, gateScans, isPeerVisible });
    AsyncStorage.setItem(STORAGE_KEY, payload).catch(() => {});
  }, [hydrated, activeProfile, peerProfile, activeIsSelf, isActive, gateScans, isPeerVisible]);

  const handleScan = () => { setGateScans((prev) => prev + 1); };
  const handleReset = () => { setGateScans(0); };
  const toggleStatus = () => { setIsActive((prev) => !prev); };

  const toggleProfile = () => {
    const nextActive = peerProfile;
    const nextPeer = activeProfile;
    setActiveProfile(nextActive);
    setPeerProfile(nextPeer);
    setActiveIsSelf((v) => !v);
    setEditedName(nextActive.name);
    setEditedIdNumber(nextActive.idNumber);
    setEditedProgram(nextActive.program);
    setEditedYearLevel(nextActive.yearLevel);
    setIsProfileEditing(false);
    setEditTarget('self');
  };

  const loadEditFields = (target: 'self' | 'peer') => {
    const p = target === 'self' ? activeProfile : peerProfile;
    setEditTarget(target);
    setEditedName(p.name);
    setEditedIdNumber(p.idNumber);
    setEditedProgram(p.program);
    setEditedYearLevel(p.yearLevel);
  };

  const handleEditProfile = (target: 'self' | 'peer' = 'self') => {
    loadEditFields(target);
    setIsProfileEditing(true);
  };
  const handleSaveProfile = () => {
    const base = editTarget === 'self' ? activeProfile : peerProfile;
    const updated: StudentProfile = {
      ...base,
      name: editedName.trim() || base.name,
      idNumber: editedIdNumber.trim() || base.idNumber,
      program: editedProgram.trim() || base.program,
      yearLevel: editedYearLevel.trim() || base.yearLevel,
    };
    if (editTarget === 'self') setActiveProfile(updated);
    else setPeerProfile(updated);
    Alert.alert('Saved', 'Profile information has been saved permanently on this device.');
    setIsProfileEditing(false);
  };
  const handleCancelEdit = () => {
    loadEditFields(editTarget);


    setIsProfileEditing(false);
  };

  const applyNewImage = (target: 'self' | 'peer', uri: string) => {
    if (target === 'self') setActiveProfile((prev) => ({ ...prev, avatarUrl: uri }));
    else setPeerProfile((prev) => ({ ...prev, avatarUrl: uri }));
    Alert.alert('Photo Updated', 'Your new profile photo has been saved permanently on this device.');
  };

  const takePhoto = async (target: 'self' | 'peer') => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow camera access to take a profile photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled && result.assets.length > 0) applyNewImage(target, result.assets[0].uri);
  };


  const pickFromLibrary = async (target: 'self' | 'peer' = 'self') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to photos to update your profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5,
    });
    if (!result.canceled && result.assets.length > 0) {
      applyNewImage(target, result.assets[0].uri);



    }
  };

  const handleEditImage = (target: 'self' | 'peer' = 'self') => {
    Alert.alert('Change Profile Image', 'Choose a new profile photo', [
      { text: 'Take Photo', onPress: () => takePhoto(target) },
      { text: 'Choose from Library', onPress: () => pickFromLibrary(target) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };


  const togglePeerVisibility = () => { setIsPeerVisible((prev) => !prev); };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DAVAO ORIENTAL STATE UNIVERSITY</Text>
            <Text style={styles.headerSub}>Digital Campus Pass System</Text>
            <View style={styles.tagBadge}>
              <MaterialCommunityIcons name="school" size={12} color="#E0F2FE" />
              <Text style={styles.tagText}>EXPO SDK 57 • REACT NATIVE • TYPESCRIPT</Text>
            </View>
          </View>

          <StudentCard student={activeProfile} isActive={isActive} onEditProfile={() => handleEditProfile('self')}
            onEditImage={() => handleEditImage('self')} isEditable={!isProfileEditing} />

          {isProfileEditing && (
            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>
                Edit {editTarget === 'peer' ? 'Peer' : 'My'} Profile Information
              </Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput style={styles.textInput} value={editedName} onChangeText={setEditedName} placeholder="Enter full name" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>ID Number</Text>
                <TextInput style={styles.textInput} value={editedIdNumber} onChangeText={setEditedIdNumber}
                  placeholder="e.g. 2024-008492-MT" autoCapitalize="characters" />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Program</Text>
                <TextInput style={styles.textInput} value={editedProgram} onChangeText={setEditedProgram} placeholder="Enter program" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Year Level</Text>
                <TextInput style={styles.textInput} value={editedYearLevel} onChangeText={setEditedYearLevel} placeholder="Enter year level" />
              </View>
              <Pressable style={styles.photoBtn} onPress={() => handleEditImage(editTarget)}>
                <MaterialCommunityIcons name="camera-outline" size={16} color="#00758F" />
                <Text style={styles.photoBtnText}>Change Profile Image</Text>
              </Pressable>

              <View style={styles.editButtonsRow}>
                <Pressable style={[styles.editBtn, styles.cancelBtn]} onPress={handleCancelEdit}>
                  <MaterialCommunityIcons name="close" size={16} color="#475569" />
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={[styles.editBtn, styles.saveBtn]} onPress={handleSaveProfile}>
                  <MaterialCommunityIcons name="content-save" size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Save</Text>
                </Pressable>
              </View>
            </View>
          )}

          <ScanCounter count={gateScans} onScan={handleScan} onReset={handleReset} />

          <View style={styles.peerToggleCard}>
            <View style={styles.peerToggleHeader}>
              <View style={styles.peerToggleLabelContainer}>
                <MaterialCommunityIcons name="account-group-outline" size={18} color="#00758F" />
                <Text style={styles.peerToggleLabel}>Show Peer Demo Profile</Text>
              </View>
              <Pressable style={styles.peerToggleSwitch} onPress={togglePeerVisibility}>
                <View style={[styles.toggleTrack, isPeerVisible ? styles.toggleTrackActive : styles.toggleTrackInactive]}>
                  <MaterialCommunityIcons name={isPeerVisible ? "eye-outline" : "eye-off-outline"} size={16} color={isPeerVisible ? "#166534" : "#991B1B"} />
                  <Text style={[styles.toggleText, isPeerVisible ? styles.toggleTextActive : styles.toggleTextInactive]}>
                    {isPeerVisible ? 'Visible' : 'Hidden'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {isPeerVisible && activeIsSelf && (
            <StudentCard student={peerProfile} isActive={isActive} isEditable={!isProfileEditing}
              onEditProfile={() => handleEditProfile('peer')}
              onEditImage={() => handleEditImage('peer')} />
          )}

          <View style={styles.adminBox}>
            <Text style={styles.adminTitle}>Administrative Controls</Text>
            <Pressable style={[styles.toggleBtn, isActive ? styles.btnDanger : styles.btnSuccess]} onPress={toggleStatus}>
              <MaterialCommunityIcons name={isActive ? "account-off-outline" : "account-check-outline"} size={16} color={isActive ? "#991B1B" : "#166534"} style={{ marginRight: 6 }} />
              <Text style={styles.toggleBtnText}>
                {isActive ? 'Simulate Account Suspension' : 'Reactivate Student Access'}
              </Text>
            </Pressable>
            <Pressable style={styles.switchProfileBtn} onPress={toggleProfile}>
              <MaterialCommunityIcons name="account-switch-outline" size={16} color="#00758F" style={{ marginRight: 6 }} />
              <Text style={styles.switchProfileText}>Switch Active Profile (Peer Demo)</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 20 },
  header: {
    backgroundColor: '#00758F', borderRadius: 16, padding: 16,
    alignItems: 'center', marginBottom: 16, borderBottomWidth: 4,
    borderBottomColor: '#F29111',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  headerSub: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginVertical: 4 },
  tagBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 6, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  tagText: { color: '#E0F2FE', fontSize: 9, fontWeight: '700' },
  editSection: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  editSectionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginBottom: 4, letterSpacing: 0.5 },
  textInput: {
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 14,
    color: '#0F172A', backgroundColor: '#F8FAFC',
  },
  editButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#00758F',
    backgroundColor: '#F0F9FA', marginTop: 4, marginBottom: 4,
  },
  photoBtnText: { color: '#00758F', fontSize: 12, fontWeight: '700' },
  editBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  cancelBtn: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' },
  saveBtn: { backgroundColor: '#00758F', borderWidth: 1, borderColor: '#00758F' },
  cancelBtnText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  saveBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  peerToggleCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  peerToggleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  peerToggleLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  peerToggleLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  peerToggleSwitch: { padding: 4 },
  toggleTrack: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  toggleTrackActive: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1 },
  toggleTrackInactive: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 },
  toggleText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  toggleTextActive: { color: '#166534' },
  toggleTextInactive: { color: '#991B1B' },
  adminBox: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  adminTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  toggleBtn: {
    paddingVertical: 10, borderRadius: 8, alignItems: 'center',
    marginBottom: 8, flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  btnDanger: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 },
  btnSuccess: { backgroundColor: '#DCFCE7', borderColor: '#86EFAC', borderWidth: 1 },
  toggleBtnText: { fontSize: 12, fontWeight: '800', color: '#0F172A' },
  switchProfileBtn: {
    backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 8,
    alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  switchProfileText: { fontSize: 12, fontWeight: '700', color: '#00758F' },
});


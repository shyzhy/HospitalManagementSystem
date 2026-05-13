import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateConsultation } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ConsultationDetailScreen({ route, navigation }: any) {
  const { consultation } = route.params;
  const [role, setRole] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState(consultation.diagnosis || '');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [consultationDate, setConsultationDate] = useState(new Date(consultation.consultation_date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('role').then(setRole);
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateConsultation(consultation.id, {
        ...consultation,
        diagnosis: diagnosis.trim(),
        consultation_date: consultationDate.toISOString().split('T')[0]
      });
      Alert.alert("Success", "Consultation record updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update record.");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setConsultationDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinical Encounter</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.topCard}>
        <View style={styles.encounterBadge}>
          <Text style={styles.badgeText}>ENCOUNTER #{consultation.id.toString().padStart(4, '0')}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.dateContainer, isEditing && styles.dateContainerEditing]}
          onPress={() => isEditing && setShowDatePicker(true)}
          disabled={!isEditing}
        >
          <MaterialCommunityIcons name="calendar-edit" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.dateText}>{consultationDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={consultationDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient / Doctor Info */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>PATIENT</Text>
              <Text style={styles.infoValue}>{consultation.patient_name || 'N/A'}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>PHYSICIAN</Text>
              <Text style={styles.infoValue}>{consultation.doctor_name || 'Dr. Assigned'}</Text>
            </View>
          </View>
        </View>

        {/* Symptoms Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#f59e0b" />
          <Text style={styles.sectionTitle}>Presenting Symptoms</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.symptomsText}>{consultation.symptoms || 'No symptoms recorded for this visit.'}</Text>
        </View>

        {/* Diagnosis Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="stethoscope" size={18} color="#556ee6" />
          <Text style={styles.sectionTitle}>Clinical Diagnosis</Text>
        </View>
        
        <View style={[styles.card, isEditing && role !== 'patient' && styles.editingCard]}>
          {isEditing && role !== 'patient' ? (
            <TextInput
              style={styles.diagnosisInput}
              value={diagnosis}
              onChangeText={setDiagnosis}
              placeholder="Enter diagnosis..."
              multiline
              autoFocus
            />
          ) : (
            <Text style={[styles.diagnosisText, !diagnosis && styles.placeholderText]}>
              {diagnosis || 'No diagnosis recorded yet.'}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.footer}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.btn, styles.cancelBtn]} 
                onPress={() => {
                  setIsEditing(false);
                  setDiagnosis(consultation.diagnosis || '');
                  setConsultationDate(new Date(consultation.consultation_date));
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.btn, styles.saveBtn]} 
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.btn, styles.editBtn]} 
              onPress={() => setIsEditing(true)}
            >
              <MaterialCommunityIcons name={role === 'patient' ? "calendar-edit" : "pencil"} size={18} color="#fff" />
              <Text style={styles.editBtnText}>{role === 'patient' ? "Reschedule Visit" : "Edit Record"}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#556ee6',
  },
  backBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  topCard: {
    backgroundColor: '#556ee6',
    padding: 24,
    paddingTop: 0,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#556ee6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  encounterBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateContainerEditing: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  editingCard: {
    borderColor: '#556ee6',
    borderWidth: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'black',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1.5,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  symptomsText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  diagnosisText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 24,
  },
  placeholderText: {
    color: '#94a3b8',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  diagnosisInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  editBtn: {
    backgroundColor: '#1e293b',
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#34c38f',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

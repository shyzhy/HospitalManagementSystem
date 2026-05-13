import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createConsultation, getDoctors } from '../services/api';
import * as SecureStore from 'expo-secure-store';

export default function ScheduleConsultationScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [symptoms, setSymptoms] = useState('');
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSchedule = async () => {
    if (!selectedDoctor || !symptoms.trim()) {
      Alert.alert("Required", "Please select a doctor and describe your symptoms.");
      return;
    }

    setLoading(true);
    try {
      const patientId = await SecureStore.getItemAsync('patientId');
      
      await createConsultation({
        patient: patientId ? parseInt(patientId) : 1, // Fallback
        doctor: selectedDoctor.id,
        consultation_date: new Date().toISOString().split('T')[0], // Default to today
        symptoms: symptoms.trim(),
        diagnosis: '' // Initial state
      });
      
      Alert.alert("Success", "Appointment scheduled successfully! Your doctor will review it shortly.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to schedule appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Appointment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeLabel}>QUICK SCHEDULING</Text>
          <Text style={styles.welcomeTitle}>Describe your symptoms and choose a physician.</Text>
        </View>

        {/* Doctor Selection */}
        <Text style={styles.label}>SELECT PHYSICIAN</Text>
        {fetchingDoctors ? (
          <ActivityIndicator color="#556ee6" style={{ marginVertical: 10 }} />
        ) : (
          <View style={styles.doctorGrid}>
            {doctors.map((doc) => (
              <TouchableOpacity 
                key={doc.id} 
                style={[
                  styles.doctorCard, 
                  selectedDoctor?.id === doc.id && styles.selectedDoctorCard
                ]}
                onPress={() => setSelectedDoctor(doc)}
              >
                <View style={[styles.docAvatar, selectedDoctor?.id === doc.id && { backgroundColor: '#556ee6' }]}>
                  <Text style={[styles.docAvatarText, selectedDoctor?.id === doc.id && { color: '#fff' }]}>
                    {doc.first_name?.[0]}{doc.last_name?.[0]}
                  </Text>
                </View>
                <Text style={[styles.docName, selectedDoctor?.id === doc.id && { color: '#556ee6' }]} numberOfLines={1}>
                  Dr. {doc.last_name}
                </Text>
                <Text style={styles.docSpec}>General Medicine</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Symptoms Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>WHAT ARE YOUR SYMPTOMS?</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Headache for 3 days, mild fever..."
            placeholderTextColor="#94a3b8"
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, (!selectedDoctor || !symptoms.trim()) && styles.disabledBtn]} 
          onPress={handleSchedule}
          disabled={loading || !selectedDoctor || !symptoms.trim()}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <MaterialCommunityIcons name="calendar-check" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Confirm Appointment</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  welcomeInfo: {
    marginBottom: 24,
  },
  welcomeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#556ee6',
    letterSpacing: 2,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  doctorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  doctorCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedDoctorCard: {
    borderColor: '#556ee6',
    borderWidth: 2,
    backgroundColor: '#f0f7ff',
  },
  docAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  docAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
  },
  docName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  docSpec: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginBottom: 40,
  },
  disabledBtn: {
    backgroundColor: '#cbd5e1',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
});

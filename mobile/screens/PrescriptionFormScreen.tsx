import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createPrescription } from '../services/api';
import * as SecureStore from 'expo-secure-store';

export default function PrescriptionFormScreen({ route, navigation }: any) {
  const { patient } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: ''
  });

  const handleIssue = async () => {
    if (!formData.medication || !formData.dosage) {
      Alert.alert("Error", "Please enter at least the medication name and dosage.");
      return;
    }

    setLoading(true);
    try {
      const doctorId = await SecureStore.getItemAsync('doctorId'); // Ensure this is stored on login!
      
      await createPrescription({
        patient: patient.id,
        doctor: doctorId ? parseInt(doctorId) : 1, // Fallback for testing
        medication: formData.medication,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration
      });
      
      Alert.alert("Success", "Prescription issued successfully.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to issue prescription.");
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
        <Text style={styles.headerTitle}>New Prescription</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientLabel}>ISSUING FOR</Text>
          <Text style={styles.patientName}>{patient.first_name} {patient.last_name}</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MEDICATION NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lisinopril 20mg"
              value={formData.medication}
              onChangeText={(text) => setFormData({...formData, medication: text})}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>DOSAGE</Text>
              <TextInput
                style={styles.input}
                placeholder="1 Tablet"
                value={formData.dosage}
                onChangeText={(text) => setFormData({...formData, dosage: text})}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 16 }]}>
              <Text style={styles.label}>FREQUENCY</Text>
              <TextInput
                style={styles.input}
                placeholder="Twice Daily"
                value={formData.frequency}
                onChangeText={(text) => setFormData({...formData, frequency: text})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>DURATION</Text>
            <TextInput
              style={styles.input}
              placeholder="30 Days"
              value={formData.duration}
              onChangeText={(text) => setFormData({...formData, duration: text})}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleIssue}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitBtnText}>Authorize & Issue</Text>
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
  patientInfo: {
    marginBottom: 24,
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  patientLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#556ee6',
    letterSpacing: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    backgroundColor: '#556ee6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#556ee6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

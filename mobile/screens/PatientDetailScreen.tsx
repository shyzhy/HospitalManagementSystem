import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getConsultations, getTreatments, getPrescriptions, getMedicalRecords } from '../services/api';
import * as SecureStore from 'expo-secure-store';

export default function PatientDetailScreen({ route, navigation }: any) {
  const { patient } = route.params;
  const [role, setRole] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleStr = await SecureStore.getItemAsync('role');
        setRole(roleStr);

        const consResponse = await getConsultations();
        const filteredCons = consResponse.data.filter((c: any) => c.patient === patient.id);
        setConsultations(filteredCons);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patient.id]);

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon as any} size={20} color="#64748b" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Record</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{patient.first_name?.[0]}{patient.last_name?.[0]}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.patientName}>{patient.first_name} {patient.last_name}</Text>
              <Text style={styles.patientSub}>Electronic Medical Record</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>GENDER</Text>
              <Text style={styles.infoValue}>{patient.gender === 'M' ? 'Male' : 'Female'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>AGE</Text>
              <Text style={styles.infoValue}>
                {patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 'N/A'} yrs
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>#{patient.id.toString().padStart(4, '0')}</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        {renderSectionHeader('CONTACT INFORMATION', 'card-account-details-outline')}
        <View style={styles.card}>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#94a3b8" />
            <Text style={styles.contactText}>{patient.email || 'No email recorded'}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="phone-outline" size={18} color="#94a3b8" />
            <Text style={styles.contactText}>{patient.phone || 'No phone recorded'}</Text>
          </View>
          <View style={styles.contactRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color="#94a3b8" />
            <Text style={styles.contactText}>{patient.address || 'No address recorded'}</Text>
          </View>
        </View>

        {/* Clinical History */}
        {renderSectionHeader('CLINICAL ENCOUNTERS', 'stethoscope')}
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="small" color="#556ee6" />
          ) : consultations.length === 0 ? (
            <Text style={styles.emptyText}>No clinical records found.</Text>
          ) : (
            consultations.map((c, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.historyItem, i === consultations.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => navigation.navigate('ConsultationDetail', { consultation: c })}
              >
                <View>
                  <Text style={styles.historyDate}>{new Date(c.consultation_date).toLocaleDateString()}</Text>
                  <Text style={styles.historyDoctor}>{c.doctor_name || 'Assigned Physician'}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Doctor Actions */}
        {role === 'doctor' || role === 'admin' ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#556ee6' }]}
              onPress={() => navigation.navigate('PrescriptionForm', { patient })}
            >
              <MaterialCommunityIcons name="pill" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Issue Prescription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#34c38f' }]}
              onPress={() => navigation.navigate('TreatmentForm', { patient })}
            >
              <MaterialCommunityIcons name="medical-bag" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Add Treatment</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
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
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#556ee6',
  },
  profileInfo: {
    marginLeft: 16,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  patientSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 4,
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 12,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  historyDoctor: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

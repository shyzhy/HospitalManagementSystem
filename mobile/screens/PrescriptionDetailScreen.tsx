import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PrescriptionDetailScreen({ route, navigation }: any) {
  const { prescription } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescription Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.topCard}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ORDER #RX-{prescription.id.toString().padStart(4, '0')}</Text>
          </View>
        </View>
        <Text style={styles.medicationName}>{prescription.medication_name || 'Prescribed Medication'}</Text>
        <Text style={styles.dateText}>Issued on {new Date(prescription.date_prescribed).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Info */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="doctor" size={24} color="#556ee6" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>PRESCRIBING PHYSICIAN</Text>
              <Text style={styles.infoValue}> {prescription.doctor_name || prescription.doctor}</Text>
            </View>
          </View>
        </View>

        {/* Medication Details */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="pill" size={18} color="#f97316" />
          <Text style={styles.sectionTitle}>Medication Schedule</Text>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>DOSAGE</Text>
            <Text style={styles.detailValue}>{prescription.dosage || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>FREQUENCY</Text>
            <Text style={styles.detailValue}>{prescription.frequency || 'N/A'}</Text>
          </View>
        </View>

        {/* Instructions */}
        {prescription.instructions && (
          <>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="information-outline" size={18} color="#64748b" />
              <Text style={styles.sectionTitle}>Patient Instructions</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.instructionsText}>{prescription.instructions}</Text>
            </View>
          </>
        )}

        <View style={styles.adminNote}>
          <MaterialCommunityIcons name="shield-check-outline" size={16} color="#34c38f" />
          <Text style={styles.adminNoteText}>This is a verified digital prescription.</Text>
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
  badgeContainer: {
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  medicationName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  dateText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: 'black',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1.5,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  instructionsText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  adminNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
  },
  adminNoteText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 8,
    fontWeight: '700',
  },
});

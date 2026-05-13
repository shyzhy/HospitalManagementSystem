import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Diagnosis Added',
    body: 'Dr. Yin added diagnosis from your consultation',
    type: 'consultation',
    data: { consultation: { id: 1, patient_name: 'John Doe', doctor_name: 'Dr. Yin', diagnosis: 'Common Cold', symptoms: 'Fever, Cough', consultation_date: '2026-05-13' } },
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Prescription Issued',
    body: 'Dr. Yin prescribed/issued you a prescription',
    type: 'prescription',
    data: { prescription: { id: 1, medication_name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day', date_prescribed: '2026-05-13', doctor_name: 'Dr. Yin' } },
    time: '5 hours ago',
    read: true,
  }
];

export default function NotificationsScreen({ navigation }: any) {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => {
        if (item.type === 'consultation') {
          navigation.navigate('ConsultationDetail', item.data);
        } else if (item.type === 'prescription') {
          navigation.navigate('PrescriptionDetail', item.data);
        }
      }}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={item.type === 'consultation' ? 'stethoscope' : 'pill'} 
          size={24} 
          color={item.type === 'consultation' ? '#556ee6' : '#f97316'} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>Your clinical updates</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  flex1: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 2,
  },
  list: {
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unreadCard: {
    backgroundColor: '#f0f4ff',
    borderColor: '#d0d7ff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  time: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#556ee6',
    marginLeft: 8,
  },
});

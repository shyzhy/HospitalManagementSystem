import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getConsultations } from '../services/api';

export default function ConsultationsScreen({ navigation }: any) {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await getConsultations();
      setConsultations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(c =>
    (c.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.primary_complaint || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ConsultationDetail', { consultation: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons name="stethoscope" size={24} color="#556ee6" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.patientName}>{item.doctor_name || `Dr. ${item.doctor}`}</Text>
          <Text style={styles.complaintText} numberOfLines={1}>{item.primary_complaint || 'General Consultation'}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{new Date(item.consultation_date).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="clock-outline" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>{item.consultation_time || 'N/A'}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="account" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>{item.patient_name || `Patient #${item.patient}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Consultations</Text>
          <Text style={styles.headerSubtitle}>Clinical visit records</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by patient or complaint..."
          placeholderTextColor="#94a3b8"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#556ee6" />
        </View>
      ) : filteredConsultations.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>No consultations found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConsultations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  menuBtn: {
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  cardInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  complaintText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  dateBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '600',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  }
});

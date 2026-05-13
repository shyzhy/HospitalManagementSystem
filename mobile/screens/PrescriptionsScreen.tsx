import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getPrescriptions } from '../services/api';

export default function PrescriptionsScreen({ navigation }: any) {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await getPrescriptions();
      setPrescriptions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    (p.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.medication_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('PrescriptionDetail', { prescription: item })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: '#fff7ed', borderColor: '#ffedd5' }]}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#f97316" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.patientName}>{item.patient_name || `Patient #${item.patient}`}</Text>
          <Text style={styles.medicationName} numberOfLines={1}>{item.medication_name || 'Prescribed Medication'}</Text>
        </View>
        <View style={styles.dosageBadge}>
          <Text style={styles.dosageText}>{item.dosage || 'N/A'}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="repeat" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>{item.frequency || 'As directed'}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="calendar-clock" size={14} color="#94a3b8" />
          <Text style={styles.footerText}>{item.date_prescribed || 'N/A'}</Text>
        </View>
      </View>
      
      {item.instructions && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsText} numberOfLines={2}>{item.instructions}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Prescriptions</Text>
          <Text style={styles.headerSubtitle}>Medication management</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by patient or medication..."
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
      ) : filteredPrescriptions.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="file-cancel-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>No prescriptions found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPrescriptions}
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
    marginRight: 16,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  cardInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  medicationName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  dosageBadge: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  dosageText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
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
  instructionsBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f97316',
  },
  instructionsText: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  }
});

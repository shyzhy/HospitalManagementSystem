  import React, { useEffect, useState } from 'react';
  import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
  import * as SecureStore from 'expo-secure-store';
  import { Appbar } from 'react-native-paper';
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  import Svg, { Path } from 'react-native-svg';

  export default function HomeScreen({ navigation }: any) {
    const [userName, setUserName] = useState<string | null>('');
    const [refreshing, setRefreshing] = useState(false);
    
    const fetchData = async () => {
      const name = await SecureStore.getItemAsync('userName');
      setUserName(name);
    };

    useEffect(() => {
      fetchData();
    }, []);

    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await fetchData();
      setRefreshing(false);
    }, []);

    const menuItems = [
      {
        title: 'Consultations',
        icon: 'stethoscope',
        path: 'Consultations',
      },
      {
        title: 'My Appointments',
        icon: 'calendar-clock',
        path: 'MyAppointments',
      },
      {
        title: 'Notifications',
        icon: 'bell-outline',
        path: 'Notifications',
      },
      {
        title: 'Prescriptions',
        icon: 'file-document-outline',
        path: 'Prescriptions',
      },
      {
        title: 'Settings',
        icon: 'cog-outline',
        path: 'Settings',
      },
    ];

    const renderPatientDashboard = () => (
      <View style={styles.dashboardContainer}>
        <TouchableOpacity 
          style={styles.aiBanner}
          onPress={() => navigation.navigate('ScheduleConsultation')}
        >
          <View style={styles.aiIcon}>
            <MaterialCommunityIcons name="calendar-check-outline" size={24} color="#ffffff" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Book Appointment</Text>
            <Text style={styles.aiSubtitle}>Schedule a new visit with your doctor</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.aiBanner, { backgroundColor: '#8b5cf6', marginTop: -16 }]}
          onPress={() => navigation.navigate('Chatbot')}
        >
          <View style={[styles.aiIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <MaterialCommunityIcons name="robot" size={24} color="#ffffff" />
          </View>
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>AI Health Assistant</Text>
            <Text style={styles.aiSubtitle}>Consult regarding prescriptions, appointments & symptoms</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>My Clinical Services</Text>
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card}
              onPress={() => navigation.navigate(item.path)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={28} color="#22c55e" />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.adminNote}>
          <MaterialCommunityIcons name="information-outline" size={16} color="#64748b" />
          <Text style={styles.adminNoteText}>Need help? Contact system administrator.</Text>
        </View>
      </View>
    );

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <TouchableOpacity 
            style={styles.menuBtn} 
            onPress={() => navigation.openDrawer()}
          >
            <MaterialCommunityIcons name="menu" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Appbar.Content title="MedFlow" titleStyle={styles.headerTitle} />
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
          
            <MaterialCommunityIcons name="bell-outline" size={24} color="#556ee6" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Svg viewBox="0 0 24 24" fill="none" stroke="#556ee6" strokeWidth={2} width={24} height={24}>
              <Path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </Svg>
          </View>
        </Appbar.Header>

        <ScrollView 
          style={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#556ee6']} />
          }
        >
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeSubtitle}>VERIFIED PATIENT,</Text>
            <Text style={styles.welcomeTitle}>{userName || 'User'}</Text>
            <Text style={styles.welcomeDesc}>Manage your consultations and prescriptions.</Text>
          </View>

          {renderPatientDashboard()}
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
      backgroundColor: '#ffffff',
      elevation: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
    },
    headerLogo: {
      marginRight: 16,
    },
    headerTitle: {
      fontWeight: '900',
      color: '#1e293b',
      textTransform: 'uppercase',
      letterSpacing: -0.5,
      fontSize: 20,
    },
    menuBtn: {
      padding: 8,
      marginLeft: 12,
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    scrollContent: {
      flex: 1,
      padding: 20,
    },
    welcomeSection: {
      marginBottom: 24,
      marginTop: 8,
    },
    welcomeSubtitle: {
      fontSize: 10,
      color: '#556ee6',
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontWeight: 'bold',
    },
    welcomeTitle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#1e293b',
      marginTop: 4,
      letterSpacing: -1,
    },
    welcomeDesc: {
      fontSize: 14,
      color: '#64748b',
      marginTop: 6,
    },
    dashboardContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 16,
      marginTop: 8,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    statCard: {
      width: '48%',
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 16,
      borderLeftWidth: 4,
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 2,
    },
    statLabel: {
      fontSize: 10,
      color: '#64748b',
      fontWeight: '800',
      letterSpacing: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '900',
      color: '#1e293b',
      marginTop: 4,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 10,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    iconWrapper: {
      width: 56,
      height: 56,
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#f1f5f9',
    },
    cardTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#334155',
      textTransform: 'uppercase',
      letterSpacing: 1,
      textAlign: 'center',
    },
    healthCard: {
      backgroundColor: '#ffffff',
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#fee2e2',
      shadowColor: '#ef4444',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 4,
    },
    healthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    healthTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e293b',
      marginLeft: 10,
    },
    healthDesc: {
      fontSize: 14,
      color: '#64748b',
      lineHeight: 20,
      marginBottom: 20,
    },
    healthFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
      borderRadius: 12,
      padding: 12,
    },
    healthStat: {
      flex: 1,
      alignItems: 'center',
    },
    hStatLabel: {
      fontSize: 9,
      color: '#94a3b8',
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    hStatValue: {
      fontSize: 16,
      fontWeight: '900',
      color: '#1e293b',
      marginTop: 2,
    },
    hStatDivider: {
      width: 1,
      height: 24,
      backgroundColor: '#e2e8f0',
    },
    aiBanner: {
      backgroundColor: '#556ee6',
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 32,
    },
    aiIcon: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiTextContainer: {
      flex: 1,
      marginLeft: 16,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    aiSubtitle: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 2,
    },
    notificationBtn: {
      marginRight: 10,
      position: 'relative',
      padding: 8,
    },
    notificationDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      backgroundColor: '#ef4444',
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: '#ffffff',
    },
    adminNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 32,
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#f8fafc',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderStyle: 'dashed',
    },
    adminNoteText: {
      fontSize: 12,
      color: '#64748b',
      marginLeft: 8,
      fontWeight: '600',
    },
  });

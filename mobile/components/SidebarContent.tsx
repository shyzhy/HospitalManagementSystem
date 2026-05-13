import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path } from 'react-native-svg';

const SidebarContent = (props: DrawerContentComponentProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>('');

  useEffect(() => {
    SecureStore.getItemAsync('role').then(setRole);
    SecureStore.getItemAsync('userName').then(setUserName);
  }, []);

  const menuItems = [
    { title: 'Dashboard', icon: 'view-dashboard-outline', path: 'Main' },
    { title: 'Notifications', icon: 'bell-outline', path: 'Notifications' },
    { title: 'Consultations', icon: 'stethoscope', path: 'Consultations' },
    { title: 'Prescriptions', icon: 'file-document-outline', path: 'Prescriptions' },
    { title: 'Settings', icon: 'cog-outline', path: 'Settings' },
  ];

  const visibleMenuItems = menuItems;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('role');
    await SecureStore.deleteItemAsync('userName');
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const activeRouteName = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Svg viewBox="0 0 24 24" fill="none" stroke="#556ee6" strokeWidth={2} width={24} height={24}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </Svg>
        </View>
        <Text style={styles.logoText}>MedFlow</Text>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>PATIENT PORTAL</Text>
        {visibleMenuItems.map((item, index) => {
          const isActive = activeRouteName === item.path;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => props.navigation.navigate(item.path)}
            >
              <MaterialCommunityIcons 
                name={item.icon as any} 
                size={22} 
                color={isActive ? '#556ee6' : '#64748b'} 
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.title}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
        
        <View style={styles.sidebarNote}>
          <Text style={styles.noteTitle}>SUPPORT</Text>
          <Text style={styles.noteText}>For technical issues, please contact system admin.</Text>
        </View>
      </ScrollView>

      {/* Footer / User Info */}
      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName?.substring(0, 1).toUpperCase() || 'U'}</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName} numberOfLines={1}>{userName || 'User'}</Text>
            <Text style={styles.userRole}>{role?.toUpperCase() || 'ROLE'}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  logoContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 8,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#eff6ff',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 12,
  },
  menuLabelActive: {
    color: '#556ee6',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: 20,
    backgroundColor: '#556ee6',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#556ee6',
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  userRole: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  sidebarNote: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    lineHeight: 16,
  },
});

export default SidebarContent;

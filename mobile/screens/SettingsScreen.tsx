import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { getUser, uploadProfilePicture, API_URL } from '../services/api';

export default function SettingsScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [role, setRole] = useState<string | null>('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedRole = await SecureStore.getItemAsync('role');
      setRole(storedRole);
      const response = await getUser();
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setUploading(true);
      try {
        const patientId = await SecureStore.getItemAsync('patientId');
        if (!patientId) {
          Alert.alert("Error", "Patient ID not found.");
          return;
        }

        // Prepare file object for FormData
        const fileToUpload = {
          uri: asset.uri,
          name: asset.fileName || 'profile.jpg',
          type: asset.type || 'image/jpeg',
        };

        await uploadProfilePicture('patient', parseInt(patientId), fileToUpload as any);
        fetchUserData(); // Refresh data
        Alert.alert("Success", "Profile picture updated.");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to upload picture.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('role');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#556ee6" />
      </View>
    );
  }

  const getProfilePicUrl = () => {
    if (!user?.profile_picture_url) return null;
    if (user.profile_picture_url.startsWith('http')) return user.profile_picture_url;
    // Check if it already has /media/
    const path = user.profile_picture_url.startsWith('/') ? user.profile_picture_url : `/${user.profile_picture_url}`;
    return `${API_URL}${path}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Account</Text>
          <Text style={styles.headerSubtitle}>Manage your profile</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            {getProfilePicUrl() ? (
              <Image 
                source={{ uri: getProfilePicUrl() }} 
                style={styles.avatar} 
                key={getProfilePicUrl()} // Force refresh
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.substring(0, 2).toUpperCase() || 'P'}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarBtn} 
              onPress={handleEditAvatar}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialCommunityIcons name="camera" size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.profile_name || `${user?.first_name} ${user?.last_name}`}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role?.toUpperCase()} PORTAL</Text>
          </View>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert("Clinical Records", "Full medical history is available in the Consultations module.")}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#eff6ff' }]}>
              <MaterialCommunityIcons name="account-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.menuLabel}>Clinical Information</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert("Security", "Password modification is handled via secure web gateway for your protection.")}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#f5f3ff' }]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#8b5cf6" />
            </View>
            <Text style={styles.menuLabel}>Security Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#ecfdf5' }]}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#10b981" />
            </View>
            <Text style={styles.menuLabel}>Notifications</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.adminNote}>
          <MaterialCommunityIcons name="information-outline" size={16} color="#64748b" />
          <Text style={styles.adminNoteText}>For system assistance, contact administrator.</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>MedFlow Patient Mobile v1.1.0</Text>
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
    backgroundColor: '#F0F2F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#556ee6',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#556ee6',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 8,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 40,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  adminNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

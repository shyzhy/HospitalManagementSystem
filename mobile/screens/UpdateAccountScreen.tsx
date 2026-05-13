import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUser, updatePatientProfile, getPatient, API_URL } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UpdateAccountScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const id = await SecureStore.getItemAsync('patientId');
      setPatientId(id);
      
      if (id) {
        const response = await getPatient(parseInt(id));
        const p = response.data;
        
        setEmail(p.email || '');
        setFirstName(p.first_name || '');
        setLastName(p.last_name || '');
        setPhone(p.phone || '');
        setAddress(p.address || '');
        if (p.dob) setDob(new Date(p.dob));
        if (p.gender) setGender(p.gender === 'M' ? 'Male' : 'Female');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!email || !firstName || !lastName) {
      Alert.alert("Error", "Required fields must be filled.");
      return;
    }

    setUpdating(true);
    try {
      if (!patientId) throw new Error("Patient ID not found");

      const updateData: any = {
        email,
        first_name: firstName,
        last_name: lastName,
        dob: dob.toISOString().split('T')[0],
        gender: gender === 'Male' ? 'M' : 'F',
        phone,
        address
      };

      if (password) {
        updateData.password = password;
      }

      await updatePatientProfile(parseInt(patientId), updateData);
      Alert.alert("Success", "Account details updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update account details.");
    } finally {
      setUpdating(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#556ee6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Update Account</Text>
          <Text style={styles.headerSubtitle}>Modify your clinical and security details.</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Security */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Account Security & Access</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SECURE EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ACCESS PASSWORD (SECURE)</Text>
            <TextInput
              style={styles.input}
              placeholder="•••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Section: Personal Identity */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Personal Identity</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LEGAL FIRST NAME</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LEGAL LAST NAME</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <TouchableOpacity 
              style={styles.datePickerBtn}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>{dob.toLocaleDateString()}</Text>
              <MaterialCommunityIcons name="calendar-outline" size={18} color="#64748b" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>LEGAL GENDER</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'Male' && styles.genderBtnActive]}
                onPress={() => setGender('Male')}
              >
                <Text style={[styles.genderBtnText, gender === 'Male' && styles.genderBtnTextActive]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'Female' && styles.genderBtnActive]}
                onPress={() => setGender('Female')}
              >
                <Text style={[styles.genderBtnText, gender === 'Female' && styles.genderBtnTextActive]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section: Contact Info */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Verified Contact Information</Text>
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>PRIMARY PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>RESIDENTIAL ADDRESS</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity 
          style={[styles.submitBtn, updating && styles.disabledBtn]} 
          onPress={handleUpdate}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Update Account Details</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  content: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#556ee6',
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    width: '48%',
  },
  inputGroupFull: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  datePickerText: {
    fontSize: 14,
    color: '#1e293b',
  },
  genderContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  genderBtnActive: {
    backgroundColor: '#eff6ff',
  },
  genderBtnText: {
    fontSize: 14,
    color: '#64748b',
  },
  genderBtnTextActive: {
    color: '#556ee6',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

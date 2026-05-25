import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, 
  ActivityIndicator, TouchableOpacity, TextInput, ScrollView 
} from 'react-native';
import { login, register, getUser } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LoginScreen({ navigation }: any) {
  const [isRegister, setIsRegister] = useState(false);

  // Password and date visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegRePassword, setShowRegRePassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobDate, setDobDate] = useState(new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDobDate(selectedDate);
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      handleRegChange('dob', `${year}-${month}-${day}`);
    }
  };

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    email: '', password: '', re_password: '',
    first_name: '', last_name: '',
    dob: '', gender: 'M', phone: '', address: ''
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setLoginError('');
    try {
      const response = await login(email, password);
      const token = response.data.auth_token;
      await SecureStore.setItemAsync('token', token);
      
      // Fetch user profile to get role
      const userResponse = await getUser();
      const userData = userResponse.data;
      
      let role = 'patient';
      if (userData.is_staff) {
        role = 'admin';
      } else if (userData.is_doctor) {
        role = 'doctor';
      }
      
      if (role !== 'patient') {
        await SecureStore.deleteItemAsync('token');
        setLoginError("Access Denied: Only patients can log in to the mobile app.");
        setLoading(false);
        return;
      }
      
      await SecureStore.setItemAsync('role', role);
      await SecureStore.setItemAsync('userName', userData.first_name || userData.username);
      
      if (userData.patient_id) {
        await SecureStore.setItemAsync('patientId', userData.patient_id.toString());
      }
      
      navigation.replace('AppDrawer');
    } catch (err: any) {
      console.error(err);
      setLoginError("Login Failed: Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegChange = (name: string, value: string) => {
    setRegData({ ...regData, [name]: value });
  };

  const handleRegister = async () => {
    setRegLoading(true);
    setRegError('');
    setRegSuccess('');
    try {
      await register(regData);
      setRegSuccess('Account created! Please check your email to activate.');
      // Optional: Auto switch to login tab after success
      setTimeout(() => { setIsRegister(false); setRegSuccess(''); }, 3000);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          {/* Header Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Svg viewBox="0 0 24 24" fill="none" stroke="#556ee6" strokeWidth={2} width={32} height={32}>
                <Path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </Svg>
            </View>
            <Text style={styles.title}>MedFlow</Text>
            <Text style={styles.subtitle}>Hospital Management System</Text>
          </View>

          {/* Tab Toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, !isRegister && styles.tabButtonActive]}
              onPress={() => { setIsRegister(false); setRegError(''); setRegSuccess(''); }}
            >
              <Text style={[styles.tabText, !isRegister && styles.tabTextActive]}>SIGN IN</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, isRegister && styles.tabButtonActive]}
              onPress={() => { setIsRegister(true); setLoginError(''); }}
            >
              <Text style={[styles.tabText, isRegister && styles.tabTextActive]}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
          </View>

          {/* ===== LOGIN FORM ===== */}
          {!isRegister && (
            <View style={styles.formContainer}>
              {loginError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>✕ {loginError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput 
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showLoginPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton} 
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <MaterialCommunityIcons 
                      name={showLoginPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#94a3b8" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.submitButtonText}>AUTHENTICATING...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>SECURE ACCESS GATEWAY</Text>
            </View>
          )}

          {/* ===== REGISTER FORM ===== */}
          {isRegister && (
            <View style={styles.formContainer}>
              {regSuccess ? (
                <View style={styles.successBox}>
                  <Text style={styles.successText}>✓ {regSuccess}</Text>
                </View>
              ) : null}
              {regError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>✕ {regError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="#94a3b8" value={regData.email} onChangeText={(v) => handleRegChange('email', v)} autoCapitalize="none" keyboardType="email-address" />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, { marginRight: 10 }]}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput 
                      style={styles.passwordInput} 
                      placeholder="••••••••" 
                      placeholderTextColor="#94a3b8" 
                      value={regData.password} 
                      onChangeText={(v) => handleRegChange('password', v)} 
                      secureTextEntry={!showRegPassword} 
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton} 
                      onPress={() => setShowRegPassword(!showRegPassword)}
                    >
                      <MaterialCommunityIcons 
                        name={showRegPassword ? "eye-off" : "eye"} 
                        size={20} 
                        color="#94a3b8" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput 
                      style={styles.passwordInput} 
                      placeholder="••••••••" 
                      placeholderTextColor="#94a3b8" 
                      value={regData.re_password} 
                      onChangeText={(v) => handleRegChange('re_password', v)} 
                      secureTextEntry={!showRegRePassword} 
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton} 
                      onPress={() => setShowRegRePassword(!showRegRePassword)}
                    >
                      <MaterialCommunityIcons 
                        name={showRegRePassword ? "eye-off" : "eye"} 
                        size={20} 
                        color="#94a3b8" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>PATIENT DETAILS</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, { marginRight: 10 }]}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput style={styles.input} placeholder="Juan" placeholderTextColor="#94a3b8" value={regData.first_name} onChangeText={(v) => handleRegChange('first_name', v)} />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput style={styles.input} placeholder="Dela Cruz" placeholderTextColor="#94a3b8" value={regData.last_name} onChangeText={(v) => handleRegChange('last_name', v)} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, { marginRight: 10 }]}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity 
                    style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: regData.dob ? '#1e293b' : '#94a3b8', fontSize: 14 }}>
                      {regData.dob || 'YYYY-MM-DD'}
                    </Text>
                    <MaterialCommunityIcons name="calendar" size={18} color="#556ee6" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dobDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderRow}>
                    {['M', 'F', 'O'].map((g) => (
                      <TouchableOpacity 
                        key={g} 
                        style={[styles.genderBtn, regData.gender === g && styles.genderBtnActive]}
                        onPress={() => handleRegChange('gender', g)}
                      >
                        <Text style={[styles.genderText, regData.gender === g && styles.genderTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, { marginRight: 10 }]}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput style={styles.input} placeholder="09XX XXX XXXX" placeholderTextColor="#94a3b8" value={regData.phone} onChangeText={(v) => handleRegChange('phone', v)} keyboardType="phone-pad" />
                </View>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput style={styles.input} placeholder="City, Province" placeholderTextColor="#94a3b8" value={regData.address} onChangeText={(v) => handleRegChange('address', v)} />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, regLoading && styles.submitButtonDisabled]}
                onPress={handleRegister}
                disabled={regLoading}
                activeOpacity={0.8}
              >
                {regLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.submitButtonText}>CREATING ACCOUNT...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>CREATE PATIENT ACCOUNT</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.footerText}>PATIENT SELF-REGISTRATION PORTAL</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Web exact background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderRadius: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    color: '#556ee6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#556ee6',
  },
  formContainer: {
    // animate in later
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  eyeButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 2,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  genderBtnActive: {
    backgroundColor: '#e0e7ff',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  genderTextActive: {
    color: '#556ee6',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginHorizontal: 12,
  },
  submitButton: {
    backgroundColor: '#556ee6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#556ee6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginLeft: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 20,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

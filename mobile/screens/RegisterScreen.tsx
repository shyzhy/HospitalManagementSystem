import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, useTheme, SegmentedButtons } from 'react-native-paper';
import { register } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [data, setData] = useState({
    email: '', password: '', re_password: '',
    first_name: '', last_name: '',
    dob: '', gender: 'M', phone: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const theme = useTheme();

  const handleRegister = async () => {
    if (data.password !== data.re_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(data);
      setSuccess('Account created! Please check your email to activate your account.');
      // Automatically navigate back to login after 3 seconds
      setTimeout(() => navigation.navigate('Login'), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setData({ ...data, [name]: value });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Patient Registration Portal</Text>
          </View>

          {success ? <Text style={styles.successText}>✓ {success}</Text> : null}
          {error ? <Text style={styles.errorText}>✕ {error}</Text> : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <TextInput
              label="Email Address"
              value={data.email}
              onChangeText={(v) => handleChange('email', v)}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
            />
            <TextInput
              label="Password"
              value={data.password}
              onChangeText={(v) => handleChange('password', v)}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
            />
            <TextInput
              label="Confirm Password"
              value={data.re_password}
              onChangeText={(v) => handleChange('re_password', v)}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <View style={styles.row}>
              <TextInput
                label="First Name"
                value={data.first_name}
                onChangeText={(v) => handleChange('first_name', v)}
                style={[styles.input, styles.halfInput, { marginRight: 8 }]}
                mode="outlined"
                activeOutlineColor="#556ee6"
              />
              <TextInput
                label="Last Name"
                value={data.last_name}
                onChangeText={(v) => handleChange('last_name', v)}
                style={[styles.input, styles.halfInput]}
                mode="outlined"
                activeOutlineColor="#556ee6"
              />
            </View>

            <TextInput
              label="Date of Birth (YYYY-MM-DD)"
              value={data.dob}
              onChangeText={(v) => handleChange('dob', v)}
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
              placeholder="e.g. 1990-12-31"
            />

            <SegmentedButtons
              value={data.gender}
              onValueChange={(v) => handleChange('gender', v)}
              buttons={[
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' },
                { value: 'O', label: 'Other' },
              ]}
              style={styles.segmentedButton}
            />

            <TextInput
              label="Phone Number"
              value={data.phone}
              onChangeText={(v) => handleChange('phone', v)}
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
              keyboardType="phone-pad"
            />

            <TextInput
              label="Address"
              value={data.address}
              onChangeText={(v) => handleChange('address', v)}
              style={styles.input}
              mode="outlined"
              activeOutlineColor="#556ee6"
            />
          </View>

          <Button 
            mode="contained" 
            onPress={handleRegister} 
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            CREATE ACCOUNT
          </Button>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#556ee6',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#f8fafc',
    fontSize: 14,
  },
  halfInput: {
    flex: 1,
  },
  segmentedButton: {
    marginBottom: 16,
    marginTop: 4,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: '#556ee6',
    borderRadius: 12,
  },
  buttonLabel: {
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    fontSize: 12,
    fontWeight: 'bold',
  },
  successText: {
    color: '#047857',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#556ee6',
    fontWeight: 'bold',
    fontSize: 13,
  }
});

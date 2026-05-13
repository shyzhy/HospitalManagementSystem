import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PatientListScreen from './screens/PatientListScreen';
import ConsultationsScreen from './screens/ConsultationsScreen';
import TreatmentScreen from './screens/TreatmentScreen';
import MedicalRecordsScreen from './screens/MedicalRecordsScreen';
import PrescriptionsScreen from './screens/PrescriptionsScreen';
import SettingsScreen from './screens/SettingsScreen';
import SidebarContent from './components/SidebarContent';
import PatientDetailScreen from './screens/PatientDetailScreen';
import ConsultationDetailScreen from './screens/ConsultationDetailScreen';
import PrescriptionFormScreen from './screens/PrescriptionFormScreen';
import ScheduleConsultationScreen from './screens/ScheduleConsultationScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#556ee6',
    accent: '#34c38f',
  },
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SidebarContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: { width: '80%' },
      }}
    >
      <Drawer.Screen name="Main" component={HomeScreen} />
      <Drawer.Screen name="PatientList" component={PatientListScreen} />
      <Drawer.Screen name="Consultations" component={ConsultationsScreen} />
      <Drawer.Screen name="Treatment" component={TreatmentScreen} />
      <Drawer.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
      <Drawer.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          setInitialRoute('AppDrawer');
        } else {
          setInitialRoute('Login');
        }
      } catch (e) {
        setInitialRoute('Login');
      }
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#556ee6" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AppDrawer" component={DrawerNavigator} />
            <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
            <Stack.Screen name="ConsultationDetail" component={ConsultationDetailScreen} />
            <Stack.Screen name="PrescriptionForm" component={PrescriptionFormScreen} />
            <Stack.Screen name="ScheduleConsultation" component={ScheduleConsultationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

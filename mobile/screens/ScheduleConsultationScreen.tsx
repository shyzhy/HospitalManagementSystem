import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createConsultation, getAvailableDoctors } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
    specialization: string;
    license_number?: string;
    is_available: boolean;
    profile_picture_url?: string | null;
}

export default function ScheduleConsultationScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [symptoms, setSymptoms] = useState('');
    const [fetchingDoctors, setFetchingDoctors] = useState(true);
    const [consultationDate, setConsultationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setFetchingDoctors(true);

            const response = await getAvailableDoctors();

            setDoctors(response.data || []);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load available doctors.');
        } finally {
            setFetchingDoctors(false);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');

        if (selectedDate) {
            setConsultationDate(selectedDate);
        }
    };

    const handleSchedule = async () => {
        if (!selectedDoctor || !symptoms.trim()) {
            Alert.alert(
                'Required',
                'Please select an available doctor and describe your symptoms.'
            );
            return;
        }

        setLoading(true);

        try {
            const patientId = await SecureStore.getItemAsync('patientId');

            await createConsultation({
                patient: patientId ? parseInt(patientId) : 1,
                doctor: selectedDoctor.id,
                consultation_date: consultationDate.toISOString().split('T')[0],
                symptoms: symptoms.trim(),
                diagnosis: '',
                notes: '',
                appointment_status: 'pending',
            });

            Alert.alert(
                'Success',
                'Appointment scheduled successfully! Your doctor will review it shortly.'
            );

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to schedule appointment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={28}
                        color="#1e293b"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>New Appointment</Text>

                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcomeInfo}>
                    <Text style={styles.welcomeLabel}>QUICK SCHEDULING</Text>
                    <Text style={styles.welcomeTitle}>
                        Describe your symptoms and choose an available physician.
                    </Text>
                </View>

                {/* Doctor Selection */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Available Physician</Text>

                    {fetchingDoctors ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="small" color="#556ee6" />
                            <Text style={styles.loadingText}>
                                Loading available doctors...
                            </Text>
                        </View>
                    ) : doctors.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <MaterialCommunityIcons
                                name="doctor"
                                size={32}
                                color="#94a3b8"
                            />
                            <Text style={styles.emptyTitle}>
                                No available doctors
                            </Text>
                            <Text style={styles.emptySubtitle}>
                                Please try again later.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.doctorList}>
                            {doctors.map((doc) => {
                                const isSelected = selectedDoctor?.id === doc.id;

                                return (
                                    <TouchableOpacity
                                        key={doc.id}
                                        style={[
                                            styles.doctorCard,
                                            isSelected && styles.selectedDoctorCard,
                                        ]}
                                        onPress={() => setSelectedDoctor(doc)}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.doctorCardTop}>
                                            <View
                                                style={[
                                                    styles.docAvatar,
                                                    isSelected && styles.selectedAvatar,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.docAvatarText,
                                                        isSelected && styles.selectedAvatarText,
                                                    ]}
                                                >
                                                    {doc.first_name?.[0]}
                                                    {doc.last_name?.[0]}
                                                </Text>
                                            </View>

                                            <View style={styles.doctorInfo}>
                                                <Text style={styles.docName}>
                                                    Dr. {doc.first_name} {doc.last_name}
                                                </Text>

                                                <View style={styles.specializationPill}>
                                                    <MaterialCommunityIcons
                                                        name="stethoscope"
                                                        size={12}
                                                        color="#556ee6"
                                                    />
                                                    <Text style={styles.docSpec}>
                                                        {doc.specialization || 'General Medicine'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {isSelected ? (
                                                <MaterialCommunityIcons
                                                    name="check-circle"
                                                    size={24}
                                                    color="#22c55e"
                                                />
                                            ) : (
                                                <MaterialCommunityIcons
                                                    name="circle-outline"
                                                    size={24}
                                                    color="#cbd5e1"
                                                />
                                            )}
                                        </View>

                                        <View style={styles.availableRow}>
                                            <View style={styles.availableDot} />
                                            <Text style={styles.availableText}>
                                                Available for appointments
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Selected Doctor Details */}
                {selectedDoctor && (
                    <View style={styles.selectedDoctorBox}>
                        <Text style={styles.selectedLabel}>Selected Doctor</Text>

                        <Text style={styles.selectedDoctorName}>
                            Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                        </Text>

                        <Text style={styles.selectedDoctorSpec}>
                            Specialization: {selectedDoctor.specialization || 'General Medicine'}
                        </Text>
                    </View>
                )}

                {/* Date Selection */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Consultation Date</Text>

                    <TouchableOpacity
                        style={styles.datePickerBtn}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <MaterialCommunityIcons
                            name="calendar-month-outline"
                            size={22}
                            color="#556ee6"
                        />

                        <Text style={styles.datePickerText}>
                            {consultationDate.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={consultationDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                {/* Symptoms Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>What are your symptoms?</Text>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe what you are feeling..."
                        placeholderTextColor="#94a3b8"
                        multiline
                        value={symptoms}
                        onChangeText={setSymptoms}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitBtn,
                        (!selectedDoctor || !symptoms.trim() || loading) && styles.disabledBtn,
                    ]}
                    onPress={handleSchedule}
                    disabled={!selectedDoctor || !symptoms.trim() || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="calendar-check"
                                size={22}
                                color="#ffffff"
                            />
                            <Text style={styles.submitBtnText}>
                                Confirm Appointment
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    scrollView: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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

    headerTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 50,
    },

    welcomeInfo: {
        marginBottom: 24,
    },

    welcomeLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#556ee6',
        letterSpacing: 2,
    },

    welcomeTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1e293b',
        marginTop: 8,
        letterSpacing: -0.5,
        lineHeight: 28,
    },

    inputGroup: {
        marginBottom: 24,
    },

    label: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        letterSpacing: 1,
        marginBottom: 12,
        textTransform: 'uppercase',
    },

    loadingBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },

    emptyBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '900',
        color: '#1e293b',
    },

    emptySubtitle: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
    },

    doctorList: {
        gap: 12,
    },

    doctorCard: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    selectedDoctorCard: {
        borderColor: '#556ee6',
        borderWidth: 2,
        backgroundColor: '#f0f7ff',
    },

    doctorCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    docAvatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    selectedAvatar: {
        backgroundColor: '#556ee6',
    },

    docAvatarText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#64748b',
    },

    selectedAvatarText: {
        color: '#ffffff',
    },

    doctorInfo: {
        flex: 1,
    },

    docName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#1e293b',
    },

    specializationPill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eef2ff',
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 6,
        gap: 4,
    },

    docSpec: {
        fontSize: 10,
        color: '#556ee6',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    availableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },

    availableDot: {
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: '#22c55e',
        marginRight: 8,
    },

    availableText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#22c55e',
    },

    selectedDoctorBox: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        marginBottom: 24,
    },

    selectedLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#556ee6',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 6,
    },

    selectedDoctorName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },

    selectedDoctorSpec: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginTop: 4,
    },

    datePickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        padding: 16,
    },

    datePickerText: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
        marginLeft: 12,
        flex: 1,
    },

    textArea: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        padding: 16,
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
        minHeight: 120,
        textAlignVertical: 'top',
    },

    submitBtn: {
        backgroundColor: '#1e293b',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 16,
        marginBottom: 40,
    },

    disabledBtn: {
        backgroundColor: '#cbd5e1',
    },

    submitBtnText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        textTransform: 'uppercase',
    },
});
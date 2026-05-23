import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getConsultations } from '../services/api';

type AppointmentStatus = 'pending' | 'approved' | 'rejected';

interface Consultation {
    id: number;
    patient: number;
    doctor: number;
    patient_name?: string;
    doctor_name?: string;
    doctor_specialization?: string;
    consultation_date: string;
    symptoms: string;
    diagnosis?: string;
    notes?: string;
    appointment_status?: AppointmentStatus;
    rejection_reason?: string;
}

export default function MyAppointmentsScreen({ navigation }: any) {
    const [appointments, setAppointments] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<AppointmentStatus>('pending');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);

            const response = await getConsultations();

            setAppointments(response.data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAppointments();
        setRefreshing(false);
    };

    const getStatus = (appointment: Consultation): AppointmentStatus => {
        return appointment.appointment_status || 'pending';
    };

    const filteredAppointments = appointments.filter(
        (appointment) => getStatus(appointment) === activeTab
    );

    const getStatusStyle = (status: AppointmentStatus) => {
        if (status === 'approved') {
            return {
                bg: '#dcfce7',
                text: '#16a34a',
                icon: 'check-circle',
                label: 'Approved',
            };
        }

        if (status === 'rejected') {
            return {
                bg: '#fee2e2',
                text: '#dc2626',
                icon: 'close-circle',
                label: 'Rejected',
            };
        }

        return {
            bg: '#ffedd5',
            text: '#f97316',
            icon: 'clock-outline',
            label: 'Pending',
        };
    };

    const formatDate = (date: string) => {
        if (!date) return 'No date';

        return new Date(date).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#556ee6" />
                <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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

                <Text style={styles.headerTitle}>My Appointments</Text>

                <View style={{ width: 44 }} />
            </View>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        activeTab === 'pending' && styles.activePendingTab,
                    ]}
                    onPress={() => setActiveTab('pending')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'pending' && styles.activePendingText,
                        ]}
                    >
                        Pending
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        activeTab === 'approved' && styles.activeApprovedTab,
                    ]}
                    onPress={() => setActiveTab('approved')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'approved' && styles.activeApprovedText,
                        ]}
                    >
                        Approved
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabBtn,
                        activeTab === 'rejected' && styles.activeRejectedTab,
                    ]}
                    onPress={() => setActiveTab('rejected')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'rejected' && styles.activeRejectedText,
                        ]}
                    >
                        Rejected
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredAppointments.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <MaterialCommunityIcons
                            name="calendar-blank-outline"
                            size={48}
                            color="#94a3b8"
                        />

                        <Text style={styles.emptyTitle}>
                            No {activeTab} appointments
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Your {activeTab} appointment records will appear here.
                        </Text>
                    </View>
                ) : (
                    filteredAppointments.map((appointment) => {
                        const status = getStatus(appointment);
                        const statusStyle = getStatusStyle(status);

                        return (
                            <View key={appointment.id} style={styles.appointmentCard}>
                                <View style={styles.cardTop}>
                                    <View>
                                        <Text style={styles.dateText}>
                                            {formatDate(appointment.consultation_date)}
                                        </Text>

                                        <Text style={styles.doctorName}>
                                            {appointment.doctor_name || 'Assigned Doctor'}
                                        </Text>

                                        <Text style={styles.specialization}>
                                            {appointment.doctor_specialization || 'General Medicine'}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: statusStyle.bg },
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name={statusStyle.icon as any}
                                            size={14}
                                            color={statusStyle.text}
                                        />

                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: statusStyle.text },
                                            ]}
                                        >
                                            {statusStyle.label}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.infoRow}>
                                    <MaterialCommunityIcons
                                        name="clipboard-text-outline"
                                        size={18}
                                        color="#64748b"
                                    />

                                    <View style={styles.infoContent}>
                                        <Text style={styles.infoLabel}>Symptoms</Text>
                                        <Text style={styles.infoValue}>
                                            {appointment.symptoms || 'No symptoms provided.'}
                                        </Text>
                                    </View>
                                </View>

                                {status === 'rejected' && (
                                    <View style={styles.rejectionBox}>
                                        <View style={styles.infoRow}>
                                            <MaterialCommunityIcons
                                                name="alert-circle-outline"
                                                size={18}
                                                color="#dc2626"
                                            />

                                            <View style={styles.infoContent}>
                                                <Text style={styles.rejectionLabel}>
                                                    Rejection Reason
                                                </Text>

                                                <Text style={styles.rejectionText}>
                                                    {appointment.rejection_reason ||
                                                        'No reason provided.'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {status === 'approved' && (
                                    <View style={styles.approvedBox}>
                                        <MaterialCommunityIcons
                                            name="check-decagram"
                                            size={18}
                                            color="#16a34a"
                                        />

                                        <Text style={styles.approvedText}>
                                            Your appointment has been approved. Please be
                                            available on your scheduled date.
                                        </Text>
                                    </View>
                                )}

                                {status === 'pending' && (
                                    <View style={styles.pendingBox}>
                                        <MaterialCommunityIcons
                                            name="timer-sand"
                                            size={18}
                                            color="#f97316"
                                        />

                                        <Text style={styles.pendingText}>
                                            Waiting for doctor approval.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
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

    tabsContainer: {
        flexDirection: 'row',
        margin: 20,
        backgroundColor: '#e2e8f0',
        padding: 4,
        borderRadius: 16,
    },

    tabBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },

    tabText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    activePendingTab: {
        backgroundColor: '#fff7ed',
    },

    activePendingText: {
        color: '#f97316',
    },

    activeApprovedTab: {
        backgroundColor: '#dcfce7',
    },

    activeApprovedText: {
        color: '#16a34a',
    },

    activeRejectedTab: {
        backgroundColor: '#fee2e2',
    },

    activeRejectedText: {
        color: '#dc2626',
    },

    scrollView: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    emptyBox: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 20,
    },

    emptyTitle: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
        textTransform: 'capitalize',
    },

    emptySubtitle: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 18,
    },

    appointmentCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },

    dateText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#556ee6',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },

    doctorName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1e293b',
    },

    specialization: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        marginTop: 4,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        gap: 4,
    },

    statusText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },

    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 16,
    },

    infoRow: {
        flexDirection: 'row',
        gap: 10,
    },

    infoContent: {
        flex: 1,
    },

    infoLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },

    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
        lineHeight: 20,
    },

    rejectionBox: {
        marginTop: 14,
        backgroundColor: '#fef2f2',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#fecaca',
    },

    rejectionLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#dc2626',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },

    rejectionText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#991b1b',
        lineHeight: 20,
    },

    approvedBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        backgroundColor: '#f0fdf4',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },

    approvedText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: '#15803d',
        lineHeight: 18,
    },

    pendingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 14,
        backgroundColor: '#fff7ed',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#fed7aa',
    },

    pendingText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: '#c2410c',
        lineHeight: 18,
    },
});
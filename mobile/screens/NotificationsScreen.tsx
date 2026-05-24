import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNotifications } from '../services/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type?: string;
    related_id?: number;
    is_read?: boolean;
    created_at?: string;
}

export default function NotificationsScreen({ navigation }: any) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await getNotifications();

            setNotifications(response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNotifications();
        setRefreshing(false);
    };

    const getNotificationStyle = (notification: Notification) => {
        const title = notification.title?.toLowerCase() || '';
        const message = notification.message?.toLowerCase() || '';

        if (title.includes('approved') || message.includes('approved')) {
            return {
                icon: 'check-circle',
                iconColor: '#16a34a',
                bgColor: '#dcfce7',
                borderColor: '#bbf7d0',
                label: 'Approved Appointment',
            };
        }

        if (title.includes('rejected') || message.includes('rejected')) {
            return {
                icon: 'close-circle',
                iconColor: '#dc2626',
                bgColor: '#fee2e2',
                borderColor: '#fecaca',
                label: 'Rejected Appointment',
            };
        }

        return {
            icon: 'bell-outline',
            iconColor: '#556ee6',
            bgColor: '#eef2ff',
            borderColor: '#c7d2fe',
            label: 'Notification',
        };
    };

    const formatDate = (date?: string) => {
        if (!date) return '';

        return new Date(date).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#556ee6" />

                <Text style={styles.loadingText}>
                    Loading notifications...
                </Text>
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

                <Text style={styles.headerTitle}>Notifications</Text>

                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {notifications.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <MaterialCommunityIcons
                            name="bell-off-outline"
                            size={50}
                            color="#94a3b8"
                        />

                        <Text style={styles.emptyTitle}>
                            No Notifications Yet
                        </Text>

                        <Text style={styles.emptySubtitle}>
                            Appointment updates from your doctor will appear here.
                        </Text>
                    </View>
                ) : (
                    notifications.map((notification) => {
                        const notifStyle = getNotificationStyle(notification);

                        return (
                            <View
                                key={notification.id}
                                style={[
                                    styles.notificationCard,
                                    {
                                        borderColor: notifStyle.borderColor,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.iconBox,
                                        {
                                            backgroundColor: notifStyle.bgColor,
                                        },
                                    ]}
                                >
                                    <MaterialCommunityIcons
                                        name={notifStyle.icon as any}
                                        size={26}
                                        color={notifStyle.iconColor}
                                    />
                                </View>

                                <View style={styles.notificationContent}>
                                    <View style={styles.notificationTop}>
                                        <Text style={styles.notificationLabel}>
                                            {notifStyle.label}
                                        </Text>

                                        {!notification.is_read && (
                                            <View style={styles.unreadDot} />
                                        )}
                                    </View>

                                    <Text style={styles.notificationTitle}>
                                        {notification.title}
                                    </Text>

                                    <Text style={styles.notificationMessage}>
                                        {notification.message}
                                    </Text>

                                    {notification.created_at && (
                                        <Text style={styles.notificationDate}>
                                            {formatDate(notification.created_at)}
                                        </Text>
                                    )}
                                </View>
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

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 50,
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
    },

    emptySubtitle: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 18,
    },

    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    notificationContent: {
        flex: 1,
    },

    notificationTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },

    notificationLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 99,
        backgroundColor: '#ef4444',
    },

    notificationTitle: {
        fontSize: 15,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 6,
    },

    notificationMessage: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        lineHeight: 18,
    },

    notificationDate: {
        marginTop: 10,
        fontSize: 10,
        fontWeight: '800',
        color: '#94a3b8',
    },
});
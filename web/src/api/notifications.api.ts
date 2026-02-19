import { apiClient } from './client';

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
}

/**
 * Fetch notifications for the current user
 */
export async function fetchNotifications(): Promise<Notification[]> {
    try {
        const response = await apiClient.get<Notification[]>('/api/notifications');
        return response.data;
    } catch (error) {
        console.warn('Notifications unavailable (backend unreachable)');
        return [];
    }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
    try {
        await apiClient.put(`/api/notifications/${notificationId}/read`);
    } catch (error) {
        console.warn('Could not mark notification as read');
    }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<void> {
    try {
        await apiClient.put('/api/notifications/read-all');
    } catch (error) {
        console.warn('Could not mark all notifications as read');
    }
}

/**
 * Get unread notification count
 */
export async function fetchUnreadCount(): Promise<number> {
    try {
        const response = await apiClient.get<{ count: number }>('/api/notifications/unread-count');
        return response.data.count;
    } catch (error) {
        return 0;
    }
}

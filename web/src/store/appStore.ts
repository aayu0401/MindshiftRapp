import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'school' | 'parent';
    avatar?: string;
    grade?: string;
    className?: string;
    schoolName?: string;
}

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
}

interface AppState {
    // User & Auth
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;

    // UI State
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    loading: boolean;

    // Notifications
    notifications: Notification[];
    unreadCount: number;

    // Real-time Data
    onlineUsers: string[];
    liveUpdates: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setLoading: (loading: boolean) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationRead: (id: string) => void;
    clearNotifications: () => void;
    setOnlineUsers: (users: string[]) => void;
    toggleLiveUpdates: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            user: null,
            isAuthenticated: false,
            token: null,
            theme: 'dark',
            sidebarOpen: true,
            loading: false,
            notifications: [],
            unreadCount: 0,
            onlineUsers: [],
            liveUpdates: true,

            // Actions
            setUser: (user) => set({ user, isAuthenticated: !!user }),

            setToken: (token) => set({ token }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                token: null,
                notifications: [],
                unreadCount: 0,
            }),

            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),

            toggleSidebar: () => set((state) => ({
                sidebarOpen: !state.sidebarOpen
            })),

            setLoading: (loading) => set({ loading }),

            addNotification: (notification) => {
                const newNotification: Notification = {
                    ...notification,
                    id: `notif-${Date.now()}-${Math.random()}`,
                    timestamp: new Date(),
                    read: false,
                };

                set((state) => ({
                    notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            })),

            clearNotifications: () => set({
                notifications: [],
                unreadCount: 0,
            }),

            setOnlineUsers: (users) => set({ onlineUsers: users }),

            toggleLiveUpdates: () => set((state) => ({
                liveUpdates: !state.liveUpdates
            })),
        }),
        {
            name: 'mindshiftr-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                theme: state.theme,
                sidebarOpen: state.sidebarOpen,
                liveUpdates: state.liveUpdates,
            }),
        }
    )
);

// Selectors for optimized re-renders
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadCount = () => useAppStore((state) => state.unreadCount);
export const useLoading = () => useAppStore((state) => state.loading);

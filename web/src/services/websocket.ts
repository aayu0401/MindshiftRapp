import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect() {
        const token = useAppStore.getState().token;

        if (!token) {
            console.warn('No token available for WebSocket connection');
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: {
                token,
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
        });

        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
            this.reconnectAttempts = 0;
            useAppStore.getState().addNotification({
                type: 'success',
                title: 'Connected',
                message: 'Real-time updates enabled',
            });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ WebSocket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                this.socket?.connect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                toast.error('Unable to connect to real-time services');
            }
        });

        // Real-time data events
        this.socket.on('notification', (data: any) => {
            useAppStore.getState().addNotification({
                type: data.type || 'info',
                title: data.title,
                message: data.message,
                actionUrl: data.actionUrl,
            });

            // Show toast for important notifications
            if (data.type === 'warning' || data.type === 'error') {
                toast[data.type](data.message);
            }
        });

        this.socket.on('user:online', (users: string[]) => {
            useAppStore.getState().setOnlineUsers(users);
        });

        this.socket.on('analytics:update', (data: any) => {
            // Emit custom event for components to listen
            window.dispatchEvent(new CustomEvent('analytics:update', { detail: data }));
        });

        this.socket.on('story:progress', (data: any) => {
            window.dispatchEvent(new CustomEvent('story:progress', { detail: data }));
        });

        this.socket.on('assessment:complete', (data: any) => {
            window.dispatchEvent(new CustomEvent('assessment:complete', { detail: data }));

            useAppStore.getState().addNotification({
                type: 'success',
                title: 'Assessment Complete',
                message: `${data.studentName} completed ${data.assessmentName}`,
                actionUrl: `/assessment/${data.assessmentId}/results`,
            });
        });

        this.socket.on('alert:risk', (data: any) => {
            window.dispatchEvent(new CustomEvent('alert:risk', { detail: data }));

            useAppStore.getState().addNotification({
                type: 'warning',
                title: 'Student Alert',
                message: data.message,
                actionUrl: data.actionUrl,
            });

            toast.error(data.message, {
                duration: 10000,
                icon: '⚠️',
            });
        });
    }

    // Emit events
    emit(event: string, data: any) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit event:', event);
        }
    }

    // Subscribe to custom events
    on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    // Unsubscribe from events
    off(event: string, callback?: (data: any) => void) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    // Disconnect
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('WebSocket disconnected manually');
        }
    }

    // Check connection status
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Room management
    joinRoom(room: string) {
        this.emit('room:join', { room });
    }

    leaveRoom(room: string) {
        this.emit('room:leave', { room });
    }

    // Specific feature methods
    trackActivity(activity: { type: string; data: any }) {
        this.emit('activity:track', activity);
    }

    sendMessage(message: { to: string; content: string }) {
        this.emit('message:send', message);
    }

    updateProgress(progress: { storyId: string; progress: number }) {
        this.emit('progress:update', progress);
    }
}

// Create singleton instance
export const wsService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = () => {
    return {
        connect: () => wsService.connect(),
        disconnect: () => wsService.disconnect(),
        emit: (event: string, data: any) => wsService.emit(event, data),
        on: (event: string, callback: (data: any) => void) => wsService.on(event, callback),
        off: (event: string, callback?: (data: any) => void) => wsService.off(event, callback),
        isConnected: () => wsService.isConnected(),
        joinRoom: (room: string) => wsService.joinRoom(room),
        leaveRoom: (room: string) => wsService.leaveRoom(room),
        trackActivity: (activity: { type: string; data: any }) => wsService.trackActivity(activity),
        sendMessage: (message: { to: string; content: string }) => wsService.sendMessage(message),
        updateProgress: (progress: { storyId: string; progress: number }) => wsService.updateProgress(progress),
    };
};

export default wsService;

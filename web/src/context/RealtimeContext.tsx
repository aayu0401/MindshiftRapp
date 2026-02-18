import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

interface RealtimeContextType {
    socket: Socket | null;
    isConnected: boolean;
    onlineCounts: { total: number; teachers: number; students: number };
}

const RealtimeContext = createContext<RealtimeContextType>({
    socket: null,
    isConnected: false,
    onlineCounts: { total: 0, teachers: 0, students: 0 }
});

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineCounts, setOnlineCounts] = useState({ total: 0, teachers: 0, students: 0 });
    const { user } = useAuth();

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            if (user) {
                newSocket.emit('identify', {
                    userId: user.id,
                    name: user.name,
                    role: user.role
                });
            }
        });

        newSocket.on('presence-update', (counts) => {
            setOnlineCounts(counts);
        });

        newSocket.on('disconnect', () => setIsConnected(false));

        setSocket(newSocket);
        return () => { newSocket.close(); };
    }, [user]);

    return (
        <RealtimeContext.Provider value={{ socket, isConnected, onlineCounts }}>
            {children}
        </RealtimeContext.Provider>
    );
};

export const useRealtime = () => useContext(RealtimeContext);

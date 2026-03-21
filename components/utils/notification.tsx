import React, { useState, useEffect, useCallback } from 'react';

interface NotificationItem {
    id: number;
    title: string;
    body: string;
    exiting: boolean;
}

let notificationCounter = 0;
let globalAddNotification: ((title: string, body: string) => void) | null = null;

export function showNotification(title: string, body: string) {
    if (globalAddNotification) {
        globalAddNotification(title, body);
    }
}

export default function NotificationContainer() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const addNotification = useCallback((title: string, body: string) => {
        const id = ++notificationCounter;
        setNotifications(prev => [...prev, { id, title, body, exiting: false }]);
        setTimeout(() => {
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, exiting: true } : n)
            );
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 220);
        }, 4000);
    }, []);

    useEffect(() => {
        globalAddNotification = addNotification;
        return () => { globalAddNotification = null; };
    }, [addNotification]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-10 right-3 z-50 flex flex-col gap-2 pointer-events-none">
            {notifications.map(n => (
                <div
                    key={n.id}
                    className={
                        (n.exiting ? 'notification-exit' : 'notification-enter') +
                        ' pointer-events-auto bg-ub-surface border-l-2 border-ub-orange rounded-xl shadow-2xl w-72 overflow-hidden'
                    }
                >
                    <div className="px-4 py-3">
                        <div className="text-white text-sm font-semibold leading-tight">{n.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5 leading-snug">{n.body}</div>
                    </div>
                    <div className="h-0.5 bg-white bg-opacity-5">
                        <div className="h-full bg-ub-orange notification-progress" />
                    </div>
                </div>
            ))}
        </div>
    );
}

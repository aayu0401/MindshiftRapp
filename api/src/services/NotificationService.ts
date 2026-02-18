
import { prisma } from '../prismaClient';

export class NotificationService {
    async createNotification(userId: string, type: string, title: string, message: string, data?: any) {
        return prisma.notification.create({
            data: {
                userId,
                type: type as any,
                title,
                message,
                data
            }
        });
    }

    async getNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    async markAsRead(notificationId: string) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }
}

export const notificationService = new NotificationService();

import { apiClient } from './client';

export interface Invitation {
    email: string;
    name?: string;
    role: string;
}

export interface InvitationResult {
    email: string;
    status: 'invited' | 'already_exists' | 'error';
    message: string;
    userId?: string;
    inviteUrl?: string;
}

export interface InvitationResponse {
    total: number;
    successful: number;
    existing: number;
    failed: number;
    results: InvitationResult[];
}

export interface InvitedUser {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

/**
 * Send invitations (for School Admin)
 */
export async function sendInvitations(invites: Invitation[]): Promise<InvitationResponse> {
    try {
        const response = await apiClient.post<InvitationResponse>('/api/invitations', { invites });
        return response.data;
    } catch (error: any) {
        console.warn('Invitation service unavailable');
        // Demo fallback
        return {
            total: invites.length,
            successful: invites.length,
            existing: 0,
            failed: 0,
            results: invites.map(inv => ({
                email: inv.email,
                status: 'invited' as const,
                message: `Invitation created for ${inv.email} (demo mode)`,
            })),
        };
    }
}

/**
 * List all invited users for the current admin
 */
export async function fetchInvitedUsers(): Promise<InvitedUser[]> {
    try {
        const response = await apiClient.get<InvitedUser[]>('/api/invitations');
        return response.data;
    } catch (error) {
        return [];
    }
}

/**
 * Remove an invited user
 */
export async function removeInvitedUser(userId: string): Promise<void> {
    try {
        await apiClient.delete(`/api/invitations/${userId}`);
    } catch (error) {
        console.warn('Could not remove invitation');
    }
}

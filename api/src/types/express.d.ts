import 'express';

declare module 'express' {
    export interface Request {
        user?: {
            sub: string;
            email: string;
            name?: string;
            role: string;
            id?: string;
            schoolId?: string;
        } | any;
    }
}

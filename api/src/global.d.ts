import 'express';

declare global {
    namespace Express {
        interface Request {
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
}

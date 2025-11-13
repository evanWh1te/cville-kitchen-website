/*
 * Charlottesville Kitchen - Mutual Aid Organization Website
 * Copyright (C) 2025 Evan White
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const debug = process.env.DEBUG_COOKIES === 'true';
    try {
        const cookieToken = req.cookies?.token;
        const authHeader = req.header('Authorization');

        let headerToken: string | undefined;
        if (authHeader) {
            const parts = authHeader.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                headerToken = parts[1];
            } else if (parts.length === 1 && authHeader.startsWith('Bearer ')) {
                // Fallback replace pattern (unlikely path)
                headerToken = authHeader.replace('Bearer ', '');
            } else if (authHeader.startsWith('Bearer')) {
                // Malformed Authorization header
                if (debug) {
                    console.warn(
                        '[auth] Malformed Authorization header received:',
                        authHeader
                    );
                }
                res.status(400).json({
                    error: 'Access denied. Invalid Authorization header format.'
                });
                return;
            }
        }

        const token = cookieToken || headerToken;

        if (!token) {
            if (debug) {
                console.warn(
                    '[auth] No token provided. Cookie header:',
                    req.headers['cookie']
                );
            }
            res.status(401).json({
                error: 'Access denied. No token provided.'
            });
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error(
                '[auth] JWT_SECRET is not defined in environment variables'
            );
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch (err: any) {
            if (debug) {
                console.warn(
                    '[auth] jwt.verify failed:',
                    err?.name,
                    err?.message
                );
            }
            if (err?.name === 'TokenExpiredError') {
                res.status(401).json({
                    error: 'Invalid token. Token expired.'
                });
            } else if (err?.name === 'JsonWebTokenError') {
                res.status(401).json({
                    error: 'Invalid token. Signature/format error.'
                });
            } else {
                res.status(401).json({ error: 'Invalid token.' });
            }
            return;
        }

        if (!decoded?.userId) {
            if (debug) {
                console.warn('[auth] Decoded token missing userId:', decoded);
            }
            res.status(401).json({ error: 'Invalid token payload.' });
            return;
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            if (debug) {
                console.warn(
                    '[auth] User not found for token userId:',
                    decoded.userId
                );
            }
            res.status(401).json({ error: 'Invalid token. User not found.' });
            return;
        }

        req.user = user;
        if (debug) {
            console.log('[auth] Authenticated user:', {
                id: user.id,
                email: user.email,
                role: user.role
            });
        }
        next();
    } catch (error) {
        console.error('[auth] Unexpected authentication error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            error: 'Access denied. Authentication required.'
        });
        return;
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR') {
        res.status(403).json({
            error: 'Access denied. Admin privileges required.'
        });
        return;
    }

    next();
};

// Admin-only (exclude moderators)
export const requireAdminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        res.status(401).json({
            error: 'Access denied. Authentication required.'
        });
        return;
    }
    if (req.user.role !== 'ADMIN') {
        res.status(403).json({
            error: 'Access denied. ADMIN role required.'
        });
        return;
    }
    next();
};

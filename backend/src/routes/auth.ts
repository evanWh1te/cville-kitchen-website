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

import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

// Centralized cookie options used for auth cookies
const isProd = process.env.NODE_ENV === 'production';
const insecureOverride = process.env.COOKIE_INSECURE === 'true';
const authCookieOptions = {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: isProd && !insecureOverride,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

const router = express.Router();
const prisma = new PrismaClient();

// Login endpoint
router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    error: 'Invalid input',
                    details: errors.array()
                });
                return;
            }

            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            // Check password
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }

            // Generate JWT
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                console.error('JWT_SECRET is not defined');
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Set HTTP-only cookie (domain omitted to let browser infer current host)
            res.cookie('token', token, authCookieOptions);

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Logout endpoint
router.post('/logout', (req, res) => {
    // Clear cookie with same options to ensure deletion
    res.clearCookie('token', { ...authCookieOptions, maxAge: 0 });
    res.json({ message: 'Logout successful' });
});

// Get current user endpoint
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
    res.json({
        user: req.user
    });
});

// Create initial admin user (only if no users exist)
router.post(
    '/create-admin',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 })
    ],
    async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    error: 'Invalid input',
                    details: errors.array()
                });
                return;
            }

            // Check if any users already exist
            const userCount = await prisma.user.count();
            if (userCount > 0) {
                res.status(403).json({
                    error: 'Admin user already exists. Use the login endpoint.'
                });
                return;
            }

            const { email, password } = req.body;

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create admin user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: 'ADMIN'
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            });

            res.status(201).json({
                message: 'Admin user created successfully',
                user
            });
        } catch (error) {
            console.error('Create admin error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;

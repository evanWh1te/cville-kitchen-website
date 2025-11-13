/*
 * Charlottesville Kitchen - User Management Routes
 */
import express, { Request, Response } from 'express';
import { PrismaClient, Role, AuditAction } from '@prisma/client';
import { body, param, query, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import {
    authenticateToken,
    requireAdminOnly,
    AuthRequest
} from '../middleware/auth';

const prisma = new PrismaClient();
const router = express.Router();

// Helper to sanitize user objects
function sanitizeUser(user: {
    id: string;
    email: string;
    role: Role;
    createdAt?: Date;
    updatedAt?: Date;
}) {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

// GET /api/users  - list users with pagination & optional search
router.get(
    '/',
    authenticateToken,
    requireAdminOnly,
    [
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('pageSize').optional().isInt({ min: 1, max: 200 }).toInt(),
        query('search').optional().isString().trim()
    ],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid query parameters',
                details: errors.array()
            });
            return;
        }

        const page = (req.query.page as any) || 1;
        const pageSize = (req.query.pageSize as any) || 50;
        const search = (req.query.search as string) || '';

        const where = search
            ? {
                  OR: [{ email: { contains: search, mode: 'insensitive' } }]
              }
            : {};

        try {
            const [total, users] = await Promise.all([
                prisma.user.count({ where }),
                prisma.user.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                })
            ]);

            res.json({
                users: users.map(sanitizeUser),
                total,
                page,
                pageSize
            });
        } catch (err) {
            console.error('List users error:', err);
            res.status(500).json({ error: 'Failed to list users' });
        }
    }
);

// GET /api/users/:id - fetch single user
router.get(
    '/:id',
    authenticateToken,
    requireAdminOnly,
    [param('id').isString().trim()],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid id parameter',
                details: errors.array()
            });
            return;
        }
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.params.id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ user: sanitizeUser(user) });
        } catch (err) {
            console.error('Get user error:', err);
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    }
);

// POST /api/users - create user
router.post(
    '/',
    authenticateToken,
    requireAdminOnly,
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }),
        body('role').optional().isIn(['ADMIN', 'MODERATOR'])
    ],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid input',
                details: errors.array()
            });
            return;
        }
        try {
            const { email, password, role } = req.body;
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                res.status(409).json({ error: 'Email already in use' });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: (role as Role) || 'MODERATOR'
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            // Audit
            await prisma.userAudit.create({
                data: {
                    userId: newUser.id,
                    actorId: req.user?.id || null,
                    action: 'CREATE' as AuditAction,
                    details: JSON.stringify({
                        email: newUser.email,
                        role: newUser.role
                    })
                }
            });
            res.status(201).json({
                message: 'User created',
                user: sanitizeUser(newUser)
            });
        } catch (err) {
            console.error('Create user error:', err);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }
);

// PUT /api/users/:id - update user (email, role, password)
router.put(
    '/:id',
    authenticateToken,
    requireAdminOnly,
    [
        param('id').isString().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        body('password').optional().isLength({ min: 8 }),
        body('role').optional().isIn(['ADMIN', 'MODERATOR'])
    ],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid input',
                details: errors.array()
            });
            return;
        }
        try {
            const { email, password, role } = req.body;
            const updateData: any = {};
            if (email) {
                const existing = await prisma.user.findUnique({
                    where: { email }
                });
                if (existing && existing.id !== req.params.id) {
                    res.status(409).json({
                        error: 'Email already in use by another user'
                    });
                    return;
                }
                updateData.email = email;
            }
            if (role) updateData.role = role as Role;
            if (password) updateData.password = await bcrypt.hash(password, 12);

            const updated = await prisma.user.update({
                where: { id: req.params.id },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            // Build changed fields list (excluding password content)
            const changed: string[] = Object.keys(updateData).filter(
                (k) => k !== 'password'
            );
            await prisma.userAudit.create({
                data: {
                    userId: updated.id,
                    actorId: req.user?.id || null,
                    action: 'UPDATE' as AuditAction,
                    details: JSON.stringify({ fields: changed })
                }
            });
            res.json({ message: 'User updated', user: sanitizeUser(updated) });
        } catch (err: any) {
            if (err?.code === 'P2025') {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            console.error('Update user error:', err);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }
);

// DELETE /api/users/:id - delete user (prevent deleting self optional?)
router.delete(
    '/:id',
    authenticateToken,
    requireAdminOnly,
    [param('id').isString().trim()],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid id parameter',
                details: errors.array()
            });
            return;
        }
        try {
            // Prevent deleting the last admin user for safety
            const target = await prisma.user.findUnique({
                where: { id: req.params.id }
            });
            if (!target) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            if (target.role === 'ADMIN') {
                const adminCount = await prisma.user.count({
                    where: { role: 'ADMIN' }
                });
                if (adminCount <= 1) {
                    res.status(400).json({
                        error: 'Cannot delete the last ADMIN user'
                    });
                    return;
                }
            }
            await prisma.user.delete({ where: { id: req.params.id } });
            await prisma.userAudit.create({
                data: {
                    userId: req.params.id,
                    actorId: req.user?.id || null,
                    action: 'DELETE' as AuditAction
                }
            });
            res.json({ message: 'User deleted' });
        } catch (err) {
            console.error('Delete user error:', err);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
);

export default router;

// POST /api/users/:id/reset-password - admin resets a user's password
router.post(
    '/:id/reset-password',
    authenticateToken,
    requireAdminOnly,
    [param('id').isString().trim(), body('password').isLength({ min: 8 })],
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                error: 'Invalid input',
                details: errors.array()
            });
            return;
        }
        try {
            const target = await prisma.user.findUnique({
                where: { id: req.params.id }
            });
            if (!target) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const hashed = await bcrypt.hash(req.body.password, 12);
            await prisma.user.update({
                where: { id: req.params.id },
                data: { password: hashed }
            });
            await prisma.userAudit.create({
                data: {
                    userId: req.params.id,
                    actorId: req.user?.id || null,
                    action: 'RESET_PASSWORD' as AuditAction
                }
            });
            res.json({ message: 'Password reset successfully' });
        } catch (err) {
            console.error('Reset password error:', err);
            res.status(500).json({ error: 'Failed to reset password' });
        }
    }
);

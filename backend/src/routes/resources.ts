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
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import {
    authenticateToken,
    requireAdmin,
    AuthRequest
} from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all resources (public endpoint)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const resources = await prisma.resource.findMany({
            where: { isActive: true },
            orderBy: [{ category: 'asc' }, { title: 'asc' }]
        });

        res.json({ resources });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get resources by category (public endpoint)
router.get(
    '/category/:category',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { category } = req.params;

            const resources = await prisma.resource.findMany({
                where: {
                    category: category.toUpperCase() as any,
                    isActive: true
                },
                orderBy: [{ title: 'asc' }]
            });

            res.json({ resources });
        } catch (error) {
            console.error('Error fetching resources by category:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Admin endpoints below - require authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get all resources (admin - includes inactive)
router.get('/admin', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const resources = await prisma.resource.findMany({
            orderBy: [{ category: 'asc' }, { title: 'asc' }]
        });

        res.json({ resources });
    } catch (error) {
        console.error('Error fetching all resources:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single resource
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const resource = await prisma.resource.findUnique({
            where: { id }
        });

        if (!resource) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }

        res.json({ resource });
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new resource
router.post(
    '/',
    [
        body('title').notEmpty().trim(),
        body('category').isIn([
            'PUBLIC_MEALS',
            'FREE_FRIDGES_PANTRIES',
            'EMERGENCY_FOOD',
            'STUDENT_MEALS',
            'CHURCH_PANTRIES',
            'FOOD_DELIVERY',
            'LOCAL_EFFORTS',
            'ADDITIONAL_RESOURCES'
        ]),
        body('type')
            .isIn([
                'BREAKFAST',
                'LUNCH',
                'DINNER',
                'PANTRY',
                'DELIVERY',
                'MARKET',
                'PROGRAM',
                'OTHER'
            ])
            .custom((value, { req }) => {
                const category = req.body.category;
                const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

                // If it's a meal type, it must be PUBLIC_MEALS category
                if (mealTypes.includes(value) && category !== 'PUBLIC_MEALS') {
                    throw new Error(
                        'Meal types (BREAKFAST, LUNCH, DINNER) can only be used with PUBLIC_MEALS category'
                    );
                }

                return true;
            }),
        body('description').optional().trim(),
        body('location').optional().trim(),
        body('address').optional().trim(),
        body('phone').optional().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        body('website').optional().isURL(),
        body('hours').optional().trim(),
        body('notes').optional().trim(),
        body('requirements').optional().trim(),
        body('contactInfo').optional().trim(),
        body('isActive').optional().isBoolean()
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    error: 'Invalid input',
                    details: errors.array()
                });
                return;
            }

            const resource = await prisma.resource.create({
                data: {
                    ...req.body,
                    lastUpdated: new Date()
                }
            });

            res.status(201).json({
                message: 'Resource created successfully',
                resource
            });
        } catch (error) {
            console.error('Error creating resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Update resource
router.put(
    '/:id',
    [
        body('title').optional().notEmpty().trim(),
        body('category')
            .optional()
            .isIn([
                'PUBLIC_MEALS',
                'FREE_FRIDGES_PANTRIES',
                'EMERGENCY_FOOD',
                'STUDENT_MEALS',
                'CHURCH_PANTRIES',
                'FOOD_DELIVERY',
                'LOCAL_EFFORTS',
                'ADDITIONAL_RESOURCES'
            ]),
        body('type')
            .optional()
            .isIn([
                'BREAKFAST',
                'LUNCH',
                'DINNER',
                'PANTRY',
                'DELIVERY',
                'MARKET',
                'PROGRAM',
                'OTHER'
            ])
            .custom(async (value, { req }) => {
                if (!value) return true; // Skip if no type provided

                const { id } = req.params!;
                const category = req.body.category;
                const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

                // Get current resource to check category if not provided in update
                let currentCategory = category;
                if (!currentCategory) {
                    const { PrismaClient } = await import('@prisma/client');
                    const prisma = new PrismaClient();
                    const resource = await prisma.resource.findUnique({
                        where: { id }
                    });
                    currentCategory = resource?.category;
                    await prisma.$disconnect();
                }

                // If it's a meal type, it must be PUBLIC_MEALS category
                if (
                    mealTypes.includes(value) &&
                    currentCategory !== 'PUBLIC_MEALS'
                ) {
                    throw new Error(
                        'Meal types (BREAKFAST, LUNCH, DINNER) can only be used with PUBLIC_MEALS category'
                    );
                }

                return true;
            }),
        body('description').optional().trim(),
        body('location').optional().trim(),
        body('address').optional().trim(),
        body('phone').optional().trim(),
        body('email').optional().isEmail().normalizeEmail(),
        body('website').optional().isURL(),
        body('hours').optional().trim(),
        body('notes').optional().trim(),
        body('requirements').optional().trim(),
        body('contactInfo').optional().trim(),
        body('isActive').optional().isBoolean()
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    error: 'Invalid input',
                    details: errors.array()
                });
                return;
            }

            const { id } = req.params;

            // Check if resource exists
            const existingResource = await prisma.resource.findUnique({
                where: { id }
            });

            if (!existingResource) {
                res.status(404).json({ error: 'Resource not found' });
                return;
            }

            const resource = await prisma.resource.update({
                where: { id },
                data: {
                    ...req.body,
                    lastUpdated: new Date()
                }
            });

            res.json({
                message: 'Resource updated successfully',
                resource
            });
        } catch (error) {
            console.error('Error updating resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Delete resource
router.delete(
    '/:id',
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Check if resource exists
            const existingResource = await prisma.resource.findUnique({
                where: { id }
            });

            if (!existingResource) {
                res.status(404).json({ error: 'Resource not found' });
                return;
            }

            await prisma.resource.delete({
                where: { id }
            });

            res.json({ message: 'Resource deleted successfully' });
        } catch (error) {
            console.error('Error deleting resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;

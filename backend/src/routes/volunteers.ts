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

// Get all volunteer opportunities (public endpoint)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const volunteers = await prisma.volunteerOpportunity.findMany({
            where: { isActive: true },
            orderBy: [{ category: 'asc' }, { title: 'asc' }]
        });

        res.json({ volunteers });
    } catch (error) {
        console.error('Error fetching volunteer opportunities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get volunteer opportunities by category (public endpoint)
router.get(
    '/category/:category',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { category } = req.params;

            const volunteers = await prisma.volunteerOpportunity.findMany({
                where: {
                    category: category.toUpperCase() as any,
                    isActive: true
                },
                orderBy: [{ title: 'asc' }]
            });

            res.json({ volunteers });
        } catch (error) {
            console.error(
                'Error fetching volunteer opportunities by category:',
                error
            );
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Admin endpoints below - require authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get all volunteer opportunities (admin - includes inactive)
router.get('/admin', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const volunteers = await prisma.volunteerOpportunity.findMany({
            orderBy: [{ category: 'asc' }, { title: 'asc' }]
        });

        res.json({ volunteers });
    } catch (error) {
        console.error('Error fetching all volunteer opportunities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single volunteer opportunity
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const volunteer = await prisma.volunteerOpportunity.findUnique({
            where: { id }
        });

        if (!volunteer) {
            res.status(404).json({ error: 'Volunteer opportunity not found' });
            return;
        }

        res.json({ volunteer });
    } catch (error) {
        console.error('Error fetching volunteer opportunity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new volunteer opportunity
router.post(
    '/',
    [
        body('title').notEmpty().trim(),
        body('category').isIn([
            'FOOD_PREPARATION',
            'FOOD_DISTRIBUTION',
            'COMMUNITY_GARDENS',
            'ADMINISTRATIVE',
            'FUNDRAISING',
            'OUTREACH',
            'EDUCATION',
            'TRANSPORTATION',
            'EVENT_COORDINATION',
            'OTHER'
        ]),
        body('type').isIn([
            'ONE_TIME',
            'RECURRING',
            'SEASONAL',
            'FLEXIBLE',
            'REMOTE',
            'ON_SITE',
            'LEADERSHIP',
            'TRAINING_PROVIDED'
        ]),
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
        body('timeCommitment').optional().trim(),
        body('skills').optional().trim(),
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

            const volunteer = await prisma.volunteerOpportunity.create({
                data: {
                    ...req.body,
                    lastUpdated: new Date()
                }
            });

            res.status(201).json({
                message: 'Volunteer opportunity created successfully',
                volunteer
            });
        } catch (error) {
            console.error('Error creating volunteer opportunity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Update volunteer opportunity
router.put(
    '/:id',
    [
        body('title').optional().notEmpty().trim(),
        body('category')
            .optional()
            .isIn([
                'FOOD_PREPARATION',
                'FOOD_DISTRIBUTION',
                'COMMUNITY_GARDENS',
                'ADMINISTRATIVE',
                'FUNDRAISING',
                'OUTREACH',
                'EDUCATION',
                'TRANSPORTATION',
                'EVENT_COORDINATION',
                'OTHER'
            ]),
        body('type')
            .optional()
            .isIn([
                'ONE_TIME',
                'RECURRING',
                'SEASONAL',
                'FLEXIBLE',
                'REMOTE',
                'ON_SITE',
                'LEADERSHIP',
                'TRAINING_PROVIDED'
            ]),
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
        body('timeCommitment').optional().trim(),
        body('skills').optional().trim(),
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

            // Check if volunteer opportunity exists
            const existingVolunteer =
                await prisma.volunteerOpportunity.findUnique({
                    where: { id }
                });

            if (!existingVolunteer) {
                res.status(404).json({
                    error: 'Volunteer opportunity not found'
                });
                return;
            }

            const volunteer = await prisma.volunteerOpportunity.update({
                where: { id },
                data: {
                    ...req.body,
                    lastUpdated: new Date()
                }
            });

            res.json({
                message: 'Volunteer opportunity updated successfully',
                volunteer
            });
        } catch (error) {
            console.error('Error updating volunteer opportunity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

// Delete volunteer opportunity
router.delete(
    '/:id',
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // Check if volunteer opportunity exists
            const existingVolunteer =
                await prisma.volunteerOpportunity.findUnique({
                    where: { id }
                });

            if (!existingVolunteer) {
                res.status(404).json({
                    error: 'Volunteer opportunity not found'
                });
                return;
            }

            await prisma.volunteerOpportunity.delete({
                where: { id }
            });

            res.json({ message: 'Volunteer opportunity deleted successfully' });
        } catch (error) {
            console.error('Error deleting volunteer opportunity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
);

export default router;

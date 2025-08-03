/*
 * Das Kitchen - Mutual Aid Organization Website
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

import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs for contact form
    message: 'Too many contact form submissions, please try again later.'
});

// Validation rules for contact form
const validateContact = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .escape(),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('subject')
        .isIn(['volunteer', 'support', 'partnership', 'donation', 'general'])
        .withMessage('Please select a valid subject'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
        .escape()
];

// POST /api/contact - Submit contact form
router.post(
    '/',
    contactLimiter,
    validateContact,
    async (req: any, res: any) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { name, email, subject, message } = req.body;

            // For now, just log the submission
            console.log('Contact form submission:', {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString(),
                ip: req.ip
            });

            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 1000));

            res.status(200).json({
                success: true,
                message:
                    'Thank you for your message! We will get back to you soon.',
                submissionId: `msg_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`
            });
        } catch (error) {
            console.error('Contact form error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to submit contact form'
            });
        }
    }
);

export default router;

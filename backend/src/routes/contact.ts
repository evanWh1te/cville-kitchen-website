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

import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const router = express.Router();

// SMTP Configuration for Proton Mail
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.protonmail.ch',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // Use STARTTLS (not SSL)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        authMethod: 'PLAIN', // Proton Mail supports PLAIN or LOGIN
        tls: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2'
        },
        // Add connection timeout and retry settings
        connectionTimeout: 60000, // 60 seconds
        greetingTimeout: 30000, // 30 seconds
        socketTimeout: 60000 // 60 seconds
    });
};

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

            // Create submission ID for tracking
            const submissionId = `msg_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            // Create email transporter
            const transporter = createTransporter();

            // Subject line mapping
            const subjectMap: { [key: string]: string } = {
                volunteer: '🤝 Volunteer Inquiry',
                support: 'Support Request',
                partnership: '🤝 Partnership Opportunity',
                donation: 'Donation Inquiry',
                general: 'General Inquiry'
            };

            // Email content
            const emailSubject = `${
                subjectMap[subject] || '📧 Contact Form'
            } - ${name}`;

            const emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #dc2626; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                            <p style="color: #6b7280; margin: 0;">Charlottesville Kitchen</p>
                        </div>

                        <div style="padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #eab308; background: #fef3c7;">
                            <h3 style="color: #374151; margin-top: 0; font-size: 18px;">👤 Contact Information</h3>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Subject:</strong> ${
                                subjectMap[subject] || subject
                            }</p>
                        </div>

                        <div style="padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #6b7280; background: #f3f4f6;">
                            <h3 style="color: #374151; margin-top: 0; font-size: 18px;">💬 Message</h3>
                            <div style="white-space: normal; background: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb;">
                                ${message}
                            </div>
                        </div>

                        <div style="padding: 15px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #dc2626; background: #fee2e2;">
                            <h3 style="color: #374151; margin-top: 0; font-size: 18px;">📋 Submission Details</h3>
                            <p><strong>Timestamp:</strong> ${new Date().toLocaleString(
                                'en-US',
                                { dateStyle: 'long', timeStyle: 'medium' }
                            )}</p>
                            <p><strong>IP Address:</strong> ${req.ip}</p>
                        </div>
                    </div>
                </div>
            `;

            const emailText = `
                    New Contact Form Submission - Charlottesville Kitchen

                    Contact Information:
                    Name: ${name}
                    Email: ${email}
                    Subject: ${subjectMap[subject] || subject}

                    Message:
                    ${message}

                    Timestamp: ${new Date().toLocaleString()}
                    IP Address: ${req.ip}
                `;

            // Send email
            await transporter.sendMail({
                from: `"Charlottesville Kitchen Contact Form" <${
                    process.env.SMTP_FROM || process.env.SMTP_USER
                }>`,
                to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
                subject: emailSubject,
                text: emailText,
                html: emailHtml,
                replyTo: email
            });

            // Send confirmation email to user
            const confirmationHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <div style="text-align: center;">
                            <h2>✊ Thank you for contacting <span style="font-weight: 200; letter-spacing: 0;">Charlottesville</span><span style="font-weight: 700; letter-spacing: -0.025em; margin-left: 0.1em;">Kitchen</span>!</h2>
                            
                            <p>Dear ${name},</p>
                            
                            <p>We have received your message and will get back to you as soon as possible.</p>

                            <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
                                <p style="margin: 5px 0; color: #15803d;"><strong>🎯 Next Steps</strong></p>
                                <p style="margin: 5px 0; color: #15803d;">
                                    Our organizing team will review your message and respond
                                    within 24-48 hours.
                                </p>
                                <p style="margin: 5px 0; color: #15803d;">Keep an eye on your inbox for our reply!</p>
                            </div>

                            <div>
                                <h3>Your Message Summary</h3>
                                <p><strong>Subject:</strong> ${
                                    subjectMap[subject] || subject
                                }</p>
                                <p style="white-space: normal; background: #f9fafb; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; font-family: Arial, sans-serif; text-align: left;">${message}</p>
                            </div>
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #dc2626;">
                                <p style="margin: 5px 0;">In solidarity,<br>
                                <p style="font-weight: bold; color: #dc2626;">Charlottesville Kitchen Team</p></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            await transporter.sendMail({
                from: `"Charlottesville Kitchen" <${
                    process.env.SMTP_FROM || process.env.SMTP_USER
                }>`,
                to: email,
                subject:
                    'Your message has been received - Charlottesville Kitchen',
                html: confirmationHtml,
                text: `Thank you for contacting Charlottesville Kitchen! We have received your message and will get back to you soon.\n\nIn solidarity,\nCharlottesville Kitchen Team`
            });

            res.status(200).json({
                success: true,
                message:
                    'Thank you for your message! We will get back to you soon. Check your email for confirmation.',
                submissionId
            });
        } catch (error) {
            console.error('Contact form error:', error);

            // Check if it's an email-related error
            if (error instanceof Error) {
                if (
                    error.message.includes('SMTP') ||
                    error.message.includes('authentication')
                ) {
                    console.error('SMTP configuration error:', error.message);
                    return res.status(500).json({
                        error: 'Email service temporarily unavailable',
                        message:
                            'Please try again later or contact us directly.'
                    });
                }
            }

            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to submit contact form. Please try again.'
            });
        }
    }
);

export default router;

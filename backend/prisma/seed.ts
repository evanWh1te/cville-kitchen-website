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

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user if it doesn't exist
    const existingUser = await prisma.user.findFirst();
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const admin = await prisma.user.create({
            data: {
                email: 'admin@cville.kitchen',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('✅ Created admin user:', admin.email);
    } else {
        console.log('👤 Admin user already exists');
    }

    // Sample resources based on the markdown file
    const resources = [
        // Public Meals - Breakfast
        {
            title: 'The Haven - Breakfast',
            category: 'PUBLIC_MEALS',
            type: 'BREAKFAST',
            location: 'The Haven',
            address: '112 W Market St',
            hours: '7 days a week, 7:30-8:30am',
            notes: 'Updated 8/8/25',
        },
        {
            title: 'The Salvation Army - Breakfast',
            category: 'PUBLIC_MEALS',
            type: 'BREAKFAST',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday: 8:00-8:30am, Sunday: 9:15am',
            notes: 'Updated 8/8/25',
        },

        // Public Meals - Lunch
        {
            title: 'First United Methodist Church',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'First United Methodist Church',
            address: '101 E Jefferson St',
            hours: 'Monday, 12:00-1:00pm',
            notes: 'Updated 8/8/25',
        },
        {
            title: "Christ's Church",
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: "Christ's Church",
            address: '120 W High St',
            hours: 'Tuesday, 12:00-1:00pm',
            notes: 'Updated 5/9/25',
        },
        {
            title: 'First Presbyterian',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'First Presbyterian',
            address: '500 Park Street',
            hours: 'Wednesday, 12:00-1:00pm',
            notes: 'Updated 8/8/25',
        },
        {
            title: 'Holy Comforter',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'Holy Comforter',
            address: '208 East Jefferson St',
            hours: 'Thursday, 12:00-1:00pm',
            notes: 'Updated 8/8/25',
        },
        {
            title: 'The Haven - Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Haven',
            address: '112 W Market St',
            hours: 'Friday, 12:00-1:00pm',
            notes: 'Walk-up, no request needed ahead of time. Updated 8/8/25',
        },
        {
            title: 'The Haven - Sunday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Haven',
            address: '112 W Market St',
            hours: 'Sunday, 11:00am-12:00pm',
            notes: 'Updated 8/8/25',
        },
        {
            title: 'The Salvation Army - Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday, 12:00-12:30pm',
            notes: 'Updated 8/8/25',
        },

        // Public Meals - Dinner
        {
            title: 'The Salvation Army - Dinner',
            category: 'PUBLIC_MEALS',
            type: 'DINNER',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday, 5:15-6:00pm',
            notes: 'Updated 8/8/25',
        },
        {
            title: 'The Salvation Army - Sunday Dinner',
            category: 'PUBLIC_MEALS',
            type: 'DINNER',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Sunday, 4:00-4:45pm',
            notes: 'Updated 8/8/25',
        },

        // Free Fridges & Pantries
        {
            title: 'Visible/Records Little Free Fridge',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'Visible/Records',
            address: '1740 Broadway Street',
            hours: '24/7',
            description:
                'Very high turnover; often a mix of fresh produce, bread, prepared foods, pantry items',
            contactInfo:
                'Instagram @littlefreefridgecville, Email: littlefreefridge@gmail.com',
            notes: 'Outside location',
        },
        {
            title: 'The Beautiful Idea',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'The Beautiful Idea',
            address: '411 East Main Street',
            hours: 'Tuesday-Thursday: 11am-8pm, Friday-Saturday: 10am-9pm, Sunday: 11am-7pm, Closed Mondays',
            notes: 'Inside location',
        },

        // Emergency Food
        {
            title: 'Emergency Food Network',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location: 'Emergency Food Network',
            address: '900 Harris St',
            phone: '434-979-9180',
            hours: 'Call once per month between 9am and noon on Mondays, Wednesdays, and Fridays',
            description: "3 days' supply, 1x/month",
            requirements:
                'Must provide last 4 digits of SSN, household size, and address. Must live in Charlottesville or Albemarle county.',
            notes: 'Includes canned tuna and chicken, fruits, vegetables, cereal, beans, soup, peanut butter, mac and cheese, bread, margarine, cheese, and milk. Special diabetic bags available. Baby food and formula if available. Diapers available. Ready-to-eat foods for those without kitchens.',
        },
        {
            title: 'Loaves and Fishes',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location: 'Loaves and Fishes',
            address: '2050 Lambs Road, Charlottesville, VA 22901',
            phone: '434-996-7868',
            hours: 'Distribution: Wednesdays (2-4pm), Thursdays (6:30-8:30pm), Saturdays (10am-12pm)',
            description:
                "7 days' supply, 2x/month. At minimum 100 lbs for 4-person household.",
            requirements:
                'Need names and birthdates of all household members plus total monthly income. No proof required.',
            notes: 'Drive-through pick-up only. Includes fresh eggs, milk, produce, bread, frozen meats, and shelf-stable staples. Groceries by appointment available Tuesdays 4-7pm.',
            contactInfo:
                'Groceries by Appointment: Make 15-minute reservation online between 12:00am Wednesday - Monday 11:59pm for upcoming Tuesday.',
        },

        // Church Pantries
        {
            title: 'Holy Comforter Catholic Church',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Holy Comforter Catholic Church',
            address: '208 E Jefferson St, Charlottesville, VA 22902',
            phone: '(434) 295-7185',
            hours: 'Monday, Tuesday, & Wednesday, 10:30am-12:30pm',
            contactInfo:
                'Pickup Address: 215 3rd Street NE (right behind library), Phone: 434-293-8989',
            notes: 'Walk-up to 3rd St entrance. Also distributes packed lunches Thursday noon-1pm at 3rd Street location.',
        },
        {
            title: 'Church of our Saviour Episcopal',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Church of our Saviour Episcopal',
            address: '1165 Rio Rd East, Charlottesville, VA 22901',
            phone: '(434) 973-6512',
            hours: 'Monday, Wednesday, and Friday, 10:30am-12pm',
            notes: 'Food pantry located behind the church. No qualifications necessary.',
        }
    ];

    for (const resourceData of resources) {
        const existing = await prisma.resource.findFirst({
            where: {
                title: resourceData.title,
                category: resourceData.category as any
            }
        });

        if (!existing) {
            await prisma.resource.create({
                data: {
                    ...resourceData,
                    category: resourceData.category as any,
                    type: resourceData.type as any,
                    isActive: true,
                    lastUpdated: new Date()
                }
            });
            console.log('✅ Created resource:', resourceData.title);
        }
    }

    console.log('🎉 Database seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

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

    // Optional admin bootstrap (only if env vars provided & no users yet)
    const existingUser = await prisma.user.findFirst();
    if (!existingUser) {
        const seedEmail = process.env.SEED_ADMIN_EMAIL;
        const seedPassword = process.env.SEED_ADMIN_PASSWORD;
        if (seedEmail && seedPassword) {
            const hashedPassword = await bcrypt.hash(seedPassword, 12);
            const admin = await prisma.user.create({
                data: {
                    email: seedEmail,
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('✅ Seeded initial admin user:', admin.email);
        } else {
            console.log(
                'ℹ️ No users exist. Provide SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD env vars to create initial admin or use /api/auth/create-admin endpoint.'
            );
        }
    } else {
        console.log('👤 Users already exist; skipping admin seed');
    }

    // Complete resources from foodResources.md (Last updated: November 7, 2025)
    const resources = [
        // ==================== PUBLIC MEALS - BREAKFAST ====================
        {
            title: 'The Haven - Breakfast',
            category: 'PUBLIC_MEALS',
            type: 'BREAKFAST',
            location: 'The Haven',
            address: '112 W Market St',
            hours: '7 days a week, 7:30-8:30am',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'The Salvation Army - Breakfast',
            category: 'PUBLIC_MEALS',
            type: 'BREAKFAST',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday: 8:00-8:30am, Sunday: 9:15am',
            notes: 'Updated 8/8/25'
        },

        // ==================== PUBLIC MEALS - LUNCH ====================
        {
            title: 'First United Methodist Church - Monday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'First United Methodist Church',
            address: '101 E Jefferson St',
            hours: 'Monday, 12:00-1:00pm',
            notes: 'Updated 8/8/25'
        },
        {
            title: "Christ's Church - Tuesday Lunch",
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: "Christ's Church",
            address: '120 W High St',
            hours: 'Tuesday, 12:00-1:00pm',
            notes: 'Updated 5/9/25'
        },
        {
            title: 'First Presbyterian - Wednesday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'First Presbyterian',
            address: '500 Park Street',
            hours: 'Wednesday, 12:00-1:00pm',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'Holy Comforter - Thursday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'Holy Comforter',
            address: '208 East Jefferson St',
            hours: 'Thursday, 12:00-1:00pm',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'The Haven - Friday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Haven',
            address: '112 W Market St',
            hours: 'Friday, 12:00-1:00pm',
            notes: 'Walk-up, no request needed ahead of time. Updated 8/8/25'
        },
        {
            title: 'The Haven - Sunday Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Haven',
            address: '112 W Market St',
            hours: 'Sunday, 11:00am-12:00pm',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'The Salvation Army - Lunch',
            category: 'PUBLIC_MEALS',
            type: 'LUNCH',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday, 12:00-12:30pm',
            notes: 'Updated 8/8/25'
        },

        // ==================== PUBLIC MEALS - DINNER ====================
        {
            title: 'The Salvation Army - Weekday Dinner',
            category: 'PUBLIC_MEALS',
            type: 'DINNER',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Monday-Saturday, 5:15-6:00pm',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'The Salvation Army - Sunday Dinner',
            category: 'PUBLIC_MEALS',
            type: 'DINNER',
            location: 'The Salvation Army',
            address: '207 Ridge St',
            hours: 'Sunday, 4:00-4:45pm',
            notes: 'Updated 8/8/25'
        },

        // ==================== FREE FRIDGES & PANTRIES ====================
        {
            title: 'Visible/Records Little Free Fridge',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'FRIDGE',
            location: 'Visible/Records',
            address: '1740 Broadway Street',
            hours: '24/7',
            description:
                'Very high turnover; often a mix of fresh produce, bread, prepared foods, pantry items',
            contactInfo:
                'Instagram @littlefreefridgecville, Email: littlefreefridge@gmail.com',
            notes: 'Outside location'
        },
        {
            title: 'The Beautiful Idea',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'The Beautiful Idea',
            address: '411 East Main Street',
            hours: 'Tuesday-Thursday: 11am-8pm, Friday-Saturday: 10am-9pm, Sunday: 11am-7pm, Closed Mondays',
            notes: 'Inside location'
        },
        {
            title: 'PVCC Panther Pantry - Main Building',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'PVCC Panther Pantry - Main Building',
            address: 'PVCC Main Building',
            hours: 'Monday-Thursday: 8am-5:30pm, Friday: 8am-12pm, Closed Saturday/Sunday',
            requirements: 'For current PVCC students'
        },
        {
            title: 'PVCC Panther Pantry - Stultz Center',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'PVCC Panther Pantry - Stultz Center',
            address: 'PVCC Stultz Center',
            hours: 'Monday-Thursday: 8am-10pm, Friday-Saturday: 8am-5pm, Closed Sunday',
            requirements: 'For current PVCC students'
        },
        {
            title: 'UVA Cavalier Food Pantry - Student Health & Wellness',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'UVA Cavalier Food Pantry',
            address: 'Student Health & Wellness 495',
            hours: 'Monday-Friday: 7:45am-2am, Saturday-Sunday: 7:45am-2am during academic year',
            description:
                'Perishable, shelf-stable, allergen, and hygiene items',
            requirements: 'For UVA students. Student swipe card access only',
            contactInfo: 'Instagram @pantryatuva'
        },
        {
            title: 'UVA Cavalier Food Pantry - Newcomb Hall',
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: 'UVA Cavalier Food Pantry',
            address: 'Newcomb Hall Student Activities Center, Room 144',
            hours: 'Monday-Thursday: 7am-12am, Friday: 7am-9pm, Saturday: 7am-12am, Sunday: 8am-12am during academic year',
            description: 'Shelf-stable, reapportioned items, StudCo Free Store',
            requirements: 'For UVA students',
            contactInfo: 'Instagram @pantryatuva'
        },
        {
            title: "Food Pantry at UVA Women's Center",
            category: 'FREE_FRIDGES_PANTRIES',
            type: 'PANTRY',
            location: "UVA Women's Center",
            address: 'Corner Building at University Avenue, main floor',
            hours: 'Monday-Friday: 9am-5pm (during academic year)',
            requirements: 'For UVA students and employees'
        },

        // ==================== EMERGENCY FOOD ====================
        {
            title: 'Emergency Food Network',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location: 'Emergency Food Network',
            address: '900 Harris St',
            phone: '434-979-9180',
            hours: 'Call once per month between 9am and noon on Mondays, Wednesdays, and Fridays. Pick up same day 1:30-3:30pm',
            description: "3 days' supply, 1x/month",
            requirements:
                'Must provide last 4 digits of SSN, household size, and address. Must live in Charlottesville or Albemarle county.',
            notes: 'Includes canned tuna and chicken, fruits, vegetables, cereal, beans, soup, peanut butter, mac and cheese, bread, margarine, cheese, and milk. Special diabetic bags available. Baby food and formula if available. Diapers available. Ready-to-eat foods for those without kitchens. Individuals with a social worker can request food more often. No delivery available. Updated 8/8/25'
        },
        {
            title: 'Loaves and Fishes',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location: 'Loaves and Fishes',
            address: '2050 Lambs Road, Charlottesville, VA 22901',
            phone: '434-996-7868',
            hours: 'Distribution: Wednesdays (2-4pm), Thursdays (6:30-8:30pm), Saturdays (10am-12pm). Groceries by Appointment: Tuesdays 4-7pm',
            description:
                "7 days' supply, 2x/month. At minimum 100 lbs for 4-person household.",
            requirements:
                'Need names and birthdates of all household members plus total monthly income. No proof required.',
            notes: 'Drive-through pick-up only. Parking lot opens one hour before distribution. Includes fresh eggs, milk, produce, bread, frozen meats, and shelf-stable staples. Families can come twice a month or more if needed. Pick-ups can be done by someone else on behalf of family (must be arranged by family). Groceries by Appointment: Make 15-minute reservation online between 12:00am Wednesday - Monday 11:59pm for upcoming Tuesday. Updated 8/8/25'
        },
        {
            title: 'B.F. Yancey Community Center',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location: 'B.F. Yancey Community Center',
            address: '7625 Porters Rd, Esmont, VA',
            hours: 'Open 5-7pm on Fridays. Food pantry: 5:30-8:30pm Monday/Wednesday/Thursday, 10am-2pm Tuesday/Wednesday/Friday',
            notes: 'Drive-up, no need to call ahead. Also holds events like Backpack giveaways. Check Facebook Page for most recent events and distribution dates. Updated 8/8/25',
            contactInfo: 'Facebook: BFYanceyCommunityFoodPantry'
        },
        {
            title: 'Blue Ridge Area Food Bank - Eastern Region',
            category: 'EMERGENCY_FOOD',
            type: 'PANTRY',
            location:
                'Blue Ridge Area Food Bank, Eastern Region (Thomas Jefferson Branch)',
            address: '1207 Harris St, Charlottesville, VA 22902',
            hours: 'Monday-Friday 7:30am-4:00pm',
            description:
                'For ongoing food needs, they refer people to partner food pantries. Use food finder tool at foodfinder.brafb.org',
            notes: 'Regular assistance available. Updated 8/8/25'
        },

        // ==================== STUDENT MEAL SERVICES ====================
        {
            title: 'Albemarle County Student Meal Services',
            category: 'STUDENT_MEALS',
            type: 'PROGRAM',
            location: 'Albemarle County Public Schools',
            requirements:
                'Students under 18 in Albemarle County Public School feeder areas',
            description: 'Free and reduced meals program',
            contactInfo:
                'Apply at k12albemarle.org/our-divisions/student-services/child-nutrition',
            notes: 'Updated 8/8/25'
        },
        {
            title: 'Charlottesville City School Meals',
            category: 'STUDENT_MEALS',
            type: 'PROGRAM',
            location: 'Charlottesville City Schools',
            phone: '434-245-2830',
            requirements:
                'Students under 18 in Charlottesville City School feeder area',
            description: 'Free and reduced lunch program',
            contactInfo:
                'Contact Carlton Jones, Nutrition Administrator. Email: JonesC1@charlottesvilleschools.org. Apply at charlottesvilleschools.org/departments/nutrition',
            notes: 'Updated 8/8/25'
        },

        // ==================== CHURCH-BASED FOOD PANTRIES ====================
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
            notes: 'Walk-up to 3rd St entrance, taking orders outside. Also distributes packed lunches Thursday noon-1pm at 3rd Street location. Updated 8/8/25'
        },
        {
            title: 'Church of our Saviour Episcopal',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Church of our Saviour Episcopal',
            address: '1165 Rio Rd East, Charlottesville, VA 22901',
            phone: '(434) 973-6512',
            hours: 'Monday, Wednesday, and Friday, 10:30am-12pm',
            notes: 'Food pantry located behind the church. No qualifications necessary. Updated 8/8/25'
        },
        {
            title: 'New Beginnings Christian Community',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'New Beginnings Christian Community',
            address: '1130 E Market St, Charlottesville, VA 22902',
            phone: '434-249-5691',
            hours: 'Friday, 1-4pm',
            notes: 'Call to arrange pick-up of a bag of food. Delivery available only for extreme emergencies or those who cannot leave house. Fresh food available! No questions asked for ID or address. Can get 1-2 boxes per family. Updated 5/9/25'
        },
        {
            title: 'Church of the Incarnation',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Church of the Incarnation',
            address: '1465 Incarnation Dr, Charlottesville, VA 22901',
            hours: 'Sunday, 1:30-3:30pm',
            contactInfo:
                'Contact: Marta Daley, foodministry@incarnationparish.org',
            notes: 'Can come weekly for non-perishables and vegetables. Every other week: rice, beans, meat, eggs, cooking oil. No need to pre-register, no income or other requirements. Updated 8/8/25'
        },
        {
            title: "St. Paul's Episcopal Church",
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: "St. Paul's Episcopal Church",
            address: '851 Owensville Rd, Charlottesville, VA 22901',
            phone: '434-979-6354',
            hours: '3rd Wednesday of the month, 3:30-5:00pm',
            notes: 'Bags distributed first come first serve. Updated 8/8/25'
        },
        {
            title: 'Unitarian Universalists',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location:
                'Unitarian Universalists (previously Thomas Jefferson Memorial Church)',
            address: '717 Rugby Rd, Charlottesville, VA 22903',
            hours: '1st Friday of the month, 9:00-10:00am',
            notes: 'Sign in at Summit House Parking Lot (703 Rugby Rd) starting at 8:00am. First-come-first-serve basis. Updated 8/8/25'
        },
        {
            title: 'Buck Mountain Episcopal Church',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Buck Mountain Episcopal Church',
            address: '4133 Earlysville Road, Earlysville, VA 22936',
            phone: '434-973-2054',
            hours: '2nd and 4th Wednesday of the month, 3:00-5:00pm',
            notes: 'Three-day emergency supply of food. No documentation necessary. Food pantry takes place in Parish Hall. Drive through format. Updated 8/8/25'
        },
        {
            title: 'Belmont Baptist Church',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Belmont Baptist Church',
            address: '830 Monticello Ave',
            phone: '434-296-7111',
            hours: 'Tuesday-Friday, 10:30am-12pm'
        },
        {
            title: 'Grace Grocery - Crozet United Methodist',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Crozet United Methodist',
            address: '1156 Crozet Ave, Crozet, VA 22932',
            hours: 'Monday, 3:30pm-5pm',
            notes: 'Distribution to home-bound clients can be arranged by appointment'
        },
        {
            title: 'Rockfish Gap Food Pantry - Emmanuel Episcopal Church',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Emmanuel Episcopal Church',
            address: '7585 Rockfish Gap Turnpike, Greenwood, VA 22943',
            hours: 'First Saturday of the month, 9-11am'
        },
        {
            title: 'Love Your Neighbor - Crozet Baptist Church',
            category: 'CHURCH_PANTRIES',
            type: 'PANTRY',
            location: 'Crozet Baptist Church',
            address: '5804 St. George Ave, Crozet, VA 22932',
            phone: '434-823-5171',
            hours: '3rd Thursday of the month',
            requirements:
                'Requires referral from school counselors, may also accept requests for help by calling'
        },

        // ==================== FOOD DELIVERY SERVICES ====================
        {
            title: 'JABA Home Delivered Meals',
            category: 'FOOD_DELIVERY',
            type: 'DELIVERY',
            location: 'JABA',
            phone: '434-817-5244',
            requirements:
                'Individuals above age 60 who are low income, unable to leave home without assistance, unable to prepare meals due to disability or health, and have no caregiver to prepare well-balanced meals',
            description: 'Home delivered meals for eligible seniors',
            notes: 'Continuing deliveries. Call for more information or fill out online form. Updated 8/8/25'
        },
        {
            title: 'Meals on Wheels',
            category: 'FOOD_DELIVERY',
            type: 'DELIVERY',
            location: 'Meals on Wheels',
            phone: '434-293-4364',
            hours: 'Office open Monday-Friday 9am-1pm',
            requirements:
                'No age or income requirement, but goal is to reach home-bound neighbors (unable to drive, usually alone during day) who are unable to provide their own meals',
            description:
                'Meal delivery service to residents in Charlottesville and most of Albemarle county. One meal a day during lunchtime hours',
            contactInfo:
                'Apply online at mealsonwheelscville.org or call office and leave message',
            notes: 'Hot lunch delivery meals running. Updated 8/8/25'
        },
        {
            title: 'Blue Ridge Area Food Bank REACH Program',
            category: 'FOOD_DELIVERY',
            type: 'DELIVERY',
            location: 'Blue Ridge Area Food Bank',
            phone: '434-248-3663',
            description:
                'Works with community partners to provide Reach bags via delivery or pickup to seniors and homebound individuals who are food insecure',
            notes: 'Updated 8/8/25'
        }
    ];

    // Volunteer Opportunities
    const volunteerOpportunities = [
        {
            title: 'Charlottesville Food Not Bombs - Volunteer',
            category: 'FOOD_DISTRIBUTION',
            type: 'RECURRING',
            location: 'IX Art Park',
            address: '522 2nd Street SE D',
            hours: 'Every Wednesday at 6:15pm',
            description:
                'Help with food distribution and community potluck. A grassroots movement providing free vegan meals and mutual aid.',
            timeCommitment: 'Weekly, Wednesday evenings',
            notes: 'Volunteers welcome to help with food prep, distribution, and cleanup'
        },
        {
            title: 'Food Sharing is Caring - Distribution Volunteer',
            category: 'FOOD_DISTRIBUTION',
            type: 'RECURRING',
            location: 'Tonsler Park',
            hours: 'Every Sunday at 10am',
            description:
                'Food distribution - bring two bags. Volunteer 9:30am-12:30pm on distribution days',
            email: 'edisa@foodsharingiscaring.org',
            contactInfo: 'Email: edisa@foodsharingiscaring.org',
            timeCommitment: 'Weekly, Sunday mornings (9:30am-12:30pm)',
            notes: 'Can donate money at website or in-kind donations via email'
        },
        {
            title: 'Bread Across Borders - Sorting Volunteer',
            category: 'FOOD_DISTRIBUTION',
            type: 'RECURRING',
            hours: 'Sunday afternoons. Sorting: 11:30am-1pm',
            description: 'Help sort and distribute food on Sunday afternoons',
            email: 'breadacrossborders@gmail.com',
            contactInfo: 'Email: breadacrossborders@gmail.com',
            timeCommitment: 'Weekly, Sunday afternoons'
        },
        {
            title: 'Cville Care Bears - Street Outreach',
            category: 'OUTREACH',
            type: 'RECURRING',
            location: 'Downtown Mall',
            hours: 'Every weekend',
            description:
                'Provide food, drink, harm reduction, and other necessities on the downtown mall. Also organize Free Farmers Market & Potluck',
            contactInfo:
                'Instagram @cvillecarebears, Email: CvilleFreeFarmersMarket@proton.me',
            email: 'CvilleFreeFarmersMarket@proton.me',
            timeCommitment: 'Weekly, weekend availability',
            skills: 'Compassion, non-judgmental approach, harm reduction knowledge helpful but not required'
        },
        {
            title: 'Community Potluck at Visible/Records - Volunteer',
            category: 'EVENT_COORDINATION',
            type: 'RECURRING',
            location: 'Visible/Records',
            address: '1740 Broadway Street',
            hours: '1st Sunday monthly, 12:30-3:30pm',
            description:
                'Help organize monthly community potluck. Bringing a dish is not required to attend or volunteer',
            contactInfo: 'Instagram @communitypotluck.cville',
            timeCommitment: 'Monthly, first Sunday',
            notes: 'Great opportunity for event coordination and community building'
        },
        {
            title: 'Virginia Fresh Match Program - Market Support',
            category: 'OUTREACH',
            type: 'SEASONAL',
            location: 'Farmers Markets',
            address:
                'Farmers Market at IX Art Park and Charlottesville City Farmers Market (100 Water Street)',
            hours: 'Saturdays 9am-1pm',
            description:
                'Help connect SNAP recipients with the Fresh Match program at farmers markets. Program doubles SNAP for fruits and vegetables plus provides extra tokens',
            timeCommitment:
                'Weekly during farmers market season, Saturday mornings',
            skills: 'Customer service, familiarity with SNAP benefits helpful'
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

    // Seed volunteer opportunities
    for (const volunteerData of volunteerOpportunities) {
        const existing = await prisma.volunteerOpportunity.findFirst({
            where: {
                title: volunteerData.title,
                category: volunteerData.category as any
            }
        });

        if (!existing) {
            await prisma.volunteerOpportunity.create({
                data: {
                    ...volunteerData,
                    category: volunteerData.category as any,
                    type: volunteerData.type as any,
                    isActive: true,
                    lastUpdated: new Date()
                }
            });
            console.log(
                '✅ Created volunteer opportunity:',
                volunteerData.title
            );
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

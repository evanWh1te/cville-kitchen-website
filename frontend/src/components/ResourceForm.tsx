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

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    resourcesAPI,
    Resource,
    ResourceCategory,
    ResourceType
} from '@/lib/api';

const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.enum([
        'PUBLIC_MEALS',
        'FREE_FRIDGES_PANTRIES',
        'EMERGENCY_FOOD',
        'STUDENT_MEALS',
        'CHURCH_PANTRIES',
        'FOOD_DELIVERY',
        'LOCAL_EFFORTS',
        'ADDITIONAL_RESOURCES'
    ]),
    type: z.enum([
        'BREAKFAST',
        'LUNCH',
        'DINNER',
        'PANTRY',
        'DELIVERY',
        'MARKET',
        'PROGRAM',
        'OTHER'
    ]),
    location: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    hours: z.string().optional(),
    notes: z.string().optional(),
    requirements: z.string().optional(),
    contactInfo: z.string().optional(),
    isActive: z.boolean().optional()
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface ResourceFormProps {
    resource?: Resource | null;
    onSubmit: () => void;
    onCancel: () => void;
}

const categoryOptions: { value: ResourceCategory; label: string }[] = [
    { value: 'PUBLIC_MEALS', label: 'Public Meals' },
    { value: 'FREE_FRIDGES_PANTRIES', label: 'Free Fridges & Pantries' },
    { value: 'EMERGENCY_FOOD', label: 'Emergency Food' },
    { value: 'STUDENT_MEALS', label: 'Student Meals' },
    { value: 'CHURCH_PANTRIES', label: 'Church-Based Food Pantries' },
    { value: 'FOOD_DELIVERY', label: 'Food Delivery Services' },
    { value: 'LOCAL_EFFORTS', label: 'Local Efforts & Ways to Help' },
    { value: 'ADDITIONAL_RESOURCES', label: 'Additional Resources' }
];

const typeOptions: { value: ResourceType; label: string }[] = [
    { value: 'BREAKFAST', label: 'Breakfast' },
    { value: 'LUNCH', label: 'Lunch' },
    { value: 'DINNER', label: 'Dinner' },
    { value: 'PANTRY', label: 'Pantry' },
    { value: 'DELIVERY', label: 'Delivery' },
    { value: 'MARKET', label: 'Market' },
    { value: 'PROGRAM', label: 'Program' },
    { value: 'OTHER', label: 'Other' }
];

export default function ResourceForm({
    resource,
    onSubmit,
    onCancel
}: ResourceFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(
        resource?.category || 'PUBLIC_MEALS'
    );

    // Get type options based on selected category
    const getTypeOptions = (category: ResourceCategory) => {
        if (category === 'PUBLIC_MEALS') {
            return [
                { value: 'BREAKFAST', label: 'Breakfast' },
                { value: 'LUNCH', label: 'Lunch' },
                { value: 'DINNER', label: 'Dinner' },
                { value: 'OTHER', label: 'Other' }
            ];
        }

        return [
            { value: 'PANTRY', label: 'Pantry' },
            { value: 'DELIVERY', label: 'Delivery' },
            { value: 'MARKET', label: 'Market' },
            { value: 'PROGRAM', label: 'Program' },
            { value: 'OTHER', label: 'Other' }
        ];
    };

    const currentTypeOptions = getTypeOptions(selectedCategory);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<ResourceFormData>({
        resolver: zodResolver(resourceSchema),
        defaultValues: resource
            ? {
                  title: resource.title,
                  description: resource.description || '',
                  category: resource.category,
                  type: resource.type,
                  location: resource.location || '',
                  address: resource.address || '',
                  phone: resource.phone || '',
                  email: resource.email || '',
                  website: resource.website || '',
                  hours: resource.hours || '',
                  notes: resource.notes || '',
                  requirements: resource.requirements || '',
                  contactInfo: resource.contactInfo || '',
                  isActive: resource.isActive
              }
            : {
                  category: 'PUBLIC_MEALS',
                  type: 'OTHER',
                  isActive: true
              }
    });

    // Watch for category changes
    const watchedCategory = watch('category');

    useEffect(() => {
        if (watchedCategory && watchedCategory !== selectedCategory) {
            setSelectedCategory(watchedCategory);
            // Reset type to the first available option for the new category
            const newTypeOptions = getTypeOptions(watchedCategory);
            if (newTypeOptions.length > 0) {
                setValue('type', newTypeOptions[0].value as ResourceType);
            }
        }
    }, [watchedCategory, selectedCategory, setValue]);

    const onFormSubmit = async (data: ResourceFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Clean up empty strings
            const cleanedData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    value === '' ? undefined : value
                ])
            ) as any;

            if (resource) {
                await resourcesAPI.update(resource.id, cleanedData);
            } else {
                await resourcesAPI.create(cleanedData);
            }

            onSubmit();
        } catch (err: any) {
            console.error('Form submission error:', err);
            setError(
                err.response?.data?.error ||
                    'An error occurred while saving the resource'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {resource ? 'Edit Resource' : 'Create New Resource'}
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="px-6 py-4"
                >
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Title */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Title *
                            </label>
                            <input
                                {...register('title')}
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            {errors.title && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Category *
                            </label>
                            <select
                                {...register('category')}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                {categoryOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Type *
                            </label>
                            <select
                                {...register('type')}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            >
                                {currentTypeOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Location
                            </label>
                            <input
                                {...register('location')}
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <input
                                {...register('address')}
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>
                            <input
                                {...register('phone')}
                                type="tel"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Website */}
                        <div>
                            <label
                                htmlFor="website"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Website
                            </label>
                            <input
                                {...register('website')}
                                type="url"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="https://"
                            />
                            {errors.website && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.website.message}
                                </p>
                            )}
                        </div>

                        {/* Hours */}
                        <div>
                            <label
                                htmlFor="hours"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Hours
                            </label>
                            <input
                                {...register('hours')}
                                type="text"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="e.g., Monday-Friday: 9am-5pm"
                            />
                        </div>

                        {/* Active Status */}
                        <div>
                            <div className="flex items-center">
                                <input
                                    {...register('isActive')}
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Active (visible on public site)
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="notes"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Notes
                            </label>
                            <textarea
                                {...register('notes')}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Requirements */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="requirements"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Requirements
                            </label>
                            <textarea
                                {...register('requirements')}
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Any eligibility requirements or restrictions"
                            />
                        </div>

                        {/* Contact Info */}
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="contactInfo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Additional Contact Info
                            </label>
                            <textarea
                                {...register('contactInfo')}
                                rows={2}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Any additional contact details or instructions"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {resource ? 'Updating...' : 'Creating...'}
                                </>
                            ) : resource ? (
                                'Update Resource'
                            ) : (
                                'Create Resource'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

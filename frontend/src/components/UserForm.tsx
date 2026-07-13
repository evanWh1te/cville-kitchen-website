/*
 * UserForm - create/update users (admin only)
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, UserRole, usersAPI } from '@/lib/api';

const userSchema = z.object({
    email: z.string().email('Valid email required'),
    password: z.string().min(8, 'Min 8 characters').optional(),
    role: z.enum(['ADMIN', 'MODERATOR'])
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
    user?: User | null;
    onSubmit: () => void;
    onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: user
            ? { email: user.email, role: user.role as UserRole }
            : { role: 'MODERATOR' }
    });

    const onFormSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (user) {
                // On update, do not send empty password
                const payload: any = { email: data.email, role: data.role };
                if (data.password && data.password.length >= 8)
                    payload.password = data.password;
                await usersAPI.update(user.id, payload);
            } else {
                if (!data.password || data.password.length < 8) {
                    setError(
                        'Password is required and must be at least 8 characters.'
                    );
                    setIsSubmitting(false);
                    return;
                }
                await usersAPI.create({
                    email: data.email,
                    password: data.password,
                    role: data.role
                });
            }
            onSubmit();
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to save user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        {user ? 'Edit User' : 'Create User'}
                    </h3>
                </div>

                <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="px-6 py-4"
                >
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email *
                            </label>
                            <input
                                type="email"
                                {...register('email')}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {!user && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    {...register('password')}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role *
                            </label>
                            <select
                                {...register('role')}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="MODERATOR">Moderator</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.role.message as string}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

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
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    resourcesAPI,
    Resource,
    ResourceCategory,
    ResourceType
} from '@/lib/api';
import ResourceForm from '@/components/ResourceForm';

const categoryLabels: Record<ResourceCategory, string> = {
    PUBLIC_MEALS: 'Public Meals',
    FREE_FRIDGES_PANTRIES: 'Free Fridges & Pantries',
    EMERGENCY_FOOD: 'Emergency Food',
    STUDENT_MEALS: 'Student Meals',
    CHURCH_PANTRIES: 'Church-Based Food Pantries',
    FOOD_DELIVERY: 'Food Delivery Services',
    LOCAL_EFFORTS: 'Local Efforts & Ways to Help',
    ADDITIONAL_RESOURCES: 'Additional Resources'
};

const typeLabels: Record<ResourceType, string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    PANTRY: 'Pantry',
    DELIVERY: 'Delivery',
    MARKET: 'Market',
    PROGRAM: 'Program',
    OTHER: 'Other'
};

export default function AdminDashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(
        null
    );
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadResources();
        }
    }, [user]);

    const loadResources = async () => {
        try {
            setLoading(true);
            const { resources } = await resourcesAPI.getAllAdmin();
            setResources(resources);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/admin');
    };

    const handleCreateResource = () => {
        setEditingResource(null);
        setShowForm(true);
    };

    const handleEditResource = (resource: Resource) => {
        setEditingResource(resource);
        setShowForm(true);
    };

    const handleDeleteResource = async (id: string) => {
        try {
            await resourcesAPI.delete(id);
            await loadResources();
            setDeleteConfirm(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete resource');
        }
    };

    const handleFormSubmit = async () => {
        setShowForm(false);
        setEditingResource(null);
        await loadResources();
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-accent-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-accent-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-accent-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Welcome back, {user.email}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleCreateResource}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Add Resource
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                        <button
                            onClick={() => setError(null)}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-accent-600">
                            Loading resources...
                        </p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Resources ({resources.length})
                                </h2>
                            </div>

                            {resources.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        No resources found.
                                    </p>
                                    <button
                                        onClick={handleCreateResource}
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                                    >
                                        Create First Resource
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Last Updated
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {resources.map((resource) => (
                                                <tr key={resource.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {resource.title}
                                                        </div>
                                                        {resource.location && (
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    resource.location
                                                                }
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            categoryLabels[
                                                                resource
                                                                    .category
                                                            ]
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            typeLabels[
                                                                resource.type
                                                            ]
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                resource.isActive
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {resource.isActive
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            resource.lastUpdated
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handleEditResource(
                                                                    resource
                                                                )
                                                            }
                                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    resource.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Resource Form Modal */}
            {showForm && (
                <ResourceForm
                    resource={editingResource}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingResource(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete this resource? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleDeleteResource(deleteConfirm)
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

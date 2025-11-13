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
    volunteersAPI,
    Resource,
    VolunteerOpportunity,
    ResourceCategory,
    ResourceType,
    VolunteerCategory,
    VolunteerType
} from '@/lib/api';
import ResourceForm from '@/components/ResourceForm';
import VolunteerForm from '@/components/VolunteerForm';

const resourceCategoryLabels: Record<ResourceCategory, string> = {
    PUBLIC_MEALS: 'Public Meals',
    FREE_FRIDGES_PANTRIES: 'Free Fridges & Pantries',
    EMERGENCY_FOOD: 'Emergency Food',
    STUDENT_MEALS: 'Student Meals',
    CHURCH_PANTRIES: 'Church-Based Food Pantries',
    FOOD_DELIVERY: 'Food Delivery Services',
    LOCAL_EFFORTS: 'Local Efforts & Ways to Help',
    ADDITIONAL_RESOURCES: 'Additional Resources'
};

const resourceTypeLabels: Record<ResourceType, string> = {
    BREAKFAST: 'Breakfast',
    LUNCH: 'Lunch',
    DINNER: 'Dinner',
    PANTRY: 'Pantry',
    DELIVERY: 'Delivery',
    MARKET: 'Market',
    PROGRAM: 'Program',
    OTHER: 'Other'
};

const volunteerCategoryLabels: Record<VolunteerCategory, string> = {
    FOOD_PREPARATION: 'Food Preparation',
    FOOD_DISTRIBUTION: 'Food Distribution',
    COMMUNITY_GARDENS: 'Community Gardens',
    ADMINISTRATIVE: 'Administrative Support',
    FUNDRAISING: 'Fundraising',
    OUTREACH: 'Outreach & Advocacy',
    EDUCATION: 'Education & Workshops',
    TRANSPORTATION: 'Transportation',
    EVENT_COORDINATION: 'Event Coordination',
    OTHER: 'Other Opportunities'
};

const volunteerTypeLabels: Record<VolunteerType, string> = {
    ONE_TIME: 'One-Time',
    RECURRING: 'Recurring',
    SEASONAL: 'Seasonal',
    FLEXIBLE: 'Flexible Schedule',
    REMOTE: 'Remote',
    ON_SITE: 'On-Site',
    LEADERSHIP: 'Leadership Role',
    TRAINING_PROVIDED: 'Training Provided'
};

type ActiveTab = 'resources' | 'volunteers';

export default function AdminDashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ActiveTab>('resources');
    const [resources, setResources] = useState<Resource[]>([]);
    const [volunteers, setVolunteers] = useState<VolunteerOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showResourceForm, setShowResourceForm] = useState(false);
    const [showVolunteerForm, setShowVolunteerForm] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(
        null
    );
    const [editingVolunteer, setEditingVolunteer] =
        useState<VolunteerOpportunity | null>(null);
    const [deleteResourceConfirm, setDeleteResourceConfirm] = useState<
        string | null
    >(null);
    const [deleteVolunteerConfirm, setDeleteVolunteerConfirm] = useState<
        string | null
    >(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [resourcesResponse, volunteersResponse] = await Promise.all([
                resourcesAPI.getAllAdmin(),
                volunteersAPI.getAllAdmin()
            ]);
            setResources(resourcesResponse.resources);
            setVolunteers(volunteersResponse.volunteers);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/admin');
    };

    // Resource handlers
    const handleCreateResource = () => {
        setEditingResource(null);
        setShowResourceForm(true);
    };

    const handleEditResource = (resource: Resource) => {
        setEditingResource(resource);
        setShowResourceForm(true);
    };

    const handleDeleteResource = async (id: string) => {
        try {
            await resourcesAPI.delete(id);
            await loadData();
            setDeleteResourceConfirm(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete resource');
        }
    };

    const handleResourceFormSubmit = async () => {
        setShowResourceForm(false);
        setEditingResource(null);
        await loadData();
    };

    // Volunteer handlers
    const handleCreateVolunteer = () => {
        setEditingVolunteer(null);
        setShowVolunteerForm(true);
    };

    const handleEditVolunteer = (volunteer: VolunteerOpportunity) => {
        setEditingVolunteer(volunteer);
        setShowVolunteerForm(true);
    };

    const handleDeleteVolunteer = async (id: string) => {
        try {
            await volunteersAPI.delete(id);
            await loadData();
            setDeleteVolunteerConfirm(null);
        } catch (err: any) {
            setError(
                err.response?.data?.error ||
                    'Failed to delete volunteer opportunity'
            );
        }
    };

    const handleVolunteerFormSubmit = async () => {
        setShowVolunteerForm(false);
        setEditingVolunteer(null);
        await loadData();
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

    const TabButton = ({
        tabKey,
        label
    }: {
        tabKey: ActiveTab;
        label: string;
    }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 ${
                activeTab === tabKey
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    const ResourcesTable = () => (
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
                                        {resource.location}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {resourceCategoryLabels[resource.category]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {resourceTypeLabels[resource.type]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        resource.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {resource.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                    resource.lastUpdated
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => handleEditResource(resource)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        setDeleteResourceConfirm(resource.id)
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
    );

    const VolunteersTable = () => (
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
                    {volunteers.map((volunteer) => (
                        <tr key={volunteer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {volunteer.title}
                                </div>
                                {volunteer.location && (
                                    <div className="text-sm text-gray-500">
                                        {volunteer.location}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {volunteerCategoryLabels[volunteer.category]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {volunteerTypeLabels[volunteer.type]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        volunteer.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {volunteer.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                    volunteer.lastUpdated
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() =>
                                        handleEditVolunteer(volunteer)
                                    }
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() =>
                                        setDeleteVolunteerConfirm(volunteer.id)
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
    );

    return (
        <div className="min-h-screen bg-gray-50">
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
                            {user.role === 'ADMIN' && (
                                <button
                                    onClick={() => router.push('/admin/users')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Manage Users
                                </button>
                            )}
                            {activeTab === 'resources' ? (
                                <button
                                    onClick={handleCreateResource}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Resource
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateVolunteer}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Add Volunteer Opportunity
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading data...</p>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                            <div className="flex space-x-8">
                                <TabButton
                                    tabKey="resources"
                                    label={`Food Resources (${resources.length})`}
                                />
                                <TabButton
                                    tabKey="volunteers"
                                    label={`Volunteer Opportunities (${volunteers.length})`}
                                />
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="px-4 py-5 sm:p-6">
                            {activeTab === 'resources' ? (
                                <>
                                    {resources.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">
                                                No food resources found.
                                            </p>
                                            <button
                                                onClick={handleCreateResource}
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Create First Resource
                                            </button>
                                        </div>
                                    ) : (
                                        <ResourcesTable />
                                    )}
                                </>
                            ) : (
                                <>
                                    {volunteers.length === 0 ? (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">
                                                No volunteer opportunities
                                                found.
                                            </p>
                                            <button
                                                onClick={handleCreateVolunteer}
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                                            >
                                                Create First Volunteer
                                                Opportunity
                                            </button>
                                        </div>
                                    ) : (
                                        <VolunteersTable />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Resource Form Modal */}
            {showResourceForm && (
                <ResourceForm
                    resource={editingResource}
                    onSubmit={handleResourceFormSubmit}
                    onCancel={() => {
                        setShowResourceForm(false);
                        setEditingResource(null);
                    }}
                />
            )}

            {/* Volunteer Form Modal */}
            {showVolunteerForm && (
                <VolunteerForm
                    volunteer={editingVolunteer}
                    onSubmit={handleVolunteerFormSubmit}
                    onCancel={() => {
                        setShowVolunteerForm(false);
                        setEditingVolunteer(null);
                    }}
                />
            )}

            {/* Delete Resource Confirmation Modal */}
            {deleteResourceConfirm && (
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
                                onClick={() => setDeleteResourceConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleDeleteResource(deleteResourceConfirm)
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Volunteer Confirmation Modal */}
            {deleteVolunteerConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to delete this volunteer
                            opportunity? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteVolunteerConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleDeleteVolunteer(
                                        deleteVolunteerConfirm
                                    )
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

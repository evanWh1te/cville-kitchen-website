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

import axios from 'axios';

// Always call Next.js API routes from the browser. Those routes proxy
// server-side to the backend using BACKEND_INTERNAL_URL.
const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for sending cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Types
export interface User {
    id: string;
    email: string;
    role: string;
}

export interface Resource {
    id: string;
    title: string;
    description?: string;
    category: ResourceCategory;
    type: ResourceType;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    notes?: string;
    requirements?: string;
    contactInfo?: string;
    lastUpdated: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type ResourceCategory =
    | 'PUBLIC_MEALS'
    | 'FREE_FRIDGES_PANTRIES'
    | 'EMERGENCY_FOOD'
    | 'STUDENT_MEALS'
    | 'CHURCH_PANTRIES'
    | 'FOOD_DELIVERY'
    | 'LOCAL_EFFORTS'
    | 'ADDITIONAL_RESOURCES';

export type ResourceType =
    | 'BREAKFAST'
    | 'LUNCH'
    | 'DINNER'
    | 'PANTRY'
    | 'DELIVERY'
    | 'MARKET'
    | 'PROGRAM'
    | 'OTHER';

export interface VolunteerOpportunity {
    id: string;
    title: string;
    description?: string;
    category: VolunteerCategory;
    type: VolunteerType;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    notes?: string;
    requirements?: string;
    contactInfo?: string;
    timeCommitment?: string;
    skills?: string;
    lastUpdated: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type VolunteerCategory =
    | 'FOOD_PREPARATION'
    | 'FOOD_DISTRIBUTION'
    | 'COMMUNITY_GARDENS'
    | 'ADMINISTRATIVE'
    | 'FUNDRAISING'
    | 'OUTREACH'
    | 'EDUCATION'
    | 'TRANSPORTATION'
    | 'EVENT_COORDINATION'
    | 'OTHER';

export type VolunteerType =
    | 'ONE_TIME'
    | 'RECURRING'
    | 'SEASONAL'
    | 'FLEXIBLE'
    | 'REMOTE'
    | 'ON_SITE'
    | 'LEADERSHIP'
    | 'TRAINING_PROVIDED';

export interface LoginData {
    email: string;
    password: string;
}

export interface CreateResourceData {
    title: string;
    description?: string;
    category: ResourceCategory;
    type: ResourceType;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    notes?: string;
    requirements?: string;
    contactInfo?: string;
    isActive?: boolean;
}

export interface CreateVolunteerData {
    title: string;
    description?: string;
    category: VolunteerCategory;
    type: VolunteerType;
    location?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    notes?: string;
    requirements?: string;
    contactInfo?: string;
    timeCommitment?: string;
    skills?: string;
    isActive?: boolean;
}

// Auth API
export const authAPI = {
    login: async (data: LoginData) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    createAdmin: async (data: LoginData) => {
        const response = await api.post('/auth/create-admin', data);
        return response.data;
    }
};

// Resources API
export const resourcesAPI = {
    getAll: async (): Promise<{ resources: Resource[] }> => {
        const response = await api.get('/resources');
        return response.data;
    },

    getAllAdmin: async (): Promise<{ resources: Resource[] }> => {
        const response = await api.get('/resources/admin');
        return response.data;
    },

    getByCategory: async (
        category: string
    ): Promise<{ resources: Resource[] }> => {
        const response = await api.get(`/resources/category/${category}`);
        return response.data;
    },

    getById: async (id: string): Promise<{ resource: Resource }> => {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    },

    create: async (
        data: CreateResourceData
    ): Promise<{ message: string; resource: Resource }> => {
        const response = await api.post('/resources', data);
        return response.data;
    },

    update: async (
        id: string,
        data: Partial<CreateResourceData>
    ): Promise<{ message: string; resource: Resource }> => {
        const response = await api.put(`/resources/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
};

// Volunteer Opportunities API
export const volunteersAPI = {
    getAll: async (): Promise<{ volunteers: VolunteerOpportunity[] }> => {
        const response = await api.get('/volunteers');
        return response.data;
    },

    getAllAdmin: async (): Promise<{ volunteers: VolunteerOpportunity[] }> => {
        const response = await api.get('/volunteers/admin');
        return response.data;
    },

    getByCategory: async (
        category: string
    ): Promise<{ volunteers: VolunteerOpportunity[] }> => {
        const response = await api.get(`/volunteers/category/${category}`);
        return response.data;
    },

    getById: async (
        id: string
    ): Promise<{ volunteer: VolunteerOpportunity }> => {
        const response = await api.get(`/volunteers/${id}`);
        return response.data;
    },

    create: async (
        data: CreateVolunteerData
    ): Promise<{ message: string; volunteer: VolunteerOpportunity }> => {
        const response = await api.post('/volunteers', data);
        return response.data;
    },

    update: async (
        id: string,
        data: Partial<CreateVolunteerData>
    ): Promise<{ message: string; volunteer: VolunteerOpportunity }> => {
        const response = await api.put(`/volunteers/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<{ message: string }> => {
        const response = await api.delete(`/volunteers/${id}`);
        return response.data;
    }
};

export default api;

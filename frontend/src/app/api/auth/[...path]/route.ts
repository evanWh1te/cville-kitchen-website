import { NextRequest } from 'next/server';
import { proxyRequest } from '../../_utils/proxy';

// Handles /api/auth/login, /api/auth/logout, /api/auth/me, /api/auth/create-admin
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const suffix = '/' + path.join('/');
    return proxyRequest(req, `/auth${suffix}`);
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const suffix = '/' + path.join('/');
    return proxyRequest(req, `/auth${suffix}`);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const suffix = '/' + path.join('/');
    return proxyRequest(req, `/auth${suffix}`);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const suffix = '/' + path.join('/');
    return proxyRequest(req, `/auth${suffix}`);
}

import { NextRequest } from 'next/server';
import { proxyRequest } from '../_utils/proxy';

// Root auth route currently unused (placeholder for future)
export async function GET(req: NextRequest) {
    return proxyRequest(req, '/auth');
}

export async function POST(req: NextRequest) {
    // Could be create-admin if hitting /api/auth directly
    return proxyRequest(req, '/auth');
}

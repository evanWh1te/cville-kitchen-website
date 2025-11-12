import { NextRequest } from 'next/server';
import { proxyRequest } from '../_utils/proxy';

export async function GET(req: NextRequest) {
    return proxyRequest(req, '/resources');
}

export async function POST(req: NextRequest) {
    return proxyRequest(req, '/resources');
}

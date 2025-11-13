import { NextRequest } from 'next/server';
import { proxyRequest } from '../_utils/proxy';

// Contact form submission (POST) and potential GET listing (if added later)
export async function POST(req: NextRequest) {
    return proxyRequest(req, '/contact');
}

export async function GET(req: NextRequest) {
    return proxyRequest(req, '/contact');
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INTERNAL_BASE = (
    process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3001/api'
).replace(/\/$/, '');

export async function proxyRequest(req: NextRequest, path: string) {
    const url = `${INTERNAL_BASE}${path.startsWith('/') ? path : `/${path}`}`;

    const initHeaders = buildForwardHeaders(req);
    const bodyAllowed = req.method !== 'GET' && req.method !== 'HEAD';
    const body = bodyAllowed ? await getBody(req) : undefined;

    const res = await fetch(url, {
        method: req.method,
        headers: initHeaders,
        body,
        credentials: 'include',
        redirect: 'manual',
        cache: 'no-store'
    });

    const out = new NextResponse(res.body, { status: res.status });

    // Copy headers except hop-by-hop and set-cookie (handled separately)
    res.headers.forEach((v, k) => {
        const key = k.toLowerCase();
        if (
            key === 'set-cookie' ||
            key === 'transfer-encoding' ||
            key === 'connection'
        )
            return;
        out.headers.set(k, v);
    });

    // Forward all Set-Cookie headers
    const setCookies: string[] =
        (res.headers as any).getSetCookie?.() ||
        (res.headers as any).getAll?.('set-cookie') ||
        (res.headers.get('set-cookie')
            ? res.headers.get('set-cookie')!.split(/,(?=[^;=]+=[^;]+)/)
            : []);
    out.headers.delete('set-cookie');
    for (const c of setCookies) out.headers.append('set-cookie', c);

    // Prevent caching of proxied responses
    out.headers.set('Cache-Control', 'no-store');
    return out;
}

async function getBody(req: NextRequest): Promise<BodyInit | undefined> {
    if (req.method === 'GET' || req.method === 'HEAD') return undefined;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const json = await req.json();
        return JSON.stringify(json);
    }
    if (
        contentType.includes('application/x-www-form-urlencoded') ||
        contentType.includes('multipart/form-data')
    ) {
        // Pass through as-is
        return req.body as any;
    }
    // Fallback to text
    const text = await req.text();
    return text;
}

function buildForwardHeaders(req: NextRequest): HeadersInit {
    const headers: Record<string, string> = {};
    // Forward content-type and accept; include cookies for auth
    const keys = ['content-type', 'accept', 'authorization', 'cookie'];
    for (const key of keys) {
        const v = req.headers.get(key);
        if (v) headers[key] = v;
    }
    return headers;
}

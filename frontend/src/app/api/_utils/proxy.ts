import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { PUBLIC_DATA_TAGS } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

const INTERNAL_BASE = (
    process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3001/api'
).replace(/\/$/, '');

// Admin writes to these backend paths change what the public listing pages
// show, so a successful write drops the cached copy the pages read from.
const CACHE_TAG_BY_PREFIX: ReadonlyArray<[string, string]> = [
    ['/resources', PUBLIC_DATA_TAGS.resources],
    ['/volunteers', PUBLIC_DATA_TAGS.volunteers]
];

function revalidatePublicDataFor(path: string) {
    const match = CACHE_TAG_BY_PREFIX.find(
        ([prefix]) => path === prefix || path.startsWith(`${prefix}/`)
    );
    if (match) {
        // 'max' fully purges the entry. updateTag would be the alternative but
        // it is only callable from a Server Action, not a route handler.
        revalidateTag(match[1], 'max');
    }
}

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

    // Only a write that the backend actually accepted should clear the cache.
    if (bodyAllowed && res.status < 400) {
        revalidatePublicDataFor(
            path.startsWith('/') ? path : `/${path}`
        );
    }

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

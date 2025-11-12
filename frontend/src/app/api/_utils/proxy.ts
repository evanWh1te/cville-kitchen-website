import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_BASE =
    process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:3001/api';

export async function proxyRequest(req: NextRequest, path: string) {
    const url = `${INTERNAL_BASE}${path.startsWith('/') ? path : `/${path}`}`;

    const init: RequestInit = {
        method: req.method,
        headers: buildForwardHeaders(req),
        // Only pass body for methods that support it
        body: await getBody(req)
        // Keep credentials internal to the container
        // Do not use 'credentials' here; Next fetch will run server-side
    };

    const res = await fetch(url, init);
    const contentType = res.headers.get('content-type') || '';
    const isJSON = contentType.includes('application/json');
    const payload = isJSON ? await res.json() : await res.text();

    // Build response mirroring status and headers as reasonably as possible
    const nextRes = isJSON
        ? NextResponse.json(payload, { status: res.status })
        : new NextResponse(payload, { status: res.status });

    // Forward set-cookie headers if any (for auth routes)
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
        nextRes.headers.set('set-cookie', setCookie);
    }

    return nextRes;
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

// Debug route to inspect incoming cookies/headers. Enabled only when DEBUG_COOKIES=true.
// DO NOT enable in production environments.
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    if (process.env.DEBUG_COOKIES !== 'true') {
        return new Response('Not found', { status: 404 });
    }

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        headers[key] = value;
    });

    const cookies = req.cookies
        .getAll()
        .map((c) => ({ name: c.name, value: c.value }));

    return new Response(
        JSON.stringify({
            url: req.url,
            method: req.method,
            headers,
            cookies,
            note: 'Remove DEBUG_COOKIES or delete this route after diagnosing authentication issues.'
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        }
    );
}

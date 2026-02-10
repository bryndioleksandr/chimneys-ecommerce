import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const tag = request.nextUrl.searchParams.get('tag');

    if (tag) {
        revalidateTag(tag, 'max');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    return NextResponse.json({
        revalidated: false,
        now: Date.now(),
        message: 'Missing tag param',
    });
}

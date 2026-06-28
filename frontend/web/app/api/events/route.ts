import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  // Placeholder ingestion endpoint. Real implementation lands with backend.
  return NextResponse.json({ ok: true });
}

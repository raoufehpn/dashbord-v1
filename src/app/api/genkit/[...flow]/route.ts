/**
 * @fileoverview This file creates a Next.js API route handler for Genkit.
 *
 * It imports all the flow files from the same directory and exports them
 * so that they can be served as API routes.
 */
'use server';
// import '@/ai/flows/suggest-tasks-flow';
// import {nextJS} from '@genkit-ai/next';

// NOTE: The Genkit integration is temporarily disabled to resolve deployment issues.
// export const {GET, POST} = nextJS();

import {NextResponse} from 'next/server';

export async function GET() {
  return NextResponse.json(
    {error: 'This feature is temporarily unavailable.'},
    {status: 503}
  );
}

export async function POST() {
  return NextResponse.json(
    {error: 'This feature is temporarily unavailable.'},
    {status: 503}
  );
}

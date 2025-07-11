/**
 * @fileoverview This file creates a Next.js API route handler for Genkit.
 *
 * It imports all the flow files from the same directory and exports them
 * so that they can be served as API routes.
 */
'use server';
import '@/ai/dev';
import {nextJS} from '@genkit-ai/next';
export const {GET, POST} = nextJS();

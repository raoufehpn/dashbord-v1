
import {run} from 'genkit/dev';
import './flows/suggest-tasks-flow';

// The run() command is for the local dev server only.
// It is removed to allow for deployment on platforms like Vercel.
if (process.env.NODE_ENV === 'development') {
  run();
}

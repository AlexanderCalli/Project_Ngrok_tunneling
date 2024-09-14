import { NextResponse } from 'next/server';

export const runtime = 'edge';

// This is a temporary solution. In a production environment,
// you should use a database or external storage service.
const TEMP_STORAGE = new Map();

export async function POST(request: Request) {
  const body = await request.json();
  const jobId = Date.now().toString();

  // Start the image generation process asynchronously
  generateImage(jobId, body);

  return NextResponse.json({ jobId });
}

async function generateImage(jobId: string, params: Record<string, unknown>) {
  const apiUrl = process.env.API_URL || 'http://localhost:5000';

  try {
    const response = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    TEMP_STORAGE.set(jobId, { status: 'completed', data });
  } catch (error) {
    console.error('Error generating image:', error);
    TEMP_STORAGE.set(jobId, { status: 'error', error: 'Failed to generate image' });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
  }

  const job = TEMP_STORAGE.get(jobId);

  if (!job) {
    return NextResponse.json({ status: 'pending' });
  }

  if (job.status === 'completed') {
    TEMP_STORAGE.delete(jobId); // Clean up the job data
    return NextResponse.json(job.data);
  }

  if (job.status === 'error') {
    TEMP_STORAGE.delete(jobId); // Clean up the job data
    return NextResponse.json({ error: job.error }, { status: 500 });
  }

  return NextResponse.json({ status: 'pending' });
}
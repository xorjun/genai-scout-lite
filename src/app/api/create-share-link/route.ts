import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

interface AnalysisData {
  topic: string;
  summary: string;
  marketTrends: string;
  keyPlayers: string;
  useCases: string;
  challenges: string;
  createdAt?: string;
}

// In a real application, you would store this in a database
// For this demo, we'll use a simple in-memory store
const shareLinks = new Map<string, AnalysisData>();

export async function POST(request: NextRequest) {
  try {
    const analysisData = await request.json();

    if (!analysisData || !analysisData.topic) {
      return NextResponse.json({ error: 'Analysis data is required' }, { status: 400 });
    }

    // Generate a unique hash for the analysis
    const dataString = JSON.stringify(analysisData);
    const hash = createHash('sha256').update(dataString).digest('hex').substring(0, 16);

    // Store the analysis data with the hash as key
    shareLinks.set(hash, {
      ...analysisData,
      createdAt: new Date().toISOString(),
    });

    // Generate the shareable URL
    const baseUrl = request.headers.get('host') ? 
      `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}` :
      'http://localhost:3000';
    
    const shareableUrl = `${baseUrl}/share/${hash}`;

    return NextResponse.json({
      shareableUrl,
      shareId: hash,
    });

  } catch (error) {
    console.error('Share link creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create shareable link' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const shareId = url.pathname.split('/').pop();

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    const analysisData = shareLinks.get(shareId);

    if (!analysisData) {
      return NextResponse.json({ error: 'Share link not found or expired' }, { status: 404 });
    }

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error('Share link retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared analysis' },
      { status: 500 }
    );
  }
}

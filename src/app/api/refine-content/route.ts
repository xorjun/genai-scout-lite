import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content, action, context } = await request.json();

    if (!content || !action) {
      return NextResponse.json({ error: 'Content and action are required' }, { status: 400 });
    }

    let prompt = '';

    switch (action) {
      case 'refine':
        prompt = `Please refine and improve the following text about "${context}". Make it more professional, accurate, and comprehensive while maintaining the same information structure:

${content}

Refined version:`;
        break;
      case 'simplify':
        prompt = `Please simplify the following text about "${context}". Make it easier to understand, use simpler language, and reduce complexity while keeping the key information:

${content}

Simplified version:`;
        break;
      case 'expand':
        prompt = `Please expand and provide more detail for the following text about "${context}". Add more context, examples, and comprehensive information:

${content}

Expanded version:`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.5,
      max_tokens: 2000,
    });

    const refinedContent = completion.choices[0]?.message?.content || content;

    return NextResponse.json({
      refinedContent: refinedContent.trim(),
    });

  } catch (error) {
    console.error('Refinement error:', error);
    return NextResponse.json(
      { error: 'Failed to refine content' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `
Analyze the technology topic: "${topic}"

Please provide a comprehensive analysis in the following format:

**Technology Overview:**
[Provide a detailed summary of what this technology is, its core principles, and its significance in the current technological landscape]

**Market Trends:**
[Analyze current market trends, adoption rates, growth projections, and emerging developments in this technology space]

**Key Players:**
[Identify and describe the main companies, organizations, and thought leaders driving innovation in this field]

**Use Cases:**
[List and explain the primary applications, industries using this technology, and specific implementation examples]

**Challenges:**
[Outline the main technical, economic, regulatory, or adoption challenges facing this technology]

Please ensure each section is detailed, informative, and based on current industry knowledge. Write in a professional, analytical tone suitable for business intelligence reports.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Parse the response into sections
    const sections = {
      summary: '',
      marketTrends: '',
      keyPlayers: '',
      useCases: '',
      challenges: '',
    };

    // Extract sections from the response
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('**Technology Overview:**') || trimmedLine.includes('Technology Overview:')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof typeof sections] = currentContent.trim();
        }
        currentSection = 'summary';
        currentContent = '';
      } else if (trimmedLine.includes('**Market Trends:**') || trimmedLine.includes('Market Trends:')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof typeof sections] = currentContent.trim();
        }
        currentSection = 'marketTrends';
        currentContent = '';
      } else if (trimmedLine.includes('**Key Players:**') || trimmedLine.includes('Key Players:')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof typeof sections] = currentContent.trim();
        }
        currentSection = 'keyPlayers';
        currentContent = '';
      } else if (trimmedLine.includes('**Use Cases:**') || trimmedLine.includes('Use Cases:')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof typeof sections] = currentContent.trim();
        }
        currentSection = 'useCases';
        currentContent = '';
      } else if (trimmedLine.includes('**Challenges:**') || trimmedLine.includes('Challenges:')) {
        if (currentSection && currentContent) {
          sections[currentSection as keyof typeof sections] = currentContent.trim();
        }
        currentSection = 'challenges';
        currentContent = '';
      } else if (currentSection && trimmedLine) {
        currentContent += line + '\n';
      }
    }

    // Add the last section
    if (currentSection && currentContent) {
      sections[currentSection as keyof typeof sections] = currentContent.trim();
    }

    // Fallback if parsing fails - use the entire content as summary
    if (!sections.summary && !sections.marketTrends && !sections.keyPlayers && !sections.useCases && !sections.challenges) {
      const parts = content.split('\n\n');
      sections.summary = parts.slice(0, 2).join('\n\n');
      sections.marketTrends = parts.slice(2, 4).join('\n\n');
      sections.keyPlayers = parts.slice(4, 6).join('\n\n');
      sections.useCases = parts.slice(6, 8).join('\n\n');
      sections.challenges = parts.slice(8).join('\n\n');
    }

    return NextResponse.json({
      topic,
      summary: sections.summary || 'Analysis not available for this section.',
      marketTrends: sections.marketTrends || 'Market trends analysis not available.',
      keyPlayers: sections.keyPlayers || 'Key players information not available.',
      useCases: sections.useCases || 'Use cases information not available.',
      challenges: sections.challenges || 'Challenges analysis not available.',
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze topic' },
      { status: 500 }
    );
  }
}

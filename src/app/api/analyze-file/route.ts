import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();
    
    // Extract topic from filename or content
    const topic = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    const prompt = `
Analyze the following document content and extract technology-related insights:

Document: ${file.name}
Content: ${fileContent.substring(0, 8000)} ${fileContent.length > 8000 ? '...' : ''}

Based on this document, provide a comprehensive technology analysis in the following format:

**Technology Overview:**
[Provide a detailed summary of the technology topics discussed in this document]

**Market Trends:**
[Analyze any market trends, business implications, or industry developments mentioned]

**Key Players:**
[Identify companies, organizations, or individuals mentioned as important in this technology space]

**Use Cases:**
[Extract specific applications, implementations, or use cases described in the document]

**Challenges:**
[Identify any challenges, limitations, or problems discussed regarding the technology]

Please ensure each section is detailed and based on the content provided. If certain information is not available in the document, indicate that clearly.
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
    
    // Parse the response into sections (same logic as topic analysis)
    const sections = {
      summary: '',
      marketTrends: '',
      keyPlayers: '',
      useCases: '',
      challenges: '',
    };

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

    if (currentSection && currentContent) {
      sections[currentSection as keyof typeof sections] = currentContent.trim();
    }

    // Fallback if parsing fails
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
    console.error('File analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze file' },
      { status: 500 }
    );
  }
}

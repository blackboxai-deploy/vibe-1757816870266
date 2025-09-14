import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = '', aspectRatio = 'square', quality = 'standard', model = 'replicate/black-forest-labs/flux-1.1-pro' } = await request.json();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhance prompt based on style and settings
    let enhancedPrompt = prompt.trim();
    
    // Add style modifiers
    const styleModifiers = {
      photorealistic: 'photorealistic, highly detailed, professional photography',
      artistic: 'artistic, creative, stylized, beautiful art',
      minimalist: 'minimalist, clean, simple, elegant design',
      vintage: 'vintage style, retro, aged, nostalgic',
      cyberpunk: 'cyberpunk, neon, futuristic, sci-fi',
      fantasy: 'fantasy art, magical, ethereal, mystical',
      abstract: 'abstract art, modern, contemporary, conceptual'
    };

    if (style && styleModifiers[style as keyof typeof styleModifiers]) {
      enhancedPrompt += `, ${styleModifiers[style as keyof typeof styleModifiers]}`;
    }

    // Add quality modifiers
    if (quality === 'high') {
      enhancedPrompt += ', ultra high quality, 8k resolution, masterpiece';
    } else if (quality === 'standard') {
      enhancedPrompt += ', high quality, detailed';
    }

    // Add aspect ratio considerations
    const aspectRatioPrompts = {
      portrait: ', vertical composition, portrait orientation',
      landscape: ', horizontal composition, landscape orientation',
      square: ', square composition, balanced framing',
      widescreen: ', cinematic wide shot, panoramic view'
    };

    if (aspectRatio && aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts]) {
      enhancedPrompt += aspectRatioPrompts[aspectRatio as keyof typeof aspectRatioPrompts];
    }

    // Make request to custom AI endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_T39mlAKKBukUrf',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate image', 
          details: `API returned ${response.status}: ${errorText}`,
          retryable: response.status >= 500 || response.status === 429
        },
        { status: response.status >= 500 ? 500 : 400 }
      );
    }

    const data = await response.json();
    
    // Extract image URL from response
    let imageUrl = null;
    
    // Handle different possible response formats
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      
      // Try to extract URL from content string
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)/i);
      if (urlMatch) {
        imageUrl = urlMatch[0];
      } else {
        // If no URL found, the content might be the URL itself
        if (content.startsWith('http')) {
          imageUrl = content.trim();
        }
      }
    } else if (data.url) {
      imageUrl = data.url;
    } else if (data.image_url) {
      imageUrl = data.image_url;
    } else if (typeof data === 'string' && data.startsWith('http')) {
      imageUrl = data;
    }

    if (!imageUrl) {
      console.error('No image URL found in response:', data);
      return NextResponse.json(
        { 
          error: 'No image URL in response', 
          details: 'The AI service returned a response but no image URL was found',
          responseData: data
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      settings: {
        style,
        aspectRatio,
        quality,
        model
      },
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        retryable: true
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
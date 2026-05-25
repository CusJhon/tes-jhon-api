import { NextRequest, NextResponse } from 'next/server'
import { generateGoPayImage } from '@/lib/generators/gopay-generator'
import { generateDanaImage } from '@/lib/generators/dana-generator'
import { generateCallImage } from '@/lib/generators/call-generator'
import { generateIGStoryImage } from '@/lib/generators/ig-generator'
import { generateNokiaQuote } from '@/lib/generators/nokia-generator'
import { generateReminder } from '@/lib/generators/reminder-generator'

const generators: Record<string, any> = {
  'fake-gopay': generateGoPayImage,
  'fake-dana': generateDanaImage,
  'fake-call': generateCallImage,
  'fake-ig': generateIGStoryImage,
  'quote-nokia': generateNokiaQuote,
  'reminder': generateReminder,
}

const contentTypes: Record<string, string> = {
  'fake-gopay': 'image/jpeg',
  'fake-dana': 'image/png',
  'fake-call': 'image/png',
  'fake-ig': 'image/png',
  'quote-nokia': 'image/png',
  'reminder': 'image/jpeg',
}

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const endpoint = params.slug[0]
    
    if (!generators[endpoint]) {
      return NextResponse.json(
        { error: `Endpoint "${endpoint}" not found`, available_endpoints: Object.keys(generators) },
        { status: 404 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    let processedParams: any

    switch (endpoint) {
      case 'fake-gopay':
        processedParams = {
          saldo: searchParams.get('saldo') || undefined,
          koin: searchParams.get('koin') || undefined,
          bulan: searchParams.get('bulan') || undefined,
          terpakai: searchParams.get('terpakai') || undefined,
        }
        break
        
      case 'fake-dana':
        const saldo = searchParams.get('saldo')
        if (!saldo) {
          return NextResponse.json({ error: 'Parameter "saldo" is required' }, { status: 400 })
        }
        const saldoNum = parseInt(saldo)
        if (isNaN(saldoNum)) {
          return NextResponse.json({ error: 'Parameter "saldo" must be a number' }, { status: 400 })
        }
        processedParams = saldoNum
        break
        
      case 'fake-call':
        processedParams = {
          name: searchParams.get('name') || undefined,
          duration: searchParams.get('duration') || undefined,
          avatar: searchParams.get('avatar') || undefined,
        }
        break
        
      case 'fake-ig':
        const text = searchParams.get('text')
        if (!text) {
          return NextResponse.json({ error: 'Parameter "text" is required' }, { status: 400 })
        }
        processedParams = {
          text,
          name: searchParams.get('name') || undefined,
          avatar: searchParams.get('avatar') || undefined,
        }
        break
        
      case 'quote-nokia':
        const quoteText = searchParams.get('text')
        if (!quoteText) {
          return NextResponse.json({ error: 'Parameter "text" is required' }, { status: 400 })
        }
        processedParams = {
          text: quoteText,
          sender: searchParams.get('sender') || undefined,
        }
        break
        
      case 'reminder':
        const reminderText = searchParams.get('text')
        if (!reminderText) {
          return NextResponse.json({ error: 'Parameter "text" is required' }, { status: 400 })
        }
        processedParams = {
          text: reminderText,
          author: searchParams.get('author') || undefined,
        }
        break
        
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
    }

    const imageBuffer = await generators[endpoint](processedParams)
    const ext = contentTypes[endpoint].split('/')[1]

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentTypes[endpoint],
        'Content-Disposition': `attachment; filename="generated_${endpoint}.${ext}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
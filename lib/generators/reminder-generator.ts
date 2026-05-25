import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

const FONT_URL = 'https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/CrimsonText-Regular.ttf'
const BG_URL = 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/image/reminder.jpeg'
const PADDING_RATIO = 0.15
const FOOTER_RATIO = 0.12
const QUOTE_COLOR = '#1a1a1a'
const FONT_SIZE_MAX = 60
const FONT_SIZE_MIN = 20

function getTempDir(): string {
    const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir()
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    return tempDir
}

function calcFontSize(ctx: any, text: string, maxWidth: number, maxHeight: number, fontName: string): number {
    const words = text.split(' ')

    for (let size = FONT_SIZE_MAX; size >= FONT_SIZE_MIN; size -= 1) {
        ctx.font = `${size}px ${fontName}`
        const lineHeight = size * 1.35

        let lines = 0
        let currentLine: string[] = []

        words.forEach(word => {
            const testLine = [...currentLine, word].join(' ').replace(/[\[\]]/g, '')
            if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
                lines++
                currentLine = [word]
            } else {
                currentLine.push(word)
            }
        })
        lines++

        if (lines * lineHeight <= maxHeight) return size
    }

    return FONT_SIZE_MIN
}

function drawTextJustified(ctx: any, text: string, centerX: number, centerY: number, maxWidth: number, fontSize: number) {
    const lineHeight = fontSize * 1.35
    const words = text.split(' ')
    let lines: string[][] = []
    let currentLine: string[] = []

    words.forEach(word => {
        const testLine = [...currentLine, word].join(' ').replace(/[\[\]]/g, '')
        if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine)
            currentLine = [word]
        } else {
            currentLine.push(word)
        }
    })
    lines.push(currentLine)

    let startY = centerY - ((lines.length - 1) * lineHeight) / 2

    lines.forEach((line, index) => {
        const isLastLine = index === lines.length - 1

        const lineParts = line.map(word => {
            const match = word.match(/^\[(.+?)\]([^\w]*)$/)
            if (match) {
                const highlighted = match[1]
                const trailing = match[2]
                const hlWidth = ctx.measureText(highlighted).width
                const trailWidth = ctx.measureText(trailing).width
                return { content: highlighted, trailing, isHighlight: true, width: hlWidth + trailWidth, hlWidth }
            }
            return { content: word, trailing: '', isHighlight: false, width: ctx.measureText(word).width, hlWidth: 0 }
        })

        const totalWordsWidth = lineParts.reduce((sum, p) => sum + p.width, 0)
        let currentX: number, spaceWidth: number

        if (!isLastLine && line.length > 1) {
            spaceWidth = (maxWidth - totalWordsWidth) / (line.length - 1)
            currentX = centerX - maxWidth / 2
        } else {
            const standardSpace = ctx.measureText(' ').width
            spaceWidth = standardSpace
            currentX = centerX - (totalWordsWidth + standardSpace * (line.length - 1)) / 2
        }

        lineParts.forEach(part => {
            if (part.isHighlight) {
                ctx.fillStyle = 'rgba(212, 225, 87, 0.85)'
                ctx.fillRect(currentX, startY - fontSize * 0.45, part.hlWidth, fontSize * 0.95)
            }
            ctx.fillStyle = QUOTE_COLOR
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'left'
            ctx.fillText(part.content, currentX, startY)
            if (part.trailing) {
                ctx.fillText(part.trailing, currentX + part.hlWidth, startY)
            }
            currentX += part.width + spaceWidth
        })

        startY += lineHeight
    })
}

interface ReminderParams {
    text: string
    author?: string
}

export async function generateReminder(params: ReminderParams): Promise<Buffer> {
    const tmpDir = getTempDir()
    const fontPath = path.join(tmpDir, 'font.ttf')
    const bgPath = path.join(tmpDir, 'bg.jpg')

    // Download files
    const [fontBuffer, bgBuffer] = await Promise.all([
        axios.get(FONT_URL, { responseType: 'arraybuffer' }).then(r => r.data),
        axios.get(BG_URL, { responseType: 'arraybuffer' }).then(r => r.data),
    ])

    fs.writeFileSync(fontPath, Buffer.from(fontBuffer))
    fs.writeFileSync(bgPath, Buffer.from(bgBuffer))

    GlobalFonts.register(fs.readFileSync(fontPath), 'CrimsonText')
    const bg = await loadImage(bgPath)

    const canvas = createCanvas(bg.width, bg.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0)

    const padding = canvas.width * PADDING_RATIO
    const footerHeight = canvas.height * FOOTER_RATIO
    const centerX = canvas.width / 2
    const maxWidth = canvas.width - padding * 2
    const quoteAreaTop = padding
    const quoteAreaHeight = canvas.height - footerHeight - quoteAreaTop
    const quoteAreaCenterY = quoteAreaTop + quoteAreaHeight / 2

    const fontSize = calcFontSize(ctx, params.text, maxWidth, quoteAreaHeight, 'CrimsonText')
    ctx.font = `${fontSize}px CrimsonText`

    drawTextJustified(ctx, params.text, centerX, quoteAreaCenterY, maxWidth, fontSize)

    const author = params.author || 'Someone'
    ctx.font = '26px CrimsonText'
    ctx.fillStyle = QUOTE_COLOR
    ctx.textAlign = 'center'
    ctx.fillText(author, centerX, canvas.height - footerHeight / 2)

    // Cleanup
    try {
        if (fs.existsSync(fontPath)) fs.unlinkSync(fontPath)
        if (fs.existsSync(bgPath)) fs.unlinkSync(bgPath)
        if (fs.existsSync(tmpDir)) fs.rmdirSync(tmpDir, { recursive: true })
    } catch (e) {
        // Ignore cleanup errors
    }

    return canvas.toBuffer('image/jpeg')
}
import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import fs from 'fs'
import path from 'path'
import os from 'os'

const WIDTH = 1086
const HEIGHT = 1448

const BG_URL = 'https://raw.githubusercontent.com/CusJhon/Assets/main/image/file_00000000a9f47208a295c9c984f92b7a.jpeg'
const FONT_URL = 'https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/nokia-6000-series-medium.ttf'

function getTempDir(): string {
    const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir()
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    return tempDir
}

async function downloadFile(url: string, dest: string): Promise<void> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`)
    const buf = Buffer.from(await response.arrayBuffer())
    fs.writeFileSync(dest, buf)
}

interface NokiaQuoteParams {
    text: string
    sender?: string
}

export async function generateNokiaQuote(params: NokiaQuoteParams): Promise<Buffer> {
    const tmpDir = getTempDir()
    const fontDir = path.join(tmpDir, 'fonts')
    const imgDir = path.join(tmpDir, 'assets')

    if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true })
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true })

    const fontPath = path.join(fontDir, 'nokia.ttf')
    const bgPath = path.join(imgDir, 'bg.jpg')

    await downloadFile(FONT_URL, fontPath)
    await downloadFile(BG_URL, bgPath)

    FontLibrary.use('FontNokia', [fontPath])

    const canvas = new Canvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    const bg = await loadImage(bgPath)
    ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT)

    const sender = params.sender || 'Jhon'

    // Draw header with fake bold effect
    ctx.fillStyle = '#E8F0F0'
    ctx.font = `130px FontNokia`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= 4; i++) {
        ctx.fillText(sender, 543 + i, 200)
    }

    // Wrap and draw body text
    const maxW = 900
    const words = params.text.split(' ')
    let lines: string[] = []
    let currentLine = ''

    for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word
        ctx.font = `63px FontNokia`
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxW && currentLine) {
            lines.push(currentLine)
            currentLine = word
        } else {
            currentLine = testLine
        }
    }
    if (currentLine) lines.push(currentLine)

    let y = 350
    ctx.font = `63px FontNokia`
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    for (const line of lines) {
        ctx.fillText(line, 80, y)
        y += 110
    }

    // Draw info
    const date = new Date().toLocaleDateString('id-ID')
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

    ctx.font = `48px FontNokia`
    ctx.fillStyle = '#000000'
    ctx.fillText('Dari:', 80, y + 40)
    ctx.fillText(sender, 80, y + 120)
    ctx.fillText(date, 80, y + 200)
    ctx.fillText(time, 80, y + 280)

    // Cleanup
    try {
        if (fs.existsSync(fontPath)) fs.unlinkSync(fontPath)
        if (fs.existsSync(bgPath)) fs.unlinkSync(bgPath)
        if (fs.existsSync(fontDir)) fs.rmdirSync(fontDir, { recursive: true })
        if (fs.existsSync(imgDir)) fs.rmdirSync(imgDir, { recursive: true })
    } catch (e) {
        // Ignore cleanup errors
    }

    return await canvas.toBuffer('png')
}
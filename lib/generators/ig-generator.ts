import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function ensureFile(url: string, filePath: string) {
    if (!fs.existsSync(filePath)) {
        const res = await fetch(url)
        const buf = Buffer.from(await res.arrayBuffer())
        fs.writeFileSync(filePath, buf)
    }
}

function getTempDir(): string {
    const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir()
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    return tempDir
}

interface IGStoryParams {
    text: string
    name?: string
    avatar?: string
}

export async function generateIGStoryImage(params: IGStoryParams): Promise<Buffer> {
    const tmpDir = getTempDir()
    const fontDir = path.join(tmpDir, 'fonts')
    if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true })

    const fontSBPath = path.join(fontDir, 'Inter-SemiBold.otf')
    const fontBPath = path.join(fontDir, 'Inter-Bold.otf')
    const bgPath = path.join(tmpDir, 'bg-template.jpg')

    await ensureFile('https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/Inter-SemiBold.otf', fontSBPath)
    await ensureFile('https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/Inter-Bold.otf', fontBPath)
    await ensureFile('https://raw.githubusercontent.com/CusJhon/Assets/main/image/_20260430144912806.jpg', bgPath)

    FontLibrary.use('Inter-SB', [fontSBPath])
    FontLibrary.use('Inter-B', [fontBPath])

    let bg = await loadImage(bgPath)

    const avatarUrl = params.avatar || 'https://raw.githubusercontent.com/uploader762/dat4/main/uploads/e0f993-1777126212302.jpg'
    const avatarPath = path.join(tmpDir, `avatar_${Date.now()}.jpg`)
    await ensureFile(avatarUrl, avatarPath)
    let avatar = await loadImage(avatarPath)

    let canvas = new Canvas(bg.width, bg.height)
    let ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(bg, 0, 0)

    let header = { x: 115, y: 388, gap: 25 }
    let p = { cx: header.x, cy: header.y, r: 68 }

    const SAFE_PADDING_X = 100
    const SAFE_PADDING_TOP = 480
    const SAFE_PADDING_BOTTOM = 480

    let safeW = bg.width - SAFE_PADDING_X * 2
    let safeH = bg.height - SAFE_PADDING_TOP - SAFE_PADDING_BOTTOM
    let safeCX = bg.width / 2
    let safeCY = (SAFE_PADDING_TOP + safeH) / 2

    let s = Math.min(avatar.width, avatar.height)
    let sx = (avatar.width - s) / 2
    let sy = (avatar.height - s) / 2

    ctx.save()
    ctx.beginPath()
    ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(avatar, sx, sy, s, s, p.cx - p.r, p.cy - p.r, p.r * 2, p.r * 2)
    ctx.restore()

    const displayName = params.name || 'Someone'
    ctx.font = 'bold 55px "Inter-SB"'
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(displayName, p.cx + p.r + header.gap, p.cy)

    function parseTokens(input: string): Array<{ text: string; red: boolean }> {
        let tokens: Array<{ text: string; red: boolean }> = []
        let regex = /\(([^)]*)\)/g
        let last = 0, match
        while ((match = regex.exec(input)) !== null) {
            if (match.index > last) tokens.push({ text: input.slice(last, match.index), red: false })
            tokens.push({ text: match[1], red: true })
            last = regex.lastIndex
        }
        if (last < input.length) tokens.push({ text: input.slice(last), red: false })
        return tokens
    }

    function wrapTokens(ctx: any, tokens: Array<{ text: string; red: boolean }>, maxWidth: number, fsz: number): Array<Array<{ text: string; red: boolean }>> {
        let lines: Array<Array<{ text: string; red: boolean }>> = []
        let curLine: Array<{ text: string; red: boolean }> = []
        let curW = 0

        let words: Array<{ text: string; red: boolean }> = []
        for (let tok of tokens) {
            let parts = tok.text.split(/(\s+)/)
            for (let p of parts) {
                if (p === '') continue
                words.push({ text: p, red: tok.red })
            }
        }

        for (let word of words) {
            if (/^\s+$/.test(word.text)) {
                if (curLine.length > 0) {
                    ctx.font = `bold ${fsz}px "Inter-SB"`
                    let spaceW = ctx.measureText(' ').width
                    curW += spaceW
                    let last = curLine[curLine.length - 1]
                    if (last.red === word.red) last.text += word.text
                    else curLine.push({ text: word.text, red: word.red })
                }
                continue
            }

            ctx.font = `bold ${fsz}px "${word.red ? 'Inter-B' : 'Inter-SB'}"`
            let wordW = ctx.measureText(word.text).width
            ctx.font = `bold ${fsz}px "Inter-SB"`
            let spaceW = ctx.measureText(' ').width

            let addW = curLine.length > 0 ? spaceW + wordW : wordW

            if (curW + addW > maxWidth && curLine.length > 0) {
                lines.push(curLine)
                curLine = [{ text: word.text, red: word.red }]
                curW = wordW
            } else {
                if (curLine.length > 0) {
                    let last = curLine[curLine.length - 1]
                    if (last.red === word.red) {
                        last.text += ' ' + word.text
                    } else {
                        curLine.push({ text: ' ', red: false })
                        curLine.push({ text: word.text, red: word.red })
                    }
                    curW += spaceW + wordW
                } else {
                    curLine.push({ text: word.text, red: word.red })
                    curW = wordW
                }
            }
        }
        if (curLine.length > 0) lines.push(curLine)
        return lines
    }

    function lineWidth(ctx: any, segments: Array<{ text: string; red: boolean }>, fsz: number): number {
        return segments.reduce((sum, seg) => {
            ctx.font = `bold ${fsz}px "${seg.red ? 'Inter-B' : 'Inter-SB'}"`
            return sum + ctx.measureText(seg.text).width
        }, 0)
    }

    function drawScaledText(ctx: any, input: string) {
        let tokens = parseTokens(input.trim())

        const MAX_FONT = 65
        const MIN_FONT = 18
        let fsz = MAX_FONT
        let lines: Array<Array<{ text: string; red: boolean }>> = []
        let totalH = 0
        let lh = 0

        do {
            lh = fsz * 1.25
            lines = wrapTokens(ctx, tokens, safeW, fsz)
            totalH = lines.length * lh
            if (totalH <= safeH) break
            fsz -= 1
        } while (fsz > MIN_FONT)

        if (totalH > safeH) {
            const maxLines = Math.floor(safeH / lh)
            lines = lines.slice(0, maxLines)
            if (lines.length > 0) {
                let lastLine = lines[lines.length - 1]
                ctx.font = `bold ${fsz}px "Inter-SB"`
                let dotsW = ctx.measureText('...').width
                while (lineWidth(ctx, lastLine, fsz) + dotsW > safeW) {
                    let last = lastLine[lastLine.length - 1]
                    if (last.text.length > 1) {
                        last.text = last.text.slice(0, -1).trimEnd()
                    } else {
                        lastLine.pop()
                        if (lastLine.length === 0) break
                    }
                }
                lastLine.push({ text: '...', red: false })
            }
            totalH = lines.length * lh
        }

        let startY = safeCY - totalH / 2 + lh / 2
        ctx.textBaseline = 'middle'

        for (let i = 0; i < lines.length; i++) {
            let segments = lines[i]
            let totalW = lineWidth(ctx, segments, fsz)
            let x = safeCX - totalW / 2
            let y = startY + i * lh

            for (let seg of segments) {
                ctx.font = `bold ${fsz}px "${seg.red ? 'Inter-B' : 'Inter-SB'}"`
                ctx.fillStyle = seg.red ? '#e51a1a' : '#000000'
                ctx.textAlign = 'left'
                ctx.fillText(seg.text, x, y)
                x += ctx.measureText(seg.text).width
            }
        }
    }

    drawScaledText(ctx, params.text)

    // Cleanup
    try {
        if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath)
        if (fs.existsSync(bgPath)) fs.unlinkSync(bgPath)
        if (fs.existsSync(fontSBPath)) fs.unlinkSync(fontSBPath)
        if (fs.existsSync(fontBPath)) fs.unlinkSync(fontBPath)
        if (fs.existsSync(fontDir)) fs.rmdirSync(fontDir, { recursive: true })
    } catch (e) {
        // Ignore cleanup errors
    }

    return await canvas.toBuffer('png')
}
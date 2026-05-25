import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import os from 'os'

const CONFIG = {
    rp: { x: 70, y: 62, fontSize: 19, color: '#a9e6ff' },
    saldo: { x: 101, y: 53, fontSize: 29, color: '#FFFFFF' },
    icon: { gap: 8, y: 64, size: 20 },
}

async function downloadFont(url: string, name: string): Promise<string> {
    const tempDir = process.env.VERCEL ? '/tmp' : os.tmpdir()
    const tmpDir = join(tempDir, 'fonts')
    if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true })
    
    const response = await fetch(url)
    const buf = Buffer.from(await response.arrayBuffer())
    const tmpPath = join(tmpDir, `${name}-${Date.now()}.ttf`)
    writeFileSync(tmpPath, buf)
    FontLibrary.use(name, [tmpPath])
    return tmpPath
}

export async function generateDanaImage(angka: number): Promise<Buffer> {
    const tmp1 = await downloadFont('https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/iconfont.ttf', 'FontRp')
    const tmp2 = await downloadFont('https://raw.githubusercontent.com/CusJhon/Assets/main/fonts/f5803c-1772975107907.ttf', 'FontSaldo')

    const bg = await loadImage('https://raw.githubusercontent.com/CusJhon/Assets/main/image/_20260501192538912.jpg')
    const eyeIcon = await loadImage('https://raw.githubusercontent.com/CusJhon/Assets/main/image/vision-off-svgrepo-com%20(1).svg')

    const canvas = new Canvas(bg.width, bg.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(bg, 0, 0)

    ctx.font = `${CONFIG.rp.fontSize}px FontRp`
    ctx.fillStyle = CONFIG.rp.color
    ctx.textBaseline = 'top'
    ctx.fillText('Rp', CONFIG.rp.x, CONFIG.rp.y)

    ctx.font = `${CONFIG.saldo.fontSize}px FontSaldo`
    ctx.fillStyle = CONFIG.saldo.color
    ctx.textBaseline = 'top'
    const formattedAngka = angka.toLocaleString('id-ID')
    ctx.fillText(formattedAngka, CONFIG.saldo.x, CONFIG.saldo.y)

    const textWidth = ctx.measureText(formattedAngka).width
    const iconX = CONFIG.saldo.x + textWidth + CONFIG.icon.gap

    ctx.save()
    ctx.filter = 'brightness(0) invert(1)'
    ctx.drawImage(eyeIcon, iconX, CONFIG.icon.y, CONFIG.icon.size, CONFIG.icon.size)
    ctx.restore()

    try {
        unlinkSync(tmp1)
        unlinkSync(tmp2)
    } catch (e) {
        // Ignore cleanup errors
    }

    return await canvas.png
}
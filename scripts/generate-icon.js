const fs = require('fs')
const path = require('path')

// SVG del icono
const svg32 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#1c1917" rx="6"/>
  <path d="M16 6C12 6 9 8 9 11c0 1.5 0.8 2.8 2 3.8-1.8 0.9-3 2.5-3 4.2 0 3 3.5 5 8 5s8-2 8-5c0-1.7-1.2-3.3-3-4.2 1.2-1 2-2.3 2-3.8 0-3-3-5-7-5zm0 2c2.5 0 4 1 4 2.5S18.5 13 16 13s-4-1-4-2.5 1.5-2.5 4-2.5zm0 7c2.5 0 5 1 5 3s-2.5 3-5 3-5-1-5-3 2.5-3 5-3z" fill="#f4f1e8"/>
</svg>`

const svg180 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" fill="#1c1917" rx="40"/>
  <path d="M90 35C70 35 55 45 55 60c0 8 4 15 11 20-9 5-16 13-16 23 0 15 18 25 40 25s40-10 40-25c0-10-7-18-16-23 7-5 11-12 11-20 0-15-15-25-35-25zm0 10c13 0 21 6 21 12s-8 12-21 12-21-6-21-12 8-12 21-12zm0 32c13 0 25 6 25 15s-12 15-25 15-25-6-25-15 12-15 25-15z" fill="#f4f1e8"/>
</svg>`

// Usar canvas de Node.js (si está disponible) o crear un PNG básico
try {
  const { createCanvas } = require('canvas')

  // Función para dibujar el icono
  function drawIcon(ctx, size) {
    const scale = size / 32
    ctx.fillStyle = '#1c1917'
    // Fondo redondeado
    roundRect(ctx, 0, 0, size, size, size * 0.19)
    ctx.fill()

    // Letra S
    ctx.fillStyle = '#f4f1e8'
    ctx.beginPath()
    const cx = size / 2
    const cy = size / 2
    const w = size * 0.56
    const h = size * 0.69
    const x = cx - w / 2
    const y = cy - h / 2
    const thick = size * 0.22

    // Parte superior de la S (arco invertido)
    ctx.arc(cx, y + thick, thick / 2, Math.PI, 0)
    ctx.arc(cx + w / 2 - thick / 2, y + thick, thick / 2, 0, Math.PI * 0.5)
    ctx.lineTo(cx + w / 2 + thick / 2, y + thick + size * 0.03)
    ctx.arc(cx + w / 2 - thick / 2, y + thick + size * 0.03 + thick / 2, thick / 2, Math.PI * 0.5, Math.PI)
    ctx.arc(cx, y + thick + size * 0.03 + thick, thick / 2, 0, -Math.PI * 0.5)
    ctx.arc(cx - w / 2 + thick / 2, y + thick + size * 0.03 + thick / 2, thick / 2, Math.PI, Math.PI * 0.5)
    ctx.lineTo(cx - w / 2 - thick / 2, y + thick + size * 0.06)
    ctx.arc(cx - w / 2 + thick / 2, y + thick + size * 0.06 + thick / 2, thick / 2, Math.PI * 0.5, 0)
    ctx.arc(cx, y + thick + size * 0.06 + thick * 1.5, thick / 2, Math.PI, 0)
    ctx.fill()

    // Agujero de arriba
    ctx.fillStyle = '#1c1917'
    ctx.beginPath()
    ctx.ellipse(cx, cy - size * 0.06, size * 0.09, size * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()

    // Agujero de abajo
    ctx.beginPath()
    ctx.ellipse(cx, cy + size * 0.06, size * 0.09, size * 0.06, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // Generar favicon.png (32x32)
  const canvas32 = createCanvas(32, 32)
  drawIcon(canvas32.getContext('2d'), 32)
  fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), canvas32.toBuffer('image/png'))

  // Generar apple-touch-icon.png (180x180)
  const canvas180 = createCanvas(180, 180)
  drawIcon(canvas180.getContext('2d'), 180)
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), canvas180.toBuffer('image/png'))

  console.log('✅ Icons generated: favicon.png (32x32) and apple-touch-icon.png (180x180)')
} catch (err) {
  console.error('Canvas not available, using basic PNG fallback...')

  // Fallback: crear PNG básico manual
  // Esto crea un PNG muy simple
  const png = require('png-js')
  console.error('Error:', err.message)
}

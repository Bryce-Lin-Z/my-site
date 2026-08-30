'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  opacity: number
  twinkleSpeed: number
  phase: number
  type: 'dot' | 'sparkle'
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, outer: number, opacity: number) {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2
    const r = i % 2 === 0 ? outer : outer * 0.35
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const offscreen = document.createElement('canvas')
  offscreen.width = r * 5
  offscreen.height = r * 5
  const mc = offscreen.getContext('2d')!
  const cx = r * 2.5
  const cy = r * 2.5

  mc.beginPath()
  mc.arc(cx, cy, r, 0, Math.PI * 2)
  mc.fillStyle = '#fff9c4'
  mc.fill()

  mc.globalCompositeOperation = 'destination-out'
  mc.beginPath()
  mc.arc(cx + r * 0.42, cy - r * 0.15, r * 0.84, 0, Math.PI * 2)
  mc.fill()

  const glow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3)
  glow.addColorStop(0, 'rgba(255, 245, 150, 0.25)')
  glow.addColorStop(1, 'rgba(255, 245, 150, 0)')
  ctx.beginPath()
  ctx.arc(x, y, r * 3, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  ctx.drawImage(offscreen, x - r * 2.5, y - r * 2.5)
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars: Star[] = []
    const W = () => window.innerWidth
    const H = () => window.innerHeight

    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2,
        type: 'dot',
      })
    }
    for (let i = 0; i < 12; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 5 + 4,
        opacity: Math.random() * 0.4 + 0.4,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
        phase: Math.random() * Math.PI * 2,
        type: 'sparkle',
      })
    }

    const moonR = 36
    let t = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawMoon(ctx, W() - 110, 90, moonR)

      stars.forEach(s => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.phase) * 0.35 + 0.65
        const op = s.opacity * twinkle
        const sx = s.x * W()
        const sy = s.y * H()
        if (s.type === 'dot') {
          ctx.beginPath()
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${op})`
          ctx.fill()
        } else {
          drawSparkle(ctx, sx, sy, s.r, op)
        }
      })

      t++
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  )
}

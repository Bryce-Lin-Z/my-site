'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  hue: number
  rotation: number
  rotSpeed: number
}

const HUES = [270, 320, 45, 200, 290] // violet, pink, gold, sky, purple

function drawSparkle(ctx: CanvasRenderingContext2D, size: number) {
  const inner = size * 0.35
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2
    const r = i % 2 === 0 ? size : inner
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
}

export default function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    // ── Spotlight ──
    const spotlight = document.getElementById('cursor-spotlight')
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2

    // ── Sparkle canvas ──
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (x: number, y: number) => {
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.5 + 0.8
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.8,
          life: 1,
          decay: Math.random() * 0.025 + 0.018,
          size: Math.random() * 7 + 3,
          hue: HUES[Math.floor(Math.random() * HUES.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
        })
      }
    }

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      spawn(e.clientX, e.clientY)

      document.querySelectorAll<HTMLElement>('.glass').forEach(card => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      })
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      if (spotlight) {
        spotlight.style.transform = `translate(${targetX - 80}px, ${targetY - 80}px)`
      }

      // Sparkle particles
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => p.life > 0)

      particles.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.07
        p.life -= p.decay
        p.rotation += p.rotSpeed
        p.size *= 0.97

        const op = Math.max(0, p.life)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = op

        // Sparkle shape
        ctx.fillStyle = `hsl(${p.hue}, 100%, 80%)`
        drawSparkle(ctx, p.size)
        ctx.fill()

        // Glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2)
        glow.addColorStop(0, `hsla(${p.hue}, 100%, 80%, 0.4)`)
        glow.addColorStop(1, `hsla(${p.hue}, 100%, 80%, 0)`)
        ctx.beginPath()
        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        ctx.restore()
      })

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 49 }}
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { careerNodes, careerEdges } from '@/lib/career/career-data'

export function CareerGraphVisualizer({ highlightPath }: { highlightPath?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = 600

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate positions
    const positions = new Map<string, { x: number; y: number }>()
    const categories = ['tech', 'data', 'business']
    
    careerNodes.forEach(node => {
      const categoryIndex = categories.indexOf(node.category)
      const x = (canvas.width / 4) * (categoryIndex + 1)
      const y = 100 + (node.level - 1) * 80
      positions.set(node.id, { x, y })
    })

    // Draw edges
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    careerEdges.forEach(edge => {
      const from = positions.get(edge.from)
      const to = positions.get(edge.to)
      if (from && to) {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
      }
    })

    // Draw highlighted path
    if (highlightPath && highlightPath.length > 1) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 4
      for (let i = 0; i < highlightPath.length - 1; i++) {
        const from = positions.get(highlightPath[i])
        const to = positions.get(highlightPath[i + 1])
        if (from && to) {
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.stroke()
        }
      }
    }

    // Draw nodes
    careerNodes.forEach(node => {
      const pos = positions.get(node.id)
      if (!pos) return

      const isHighlighted = highlightPath?.includes(node.id)
      
      // Node circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 25, 0, 2 * Math.PI)
      ctx.fillStyle = isHighlighted ? '#3b82f6' : '#ffffff'
      ctx.fill()
      ctx.strokeStyle = isHighlighted ? '#1e40af' : '#d1d5db'
      ctx.lineWidth = 3
      ctx.stroke()

      // Node text
      ctx.fillStyle = isHighlighted ? '#ffffff' : '#374151'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(node.level.toString(), pos.x, pos.y + 5)

      // Node label
      ctx.fillStyle = '#374151'
      ctx.font = '11px sans-serif'
      const words = node.title.split(' ')
      words.forEach((word, i) => {
        ctx.fillText(word, pos.x, pos.y + 45 + i * 14)
      })
    })

  }, [highlightPath])

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  )
}
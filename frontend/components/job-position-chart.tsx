"use client"

import { useEffect, useRef } from "react"

export function JobPositionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data
    const data = [65, 42, 78, 35, 56, 48, 89]
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const barWidth = chartWidth / data.length - 10
    const maxValue = Math.max(...data)

    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = 30 + index * (barWidth + 10)
      const y = canvas.height - barHeight - 30

      // Draw bar
      ctx.fillStyle = "rgba(99, 102, 241, 0.8)"
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#6B7280"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10)

      // Draw value
      ctx.fillStyle = "#374151"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })

    // Draw axes
    ctx.strokeStyle = "#E5E7EB"
    ctx.beginPath()
    ctx.moveTo(20, 10)
    ctx.lineTo(20, canvas.height - 20)
    ctx.lineTo(canvas.width - 10, canvas.height - 20)
    ctx.stroke()
  }, [])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}


import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function RetroAnimatedCat() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState('right')
  const [frame, setFrame] = useState(0)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setTargetPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current

      // Update position
      const newX = position.x + (targetPosition.x - position.x) * 0.05
      const newY = position.y + (targetPosition.y - position.y) * 0.05
      setPosition({ x: newX, y: newY })

      // Update direction
      if (newX > position.x) setDirection('right')
      else if (newX < position.x) setDirection('left')

      // Update animation frame
      if (deltaTime > 150) {
        setFrame((prevFrame) => (prevFrame + 1) % 4)
        previousTimeRef.current = time
      }
    } else {
      previousTimeRef.current = time
    }

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '32px',
        height: '32px',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <Image
        src="/placeholder.svg?height=64&width=128"
        alt="Retro Cat"
        width={128}
        height={64}
        style={{
          objectFit: 'none',
          objectPosition: `${-32 * frame}px ${direction === 'left' ? '0px' : '-32px'}`,
          imageRendering: 'pixelated',
          width: '128px',
          height: '64px',
        }}
      />
    </div>
  )
}

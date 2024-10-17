// PinballGame.tsx
'use client'

import React, { useRef, useEffect, useState } from 'react'

interface Vector {
  x: number
  y: number
}

interface Flipper {
  x: number
  y: number
  width: number
  height: number
  angle: number
  isActive: boolean
  side: 'left' | 'right'
}

interface Bumper {
  x: number
  y: number
  radius: number
}

const PinballGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [isGameStarted, setIsGameStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) return

    // Set up the canvas dimensions
    canvas.width = 800
    canvas.height = 600

    // Game variables
    let ballPosition: Vector = { x: canvas.width / 2, y: canvas.height - 30 }
    let ballVelocity: Vector = { x: 0, y: 0 }
    const ballRadius = 10
    const gravity = 0.4
    const friction = 0.99

    // Flippers
    const leftFlipper: Flipper = {
      x: 280,
      y: canvas.height - 100,
      width: 100,
      height: 20,
      angle: 0,
      isActive: false,
      side: 'left',
    }

    const rightFlipper: Flipper = {
      x: 420,
      y: canvas.height - 100,
      width: 100,
      height: 20,
      angle: 0,
      isActive: false,
      side: 'right',
    }

    // Bumpers
    const bumpers: Bumper[] = [
      { x: 400, y: 200, radius: 25 },
      { x: 300, y: 300, radius: 25 },
      { x: 500, y: 300, radius: 25 },
    ]

    // Event listeners for flipper control
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
        leftFlipper.isActive = true
      } else if (e.key === '/' || e.key === '?') {
        rightFlipper.isActive = true
      } else if (e.key === ' ') {
        if (!isGameStarted) {
          ballVelocity = { x: 0, y: -10 }
          setIsGameStarted(true)
        }
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
        leftFlipper.isActive = false
      } else if (e.key === '/' || e.key === '?') {
        rightFlipper.isActive = false
      }
    }

    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    // Collision detection
    const checkCollisionWithFlipper = (flipper: Flipper) => {
      // Simplified collision detection for flippers
      const flipperTopY = flipper.y
      const flipperBottomY = flipper.y + flipper.height
      const flipperLeftX = flipper.x
      const flipperRightX = flipper.x + flipper.width

      if (
        ballPosition.y + ballRadius > flipperTopY &&
        ballPosition.y - ballRadius < flipperBottomY &&
        ballPosition.x + ballRadius > flipperLeftX &&
        ballPosition.x - ballRadius < flipperRightX
      ) {
        // Reflect ball
        ballVelocity.y = -Math.abs(ballVelocity.y) * 1.05
        ballVelocity.x += flipper.isActive
          ? flipper.side === 'left'
            ? -2
            : 2
          : 0
        setScore((prevScore) => prevScore + 10)
      }
    }

    const checkCollisionWithBumper = (bumper: Bumper) => {
      const dx = ballPosition.x - bumper.x
      const dy = ballPosition.y - bumper.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < ballRadius + bumper.radius) {
        // Calculate normal vector
        const nx = dx / distance
        const ny = dy / distance

        // Reflect ball velocity
        const dot = ballVelocity.x * nx + ballVelocity.y * ny
        ballVelocity.x -= 2 * dot * nx
        ballVelocity.y -= 2 * dot * ny

        setScore((prevScore) => prevScore + 50)
      }
    }

    // Draw functions
    const drawBall = () => {
      context.beginPath()
      context.arc(ballPosition.x, ballPosition.y, ballRadius, 0, Math.PI * 2)
      context.fillStyle = '#FF0000'
      context.fill()
      context.closePath()
    }

    const drawFlipper = (flipper: Flipper) => {
      context.save()
      context.translate(flipper.x + flipper.width / 2, flipper.y + flipper.height / 2)
      const rotationAngle = flipper.isActive
        ? flipper.side === 'left'
          ? -Math.PI / 6
          : Math.PI / 6
        : 0
      context.rotate(rotationAngle)
      context.fillStyle = '#0000FF'
      context.fillRect(
        -flipper.width / 2,
        -flipper.height / 2,
        flipper.width,
        flipper.height
      )
      context.restore()
    }

    const drawBumper = (bumper: Bumper) => {
      context.beginPath()
      context.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2)
      context.fillStyle = '#00FF00'
      context.fill()
      context.closePath()
    }

    const drawScore = () => {
      context.font = '16px Tahoma'
      context.fillStyle = '#000000'
      context.fillText('Score: ' + score, 8, 20)
    }

    const drawLives = () => {
      context.font = '16px Tahoma'
      context.fillStyle = '#000000'
      context.fillText('Lives: ' + lives, canvas.width - 85, 20)
    }

    const drawInstructions = () => {
      context.font = '16px Tahoma'
      context.fillStyle = '#000000'
      context.textAlign = 'center'
      context.fillText('Press SPACE to Launch Ball', canvas.width / 2, canvas.height / 2 - 20)
      context.fillText('Use Z and / to Control Flippers', canvas.width / 2, canvas.height / 2)
    }

    // Game loop
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      drawScore()
      drawLives()

      if (!isGameStarted) {
        drawInstructions()
        ballPosition = { x: canvas.width / 2, y: canvas.height - 30 }
        ballVelocity = { x: 0, y: 0 }
      } else {
        // Update ball position
        ballVelocity.y += gravity
        ballVelocity.x *= friction
        ballVelocity.y *= friction

        ballPosition.x += ballVelocity.x
        ballPosition.y += ballVelocity.y

        // Check for wall collisions
        if (ballPosition.x + ballRadius > canvas.width || ballPosition.x - ballRadius < 0) {
          ballVelocity.x = -ballVelocity.x
        }
        if (ballPosition.y - ballRadius < 0) {
          ballVelocity.y = -ballVelocity.y
        }

        // Check for bottom collision (lose a life)
        if (ballPosition.y - ballRadius > canvas.height) {
          setLives((prevLives) => prevLives - 1)
          setIsGameStarted(false)
          if (lives <= 1) {
            setIsGameOver(true)
            return
          }
        }

        // Check collisions with flippers
        checkCollisionWithFlipper(leftFlipper)
        checkCollisionWithFlipper(rightFlipper)

        // Check collisions with bumpers
        bumpers.forEach(checkCollisionWithBumper)

        drawBall()
      }

      // Draw flippers and bumpers
      drawFlipper(leftFlipper)
      drawFlipper(rightFlipper)
      bumpers.forEach(drawBumper)

      if (!isGameOver) {
        requestAnimationFrame(draw)
      }
    }

    draw()

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      document.removeEventListener('keyup', keyUpHandler)
    }
  }, [isGameOver, lives, score, isGameStarted])

  const handleRestart = () => {
    setIsGameOver(false)
    setScore(0)
    setLives(3)
    setIsGameStarted(false)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#C3C7CB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Tahoma, Geneva, sans-serif',
      }}
    >
      {isGameOver ? (
        <div
          style={{
            textAlign: 'center',
            color: 'black',
            backgroundColor: 'white',
            padding: '20px',
            border: '2px solid black',
          }}
        >
          <h2>Game Over</h2>
          <p>Your Score: {score}</p>
          <button
            onClick={handleRestart}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Restart
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            border: '2px solid black',
            backgroundColor: '#C3C7CB',
            display: 'block',
          }}
        />
      )}
    </div>
  )
}

export default PinballGame

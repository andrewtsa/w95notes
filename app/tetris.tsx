import React, { useState, useEffect, useCallback } from 'react'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 30

type TetriminoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

interface Tetrimino {
  shape: number[][]
  color: string
}

const TETRIMINOS: Record<TetriminoType, Tetrimino> = {
  I: { shape: [[1, 1, 1, 1]], color: '#00FFFF' },
  O: { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' },
}

const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(''))
  )
  const [currentPiece, setCurrentPiece] = useState<Tetrimino | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const getRandomTetrimino = useCallback(() => {
    const types = Object.keys(TETRIMINOS) as TetriminoType[]
    return TETRIMINOS[types[Math.floor(Math.random() * types.length)]]
  }, [])

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill('')))
    setCurrentPiece(getRandomTetrimino())
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    setScore(0)
    setGameOver(false)
  }, [getRandomTetrimino])

  useEffect(() => {
    resetGame()
  }, [resetGame])

  const moveDown = useCallback(() => {
    if (!currentPiece) return

    if (canMoveTo(position.x, position.y + 1, currentPiece.shape)) {
      setPosition((prev) => ({ ...prev, y: prev.y + 1 }))
    } else {
      placePiece()
    }
  }, [currentPiece, position])

  const moveLeft = useCallback(() => {
    if (currentPiece && canMoveTo(position.x - 1, position.y, currentPiece.shape)) {
      setPosition((prev) => ({ ...prev, x: prev.x - 1 }))
    }
  }, [currentPiece, position])

  const moveRight = useCallback(() => {
    if (currentPiece && canMoveTo(position.x + 1, position.y, currentPiece.shape)) {
      setPosition((prev) => ({ ...prev, x: prev.x + 1 }))
    }
  }, [currentPiece, position])

  const rotate = useCallback(() => {
    if (!currentPiece) return

    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map((row) => row[i]).reverse()
    )

    if (canMoveTo(position.x, position.y, rotated)) {
      setCurrentPiece({ ...currentPiece, shape: rotated })
    }
  }, [currentPiece, position])

  const canMoveTo = (x: number, y: number, shape: number[][]) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          if (
            y + row >= BOARD_HEIGHT ||
            x + col < 0 ||
            x + col >= BOARD_WIDTH ||
            (board[y + row] && board[y + row][x + col])
          ) {
            return false
          }
        }
      }
    }
    return true
  }

  const placePiece = () => {
    if (!currentPiece) return

    const newBoard = board.map((row) => [...row])
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          if (position.y + row < 0) {
            setGameOver(true)
            return
          }
          newBoard[position.y + row][position.x + col] = currentPiece.color
        }
      }
    }

    setBoard(newBoard)
    setCurrentPiece(getRandomTetrimino())
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })

    const fullRows = newBoard.reduce((acc, row, index) => {
      if (row.every((cell) => cell !== '')) {
        acc.push(index)
      }
      return acc
    }, [] as number[])

    if (fullRows.length > 0) {
      const updatedBoard = newBoard.filter((_, index) => !fullRows.includes(index))
      const newRows = Array(fullRows.length)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(''))
      setBoard([...newRows, ...updatedBoard])
      setScore((prev) => prev + fullRows.length * 100)
    }
  }

  useEffect(() => {
    if (gameOver) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotate()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const gameLoop = setInterval(() => {
      moveDown()
    }, 1000)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      clearInterval(gameLoop)
    }
  }, [gameOver, moveDown, moveLeft, moveRight, rotate])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-win95-gray-200 p-4">
      <div className="mb-4 text-2xl font-bold">Score: {score}</div>
      <div
        className="border-4 border-win95-gray-400 bg-black relative"
        style={{
          width: BOARD_WIDTH * BLOCK_SIZE,
          height: BOARD_HEIGHT * BLOCK_SIZE,
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: x * BLOCK_SIZE,
                top: y * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: cell || (currentPiece && currentPiece.shape[y - position.y]?.[x - position.x]
                  ? currentPiece.color
                  : 'transparent'),
                border: cell ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
              }}
            />
          ))
        )}
      </div>
      {gameOver && (
        <div className="mt-4 text-2xl font-bold">
          Game Over!
          <button
            onClick={resetGame}
            className="ml-4 px-4 py-2 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
          >
            Restart
          </button>
        </div>
      )}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={moveLeft}
          className="px-4 py-2 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          Left
        </button>
        <button
          onClick={moveRight}
          className="px-4 py-2 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          Right
        </button>
        <button
          onClick={rotate}
          className="px-4 py-2 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          Rotate
        </button>
        <button
          onClick={moveDown}
          className="px-4 py-2 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          Down
        </button>
      </div>
    </div>
  )
}

export default TetrisGame

// desktop.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Draggable from 'react'
import {
  PlusIcon,
  SearchIcon,
  XIcon,
  BookOpen,
  DownloadIcon,
  Globe,
  FileText,
  Folder,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Gamepad2,
} from 'lucide-react'
import Image from 'next/image'
import TetrisGame from './tetris' // Import the PinballGame component
import PlannerApp from './planner'
import { Calendar } from 'lucide-react'
import Library from './components/books/library'


import {  ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
interface BrowserProps {
  onClose: () => void
}

interface Note {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
}

interface Website {
  id: string
  title: string
  url: string
}

interface AppSettings {
  theme: 'light' | 'dark' | 'blue' | 'green' | 'pink' | 'blade-runner' | 'xp' | 'windows7'; // Existing themes
  backgroundImage: string; // New property for background image
  fontSize: 'small' | 'medium' | 'large';
  username: string;
  mlaSettings: {
    name: string;
    professor: string;
    class: string;
  };
  catSpeed: number;
}

const Windows95Icon = () => (
  <div className="w-4 h-4 mr-2 grid grid-cols-2 grid-rows-2 gap-0.5">
    <div className="bg-win95-red"></div>
    <div className="bg-win95-green"></div>
    <div className="bg-win95-blue-300"></div>
    <div className="bg-win95-yellow"></div>
  </div>
)

interface DesktopIconProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export function Browser({ onClose }: BrowserProps) {
  const [url, setUrl] = useState('https://example.com')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (iframeRef.current) {
      const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
      iframeRef.current.src = validUrl; // Set the iframe source to the valid URL
      setHistory(prev => [...prev.slice(0, historyIndex + 1), validUrl]);
      setHistoryIndex(prev => prev + 1);
    }
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setUrl(history[historyIndex - 1])
      setIsLoading(true)
      if (iframeRef.current) {
        iframeRef.current.src = history[historyIndex - 1]
      }
    }
  }
const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setUrl(history[historyIndex + 1])
      setIsLoading(true)
      if (iframeRef.current) {
        iframeRef.current.src = history[historyIndex + 1]
      }
    }
  }

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }


  return (
    <div className="flex flex-col h-full bg-win95-gray-200 border-win95 shadow-win95-container">
      <div className="p-1 flex justify-between items-center bg-win95-blue-300">
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-2 text-white" />
          <span className="font-bold text-white">Web Browser</span>
        </div>
        <button
          onClick={onClose}
          className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset"
        >
          <XIcon className="w-3 h-3" />
        </button>
      </div>
      <div className="flex items-center p-2 bg-win95-gray-200 border-b border-win95-gray-400">
        <button
          onClick={handleBack}
          disabled={historyIndex <= 0}
          className="px-2 py-1 bg-win95-gray-200 border-win95 active:border-win95-inset mr-1 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleForward}
          disabled={historyIndex >= history.length - 1}
          className="px-2 py-1 bg-win95-gray-200 border-win95 active:border-win95-inset mr-1 disabled:opacity-50"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleRefresh}
          className="px-2 py-1 bg-win95-gray-200 border-win95 active:border-win95-inset mr-2"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <form onSubmit={handleNavigate} className="flex-grow flex">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-2 py-1 border-2 border-win95-gray-500 bg-white"
            placeholder="Enter URL" // Add a placeholder for clarity
          />
          <button
            type="submit"
            className="px-4 py-1 bg-win95-gray-200 border-win95 active:border-win95-inset ml-2"
          >
            Go
          </button>
        </form>
      </div>
      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-win95-gray-600">Loading...</div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          title="Web Browser"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  )
}
const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 w-20 h-20 hover:bg-white hover:bg-opacity-20"
  >
    <div className="w-12 h-12 bg-win95-gray-200 border-win95 flex items-center justify-center mb-1">
      {icon}
    </div>
    <span className="text-xs text-center break-words w-full">{label}</span>
  </button>
)
/* Retro Cat Component */
const RetroCat: React.FC<{ speed: number; isPaused: boolean }> = ({ speed, isPaused }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)
  const [isSurprised, setIsSurprised] = useState(false)
  const [direction, setDirection] = useState<'right' | 'left' | 'up' | 'down'>('right')
  const [walkFrame, setWalkFrame] = useState(1)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY })
      setIsSurprised(true)
      setIsMoving(false) // Stop moving when surprised
      setTimeout(() => setIsSurprised(false), 1000)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!isMoving && !isPaused && !isSurprised) {
      const timer = setTimeout(() => {
        setIsMoving(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [targetPosition, isMoving, isPaused, isSurprised])

  useEffect(() => {
    if (isMoving && !isPaused && !isSurprised) {
      const moveInterval = setInterval(() => {
        setPosition((current) => {
          const dx = targetPosition.x - current.x
          const dy = targetPosition.y - current.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 5) {
            setIsMoving(false)
            return current
          }

          const vx = (dx / distance) * speed
          const vy = (dy / distance) * speed

          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 'right' : 'left')
          } else {
            setDirection(dy > 0 ? 'down' : 'up')
          }

          setWalkFrame((prev) => (prev % 3) + 1)

          return {
            x: current.x + vx,
            y: current.y + vy,
          }
        })
      }, 100)

      return () => clearInterval(moveInterval)
    }
  }, [isMoving, targetPosition, speed, isPaused, isSurprised])

  const getCatSprite = () => {
    if (isSurprised) return '/catsurprised.png'
    if (!isMoving || isPaused) {
      if (direction === 'up' || direction === 'down') return '/catwalksouth3.png'
      return '/cat.png'
    }
    if (direction === 'right') return `/catwalk${walkFrame}.png`
    if (direction === 'left') return `/catwalk${walkFrame}.png`
    if (direction === 'up' || direction === 'down') return `/catwalksouth${walkFrame}.png`
    return '/cat.png'
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: 50,
        height: 50,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `scaleX(${direction === 'left' ? -1 : 1}) ${
          direction === 'up' ? 'rotate(180deg)' : ''
        }`,
      }}
    >
      <Image src={getCatSprite()} alt="cat.png" width={50} height={50} priority />
    </div>
  )
}

const NoteEditor: React.FC<{
  activeNote: Note
  updateNoteContent: (content: string) => void
}> = ({ activeNote, updateNoteContent }) => {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = activeNote.content
    }
  }, [activeNote.id]) // Update only when a different note is selected

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      updateNoteContent(content)
    }
  }, [updateNoteContent])

  const handleFormatting = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
  }, [])

  return (
    <>
      <div className="bg-win95-gray-200 p-2 flex items-center space-x-2 border-b border-win95-gray-400">
        <button
          onClick={() => handleFormatting('bold')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormatting('italic')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormatting('underline')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormatting('justifyLeft')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormatting('justifyCenter')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormatting('justifyRight')}
          className="p-1 bg-win95-gray-200 border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="flex-1 p-4 bg-white border-2 border-win95-gray-500 overflow-auto"
        contentEditable
        onInput={handleInput}
      />
    </>
  )
}

const SettingsPanel: React.FC<{
  appSettings: AppSettings
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>
  activeSettingsTab: string
  setActiveSettingsTab: React.Dispatch<React.SetStateAction<string>>
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  appSettings,
  setAppSettings,
  activeSettingsTab,
  setActiveSettingsTab,
  setIsSettingsOpen,
}) => {
  // Use local state for MLA settings to prevent cursor jump
  const [localMlaSettings, setLocalMlaSettings] = useState(appSettings.mlaSettings)

  useEffect(() => {
    setLocalMlaSettings(appSettings.mlaSettings)
  }, [appSettings.mlaSettings])

  const handleMlaSettingsChange = (field: keyof typeof localMlaSettings, value: string) => {
    setLocalMlaSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveMlaSettings = () => {
    setAppSettings((prev) => ({
      ...prev,
      mlaSettings: localMlaSettings,
    }))
  }

  useEffect(() => {
    saveMlaSettings()
  }, [localMlaSettings]) // Save when localMlaSettings changes

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] ${appSettings.theme === 'xp' ? 'bg-blue-100 border-2 border-blue-500 rounded-lg' : 'bg-win95-gray-200 border-win95'} shadow-win95-container`}
    >
      <div
        className={`p-1 flex justify-between items-center ${
          appSettings.theme === 'dark'
            ? 'bg-win95-gray-500'
            : appSettings.theme === 'blue'
            ? 'bg-win95-blue-300'
            : appSettings.theme === 'green'
            ? 'bg-win95-green'
            : appSettings.theme === 'pink'
            ? 'bg-pink-300'
            : 'bg-win95-blue-300'
        }`}
      >
        <div className="flex items-center">
          <Windows95Icon />
          <span className="font-bold text-white">Control Panel</span>
        </div>
        <button
          onClick={() => setIsSettingsOpen(false)}
          className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset"
        >
          <XIcon className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4 grid grid-cols-4 gap-4">
        <button
          onClick={() => setActiveSettingsTab('General')}
          className={`p-2 text-center border-win95 ${
            activeSettingsTab === 'General' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">A</span>
          </div>
          General
        </button>
        <button
          onClick={() => setActiveSettingsTab('Theme')}
          className={`p-2 text-center border-win95 ${
            activeSettingsTab === 'Theme' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          Theme
        </button>
        <button
          onClick={() => setActiveSettingsTab('Account')}
          className={`p-2 text-center border-win95 ${
            activeSettingsTab === 'Account' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          Account
        </button>
        <button
          onClick={() => setActiveSettingsTab('Cat')}
          className={`p-2  text-center border-win95 ${
            activeSettingsTab === 'Cat' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">🐱</span>
          </div>
          Cat
        </button>
      </div>
      <div className="p-4">
        {activeSettingsTab === 'General' && (
          <div>
            <h3 className="font-bold mb-2">Font Size</h3>
            <select
              value={appSettings.fontSize}
              onChange={(e) =>
                setAppSettings({
                  ...appSettings,
                  fontSize: e.target.value as 'small' | 'medium' | 'large',
                })
              }
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        )}
        {activeSettingsTab === 'Theme' && (
          <div>
            <h3 className="font-bold mb-2">Theme</h3>
            <select
              value={appSettings.theme}
              onChange={(e) =>
                setAppSettings({
                  ...appSettings,
                  theme: e.target.value as 'light' | 'dark' | 'blue' | 'green' | 'pink' | 'blade-runner' | 'xp' | 'windows7',
                })
              }
              className="w-full px-2 py-1 input-xp"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="pink">Pink</option>
              <option value="blade-runner">Blade Runner</option>
              <option value="xp">Windows XP</option> {/* Added XP option */}
              <option value="windows7">Windows 7</option> {/* Added Windows 7 option */}
            </select>
          </div>
        )}
        {activeSettingsTab === 'Account' && (
          <div>
            <h3 className="font-bold mb-2">Username</h3>
            <input
              type="text"
              value={appSettings.username}
              onChange={(e) => setAppSettings({ ...appSettings, username: e.target.value })}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-4"
            />
            <h3 className="font-bold mb-2">MLA Settings</h3>
            <input
              type="text"
              placeholder="Name"
              value={localMlaSettings.name}
              onChange={(e) => handleMlaSettingsChange('name', e.target.value)}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-2"
            />
            <input
              type="text"
              placeholder="Professor"
              value={localMlaSettings.professor}
              onChange={(e) => handleMlaSettingsChange('professor', e.target.value)}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-2"
            />
            <input
              type="text"
              placeholder="Class"
              value={localMlaSettings.class}
              onChange={(e) => handleMlaSettingsChange('class', e.target.value)}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
            />
          </div>
        )}
        {activeSettingsTab === 'Cat' && (
          <div>
            <h3 className="font-bold mb-2">Cat Speed</h3>
            <input
              type="range"
              min="1"
              max="10"
              value={appSettings.catSpeed}
              onChange={(e) =>
                setAppSettings({ ...appSettings, catSpeed: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <span>{appSettings.catSpeed}</span>
          </div>
        )}
      </div>
      {/* Background Image Selection */}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Background Image</h3>
        <input
          type="text"
          value={appSettings.backgroundImage}
          onChange={(e) =>
            setAppSettings({
              ...appSettings,
              backgroundImage: e.target.value,
            })
          }
          className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
          placeholder="Enter background image URL"
        />
        <p className="text-sm text-gray-500">Default: /win7bg.jpg</p>
      </div>
    </div>
  )
}

export default function WindowsXPDesktop() {
  const [notes, setNotes] = useState<Note[]>([])
  const [websites, setWebsites] = useState<Website[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [activeWebsite, setActiveWebsite] = useState<Website | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeSettingsTab, setActiveSettingsTab] = useState('General')
  const [isNotesAppOpen, setIsNotesAppOpen] = useState(false)
  const [isWebBrowserOpen, setIsWebBrowserOpen] = useState(false)
  const [isCatPaused, setIsCatPaused] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isPlannerOpen, setIsPlannerOpen] = useState(false)
  const [isTetrisOpen, setIsTetrisOpen] = useState(false) // New state for Tetris game
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'windows7', // Change default theme to Windows 7
    backgroundImage: '/win7bg.jpg', // Default background image
    fontSize: 'medium',
    username: 'User',
    mlaSettings: {
      name: '',
      professor: '',
      class: '',
    },
    catSpeed: 5,
  })

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    const savedWebsites = localStorage.getItem('websites')
    if (savedWebsites) {
      setWebsites(JSON.parse(savedWebsites))
    }

    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setAppSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites))
  }, [websites])

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings))
  }, [appSettings])

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      category: 'Uncategorized',
      createdAt: new Date().toISOString(),
    }
    setNotes((prevNotes) => [newNote, ...prevNotes])
    setActiveNote(newNote)
    setIsNotesAppOpen(true)
  }, [])

  const updateNoteTitle = useCallback(
    (id: string, title: string) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? { ...note, title } : note))
      )
      setActiveNote((prevActiveNote) =>
        prevActiveNote && prevActiveNote.id === id ? { ...prevActiveNote, title } : prevActiveNote
      )
    },
    []
  )

  const updateNoteCategory = useCallback(
    (id: string, category: string) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? { ...note, category } : note))
      )
      setActiveNote((prevActiveNote) =>
        prevActiveNote && prevActiveNote.id === id ? { ...prevActiveNote, category } : prevActiveNote
      )
    },
    []
  )

  const updateNoteContent = useCallback(
    (content: string) => {
      if (activeNote) {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === activeNote.id ? { ...note, content } : note))
        )
        setActiveNote((prevActiveNote) =>
          prevActiveNote && prevActiveNote.id === activeNote.id
            ? { ...prevActiveNote, content }
            : prevActiveNote
        )
      }
    },
    [activeNote]
  )

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
      if (activeNote?.id === id) {
        setActiveNote(null)
      }
    },
    [activeNote]
  )

  // Websites functions
  const addWebsite = useCallback(() => {
    const newWebsite: Website = {
      id: Date.now().toString(),
      title: 'New Website',
      url: 'https://',
    }
    setWebsites((prevWebsites) => [newWebsite, ...prevWebsites])
    setActiveWebsite(newWebsite)
    setIsWebBrowserOpen(true)
  }, [])

  const updateWebsite = useCallback((updatedWebsite: Website) => {
    setWebsites((prevWebsites) =>
      prevWebsites.map((website) =>
        website.id === updatedWebsite.id ? updatedWebsite : website
      )
    )
    setActiveWebsite(updatedWebsite)
  }, [])

  const deleteWebsite = useCallback(
    (id: string) => {
      setWebsites((prevWebsites) => prevWebsites.filter((website) => website.id !== id))
      if (activeWebsite?.id === id) {
        setActiveWebsite(null)
      }
    },
    [activeWebsite]
  )

  function stripHtml(html: string): string {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const filteredNotes = notes.filter(
    (note) =>
      (activeCategory === 'All' || note.category === activeCategory) &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtml(note.content).toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const categories = ['All', ...Array.from(new Set(notes.map((note) => note.category)))]

  const downloadNoteAsMLA = () => {
    if (!activeNote) return

    const { name, professor, class: className } = appSettings.mlaSettings
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const mlaHeader = `${name}\n${professor}\n${className}\n${date}\n\n`
    const mlaContent = `${activeNote.title}\n\n${stripHtml(activeNote.content)}`
    const mlaFormattedContent = mlaHeader + mlaContent

    const blob = new Blob([mlaFormattedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeNote.title.replace(/\s+/g, '_')}_MLA.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getThemeClasses = () => {
    switch (appSettings.theme) {
      case 'windows7':
        return 'windows7-theme'; // Apply Windows 7 theme classes
      case 'xp':
        return 'xp-theme'; // Apply XP theme classes
      case 'dark':
        return 'bg-win95-gray-500 text-white'; // Example for dark theme
      case 'blue':
        return 'bg-win95-blue-300 text-white'; // Example for blue theme
      // Add other themes here...
      default:
        return 'bg-win95-bg text-black'; // Default theme
    }
  };

  return (
    <div
      className={`relative flex flex-col h-screen ${getThemeClasses()} overflow-hidden`}
      style={{ backgroundImage: `url(${appSettings.backgroundImage})`, backgroundSize: 'cover' }} // Apply background image
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-4xl font-bold text-center" style={{ color: appSettings.theme === 'dark' ? '#FFFFFF' : '#000000' }}>
          Andrews notes app for notes and shit
        </h1>
      </div>

      {/* Desktop Icons */}
      <div className="flex-1 p-4 grid grid-cols-6 gap-4 content-start">
        <DesktopIcon
          icon={<FileText className="w-8 h-8 text-black" />}
          label="Notes"
          onClick={() => setIsNotesAppOpen(true)}
        />
        <DesktopIcon
          icon={<Globe className="w-8 h-8 text-black" />}
          label="Web Browser"
          onClick={() => { 
            setIsWebBrowserOpen(true); // Open the web browser
            setActiveWebsite({ id: '1', title: 'New Website', url: 'https://example.com' }); // Set a default website
          }}
        />
        <DesktopIcon
          icon={<Folder className="w-8 h-8 text-black" />}
          label="Settings"
          onClick={() => setIsSettingsOpen(true)}
        />
                <DesktopIcon
          icon={<Gamepad2 className="w-8 h-8 text-black" />}
          label="Tetris"
          onClick={() => setIsTetrisOpen(true)}
        />
          <DesktopIcon
        icon={<Calendar className="w-8 h-8 text-black" />}
        label="Planner"
        onClick={() => setIsPlannerOpen(true)}
      />
        <DesktopIcon
  icon={<BookOpen className="w-8 h-8 text-black" />}
  label="Library"
  onClick={() => setIsLibraryOpen(true)}
/>
      </div>

      {/* Notes App Window */}
      {isNotesAppOpen && (
        <div className="absolute top-10 left-10 w-3/4 h-3/4 bg-win95-gray-200 border-win95 shadow-win95-container">
          <div
            className={`p-1 flex justify-between items-center ${
              appSettings.theme === 'dark'
                ? 'bg-win95-gray-500'
                : appSettings.theme === 'blue'
                ? 'bg-win95-blue-300'
                : appSettings.theme === 'green'
                ? 'bg-win95-green'
                : appSettings.theme === 'pink'
                ? 'bg-pink-300'
                : 'bg-win95-blue-300'
            }`}
          >
            <div className="flex items-center">
              <Windows95Icon />
              <span className="font-bold text-white">Notes</span>
            </div>
            <button
              onClick={() => setIsNotesAppOpen(false)}
              className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-win95-gray-200 border-r border-win95-gray-400 flex flex-col">
              <div className="p-2">
                <button
                  onClick={addNote}
                  className="w-full py-1 px-2 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset flex items-center justify-center"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Note
                </button>
              </div>
              <div className="px-2 mb-2 relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
                />
                <SearchIcon className="absolute right-4 top-1.5 w-4 h-4 text-win95-gray-400" />
              </div>
              <div className="px-2 mb-2">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNote(note)
                      setIsNotesAppOpen(true)
                    }}
                    className={`p-2 cursor-pointer hover:bg-win95-blue-300 hover:text-white ${
                      activeNote?.id === note.id ? 'bg-win95-blue-300 text-white' : ''
                    }`}
                  >
                    <h3 className="font-bold truncate">{note.title}</h3>
                    <p className="text-sm truncate">{stripHtml(note.content)}</p>
                    <p className="text-xs text-win95-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}

              </div>
            </div>
  
            {/* Main content */}
            <div className="flex-1 flex flex-col bg-win95-gray-200 border-l border-white overflow-hidden">
              {activeNote ? (
                <>
                  <div className="bg-win95-gray-200 p-2 border-b border-win95-gray-400">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => updateNoteTitle(activeNote.id, e.target.value)}
                      className="w-full px-2 py-1 bg-white border-2 border-win95-gray-500 focus:outline-none z-50 relative"
                    />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <NoteEditor
                      activeNote={activeNote}
                      updateNoteContent={updateNoteContent}
                    />
                  </div>
                  <div className="p-2 bg-win95-gray-200 border-t border-win95-gray-400 flex justify-between items-center">
                    <input
                      type="text"
                      value={activeNote.category}
                      onChange={(e) => updateNoteCategory(activeNote.id, e.target.value)}
                      placeholder="Category"
                      className="px-2 py-1 border-2 border-win95-gray-500 bg-white w-40"
                    />
                    <div className="flex">
                      <button
                        onClick={downloadNoteAsMLA}
                        className="px-4 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset mr-2 flex items-center"
                      >
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Download MLA
                      </button>
                      <button
                        onClick={() => deleteNote(activeNote.id)}
                        className="px-4 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-win95-gray-400">
                  Select a note or create a new one
                </div>
              )}
            </div>
          </div>
        
        </div>
      )}


      {/* Planner App Window */}
      {isPlannerOpen && (
        <div className="absolute top-28 left-28 w-3/4 h-3/4">
          <PlannerApp onClose={() => setIsPlannerOpen(false)} />
        </div>
      )}
      {/* Web Browser Window */}
      {isWebBrowserOpen && activeWebsite && (
        <div className="absolute top-20 left-20 w-3/4 h-3/4 bg-win7-gray-200 border-win7 shadow-win7-container">
          <div className={`p-1 flex justify-between items-center ${appSettings.theme === 'windows7' ? 'bg-win7-blue' : ''}`}>
            <div className="flex items-center">
              <Windows95Icon />
              <span className="font-bold text-white">Web Browser</span>
            </div>
            <button onClick={() => setIsWebBrowserOpen(false)} className="px-2 py-0.5 bg-win7-gray-200 border-win7 active:border-win7-inset">
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col h-full">
            <div className="p-2 flex items-center">
              <input
                type="text"
                value={activeWebsite.url}
                onChange={(e) => updateWebsite({ ...activeWebsite, url: e.target.value })}
                className="flex-grow px-2 py-1 border-2 border-win7-gray-500 bg-white mr-2"
                placeholder="Enter URL"
              />
              <button onClick={() => updateWebsite({ ...activeWebsite, url: activeWebsite.url })} className="px-4 py-1 bg-win7-gray-200 text-black border-win7 hover:bg-win7-gray-300 active:border-win7-inset">
                Go
              </button>
            </div>
            <div className="flex-1 bg-white border-2 border-win7-gray-500">
              <iframe
                src={activeWebsite.url}
                className="w-full h-full border-none"
                title={activeWebsite.title}
              />
            </div>
          </div>
        </div>
      )}

           {/* Tetris Game Window */}
      {isTetrisOpen && (
        <div className="absolute top-24 left-24 w-[350px] h-[600px] sm:w-[450px] sm:h-[700px] bg-win95-gray-200 border-win95 shadow-win95-container">
          <div
            className={`p-1 flex justify-between items-center ${
              appSettings.theme === 'dark'
                ? 'bg-win95-gray-500'
                : appSettings.theme === 'blue'
                ? 'bg-win95-blue-300'
                : appSettings.theme === 'green'
                ? 'bg-win95-green'
                : appSettings.theme === 'pink'
                ? 'bg-pink-300'
                : 'bg-win95-blue-300'
            }`}
          >
            <div className="flex items-center">
              <Windows95Icon />
              <span className="font-bold text-white">Tetris</span>
            </div>
            <button
              onClick={() => setIsTetrisOpen(false)}
              className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-white border-2 border-win95-gray-500 overflow-hidden">
              <TetrisGame />
            </div>
          </div>
        </div>
      )}      
      {/* Library Window */} 
      {isLibraryOpen && (
  <Library onClose={() => setIsLibraryOpen(false)} />
)}
      {/* Taskbar */}
      <div className={`h-12 ${appSettings.theme === 'xp' ? 'xp-theme' : appSettings.theme === 'pink' ? 'pink-theme' : 'bg-win95'} win95-taskbar flex items-center px-2`}>
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`px-4 py-1 ${appSettings.theme === 'xp' ? 'button-xp' : 'button-win95'} flex items-center`}
        >
          <Windows95Icon />
          Start
        </button>
        <div className="flex-1 flex items-center">
          {isNotesAppOpen && (
            <button
              onClick={() => setIsNotesAppOpen(true)}
              className="px-4 py-1 bg-win95-gray-300 text-black border-win95-inset mr-2 flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </button>
          )}
          {isWebBrowserOpen && (
            <button
              onClick={() => setIsWebBrowserOpen(true)}
              className="px-4 py-1 bg-win95-gray-300 text-black border-win95-inset mr-2 flex items-center"
            >
              <Globe className="w-4 h-4 mr-2" />
              Web Browser
            </button>
          )}
               {isTetrisOpen && (
            <button
              onClick={() => setIsTetrisOpen(true)}
              className="px-4 py-1 bg-win95-gray-300 text-black border-win95-inset mr-2 flex items-center whitespace-nowrap"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Tetris
            </button>
          )}  
            {isPlannerOpen && (
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="px-4 py-1 bg-win95-gray-300 text-black border-win95-inset mr-2 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Planner
            </button>
          )}
          {isLibraryOpen && (
  <button
    onClick={() => setIsLibraryOpen(true)}
    className="px-4 py-1 bg-win95-gray-300 text-black border-win95-inset mr-2 flex items-center"
  >
    <BookOpen className="w-4 h-4 mr-2" />
    Library
  </button>
)}
               </div>
        <div className="px-2 py-1 bg-win95-gray-300 border-win95-inset mr-2 whitespace-nowrap">
          {new Date().toLocaleTimeString()}        
        </div>
        <button
          onClick={() => setIsCatPaused(!isCatPaused)}
          className="px-4 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          {isCatPaused ? 'Resume Cat' : 'Pause Cat'}
        </button>
      </div>

      {/* Start Menu */}
      {isStartMenuOpen && (
        <div className="absolute bottom-10 left-0 w-64 bg-win95-gray-200 border-win95 shadow-lg">
          <div className="p-2 bg-win95-blue-300 text-white font-bold">Windows 95</div>
          <button
            onClick={() => {
              setIsSettingsOpen(true)
              setIsStartMenuOpen(false)
            }}
            className="w-full py-2 px-4 text-left hover:bg-win95-blue-300 hover:text-white"
          >
            Settings
          </button>
          <div className="border-t border-win95-gray-400"></div>
          <button
            onClick={() => setIsStartMenuOpen(false)}
            className="w-full py-2 px-4 text-left hover:bg-win95-blue-300 hover:text-white"
          >
            Shut Down...
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <SettingsPanel
          appSettings={appSettings}
          setAppSettings={setAppSettings}
          activeSettingsTab={activeSettingsTab}
          setActiveSettingsTab={setActiveSettingsTab}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      )}

      {/* Retro Cat */}
      <RetroCat speed={appSettings.catSpeed} isPaused={isCatPaused} />
    </div>
  )
}



















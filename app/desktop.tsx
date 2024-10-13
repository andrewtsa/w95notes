'use client'

import React, { useState, useEffect } from 'react'
import { PlusIcon, SearchIcon, XIcon, MinusIcon, MaximizeIcon, DownloadIcon, Globe, FileText, Folder } from 'lucide-react'

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
  theme: 'light' | 'dark' | 'blue' | 'green' | 'pink'
  fontSize: 'small' | 'medium' | 'large'
  username: string
  mlaSettings: {
    name: string
    professor: string
    class: string
  }
}

const Windows95Icon = () => (
  <div className="w-4 h-4 mr-2 grid grid-cols-2 grid-rows-2 gap-0.5">
    <div className="bg-win95-red"></div>
    <div className="bg-win95-green"></div>
    <div className="bg-win95-blue-300"></div>
    <div className="bg-win95-yellow"></div>
  </div>
)

export default function Windows95Desktop() {
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
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    fontSize: 'medium',
    username: 'User',
    mlaSettings: {
      name: '',
      professor: '',
      class: '',
    }
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

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      category: 'Uncategorized',
      createdAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
  }

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    )
    setNotes(updatedNotes)
    setActiveNote(updatedNote)
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
    setActiveNote(null)
  }

  const addWebsite = () => {
    const newWebsite: Website = {
      id: Date.now().toString(),
      title: 'New Website',
      url: 'https://',
    }
    setWebsites([newWebsite, ...websites])
    setActiveWebsite(newWebsite)
  }

  const updateWebsite = (updatedWebsite: Website) => {
    const updatedWebsites = websites.map((website) =>
      website.id === updatedWebsite.id ? updatedWebsite : website
    )
    setWebsites(updatedWebsites)
    setActiveWebsite(updatedWebsite)
  }

  const deleteWebsite = (id: string) => {
    setWebsites(websites.filter((website) => website.id !== id))
    setActiveWebsite(null)
  }

  const filteredNotes = notes.filter(
    (note) =>
      (activeCategory === 'All' || note.category === activeCategory) &&
      (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const categories = ['All', ...Array.from(new Set(notes.map((note) => note.category)))]

  const downloadNoteAsMLA = () => {
    if (!activeNote) return

    const { name, professor, class: className } = appSettings.mlaSettings
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const mlaHeader = `${name}\n${professor}\n${className}\n${date}\n\n`
    const mlaContent = `${activeNote.title}\n\n${activeNote.content}`
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

  const SettingsPanel = () => (
    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-win95-gray-200 border-win95 shadow-win95-container ${
      appSettings.theme === 'dark' ? 'text-white' :
      appSettings.theme === 'blue' ? 'text-white' :
      appSettings.theme === 'green' ? 'text-black' :
      appSettings.theme === 'pink' ? 'text-black' :
      'text-black'
    }`}>
      <div className={`p-1 flex justify-between items-center ${
        appSettings.theme === 'dark' ? 'bg-win95-gray-500' :
        appSettings.theme === 'blue' ? 'bg-win95-blue-300' :
        appSettings.theme === 'green' ? 'bg-win95-green' :
        appSettings.theme === 'pink' ? 'bg-pink-300' :
        'bg-win95-blue-300'
      }`}>
        <div className="flex items-center">
          <Windows95Icon />
          <span className="font-bold text-white">Control Panel</span>
        </div>
        <button onClick={() => setIsSettingsOpen(false)} className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset">
          <XIcon className="w-3 h-3" />
        </button>
      </div>
      <div className="p-4 grid grid-cols-3 gap-4">
        <button
          onClick={() => setActiveSettingsTab('General')}
          className={`p-2 text-center border-win95 ${activeSettingsTab === 'General' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'}`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">A</span>
          </div>
          General
        </button>
        <button
          onClick={() => setActiveSettingsTab('Theme')}
          className={`p-2 text-center border-win95 ${activeSettingsTab === 'Theme' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'}`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          Theme
        </button>
        <button
          onClick={() => setActiveSettingsTab('Account')}
          className={`p-2 text-center border-win95 ${activeSettingsTab === 'Account' ? 'bg-win95-gray-300' : 'bg-win95-gray-200'}`}
        >
          <div className="w-12 h-12 mx-auto mb-2 bg-win95-gray-300 border-win95-inset flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          Account
        </button>
      </div>
      <div className="p-4">
        {activeSettingsTab === 'General' && (
          <div>
            <h3 className="font-bold mb-2">Font Size</h3>
            <select
              value={appSettings.fontSize}
              onChange={(e) => setAppSettings({...appSettings, fontSize: e.target.value as 'small' | 'medium' | 'large'})}
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
              onChange={(e) => setAppSettings({...appSettings, theme: e.target.value as 'light' | 'dark' | 'blue' | 'green' | 'pink'})}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="pink">Pink</option>
            </select>
          </div>
        )}
        {activeSettingsTab === 'Account' && (
          <div>
            <h3 className="font-bold mb-2">Username</h3>
            <input
              type="text"
              value={appSettings.username}
              onChange={(e) => setAppSettings({...appSettings, username: e.target.value})}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-4"
            />
            <h3 className="font-bold mb-2">MLA Settings</h3>
            <input
              type="text"
              placeholder="Name"
              value={appSettings.mlaSettings.name}
              onChange={(e) => setAppSettings({...appSettings, mlaSettings: {...appSettings.mlaSettings, name: e.target.value}})}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-2"
            />
            <input
              type="text"
              placeholder="Professor"
              value={appSettings.mlaSettings.professor}
              onChange={(e) => setAppSettings({...appSettings, mlaSettings: {...appSettings.mlaSettings, professor: e.target.value}})}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white mb-2"
            />
            <input
              type="text"
              placeholder="Class"
              value={appSettings.mlaSettings.class}
              onChange={(e) => setAppSettings({...appSettings, mlaSettings: {...appSettings.mlaSettings, class: e.target.value}})}
              className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col h-screen ${
      appSettings.theme === 'dark' ? 'bg-win95-gray-500 text-white' :
      appSettings.theme === 'blue' ? 'bg-win95-blue-300 text-white' :
      appSettings.theme === 'green' ? 'bg-win95-green text-black' :
      appSettings.theme === 'pink' ? 'bg-pink-300 text-black' :
      'bg-win95-bg text-black'
    } overflow-hidden`} style={{fontSize: appSettings.fontSize === 'small' ? '14px' : appSettings.fontSize === 'large' ? '18px' : '16px'}}>
      {/* Desktop */}
      <div className="flex-1 p-4 grid grid-cols-6 gap-4 content-start">
        <button
          onClick={() => setIsNotesAppOpen(true)}
          className="flex flex-col items-center justify-center p-2 hover:bg-white hover:bg-opacity-20"
        >
          <FileText className="w-12 h-12 mb-2" />
          <span>Notes</span>
        </button>
        <button
          onClick={() => setIsWebBrowserOpen(true)}
          className="flex flex-col items-center justify-center p-2 hover:bg-white hover:bg-opacity-20"
        >
          <Globe className="w-12 h-12 mb-2" />
          <span>Web Browser</span>
        </button>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center justify-center p-2 hover:bg-white hover:bg-opacity-20"
        >
          <Folder className="w-12 h-12 mb-2" />
          <span>Settings</span>
        </button>
      </div>

      {/* Notes App Window */}
      {isNotesAppOpen && (
        <div className="absolute  top-10 left-10 w-3/4 h-3/4 bg-win95-gray-200 border-win95 shadow-win95-container">
          <div className={`p-1 flex justify-between items-center ${
            appSettings.theme === 'dark' ? 'bg-win95-gray-500' :
            appSettings.theme === 'blue' ? 'bg-win95-blue-300' :
            appSettings.theme === 'green' ? 'bg-win95-green' :
            appSettings.theme === 'pink' ? 'bg-pink-300' :
            'bg-win95-blue-300'
          }`}>
            <div className="flex items-center">
              <Windows95Icon />
              <span className="font-bold text-white">Notes</span>
            </div>
            <button onClick={() => setIsNotesAppOpen(false)} className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset">
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
                    onClick={() => setActiveNote(note)}
                    className={`p-2 cursor-pointer hover:bg-win95-blue-300 hover:text-white ${
                      activeNote?.id === note.id ? 'bg-win95-blue-300 text-white' : ''
                    }`}
                  >
                    <h3 className="font-bold truncate">{note.title}</h3>
                    <p className="text-sm truncate">{note.content}</p>
                    <p className="text-xs text-win95-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col bg-win95-gray-200 border-l border-white">
              {activeNote ? (
                <>
                  <div className="flex-1 p-1 overflow-hidden flex flex-col">
                    <div className="bg-white border-win95-inset p-1 mb-1">
                      <input
                        type="text"
                        value={activeNote.title}
                        onChange={(e) =>
                          updateNote({ ...activeNote, title: e.target.value })
                        }
                        className="w-full px-1 py-0.5 bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 bg-white border-win95-inset p-1 overflow-auto">
                      <textarea
                        value={activeNote.content}
                        onChange={(e) =>
                          updateNote({ ...activeNote, content: e.target.value })
                        }
                        className="w-full h-full px-1 py-0.5 bg-transparent resize-none focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-1 bg-win95-gray-200 border-t border-win95-gray-400 flex justify-between items-center">
                    <input
                      type="text"
                      value={activeNote.category}
                      onChange={(e) =>
                        updateNote({ ...activeNote, category: e.target.value })
                      }
                      placeholder="Category"
                      className="px-1 py-0.5 border-win95-inset bg-white w-40"
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

      {/* Web Browser Window */}
      {isWebBrowserOpen && (
        <div className="absolute top-20 left-20 w-3/4 h-3/4 bg-win95-gray-200 border-win95 shadow-win95-container">
          <div className={`p-1 flex justify-between items-center ${
            appSettings.theme === 'dark' ? 'bg-win95-gray-500' :
            appSettings.theme === 'blue' ? 'bg-win95-blue-300' :
            appSettings.theme === 'green' ? 'bg-win95-green' :
            appSettings.theme === 'pink' ? 'bg-pink-300' :
            'bg-win95-blue-300'
          }`}>
            <div className="flex items-center">
              <Windows95Icon />
              <span className="font-bold text-white">Web Browser</span>
            </div>
            <button onClick={() => setIsWebBrowserOpen(false)} className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset">
              <XIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col h-full">
            <div className="p-2 flex items-center">
              <button
                onClick={addWebsite}
                className="py-1 px-2 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset flex items-center justify-center mr-2"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                New Website
              </button>
              {activeWebsite && (
                <>
                  <input
                    type="text"
                    value={activeWebsite.title}
                    onChange={(e) => updateWebsite({ ...activeWebsite, title: e.target.value })}
                    className="px-2 py-1 border-2 border-win95-gray-500 bg-white mr-2"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={activeWebsite.url}
                    onChange={(e) => updateWebsite({ ...activeWebsite, url: e.target.value })}
                    className="px-2 py-1 border-2 border-win95-gray-500 bg-white flex-grow"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => deleteWebsite(activeWebsite.id)}
                    className="ml-2 py-1 px-2 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            <div className="flex-1 flex">
              <div className="w-64 bg-win95-gray-200 border-r border-win95-gray-400 overflow-y-auto">
                {websites.map((website) => (
                  <div
                    key={website.id}
                    onClick={() => setActiveWebsite(website)}
                    className={`p-2 cursor-pointer hover:bg-win95-blue-300 hover:text-white ${
                      activeWebsite?.id === website.id ? 'bg-win95-blue-300 text-white' : ''
                    }`}
                  >
                    <h3 className="font-bold truncate">{website.title}</h3>
                    <p className="text-sm truncate">{website.url}</p>
                  </div>
                ))}
              </div>
              <div className="flex-1 bg-white">
                {activeWebsite && (
                  <iframe
                    src={activeWebsite.url}
                    className="w-full h-full border-none"
                    title={activeWebsite.title}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="h-10 bg-win95-gray-200 border-t-2 border-white flex items-center px-2">
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className="px-4 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset flex items-center"
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
        </div>
        <div className="px-2 py-1 bg-win95-gray-300 border-win95-inset">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Start Menu */}
      {isStartMenuOpen && (
        <div className="absolute bottom-10 left-0 w-64 bg-win95-gray-200 border-win95 shadow-lg">
          <div className="p-2 bg-win95-blue-300 text-white font-bold">
            Windows 95
          </div>
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
      {isSettingsOpen && <SettingsPanel />}
    </div>
  )
}

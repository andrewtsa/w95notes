// Planner.tsx
import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X as XIcon,
  Plus,
  Calendar as CalendarIcon,
  Tag,
  Clock,
} from 'lucide-react'

interface Event {
  id: string
  date: Date
  title: string
  category: string
  time?: string
  description?: string
}

const schoolHolidays = [
  { date: new Date(2024, 0, 1), title: "New Year's Day" },
  { date: new Date(2024, 0, 15), title: 'Martin Luther King Jr. Day' },
  { date: new Date(2024, 2, 25), title: 'Spring Break Starts' },
  { date: new Date(2024, 2, 29), title: 'Spring Break Ends' },
  { date: new Date(2024, 4, 27), title: 'Memorial Day' },
  { date: new Date(2024, 8, 2), title: 'Labor Day' },
  { date: new Date(2024, 10, 28), title: 'Thanksgiving Break Starts' },
  { date: new Date(2024, 11, 20), title: 'Winter Break Starts' },
]

const eventCategories = ['School', 'Work', 'Personal', 'Appointment', 'Other']

const Windows95Icon = () => (
  <div className="w-4 h-4 mr-2 grid grid-cols-2 grid-rows-2 gap-0.5">
    <div className="bg-win95-red"></div>
    <div className="bg-win95-green"></div>
    <div className="bg-win95-blue-300"></div>
    <div className="bg-win95-yellow"></div>
  </div>
)

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-2 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset ${className}`}
  >
    {children}
  </button>
)

const Input = ({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'text',
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  type?: string
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-2 py-1 border-2 border-win95-gray-500 bg-white ${className}`}
  />
)

const Select = ({
  value,
  onChange,
  options,
  className = '',
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  className?: string
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`px-2 py-1 border-2 border-win95-gray-500 bg-white ${className}`}
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
)

const Tabs = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col h-full">{children}</div>
)

const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div className="flex bg-win95-gray-200 border-b border-win95-gray-400">{children}</div>
)

const TabsTrigger = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 border-win95 ${
      isActive ? 'bg-win95-gray-300 border-b-0' : 'bg-win95-gray-200'
    }`}
  >
    {children}
  </button>
)

const TabsContent = ({
  children,
  isActive,
}: {
  children: React.ReactNode
  isActive: boolean
}) => (
  <div className={`flex-1 p-4 bg-white overflow-auto ${isActive ? '' : 'hidden'}`}>
    {children}
  </div>
)

const Calendar = ({
  date,
  onDateChange,
  events,
  holidays,
  onDayClick,
}: {
  date: Date
  onDateChange: (date: Date) => void
  events: Event[]
  holidays: { date: Date; title: string }[]
  onDayClick: (date: Date) => void
}) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isEvent = (day: number) =>
    events.some((event) => {
      const eventDate = event.date
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })

  const isHoliday = (day: number) =>
    holidays.some((holiday) => {
      const holidayDate = holiday.date
      return (
        holidayDate.getDate() === day &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getFullYear() === date.getFullYear()
      )
    })

  return (
    <div className="bg-white border-2 border-win95-gray-500 p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() =>
            onDateChange(new Date(date.getFullYear(), date.getMonth() - 1, 1))
          }
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-bold">
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <Button
          onClick={() =>
            onDateChange(new Date(date.getFullYear(), date.getMonth() + 1, 1))
          }
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className="p-2"></div>
        ))}
        {days.map((day) => (
          <Button
            key={day}
            onClick={() => onDayClick(new Date(date.getFullYear(), date.getMonth(), day))}
            className={`p-2 text-center ${
              isToday(day) ? 'bg-win95-blue-300 text-white' : ''
            } ${isEvent(day) ? 'bg-win95-green' : ''} ${
              isHoliday(day) ? 'text-red-600 font-bold' : ''
            }`}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  )
}

const DayView = ({
  date,
  events,
  onClose,
  onAddEvent,
  onDeleteEvent,
  onEditEvent,
}: {
  date: Date
  events: Event[]
  onClose: () => void
  onAddEvent: () => void
  onDeleteEvent: (id: string) => void
  onEditEvent: (event: Event) => void
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white border-2 border-win95-gray-500 flex flex-col">
      <div className="p-2 bg-win95-blue-300 text-white flex justify-between items-center">
        <span className="font-bold">{date.toDateString()}</span>
        <button
          onClick={onClose}
          className="px-2 py-1 bg-win95-gray-200 text-black border-win95 hover:bg-win95-gray-300 active:border-win95-inset"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {events.length === 0 ? (
          <p className="text-center text-gray-500">No events for this day</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="mb-4 p-2 bg-win95-gray-200 border-win95">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{event.title}</h3>
                <div>
                  <Button
                    onClick={() => onEditEvent(event)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => onDeleteEvent(event.id)}>Delete</Button>
                </div>
              </div>
              <p className="text-sm">
                <Clock className="inline-block w-4 h-4 mr-1" />
                {event.time || 'All day'}
              </p>
              <p className="text-sm">
                <Tag className="inline-block w-4 h-4 mr-1" />
                {event.category}
              </p>
              {event.description && (
                <p className="mt-2 text-sm">{event.description}</p>
              )}
            </div>
          ))
        )}
      </div>
      <div className="p-2 border-t border-win95-gray-400">
        <Button onClick={onAddEvent} className="w-full">
          <Plus className="inline-block w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
    </div>
  )
}

const EventForm = ({
  event,
  onSave,
  onCancel,
}: {
  event: Event
  onSave: (event: Event) => void
  onCancel: () => void
}) => {
  const [title, setTitle] = useState(event.title)
  const [category, setCategory] = useState(event.category)
  const [date, setDate] = useState(event.date.toISOString().split('T')[0])
  const [time, setTime] = useState(event.time || '')
  const [description, setDescription] = useState(event.description || '')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Parse the date string into year, month, and day
    const [year, month, day] = date.split('-').map(Number)
    // Create a new Date object in local time
    const dateObj = new Date(year, month - 1, day)
    onSave({
      ...event,
      title,
      category,
      date: dateObj,
      time,
      description,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border-2 border-win95-gray-500"
    >
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={eventCategories}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Time (optional)</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-2 py-1 border-2 border-win95-gray-500 bg-white"
          rows={3}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

export default function PlannerApp({ onClose }: { onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState('calendar')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Helper function to normalize dates
  const normalizeDate = (date: Date) => {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }

  // Function to compare dates
  const areSameDay = (date1: Date, date2: Date) => {
    return normalizeDate(date1).getTime() === normalizeDate(date2).getTime()
  }

  useEffect(() => {
    const savedEvents = localStorage.getItem('plannerEvents')
    if (savedEvents) {
      setEvents(
        JSON.parse(savedEvents).map((event: Event) => ({
          ...event,
          date: new Date(event.date),
        }))
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('plannerEvents', JSON.stringify(events))
  }, [events])

  const addEvent = (newEvent: Event) => {
    const normalizedDate = normalizeDate(newEvent.date)
    setEvents([...events, { ...newEvent, date: normalizedDate }])
    setIsAddingEvent(false)
    setEditingEvent(null)
    setSelectedDay(null)
  }

  const updateEvent = (updatedEvent: Event) => {
    const normalizedDate = normalizeDate(updatedEvent.date)
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? { ...updatedEvent, date: normalizedDate } : event
      )
    )
    setIsAddingEvent(false)
    setEditingEvent(null)
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDay(normalizeDate(date))
  }

  const handleAddEventClick = () => {
    setIsAddingEvent(true)
    setEditingEvent({
      id: Date.now().toString(),
      date: selectedDay || new Date(),
      title: '',
      category: eventCategories[0],
    })
  }

  const isHoliday = (date: Date) => {
    return schoolHolidays.some((holiday) => areSameDay(holiday.date, date))
  }

  const getHolidayTitle = (date: Date) => {
    const holiday = schoolHolidays.find((holiday) => areSameDay(holiday.date, date))
    return holiday ? holiday.title : ''
  }

  return (
    <div className="w-full h-full bg-win95-gray-200 border-win95 shadow-win95-container flex flex-col">
      <div className="p-1 flex justify-between items-center bg-win95-blue-300">
        <div className="flex items-center">
          <Windows95Icon />
          <span className="font-bold text-white">Planner</span>
        </div>
        <button
          onClick={onClose}
          className="px-2 py-0.5 bg-win95-gray-200 border-win95 active:border-win95-inset"
        >
          <XIcon className="w-3 h-3" />
        </button>
      </div>
      <Tabs>
        <TabsList>
          <TabsTrigger
            isActive={activeTab === 'calendar'}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === 'planner'}
            onClick={() => setActiveTab('planner')}
          >
            Planner
          </TabsTrigger>
          <TabsTrigger
            isActive={activeTab === 'holidays'}
            onClick={() => setActiveTab('holidays')}
          >
            Holidays
          </TabsTrigger>
        </TabsList>
        <TabsContent isActive={activeTab === 'calendar'}>
          <Calendar
            date={selectedDate}
            onDateChange={setSelectedDate}
            events={events}
            holidays={schoolHolidays}
            onDayClick={handleDayClick}
          />
          {selectedDay && (
            <DayView
              date={selectedDay}
              events={events.filter((event) => areSameDay(event.date, selectedDay))}
              onClose={() => setSelectedDay(null)}
              onAddEvent={handleAddEventClick}
              onDeleteEvent={deleteEvent}
              onEditEvent={(event) => {
                setEditingEvent(event)
                setIsAddingEvent(true)
              }}
            />
          )}
          {isAddingEvent && editingEvent && (
            <EventForm
              event={editingEvent}
              onSave={editingEvent.id ? updateEvent : addEvent}
              onCancel={() => {
                setIsAddingEvent(false)
                setEditingEvent(null)
              }}
            />
          )}
        </TabsContent>
        <TabsContent isActive={activeTab === 'planner'}>
          <div className="flex flex-col h-full">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Events</h2>
              <Button onClick={handleAddEventClick}>
                <Plus className="inline-block w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              {events.length === 0 ? (
                <p className="text-center text-gray-500">No events scheduled</p>
              ) : (
                events
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((event) => (
                    <div
                      key={event.id}
                      className="mb-4 p-2 bg-win95-gray-200 border-win95"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{event.title}</h3>
                        <div>
                          <Button
                            onClick={() => {
                              setEditingEvent(event)
                              setIsAddingEvent(true)
                            }}
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
                        </div>
                      </div>
                      <p className="text-sm">
                        <CalendarIcon className="inline-block w-4 h-4 mr-1" />
                        {event.date.toDateString()}
                      </p>
                      <p className="text-sm">
                        <Clock className="inline-block w-4 h-4 mr-1" />
                        {event.time || 'All day'}
                      </p>
                      <p className="text-sm">
                        <Tag className="inline-block w-4 h-4 mr-1" />
                        {event.category}
                      </p>
                      {event.description && (
                        <p className="mt-2 text-sm">{event.description}</p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
          {isAddingEvent && editingEvent && (
            <EventForm
              event={editingEvent}
              onSave={editingEvent.id ? updateEvent : addEvent}
              onCancel={() => {
                setIsAddingEvent(false)
                setEditingEvent(null)
              }}
            />
          )}
        </TabsContent>
        <TabsContent isActive={activeTab === 'holidays'}>
          <h2 className="text-lg font-bold mb-4">School Holidays</h2>
          <ul>
            {schoolHolidays.map((holiday, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold">{holiday.date.toDateString()}</span>:{' '}
                {holiday.title}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}

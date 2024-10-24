import React, { useState } from 'react'
import { XIcon, BookOpen, Search, FolderOpen } from 'lucide-react'
import Draggable from 'react-draggable' // Import Draggable
import { ResizableBox } from 'react-resizable' // Import ResizableBox
import 'react-resizable/css/styles.css' // Import styles for resizable

interface Book {
  id: string
  title: string
  category: string
  pdfUrl: string
}

interface LibraryProps {
  onClose: () => void
}

export default function Library({ onClose }: LibraryProps) {
  const [books, setBooks] = useState<Book[]>([
    { id: '1', title: 'Little Seagull Handbook', category: 'Reference', pdfUrl: '/littleseagullhandbook.pdf' },
    { id: '3', title: 'The Maine Journal of Education (1871)', category: 'Reference', pdfUrl: '/mainejournalofeducation1871.pdf' },
    { id: '4', title: 'Introduction to React', category: 'Programming', pdfUrl: '/placeholder.pdf' },
    { id: '5', title: 'Windows 95 User Guide', category: 'Technology', pdfUrl: '/placeholder.pdf' },
  ])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(books.map(book => book.category)))]

  const filteredBooks = books.filter(book => 
    (activeCategory === 'All' || book.category === activeCategory) &&
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openPdf = (book: Book) => {
    setSelectedBook(book)
  }

  const closePdf = () => {
    setSelectedBook(null)
  }

  return (
    <>
      <Draggable>
        <ResizableBox
          width={640} // Set default width to 640
          height={640} // Set default height to 640
          minConstraints={[300, 200]}
          maxConstraints={[800, 800]} // Adjust max constraints if needed
          className="bg-blue-200 border border-gray-400 shadow-lg rounded-lg"
        >
          <div className="h-full">
            <div className="p-2 flex justify-between items-center bg-blue-300 border-b border-gray-500">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-white" />
                <span className="font-bold text-white">Library</span>
              </div>
              <button
                onClick={onClose}
                className="px-2 py-1 bg-gray-200 border border-gray-400 rounded hover:bg-gray-300"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
            <div className="flex h-full">
              {/* Icon Bar */}
              <div className="w-16 bg-gray-100 border-r border-gray-400 flex flex-col items-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex flex-col items-center p-2 hover:bg-blue-400 rounded ${
                      activeCategory === category ? 'bg-blue-300 text-white' : 'bg-blue-200 text-black'
                    }`}
                  >
                    <FolderOpen className="w-6 h-6" />
                    <span className="text-xs">{category}</span>
                  </button>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col bg-gray-100 border-l border-gray-400 overflow-hidden">
                <div className="p-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-400 bg-white rounded"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => openPdf(book)}
                      className={`p-2 cursor-pointer hover:bg-blue-300 hover:text-white ${
                        selectedBook?.id === book.id ? 'bg-blue-300 text-white' : ''
                      }`}
                    >
                      <h3 className="font-bold truncate">{book.title}</h3>
                      <p className="text-sm truncate">{book.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ResizableBox>
      </Draggable>

      {/* PDF Viewer Modal - Independent from the Library Window */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full rounded-lg shadow-lg">
            <div className="p-2 flex justify-between items-center bg-blue-300 border-b border-gray-500">
              <span className="font-bold text-white">{selectedBook.title}</span>
              <button onClick={closePdf} className="text-white">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <iframe
              src={selectedBook.pdfUrl}
              className="w-full h-full border-none"
              title={selectedBook.title}
            />
          </div>
        </div>
      )}
    </>
  )
}

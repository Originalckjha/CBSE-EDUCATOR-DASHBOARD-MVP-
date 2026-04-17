import { Bell, Search } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  const user = useAppSelector((s) => s.auth.user)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/resources?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500">{today}</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-1 focus:ring-primary-500 focus:outline-none w-56 transition"
          />
        </div>
      </form>

      {/* Notification */}
      <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
      </button>

      {/* Avatar */}
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">{user.name}</p>
            <p className="text-xs text-gray-500">{user.subjects[0] ?? 'Teacher'}</p>
          </div>
        </div>
      )}
    </header>
  )
}

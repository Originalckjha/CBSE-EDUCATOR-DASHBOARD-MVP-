import { Link } from 'react-router-dom'
import { FileText, GraduationCap, FolderOpen, Bookmark, Plus, Clock, TrendingUp } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { formatDistanceToNow } from 'date-fns'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { ClassItem } from '@/types'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const CURRENT_DAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })

function getUpcomingClasses(classes: ClassItem[]) {
  const today = DAY_ORDER.indexOf(CURRENT_DAY)
  return classes
    .flatMap((c: ClassItem) =>
      c.schedule.map((s) => ({
        id: `${c.id}-${s.day}`,
        className: c.name,
        subject: c.subject,
        day: s.day,
        startTime: s.startTime,
        room: s.room,
        dayIndex: DAY_ORDER.indexOf(s.day),
        color: c.color,
      })),
    )
    .filter((s) => s.dayIndex >= today)
    .sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex
      return a.startTime.localeCompare(b.startTime)
    })
    .slice(0, 5)
}

const activityData = [
  { day: 'Mon', notes: 2, resources: 1 },
  { day: 'Tue', notes: 1, resources: 3 },
  { day: 'Wed', notes: 4, resources: 2 },
  { day: 'Thu', notes: 2, resources: 0 },
  { day: 'Fri', notes: 3, resources: 4 },
  { day: 'Sat', notes: 1, resources: 1 },
  { day: 'Sun', notes: 0, resources: 2 },
]

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user)
  const notes = useAppSelector((s) => s.notes.items)
  const classes = useAppSelector((s) => s.classes.items)
  const resources = useAppSelector((s) => s.resources.items)

  const bookmarked = resources.filter((r) => r.isBookmarked).length
  const upcoming = getUpcomingClasses([...classes])
  const recentNotes = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3)
  const recentResources = [...resources].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)).slice(0, 3)

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: FileText, color: 'bg-blue-50 text-blue-600', link: '/notes' },
    { label: 'Classes', value: classes.length, icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600', link: '/classes' },
    { label: 'Resources', value: resources.length, icon: FolderOpen, color: 'bg-violet-50 text-violet-600', link: '/resources' },
    { label: 'Bookmarked', value: bookmarked, icon: Bookmark, color: 'bg-amber-50 text-amber-600', link: '/resources' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{user?.school}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/notes/new">
            <Button icon={<Plus className="w-4 h-4" />} size="sm">
              New Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="card p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming classes */}
        <div className="card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Classes</h3>
            <Link to="/classes" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming classes this week</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div
                    className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.className}</p>
                    <p className="text-xs text-gray-500">{item.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.day === CURRENT_DAY ? 'Today' : item.day} · {item.startTime}
                      </span>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[10px] flex-shrink-0">{item.room}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Weekly Activity</h3>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
                Notes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />
                Resources
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                cursor={{ stroke: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="notes" stroke="#3b82f6" strokeWidth={2} fill="url(#colorNotes)" />
              <Area type="monotone" dataKey="resources" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorResources)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Notes</h3>
            <Link to="/notes" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="w-7 h-7 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notes yet</p>
              <Link to="/notes/new">
                <Button variant="ghost" size="sm" className="mt-2">
                  Create your first note
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}/edit`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {note.subject} · {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  {note.isPinned && (
                    <span className="text-amber-500 text-xs">📌</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Resources */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Resources</h3>
            <Link to="/resources" className="text-xs text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {recentResources.length === 0 ? (
            <div className="text-center py-6">
              <FolderOpen className="w-7 h-7 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No resources yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentResources.map((resource) => (
                <div key={resource.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{resource.title}</p>
                    <p className="text-xs text-gray-500">
                      {resource.subject} · {resource.type.toUpperCase()}
                    </p>
                  </div>
                  <Badge variant="default">{resource.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

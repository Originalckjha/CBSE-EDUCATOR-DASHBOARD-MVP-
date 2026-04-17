import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, MapPin, Pencil } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cls = useAppSelector((s) => s.classes.items.find((c) => c.id === id))
  const resources = useAppSelector((s) =>
    s.resources.items.filter((r) => r.grade.includes(cls?.grade ?? 0) && r.subject === cls?.subject),
  )

  if (!cls) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Class not found.</p>
        <Link to="/classes">
          <Button variant="secondary">Back to Classes</Button>
        </Link>
      </div>
    )
  }

  const sortedSchedule = [...cls.schedule].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day),
  )

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="h-2" style={{ backgroundColor: cls.color }} />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{cls.name}</h2>
              <p className="text-gray-500 mt-0.5">{cls.description}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Pencil className="w-4 h-4" />}
              onClick={() => navigate('/classes')}
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Subject', value: cls.subject },
              { label: 'Students', value: cls.studentCount },
              { label: 'Academic Year', value: cls.academicYear },
              { label: 'Grade', value: `Class ${cls.grade} – ${cls.section}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-semibold text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Weekly Schedule
        </h3>
        <div className="space-y-2">
          {sortedSchedule.map((slot, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div
                className="w-2 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: cls.color }}
              />
              <div className="w-28">
                <p className="text-sm font-medium text-gray-900">{slot.day}</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {slot.startTime} – {slot.endTime}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 ml-auto">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {slot.room}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related resources */}
      {resources.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Related Resources ({resources.length})</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {resources.slice(0, 6).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.type.toUpperCase()}</p>
                </div>
                <Badge variant="default" className="flex-shrink-0">{r.type}</Badge>
              </div>
            ))}
          </div>
          {resources.length > 6 && (
            <Link to="/resources" className="text-xs text-primary-600 hover:underline mt-3 block">
              View all {resources.length} resources →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

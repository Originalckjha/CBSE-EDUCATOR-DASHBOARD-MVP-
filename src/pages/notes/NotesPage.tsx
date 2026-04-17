import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pin, Pencil, Trash2, FileText, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteNote, togglePin, setSearchQuery, setFilterSubject, setFilterGrade } from '@/store/slices/notesSlice'
import type { Note, NoteColor } from '@/types'
import { SUBJECTS, GRADES } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const NOTE_COLORS: Record<NoteColor, string> = {
  white: 'bg-white',
  yellow: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-emerald-50 border-emerald-200',
  pink: 'bg-pink-50 border-pink-200',
  purple: 'bg-purple-50 border-purple-200',
}

function NoteCard({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) {
  const dispatch = useAppDispatch()

  return (
    <div className={clsx('relative rounded-xl border p-4 group transition hover:shadow-md', NOTE_COLORS[note.color])}>
      {/* Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => dispatch(togglePin(note.id))}
          className={clsx(
            'w-7 h-7 rounded-lg flex items-center justify-center transition',
            note.isPinned ? 'text-amber-500 bg-amber-100' : 'text-gray-400 hover:bg-white hover:text-gray-600',
          )}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>
        <Link
          to={`/notes/${note.id}/edit`}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary-600 transition"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => onDelete(note.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-600 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {note.isPinned && (
        <Pin className="absolute top-3 left-3 w-3 h-3 text-amber-500" />
      )}

      <Link to={`/notes/${note.id}/edit`} className="block">
        <h3 className="font-semibold text-gray-900 text-sm pr-20 mb-1 truncate hover:text-primary-600 transition-colors">
          {note.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-3 mb-3">
          {note.content.replace(/[#*`\[\]]/g, '').slice(0, 150)}
        </p>
      </Link>

      <div className="flex flex-wrap gap-1 mb-2">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] bg-white/80 border border-gray-200 rounded-full px-2 py-0.5 text-gray-600">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Badge variant="primary">{note.subject}</Badge>
          {note.grade && <Badge variant="default">Gr. {note.grade}</Badge>}
        </div>
        <span className="text-[10px] text-gray-400">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}

export default function NotesPage() {
  const dispatch = useAppDispatch()
  const { items, searchQuery, filterSubject, filterGrade } = useAppSelector((s) => s.notes)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter((n) => {
    const matchSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchSubject = !filterSubject || n.subject === filterSubject
    const matchGrade = !filterGrade || n.grade === filterGrade
    return matchSearch && matchSubject && matchGrade
  })

  const pinned = filtered.filter((n) => n.isPinned)
  const unpinned = filtered.filter((n) => !n.isPinned)

  function handleDelete(id: string) {
    dispatch(deleteNote(id))
    toast.success('Note deleted')
    setDeleteId(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            'btn-secondary flex items-center gap-2',
            showFilters && 'bg-primary-50 border-primary-300 text-primary-700',
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <Link to="/notes/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Note</Button>
        </Link>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 flex flex-wrap gap-4 animate-slide-in">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <select
              className="input w-auto"
              value={filterSubject}
              onChange={(e) => dispatch(setFilterSubject(e.target.value))}
            >
              <option value="">All</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Grade</label>
            <select
              className="input w-auto"
              value={filterGrade}
              onChange={(e) => dispatch(setFilterGrade(e.target.value))}
            >
              <option value="">All</option>
              {GRADES.map((g) => (
                <option key={g} value={String(g)}>
                  Class {g}
                </option>
              ))}
            </select>
          </div>
          <button
            className="text-xs text-gray-500 hover:text-red-600 transition"
            onClick={() => {
              dispatch(setFilterSubject(''))
              dispatch(setFilterGrade(''))
              dispatch(setSearchQuery(''))
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes found"
          description={searchQuery || filterSubject || filterGrade ? 'Try adjusting your filters' : 'Start by creating your first note'}
          action={
            !searchQuery && !filterSubject && !filterGrade ? (
              <Link to="/notes/new">
                <Button icon={<Plus className="w-4 h-4" />}>Create Note</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          {pinned.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Pin className="w-3 h-3" /> Pinned
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pinned.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={(id) => setDeleteId(id)} />
                ))}
              </div>
            </section>
          )}
          {unpinned.length > 0 && (
            <section>
              {pinned.length > 0 && (
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">All Notes</h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {unpinned.map((note) => (
                  <NoteCard key={note.id} note={note} onDelete={(id) => setDeleteId(id)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        message="This note will be permanently deleted."
      />
    </div>
  )
}

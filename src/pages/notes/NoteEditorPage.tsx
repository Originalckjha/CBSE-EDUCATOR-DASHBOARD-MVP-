import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { ArrowLeft, Pin, Save, Tag, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addNote, updateNote } from '@/store/slices/notesSlice'
import type { Note, NoteColor } from '@/types'
import { SUBJECTS, GRADES } from '@/types'
import Button from '@/components/ui/Button'
import { Select } from '@/components/ui/Input'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  content: z.string().min(1, 'Content is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string(),
  chapter: z.string(),
  color: z.string() as z.ZodType<NoteColor>,
})
type FormData = z.infer<typeof schema>

const COLOR_OPTIONS: { value: NoteColor; label: string; bg: string }[] = [
  { value: 'white', label: 'White', bg: 'bg-white' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-amber-100' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-100' },
  { value: 'green', label: 'Green', bg: 'bg-emerald-100' },
  { value: 'pink', label: 'Pink', bg: 'bg-pink-100' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-100' },
]

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const notes = useAppSelector((s) => s.notes.items)
  const existingNote = id ? notes.find((n) => n.id === id) : undefined

  const [tags, setTags] = useState<string[]>(existingNote?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [isPinned, setIsPinned] = useState(existingNote?.isPinned ?? false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existingNote?.title ?? '',
      content: existingNote?.content ?? '',
      subject: existingNote?.subject ?? '',
      grade: existingNote?.grade ?? '',
      chapter: existingNote?.chapter ?? '',
      color: existingNote?.color ?? 'white',
    },
  })

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
    setTagInput('')
  }

  function onSubmit(data: FormData) {
    const now = new Date().toISOString()
    if (existingNote) {
      const updated: Note = {
        ...existingNote,
        ...data,
        tags,
        isPinned,
        updatedAt: now,
      }
      dispatch(updateNote(updated))
      toast.success('Note saved')
    } else {
      const note: Note = {
        id: uuid(),
        ...data,
        tags,
        isPinned,
        createdAt: now,
        updatedAt: now,
      }
      dispatch(addNote(note))
      toast.success('Note created')
    }
    navigate('/notes')
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPinned((v) => !v)}
            className={clsx(
              'w-9 h-9 rounded-lg flex items-center justify-center transition',
              isPinned ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:bg-gray-100',
            )}
            title={isPinned ? 'Unpin' : 'Pin note'}
          >
            <Pin className="w-4 h-4" />
          </button>
          <Button
            icon={<Save className="w-4 h-4" />}
            onClick={handleSubmit(onSubmit)}
          >
            {existingNote ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div>
          <input
            {...register('title')}
            placeholder="Note title…"
            className={clsx(
              'w-full text-2xl font-bold border-0 border-b-2 bg-transparent px-0 py-2 focus:outline-none transition',
              errors.title ? 'border-red-400' : 'border-gray-200 focus:border-primary-500',
            )}
          />
          {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select
                label="Subject"
                placeholder="Select"
                options={SUBJECTS.map((s) => ({ value: s, label: s }))}
                error={errors.subject?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <Select
                label="Grade"
                placeholder="Select"
                options={GRADES.map((g) => ({ value: String(g), label: `Class ${g}` }))}
                {...field}
              />
            )}
          />
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
            <input
              {...register('chapter')}
              placeholder="e.g. Chapter 3: Heredity"
              className="input"
            />
          </div>
        </div>

        {/* Color picker */}
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Color</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => field.onChange(c.value)}
                    className={clsx(
                      'w-7 h-7 rounded-full border-2 transition',
                      c.bg,
                      field.value === c.value ? 'border-primary-500 scale-110' : 'border-gray-200 hover:border-gray-400',
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          )}
        />

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported)</label>
          <textarea
            {...register('content')}
            rows={16}
            placeholder={`# Heading\n\nWrite your note here...\n\n**Bold** and *italic* text supported.`}
            className={clsx(
              'input font-mono text-sm resize-y',
              errors.content && 'border-red-400',
            )}
          />
          {errors.content && <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                  className="text-primary-400 hover:text-primary-700 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Add tag and press Enter"
              className="input flex-1"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

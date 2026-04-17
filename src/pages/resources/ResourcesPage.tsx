import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Plus, Search, FolderOpen, Bookmark, Trash2, Pencil, ExternalLink,
  FileText, Video, Link2, Image, File, Presentation, Filter, BookmarkCheck,
} from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addResource, updateResource, deleteResource, toggleBookmark,
  setSearchQuery, setFilterSubject, setFilterType, setFilterGrade,
} from '@/store/slices/resourcesSlice'
import type { Resource, ResourceType } from '@/types'
import { SUBJECTS, GRADES } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input, { Select, TextArea } from '@/components/ui/Input'

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Video' },
  { value: 'link', label: 'Link' },
  { value: 'document', label: 'Document' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'image', label: 'Image' },
]

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  pdf: FileText,
  video: Video,
  link: Link2,
  image: Image,
  document: File,
  presentation: Presentation,
}

const TYPE_COLORS: Record<ResourceType, string> = {
  pdf: 'bg-red-50 text-red-600',
  video: 'bg-violet-50 text-violet-600',
  link: 'bg-blue-50 text-blue-600',
  image: 'bg-green-50 text-green-600',
  document: 'bg-amber-50 text-amber-600',
  presentation: 'bg-orange-50 text-orange-600',
}

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  type: z.string() as z.ZodType<ResourceType>,
  url: z.string().url('Enter a valid URL').or(z.literal('#')),
  subject: z.string().min(1, 'Subject is required'),
  chapter: z.string(),
  tags: z.string(),
  grades: z.array(z.coerce.number()),
})
type FormData = z.infer<typeof schema>

function ResourceForm({ initial, onSave, onClose }: { initial?: Resource; onSave: (data: FormData) => void; onClose: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      type: initial?.type ?? 'pdf',
      url: initial?.url ?? '',
      subject: initial?.subject ?? '',
      chapter: initial?.chapter ?? '',
      tags: initial?.tags.join(', ') ?? '',
      grades: initial?.grade ?? [],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Title" placeholder="NCERT Mathematics Class 10" error={errors.title?.message} {...register('title')} />
      <TextArea label="Description" placeholder="Brief description of this resource" rows={2} {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Type"
              options={RESOURCE_TYPES}
              {...field}
            />
          )}
        />
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
      </div>
      <Input label="URL" type="url" placeholder="https://…" error={errors.url?.message} {...register('url')} />
      <Input label="Chapter" placeholder="e.g. Chapter 5: Electricity" {...register('chapter')} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Grades</label>
        <div className="flex flex-wrap gap-2">
          <Controller
            name="grades"
            control={control}
            render={({ field }) => (
              <>
                {GRADES.map((g) => (
                  <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      value={g}
                      checked={field.value.includes(g)}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        field.onChange(
                          e.target.checked ? [...field.value, val] : field.value.filter((v) => v !== val),
                        )
                      }}
                      className="rounded border-gray-300 text-primary-600"
                    />
                    <span className="text-sm text-gray-700">Class {g}</span>
                  </label>
                ))}
              </>
            )}
          />
        </div>
      </div>
      <Input label="Tags (comma separated)" placeholder="ncert, textbook, exam-prep" {...register('tags')} />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {initial ? 'Save Changes' : 'Add Resource'}
        </Button>
      </div>
    </form>
  )
}

export default function ResourcesPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const { items, searchQuery, filterSubject, filterType, filterGrade } = useAppSelector((s) => s.resources)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Resource | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) dispatch(setSearchQuery(q))
  }, [searchParams, dispatch])

  const filtered = items.filter((r) => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q))
    const matchSubject = !filterSubject || r.subject === filterSubject
    const matchType = !filterType || r.type === filterType
    const matchGrade = !filterGrade || r.grade.includes(Number(filterGrade))
    const matchBookmark = !bookmarkedOnly || r.isBookmarked
    return matchSearch && matchSubject && matchType && matchGrade && matchBookmark
  })

  function handleSave(data: FormData) {
    const now = new Date().toISOString()
    const tags = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editItem) {
      dispatch(updateResource({ ...editItem, ...data, grade: data.grades, tags, updatedAt: now }))
      toast.success('Resource updated')
    } else {
      const resource: Resource = {
        id: uuid(),
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        subject: data.subject,
        chapter: data.chapter,
        grade: data.grades,
        tags,
        isBookmarked: false,
        uploadedAt: now,
        updatedAt: now,
      }
      dispatch(addResource(resource))
      toast.success('Resource added')
    }
    setModalOpen(false)
    setEditItem(undefined)
  }

  function handleDelete(id: string) {
    dispatch(deleteResource(id))
    toast.success('Resource deleted')
    setDeleteId(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setBookmarkedOnly((v) => !v)}
          className={clsx(
            'btn-secondary flex items-center gap-2',
            bookmarkedOnly && 'bg-amber-50 border-amber-300 text-amber-700',
          )}
        >
          {bookmarkedOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          <span className="hidden sm:inline">Bookmarked</span>
        </button>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx('btn-secondary flex items-center gap-2', showFilters && 'bg-primary-50 border-primary-300 text-primary-700')}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditItem(undefined)
            setModalOpen(true)
          }}
        >
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 flex flex-wrap gap-4 animate-slide-in">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <select className="input w-auto" value={filterSubject} onChange={(e) => dispatch(setFilterSubject(e.target.value))}>
              <option value="">All</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select className="input w-auto" value={filterType} onChange={(e) => dispatch(setFilterType(e.target.value))}>
              <option value="">All</option>
              {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Grade</label>
            <select className="input w-auto" value={filterGrade} onChange={(e) => dispatch(setFilterGrade(e.target.value))}>
              <option value="">All</option>
              {GRADES.map((g) => <option key={g} value={g}>Class {g}</option>)}
            </select>
          </div>
          <button
            className="text-xs text-gray-500 hover:text-red-600 transition"
            onClick={() => {
              dispatch(setFilterSubject(''))
              dispatch(setFilterType(''))
              dispatch(setFilterGrade(''))
              dispatch(setSearchQuery(''))
              setBookmarkedOnly(false)
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-sm text-gray-500">{filtered.length} resource{filtered.length !== 1 ? 's' : ''}</p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No resources found"
          description={searchQuery || filterSubject || filterType ? 'Try adjusting your filters' : 'Add your first teaching resource'}
          action={
            !searchQuery && !filterSubject && !filterType ? (
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                Add Resource
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const Icon = TYPE_ICONS[resource.type]
            const colorClass = TYPE_COLORS[resource.type]
            return (
              <div key={resource.id} className="card p-4 group hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{resource.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{resource.subject}</p>
                  </div>
                  <button
                    onClick={() => dispatch(toggleBookmark(resource.id))}
                    className={clsx(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition',
                      resource.isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50',
                    )}
                    title={resource.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <Bookmark className="w-3.5 h-3.5" fill={resource.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {resource.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{resource.description}</p>
                )}

                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.grade.map((g) => (
                    <Badge key={g} variant="default">Gr. {g}</Badge>
                  ))}
                  {resource.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {resource.url !== '#' && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open
                      </a>
                    )}
                    <span className="text-xs text-gray-400">{format(new Date(resource.uploadedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        setEditItem(resource)
                        setModalOpen(true)
                      }}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary-600 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(resource.id)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditItem(undefined)
        }}
        title={editItem ? 'Edit Resource' : 'Add Resource'}
        size="lg"
      >
        <ResourceForm
          initial={editItem}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false)
            setEditItem(undefined)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        message="This resource will be permanently deleted."
      />
    </div>
  )
}

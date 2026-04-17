import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, GraduationCap, Users, Clock, Trash2, Pencil } from 'lucide-react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addClass, updateClass, deleteClass, setSearchQuery } from '@/store/slices/classesSlice'
import type { ClassItem } from '@/types'
import { SUBJECTS, GRADES } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input, { Select } from '@/components/ui/Input'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
const CLASS_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4']

const scheduleSchema = z.object({
  day: z.enum(DAYS),
  startTime: z.string().min(1, 'Required'),
  endTime: z.string().min(1, 'Required'),
  room: z.string().min(1, 'Required'),
})

const schema = z.object({
  name: z.string().min(1, 'Class name is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.coerce.number().min(6).max(12),
  section: z.string().min(1, 'Section is required'),
  studentCount: z.coerce.number().min(1).max(100),
  description: z.string(),
  academicYear: z.string().min(1, 'Required'),
  color: z.string(),
  schedule: z.array(scheduleSchema),
})
type FormData = z.infer<typeof schema>

function ClassForm({ initial, onSave, onClose }: { initial?: ClassItem; onSave: (data: FormData) => void; onClose: () => void }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      subject: initial?.subject ?? '',
      grade: initial?.grade ?? 9,
      section: initial?.section ?? 'A',
      studentCount: initial?.studentCount ?? 30,
      description: initial?.description ?? '',
      academicYear: initial?.academicYear ?? '2024-25',
      color: initial?.color ?? CLASS_COLORS[0],
      schedule: initial?.schedule ?? [{ day: 'Monday', startTime: '09:00', endTime: '09:45', room: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'schedule' })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Class Name" placeholder="Class 10A" error={errors.name?.message} {...register('name')} />
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
      <div className="grid grid-cols-3 gap-3">
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <Select
              label="Grade"
              options={GRADES.map((g) => ({ value: String(g), label: `Class ${g}` }))}
              {...field}
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
        <Input label="Section" placeholder="A" {...register('section')} />
        <Input label="Students" type="number" placeholder="30" error={errors.studentCount?.message} {...register('studentCount')} />
      </div>
      <Input label="Academic Year" placeholder="2024-25" {...register('academicYear')} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex gap-2">
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {CLASS_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => field.onChange(c)}
                    className={clsx(
                      'w-7 h-7 rounded-full border-2 transition',
                      field.value === c ? 'border-gray-700 scale-110' : 'border-transparent',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* Schedule */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Schedule</label>
          <button
            type="button"
            onClick={() => append({ day: 'Monday', startTime: '09:00', endTime: '09:45', room: '' })}
            className="text-xs text-primary-600 hover:underline"
          >
            + Add slot
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg">
              <Controller
                name={`schedule.${idx}.day`}
                control={control}
                render={({ field: f }) => (
                  <Select
                    label="Day"
                    options={DAYS.map((d) => ({ value: d, label: d }))}
                    className="w-auto"
                    {...f}
                  />
                )}
              />
              <Input label="Start" type="time" className="w-auto" {...register(`schedule.${idx}.startTime`)} />
              <Input label="End" type="time" className="w-auto" {...register(`schedule.${idx}.endTime`)} />
              <Input label="Room" placeholder="Room 201" {...register(`schedule.${idx}.room`)} />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(idx)} className="text-red-500 hover:text-red-700 pb-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          {initial ? 'Save Changes' : 'Create Class'}
        </Button>
      </div>
    </form>
  )
}

export default function ClassesPage() {
  const dispatch = useAppDispatch()
  const { items, searchQuery } = useAppSelector((s) => s.classes)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<ClassItem | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  function handleSave(data: FormData) {
    if (editItem) {
      dispatch(updateClass({ ...editItem, ...data }))
      toast.success('Class updated')
    } else {
      dispatch(addClass({ id: uuid(), ...data, createdAt: new Date().toISOString() }))
      toast.success('Class created')
    }
    setModalOpen(false)
    setEditItem(undefined)
  }

  function handleEdit(item: ClassItem) {
    setEditItem(item)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    dispatch(deleteClass(id))
    toast.success('Class deleted')
    setDeleteId(null)
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="input pl-9"
          />
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditItem(undefined)
            setModalOpen(true)
          }}
        >
          New Class
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No classes yet"
          description="Create your first class to manage schedules and students"
          action={
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
              Create Class
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cls) => (
            <div key={cls.id} className="card overflow-hidden group hover:shadow-md transition-shadow">
              {/* Color bar */}
              <div className="h-1.5" style={{ backgroundColor: cls.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500">{cls.subject}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-primary-600 transition"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(cls.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-gray-400" />
                    {cls.studentCount} students
                  </div>
                  <Badge variant="primary">Grade {cls.grade}</Badge>
                </div>

                <div className="space-y-1.5 mb-4">
                  {cls.schedule.slice(0, 2).map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>
                        {s.day} · {s.startTime}–{s.endTime}
                      </span>
                      <span className="ml-auto text-gray-400">{s.room}</span>
                    </div>
                  ))}
                  {cls.schedule.length > 2 && (
                    <p className="text-xs text-gray-400">+{cls.schedule.length - 2} more slots</p>
                  )}
                </div>

                <Link
                  to={`/classes/${cls.id}`}
                  className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline transition"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditItem(undefined)
        }}
        title={editItem ? 'Edit Class' : 'New Class'}
        size="xl"
      >
        <ClassForm
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
        message="This class and its schedule will be permanently deleted."
      />
    </div>
  )
}

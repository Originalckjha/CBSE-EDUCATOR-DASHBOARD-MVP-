import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Trash2, Save, School, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateProfile, logout } from '@/store/slices/authSlice'
import { storage } from '@/lib/storage'
import { SUBJECTS } from '@/types'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  school: z.string().min(3, 'School name is required'),
  subject: z.string().min(1, 'Select a subject'),
})
type ProfileData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type PasswordData = z.infer<typeof passwordSchema>

function ProfileSection() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [loading, setLoading] = useState(false)

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      school: user?.school ?? '',
      subject: user?.subjects[0] ?? '',
    },
  })

  async function onSubmit(data: ProfileData) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    dispatch(updateProfile({ name: data.name, school: data.school, subjects: [data.subject] }))
    toast.success('Profile updated')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      </div>
      <Input label="School / Institution" error={errors.school?.message} {...register('school')} />
      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <Select
            label="Primary Subject"
            options={SUBJECTS.map((s) => ({ value: s, label: s }))}
            error={errors.subject?.message}
            {...field}
          />
        )}
      />
      <Button type="submit" icon={<Save className="w-4 h-4" />} loading={loading}>
        Save Profile
      </Button>
    </form>
  )
}

function PasswordSection() {
  const user = useAppSelector((s) => s.auth.user)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  })

  async function onSubmit(data: PasswordData) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const passwords = storage.get<Record<string, string>>('passwords') ?? {}
    if (passwords[user?.email ?? ''] !== data.currentPassword) {
      toast.error('Current password is incorrect')
      setLoading(false)
      return
    }
    passwords[user?.email ?? ''] = data.newPassword
    storage.set('passwords', passwords)
    toast.success('Password updated')
    reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="New Password"
          type="password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirm New Password"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>
      <Button type="submit" icon={<Lock className="w-4 h-4" />} loading={loading} variant="secondary">
        Update Password
      </Button>
    </form>
  )
}

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [clearConfirm, setClearConfirm] = useState(false)

  function handleClearData() {
    storage.remove('notes')
    storage.remove('classes')
    storage.remove('resources')
    storage.remove('seeded')
    dispatch(logout())
    toast.success('All data cleared')
    navigate('/login')
    setClearConfirm(false)
  }

  const sections = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'password', icon: Lock, label: 'Password' },
    { id: 'data', icon: Trash2, label: 'Data' },
  ]
  const [active, setActive] = useState('profile')

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <nav className="space-y-1">
            {sections.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active === id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-3 card p-6">
          {active === 'profile' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <School className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Profile Settings</h2>
              </div>
              <ProfileSection />
            </div>
          )}
          {active === 'password' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Change Password</h2>
              </div>
              <PasswordSection />
            </div>
          )}
          {active === 'data' && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Trash2 className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Data Management</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">About Your Data</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    All your notes, classes, and resources are stored locally in your browser. No data is sent to any server.
                    Clearing data is permanent and cannot be undone.
                  </p>
                </div>
                <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                  <p className="text-sm font-medium text-red-900 mb-1">Danger Zone</p>
                  <p className="text-sm text-red-700 mb-3">
                    This will permanently delete all your notes, classes, and resources, and log you out.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => setClearConfirm(true)}
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        message="This will permanently delete all notes, classes, and resources. This cannot be undone."
        confirmLabel="Clear All Data"
      />
    </div>
  )
}

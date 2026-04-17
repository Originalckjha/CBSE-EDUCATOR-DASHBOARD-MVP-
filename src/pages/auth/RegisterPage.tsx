import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { storage } from '@/lib/storage'
import type { User } from '@/types'
import { SUBJECTS, GRADES } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    school: z.string().min(3, 'School name is required'),
    subject: z.string().min(1, 'Please select a subject'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))

    const accounts = storage.get<User[]>('accounts') ?? []
    if (accounts.some((a) => a.email === data.email)) {
      toast.error('An account with this email already exists.')
      setLoading(false)
      return
    }

    const user: User = {
      id: uuid(),
      name: data.name,
      email: data.email,
      school: data.school,
      subjects: [data.subject],
      grades: [...GRADES],
      role: 'teacher',
      createdAt: new Date().toISOString(),
    }

    accounts.push(user)
    storage.set('accounts', accounts)

    const passwords = storage.get<Record<string, string>>('passwords') ?? {}
    passwords[data.email] = data.password
    storage.set('passwords', passwords)

    dispatch(login(user))
    toast.success('Account created! Welcome to EduDesk.')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EduDesk</h1>
            <p className="text-sm text-gray-500">Educator Dashboard</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-6">Join thousands of CBSE educators</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Priya Sharma"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@school.edu"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="School / Institution"
              placeholder="Delhi Public School, Noida"
              error={errors.school?.message}
              {...register('school')}
            />

            {/* Subject select — plain register, no Controller */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Primary Subject</label>
              <select
                className={`input ${errors.subject ? 'border-red-400 focus:ring-red-500' : ''}`}
                {...register('subject')}
              >
                <option value="">Select subject…</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

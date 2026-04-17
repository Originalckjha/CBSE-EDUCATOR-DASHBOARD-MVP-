import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { storage } from '@/lib/storage'
import type { User } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
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
    await new Promise((r) => setTimeout(r, 600))

    const accounts = storage.get<User[]>('accounts') ?? []
    const found = accounts.find((a) => a.email === data.email)

    if (!found) {
      toast.error('No account found. Please register first.')
      setLoading(false)
      return
    }

    const storedPasswords = storage.get<Record<string, string>>('passwords') ?? {}
    if (storedPasswords[data.email] !== data.password) {
      toast.error('Incorrect password.')
      setLoading(false)
      return
    }

    dispatch(login(found))
    toast.success(`Welcome back, ${found.name.split(' ')[0]}!`)
    navigate('/dashboard')
    setLoading(false)
  }

  function fillDemo() {
    const accounts = storage.get<User[]>('accounts') ?? []
    if (accounts.length > 0) return
    const demoUser: User = {
      id: 'demo-1',
      name: 'Priya Sharma',
      email: 'demo@edudesk.in',
      school: 'Delhi Public School',
      subjects: ['Mathematics', 'Science'],
      grades: [9, 10, 11],
      role: 'teacher',
      createdAt: new Date().toISOString(),
    }
    storage.set('accounts', [demoUser])
    storage.set('passwords', { 'demo@edudesk.in': 'demo123' })
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
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your educator account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@school.edu"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-500' : ''}`}
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
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 font-medium mb-1">Demo Account</p>
            <p className="text-xs text-blue-600">Email: demo@edudesk.in</p>
            <p className="text-xs text-blue-600">Password: demo123</p>
            <button
              onClick={() => {
                fillDemo()
                toast.success('Demo account ready!')
              }}
              className="mt-2 text-xs text-primary-600 font-medium hover:underline"
            >
              Set up demo account →
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

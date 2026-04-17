import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BookOpen, Eye, EyeOff, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/slices/authSlice'
import { storage } from '@/lib/storage'
import type { User } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const DEMO_USER: User = {
  id: 'demo-1',
  name: 'Priya Sharma',
  email: 'demo@edudesk.in',
  school: 'Delhi Public School',
  subjects: ['Mathematics', 'Science'],
  grades: [9, 10, 11],
  role: 'teacher',
  createdAt: new Date().toISOString(),
}

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
  const [demoLoading, setDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))

    const accounts = storage.get<User[]>('accounts') ?? []
    const found = accounts.find((a) => a.email === data.email)

    if (!found) {
      toast.error('No account found with this email.')
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
  }

  async function enterDemo() {
    setDemoLoading(true)
    await new Promise((r) => setTimeout(r, 400))

    // Always ensure demo account exists (overwrite any stale state)
    const accounts = storage.get<User[]>('accounts') ?? []
    const withoutDemo = accounts.filter((a) => a.id !== 'demo-1')
    storage.set('accounts', [...withoutDemo, DEMO_USER])
    const passwords = storage.get<Record<string, string>>('passwords') ?? {}
    passwords['demo@edudesk.in'] = 'demo123'
    storage.set('passwords', passwords)

    dispatch(login(DEMO_USER))
    toast.success('Welcome to EduDesk demo!')
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

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-3">or</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            icon={<Zap className="w-4 h-4 text-amber-500" />}
            onClick={enterDemo}
            loading={demoLoading}
          >
            Enter Demo Account
          </Button>

          <p className="text-center text-xs text-gray-400 mt-3">
            No sign-up needed · Pre-loaded with sample data
          </p>

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

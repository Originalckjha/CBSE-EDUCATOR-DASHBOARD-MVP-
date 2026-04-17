import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppSelector } from './store/hooks'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotesPage from './pages/notes/NotesPage'
import NoteEditorPage from './pages/notes/NoteEditorPage'
import ClassesPage from './pages/classes/ClassesPage'
import ClassDetailPage from './pages/classes/ClassDetailPage'
import ResourcesPage from './pages/resources/ResourcesPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user)
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user)
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 3000,
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/new" element={<NoteEditorPage />} />
          <Route path="notes/:id/edit" element={<NoteEditorPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:id" element={<ClassDetailPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

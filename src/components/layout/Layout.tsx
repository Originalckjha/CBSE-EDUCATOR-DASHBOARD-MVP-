import { Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/notes': 'Notes',
  '/notes/new': 'New Note',
  '/classes': 'Classes',
  '/resources': 'Resources',
  '/settings': 'Settings',
}

function getTitle(pathname: string): string {
  if (pathname.startsWith('/notes/') && pathname.endsWith('/edit')) return 'Edit Note'
  if (pathname.startsWith('/classes/')) return 'Class Detail'
  return PAGE_TITLES[pathname] ?? 'EduDesk'
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

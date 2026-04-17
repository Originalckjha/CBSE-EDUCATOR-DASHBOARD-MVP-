export interface User {
  id: string
  name: string
  email: string
  school: string
  subjects: string[]
  grades: number[]
  avatar?: string
  role: 'teacher' | 'admin'
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  subject: string
  grade: string
  chapter: string
  tags: string[]
  isPinned: boolean
  color: NoteColor
  createdAt: string
  updatedAt: string
}

export type NoteColor = 'white' | 'yellow' | 'blue' | 'green' | 'pink' | 'purple'

export interface ClassSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  startTime: string
  endTime: string
  room: string
}

export interface ClassItem {
  id: string
  name: string
  subject: string
  grade: number
  section: string
  studentCount: number
  schedule: ClassSchedule[]
  description: string
  academicYear: string
  color: string
  createdAt: string
}

export type ResourceType = 'pdf' | 'video' | 'link' | 'image' | 'document' | 'presentation'

export interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  url: string
  subject: string
  grade: number[]
  chapter: string
  tags: string[]
  isBookmarked: boolean
  fileSize?: string
  uploadedAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalNotes: number
  totalClasses: number
  totalResources: number
  bookmarkedResources: number
  upcomingClasses: UpcomingClass[]
  recentActivity: ActivityItem[]
}

export interface UpcomingClass {
  id: string
  className: string
  subject: string
  time: string
  room: string
  dayLabel: string
}

export interface ActivityItem {
  id: string
  type: 'note_created' | 'note_updated' | 'resource_added' | 'class_created' | 'resource_bookmarked'
  title: string
  timestamp: string
}

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Social Science',
  'History',
  'Geography',
  'Civics',
  'English',
  'Hindi',
  'Sanskrit',
  'Computer Science',
  'Physical Education',
  'Art & Craft',
] as const

export const GRADES = [6, 7, 8, 9, 10, 11, 12] as const

export type Subject = (typeof SUBJECTS)[number]
export type Grade = (typeof GRADES)[number]

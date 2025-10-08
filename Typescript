import React, { useState, useEffect } from ‘react’;
import { BookOpen, Video, FlaskConical, FileText, BarChart3, Users, Search, Bell, Menu, X, Home, Calendar, Settings, LogOut, ChevronDown, Filter, Star, Clock, TrendingUp } from ‘lucide-react’;

// Mock Data
const mockUser = {
name: “Priya Sharma”,
email: “priya.sharma@school.edu”,
subjects: [“Mathematics”, “Science”],
classes: [8, 9, 10],
schoolAffiliation: “Delhi Public School”
};

const mockResources = [
{ id: 1, title: “Quadratic Equations - Concept Notes”, class: 10, subject: “Mathematics”, type: “notes”, chapter: 4, bookmarked: true },
{ id: 2, title: “Photosynthesis Animation”, class: 10, subject: “Biology”, type: “video”, chapter: 6, bookmarked: false },
{ id: 3, title: “Chemical Reactions Lab Experiment”, class: 9, subject: “Chemistry”, type: “practical”, chapter: 1, bookmarked: true },
{ id: 4, title: “Cell Division - Mitosis & Meiosis”, class: 9, subject: “Biology”, type: “video”, chapter: 5, bookmarked: false },
{ id: 5, title: “Triangles - Practice Questions”, class: 9, subject: “Mathematics”, type: “assessment”, chapter: 7, bookmarked: false },
{ id: 6, title: “Acids, Bases and Salts - Quick Revision”, class: 10, subject: “Chemistry”, type: “notes”, chapter: 2, bookmarked: true }
];

const recentActivities = [
{ action: “Viewed”, resource: “Quadratic Equations Notes”, time: “2 hours ago” },
{ action: “Downloaded”, resource: “Lab Manual - Acids & Bases”, time: “5 hours ago” },
{ action: “Bookmarked”, resource: “Cell Division Animation”, time: “1 day ago” }
];

const upcomingLessons = [
{ class: 10, subject: “Mathematics”, topic: “Arithmetic Progressions”, date: “Tomorrow, 10:00 AM” },
{ class: 9, subject: “Science”, topic: “Laws of Motion”, date: “Tomorrow, 2:00 PM” },
{ class: 10, subject: “Biology”, topic: “Life Processes”, date: “Friday, 11:00 AM” }
];

function App() {
const [sidebarOpen, setSidebarOpen] = useState(true);
const [activeTab, setActiveTab] = useState(‘dashboard’);
const [selectedClass, setSelectedClass] = useState(‘all’);
const [selectedSubject, setSelectedSubject] = useState(‘all’);
const [searchQuery, setSearchQuery] = useState(’’);
const [showFilters, setShowFilters] = useState(false);

const filteredResources = mockResources.filter(resource => {
const matchesClass = selectedClass === ‘all’ || resource.class === parseInt(selectedClass);
const matchesSubject = selectedSubject === ‘all’ || resource.subject === selectedSubject;
const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
return matchesClass && matchesSubject && matchesSearch;
});

const getResourceIcon = (type) => {
switch(type) {
case ‘video’: return <Video className="w-5 h-5 text-red-500" />;
case ‘notes’: return <FileText className="w-5 h-5 text-blue-500" />;
case ‘practical’: return <FlaskConical className="w-5 h-5 text-green-500" />;
case ‘assessment’: return <BarChart3 className="w-5 h-5 text-purple-500" />;
default: return <BookOpen className="w-5 h-5 text-gray-500" />;
}
};

const getResourceBadgeColor = (type) => {
switch(type) {
case ‘video’: return ‘bg-red-100 text-red-700’;
case ‘notes’: return ‘bg-blue-100 text-blue-700’;
case ‘practical’: return ‘bg-green-100 text-green-700’;
case ‘assessment’: return ‘bg-purple-100 text-purple-700’;
default: return ‘bg-gray-100 text-gray-700’;
}
};

return (
<div className="flex h-screen bg-gray-50">
{/* Sidebar */}
<aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-900 text-white transition-all duration-300 flex flex-col`}>
<div className="p-4 flex items-center justify-between border-b border-indigo-800">
{sidebarOpen && <h1 className="text-xl font-bold">CBSE Educator</h1>}
<button onClick={() => setSidebarOpen(!sidebarOpen)} className=“p-2 hover:bg-indigo-800 rounded”>
{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
</button>
</div>

```
    <nav className="flex-1 p-4 space-y-2">
      {[
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'resources', icon: BookOpen, label: 'Resources' },
        { id: 'practicals', icon: FlaskConical, label: 'Practicals' },
        { id: 'biology', icon: Video, label: 'Bio Animations' },
        { id: 'assessment', icon: BarChart3, label: 'Assessments' },
        { id: 'calendar', icon: Calendar, label: 'Lesson Plans' },
        { id: 'community', icon: Users, label: 'Community' }
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
            activeTab === item.id ? 'bg-indigo-700' : 'hover:bg-indigo-800'
          }`}
        >
          <item.icon size={20} />
          {sidebarOpen && <span>{item.label}</span>}
        </button>
      ))}
    </nav>

    <div className="p-4 border-t border-indigo-800 space-y-2">
      <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-800">
        <Settings size={20} />
        {sidebarOpen && <span>Settings</span>}
      </button>
      <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-800">
        <LogOut size={20} />
        {sidebarOpen && <span>Logout</span>}
      </button>
    </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col overflow-hidden">
    {/* Header */}
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search resources, lessons, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter size={20} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium">{mockUser.name}</p>
            <p className="text-xs text-gray-500">{mockUser.schoolAffiliation}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {mockUser.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>

    {/* Filters Bar */}
    {showFilters && (
      <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Classes</option>
            {[6, 7, 8, 9, 10, 11, 12].map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Subject:</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Physics">Physics</option>
          </select>
        </div>
      </div>
    )}

    {/* Content Area */}
    <div className="flex-1 overflow-auto p-6">
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {mockUser.name.split(' ')[0]}!</h2>
            <p className="text-gray-600">Here's what's happening with your teaching today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Resources', value: '247', icon: BookOpen, color: 'bg-blue-500' },
              { label: 'Bookmarked', value: '32', icon: Star, color: 'bg-yellow-500' },
              { label: 'Recent Views', value: '156', icon: TrendingUp, color: 'bg-green-500' },
              { label: 'Upcoming Lessons', value: '8', icon: Clock, color: 'bg-purple-500' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Lessons */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 text-indigo-600" size={20} />
                Upcoming Lessons
              </h3>
              <div className="space-y-3">
                {upcomingLessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                      {lesson.class}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{lesson.topic}</p>
                      <p className="text-sm text-gray-600">{lesson.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{lesson.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="mr-2 text-indigo-600" size={20} />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-500 pl-3">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.resource}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Quick Access */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Access Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.slice(0, 6).map(resource => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    {getResourceIcon(resource.type)}
                    {resource.bookmarked && <Star className="text-yellow-500 fill-yellow-500" size={16} />}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{resource.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${getResourceBadgeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    <span className="text-xs text-gray-500">Class {resource.class}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Resource Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  {getResourceIcon(resource.type)}
                  <button className="hover:scale-110 transition">
                    <Star className={`${resource.bookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} size={20} />
                  </button>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{resource.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded ${getResourceBadgeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  <div className="text-gray-600">
                    <span>Class {resource.class}</span>
                    <span className="mx-1">•</span>
                    <span>Ch {resource.chapter}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{resource.subject}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab !== 'dashboard' && activeTab !== 'resources' && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">Coming Soon</p>
            <p className="text-gray-400">This feature is under development</p>
          </div>
        </div>
      )}
    </div>
  </main>
</div>
```

);
}

export default App;

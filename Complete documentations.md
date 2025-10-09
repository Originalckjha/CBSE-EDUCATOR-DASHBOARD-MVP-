# 🎓 CBSE Educator Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

> A comprehensive digital platform empowering CBSE educators (Classes 6-12) with integrated teaching resources, psychological learning principles, and collaborative tools.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Educational Psychology Integration](#educational-psychology-integration)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

-----

## 🌟 Overview

The CBSE Educator Platform is designed to revolutionize teaching experiences for Indian educators by providing:

- **Centralized Resource Hub**: Digital textbooks, study notes, video lectures, and external references
- **Practical Activity Database**: Science experiments, mathematics activities, and project-based learning
- **Biological Process Animations**: High-quality 3D animations for cellular processes, human body systems, and ecology
- **Assessment Tools**: Question banks, mock tests, previous year papers with CBSE pattern alignment
- **Professional Development**: Collaboration forums, teaching strategies, and continuous learning resources
- **Psychology-Driven Learning**: Implementation of readiness, motivation, multi-sensory, and active learning principles

### 🎯 Target Audience

- CBSE School Teachers (Classes 6-12)
- Subject Matter: Mathematics, Science (Physics, Chemistry, Biology), Social Science
- Teaching Experience: Beginner to Advanced

-----

## ✨ Key Features

### 1. **Authentication & User Management**

- ✅ Email/Password & Mobile OTP login
- ✅ Social authentication (Google, Microsoft)
- ✅ JWT-based secure sessions
- ✅ Two-factor authentication (Optional)
- ✅ Role-based access control

### 2. **Resource Management System**

- 📚 **Digital Textbooks**: NCERT-aligned, chapter-wise organized
- 📝 **Study Notes**: Concept notes, revision guides, quick references
- 🔗 **External Links**: Curated references from verified sources
- 🎥 **Video Resources**: YouTube, DIKSHA, internal platforms
- 🔖 **Bookmarking & Favorites**: Personalized resource collections
- 🔍 **Advanced Search**: Multi-filter search with auto-complete

### 3. **Practical Activity Module**

- 🧪 **Science Experiments**: Step-by-step procedures with safety protocols
- 📐 **Mathematics Activities**: Hands-on learning with real-world applications
- 🎯 **Project-Based Learning**: Long-term collaborative projects
- 📹 **Demonstration Videos**: Visual guidance for experiments
- 📄 **Lab Manuals**: Downloadable PDF resources
- ✅ **Assessment Rubrics**: Standardized evaluation criteria

### 4. **Biological Process Animations**

- 🔬 **Cellular Processes**: Mitosis, meiosis, cell division
- 🫀 **Human Body Systems**: Digestive, respiratory, circulatory systems
- 🌱 **Plant Biology**: Photosynthesis, transpiration, pollination
- 🌍 **Ecology & Environment**: Food chains, ecosystems, carbon cycle
- 🧬 **Genetics & Evolution**: DNA replication, inheritance patterns
- 🎮 **Interactive Simulations**: 3D models with user interaction

### 5. **Assessment & Evaluation Tools**

- 📊 **Question Bank Generator**: MCQs, short/long answers, case studies
- 📝 **Mock Test Creation**: Customizable marking schemes and time limits
- 📜 **Previous Year Papers**: 10+ years of board papers with solutions
- 📈 **Performance Analytics**: Class averages, topic-wise analysis
- 🎯 **Bloom’s Taxonomy Alignment**: Question difficulty classification
- ✍️ **Competency-Based Questions**: NEP 2020 aligned assessments

### 6. **Professional Development**

- 👥 **Collaboration Hub**: Discussion forums and peer reviews
- 📚 **Teaching Strategies**: CBSE-recommended pedagogical methods
- 🎓 **Continuous Learning**: Webinar recordings, workshop materials
- 📢 **Curriculum Updates**: Real-time notifications on CBSE changes
- 💡 **Best Practices**: Repository of successful teaching methods
- 📋 **NEP 2020 Guidelines**: Policy implementation resources

### 7. **Lesson Planning Tools**

- 📅 **Weekly Scheduler**: Drag-and-drop lesson planning
- 🗺️ **Curriculum Mapper**: Alignment with learning outcomes
- ⏱️ **Time Estimation**: Automatic duration calculation
- 📎 **Resource Attachment**: Link resources directly to lessons
- 🔄 **Recurring Templates**: Reusable lesson plan structures

-----

## 🛠️ Technology Stack

### Frontend

```
React 18.2.0          - UI Library
TypeScript 5.0        - Type Safety
Tailwind CSS 3.3      - Styling Framework
Lucide React          - Icon Library
React Router 6.x      - Navigation
Redux Toolkit         - State Management
Axios                 - HTTP Client
React Query           - Data Fetching & Caching
```

### Backend

```
Node.js 18+           - Runtime Environment
Express 4.x           - Web Framework
TypeScript 5.0        - Type Safety
PostgreSQL 15         - Primary Database
Redis 7.x             - Caching Layer
JWT                   - Authentication
Bcrypt                - Password Hashing
Joi                   - Input Validation
```

### DevOps & Infrastructure

```
Docker                - Containerization
GitHub Actions        - CI/CD Pipeline
AWS S3                - File Storage
AWS EC2/ECS           - Hosting
Nginx                 - Reverse Proxy
PM2                   - Process Manager
New Relic             - Monitoring
```

### Development Tools

```
ESLint                - Code Linting
Prettier              - Code Formatting
Jest                  - Unit Testing
Cypress               - E2E Testing
Husky                 - Git Hooks
```

-----

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0 or yarn >= 1.22.0
PostgreSQL >= 15.0
Redis >= 7.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/cbse-educator-platform.git
cd cbse-educator-platform
```

1. **Install dependencies**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

1. **Environment Configuration**

Create `.env` files in both frontend and backend directories:

**Frontend `.env`:**

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

**Backend `.env`:**

```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cbse_educator
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=cbse-educator-resources
AWS_REGION=ap-south-1

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# SMS Service (for OTP)
SMS_API_KEY=your_sms_service_api_key
SMS_SENDER_ID=CBSEDU

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_oauth_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_oauth_secret

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

1. **Database Setup**

```bash
# Create database
createdb cbse_educator

# Run migrations
cd backend
npm run migrate

# Seed initial data
npm run seed
```

1. **Start Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

1. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

### Default Test Credentials

```
Email: demo.teacher@cbse.edu.in
Password: Demo@123456
```

-----

## 📁 Project Structure

```
cbse-educator-platform/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── assets/           # Images, fonts, icons
│   │   ├── components/       # Reusable UI components
│   │   │   ├── common/       # Buttons, Inputs, Cards
│   │   │   ├── layout/       # Header, Sidebar, Footer
│   │   │   └── features/     # Feature-specific components
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard/
│   │   │   ├── Resources/
│   │   │   ├── Practicals/
│   │   │   ├── Assessment/
│   │   │   └── Auth/
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── store/            # Redux store configuration
│   │   │   ├── slices/       # Redux slices
│   │   │   └── index.ts
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Global styles
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── aws.ts
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── resource.controller.ts
│   │   │   └── assessment.controller.ts
│   │   ├── models/           # Database models
│   │   │   ├── User.model.ts
│   │   │   ├── Resource.model.ts
│   │   │   ├── Practical.model.ts
│   │   │   └── Assessment.model.ts
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── resource.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── rateLimit.middleware.ts
│   │   ├── services/         # Business logic layer
│   │   │   ├── auth.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── sms.service.ts
│   │   │   └── storage.service.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── jwt.utils.ts
│   │   │   ├── password.utils.ts
│   │   │   └── validation.utils.ts
│   │   ├── types/            # TypeScript interfaces
│   │   ├── migrations/       # Database migrations
│   │   ├── seeds/            # Database seeders
│   │   ├── tests/            # Test files
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # Additional documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── docker-compose.yml
├── Dockerfile
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── LICENSE
└── README.md
```

-----

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │  Mobile App  │  │  Desktop App │      │
│  │   (React)    │  │ (React Native)│  │   (Electron) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Load Balancer   │
                    │      (Nginx)      │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────┴─────────────────────────────┐
│                    Application Layer                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Express.js API Server (Node.js)              │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │ │
│  │  │   Auth     │  │ Resources  │  │ Assessment │    │ │
│  │  │  Service   │  │  Service   │  │  Service   │    │ │
│  │  └────────────┘  └────────────┘  └────────────┘    │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────┬──────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   PostgreSQL   │  │     Redis       │  │    AWS S3      │
│   (Database)   │  │    (Cache)      │  │ (File Storage) │
└────────────────┘  └─────────────────┘  └────────────────┘
```

### Database Schema (Simplified)

```sql
-- Users Table
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  mobile VARCHAR UNIQUE,
  password_hash VARCHAR,
  name VARCHAR,
  school_affiliation VARCHAR,
  experience_years INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- User Teaching Details
user_teaching_details (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  classes INTEGER[],
  subjects VARCHAR[],
  preferred_language VARCHAR
)

-- Resources Table
resources (
  id UUID PRIMARY KEY,
  title VARCHAR,
  description TEXT,
  class INTEGER,
  subject VARCHAR,
  chapter INTEGER,
  resource_type VARCHAR,
  file_url VARCHAR,
  thumbnail_url VARCHAR,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
)

-- Bookmarks Table
bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  resource_id UUID REFERENCES resources(id),
  created_at TIMESTAMP
)

-- Practical Activities Table
practical_activities (
  id UUID PRIMARY KEY,
  experiment_name VARCHAR,
  class INTEGER,
  subject VARCHAR,
  difficulty VARCHAR,
  materials TEXT[],
  procedure TEXT[],
  video_url VARCHAR,
  created_at TIMESTAMP
)
```

-----

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@school.edu",
  "mobile": "+919876543210",
  "password": "SecurePass@123",
  "schoolAffiliation": "Delhi Public School",
  "subjects": ["Mathematics", "Science"],
  "classes": [9, 10],
  "experienceYears": 5
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@school.edu",
  "password": "SecurePass@123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

### Resource Endpoints

#### Get Resources

```http
GET /api/resources?class=10&subject=Mathematics&page=1&limit=20
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "data": {
    "resources": [...],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

#### Create Resource

```http
POST /api/resources
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Quadratic Equations Notes",
  "class": 10,
  "subject": "Mathematics",
  "chapter": 4,
  "resourceType": "notes",
  "file": <file_upload>
}

Response: 201 Created
```

### Assessment Endpoints

#### Generate Question Bank

```http
POST /api/assessments/generate-questions
Authorization: Bearer {token}

{
  "class": 10,
  "subject": "Mathematics",
  "chapters": [1, 2, 3],
  "questionTypes": ["MCQ", "Short Answer"],
  "difficulty": "Medium",
  "count": 20
}
```

For complete API documentation, visit: http://localhost:5000/api-docs

-----

## 🧠 Educational Psychology Integration

### 1. Principle of Readiness

- **Adaptive Content**: Progressive difficulty based on user skill level
- **Prerequisite Checking**: Ensures foundational knowledge before advanced topics
- **Skill Assessment**: Regular evaluation to match content with capability

### 2. Principle of Motivation

- **Achievement System**: Badges for milestones (100 resources viewed, 50 lessons planned)
- **Progress Visualization**: Charts showing teaching journey
- **Goal Setting**: Personal targets for resource creation and usage
- **Positive Reinforcement**: Encouraging feedback and recognition

### 3. Multi-Sensory Learning

- **Text**: Comprehensive written notes and documentation
- **Audio**: Podcast-style explanations and lecture recordings
- **Video**: Demonstrations, experiments, and concept explanations
- **Interactive**: Simulations, quizzes, and hands-on activities
- **Kinesthetic**: Lab experiments and practical activities

### 4. Active Learning

- **Discussion Forums**: Peer-to-peer knowledge sharing
- **Practice Exercises**: Hands-on problem solving
- **Collaborative Projects**: Group teaching initiatives
- **Real-time Quizzes**: Immediate feedback loops

### 5. Cognitive Load Management

- **Chunked Information**: Breaking complex topics into digestible parts
- **Visual Hierarchy**: Clear content organization
- **Minimalist Design**: Focus on essential information
- **Scaffolded Learning**: Building incrementally on existing knowledge

-----

## 🔒 Security

### Authentication & Authorization

- ✅ JWT-based stateless authentication
- ✅ Bcrypt password hashing (12 salt rounds)
- ✅ Optional two-factor authentication (2FA)
- ✅ Role-based access control (RBAC)
- ✅ Session timeout after 30 minutes inactivity

### Data Protection

- ✅ HTTPS encryption in transit
- ✅ Database encryption at rest
- ✅ Secure file storage (AWS S3 with encryption)
- ✅ Regular automated backups
- ✅ GDPR compliance measures

### Security Best Practices

- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (Content Security Policy)
- ✅ CSRF token implementation
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Security headers (Helmet.js)
- ✅ Dependency vulnerability scanning

### Audit & Compliance

- ✅ Comprehensive audit logging
- ✅ User action tracking
- ✅ Security incident monitoring
- ✅ Regular security audits

-----

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting PRs.

### Development Workflow

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
1. Commit changes (`git commit -m 'Add some AmazingFeature'`)
1. Push to branch (`git push origin feature/AmazingFeature`)
1. Open a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

-----

## 📄 License

This project is licensed under the MIT License - see the <LICENSE> file for details.

-----

## 💬 Support

### Documentation

- [API Documentation](docs/API.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/cbse-educator-platform/issues)
- **Discussions**: [Join community discussions](https://github.com/your-org/cbse-educator-platform/discussions)
- **Email**: support@cbseeducator.in

### Professional Support

For enterprise support and custom implementations, contact: enterprise@cbseeducator.in

-----

## 🗓️ Development Roadmap

### Phase 1: MVP (Months 1-3) ✅

- ✅ Authentication system
- ✅ Basic dashboard
- ✅ Resource library
- ✅ User profile management

### Phase 2: Core Features (Months 4-7) 🚧

- 🚧 Practical activity database
- 🚧 Biology animations library
- 🚧 Assessment tools
- 🚧 Lesson planning module

### Phase 3: Advanced Features (Months 8-10) 📋

- 📋 AI-powered recommendations
- 📋 Analytics dashboard
- 📋 Collaboration tools
- 📋 Mobile applications

### Phase 4: Optimization (Months 11-12) 📋

- 📋 Performance optimization
- 📋 Offline support
- 📋 Advanced caching
- 📋 Scale testing

-----

## 👏 Acknowledgments

- CBSE for curriculum guidelines
- NCERT for educational content standards
- DIKSHA platform for integration inspiration
- Open-source community for amazing tools

-----

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/tests-98%25-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-yellowgreen.svg)
![Deployment](https://img.shields.io/badge/deployment-active-blue.svg)

-----

**Made with ❤️ for Indian Educators**

For queries, reach out to: contact@cbseeducator.in

© 2025 CBSE Educator Platform. All rights reserved.

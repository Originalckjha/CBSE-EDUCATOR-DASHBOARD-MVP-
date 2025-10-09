# Contributing to CBSE Educator Platform

First off, thank you for considering contributing to CBSE Educator Platform! It’s people like you that make this platform a great tool for educators across India.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

-----

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance, race
- Religion, or sexual identity and orientation

### Our Standards

**Positive Behaviors:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what’s best for the community
- Showing empathy towards other community members

**Unacceptable Behaviors:**

- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others’ private information
- Other conduct inappropriate in a professional setting

-----

## 🤝 How Can I Contribute?

### 1. Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**Bug Report Template:**

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., Windows 10, macOS 13.0]
- Browser: [e.g., Chrome 118, Firefox 119]
- App Version: [e.g., 1.2.3]

## Additional Context
Any other relevant information.
```

### 2. Suggesting Features

Feature requests are welcome! Please provide:

**Feature Request Template:**

```markdown
## Problem Statement
What problem does this feature solve?

## Proposed Solution
Describe your ideal solution.

## Alternative Solutions
Other approaches you've considered.

## Use Cases
Real-world scenarios where this would help.

## Educational Impact
How this benefits CBSE educators and students.
```

### 3. Contributing Code

**Areas for Contribution:**

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌐 Translations (Hindi, regional languages)

-----

## 💻 Development Setup

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 15.0
Redis >= 7.0
Git
```

### Fork and Clone

1. **Fork the repository** on GitHub
1. **Clone your fork:**

```bash
git clone https://github.com/YOUR-USERNAME/cbse-educator-platform.git
cd cbse-educator-platform
```

1. **Add upstream remote:**

```bash
git remote add upstream https://github.com/original-org/cbse-educator-platform.git
```

### Installation

```bash
# Install dependencies for both frontend and backend
npm run install:all

# or manually
cd frontend && npm install
cd ../backend && npm install
```

### Environment Setup

Copy example environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Update `.env` files with your local configuration.

### Database Setup

```bash
cd backend
npm run db:create
npm run migrate
npm run seed
```

### Running Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately
npm run dev:frontend
npm run dev:backend
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend

# Run E2E tests
npm run test:e2e
```

-----

## 📝 Coding Standards

### TypeScript Guidelines

**File Naming:**

```
PascalCase: Components, Classes (UserProfile.tsx, AuthService.ts)
camelCase: Functions, variables (getUserData.ts, userUtils.ts)
kebab-case: CSS files (user-profile.css)
UPPER_SNAKE_CASE: Constants (API_BASE_URL, MAX_FILE_SIZE)
```

**Type Safety:**

```typescript
// ✅ Good - Explicit types
interface UserProfile {
  name: string;
  email: string;
  classes: number[];
}

function getUserProfile(userId: string): Promise<UserProfile> {
  // implementation
}

// ❌ Bad - Any types
function getUserProfile(userId: any): any {
  // implementation
}
```

**Component Structure:**

```typescript
// ✅ Good - Well-structured component
import React, { useState, useEffect } from 'react';
import { UserService } from '@/services';
import { UserProfile } from '@/types';

interface Props {
  userId: string;
  onUpdate?: (user: UserProfile) => void;
}

export const UserProfileCard: React.FC<Props> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await UserService.getProfile(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to load user', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  return (
    <div className="user-profile-card">
      {/* Component JSX */}
    </div>
  );
};
```

### React Best Practices

**Hooks Usage:**

```typescript
// ✅ Good - Custom hooks for reusable logic
function useUserProfile(userId: string) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // fetch logic
  }, [userId]);

  return { user, loading, error };
}

// Usage
const { user, loading, error } = useUserProfile('123');
```

**State Management:**

```typescript
// ✅ Good - Proper Redux Toolkit slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ResourceState {
  items: Resource[];
  loading: boolean;
  error: string | null;
}

const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    items: [],
    loading: false,
    error: null
  } as ResourceState,
  reducers: {
    setResources(state, action: PayloadAction<Resource[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  }
});
```

### Backend Best Practices

**Controller Structure:**

```typescript
// ✅ Good - Clean controller with error handling
import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '@/services';
import { asyncHandler } from '@/utils';
import { ApiResponse } from '@/types';

export class ResourceController {
  /**
   * Get all resources with filtering
   * @route GET /api/resources
   * @access Private
   */
  getResources = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { class: classNum, subject, page = 1, limit = 20 } = req.query;
      
      const result = await ResourceService.getResources({
        class: Number(classNum),
        subject: String(subject),
        page: Number(page),
        limit: Number(limit)
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Resources fetched successfully'
      };

      res.status(200).json(response);
    }
  );
}
```

**Service Layer:**

```typescript
// ✅ Good - Separated business logic
export class ResourceService {
  static async getResources(filters: ResourceFilters): Promise<ResourceResult> {
    // Build query
    const query = ResourceModel.find();
    
    if (filters.class) query.where('class').equals(filters.class);
    if (filters.subject) query.where('subject').equals(filters.subject);
    
    // Pagination
    const total = await ResourceModel.countDocuments(query);
    const resources = await query
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .exec();

    return {
      resources,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }
}
```

### CSS/Styling Guidelines

**Tailwind CSS Best Practices:**

```typescript
// ✅ Good - Organized, readable classes
<div className="
  flex items-center justify-between
  p-4 
  bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow
  border border-gray-200
">
  {/* content */}
</div>

// ✅ Good - Reusable component styles
const buttonStyles = {
  base: "px-4 py-2 rounded-lg font-medium transition-colors",
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
};

<button className={`${buttonStyles.base} ${buttonStyles.primary}`}>
  Click me
</button>
```

### Testing Standards

**Unit Tests:**

```typescript
// ✅ Good - Comprehensive test coverage
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResourceCard } from './ResourceCard';

describe('ResourceCard', () => {
  const mockResource = {
    id: '1',
    title: 'Test Resource',
    class: 10,
    subject: 'Mathematics'
  };

  it('renders resource information correctly', () => {
    render(<ResourceCard resource={mockResource} />);
    
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByText('Class 10')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
  });

  it('calls onBookmark when bookmark button clicked', async () => {
    const onBookmark = jest.fn();
    render(<ResourceCard resource={mockResource} onBookmark={onBookmark} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    fireEvent.click(bookmarkButton);
    
    await waitFor(() => {
      expect(onBookmark).toHaveBeenCalledWith(mockResource.id);
    });
  });
});
```

**Integration Tests:**

```typescript
// ✅ Good - API endpoint testing
import request from 'supertest';
import app from '@/app';
import { generateAuthToken } from '@/utils';

describe('Resource API', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await generateAuthToken({ userId: 'test-user' });
  });

  describe('GET /api/resources', () => {
    it('returns resources with valid authentication', async () => {
      const response = await request(app)
        .get('/api/resources')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ class: 10, subject: 'Mathematics' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.resources)).toBe(true);
    });

    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/resources');

      expect(response.status).toBe(401);
    });
  });
});
```

-----

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **ci**: CI/CD configuration changes

### Examples

```bash
# Feature
git commit -m "feat(resources): add video resource filtering"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(api): update authentication endpoints"

# With body and footer
git commit -m "feat(assessment): add question bank generator

- Implement MCQ generation
- Add Bloom's taxonomy classification
- Support multiple difficulty levels

Closes #123"
```

### Commit Best Practices

✅ **Do:**

- Write clear, concise commit messages
- Use present tense (“add feature” not “added feature”)
- Keep subject line under 50 characters
- Capitalize subject line
- Reference issues and pull requests

❌ **Don’t:**

- Commit commented-out code
- Commit console.log statements
- Make unrelated changes in single commit
- Use vague messages like “fix stuff” or “update”

-----

## 🔄 Pull Request Process

### Before Submitting

**Checklist:**

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Manual testing completed
- [ ] Branch is up-to-date with main

### PR Title Format

Follow conventional commits format:

```
feat(scope): add new feature
fix(scope): resolve bug in component
docs: update README with new instructions
```

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Before: [screenshot]
After: [screenshot]

## Testing
Describe the tests you ran and how to reproduce.

### Test Configuration:
- Node version:
- OS:
- Browser:

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## Additional Notes
Any additional information or context.
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
1. **Code Review**: At least 2 approvals required from maintainers
1. **Testing**: All tests must pass
1. **Documentation**: Ensure docs are updated
1. **Merge**: Squash and merge into main branch

### After Merge

- Delete your feature branch
- Update your local repository
- Close related issues

-----

## 🐛 Issue Reporting

### Before Opening an Issue

1. **Search existing issues** to avoid duplicates
1. **Check documentation** for common problems
1. **Update to latest version** to see if issue persists

### Issue Labels

- `bug`: Something isn’t working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `question`: Further information requested
- `wontfix`: This will not be worked on
- `duplicate`: Duplicate of another issue
- `priority: high`: Urgent issue requiring immediate attention
- `priority: low`: Low priority issue

-----

## 👥 Community

### Communication Channels

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Email**: contribute@cbseeducator.in for private concerns

### Getting Help

- Review [documentation](docs/)
- Check [FAQ section](docs/FAQ.md)
- Search [closed issues](https://github.com/org/repo/issues?q=is%3Aissue+is%3Aclosed)
- Ask in [GitHub Discussions](https://github.com/org/repo/discussions)

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes for significant contributions
- Annual contributor showcase

-----

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Testing Library](https://testing-library.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

-----

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

-----

## 🙏 Thank You

Thank you for taking the time to contribute! Your efforts help make education better for thousands of teachers and millions of students across India.

**Questions?** Don’t hesitate to ask! We’re here to help.

-----

**Happy Contributing! 🚀**

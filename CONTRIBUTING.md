# 🤝 Contributing to SkillNexus LMS

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd The-SkillNexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and services
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Follow the component structure:
  ```tsx
  // Imports
  import { ... } from '...'
  
  // Types
  interface ComponentProps {
    // ...
  }
  
  // Component
  export function Component({ ... }: ComponentProps) {
    // Hooks
    // Event handlers
    // Render
  }
  ```

### Git Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

### Commit Messages
Follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Contributing Areas

### 🎯 High Priority
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Security enhancements

### 🔧 Medium Priority
- New learning features
- UI/UX improvements
- Integration with external services
- Documentation improvements

### 💡 Ideas Welcome
- Gamification features
- AI/ML enhancements
- Social learning features
- Analytics improvements

## Getting Help

- Check existing issues and discussions
- Read the documentation in `/docs`
- Join our community discussions
- Contact maintainers for major changes

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

Thank you for contributing to SkillNexus LMS! 🚀
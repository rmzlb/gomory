# Contributing to Gomory

First off, thank you for considering contributing to Gomory! It's people like you that make Gomory such a great tool.

## 🎯 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Provide specific examples to demonstrate the enhancement**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- Issues labeled `good first issue` - should only require a few lines of code
- Issues labeled `help wanted` - more involved than beginner issues

## 📋 Development Process

### 1. Fork and Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/gomory.git
cd gomory
npm install
```

### 2. Create a Branch

```bash
# Create a branch for your feature or fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

- Write your code following our style guide
- Add or update tests as needed
- Update documentation if you're changing functionality

### 4. Test Your Changes

```bash
# Run the test suite
npm test

# Run the linter
npm run lint

# Type check
npm run type-check

# Test the build
npm run build
```

### 5. Commit Your Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(optimizer): add multi-material support"
git commit -m "fix(export): correct PDF generation for large boards"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format with prettier"
git commit -m "refactor(types): simplify board layout interface"
git commit -m "test(optimizer): add edge case tests"
git commit -m "chore(deps): update dependencies"
```

Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc)
- **refactor**: Code refactoring
- **test**: Test additions or corrections
- **chore**: Maintenance tasks

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub using our PR template.

## 💻 Style Guide

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer functional components and hooks in React

```typescript
// Good
export function calculateUtilization(board: BoardLayout): number {
  const totalArea = board.width * board.height
  const usedArea = board.pieces.reduce((sum, piece) => sum + piece.width * piece.height, 0)
  return usedArea / totalArea
}

// Bad
export function calc(b: any) {
  let t = b.w * b.h
  let u = 0
  for (let p of b.p) u += p.w * p.h
  return u / t
}
```

### React Components

```tsx
// Good - Clear props, proper typing, documentation
interface ButtonProps {
  /** Button label */
  label: string
  /** Click handler */
  onClick: () => void
  /** Optional variant */
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`} type="button">
      {label}
    </button>
  )
}
```

### CSS/Tailwind

- Use Tailwind utilities when possible
- Create component classes for repeated patterns
- Keep responsive design in mind
- Follow mobile-first approach

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── lib/
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── constants/    # Constants and config
│   └── types/        # TypeScript types
├── app/              # Next.js app router pages
└── public/           # Static assets
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage of critical paths
- Use meaningful test descriptions

```typescript
describe('optimizeCutting', () => {
  it('should place all pieces when board is large enough', () => {
    // Test implementation
  })

  it('should handle rotation when enabled', () => {
    // Test implementation
  })
})
```

## 📝 Documentation

- Update the README if you change functionality
- Add JSDoc comments to exported functions
- Update type definitions as needed
- Include examples for complex features

## 🔄 Pull Request Process

1. **Complete the PR template** - Fill out all sections
2. **Ensure CI passes** - All tests, linting, and builds must succeed
3. **Request review** - From at least one maintainer
4. **Address feedback** - Make requested changes promptly
5. **Squash commits** - If requested by maintainer
6. **Merge** - Once approved, maintainer will merge

## 🎉 Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes
- Eligible for special contributor badge

## 📞 Getting Help

- **Discord**: Join our [Discord server](https://discord.gg/gomory)
- **Discussions**: Use [GitHub Discussions](https://github.com/rmzlb/gomory/discussions)
- **Email**: Contact maintainers for sensitive issues

## 🔑 Maintainer Notes

### Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. GitHub Actions will handle deployment

### Review Checklist

- [ ] Code follows style guide
- [ ] Tests pass and coverage adequate
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Breaking changes documented

---

Thank you for contributing to Gomory! 🎉

# Testing Strategy

## Overview
This project follows a pragmatic testing approach that balances code quality with development velocity.

## Current Coverage Status
- **Overall**: ~16% coverage
- **Critical Path** (optimizer.ts): ~90% coverage ✅
- **Hooks**: ~97% coverage ✅
- **UI Components**: 0% coverage (tested manually + via Vercel previews)

## Testing Philosophy

### 1. Progressive Coverage
- Start with realistic thresholds (current: 13-16%)
- Gradually increase as the codebase matures
- Target: 50% overall coverage by v2.0

### 2. Priority-Based Testing
**High Priority** (Must have tests):
- Business logic (optimizers, algorithms)
- Data transformations
- Utility functions
- Custom hooks

**Medium Priority** (Nice to have):
- Complex UI components
- API integrations
- State management

**Low Priority** (Can rely on manual/E2E):
- Simple UI components
- Static pages
- Style-only components

### 3. Test Types

#### Unit Tests (Current Focus)
```bash
npm test                 # Run all tests
npm test -- --coverage   # With coverage report
npm test -- --watch      # Watch mode for TDD
```

#### Integration Tests (Future)
- Test complete user flows
- Verify optimizer outputs with real data
- API endpoint testing

#### E2E Tests (Future)
- Critical user journeys
- Cross-browser compatibility
- Performance benchmarks

## Coverage Thresholds

### Global Thresholds
```javascript
{
  branches: 13,    // Goal: 50%
  functions: 11,   // Goal: 40%
  lines: 16,       // Goal: 50%
  statements: 16,  // Goal: 50%
}
```

### Critical Files
- `lib/optimizer.ts`: 85%+ coverage required
- `lib/hooks/*.ts`: 95%+ coverage required
- New utility functions: 80%+ coverage expected

## Adding Tests

### For New Features
1. Write tests BEFORE implementation (TDD)
2. Ensure critical paths have tests
3. Add integration tests for complex features

### For Bug Fixes
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Ensure test passes

### For UI Components
1. Focus on behavior, not implementation
2. Test user interactions
3. Verify accessibility

## CI/CD Integration

Tests run automatically on:
- Every push to main
- All pull requests
- Pre-deployment checks

### Handling Test Failures
1. **Coverage below threshold**: Add tests or adjust thresholds with justification
2. **Test failures**: Fix immediately, don't skip tests
3. **Flaky tests**: Investigate root cause, don't ignore

## Best Practices

1. **Keep tests fast** (<5 seconds for unit tests)
2. **Make tests deterministic** (no random data without seeds)
3. **Test behavior, not implementation**
4. **Use descriptive test names**
5. **Follow AAA pattern** (Arrange, Act, Assert)

## Example Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition is true', () => {
    it('should behave in expected way', () => {
      // Arrange
      const input = setupTestData()
      
      // Act
      const result = functionUnderTest(input)
      
      // Assert
      expect(result).toMatchExpectedOutput()
    })
  })
})
```

## Roadmap

### Phase 1 (Current)
- [x] Basic unit tests for core logic
- [x] Coverage reporting setup
- [x] CI/CD integration

### Phase 2 (Q2 2025)
- [ ] Increase coverage to 30%
- [ ] Add integration tests
- [ ] Component testing with React Testing Library

### Phase 3 (Q3 2025)
- [ ] E2E tests with Playwright
- [ ] Performance benchmarks
- [ ] Visual regression tests

### Phase 4 (Q4 2025)
- [ ] 50% coverage target
- [ ] Automated accessibility tests
- [ ] Load testing for optimizer

## Contributing

When contributing, please:
1. Include tests for new features
2. Maintain or improve coverage
3. Run tests locally before pushing
4. Update this document if testing strategy changes

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
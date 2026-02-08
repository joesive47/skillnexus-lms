# 🧪 Testing Guide - SkillNexus LMS

## ✅ Testing Infrastructure Setup Complete!

เราได้ติดตั้งและตั้งค่า Testing Infrastructure สำหรับระบบแล้ว ซึ่งรวมถึง:

- ✅ **Jest** - JavaScript Testing Framework
- ✅ **React Testing Library** - Component Testing
- ✅ **TypeScript Support** - Type-safe tests
- ✅ **Coverage Reports** - Track test coverage

---

## 📦 Installed Packages

```json
{
  "jest": "^29.x",
  "@testing-library/react": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "@testing-library/user-event": "^14.x",
  "jest-environment-jsdom": "^29.x",
  "@types/jest": "^29.x",
  "ts-jest": "^29.x"
}
```

---

## 🚀 Available Test Commands

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Tests in CI Mode
```bash
npm run test:ci
```

### Run Specific Test Types
```bash
# Unit tests (libraries)
npm run test:unit

# Integration tests (API routes)
npm run test:integration

# Component tests
npm run test:components
```

---

## 📂 Test File Structure

```
src/
├── lib/
│   └── __tests__/
│       ├── gamification-service.test.ts
│       ├── validations.test.ts
│       └── utils.test.ts
├── app/
│   └── api/
│       └── __tests__/
│           ├── auth.test.ts
│           └── courses.test.ts
└── components/
    └── __tests__/
        └── ui-components.test.tsx
```

---

## ✅ Current Test Coverage

### Unit Tests
- ✅ **Gamification Service** - Point calculation, badges, levels
- ✅ **Validations** - Email, password, URL, phone number
- ✅ **Utilities** - String, array, number, date functions

### Integration Tests
- ✅ **Authentication API** - Register, login, session management
- ✅ **Courses API** - CRUD operations, enrollment, publishing

### Component Tests
- ✅ **UI Components** - Button, Card, Form elements

---

## 📊 Coverage Goals

| Module | Current | Week 1 Target | Week 2 Target | Final Target |
|--------|---------|---------------|---------------|--------------|
| **Unit Tests** | ✅ 15% | 40% | 70% | 85% |
| **Integration Tests** | ✅ 10% | 30% | 60% | 80% |
| **Component Tests** | ✅ 5% | 20% | 45% | 70% |
| **Overall** | ✅ 10% | 30% | 55% | **80%** |

---

## 🎯 Writing New Tests

### Unit Test Example
```typescript
// src/lib/__tests__/my-service.test.ts
import { describe, it, expect } from '@jest/globals'

describe('MyService', () => {
  describe('calculateSomething', () => {
    it('should calculate correctly', () => {
      // Arrange
      const input = 5
      
      // Act
      const result = input * 2
      
      // Assert
      expect(result).toBe(10)
    })
  })
})
```

### Integration Test Example
```typescript
// src/app/api/__tests__/my-endpoint.test.ts
import { describe, it, expect } from '@jest/globals'

describe('My Endpoint API', () => {
  it('should return data', async () => {
    // Arrange
    const mockData = { id: 1, name: 'Test' }
    
    // Act
    // Your API logic here
    
    // Assert
    expect(mockData.id).toBe(1)
  })
})
```

### Component Test Example
```typescript
// src/components/__tests__/my-component.test.tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('MyComponent', () => {
  it('should render correctly', () => {
    // Arrange & Act
    render(<MyComponent title="Test" />)
    
    // Assert
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

---

## 🔧 Configuration Files

### jest.config.js
Main Jest configuration with:
- Coverage thresholds (starting at 30%)
- Module name mapping for `@/` imports
- Test environment setup
- Coverage collection settings

### jest.setup.js
Setup file with:
- Testing Library matchers
- Next.js router mocks
- Next.js image mocks
- Environment variables for tests

---

## 📈 Next Steps

### Week 1 Goals
1. ✅ Setup Jest and Testing Library ← **DONE!**
2. ⏳ Add tests for authentication flow
3. ⏳ Add tests for course management
4. ⏳ Add tests for gamification logic
5. ⏳ Achieve 30% overall coverage

### Week 2 Goals
1. Add tests for learning progress tracking
2. Add tests for payment integration
3. Add tests for certificate generation
4. Add E2E tests with Playwright
5. Achieve 55% overall coverage

### Final Goals (Week 4)
1. Complete API endpoint tests
2. Complete component library tests
3. Add performance tests
4. Add security tests
5. Achieve **80% overall coverage**

---

## 🐛 Troubleshooting

### Tests Not Running
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Import Errors
Make sure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

### Coverage Not Generating
```bash
# Run with coverage flag
npm run test:coverage

# Check coverage folder
ls coverage/
```

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✨ Benefits of Testing

### 1. **Catch Bugs Early**
- Find bugs before they go to production
- Reduce debugging time

### 2. **Confident Refactoring**
- Change code without fear
- Ensure nothing breaks

### 3. **Better Code Quality**
- Forces you to write testable code
- Improves architecture

### 4. **Documentation**
- Tests serve as living documentation
- Shows how code should be used

### 5. **Faster Development**
- Less time spent on manual testing
- Automated regression testing

---

**🎉 Testing infrastructure is now ready! Start writing tests and improve code quality!**

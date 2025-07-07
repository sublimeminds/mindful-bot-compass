# AI System Testing Suite

This directory contains comprehensive tests for the AI routing, context management, and analytics systems.

## Test Files

### Core Test Suites
- `aiRouting.test.ts` - Tests AI model selection and routing logic
- `contextManagement.test.ts` - Tests therapy context persistence and management
- `analytics.test.ts` - Tests session and mood analytics calculations
- `integration.test.ts` - Tests end-to-end system flows

### Supporting Files
- `setup.ts` - Jest configuration and global mocks
- `testRunner.ts` - Orchestrates test execution and generates reports
- `README.md` - This documentation file

## Running Tests

### Individual Test Suites
```bash
npm test aiRouting.test.ts        # AI model routing tests
npm test contextManagement.test.ts # Context management tests  
npm test analytics.test.ts        # Analytics service tests
npm test integration.test.ts      # End-to-end integration tests
```

### All Tests
```bash
npm test                          # Run all tests
npm test:watch                    # Run tests in watch mode
npm test:coverage                 # Run tests with coverage report
```

### Custom Test Runner
```bash
node src/tests/testRunner.ts      # Run validation suite with detailed report
```

## Test Coverage

### AI Routing (`aiRouting.test.ts`)
- ✅ Model selection for crisis situations
- ✅ Cost optimization for free users
- ✅ Cultural context handling
- ✅ Performance balancing for high urgency
- ✅ Fallback mechanisms on model failure
- ✅ Performance analytics processing
- ✅ Error handling and recovery

### Context Management (`contextManagement.test.ts`)
- ✅ Singleton pattern integrity
- ✅ Context creation and persistence
- ✅ Context updates and synchronization
- ✅ Optimal model selection logic
- ✅ Performance metrics logging
- ✅ Error handling for database operations

### Analytics (`analytics.test.ts`)
- ✅ Session analytics calculation accuracy
- ✅ Mood pattern recognition algorithms
- ✅ Insight generation from data trends
- ✅ Data validation and error handling
- ✅ Performance optimization for large datasets
- ✅ Weekly average calculations

### Integration Tests (`integration.test.ts`)
- ✅ Complete therapy session workflow
- ✅ Multi-session context continuity
- ✅ Cultural context integration
- ✅ Error resilience and recovery
- ✅ Real-time analytics integration
- ✅ Performance monitoring across components

## Mock Strategy

Tests use comprehensive mocks for:
- Supabase client and database operations
- Edge function invocations
- External API calls
- Browser APIs (ResizeObserver, IntersectionObserver)

## Validation Reports

The test runner generates detailed validation reports including:
- Test execution summary
- Performance metrics
- Error analysis
- Actionable recommendations
- System health indicators

## Best Practices

1. **Isolation**: Each test is independent and can run in any order
2. **Mocking**: External dependencies are mocked to ensure deterministic results
3. **Edge Cases**: Tests cover both happy path and error scenarios
4. **Performance**: Tests validate response times and resource usage
5. **Documentation**: Each test clearly describes what it validates

## Configuration

Jest configuration is in `jest.config.js` with:
- TypeScript support via ts-jest
- Path mapping for imports (`@/` → `src/`)
- Automatic mock clearing between tests
- Coverage collection from source files
- Node.js test environment for backend services

## Continuous Integration

These tests are designed to run in CI/CD pipelines and will:
- Exit with appropriate status codes
- Generate coverage reports
- Provide detailed failure information
- Validate system reliability metrics
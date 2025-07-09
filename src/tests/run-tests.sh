#!/bin/bash

# 3D Avatar Test Suite Runner
echo "🚀 Running 3D Avatar Foundation Tests..."

# Set up test environment
export NODE_ENV=test

# Run tests with coverage
echo "📋 Running emotion analyzer tests..."
npx vitest run src/tests/emotion-analyzer.test.ts --reporter=verbose

echo "📋 Running WebGL manager tests..."
npx vitest run src/tests/webgl-manager.test.ts --reporter=verbose

echo "📋 Running 3D avatar component tests..."
npx vitest run src/tests/bulletproof-3d-avatar.test.tsx --reporter=verbose

echo "📋 Running voice integration tests..."
npx vitest run src/tests/voice-enhanced-avatar.test.tsx --reporter=verbose

echo "📋 Running chat integration tests..."
npx vitest run src/tests/3d-chat-integration.test.tsx --reporter=verbose

echo "✅ Test suite complete!"
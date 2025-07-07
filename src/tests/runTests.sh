#!/bin/bash

# AI System Testing Script
# Provides multiple testing options with clear output

echo "🧪 AI System Testing Suite"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run a command and capture its output
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -e "${BLUE}🔄 Running $test_name...${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Parse command line arguments
case "${1:-all}" in
    "quick"|"validation")
        echo -e "${YELLOW}Running Quick Validation...${NC}"
        echo ""
        run_test "Quick System Validation" "cd $(dirname $0)/../.. && node src/tests/validation.ts"
        ;;
    
    "ai"|"routing")
        echo -e "${YELLOW}Running AI Routing Tests...${NC}"
        echo ""
        run_test "AI Model Routing" "npm test src/tests/aiRouting.test.ts"
        ;;
    
    "context")
        echo -e "${YELLOW}Running Context Management Tests...${NC}"
        echo ""
        run_test "Context Management" "npm test src/tests/contextManagement.test.ts"
        ;;
    
    "analytics")
        echo -e "${YELLOW}Running Analytics Tests...${NC}"
        echo ""
        run_test "Analytics Services" "npm test src/tests/analytics.test.ts"
        ;;
    
    "integration")
        echo -e "${YELLOW}Running Integration Tests...${NC}"
        echo ""
        run_test "End-to-End Integration" "npm test src/tests/integration.test.ts"
        ;;
    
    "full"|"jest")
        echo -e "${YELLOW}Running Full Jest Test Suite...${NC}"
        echo ""
        run_test "Complete Test Suite" "npm test"
        ;;
    
    "coverage")
        echo -e "${YELLOW}Running Tests with Coverage...${NC}"
        echo ""
        run_test "Coverage Analysis" "npm run test:coverage"
        ;;
    
    "watch")
        echo -e "${YELLOW}Starting Test Watch Mode...${NC}"
        echo ""
        npm run test:watch
        ;;
    
    "all"|*)
        echo -e "${YELLOW}Running All Validation Methods...${NC}"
        echo ""
        
        total_tests=0
        passed_tests=0
        
        # Quick validation
        if run_test "Quick Validation" "cd $(dirname $0)/../.. && node src/tests/validation.ts"; then
            ((passed_tests++))
        fi
        ((total_tests++))
        
        # AI Routing
        if run_test "AI Routing Tests" "npm test src/tests/aiRouting.test.ts"; then
            ((passed_tests++))
        fi
        ((total_tests++))
        
        # Context Management
        if run_test "Context Management Tests" "npm test src/tests/contextManagement.test.ts"; then
            ((passed_tests++))
        fi
        ((total_tests++))
        
        # Analytics
        if run_test "Analytics Tests" "npm test src/tests/analytics.test.ts"; then
            ((passed_tests++))
        fi
        ((total_tests++))
        
        # Integration
        if run_test "Integration Tests" "npm test src/tests/integration.test.ts"; then
            ((passed_tests++))
        fi
        ((total_tests++))
        
        echo ""
        echo "=========================================="
        echo -e "${BLUE}🎯 FINAL TEST SUMMARY${NC}"
        echo "=========================================="
        echo "Total Test Suites: $total_tests"
        echo -e "✅ Passed: ${GREEN}$passed_tests${NC}"
        echo -e "❌ Failed: ${RED}$((total_tests - passed_tests))${NC}"
        
        if [ $passed_tests -eq $total_tests ]; then
            echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
            exit 0
        else
            echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
            exit 1
        fi
        ;;
esac

echo ""
echo "Available test options:"
echo "  ./runTests.sh quick      - Quick validation (no Jest)"
echo "  ./runTests.sh ai         - AI routing tests only"
echo "  ./runTests.sh context    - Context management tests"
echo "  ./runTests.sh analytics  - Analytics service tests"
echo "  ./runTests.sh integration- End-to-end integration tests"
echo "  ./runTests.sh full       - Complete Jest test suite"
echo "  ./runTests.sh coverage   - Tests with coverage report"
echo "  ./runTests.sh watch      - Watch mode for development"
echo "  ./runTests.sh all        - Run everything (default)"
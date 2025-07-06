# Contributing to TherapySync AI

## Quick Start for Contributors

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/therapysync-ai.git
   cd therapysync-ai
   npm install
   ```

2. **Setup Development Environment**
   - Copy `.env.example` to `.env.local`
   - Configure Supabase credentials
   - Run `npm run dev` to start development server

3. **Before Contributing**
   - Read the [Technical Documentation](./docs/README.md)
   - Review [Architecture Overview](./docs/architecture/README.md)
   - Check existing [Issues](https://github.com/your-org/therapysync-ai/issues)

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Semantic commit messages
- Comprehensive component documentation

### Testing Requirements
- Unit tests for all new components
- Integration tests for API endpoints
- Crisis detection system tests are mandatory

### Security Considerations
- All crisis-related features require security review
- HIPAA compliance for health data
- Row Level Security (RLS) for database access

## Pull Request Process

1. Create feature branch from `main`
2. Make changes with tests
3. Update documentation if needed
4. Submit PR with detailed description
5. Pass all CI checks and code review

For detailed information, see [Technical Documentation](./docs/README.md).
# MDoNER DPR Assessment System

## Overview

This is an AI-powered system for analyzing Detailed Project Reports (DPRs) for the Ministry of Development of North Eastern Region (MDoNER). The application uses artificial intelligence to evaluate DPR documents for quality, completeness, compliance, and risk assessment. It features a modern web interface built with React and TypeScript, backed by an Express.js server with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Full-Stack Architecture**: The application follows a monorepo structure with clear separation between client, server, and shared components.

**Frontend Architecture**: 
- Built with React 18 and TypeScript for type safety
- Uses Vite for fast development and optimized builds
- Implements shadcn/ui component library with Radix UI primitives
- Styled with Tailwind CSS for consistent design system
- State management through TanStack Query for server state
- Wouter for lightweight client-side routing
- Internationalization support with custom i18n implementation

**Backend Architecture**:
- Express.js server with TypeScript
- RESTful API design with clear endpoint structure
- Modular service architecture separating concerns (PDF parsing, AI analysis, storage)
- File upload handling with Multer middleware
- Comprehensive error handling and logging
- Development/production environment separation

**Database Layer**:
- PostgreSQL as primary database with Drizzle ORM
- Schema-first approach with shared type definitions
- Migration support through Drizzle Kit
- Fallback to in-memory storage for development
- Connection to Neon serverless PostgreSQL for production

**AI Integration**:
- OpenAI GPT integration for document analysis
- Structured prompting for DPR evaluation
- Risk assessment and compliance checking
- Scoring algorithms for quality metrics

**File Processing Pipeline**:
- Multi-format support (PDF, TXT)
- Text extraction with validation
- File size and type restrictions for security
- Asynchronous processing with status tracking

**Development Tooling**:
- TypeScript configuration with strict mode
- Path mapping for clean imports
- ESBuild for production bundling
- Hot module replacement in development
- Replit-specific plugins for cloud development

## External Dependencies

**Core Framework Dependencies**:
- React ecosystem: React 18, React DOM, React Hook Form
- Backend: Express.js, Node.js runtime
- Database: PostgreSQL via Neon serverless, Drizzle ORM
- Build tools: Vite, TypeScript, ESBuild

**UI Component Libraries**:
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- TanStack Query for server state management
- Recharts for data visualization

**AI and Processing Services**:
- OpenAI API for document analysis
- Multer for file upload handling
- PDF parsing capabilities (planned integration)

**Styling and Design**:
- Tailwind CSS for utility-first styling
- PostCSS for CSS processing
- Custom design tokens and CSS variables
- Google Fonts integration

**Development and Deployment**:
- Replit platform integration
- Environment variable configuration
- Session management with connect-pg-simple
- CORS and security middleware
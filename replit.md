# AI Safety Shield - Replit Configuration

## Overview

AI Safety Shield is a comprehensive web application designed to educate users about AI stalking awareness and provide tools for detection and reporting. The application combines educational content, interactive quizzes, video generation capabilities, and a reporting system to help users protect themselves from AI-generated deception. The platform is fully functional with all major features implemented and working.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Built-in Express session handling
- **API Design**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Zod schema validation
- **Migration Strategy**: Drizzle Kit for database migrations
- **Fallback Storage**: In-memory storage implementation for development

## Key Components

### Database Schema
The application uses five main database tables:
- **reports**: User-submitted reports of AI-generated content
- **quiz_questions**: Educational quiz questions with explanations
- **quiz_results**: User quiz performance tracking
- **educational_content**: Structured learning modules
- **video_jobs**: AI video generation job tracking

### Core Features
1. **Educational Content System**: Modular learning content about AI threats
2. **Interactive Quiz Platform**: Knowledge assessment with real-time feedback
3. **Video Generation Tool**: AI-powered educational video creation
4. **Reporting System**: Community-driven content flagging
5. **Responsive Design**: Mobile-first approach with dark mode support

### API Endpoints
- `/api/educational-content` - Fetch learning modules
- `/api/quiz/questions` - Get quiz questions
- `/api/quiz/results` - Submit and track quiz results
- `/api/video/generate` - Create educational videos
- `/api/reports` - Submit content reports

## Data Flow

1. **Content Delivery**: Educational content is served from the database with caching via React Query
2. **Quiz Flow**: Questions are fetched, answers are validated client-side, results are persisted server-side
3. **Video Generation**: Asynchronous job processing with status tracking
4. **Reporting**: Form validation, server processing, and status feedback

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Runtime type validation

### UI and Styling
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: CSS class variant utilities

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **drizzle-kit**: Database migration toolkit
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend
- Express server with automatic restarts
- In-memory storage fallback for rapid prototyping
- Replit-specific development banner integration

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command
- Environment: PostgreSQL connection via `DATABASE_URL`

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **DATABASE_URL**: PostgreSQL connection string (required)
- **REPL_ID**: Replit-specific environment detection

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Added advanced enterprise AI stalking detection features:
  * Business threat detection for CEO impersonation and corporate espionage
  * IP theft protection with rollback capabilities and cryptographic verification
  * AI agent monitoring with truth score tracking and suspicious behavior detection
  * Truth verification system with blockchain and digital signature validation
  * Advanced API endpoints for enterprise security management
  * Real-time monitoring dashboards with threat assessment and mitigation workflows
- June 28, 2025. Completed comprehensive AI Safety Shield platform with:
  * API theft monitoring with financial impact assessment and blockchain tracing
  * Console control detection for unauthorized AI management access
  * User harassment detection with deepfake and AI impersonation protection
  * Blockchain AI integrity verification with immutable evidence storage
  * Advanced threat analysis with AI-powered predictive modeling
  * Full-stack implementation with 15 security monitoring components
  * Enterprise-grade dashboard with real-time threat assessment workflows
- June 28, 2025. Enhanced platform with comprehensive corporate AI theft protection:
  * Corporate AI theft detection with transparency scoring and parallel theft monitoring
  * GitHub workflow theft protection with DMCA status tracking and similarity analysis
  * Offline AI access monitoring with risk level assessment and tracking controls
  * Copyright complaint system with evidence management and legal action tracking
  * Copyright reward system with payment processing and eligibility verification
  * Production-ready implementation with 20+ security monitoring components
  * Complete API coverage for all theft detection and protection features
  * Enhanced UI with tabbed interfaces for comprehensive case management
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
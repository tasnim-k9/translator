# Overview

Textify is a modern web translation application built with a full-stack TypeScript architecture. The application provides real-time text translation capabilities with user authentication, translation history, speech-to-text functionality, and a polished user interface. It's designed as a single-page application with a React frontend and Express.js backend, featuring comprehensive user management and translation persistence.

## Recent Changes (August 13, 2025)
- ✓ Created comprehensive landing page with prominent authentication flow
- ✓ Integrated speech-to-text functionality using Web Speech API
- ✓ Added About page with feature showcase and company information
- ✓ Built AuthModal component with login/register tabs and validation
- ✓ Enhanced translator component with voice input capabilities
- ✓ Updated navigation to include About section
- ✓ Implemented professional landing page design with call-to-action sections

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and modern tooling:
- **Framework**: React with TypeScript, bundled using Vite
- **Routing**: Wouter for client-side routing (lightweight React Router alternative)
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Radix UI primitives with Tailwind CSS for styling
- **Design System**: shadcn/ui component library with a "new-york" style variant
- **Form Handling**: React Hook Form with Zod validation schemas
- **Authentication**: JWT-based authentication with localStorage persistence

## Backend Architecture
The server follows a RESTful Express.js architecture:
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL (using Neon serverless)
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **Storage**: Flexible storage interface with in-memory implementation (MemStorage) that can be swapped for database persistence
- **API Structure**: RESTful endpoints for user management and translation operations
- **Middleware**: Custom logging, error handling, and JWT authentication middleware

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for schema management and queries
- **Schema**: Two main entities - users (id, username, password) and translations (id, userId, text, translatedText, source, target, timestamp)
- **Migrations**: Database migrations managed through Drizzle Kit
- **Connection**: Neon Database serverless connection (@neondatabase/serverless)

## Authentication and Authorization
- **Strategy**: JWT-based authentication with stateless tokens
- **Password Security**: bcryptjs hashing with salt rounds for secure password storage
- **Token Management**: 7-day expiration tokens stored in localStorage on client
- **Protected Routes**: Middleware-based route protection for authenticated endpoints
- **User Sessions**: Stateless design with token validation on each request

## Development and Build System
- **Build Tool**: Vite for development server and production builds
- **TypeScript**: Strict type checking across the entire codebase
- **Development**: Hot module replacement and error overlay for development
- **Production**: Optimized builds with code splitting and asset optimization
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: TypeScript ORM for database operations and schema management

## UI and Styling
- **Radix UI**: Headless component primitives for accessibility and behavior
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind integration

## Authentication and Security
- **bcryptjs**: Password hashing library
- **jsonwebtoken**: JWT token generation and verification
- **cors**: Cross-origin resource sharing middleware

## State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation for forms and API schemas

## Translation Services
The application architecture supports external translation API integration, though the specific translation service implementation is abstracted through the backend API layer.
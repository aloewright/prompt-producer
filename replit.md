# Veo Prompt Builder - Replit Development Guide

## Overview

This is a full-stack web application designed to help users create AI video prompts for Veo video generation. The app features a React frontend with a Node.js/Express backend, utilizing a monochromatic design theme with shadcn/ui components. The application supports offline-first functionality with local storage and includes features for building, saving, and managing video prompts.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight routing library)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with a monochromatic dark theme
- **State Management**: React hooks with custom hooks for prompt building
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (configured but not yet implemented)
- **Session Management**: Prepared for PostgreSQL sessions
- **Development**: Hot reload with Vite integration

### Data Storage Strategy
- **Primary Storage**: Browser localStorage for offline-first functionality
- **Database**: PostgreSQL ready for future server-side persistence
- **Session Storage**: PostgreSQL sessions configured for user management

## Key Components

### Prompt Builder System
- **Schema Validation**: Zod schemas for prompt elements and saved prompts
- **Prompt Construction**: Template-based prompt generation with predefined options
- **Element Categories**:
  - Subject (with custom options)
  - Context/Setting
  - Actions (with custom options)
  - Style selection (multiple choice)
  - Camera motion
  - Ambiance/mood
  - Audio elements
  - Closing elements

### UI Components
- **Form Controls**: Custom select dropdowns, text inputs, and textareas
- **Button System**: Styled buttons with variants (primary, secondary, destructive)
- **Toast Notifications**: User feedback system
- **Card Layout**: Organized content presentation
- **Responsive Design**: Mobile-first approach with breakpoint considerations

### Local Storage Management
- **Prompt Persistence**: Save/load/delete functionality for user prompts
- **Offline Capability**: Full functionality without server connection
- **Data Serialization**: JSON-based storage with schema validation

## Data Flow

1. **User Input**: User selects options from dropdowns or enters custom text
2. **Real-time Generation**: Prompt updates automatically as user makes changes
3. **Template Processing**: Prompt elements are combined using predefined templates
4. **Local Storage**: Prompts can be saved to browser localStorage
5. **Clipboard Integration**: Generated prompts can be copied to clipboard
6. **CRUD Operations**: Users can create, read, update, and delete saved prompts

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI components, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Form Handling**: React Hook Form with Zod resolvers
- **Utilities**: date-fns for date formatting, cmdk for command palette

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **Build Tools**: esbuild for production builds, tsx for development
- **Session Management**: connect-pg-simple for PostgreSQL session store

### Development Dependencies
- **Build System**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Tools**: Replit-specific plugins for enhanced development experience

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Vite development server
- **Database**: PostgreSQL 16 (configured but not actively used)
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Full development experience with Vite HMR

### Production Deployment
- **Build Process**: Vite builds frontend assets, esbuild bundles backend
- **Deployment Target**: Replit Autoscale for automatic scaling
- **Static Assets**: Served from Express with Vite-built frontend
- **Database**: PostgreSQL connection ready for production use

### Build Commands
- **Development**: `npm run dev` - Starts development server with hot reload
- **Production Build**: `npm run build` - Builds both frontend and backend
- **Production Start**: `npm run start` - Runs production server
- **Database Migration**: `npm run db:push` - Pushes schema changes to database

## Changelog

- June 26, 2025. Initial setup
- June 26, 2025. Enhanced UI with gray copy buttons with 1-minute shine animation, removed offline status text, added detailed subject description dropdowns (age, gender, appearance, clothing)

## User Preferences

Preferred communication style: Simple, everyday language.
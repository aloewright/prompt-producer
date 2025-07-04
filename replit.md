# Prompt Producer - Replit Development Guide

## Overview

This is a full-stack web application designed to help users create AI video prompts for video generation. The app features a React frontend with a Node.js/Express backend, utilizing a glassmorphism design theme with shadcn/ui components. The application supports offline-first functionality with local storage and includes features for building, saving, and managing video prompts.

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
- **Database**: PostgreSQL with Drizzle ORM (fully implemented)
- **Session Management**: Demo user system for development
- **Development**: Hot reload with Vite integration

### Data Storage Strategy
- **Primary Storage**: PostgreSQL database for persistent storage
- **Local Fallback**: Browser localStorage utilities available as backup
- **API Integration**: RESTful endpoints for prompt CRUD operations

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
- June 26, 2025. Added PostgreSQL database with full CRUD operations, replaced bottom saved prompts section with sliding side panel accessed via sticky bookmark button in upper right corner
- June 27, 2025. Implemented Replit Auth with OpenID Connect integration, added protected routes, created landing page for logged-out users and home page for authenticated users
- June 27, 2025. Added floating interactive tooltips system with playful AI-generated tips, enhanced animations (float, wiggle, slide-in), hover effects, and dismiss functionality
- June 27, 2025. Updated tooltips to display one at a time with mobile responsiveness, fixed landing page animations, added Terms of Service and Privacy Policy pages with Google copyright notices, and prepared for deployment
- June 27, 2025. Removed laptop mockup from landing page below "Get Started" button for cleaner layout, fixed button selection persistence in prompt builder using proper shadcn variants
- June 27, 2025. Changed selection criteria backgrounds from transparent to white fill for better visibility, added Honestlly AI logo as app icon
- June 27, 2025. Redesigned prompt builder with clean card-based sections, iconography, comprehensive right drawer with all actions (saved prompts, navigation, settings, logout), mobile-responsive design
- June 27, 2025. Enhanced AI tips dismissal functionality with individual tip close buttons, "Disable all tips" option, and persistent settings toggle in menu drawer
- July 04, 2025. Updated to Apple-inspired glassmorphism design with deep space gray palette, ultra-low contrast, and subtle depth effects
- July 04, 2025. Added progressive disclosure interface with smooth scroll animations and section-based navigation
- July 04, 2025. Implemented random prompt generation with complexity control slider (simple/balanced/comprehensive)
- July 04, 2025. Fixed Camera & Technical section buttons with proper glass-button styling and hover animations
- July 04, 2025. Added "Enhance Prompt with Cinematic Quality" button spanning full width above generated prompt textarea
- July 04, 2025. Transformed background to gradient blue-grey spheres with soft blur effect, made glass components crystal clear with ultra-low opacity (5-8%)
- July 04, 2025. Implemented Apple-style frosted glass dropdown modals with backdrop blur effect to prevent user overwhelm, applied to all modal components (select, dropdown, dialog, popover)
- July 04, 2025. Enhanced "Enhance Prompt" feature with Google Veo-specific technical specifications including 4K resolution, professional camera movement, natural lighting, photorealistic textures, temporal consistency, and Veo optimization instructions
- July 04, 2025. Implemented blue sticky header with navigation to three main pages: Home, Builder (VeoPromptBuilder), Prompts (saved prompts grid), and Testing (Google Veo integration)
- July 04, 2025. Created multi-page application structure with glassmorphism design consistency across all pages and proper authentication-based routing
- July 04, 2025. Renamed application from "Veo Prompt Builder" to "Prompt Producer" across all pages, components, and documentation
- July 04, 2025. Added "Me" option to subject dropdown for personal video generation
- July 04, 2025. Integrated News API with blue ticker component showing trending US stories, replaced "Ready to create?" sections on both prompt builder intro and landing page with live news ticker

## User Preferences

Preferred communication style: Simple, everyday language.
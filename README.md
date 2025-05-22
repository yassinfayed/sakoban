### Frontend (`/frontend`)
- Built with React + TypeScript + Vite
- Uses modern UI components from Radix UI
- Styled with Tailwind CSS

### Backend (`/server`)
- Node.js + Express.js server
- PostgreSQL database
- Features:
  - RESTful API architecture
  - Session-based authentication
  - Database migrations and seeding
  - Middleware for request processing
  - Environment-based configuration

## Setup and Installation

### Prerequisites
- Node.js
- PostgreSQL
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
# Create a .env file with your database credentials
npm run init-db  # Initialize database
npm run dev     # Start development server
npm drop-db # if you want to drop the db such as DOWN Migration
```

## Development Methodology

### Frontend Development
1. **Component Architecture**
   - Used Radix UI primitives for accessible components
   - Implemented Shadcn UI for consistent styling
   - Organized components by feature and reusability

2. **Type Safety**
   - TypeScript for type checking
   - Strict type checking enabled

### Backend Development
1. **API Design**
   - RESTful endpoints
   - Session-based authentication
   - Middleware for request validation

2. **Database**
   - PostgreSQL for data persistence
   - Seeding scripts for initial data

3. **Security**
   - Environment variables for sensitive data
   - Password hashing with bcrypt
   - CORS configuration
   - Session-based authentication

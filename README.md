# Frigga Cloud Labs - Knowledge Base Assignment
# Frigga Cloud Labs - Knowledge Base Platform

This project is a full-stack, Confluence-like knowledge base platform built as an assignment for the Associate Software Engineer position at Frigga Cloud Labs. It allows teams to create, edit, organize, and search documents collaboratively, with features like real-time auto-saving, version history, and permission-based sharing.

---

## Live Demo

**Frontend URL:** `https://frigga-assignment.vercel.app` *(Update with your actual URL)*
**Backend URL:** `https://frigga-backend.onrender.com` *(Update with your actual URL)*

### Demo Credentials

You can use the following accounts to test the application and its features:

*   **User A (Author):**
    *   **Email:** `test@example.com`
    *   **Password:** `password123`
*   **User B (Collaborator):**
    *   **Email:** `userB@example.com`
    *   **Password:** `password123`

---

## Deployment

This application is deployed using modern cloud platforms:

- **Frontend:** Deployed on [Vercel](https://vercel.com) for optimized Next.js hosting
- **Backend:** Deployed on [Render](https://render.com) for reliable Go API hosting  
- **Database:** PostgreSQL hosted on [Supabase](https://supabase.com) or [Neon](https://neon.tech)

### Environment Configuration

**Backend Environment Variables (Render):**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-production-jwt-secret
PORT=8080
```

**Frontend Environment Variables (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Step-by-Step Deployment Guide

#### 1. Database Setup (Supabase)

1. **Create a Supabase account:** Go to [supabase.com](https://supabase.com)
2. **Create new project:** Select your organization and create a new project
3. **Get connection string:** Go to Settings > Database > Connection string
4. **Copy the URI:** It will look like `postgresql://postgres:[password]@[host]:5432/postgres`

#### 2. Backend Deployment (Render)

1. **Fork this repository** to your GitHub account
2. **Create Render account:** Go to [render.com](https://render.com) and sign up
3. **Create new Web Service:**
   - Connect your GitHub repository
   - Set **Environment** to `Docker`
   - Set **Dockerfile Path** to `./backend/Dockerfile`
   - Set **Build & Deploy** directory to `./backend`
4. **Add Environment Variables:**
   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=your-secure-random-string-32-characters-long
   PORT=8080
   ```
5. **Deploy:** Click "Create Web Service"

#### 3. Frontend Deployment (Vercel)

1. **Create Vercel account:** Go to [vercel.com](https://vercel.com) and sign up
2. **Import project:**
   - Click "New Project"
   - Import your GitHub repository
   - Set **Framework Preset** to `Next.js`
   - Set **Root Directory** to `frontend`
3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   ```
4. **Deploy:** Click "Deploy"

#### 4. CORS Configuration

After deployment, update the backend CORS settings:
1. Edit `backend/main.go`
2. Replace `https://frigga-assignment.vercel.app` with your actual Vercel URL
3. Redeploy the backend

#### 5. Testing the Deployment

1. **Backend Health Check:** Visit `https://your-backend-url.onrender.com/api/health`
2. **Frontend:** Visit your Vercel URL
3. **Create test account** and verify all features work

---

## Features

-   **User Authentication:** Secure user registration and login using JWT.
-   **Document Management:** Full CRUD (Create, Read, Update, Delete) functionality for documents.
-   **Rich Text Editor:** A modern WYSIWYG editor (Tiptap) for creating formatted documents.
-   **Auto-Save:** Document changes are saved automatically in the background.
-   **Privacy Controls:** Documents can be set to **Public** (accessible by anyone) or **Private**.
-   **Sharing System:** Private documents can be shared with specific users with View/Edit permissions.
-   **User Mentions:** Type `@` to mention a user, automatically granting them view access.
-   **Global Search:** A full-text search across all documents accessible to the user.
-   **[BONUS] Version History:** Track all document changes with timestamps and view a side-by-side diff of previous versions.

---

## Tech Stack

This project is a monorepo containing a separate frontend and backend.

### Backend

-   **Language:** Golang
-   **Framework:** Gin
-   **Database:** PostgreSQL
-   **ORM:** GORM
-   **Authentication:** JWT (`golang-jwt/jwt`)

### Frontend

-   **Framework:** Next.js (React)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **UI Components:** Shadcn/ui
-   **State Management:** React Hooks (useState, useContext, etc.)
-   **Rich Text Editor:** Tiptap

### Deployment

-   **Frontend:** Vercel
-   **Backend:** Render (or Fly.io)
-   **Database:** Supabase (or Neon)

---

## Local Setup Instructions

### Prerequisites

-   Go (v1.24+)
-   Node.js (v18+)
-   PostgreSQL database (local or cloud)
-   Git

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/frigga_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration (optional)
PORT=8080
```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install Go dependencies:**
   ```bash
   go mod download
   ```

3. **Set up your PostgreSQL database:**
   - Create a new database named `frigga_db`
   - Update the `DATABASE_URL` in your `.env` file with your database credentials

4. **Run the backend server:**
   ```bash
   go run main.go
   ```

   The server will start on `http://localhost:8080` and automatically run database migrations.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Full Stack Development

To run both frontend and backend simultaneously:

1. **Terminal 1 (Backend):**
   ```bash
   cd backend && go run main.go
   ```

2. **Terminal 2 (Frontend):**
   ```bash
   cd frontend && npm run dev
   ```

### Database Schema

The application will automatically create the following tables:
- `users` - User accounts and authentication
- `documents` - Document content and metadata
- `permissions` - Document sharing permissions
- `versions` - Document version history

### API Documentation

The backend provides a RESTful API with the following endpoints:

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Documents
- `GET /api/documents` - Get all accessible documents
- `POST /api/documents` - Create new document
- `GET /api/documents/:id` - Get specific document
- `PUT /api/documents/:id` - Update document
- `GET /api/documents/search` - Search documents

#### Permissions
- `POST /api/documents/:id/permissions` - Share document with user
- `GET /api/documents/:id/versions` - Get document version history

#### Users
- `GET /api/users/search` - Search users for mentions/sharing

#### Health Check
- `GET /api/health` - Backend health status

### Testing

Run the test suite with:

```bash
# Backend tests
cd backend && go test ./...

# Frontend tests  
cd frontend && npm test
```

## Project Structure

```
frigga-assignment/
├── backend/                 # Go backend application
│   ├── api/                # API route handlers
│   ├── config/             # Configuration and database setup
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Database models (User, Document, etc.)
│   ├── main.go             # Application entry point
│   ├── go.mod              # Go module dependencies
│   ├── Dockerfile          # Docker configuration for deployment
│   └── env.example         # Environment variables template
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable React components
│   │   ├── lib/          # Utility functions and API client
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── vercel.json       # Vercel deployment configuration
│   └── env.local.example # Environment variables template
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI/CD pipeline
├── .gitignore            # Git ignore rules
├── README.md             # Project documentation
├── DEPLOYMENT.md         # Detailed deployment guide
└── render.yaml           # Render deployment configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created as part of an assignment for Frigga Cloud Labs.


# Full Stack Application

This is a modern full-stack application built with React and Node.js, configured for Netlify deployment.

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/          # Source files
│   └── public/       # Static files
└── backend/          # Node.js backend application
    └── src/          # Source files
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-name>
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Deployment

This project is configured for deployment on Netlify. The frontend will be deployed as a static site, while the backend will be deployed as serverless functions.

## Environment Variables

Create `.env` files in both frontend and backend directories. Example variables:

Frontend (.env):
```
VITE_API_URL=http://localhost:8000
```

Backend (.env):
```
PORT=8000
NODE_ENV=development
```

## License

MIT 
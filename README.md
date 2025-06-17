# Full Stack React & Node.js Application

This is a full-stack application built with React.js for the frontend and Node.js/Express for the backend.

## Project Structure

```
├── client/             # React frontend
├── server/             # Node.js backend
├── package.json        # Project dependencies and scripts
└── README.md          # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup Instructions

1. Install server dependencies:
   ```bash
   npm install
   ```

2. Install client dependencies:
   ```bash
   npm run install-client
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   ```

## Running the Application

### Development Mode

To run both frontend and backend concurrently:
```bash
npm run dev
```

To run only the backend:
```bash
npm run server
```

To run only the frontend:
```bash
npm run client
```

### Production Mode

1. Build the React frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000 
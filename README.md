# Team 01 Project

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/springboardmentor9515a-collab/team_01.git
cd team_01
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Environment Variables
Create `.env` file in `backend/` directory:
```
MONGODB_URI=mongodb+srv://thesushpatil:team01-123@team-01.ygu4d08.mongodb.net/?retryWrites=true&w=majority&appName=Team-01
PORT=5000
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c

# Gmail Configuration (Use App Password)
EMAIL_USER=ghostpatil47@gmail.com
EMAIL_PASS=khoqsqfpblrvuzok

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dwlmrylz3
CLOUDINARY_API_KEY=289275876171557
CLOUDINARY_API_SECRET=_dWWFFb1vz0GLX89MoS_yHhae08
```

## Running the Application

### Option 1: Run Both Together (Recommended)
```bash
cd backend
npm run dev:both
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features
- **User Authentication:** Login/Signup with JWT tokens
- **Complaint Management:** Create and manage complaints with file uploads
- **File Upload:** Image upload using Cloudinary
- **Email Service:** Password reset via Gmail
- **Location Verification:** Validate user locations
- **Admin Panel:** Admin authentication and management

## Project Structure
```
team_01/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── tests/           # Test files
│   ├── uploads/         # File uploads
│   ├── logs/            # Application logs
│   └── .env             # Environment variables
└── frontend/
    ├── src/
    │   ├── assets/      # Images, icons
    │   ├── pages/       # React components
    │   └── ...
    └── package.json
```

## Development Workflow
1. Create your own branch: `git checkout -b your-name`
2. Make changes
3. Commit: `git add . && git commit -m "your message"`
4. Push: `git push origin your-name`
5. Create Pull Request to main branch

## Troubleshooting
- Ensure MongoDB is running
- Check if ports 5000 and 5173 are available
- Run `npm install` in both directories if dependencies are missing
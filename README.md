# CollabHub - Full-Stack Team Collaboration App

A modern, professional project management dashboard for teams.

## 🚀 Features
- **Google OAuth**: Secure login without passwords.
- **Role-Based Access**: Specialized views for Admin and Team Members.
- **Section Management**: Assign modules (Frontend, Backend, etc.) to specific members.
- **Task Management**: Create, assign, and track tasks with deadlines.
- **File Submissions**: Upload completed work directly to tasks.
- **Premium UI**: Dark/Light mode toggle, glassmorphism, and smooth animations.
- **Mobile Responsive**: Fully responsive design for all devices.

## 🛠 Tech Stack
- Frontend: React (Vite), Framer Motion, Lucide Icons
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: Passport.js (Google Strategy), JWT

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or a Cloud URI (MongoDB Atlas)
- Google Cloud Console Project for OAuth Credentials

### 2. Backend Setup
1. Open `server/.env` and fill in your credentials:
   - `MONGO_URI`: Your MongoDB connection string.
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console.
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
   - `JWT_SECRET`: Any random strong string.
2. Navigate to the server folder: `cd server`
3. Install dependencies: `npm install`
4. Start the server: `npm run dev` (or `npm start`)

### 3. Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Access the app at `http://localhost:5173`

## 👨‍💼 Admin User Setup
The first user to log in will be a `Team Member` by default. You can manually change your role to `Admin` in the MongoDB database or using the Team Management tab if another Admin exists.

## 📁 Project Structure
- `server/`: Express API, Passport config, MongoDB models.
- `client/`: React application, Context API, Modern CSS.

# React Jobs

React Jobs is a web application that allows users to browse job listings. Once signed up or logged in, users can add, edit, or delete job postings. The project is built with a React frontend and a Node.js/Express backend, with a PostgreSQL database for storing job and user data.

---

## Features

- **Browse Job Listings**
- **User Authentication**
  - Sign up for a new account.
  - Log in to an existing account.
- **Manage Job Postings** (for logged-in users)
  - Add a new job posting.
  - Edit existing job postings.
  - Delete job postings.
- **Responsive Design**

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **React Router**: For handling client-side routing.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **fetch**: For making HTTP requests to the backend.
- **React Icons**: For using icons like FaArrowLeft, FaMapMarker, etc.
- **React Toastify**: For displaying toast notifications.

### Backend
- **Node.js**: A JavaScript runtime for building the backend.
- **Express**: A web framework for Node.js.
- **PostgreSQL**: A relational database for storing job and user data.
- **pg**: A PostgreSQL client for Node.js.
- **bcrypt**: For hashing passwords.
- **CORS**: For enabling cross-origin resource sharing.

### Development Tools
- **Vite**: A fast build tool for modern web applications.
- **Insomnia**: For testing API endpoints.
- **Git**: For version control.

---

## Prerequisites

Before running the application, make sure you have:
- Node.js installed (v14 or higher)
- PostgreSQL installed and running
- npm or yarn package manager

---

## Installation and Setup

1. Clone the repository:
```sh
git clone https://github.com/yourusername/react-jobs.git
cd react-jobs
```
2. Install dependencies for both frontend and backend:
```sh
cd src
npm i

cd server
npm i
```
3. Edit the `.env` file with your PostgreSQL credentials and desired configuration:
```env
DB_USER=your_username
DB_PASSWORD=your_password
```
4. Set up the PostgreSQL database (from the server directory):
  a. First create the database (if it doesn't exist)
  ```sh
  createdb react_jobs
  ```
  b. Then run the setup script
  ```sh
  npm run setup-db
  ```
5. Start the application:
  a.  Start the backend server (from the server directory)
  ```sh
  npm start
  ```
  b. In a new terminal, start the frontend (from the src directory)
  ```sh
  npm run dev
  ```
The frontend will be available at http://localhost:3000 and the backend at http://localhost:3500.

### Port Configuration

- Frontend: Running on port 3000
- Backend: Running on port 3500
- PostgreSQL: Running on port 5432
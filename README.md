# React Jobs

React Jobs is a web application that allows users to browse job listings with advanced filtering capabilities. Users can register as either job seekers or job posters, with different permissions. Job posters can add, edit, or delete job postings, while job seekers can browse and search for jobs. The project features a Vite-powered React frontend and a Node.js/Express backend with PostgreSQL database.

---

## Features

- **Browse Job Listings with Filtering**
  - Filter by location, job type, and salary range
  - Dynamic search functionality
- **Role-Based User Authentication**
  - Register as a job seeker or job poster
  - Different permissions based on user role
  - Secure signup/login with password hashing and JWT
  - Protected routes for authenticated actions
- **Manage Job Postings** (for job posters only)
  - Add a new job posting
  - Edit existing job postings
  - Delete job postings
- **UI/UX Enhancements**
  - Dark/Light mode (persisted in localStorage)
  - Responsive design for all devices
  - Toast notifications for user feedback
  - Access control with appropriate error pages
- **Deployment Ready**
  - Backend hosted on Render
  - Optimized production builds with Vite

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **React Router**: For handling client-side routing.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **fetch**: For making HTTP requests to the backend.
- **React Icons**: For using icons throughout the application.
- **React Toastify**: For displaying toast notifications.
- **Vite**: For ultra-fast development

### Backend
- **Node.js**: A JavaScript runtime for building the backend.
- **Express**: A web framework for Node.js.
- **PostgreSQL**: A relational database for storing job and user data.
- **JWT**: JSON Web Tokens for secure authentication and authorization.
- **bcrypt**: For hashing passwords.
- **CORS**: For enabling cross-origin resource sharing.
- **Swagger**: API documentation and testing interface.

### Development Tools
- **Render**: For backend/database hosting
- **Vite**: A fast build tool for modern web applications.
- **Postman**: For testing API endpoints.
- **Git**: For version control.

## API Documentation

The API for this project is fully documented using Swagger UI.

- **Swagger Documentation**: [https://react-jobs-api-rutx.onrender.com/api-docs](https://react-jobs-api-rutx.onrender.com/api-docs)
# PingPoint: Real-Time API Health Monitoring Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A full-stack, multi-user web application designed for developers to monitor the health and uptime of their critical API endpoints in real-time, built with the MERN stack.

##  Live Demo

**[https://ping-point-jk.vercel.app/](https://ping-point-jk.vercel.app/)**

> **Note:** The backend is hosted on a free Render instance, which may spin down after a period of inactivity. The first login or registration might take up to 30 seconds to "wake up" the server.

---

##  Application Preview

![PingPoint Dashboard Screenshot](./dashboard-screenshot.png)

---

## ✨ Core Features

-   **Secure User Authentication:** Complete authentication system with user registration and login. Passwords are B-Hashed for security (`bcryptjs`), and sessions are managed using JSON Web Tokens (JWT).
-   **Real-Time Monitoring:** An asynchronous backend worker (`node-cron`) runs automatically every minute, sending requests to user-defined URLs to provide up-to-date status information (Up/Down).
-   **Dynamic & Live Dashboard:** The React frontend polls the backend API every 5 seconds, ensuring the dashboard reflects the latest status of all monitored services without requiring a manual page refresh.
-   **Full CRUD Functionality:** Authenticated users can Create, Read, and Delete their own API endpoints through a clean and intuitive interface.
-   **Protected Routes & Data Isolation:** The backend API is secured with custom middleware, ensuring that a logged-in user can only ever access and manage their own data.
-   **Polished User Experience:** Features a component-based UI with loading states and a helpful "slow load" message to manage user expectations with free-tier hosting.

---

##  Tech Stack & Architecture

This project utilizes the MERN stack with a decoupled frontend and backend architecture, deployed on a modern PaaS infrastructure.

-   **Frontend:** React, Redux Toolkit (for global state management), React Router, Tailwind CSS, Vite
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose (hosted on MongoDB Atlas)
-   **Authentication:** JSON Web Tokens (JWT), bcrypt.js for password hashing
-   **Asynchronous Jobs:** node-cron for scheduled tasks, Axios for HTTP requests
-   **Deployment:**
    -   Frontend deployed on **Vercel**.
    -   Backend API deployed on **Render**.

---


    The frontend will be available at `http://localhost:5173`.

### Environment Variables

You will need to create two `.env` files for the project to run locally.

**1. Backend (`/server/.env`):**

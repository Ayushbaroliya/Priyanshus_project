# Project Overview: Udeniya Project

## Purpose
The Udeniya project is a secure, full-stack web application designed for viewing PDF documents with enhanced security features. Its primary focus is on protecting document distribution by implementing a secure viewer that includes dynamic watermarking (such as displaying the user's mobile number on the PDF) and screenshot prevention mechanisms. The application includes user authentication, OTP verification, and an admin interface for managing users and documents.

## Tech Stack
The project is built using the MERN stack (MongoDB, Express, React, Node.js) and is separated into a `client` and a `server` architecture.

### Frontend
- **Framework:** React 18 with Vite for fast bundling and development.
- **Styling:** Tailwind CSS (via PostCSS) for utility-first styling.
- **Routing:** React Router DOM for client-side navigation.
- **PDF Viewer:** `react-pdf` for rendering PDF documents within the browser.
- **State/API:** Axios for HTTP requests to the backend.
- **Icons:** `lucide-react`.

### Backend
- **Runtime & Framework:** Node.js with Express.js.
- **Database:** MongoDB with Mongoose ODM for data modeling.
- **Authentication & Security:** `bcrypt` for password hashing and `jsonwebtoken` (JWT) for secure authentication.
- **File Uploads:** `multer` for handling multipart/form-data and `cloudinary` for cloud-based media/document storage.
- **Email Services:** `nodemailer` for sending emails (e.g., OTPs, notifications).

## Configuration
### Local Development
- The project has a root `package.json` configured with `concurrently` to run both the frontend and backend simultaneously using the command: `npm start`.
- **Client Configuration:** Runs on Vite (`npm run dev` or `npm start` inside the `client` folder). Configuration is managed in `vite.config.js` and `tailwind.config.js`.
- **Server Configuration:** Runs via `nodemon server.js` for development. Environment variables are required in a `server/.env` file, which should configure:
  - `MONGO_URI` for database connection
  - `JWT_SECRET` for authentication tokens
  - `PORT` for the backend server port
  - Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  - Email SMTP credentials for Nodemailer.

### Deployment (Vercel)
- The application is configured to be deployed on Vercel via a `vercel.json` configuration file.
- The `api/` directory acts as the entry point for Vercel Serverless Functions (`api/index.js`), which serves the backend.
- The `client/` directory is built using Vercel's static builder.
- Rewrites are configured such that any request to `/api/*` is routed to the Node.js functions, and all other requests (`/*`) fall back to `client/index.html` to support React Router.

## Limitations
1. **Frontend Screenshot Prevention Constraints:** The project implements mechanisms to prevent screenshots (e.g., intercepting the PrintScreen key or obscuring when focus is lost). However, purely browser-based screenshot prevention is fundamentally limited and can be bypassed using OS-level tools, third-party software, or simply taking a photo with an external camera device.
2. **Client-side Watermarking:** If the watermark is applied over the PDF via the DOM (HTML/CSS), tech-savvy users could potentially use Browser Developer Tools to inspect and remove the watermark element.
3. **Serverless Cold Starts:** Since the backend is deployed as Serverless Functions on Vercel (`@vercel/node`), the API may experience cold starts, resulting in slight delays during the first request after a period of inactivity.
4. **File Size/Timeout Limits:** Vercel's Serverless environment imposes strict limits on API execution time and payload sizes. Uploading or serving extremely large PDF files through the serverless `api` might result in timeouts (typically 10s on Vercel free tier) or `413 Payload Too Large` errors. Large files are better streamed directly to/from Cloudinary from the client.

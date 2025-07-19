

# Customer Registration Form

This project is a web-based Customer Registration Form designed for sales executives to capture customer details and their real-time location during field visits or onboarding. The form is built to meet the requirements outlined in the assignment document (Version: July 17, 2025), with both frontend and full-stack implementations.

---

**Table of Contents**

* Project Overview
* Features
* Technologies Used
* Setup Instructions

  * Prerequisites
  * Frontend Setup
  * Backend Setup
  * Database Setup
* Running the Application
* Usage
* Bonus Features

---

## Project Overview

The Customer Registration Form allows sales executives to collect customer information, including personal details and real-time GPS coordinates, via a user-friendly web interface. The form supports input validation, geolocation capture, and data storage in a PostgreSQL database. It is built using modern web technologies and designed to be responsive across desktops, tablets, and mobile devices.

---

## Features

**Form Fields:**

* Full Name (required, text)
* Email Address (required, valid email format)
* Phone Number (required, 10 digits)
* Gender (select: Male, Female, Other)
* Date of Birth (required, date picker)
* Address (required, multiline text)
* Password & Confirm Password (required, minimum 6 characters, must match)
* Latitude & Longitude (auto-filled via browser geolocation API, read-only)

**Functionality:**

* "Get Location" button to fetch and populate geolocation coordinates.
* Client-side validation using Zod for accurate input checks.
* Confirmation message on successful form submission.
* Graceful handling of geolocation permission denial.
* Data storage in PostgreSQL via a Node.js/Express backend.

**Responsive Design:** Mobile-friendly UI for accessibility across devices.
**Secure Data Handling:** Ensures secure transmission and storage of form data.

---

## Technologies Used

**Frontend:**

* Vite (React) for fast and modern frontend development
* Zod for schema-based form validation
* Tailwind CSS for styling

**Backend:**

* Node.js with Express for API development

**Database:**

* PostgreSQL for persistent data storage

**Other:**

* Browser Geolocation API for capturing latitude and longitude
* Git for version control
* GitHub for repository hosting

---

## Setup Instructions

### Prerequisites

Ensure the following are installed on your system:

* Node.js (v16 or higher)
* PostgreSQL (v13 or higher)
* Git
* A modern web browser (e.g., Chrome, Firefox)

### Frontend Setup

1. Clone the repository:
   `git clone <your-github-repository-url>`
   `cd <project-directory>/frontend`

2. Install dependencies:
   `npm install`

3. Create a `.env` file in the `frontend` directory and add:

   ```
   VITE_API_URL=http://localhost:8000
   ```

### Backend Setup

1. Navigate to the backend directory:
   `cd <project-directory>/backend`

2. Install dependencies:
   `npm install`

3. Create a `.env` file in the `backend` directory with:

   ```
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database-name>
   PORT=8000
   ```

Table schema:

```sql
import pool from "../config/database.js";

export const CustomersSchema=async ()=>{
    const query = `
        CREATE TABLE IF NOT EXISTS customers(
            uid TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL,
            gender TEXT NOT NULL,
            dob TEXT NOT NULL,
            address TEXT NOT NULL,
            latitude REAL DEFAULT NULL,
            longitude REAL DEFAULT NULL,
            deviceinfo JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    await pool.query(query).then((res)=>{
        console.log('Customers Table Created Successfully');
    }).catch((err)=>{
        console.log('Customers Table Creation Failed');
    })
}


```

---

## Running the Application

1. Start the backend server:
   `cd <project-directory>/backend`
   `npm start`
   Runs on `http://localhost:5000`

2. Start the frontend dev server:
   `cd <project-directory>/frontend`
   `npm run dev`
   Frontend at `http://localhost:5173`

3. Open your browser and navigate to the frontend URL to use the form.

---

## Usage

1. Fill out the form with customer details.
2. Click the "Get Location" button to fetch latitude and longitude.
3. Submit the form to store data in PostgreSQL.
4. Success or error message will be shown accordingly.

---

## Bonus Features

* Google Maps Preview (optional with Google Maps API key)
* Password Strength Meter (weak, medium, strong)

---



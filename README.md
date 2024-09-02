<<<<<<< HEAD

# My Node Drive

**My Node Drive** is a full-stack web application designed to help users schedule test drives for electric vehicles. The application consists of a Node.js/Express backend and a React frontend.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is divided into two main parts:

1. **Server**: Node.js/Express backend for handling API requests, managing the database, and serving the frontend.
2. **Frontend**: React application for the user interface.

## Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)
- PostgreSQL (based on `knexfile.js` configuration)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/03Pragya/my-node-drive.git
   ```
2. # Backend Setup

   cd my-node-drive
   cd server
   npm install
   npx knex migrate:latest
   npx knex seed:run
   npm start

3. # Frontend Setup
   cd ../ev-test-drive-ui
   npm install
   npm start

## API Documentation

The API documentation is automatically generated using Swagger.

To view the documentation, navigate to http://localhost:3000/api-docs after starting the backend server.

**API Endpoints**
GET /vehicle-types: Fetch all available vehicle types.
POST /check-availability: Check if a vehicle is available for a test drive.
POST /schedule-test-drive: Schedule a test drive for an available vehicle.
**Usage**
Check vehicle availability: Use the frontend interface to select a location, vehicle type, and time to check if a vehicle is available.
Schedule a test drive: If a vehicle is available, enter your contact details to schedule a test drive.

**Folder Structure**

my-node-drive/
│
├── server/ # Backend server files
│ ├── db.js # Database configuration
│ ├── importData.js # Script to import initial data
│ ├── knexfile.js # Knex.js configuration for database
│ ├── package.json # NPM dependencies and scripts
│ ├── package-lock.json # Lockfile for NPM
│ ├── reservations.json # JSON data for reservations
│ ├── server.js # Main server file
│ ├── swagger.js # Swagger configuration
│ ├── vehicles.json # JSON data for vehicles
│
├── ev-test-drive-ui/ # Frontend React application
│ ├── node_modules/ # Node.js modules
│ ├── public/ # Public assets and static files
│ ├── src/ # React components and assets
│ ├── package.json # NPM dependencies and scripts
│ ├── package-lock.json # Lockfile for NPM
│
├── README.md # Project documentation

**License**
This project is licensed under the MIT License - see the LICENSE file for details.

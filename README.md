# 🚗 Car Dealership Inventory Management System

A full-stack Car Dealership Inventory Management System developed using **React**, **Spring Boot**, and **MongoDB**.

The application enables secure inventory management with JWT authentication, role-based access control, vehicle inventory management, purchasing, restocking, searching, and filtering functionality.

---

# 📌 Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Secure Protected Routes
- Logout Functionality

## Role-Based Access Control (RBAC)

### Admin
- Add Vehicle
- Edit Vehicle
- Delete Vehicle
- Restock Inventory
- Purchase Vehicle
- Search Vehicles
- Filter Vehicles

### User
- View Vehicle Inventory
- Purchase Vehicle
- Search Vehicles
- Filter Vehicles

Users cannot access admin-only pages or operations.

---

# 🚀 Tech Stack

## Frontend

- React.js
- React Router
- Axios
- CSS

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- Maven

## Database

- MongoDB

## Testing

### Frontend

- Jest
- React Testing Library

### Backend

- JUnit

---

# 📂 Project Structure

```
CarDealership
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── security
│   └── tests
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   ├── styles
│   └── tests
│
├── screenshots
│
└── README.md
```

---

# ⚙️ Installation

## Backend

```bash
cd backend
```

Run Spring Boot application.

Backend runs on:

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🔑 Test Accounts

## Admin

```
Email:
meet@test.com

Password:
test@123
```

> Ensure this user has the **ADMIN** role in MongoDB.

## User

Register a new account to access the application as a normal user.

---

# 🧪 Running Tests

## Frontend

```bash
npm test -- --watchAll=false
```

Result:

- 7 Test Suites Passed
- 41 Tests Passed

## Backend

Run the backend JUnit test classes.

All backend tests pass successfully.
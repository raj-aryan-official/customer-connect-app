<<<<<<< HEAD
# Shop Management System

A full-stack application for managing shop orders and products, with separate interfaces for customers and shop owners.

## Features

### Customer Features
- User registration and login
- Browse available products
- Add products to cart
- Submit orders
- Track order status
- View order history

### Shop Owner Features
- User registration and login
- Manage products (add, update, delete)
- View and manage orders
- Update order status
- Track payment status

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd shop-management-system
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

5. Set up the frontend:
```bash
cd frontend
npm install
```

6. Start the frontend development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Register as either a customer or shop owner
2. Log in with your credentials
3. Access your respective dashboard
4. Start managing products and orders

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- GET /api/products/my-products - Get shop owner's products
- POST /api/products - Add new product
- PUT /api/products/:productId - Update product
- DELETE /api/products/:productId - Delete product

### Orders
- POST /api/orders - Create new order
- GET /api/orders/my-orders - Get customer's orders
- GET /api/orders/shop-orders - Get shop owner's orders
- PATCH /api/orders/:orderId/status - Update order status
- PATCH /api/orders/:orderId/payment - Update payment status
=======
# Customer connect app

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/raj-aryan-officials-projects/v0-customer-connect-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Qeb2Qvarx99)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/raj-aryan-officials-projects/v0-customer-connect-app](https://vercel.com/raj-aryan-officials-projects/v0-customer-connect-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/Qeb2Qvarx99](https://v0.dev/chat/projects/Qeb2Qvarx99)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
>>>>>>> 1e10aa3d80a8e1e6a29b89963eac8741c71de576

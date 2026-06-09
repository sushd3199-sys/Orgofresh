# 🥬 Orgofresh – Grocery Delivery Web App

Orgofresh is a full-stack grocery delivery web application built using the MERN stack.  
The platform allows users to browse products, place orders, manage carts, and track deliveries, while sellers and admins can manage products, orders, and authentication securely.

---

# 🚀 Features

## 👤 User Features
- User Authentication
- Browse Products by Category
- Search Products
- Add to Cart
- Address Management
- Place Orders
- Order Tracking
- Responsive UI
- Secure Checkout

---

## 🛒 Seller Features
- Seller Login Authentication
- Add Products
- Update Product Status
- Manage Orders
- Change Password
- Forgot & Reset Password via Email

---

## 👑 Admin Features
- Secure Admin Login
- Create Sellers
- Delete Sellers
- Manage Sellers Dashboard
- Protected Admin Routes
- Role-Based Access Control

---

# 🔐 Security Features

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Protected Routes
- Email-based Password Reset
- Role-Based Authorization
- Secure API Handling

---

# 🧰 Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Bcrypt.js

## Cloud & Services
- Cloudinary (Image Upload)
- MongoDB Atlas
- Gmail SMTP (Email Service)

---

# 📂 Project Structure

/client
┣ /src
┃ ┣ /components
┃ ┣ /pages
┃ ┣ /context
┃ ┣ /assets
┃ ┗ App.jsx

/server
┣ /configs
┣ /controllers
┣ /middlewares
┣ /models
┣ /routes
┣ server.js

---

# ⚙️ Environment Variables

## Server (.env)

```env
PORT=4000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
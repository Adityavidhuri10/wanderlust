# 🌍 Wanderlust

Wanderlust is a full-stack travel listing web app where users can **list, explore, filter, search, and review** places to stay. It features **secure user authentication**, **image uploads to the cloud**, **category-based filtering**, and a clean **MVC architecture** for maintainability.

---

## 🧰 Tech Stack

- **Frontend**: EJS, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (LocalStrategy)
- **File Uploads**: Multer, Cloudinary
- **Templating**: EJS with layouts and partials
- **Utilities**: Express-session, Connect-flash, Method-override, dotenv

---

## ✨ Features

### 🔐 Authentication & Authorization
- User **signup**, **login**, and **logout**
- Session-based auth using **Passport.js**
- Flash messages on success/failure
- Secure password hashing with `passport-local-mongoose`

### 🏠 Listings
- Create, read, update, delete listings
- **Only the listing owner** can update or delete
- Listings support **categories** (e.g., trending, castles, rooms)
- **Image upload** using Multer and storage on **Cloudinary**

### 📝 Reviews
- Users can post and delete reviews
- **Only the review author** can delete their review

### 🔍 Search & Filters
- Search listings by title or location
- Filter by predefined categories using clickable icons

### 🛠 Architecture & Routing
- 💡 Refactored into **MVC pattern**: Models, Views, Controllers
- 🧭 Used `router.route()` chaining for cleaner routing
- 🌐 RESTful routing for listings and reviews

### 🛡 Middleware-based Protection
- Protected routes with ownership checks
- Global error handling using custom `ExpressError`

### 🧩 UI & Views
- Clean and responsive layout using EJS
- Flash messages and dynamic navbar based on auth status
- Home page UI redesigned for better UX

---

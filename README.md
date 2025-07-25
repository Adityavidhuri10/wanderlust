# 🌍 Wanderlust

Wanderlust is a full-stack web application where users can list, explore, and review places to stay. It features secure user authentication and authorization, making sure only the rightful owner can manage their listings or reviews.

---

## 🧰 Tech Stack

- **Frontend**: EJS, HTML, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (LocalStrategy)
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
- Create, view, edit, delete listings
- Only the **listing owner** can update or delete

### 📝 Reviews
- Users can add and delete reviews
- Only the **review author** can delete their review

### 🛡 Middleware-based Protection
- Protected routes with access control
- Global error handling using `ExpressError`

### 🧩 UI & Views
- EJS templating with partials and layouts
- Dynamic navigation based on authentication state
- Flash alerts for feedback

---

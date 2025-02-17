# Echo-App - Real-Time Chat Application

## Overview
Echo-App is a **Full Stack Chat Application** built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack** with **Socket.IO** for real-time messaging. It allows users to communicate seamlessly via text messages, images, and file sharing.

## App Link : https://echo-app-frontend.onrender.com

## Features
- User registration, login, and logout
- Edit user profile
- Send text messages, images, and files in real-time
- Search contacts and view recent chats
- Download received images and files
- Secure and scalable architecture

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Tokens)

## Installation & Setup

### Prerequisites
Ensure you have the following installed on your system:
- Node.js
- MongoDB
- Git


### Backend Setup
```sh
cd backend
npm install
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm start
```

### Environment Variables
Create a `.env` file in the `backend` directory and add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```


## Future Enhancements
- Group chat functionality
- Message reactions and emojis
- Voice and video calling support
- Push notifications for new messages


# Public Chat Frontend

A lightweight public-facing chat interface that connects to a real-time backend using Socket.io.

This application allows users to send messages that are received and managed through an administrative dashboard.

---

## 🚀 Overview

The Public Chat Frontend acts as a micro-application designed for user interaction.

It connects to the Real-Time Chat Backend and enables:

- Sending messages to administrators
- Receiving real-time responses
- Displaying synchronized chat updates

The interface is intentionally minimal and focused on real-time communication.

---

## 💬 Real-Time Communication

This application connects to:

- Express.js + Socket.io backend
- MongoDB message storage (via backend)

Messages are transmitted instantly using WebSocket connections, ensuring real-time interaction between public users and the admin dashboard.

---

## 🧠 Architecture Role

This project serves as:

- A public micro-frontend
- A client for the real-time messaging backend
- A lightweight interface separate from the admin system

It does not contain backend logic and relies entirely on the dedicated chat service.

---

## 🛠 Tech Stack

- Next.js (or React)
- TypeScript (if used)
- Socket.io Client
- REST API integration (if applicable)

---

## 🔗 Related Projects

- Real-Time Chat Backend: [[GitHub Link]](https://github.com/hri-gh/chat-backend.git)
- Personal Dashboard (Admin Interface): [[GitHub Link]](https://github.com/hri-gh/personal-dashboard.git)

---

## 📌 Purpose

Built to demonstrate structured separation between:

- Public user interface
- Real-time backend service
- Administrative dashboard system

This separation allows clearer architecture and easier feature expansion.

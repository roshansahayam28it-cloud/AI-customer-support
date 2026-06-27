[README.md](https://github.com/user-attachments/files/29407169/README.md)

# 🤖 AI Customer Support Ticket System

> **An Enterprise-Level AI-Powered Customer Support Platform built using React, FastAPI, MySQL, Retrieval-Augmented Generation (RAG), FAISS, Sentence Transformers, and GROQ AI.**

---

# Project Overview

The **AI Customer Support Ticket System** is an intelligent enterprise-grade support platform designed to automate customer interactions, streamline ticket management, and assist both support agents and administrators using Artificial Intelligence.

Unlike traditional ticketing systems, this platform integrates **Retrieval-Augmented Generation (RAG)** with Large Language Models (LLMs). Instead of answering from general knowledge, the chatbot searches a domain-specific knowledge base using vector similarity search and provides context-aware answers. If no relevant answer is found, it guides the customer through an AI-assisted ticket creation workflow.

---

# Major Modules

## Customer Module

- User Registration and Login
- Forgot Password with OTP Verification
- AI Support Chat
- RAG-based Question Answering
- Automatic Ticket Creation
- View Ticket Status
- View Conversation History
- Customer Dashboard

## Agent Module

- Agent Dashboard
- Assigned Ticket Management
- Reply to Customer Tickets
- AI Agent Assistant
- Ticket Summarization
- Professional Reply Generation

## Admin Module

- Admin Dashboard
- Customer Management
- Ticket Management
- Analytics Dashboard
- Platform Settings
- AI Admin Assistant
- Database-driven Analytics

---

# Technology Stack

## Frontend

- React.js
- React Router DOM
- JavaScript (ES6+)
- CSS3
- Local Storage
- Fetch API

## Backend

- FastAPI
- Python
- SQLAlchemy ORM
- Pydantic
- Uvicorn

## Database

- MySQL

## Artificial Intelligence

- GROQ LLM
- Sentence Transformers (`all-MiniLM-L6-v2`)
- FAISS Vector Database
- Retrieval-Augmented Generation (RAG)

---

# System Architecture

```text
Customer
   │
   ▼
React Frontend
   │
   ▼
FastAPI Backend
   │
   ▼
Sentence Transformer
   │
   ▼
FAISS Vector Search
   │
   ▼
Knowledge Base
   │
   ▼
GROQ LLM
   │
   ▼
AI Response
```

If no answer is found:

```text
Customer
   │
   ▼
AI asks to create ticket
   │
   ▼
Customer provides details
   │
   ▼
Ticket stored in MySQL
   │
   ▼
Agent handles ticket
   │
   ▼
Customer receives updates
```

---

# Database Tables

## Users
Stores authentication credentials and user roles.

## Customers
Stores customer profile information.

## Tickets
Stores ticket category, issue, priority, status and assigned agent.

## Ticket Replies
Stores conversations between customers and agents.

---

# AI Workflow

1. Customer asks a question.
2. Backend converts the question into embeddings.
3. FAISS searches the vector database.
4. Relevant knowledge is retrieved.
5. GROQ generates an answer from retrieved knowledge.
6. If no answer exists, the chatbot offers ticket creation.
7. Ticket information is collected.
8. Ticket is stored in MySQL.
9. Agent resolves the issue with AI assistance.
10. Admin monitors platform statistics.

---

# REST APIs

## Authentication

- POST `/register`
- POST `/login`

## AI

- POST `/chat`

## Tickets

- GET `/tickets`
- POST `/tickets`
- PUT `/tickets`

## Customers

- GET `/customers`
- POST `/customers`

## Analytics

- GET `/analytics`

---

# Features

- AI-powered customer support
- Knowledge base search using RAG
- Automatic ticket generation
- Agent AI Assistant
- Admin AI Assistant
- Secure authentication
- Ticket lifecycle management
- Analytics dashboard
- Responsive React interface

---

# Future Enhancements

- Voice Assistant
- WhatsApp Integration
- Email Notifications
- Sentiment Analysis
- Docker Deployment
- Kubernetes Deployment
- Multi-language Support
- Predictive Ticket Priority

---

# Developed By

**Roshan Sahayam**

B.Tech Information Technology

AI Customer Support Ticket System

---

# License

This project is intended for educational and learning purposes.

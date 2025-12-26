# 🛡 ShieldAPI – Secure API Gateway for Microservices
ShieldAPI is a production-style API Gateway built with Node.js that centralizes authentication, authorization, rate limiting, logging, and routing for microservices.

## 🚀 Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Redis-based Token Bucket Rate Limiting
- Reverse Proxy Routing to backend services
- Centralized Logging & Metrics
- Dockerized Microservice Architecture

## 🏗 Architecture
``` 
Client
  │
  │ JWT
  ▼
[ Auth Middleware ]
  │
[ RBAC Middleware ]
  │
[ Rate Limiter (Redis) ]
  │
[ Logger + Metrics ]
  │
[ Proxy to Backend Service ]
  │
  ▼
Backend Service (User / Post)
```

## 🛠 Tech Stack

- Node.js, Express
- Redis
- Docker & Docker Compose
- Axios (Reverse Proxy)

## ▶ Run the Project
```bash
docker compose up --build
```
Gateway will be available at:
```bash
http://localhost:4000
```

## 📌 Example Request
```bash
curl http://localhost:4000/api/user/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
## 🎯 Project Objective
To demonstrate how real production systems centralize security, control traffic, and scale microservices using an API Gateway pattern.

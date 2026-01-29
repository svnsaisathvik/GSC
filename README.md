# GSC Project 🚀  
**Full-Stack Application (Spring Boot + React)**

This repository contains both the **backend** and **frontend** of the GSC project.

---

## 📁 Project Structure

```
GSC/
├── backend/         # Spring Boot backend
├── frontend/        # React frontend
└── README.md
```

---

## 🧰 Prerequisites

Make sure you have the following installed:

- **Java 17+**
- **Maven**
- **Node.js 18+**
- **npm** or **yarn**
- **Git**

Verify installations:
```bash
java -version
mvn -version
node -v
npm -v
```

---

## ⚙️ Backend Setup (Spring Boot)

### 📍 Navigate to backend
```bash
cd backend
```

### ▶️ Run the backend
```bash
mvn spring-boot:run
```

OR build and run:
```bash
mvn clean install
java -jar target/*.jar
```

### 🌐 Backend runs at
```
http://localhost:8080
```

---

## 🎨 Frontend Setup (React)

### 📍 Navigate to frontend
```bash
cd frontend
```

### 📦 Install dependencies
```bash
npm install
```
(or)
```bash
yarn install
```

### ▶️ Run frontend
```bash
npm run dev
```
(or)
```bash
yarn dev
```

### 🌐 Frontend runs at
```
http://localhost:5173
```

---

## 🔁 Running Both Together

Open **two terminals**:

### Terminal 1 – Backend
```bash
cd backend
mvn spring-boot:run
```

### Terminal 2 – Frontend
```bash
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` files as needed:

### Frontend
```
frontend/.env
```

### Backend
```
backend/.env
```

⚠️ `.env` files are ignored by `.gitignore`.

---

## 🧪 Useful Commands

### Stop servers
```bash
CTRL + C
```

### Clean backend
```bash
mvn clean
```

### Reinstall frontend deps
```bash
rm -rf node_modules
npm install
```

---

## 📦 Build for Production

### Backend
```bash
cd backend
mvn clean package
```

### Frontend
```bash
cd frontend
npm run build
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch
3. Commit your changes
4. Open a Pull Request

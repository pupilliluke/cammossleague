# 🏀 Cam Moss Basketball League

A comprehensive Summer Basketball League management platform built with **Spring Boot** and **React**.

## 🚀 Quick Start

### Prerequisites
- **Java 21+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Maven 3.6+**

### 1. Clone and Setup
```bash
git clone <repository-url>
cd "Cam Moss League"
npm run setup
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE cammossleague;

-- Run the schema
mysql -u root -p cammossleague < src/main/resources/sql/schema.sql

-- Load sample data
mysql -u root -p cammossleague < src/main/resources/sql/data.sql
```

### 3. Environment Configuration

**Backend Configuration** (`src/main/resources/application.properties`):
```properties
# Update with your database credentials
spring.datasource.username=your_username
spring.datasource.password=your_password

# Firebase configuration (get from Firebase Console)
firebase.project-id=your-project-id
firebase.private-key=your-private-key
```

**Frontend Configuration** (`client/.env`):
```bash
# Copy from template
cp client/.env.example client/.env

# Edit with your values
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
# ... other Firebase config values
```

### 4. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Authentication with Email/Password and Google
4. Get configuration values for `.env` file
5. Generate service account key for backend

### 5. Run the Application

**Development Mode:**
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 8080)

**Production Build:**
```bash
npm run build
npm start
```

## 📁 Project Structure

```
cam-moss-league/
├── src/                    # Spring Boot Backend
│   ├── main/java/cammossleague/
│   │   ├── model/          # JPA Entities ✅
│   │   ├── repository/     # Data Access Layer
│   │   ├── service/        # Business Logic
│   │   ├── controller/     # REST APIs
│   │   └── config/         # Security & Configuration
│   └── main/resources/
│       ├── sql/            # Database Schema ✅
│       └── application.properties
├── client/                 # React Frontend ✅
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Route Pages
│   │   ├── services/       # API Services
│   │   ├── contexts/       # React Contexts
│   │   └── hooks/          # Custom Hooks
│   ├── tailwind.config.js  # Styling Configuration
│   └── package.json
├── TECHNICAL_ARCHITECTURE.md  # Complete Documentation ✅
└── package.json           # Root Scripts
```

## 🎯 Key Features

### ✅ **Implemented**
- **Database Schema**: Complete seasonal architecture with 8 tables
- **Backend Models**: JPA entities with relationships and business logic
- **Frontend Scaffolding**: React + Tailwind CSS + TypeScript setup
- **Authentication System**: Firebase Auth integration ready
- **Responsive Design**: Mobile-first Tailwind CSS framework

### 🚧 **Next Steps** (See TECHNICAL_ARCHITECTURE.md)
- Complete REST API controllers and services
- Build React pages and components
- Admin panel implementation
- Deployment configuration

## 🔐 Authentication Flow

1. **Frontend**: User signs in with Firebase (Email/Password or Google)
2. **Firebase**: Returns ID token to client
3. **Backend**: Verifies ID token, creates/updates user record
4. **Response**: Returns JWT token for API authentication

## 🎨 Design System

**Colors:**
- Primary: Blue (`#2563eb`)
- Secondary: Purple (`#db2777`) 
- Success: Green (`#10b981`)
- Warning: Yellow (`#f59e0b`)
- Error: Red (`#ef4444`)

**Components:**
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Cards: `.card`, `.card-header`, `.card-body`
- Forms: `.form-input`, `.form-select`, `.form-checkbox`

## 🗄️ Database Overview

**Core Entities:**
- **users** - Authentication & profiles
- **seasons** - Season management (active/historical)
- **teams** - Team information & stats
- **players** - Season-specific player data
- **player_teams** - Roster management
- **games** - Schedule & game information
- **game_results** - Scores & outcomes
- **league_updates** - News & announcements

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Run both frontend and backend
npm run dev:client       # Frontend only (port 3000)
npm run dev:server       # Backend only (port 8080)

# Building
npm run build           # Build both projects
npm run build:client    # Build React app
npm run build:server    # Build Spring Boot JAR

# Testing
npm run test           # Run all tests
npm run lint           # Lint frontend code

# Setup
npm run setup          # Initial project setup
```

### API Documentation

**Base URL:** `http://localhost:8080/api`

**Key Endpoints:**
- `GET /public/dashboard` - League overview
- `GET /seasons/active` - Current season data
- `GET /teams` - All teams
- `GET /players/free-agents` - Available players
- `POST /auth/login` - User authentication
- `GET /admin/*` - Admin panel APIs (protected)

See `client/src/services/api.js` for complete API service layer.

## 📱 Mobile Support

The application is built mobile-first with Tailwind CSS:
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Larger tap targets, swipe gestures
- **Progressive Web App**: Can be installed on mobile devices

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
mvn clean package -DskipTests
# Deploy target/cammossleague-0.0.1-SNAPSHOT.jar
```

### Database (PlanetScale/AWS RDS)
- Use production MySQL 8.0
- Run schema.sql for initial setup
- Configure connection in application-prod.properties

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support:
- Email: info@cammossleague.com
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Documentation: [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

---

**Built with ❤️ for the Cam Moss Basketball Community**
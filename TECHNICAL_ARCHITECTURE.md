# 🏀 CAM MOSS LEAGUE - TECHNICAL ARCHITECTURE

A comprehensive Summer Basketball League management platform built with Spring Boot and React.

---

## 📁 PROJECT STRUCTURE

```
cam-moss-league/
├── README.md
├── TECHNICAL_ARCHITECTURE.md
├── package.json                     # Root package scripts
├── pom.xml                          # Spring Boot Maven config
├── docker-compose.yml               # Development environment
├── .env.example
├── 
├── client/                          # React Frontend (TO BE CREATED)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   ├── logo.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   ├── RegisterModal.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── league/
│   │   │   │   ├── LeagueDashboard.jsx
│   │   │   │   ├── GameCard.jsx
│   │   │   │   ├── PlayoffBracket.jsx
│   │   │   │   └── LeagueUpdates.jsx
│   │   │   ├── teams/
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   ├── TeamDashboard.jsx
│   │   │   │   └── RosterList.jsx
│   │   │   ├── players/
│   │   │   │   ├── PlayerCard.jsx
│   │   │   │   ├── FreeAgents.jsx
│   │   │   │   └── PlayerProfile.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── PlayerManagement.jsx
│   │   │       ├── TeamManagement.jsx
│   │   │       ├── GameManagement.jsx
│   │   │       └── SeasonManagement.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LeaguePage.jsx
│   │   │   ├── TeamsPage.jsx
│   │   │   ├── PlayersPage.jsx
│   │   │   ├── BracketPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── firebase.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SeasonContext.jsx
│   │   └── utils/
│   │       ├── constants.js
│   │       ├── formatters.js
│   │       └── validators.js
│   └── dist/                        # Build output
│
└── src/                            # Spring Boot Backend (CURRENT)
    ├── main/
    │   ├── java/cammossleague/
    │   │   ├── CammossleagueApplication.java
    │   │   ├── config/
    │   │   │   ├── WebConfig.java
    │   │   │   ├── SecurityConfig.java (TO BE CREATED)
    │   │   │   └── FirebaseConfig.java (TO BE CREATED)
    │   │   ├── controller/
    │   │   │   ├── AuthController.java (TO BE CREATED)
    │   │   │   ├── PlayerController.java (UPDATED)
    │   │   │   ├── TeamController.java (UPDATED)
    │   │   │   ├── GameController.java (TO BE CREATED)
    │   │   │   ├── SeasonController.java (UPDATED)
    │   │   │   ├── LeagueController.java (TO BE CREATED)
    │   │   │   └── AdminController.java (TO BE CREATED)
    │   │   ├── model/ (COMPLETED)
    │   │   │   ├── User.java ✅
    │   │   │   ├── Player.java ✅
    │   │   │   ├── Team.java ✅
    │   │   │   ├── Game.java ✅
    │   │   │   ├── Season.java ✅
    │   │   │   ├── PlayerTeam.java ✅
    │   │   │   ├── GameResult.java ✅
    │   │   │   └── LeagueUpdate.java ✅
    │   │   ├── repository/ (TO BE UPDATED)
    │   │   ├── service/ (TO BE UPDATED)
    │   │   ├── dto/ (TO BE CREATED)
    │   │   ├── exception/ (TO BE CREATED)
    │   │   └── util/ (TO BE CREATED)
    │   └── resources/
    │       ├── application.properties ✅
    │       ├── application-dev.properties (TO BE CREATED)
    │       ├── application-prod.properties (TO BE CREATED)
    │       ├── sql/
    │       │   ├── schema.sql ✅
    │       │   └── data.sql ✅
    │       └── static/
    └── test/
```

---

## 🗄️ DATABASE SCHEMA

### **Seasonal Architecture**
Our database uses a seasonal approach where each season is independent, allowing for:
- Historical data preservation
- Season-specific rules and configurations
- Easy archival and performance optimization

### **Core Tables**

#### **users** - Authentication & User Profiles
```sql
- id (BIGINT, PK)
- firebase_uid (VARCHAR, UNIQUE) - Firebase Auth integration
- email (VARCHAR, UNIQUE)
- first_name, last_name (VARCHAR)
- role (ENUM: PLAYER, COACH, ADMIN)
- is_free_agent (BOOLEAN)
- profile_image_url, phone, emergency contacts
- created_at, updated_at (TIMESTAMP)
```

#### **seasons** - Season Management
```sql
- id (BIGINT, PK)
- name (VARCHAR) - "Summer 2025"
- year (INT), season_type (ENUM)
- start_date, end_date, registration dates
- is_active (BOOLEAN) - Only one active season
- max_teams, max_players_per_team (INT)
- description (TEXT), rules_url
```

#### **teams** - Team Information
```sql
- id (BIGINT, PK)
- season_id (FK to seasons)
- name, city (VARCHAR)
- logo_url, primary_color, secondary_color
- captain_user_id, coach_user_id (FK to users)
- wins, losses, points_for, points_against (INT)
- is_active (BOOLEAN)
```

#### **players** - Season-Specific Player Data
```sql
- id (BIGINT, PK)
- user_id (FK to users)
- season_id (FK to seasons)
- jersey_number, position (ENUM)
- height_inches, weight_lbs, years_experience
- Basic stats: games_played, points, rebounds, assists
```

#### **player_teams** - Team Roster Management
```sql
- id (BIGINT, PK)
- player_id (FK to players)
- team_id (FK to teams)
- status (ENUM: ACTIVE, PENDING, DECLINED, RELEASED)
- requested_at, approved_at, approved_by_user_id
- notes (TEXT)
```

#### **games** - Game Schedule
```sql
- id (BIGINT, PK)
- season_id (FK to seasons)
- home_team_id, away_team_id (FK to teams)
- game_date (DATE), game_time (TIME)
- location, court_number
- game_type (ENUM: REGULAR, PLAYOFF, CHAMPIONSHIP)
- week_number, is_completed (BOOLEAN)
```

#### **game_results** - Game Outcomes
```sql
- id (BIGINT, PK)
- game_id (FK to games)
- home_team_score, away_team_score (INT)
- winning_team_id (FK to teams)
- overtime, forfeit (BOOLEAN)
- reported_by_user_id, verified_by_user_id (FK to users)
- reported_at, verified_at (TIMESTAMP)
```

#### **league_updates** - News & Announcements
```sql
- id (BIGINT, PK)
- season_id (FK to seasons, nullable for general updates)
- title, content (TEXT)
- update_type (ENUM: NEWS, ANNOUNCEMENT, SCHEDULE_CHANGE, PLAYOFF_UPDATE)
- is_pinned, is_published (BOOLEAN)
- author_user_id (FK to users)
- image_url, published_at
```

---

## 🔌 BACKEND API ENDPOINTS

### **Authentication** (`/api/auth`)
```
POST   /api/auth/login          - Firebase token verification
POST   /api/auth/register       - User registration
POST   /api/auth/refresh        - Token refresh
GET    /api/auth/profile        - Current user profile
PUT    /api/auth/profile        - Update user profile
POST   /api/auth/logout         - Logout
```

### **Public Endpoints** (`/api/public`)
```
GET    /api/public/dashboard    - League dashboard data
GET    /api/public/games/upcoming   - This week's games
GET    /api/public/games/results    - Previous week's results
GET    /api/public/bracket      - Playoff bracket
GET    /api/public/updates      - Published league updates
GET    /api/public/teams        - All teams
GET    /api/public/seasons/{id}/history - Season history
GET    /api/public/free-agents  - Players looking for teams
```

### **Players** (`/api/players`)
```
GET    /api/players            - Get all players (paginated)
POST   /api/players            - Create player profile
GET    /api/players/{id}       - Get player details
PUT    /api/players/{id}       - Update player
DELETE /api/players/{id}       - Delete player
GET    /api/players/free-agents - Free agents
POST   /api/players/{id}/join-team - Request to join team
GET    /api/players/{id}/stats - Player statistics
```

### **Teams** (`/api/teams`)
```
GET    /api/teams              - Get all teams
POST   /api/teams              - Create team (ADMIN only)
GET    /api/teams/{id}         - Get team details
PUT    /api/teams/{id}         - Update team
DELETE /api/teams/{id}         - Delete team (ADMIN only)
GET    /api/teams/{id}/roster  - Team roster
POST   /api/teams/{id}/approve-player - Approve player request
GET    /api/teams/{id}/schedule - Team schedule
GET    /api/teams/{id}/stats   - Team statistics
```

### **Games** (`/api/games`)
```
GET    /api/games              - Get games (filtered by week/team)
POST   /api/games              - Create game (ADMIN only)
GET    /api/games/{id}         - Get game details
PUT    /api/games/{id}         - Update game (ADMIN only)
DELETE /api/games/{id}         - Delete game (ADMIN only)
POST   /api/games/{id}/result  - Submit game result
PUT    /api/games/{id}/result  - Update game result
GET    /api/games/week/{week}  - Games for specific week
```

### **Seasons** (`/api/seasons`)
```
GET    /api/seasons            - Get all seasons
POST   /api/seasons            - Create season (ADMIN only)
GET    /api/seasons/active     - Get active season
GET    /api/seasons/{id}       - Get season details
PUT    /api/seasons/{id}       - Update season (ADMIN only)
POST   /api/seasons/{id}/activate - Activate season (ADMIN only)
GET    /api/seasons/{id}/standings - Season standings
```

### **Admin Panel** (`/api/admin`)
```
GET    /api/admin/dashboard    - Admin dashboard stats
GET    /api/admin/users        - Manage users
PUT    /api/admin/users/{id}/role - Update user role
GET    /api/admin/pending-requests - Pending team requests
POST   /api/admin/updates      - Create league update
PUT    /api/admin/updates/{id} - Update league update
DELETE /api/admin/updates/{id} - Delete league update
GET    /api/admin/analytics    - League analytics
```

---

## 🎨 FRONTEND ARCHITECTURE

### **Technology Stack**
- **React 18** - Component library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router 6** - Client-side routing
- **React Query** - Server state management
- **Firebase SDK** - Authentication
- **Headless UI** - Accessible components
- **Heroicons** - Icon library

### **Page Routes**
```javascript
// Public Routes
/                    - HomePage
/league             - LeaguePage (dashboard)
/teams              - TeamsPage
/players            - PlayersPage
/bracket            - BracketPage
/history            - HistoryPage
/free-agents        - FreeAgentsPage

// Authenticated Routes
/profile            - ProfilePage
/team/dashboard     - TeamDashboard (if user is on a team)

// Admin Routes (Protected)
/admin              - AdminDashboard
/admin/players      - PlayerManagement
/admin/teams        - TeamManagement  
/admin/games        - GameManagement
/admin/seasons      - SeasonManagement
/admin/updates      - UpdateManagement
```

### **Component Breakdown**

#### **Common Components**
- `Header.jsx` - Navigation with auth status
- `Footer.jsx` - League info and links
- `LoadingSpinner.jsx` - Loading states
- `ErrorBoundary.jsx` - Error handling
- `Modal.jsx` - Reusable modal wrapper
- `Button.jsx` - Styled button variants
- `Card.jsx` - Content cards

#### **Authentication Components**
- `LoginModal.jsx` - Firebase login
- `RegisterModal.jsx` - User registration
- `ProtectedRoute.jsx` - Route protection
- `AuthProvider.jsx` - Authentication context

#### **League Components**
- `LeagueDashboard.jsx` - Main league overview
- `GameCard.jsx` - Individual game display
- `PlayoffBracket.jsx` - Tournament bracket
- `LeagueUpdates.jsx` - News and announcements
- `StandingsTable.jsx` - Team standings

#### **Team Components**
- `TeamCard.jsx` - Team overview card
- `TeamDashboard.jsx` - Team-specific dashboard
- `RosterList.jsx` - Team roster display
- `JoinTeamButton.jsx` - Team join requests

#### **Player Components**
- `PlayerCard.jsx` - Player profile card
- `FreeAgents.jsx` - Available players
- `PlayerProfile.jsx` - Detailed player view
- `PlayerStats.jsx` - Statistics display

#### **Admin Components**
- `AdminLayout.jsx` - Admin panel layout
- `AdminDashboard.jsx` - Admin overview
- `DataTable.jsx` - CRUD data tables
- `FormBuilder.jsx` - Dynamic forms
- `Analytics.jsx` - League analytics

---

## 🔐 AUTHENTICATION SYSTEM

### **Firebase Authentication**
- **Provider**: Firebase Auth with JWT tokens
- **Methods**: Email/Password, Google OAuth
- **Flow**: 
  1. User authenticates with Firebase
  2. Frontend receives Firebase ID token
  3. Backend verifies token with Firebase Admin SDK
  4. Creates/updates user record in database
  5. Returns application JWT token

### **Role-Based Access Control**
```javascript
// User Roles
PLAYER - Can manage own profile, join teams, view public data
COACH  - Player permissions + manage assigned teams
ADMIN  - Full system access

// Route Protection
<ProtectedRoute roles={['ADMIN']}>
  <AdminPanel />
</ProtectedRoute>

<ProtectedRoute roles={['COACH', 'ADMIN']}>
  <TeamManagement />
</ProtectedRoute>
```

### **Security Configuration**
- JWT token validation on all protected endpoints
- CORS configuration for frontend domain
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention with JPA

---

## 📱 RESPONSIVE DESIGN

### **Mobile-First Approach**
```css
/* Tailwind Breakpoints */
sm: 640px   - Small tablets
md: 768px   - Tablets  
lg: 1024px  - Small desktops
xl: 1280px  - Large desktops
2xl: 1536px - Extra large screens
```

### **Key UI Features**
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scroll on mobile
- **Cards**: Stack vertically on mobile
- **Forms**: Single column on mobile
- **Modals**: Full screen on mobile

### **Accessibility Compliance**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader compatibility
- Focus management

---

## 🚀 DEPLOYMENT CONFIGURATION

### **Frontend (Vercel/Netlify)**
```javascript
// Build Configuration
- Framework: React (Vite)
- Build Command: npm run build
- Output Directory: dist/
- Environment Variables: VITE_API_URL, VITE_FIREBASE_CONFIG
```

### **Backend (Railway/Render)**
```yaml
# railway.toml or render.yaml
services:
  - type: web
    name: cammoss-backend
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/cammossleague-0.0.1-SNAPSHOT.jar
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: DATABASE_URL
        fromService: mysql
```

### **Database (PlanetScale/AWS RDS)**
- Production MySQL 8.0
- Automated backups
- Connection pooling
- SSL enforcement

### **Environment Variables**
```bash
# Backend (.env)
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:mysql://...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
JWT_SECRET=your-jwt-secret
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password

# Frontend (.env)
VITE_API_URL=https://api.cammossleague.com
VITE_FIREBASE_CONFIG={"apiKey":"..."}
```

---

## 🎯 ADDITIONAL ENHANCEMENTS

### **Performance Optimizations**
- React lazy loading for route components
- Image optimization and CDN integration
- Database query optimization with indexes
- Redis caching for frequently accessed data
- Pagination for large data sets

### **SEO Features**
- Meta tags for social sharing
- Structured data (JSON-LD) for games and teams
- Sitemap generation
- Clean URLs with React Router
- Server-side rendering consideration (Next.js migration path)

### **Email Notifications**
- Game schedule updates
- Team roster changes
- League announcements
- Player registration confirmations
- Game result notifications

### **Analytics Integration**
- Google Analytics 4
- Custom event tracking
- User behavior analysis
- League engagement metrics
- Performance monitoring

---

## 📋 IMPLEMENTATION CHECKLIST

### ✅ **Completed**
- [x] Database schema design
- [x] Spring Boot model classes
- [x] Updated Maven dependencies
- [x] Sample data creation

### 🚧 **Next Steps**
- [ ] Create React frontend scaffolding
- [ ] Implement Spring Boot repositories and services
- [ ] Build REST API controllers
- [ ] Set up Firebase authentication
- [ ] Create React components and pages
- [ ] Implement admin panel
- [ ] Add responsive design and accessibility
- [ ] Deploy to production

---

This architecture provides a solid foundation for a production-ready basketball league management system with room for future enhancements and scalability.
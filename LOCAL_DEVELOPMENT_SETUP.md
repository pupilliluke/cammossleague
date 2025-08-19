# Local Development Setup Guide

## 🛠️ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cammossleague.git
cd cammossleague

# 2. Start PostgreSQL (local)
docker run --name cammoss-postgres -e POSTGRES_DB=cammossleague_local -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# 3. Run backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# 4. Run frontend (in separate terminal)
cd client
npm install
npm run dev

# 5. Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8080
# Admin Panel: http://localhost:5173/admin (login: admin/admin123)
```

---

## Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **Docker** (for local PostgreSQL)
- **Git**
- Your favorite IDE (IntelliJ IDEA, VS Code, etc.)

---

## Database Setup

### Option 1: Docker PostgreSQL (Recommended)

```bash
# Start PostgreSQL container
docker run --name cammoss-postgres \
  -e POSTGRES_DB=cammossleague_local \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Stop container when done
docker stop cammoss-postgres

# Start existing container
docker start cammoss-postgres
```

### Option 2: Local PostgreSQL Installation

```bash
# Windows (using chocolatey)
choco install postgresql

# macOS (using homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb cammossleague_local
```

### Verify Database Connection

```bash
# Connect via psql
psql -h localhost -U postgres -d cammossleague_local

# Or using connection string
psql "postgresql://postgres:password@localhost:5432/cammossleague_local"
```

---

## Backend Development

### Configuration Files

The application will automatically use `application-local.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/cammossleague_local
spring.datasource.username=postgres  
spring.datasource.password=password

# Flyway migrations
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# Development settings
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=validate
logging.level.cammossleague=DEBUG
```

### Running the Backend

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Or using Maven directly
mvn spring-boot:run -Dspring-boot.run.profiles=local

# Run with specific port
./mvnw spring-boot:run -Dspring-boot.run.profiles=local -Dserver.port=8081

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### IDE Configuration

#### IntelliJ IDEA
1. Import project as Maven project
2. Set Project SDK to Java 21
3. Enable annotation processing for Lombok
4. Create run configuration:
   - Main class: `cammossleague.CammossleagueApplication`
   - VM options: `-Dspring.profiles.active=local`
   - Program arguments: (empty)

#### VS Code
1. Install Java Extension Pack
2. Install Spring Boot Extension Pack
3. Open project folder
4. Configure launch.json:

```json
{
    "type": "java",
    "name": "Launch Cammossleague",
    "request": "launch",
    "mainClass": "cammossleague.CammossleagueApplication",
    "vmArgs": "-Dspring.profiles.active=local"
}
```

---

## Frontend Development

### Setup and Installation

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linting
npm run lint
```

### Development Configuration

Create `client/.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Cam Moss League (Dev)
```

### Vite Configuration

The project uses Vite with React. Key configuration in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

---

## Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Start database
docker start cammoss-postgres

# Terminal 2: Start backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 3: Start frontend
cd client && npm run dev
```

### 2. Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html (if configured)
- **Database**: localhost:5432 (postgres/password)

### 3. Default Login Credentials

The DataInitializer creates a default admin user:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@cammossleague.com`

Regular player accounts:
- **Username**: `jdoe` (password: `player123`)
- **Username**: `msmith` (password: `player123`)
- etc.

---

## Testing

### Backend Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=PlayoffServiceTest

# Run tests with coverage
./mvnw clean test jacoco:report

# Integration tests
./mvnw test -Dtest=**/*IntegrationTest

# Skip tests during build
./mvnw clean package -DskipTests
```

### Frontend Tests

```bash
cd client

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test ComplaintForm.test.jsx
```

### Database Testing

```bash
# Reset database (drops and recreates)
docker exec -it cammoss-postgres psql -U postgres -c "DROP DATABASE IF EXISTS cammossleague_local;"
docker exec -it cammoss-postgres psql -U postgres -c "CREATE DATABASE cammossleague_local;"

# Restart application to run migrations and seed data
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

---

## API Development

### Testing API Endpoints

```bash
# Public endpoints
curl http://localhost:8080/api/public/seasons
curl http://localhost:8080/api/public/seasons/1/teams
curl http://localhost:8080/api/public/seasons/1/games

# Authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Admin endpoints (with JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/admin/forms/submissions
```

### API Documentation

If you add Swagger/OpenAPI:

```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>
```

Access at: http://localhost:8080/swagger-ui.html

---

## Database Management

### Viewing Data

```bash
# Connect to database
psql -h localhost -U postgres -d cammossleague_local

# Common queries
SELECT * FROM seasons;
SELECT * FROM teams WHERE season_id = 1;
SELECT * FROM games WHERE is_completed = false;
SELECT * FROM form_submissions WHERE status = 'PENDING';

# Check migrations
SELECT * FROM flyway_schema_history;
```

### Manual Data Manipulation

```sql
-- Create a new admin user
INSERT INTO users (username, password_hash, email, first_name, last_name, role, is_active) 
VALUES ('newadmin', '$2a$10$8cjz47bjbR4Mn8GMg9IZx.vyjhLXR/SKKXUA7qBwSh6WVyO8M2e96', 'new@admin.com', 'New', 'Admin', 'ADMIN', true);

-- Update game score
UPDATE games SET home_score = 85, away_score = 78, is_completed = true WHERE id = 1;

-- Mark form submission as resolved
UPDATE form_submissions SET status = 'RESOLVED', resolved_at = NOW() WHERE id = 1;
```

---

## Debugging

### Backend Debugging

#### IntelliJ IDEA
1. Set breakpoints in code
2. Run application in debug mode
3. Use "Debug" run configuration

#### VS Code
1. Set breakpoints
2. Use "Run and Debug" panel
3. Attach to running process if needed

#### Command Line Debug
```bash
# Run with debug port
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=5005"

# Then connect debugger to localhost:5005
```

### Frontend Debugging

1. **Chrome DevTools**: F12 → Network/Console tabs
2. **React DevTools**: Browser extension for React debugging
3. **Redux DevTools**: If using Redux for state management

### Application Logs

```bash
# View application logs
tail -f logs/spring.log

# Search for errors
grep -i error logs/spring.log

# Filter by log level
grep -i "ERROR\|WARN" logs/spring.log
```

---

## Common Development Tasks

### Adding New API Endpoint

1. **Create DTO** (if needed): `src/main/java/cammossleague/dto/`
2. **Add Repository method**: `src/main/java/cammossleague/repository/`
3. **Implement Service**: `src/main/java/cammossleague/service/`
4. **Create Controller**: `src/main/java/cammossleague/controller/`
5. **Add tests**: `src/test/java/cammossleague/`
6. **Update frontend API calls**: `client/src/services/api.js`

### Adding New React Component

1. **Create component**: `client/src/components/`
2. **Add tests**: `client/src/components/ComponentName.test.jsx`
3. **Update routing**: `client/src/App.jsx` or route files
4. **Add to admin/public layout** if needed

### Database Schema Changes

1. **Create migration**: `src/main/resources/db/migration/V{version}__Description.sql`
2. **Update Entity**: `src/main/java/cammossleague/model/`
3. **Update Repository**: Add new queries if needed
4. **Update DTOs**: If changing API responses
5. **Test migration**: Restart application

---

## Troubleshooting

### Port Conflicts

```bash
# Check what's using port 8080
lsof -i :8080
netstat -tulpn | grep :8080

# Use different port
./mvnw spring-boot:run -Dserver.port=8081

# For frontend (port 5173)
cd client && npm run dev -- --port 3001
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection
pg_isready -h localhost -p 5432

# Reset database
docker exec -it cammoss-postgres psql -U postgres -c "DROP DATABASE IF EXISTS cammossleague_local; CREATE DATABASE cammossleague_local;"
```

### Build Issues

```bash
# Clean and rebuild
./mvnw clean compile
cd client && rm -rf node_modules && npm install

# Check Java version
java -version  # Should be 21+

# Check Node version  
node -v  # Should be 18+
```

### CORS Issues

Ensure backend SecurityConfig allows frontend origin:

```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
```

---

## Performance Tips

### Backend

- **Use profiles**: `-Dspring.profiles.active=local,debug`
- **Increase logging**: `logging.level.org.hibernate.SQL=DEBUG`
- **JVM tuning**: `-Xmx2g -Xms1g` for larger datasets

### Frontend

- **Hot reload**: Vite provides fast HMR out of the box
- **Dev tools**: Use React DevTools for component debugging
- **Network tab**: Monitor API calls and response times

### Database

- **Query logging**: Enable in application-local.properties
- **Connection pooling**: Already configured with HikariCP
- **Indexes**: Check query performance with EXPLAIN

---

## IDE Extensions/Plugins

### IntelliJ IDEA
- **Lombok**: Annotation processing
- **Spring Assistant**: Spring Boot development
- **Database Navigator**: Database management

### VS Code
- **Java Extension Pack**: Java development
- **Spring Boot Extension Pack**: Spring Boot support
- **ES7+ React/Redux/React-Native snippets**: React development
- **Thunder Client**: API testing
- **PostgreSQL**: Database management

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-playoff-system

# Make changes and commit
git add .
git commit -m "feat: implement playoff bracket management"

# Push and create PR
git push origin feature/new-playoff-system

# After PR merge, cleanup
git checkout main
git pull origin main
git branch -d feature/new-playoff-system
```

---

## 🎯 You're Ready to Develop!

### Quick Verification Checklist

- [ ] Database running (port 5432)
- [ ] Backend running (port 8080)
- [ ] Frontend running (port 5173) 
- [ ] Can login as admin
- [ ] Can view public pages
- [ ] Tests pass
- [ ] Hot reload working

### Next Steps

1. **Explore the codebase**: Start with `src/main/java/cammossleague/model/`
2. **Try making changes**: Add a simple field to Season model
3. **Run tests**: Ensure nothing breaks
4. **Check the admin panel**: Create teams, games, etc.
5. **Submit forms**: Test the complaint and signup forms

**Happy coding! 🏀**
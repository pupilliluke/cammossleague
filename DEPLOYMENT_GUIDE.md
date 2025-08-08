# Deployment Guide - Cam Moss League

## PostgreSQL Database Setup with Neon

### 1. Create Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in with your GitHub account
3. Click "Create Project"
4. Choose:
   - **Project Name**: `cam-moss-league`
   - **Database Name**: `cammossleague`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 or latest

### 2. Get Database Connection Details

After creating the project, you'll get:
```
Host: ep-xxx-xxx-xxx.us-east-1.aws.neon.tech
Database: cammossleague
Username: your-username
Password: your-password
Connection String: postgresql://username:password@host:5432/dbname?sslmode=require
```

### 3. Set Up Database Schema

1. Connect to your Neon database using the connection string
2. Run the schema creation script located at `src/main/resources/schema-postgresql.sql`
3. Run the sample data script at `src/main/resources/data.sql`

You can do this through:
- Neon Console SQL Editor
- pgAdmin
- Command line: `psql "your-connection-string" -f schema-postgresql.sql`

## Firebase Authentication Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `cam-moss-league`
3. Enable Authentication
4. Set up sign-in methods:
   - Email/Password
   - Google (optional)

### 2. Get Firebase Config

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Add a web app
4. Copy the Firebase config object

### 3. Generate Service Account Key

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Convert to base64 string for environment variable

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy the Application

```bash
# From project root
vercel
```

### 4. Set Environment Variables

In Vercel Dashboard, go to your project > Settings > Environment Variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
DATABASE_USERNAME=your-neon-username
DATABASE_PASSWORD=your-neon-password

# JPA Configuration
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
SQL_INIT_MODE=never

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=base64-encoded-service-account-json

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# Logging
LOG_LEVEL_SECURITY=WARN
LOG_LEVEL_APP=INFO
LOG_LEVEL_WEB=WARN
```

### 5. Frontend Environment Variables

Create `client/.env.production`:

```env
VITE_API_URL=https://your-app.vercel.app/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Local Development Setup

### 1. Environment Variables

Create `.env` file in project root:

```env
# Development Database (can use Neon for dev too)
DATABASE_URL=postgresql://username:password@host:5432/dbname?sslmode=require
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
JPA_DDL_AUTO=update
JPA_SHOW_SQL=true
SQL_INIT_MODE=always

# Firebase
FIREBASE_SERVICE_ACCOUNT_KEY=base64-encoded-key

# JWT
JWT_SECRET=dev-secret-key-minimum-32-characters

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL_SECURITY=DEBUG
LOG_LEVEL_APP=DEBUG
```

### 2. Frontend Environment

Create `client/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Run the Application

Backend:
```bash
./mvnw spring-boot:run
```

Frontend:
```bash
cd client
npm install
npm run dev
```

## Database Migration Notes

### PostgreSQL vs MySQL Differences

The schema has been adapted for PostgreSQL:

1. **Auto-increment**: `AUTO_INCREMENT` → `BIGSERIAL`
2. **Enums**: MySQL `ENUM('A','B')` → PostgreSQL `CREATE TYPE` + enum usage
3. **Boolean**: Better boolean support in PostgreSQL
4. **Timestamps**: Using `TIMESTAMP WITH TIME ZONE` for better timezone handling
5. **Constraints**: More explicit constraint naming
6. **Triggers**: PostgreSQL-specific trigger syntax for auto-updates

### Key Features

1. **Automatic timestamp updates** using triggers
2. **Team record tracking** with game result triggers
3. **Foreign key constraints** for data integrity
4. **Indexes** for query performance
5. **Enum types** for data validation

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **CORS Configuration**: Restrict to your domain in production
3. **JWT Secret**: Use a strong, random secret key
4. **Database Access**: Use connection pooling and SSL
5. **Firebase Rules**: Set up proper security rules
6. **API Rate Limiting**: Consider implementing rate limiting

## Monitoring and Maintenance

1. **Database**: Monitor Neon usage and performance
2. **Vercel**: Check function execution and build logs  
3. **Firebase**: Monitor authentication usage
4. **Logs**: Use structured logging for debugging
5. **Backups**: Neon provides automatic backups

## Troubleshooting

### Common Issues

1. **Database Connection**: Check connection string format and SSL requirements
2. **CORS Errors**: Verify CORS_ALLOWED_ORIGINS includes your frontend URL
3. **Build Failures**: Check Java version and dependencies
4. **Authentication**: Verify Firebase configuration and service account key
5. **Environment Variables**: Ensure all required variables are set

### Debug Commands

```bash
# Test database connection
psql "your-connection-string" -c "SELECT version();"

# Check Spring Boot logs
./mvnw spring-boot:run --debug

# Test Firebase connection
# Use Firebase Admin SDK test in your application

# Verify environment variables
echo $DATABASE_URL
```

## Performance Optimization

1. **Database Indexes**: Already included for common queries
2. **Connection Pooling**: Configured in Spring Boot
3. **CDN**: Vercel provides automatic CDN for static assets
4. **Caching**: Consider Redis for session/data caching
5. **Image Optimization**: Use Vercel's image optimization for team logos

This setup provides a production-ready deployment with scalable architecture and proper security practices.
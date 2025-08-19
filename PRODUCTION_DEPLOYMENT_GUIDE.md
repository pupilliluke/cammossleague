# Basketball League App - Production Deployment Guide

## 🚀 Quick Start Checklist

- [ ] Neon PostgreSQL database setup
- [ ] Environment variables configured  
- [ ] Backend deployed and running
- [ ] Frontend deployed and connected
- [ ] Database migrated and seeded
- [ ] Admin user created
- [ ] SSL certificates configured
- [ ] Monitoring and logging active

---

## 1. Prerequisites

### System Requirements
- **Java 21** or higher
- **Node.js 18** or higher  
- **npm** or **yarn**
- **Git**
- Access to **Neon** (managed PostgreSQL)
- **Docker** (optional, for containerized deployment)

### Accounts Needed
- [Neon](https://neon.tech) for managed PostgreSQL
- Cloud hosting provider (Vercel, Netlify, Railway, etc.)
- Domain provider (optional)

---

## 2. Neon Database Setup

### Create Neon Project

1. **Sign up** at [neon.tech](https://neon.tech)
2. **Create a new project**:
   - Project name: `cammoss-league-prod`
   - Region: Choose closest to your users
   - PostgreSQL version: 15+

3. **Get connection details**:
   ```
   Host: ep-xyz-123.us-east-1.aws.neon.tech
   Database: neondb
   Username: your-username
   Password: your-password
   ```

### Configure Database

```bash
# Connect to Neon via psql (optional - for verification)
psql "postgresql://username:password@ep-xyz-123.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Create additional database if needed
CREATE DATABASE cammossleague;
```

### Security Setup

- **Enable connection pooling** in Neon dashboard
- **Configure IP restrictions** if needed
- **Set up read replicas** for production scale

---

## 3. Backend Deployment

### Environment Configuration

Create `.env.production`:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xyz-123.us-east-1.aws.neon.tech/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=your-neon-username
SPRING_DATASOURCE_PASSWORD=your-neon-password

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-64-chars-for-hs512-algorithm
ADMIN_PASSWORD=your-secure-admin-password

# Application
SPRING_PROFILES_ACTIVE=neon
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# Optional: Email configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
```

### Build Application

```bash
# Clone repository
git clone https://github.com/your-username/cammossleague.git
cd cammossleague

# Build backend
./mvnw clean package -DskipTests

# Or with tests
./mvnw clean package
```

### Deploy Options

#### Option A: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link [project-id]
railway deploy
```

#### Option B: Docker + Any Cloud Provider

```dockerfile
# Dockerfile (already provided)
FROM openjdk:21-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build and push to registry
docker build -t cammoss-league-backend .
docker tag cammoss-league-backend your-registry/cammoss-league-backend:latest
docker push your-registry/cammoss-league-backend:latest
```

#### Option C: Traditional VPS

```bash
# Upload JAR file
scp target/cammossleague-0.0.1-SNAPSHOT.jar user@your-server:/opt/cammoss-league/

# Run with systemd service
sudo systemctl start cammoss-league
sudo systemctl enable cammoss-league
```

### Database Migration

```bash
# Run Flyway migrations (if not auto-executed)
./mvnw flyway:migrate -Dflyway.url="jdbc:postgresql://your-neon-host/neondb?sslmode=require" \
                       -Dflyway.user="your-username" \
                       -Dflyway.password="your-password"

# Or through application (preferred)
java -jar target/cammossleague-0.0.1-SNAPSHOT.jar --spring.profiles.active=neon
```

### Health Check

```bash
# Verify backend is running
curl -f https://your-backend-domain.com/health

# Check API endpoints
curl https://your-backend-domain.com/api/public/seasons
```

---

## 4. Frontend Deployment

### Build Configuration

Create `client/.env.production`:

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Cam Moss Basketball League
VITE_APP_VERSION=1.0.0
```

### Build and Deploy

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Build for production
npm run build

# Verify build
npm run preview
```

### Deploy Options

#### Option A: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI  
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Static File Hosting

```bash
# Upload dist/ folder contents to your hosting provider
# Configure web server (nginx example):
```

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    
    location / {
        root /var/www/cammoss-league;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass https://your-backend-domain.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 5. SSL and Domain Setup

### Obtain SSL Certificate

```bash
# Using certbot (Let's Encrypt)
sudo certbot --nginx -d your-frontend-domain.com
sudo certbot --nginx -d your-backend-domain.com

# Or configure through your cloud provider's SSL service
```

### DNS Configuration

```
# A Records
your-frontend-domain.com    →    your-frontend-server-ip
api.your-domain.com         →    your-backend-server-ip

# CNAME (alternative)
www.your-domain.com         →    your-frontend-domain.com
```

---

## 6. Initial Data Setup

### Create Admin User

```bash
# Option 1: Through API (recommended)
curl -X POST https://your-backend-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@your-domain.com", 
    "password": "your-secure-password",
    "firstName": "League",
    "lastName": "Administrator"
  }'

# Then manually update role in database
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
```

### Seed Sample Data (Optional)

```bash
# Enable data initialization (add to environment)
SPRING_PROFILES_ACTIVE=neon,dev

# Restart application to trigger DataInitializer
# Then disable dev profile for production
```

---

## 7. Monitoring and Logging

### Application Monitoring

```yaml
# application-neon.properties additions
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
management.metrics.export.prometheus.enabled=true

# Logging configuration
logging.level.cammossleague=INFO
logging.level.org.springframework.security=WARN
logging.pattern.file=%d{ISO8601} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/cammoss-league.log
```

### Health Checks

```bash
# Backend health
curl https://your-backend-domain.com/health

# Database connectivity
curl https://your-backend-domain.com/api/public/seasons

# Frontend availability  
curl https://your-frontend-domain.com
```

### Error Monitoring

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay  
- **New Relic** or **DataDog** for APM

---

## 8. Backup and Disaster Recovery

### Database Backups

```bash
# Neon automatic backups (check dashboard)
# Manual backup
pg_dump "postgresql://username:password@your-neon-host/neondb?sslmode=require" > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump "postgresql://username:password@your-neon-host/neondb?sslmode=require" > "backup_${DATE}.sql"
```

### File Storage Backup

```bash
# Application files
tar -czf app-backup-$(date +%Y%m%d).tar.gz /opt/cammoss-league/

# Upload to cloud storage
aws s3 cp app-backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/
```

---

## 9. Performance Optimization

### Backend Optimizations

```properties
# application-neon.properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.connection-timeout=20000

# JVM optimization
JAVA_OPTS="-Xmx1g -Xms512m -XX:+UseG1GC"
```

### Frontend Optimizations

```bash
# Enable gzip compression (nginx)
gzip on;
gzip_types text/css application/javascript application/json;

# Browser caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Setup (Optional)

- **CloudFlare** for global CDN
- **AWS CloudFront** for AWS ecosystem
- Configure caching rules for static assets

---

## 10. Security Checklist

- [ ] HTTPS enabled for all endpoints
- [ ] JWT secret is secure and unique  
- [ ] Database credentials are encrypted
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (using JPA)
- [ ] XSS protection enabled
- [ ] Security headers configured
- [ ] Regular dependency updates
- [ ] Penetration testing completed

---

## 11. Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check Neon dashboard for connection issues
# Verify connection string format
# Ensure SSL mode is 'require'
```

#### CORS Errors
```java
// Update SecurityConfig.java
configuration.setAllowedOrigins(Arrays.asList("https://your-frontend-domain.com"));
```

#### 404 on Frontend Routes  
```nginx
# Ensure try_files is configured for SPA
try_files $uri $uri/ /index.html;
```

#### Memory Issues
```bash
# Increase JVM heap size
export JAVA_OPTS="-Xmx2g -Xms1g"
```

### Log Analysis

```bash
# View application logs
tail -f logs/cammoss-league.log

# Search for errors
grep -i error logs/cammoss-league.log

# Database query performance
grep -i "slow query" logs/cammoss-league.log
```

---

## 12. Maintenance

### Regular Tasks

```bash
# Weekly backup verification
pg_dump "postgresql://..." > test-restore.sql
dropdb test_restore_db
createdb test_restore_db  
psql test_restore_db < test-restore.sql

# Monthly dependency updates
./mvnw versions:display-dependency-updates
npm audit fix

# Quarterly security scans
./mvnw org.owasp:dependency-check-maven:check
npm audit
```

### Update Procedures

```bash
# 1. Create backup
pg_dump "postgresql://..." > pre-update-backup.sql

# 2. Deploy to staging
git checkout main
./mvnw clean package
java -jar target/*.jar --spring.profiles.active=staging

# 3. Run tests
./mvnw test
cd client && npm test

# 4. Deploy to production
# (Use your deployment method)

# 5. Verify deployment
curl https://your-domain.com/health
```

---

## 13. Scaling Considerations

### Horizontal Scaling

- **Load balancer** for multiple backend instances
- **CDN** for static assets
- **Database read replicas** for read-heavy workloads

### Vertical Scaling

- Monitor CPU/memory usage
- Scale Neon database compute as needed
- Optimize database queries and indexes

---

## 🎉 Final Verification

### Complete Deployment Test

```bash
# 1. Frontend loads
curl -I https://your-frontend-domain.com

# 2. Backend responds  
curl https://your-backend-domain.com/health

# 3. Database connectivity
curl https://your-backend-domain.com/api/public/seasons

# 4. Admin login works
# Navigate to https://your-frontend-domain.com/admin
# Login with admin credentials

# 5. Public forms work
# Test complaint and team signup forms

# 6. Create test game and verify data flow
```

### Success Criteria

- [ ] All API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Admin can log in and manage data
- [ ] Public users can view schedules and standings
- [ ] Forms can be submitted and appear in admin dashboard
- [ ] SSL certificates are valid
- [ ] Performance is acceptable (< 2s load time)

---

## Risk Assessment & Next Actions

### Low Risk
- ✅ Standard CRUD operations
- ✅ JWT authentication  
- ✅ Database migrations

### Medium Risk
- ⚠️ File upload handling
- ⚠️ Email notifications
- ⚠️ Concurrent user management

### High Risk & Mitigation
- 🚨 **Database security**: Use connection pooling, encrypted connections
- 🚨 **User data privacy**: Implement GDPR compliance if needed
- 🚨 **DDoS protection**: Use CloudFlare or similar service
- 🚨 **Backup/Recovery**: Automated backups, tested restore procedures

### Next Actions After Deployment

1. **User Acceptance Testing** with league administrators
2. **Performance monitoring** for first month
3. **Gather user feedback** and iterate
4. **Plan feature roadmap** (mobile app, advanced stats, etc.)
5. **Scale infrastructure** based on usage patterns

---

**🏀 Your basketball league management system is now production-ready!**

For support: Create issues at [GitHub Repository] or contact [admin@your-domain.com]
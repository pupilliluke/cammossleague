# PostgreSQL Setup Guide

## Option 1: Install PostgreSQL on Windows

### Download and Install:
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer (version 15 or 16)
3. Run installer with these settings:
   - Port: 5432 (default)
   - Superuser password: `password` (or remember what you set)
   - Create sample database: Yes

### Create Database:
```sql
-- Connect to PostgreSQL (using pgAdmin or psql)
CREATE DATABASE cammossleague;
CREATE USER cammoss WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cammossleague TO cammoss;
```

### Test Connection:
```bash
# Test with psql command line
psql -h localhost -p 5432 -U postgres -d cammossleague

# Or set environment variables
set DATABASE_URL=jdbc:postgresql://localhost:5432/cammossleague
set DATABASE_USERNAME=postgres
set DATABASE_PASSWORD=password
```

## Option 2: Use Docker (Easier)

### Install Docker Desktop:
1. Download from https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop

### Run PostgreSQL Container:
```bash
# Run PostgreSQL in Docker
docker run --name cammoss-postgres ^
  -e POSTGRES_DB=cammossleague ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=password ^
  -p 5432:5432 ^
  -d postgres:15

# Check if running
docker ps
```

## Option 3: Use Cloud PostgreSQL

### Free Options:
- **ElephantSQL**: https://www.elephantsql.com/ (20MB free)
- **Neon**: https://neon.tech/ (512MB free)
- **Supabase**: https://supabase.com/ (500MB free)
- **Railway**: https://railway.app/ (5GB free)

### Get Connection String:
Most cloud providers give you a connection string like:
```
postgresql://username:password@host:port/database
```

Convert to JDBC format:
```
jdbc:postgresql://host:port/database
```
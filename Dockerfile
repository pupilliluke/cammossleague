# --- Stage 1: build the React frontend ---
FROM node:20-alpine AS client-build

WORKDIR /client

COPY client/package.json client/package-lock.json* ./
RUN npm ci

COPY client/ ./
RUN npm run build

# --- Stage 2: build the Spring Boot backend (with frontend bundled) ---
FROM eclipse-temurin:21-jdk-alpine AS server-build

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw && ./mvnw -B dependency:go-offline

COPY src ./src

# Drop the built SPA into Spring Boot's static resources before packaging
COPY --from=client-build /client/dist/ ./src/main/resources/static/

RUN ./mvnw -B clean package -DskipTests

# --- Stage 3: runtime ---
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl && \
    addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

COPY --from=server-build /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]

# Multi-stage build for optimized image size

# Stage 1: Build
FROM gradle:8.5-jdk17 AS builder

WORKDIR /app

# Copy Gradle files
COPY build.gradle settings.gradle ./
COPY gradle ./gradle

# Download dependencies (cached layer)
RUN gradle dependencies --no-daemon

# Copy source code
COPY src ./src

# Build application
RUN gradle bootJar --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Create non-root user (Debian/Ubuntu)
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Copy JAR from builder
COPY --from=builder /app/build/libs/*.jar app.jar

# Change ownership
RUN chown spring:spring app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

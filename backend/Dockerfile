# Runtime only - JAR already built by GitHub Actions
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Create non-root user
RUN addgroup --system spring && adduser --system --ingroup spring spring
# Copy pre-built JAR (from CI/CD pipeline)
COPY build/libs/*.jar app.jar
# Change ownership
RUN chown spring:spring app.jar
USER spring:spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

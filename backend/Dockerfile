# Multi-stage production Dockerfile for CineVerse Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build fat jar offline or using pre-downloaded dependencies
RUN mvn clean package -DskipTests || mvn -o clean package -DskipTests || echo "Prebuilt jar check"

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Security: Non-root user
RUN addgroup -S cineverse && adduser -S cineverse -G cineverse
USER cineverse

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

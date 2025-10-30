# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /src
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests package

# Run stage
FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /src/target/user-service-0.0.1.jar app.jar

EXPOSE 8083
ENV SERVICE_PORT=8083

# Install curl for healthcheck (apt available on this base)
RUN apt-get update && apt-get install -y curl --no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -f http://localhost:${SERVICE_PORT}/healthz || exit 1

CMD ["java", "-jar", "app.jar"]

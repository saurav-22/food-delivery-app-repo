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
CMD ["java", "-jar", "app.jar"]

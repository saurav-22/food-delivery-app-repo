# Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# Run (small JRE)
FROM eclipse-temurin:21-jre-alpine
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"
WORKDIR /app
COPY --from=build /src/target/user-service-0.0.1.jar app.jar
EXPOSE 8083
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]

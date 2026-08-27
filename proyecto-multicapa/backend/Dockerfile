# ============================================
# Etapa 1: build con Maven
# ============================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos primero el pom.xml para aprovechar la cache de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================
# Etapa 2: imagen final, solo runtime (JRE)
# ============================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/multicapa-backend.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

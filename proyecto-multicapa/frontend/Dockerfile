# ============================================
# Etapa 1: build con Node + Vite
# ============================================
FROM node:20-alpine AS build
WORKDIR /app

# Aprovechamos la cache de capas: primero dependencias
COPY package*.json ./
RUN npm install

# La URL de la API se fija en tiempo de build (Vite embebe las variables VITE_*)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN npm run build

# ============================================
# Etapa 2: servir el build estático con Nginx
# ============================================
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

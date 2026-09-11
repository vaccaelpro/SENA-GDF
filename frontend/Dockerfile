# =========================================================
# Etapa 1: Compilación de la aplicación React (Build Stage)
# =========================================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar manifiestos de paquetes
COPY package*.json ./

# Instalar dependencias del frontend
RUN npm install --legacy-peer-deps

# Copiar el código fuente completo
COPY . .

# Argumentos y variables de entorno para el build
ARG REACT_APP_API_URL=http://localhost:3001/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV DISABLE_ESLINT_PLUGIN=true
ENV NODE_ENV=production

# Generar el paquete estático optimizado
RUN npm run build

# =========================================================
# Etapa 2: Servidor Web de Alto Rendimiento (Nginx Stage)
# =========================================================
FROM nginx:alpine

# Copiar configuración de Nginx con soporte SPA y proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los artefactos estáticos generados en la etapa de build
COPY --from=build /app/build /usr/share/nginx/html

# Exponer puerto HTTP
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]

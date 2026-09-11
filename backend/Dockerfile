FROM node:20-alpine

# Instalar curl para healthcheck
RUN apk --no-cache add curl

WORKDIR /app

# Instalar dependencias del proyecto (optimizando la caché de Docker)
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el código fuente y certificados
COPY . .

# Crear el directorio de uploads con los subdirectorios necesarios
RUN mkdir -p uploads/documentos_metro

# Exponer el puerto configurado en Express
EXPOSE 3001

# Healthcheck para comprobar que el backend está respondiendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3001/api/test || exit 1

# Comando de inicio del servidor
CMD ["node", "src/server.js"]

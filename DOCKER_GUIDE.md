# Guía de Dockerización - SENA-GDF 🐳

Esta guía contiene las instrucciones paso a paso, los comandos esenciales y la resolución de problemas para desplegar el proyecto **SENA-GDF** utilizando **Docker Desktop** en Windows.

---

## 📋 Arquitectura de Contenedores

| Servicio | Tecnología | Puerto en Host | Función |
| :--- | :--- | :--- | :--- |
| **`sena-gdf-backend`** | Node.js 20 Alpine + Express | `3001` | API REST, conexión a base de datos MySQL (Aiven Cloud con SSL), subida de archivos |
| **`sena-gdf-frontend`** | Nginx Alpine + React 19 SPA | `3000` | Servidor web de producción, rutas SPA (`react-router-dom`) y proxy inverso |

### Características Clave:
- **Multi-stage build en Frontend**: El build de React se realiza en una etapa aislada y solo los archivos estáticos finales se copian a Nginx, produciendo una imagen ligera (~25MB) y segura.
- **Nginx con SPA y Proxy**: Resuelve automáticamente rutas de React Router (evita errores 404 al recargar) y enruta `/api/` y `/uploads/` internamente hacia el backend.
- **Persistencia de Datos**: Los archivos subidos en `backend/uploads` (como `documentos_metro`) están montados a tu sistema de archivos de Windows para que no se pierdan nunca al reiniciar o reconstruir los contenedores.
- **Healthcheck Automático**: El frontend espera a que el backend esté listo y saludable (`/api/test`) antes de iniciar.

---

## 🚀 Inicio Rápido (Un Solo Comando)

### Opción 1: Con los Scripts PowerShell incluidos
Para iniciar todo el proyecto:
```powershell
.\docker-start.ps1
```

Para detener todo el proyecto:
```powershell
.\docker-stop.ps1
```

---

### Opción 2: Con comandos directos de Docker Compose

#### 1. Construir e iniciar contenedores en segundo plano:
```powershell
docker compose up -d --build
```

#### 2. Verificar el estado de los contenedores:
```powershell
docker compose ps
```

#### 3. Ver los logs en tiempo real:
```powershell
# Todos los servicios
docker compose logs -f

# Solo el backend
docker compose logs -f backend

# Solo el frontend
docker compose logs -f frontend
```

#### 4. Detener los contenedores:
```powershell
docker compose down
```

---

## 🌐 URLs de Acceso

- **Aplicación Web (Frontend):** [http://localhost:3000](http://localhost:3000)
- **API Backend (Prueba):** [http://localhost:3001/api/test](http://localhost:3001/api/test)
- **Archivos Subidos:** [http://localhost:3000/uploads/](http://localhost:3000/uploads/) o [http://localhost:3001/uploads/](http://localhost:3001/uploads/)

---

## 🛠️ Comandos de Mantenimiento y Diagnóstico

### Reconstruir un solo servicio tras cambios en el código
Si modificas el código del backend o frontend y quieres reconstruir únicamente ese servicio:
```powershell
# Reconstruir solo el backend
docker compose up -d --build backend

# Reconstruir solo el frontend
docker compose up -d --build frontend
```

### Entrar a la terminal interactiva dentro de un contenedor
```powershell
# Entrar al backend
docker compose exec backend sh

# Entrar al frontend (Nginx)
docker compose exec frontend sh
```

### Reiniciar los servicios
```powershell
docker compose restart
```

### Detener y eliminar volúmenes/redes huérfanas (Limpieza total)
```powershell
docker compose down -v --remove-orphans
```

---

## 💻 Modo Desarrollo (Con Hot-Reload)

Si prefieres programar y ver los cambios reflejados instantáneamente sin tener que reconstruir la imagen cada vez:
```powershell
docker compose -f docker-compose.dev.yml up --build
```
Para detener el entorno de desarrollo:
```powershell
docker compose -f docker-compose.dev.yml down
```

---

## ❓ Preguntas Frecuentes y Solución de Problemas

### 1. "Docker Desktop no se puede conectar / error de daemon"
Asegúrate de que la aplicación **Docker Desktop** esté abierta en Windows y el ícono en la barra de tareas esté en verde.

### 2. "Port already allocated" (Puerto 3000 o 3001 ocupado)
Si ya tienes una instancia local de Node o React corriendo en tu máquina fuera de Docker, detenla antes de ejecutar `docker compose up`. O bien, cambia el mapeo de puertos en `docker-compose.yml` (por ejemplo `"3002:3001"` o `"8080:80"`).

### 3. Conexión a la Base de Datos
El contenedor del backend lee automáticamente las credenciales desde `backend/.env` y utiliza el certificado `backend/certs/ca.pem`. Verifica que tu archivo `backend/.env` contenga las credenciales válidas para Aiven Cloud o tu servidor MySQL remoto.

# Dockerfile de ComfyUI Prompt Generator

Aquí está el Dockerfile para ejecutar el servicio en un contenedor Docker.

## Compilar la imagen

```bash
docker build -t comfyui-prompt-generator .
```

## Ejecutar el contenedor

```bash
docker run -p 3005:3005 comfyui-prompt-generator
```

O con un nombre específico:

```bash
docker run -d --name prompt-generator -p 3005:3005 comfyui-prompt-generator
```

## Con Docker Compose

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  prompt-generator:
    build: .
    ports:
      - "3005:3005"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3005/options', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

Luego ejecuta:

```bash
docker-compose up -d
```

## Características del Dockerfile

- ✨ **Multi-stage build**: Optimiza el tamaño de la imagen
- 🎯 **Alpine Linux**: Usa Node.js en Alpine para una imagen más pequeña
- 🏥 **Health Check**: Verifica que el servicio esté respondiendo
- 🔍 **Production**: Instala solo dependencias de producción
- 📦 **Optimizado**: Excluye archivos innecesarios con .dockerignore

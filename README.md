# API Wrapper para Directus PDN

API wrapper para consultar diferentes instancias de del API de interconexión del S3(v2) de la Plataforma Digital Nacional. Este wrapper permite realizar consultas a las siguientes colecciones:

- faltas_graves_personas_morales
- faltas_graves_personas_fisicas
- faltas_administrativas_graves
- faltas_administrativas_no_graves

## Características

- Consulta múltiples APIs
- Soporte para paginación
- Filtrado de registros
- Manejo de errores consistente
- Logs detallados
- Configuración vía variables de entorno
- Soporte para Docker

## Requisitos

- Node.js >= 18
- npm >= 6
- Docker (opcional)

## Instalación

1. Clonar el repositorio:
```bash
git clone <repositorio>
cd <directorio>
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env`:
```bash
cp .env.EJEMPLO .env
```

4. Configurar las variables de entorno en `.env`:
```plaintext
API_PROVIDERS=[{"providerId":"provider1","endpoint":"https://url-api-interconexion.dev","token":"tu-token-aqui"}]
PORT=3000
```

## Uso

### Iniciar en desarrollo
```bash
npm run dev
```

### Iniciar en producción
```bash
npm start
```

### Endpoints

#### Consulta de colecciones
```
GET /{collection}/{providerId}
```

Parámetros de consulta soportados:
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 10)
- `filter`: Filtros de Directus

Ejemplo de consulta con filtros:
```
GET /faltas_graves_personas_morales/provider1?filter[expediente][_eq]=valor
```

## Despliegue con Docker

### Usando Docker Compose (recomendado)

1. Configurar variables de entorno en `.env`
2. Ejecutar:
```bash
docker-compose up -d
```

### Usando Docker directamente

1. Construir la imagen:
```bash
docker build -t api-wrapper .
```

2. Ejecutar el contenedor:
```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name api-wrapper \
  api-wrapper
```

## Estructura del Proyecto

```
.
├── src/
│   ├── config/
│   │   ├── collections.js
│   │   └── providers.js
│   ├── services/
│   │   └── DirectusWrapper.js
│   ├── routes/
│   │   └── api.js
│   └── app.js
├── .env
├── .env.EJEMPLO
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Logs

El sistema proporciona logs detallados de las peticiones:

```
=== API Request ===
Provider: ejemploProveedor
Endpoint: https://api.example.com/items/collection?fields=*.*.*&limit=10&offset=0
==================
```

## Manejo de Errores

El API devuelve respuestas consistentes:

Éxito:
```json
{
  "success": true,
  "data": [...],
  "meta": {...},
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5
  }
}
```

Error:
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

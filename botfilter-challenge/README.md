# Nimble Gravity BotFilter Challenge

Mini app en React para:

1. Obtener datos de candidato por email.
2. Listar posiciones abiertas desde API.
3. Enviar postulación a una posición con URL de repo de GitHub.

## Stack

- React + Vite
- Fetch API (sin librerías externas)
- CSS modular simple (`src/styles.css`)

## Configuración

Creá un archivo `.env` en la raíz del proyecto (`botfilter-challenge/.env`) con:

```bash
VITE_API_BASE_URL=https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net
```

Nota: si falta la variable, el proyecto usa ese mismo valor como fallback.

## Ejecutar local

```bash
npm install
npm run dev
```

## Validación de calidad

```bash
npm run lint
npm run build
```

## Flujo de uso

1. Ingresá tu email y presioná `Load candidate`.
2. Elegí una posición de la lista.
3. Pegá tu repo (`https://github.com/usuario/repo`) y presioná `Submit`.
4. Verificá feedback de éxito/error en la tarjeta de esa posición.

## Endpoints usados

- `GET /api/candidate/get-by-email?email=...`
- `GET /api/jobs/get-list`
- `POST /api/candidate/apply-to-job`

# Nexo-Comuna: Plataforma Web (Territorio INN C1)

Este repositorio unifica los componentes web de la plataforma **Nexo-Comuna (CamelloBot)** para el Reto de Innovación Abierta (Territorio INN). 

Alberga tanto la **Landing Page** promocional como el **Dashboard Administrativo** para visualizar los datos recolectados por el bot en tiempo real.

## Estructura del Repositorio

El repositorio sigue una arquitectura unificada de componentes separados por carpetas para mantener su independencia y facilidad de despliegue:

```text
nexo-comuna-territorio-inn-c1-web/
│
├── landing/                # 🌐 Landing Page Principal
│   ├── index.html          # Interfaz estática principal (HTML/Vanilla CSS)
│   ├── camello.svg         # Identidad visual (isotipo)
│   └── README.md           # Documentación específica de la Landing
│
├── dashboard/              # 📊 Dashboard Administrativo
│   ├── src/                # Código fuente en React/Vite
│   │   ├── components/     # Componentes de la interfaz
│   │   ├── hooks/          # Integración con Supabase y lógica
│   │   ├── pages/          # Vistas principales (Overview, Mapa, etc.)
│   │   └── index.css       # Sistema de diseño
│   ├── public/             # Assets estáticos del Dashboard
│   ├── package.json        # Dependencias (React, Supabase, Tailwind, etc.)
│   ├── vite.config.js      # Configuración de Vite
│   └── README.md           # Documentación específica del Dashboard
│
└── README.md               # Esta documentación
```

## 1. Landing Page (`/landing`)

La Landing Page sirve como el punto de contacto principal para los usuarios, inversores y jueces de Territorio INN.

- **Tecnología:** HTML5, Vanilla CSS avanzado, diseño *glassmorphism*.
- **Objetivo:** Informar sobre el propósito de Nexo-Comuna y dirigir a los jóvenes a interactuar con el bot de Telegram.

Para visualizar la landing page, simplemente abre el archivo `landing/index.html` en tu navegador.

## 2. Dashboard (`/dashboard`)

El panel administrativo es utilizado por los coordinadores del proyecto para visualizar y analizar en tiempo real la información recopilada por CamelloBot (CVs generados, oportunidades disponibles, ubicaciones, métricas de retención, etc).

- **Tecnología:** React.js, Vite, integración nativa con Supabase.
- **Ejecución Local:**
  ```bash
  cd dashboard
  npm install
  npm run dev
  ```
- **Variables de Entorno:**
  Debes copiar el `.env.example` a `.env` y configurar tus credenciales de Supabase.

## Despliegue

Cada componente está diseñado para ser desplegado de manera independiente:
- **Landing Page:** Puede ser hospedada en GitHub Pages, Vercel o Netlify de manera estática sirviendo la carpeta `/landing`.
- **Dashboard:** Se recomienda hacer el build (`npm run build`) y hospedar la carpeta `/dashboard/dist` en Vercel, Netlify o Render (configurando un SPA).

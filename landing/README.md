# Nexo-Comuna — Landing Page (Comuna 1 - Popular)

> **"Tu oportunidad está en tu barrio"**  
> Landing page oficial de Nexo-Comuna: conecta a los habitantes de la **Comuna 1 - Popular** de Medellín con empleos reales, programas del ITM y servicios locales — todo desde Telegram.

---

## 🌐 Demo en vivo

> _URL de producción: se actualizará tras el primer deploy en Vercel._

---

## 📋 Descripción del proyecto

**Nexo-Comuna** es un ecosistema de impacto social que busca cerrar la brecha de información entre los habitantes de la **Comuna 1 - Popular** de Medellín y las oportunidades reales de empleo y formación disponibles en su entorno.

Esta landing page es el punto de entrada público al proyecto. Su propósito es:

- Explicar claramente el problema que resuelve Nexo-Comuna en la C1.
- Presentar las tres capas del ecosistema (Camell0bot, Admin Dashboard, Red Comunitaria).
- Invitar a los usuarios de la C1 a unirse a la **lista de espera** antes del lanzamiento.
- Dirigir al bot de Telegram **@Camello_c1_bot** para quienes quieran empezar ya.

---

## 🗂️ Estructura del proyecto

```
nexo-comuna-landing/
└── index.html        # Toda la aplicación: HTML + CSS + JS en un único archivo
```

El proyecto es intencionalmente **un archivo único** (`index.html`) para maximizar la portabilidad, velocidad de carga y simplicidad de despliegue. No requiere bundler, framework ni dependencias de npm.

---

## ✨ Características técnicas

| Aspecto | Detalle |
|---|---|
| **Stack** | HTML5 semántico · Vanilla CSS · Vanilla JS |
| **Fuentes** | [Syne](https://fonts.google.com/specimen/Syne) (display) + [Inter](https://fonts.google.com/specimen/Inter) (body) vía Google Fonts |
| **Íconos / ilustraciones** | SVG inline personalizados — sin dependencias externas |
| **Animaciones** | CSS keyframes + `IntersectionObserver` para scroll-reveal |
| **Responsive** | Mobile-first con breakpoints en `520px`, `600px`, `640px`, `680px` y `768px` |
| **Sin JS requerido para leer** | El contenido es legible sin JS; JS solo potencia modal y animaciones |
| **Accesibilidad** | `aria-label`, `role="dialog"`, `aria-modal`, focus trap en modal, cierre con `Escape` |
| **SEO** | `<title>` descriptivo, `<meta name="description">`, jerarquía de encabezados `h1 → h2 → h3`, semántica HTML5 |
| **Performance** | Cero dependencias de runtime, `preconnect` a Google Fonts, SVGs inline (sin peticiones extra) |

---

## 🏗️ Secciones de la página

### 1. `#hero` — Encabezado principal
- Badge "Comuna 1 - Popular · Únete a la lista de espera"
- Título principal con tipografía Syne 800 y subrayado decorativo
- Subtítulo con la propuesta de valor enfocada en la C1
- CTA primario (abre modal de lista de espera) + CTA secundario (scroll a cómo funciona)
- Ilustración SVG de Camell0bot con animación de flotación

### 2. `#problema` — El problema
- 3 tarjetas estadísticas con datos estimados de la Comuna 1 - Popular:
  - **63 %** de jóvenes de la C1 consiguió empleo por voz a voz
  - **38 %** de desempleo juvenil en la C1
  - **9 de 10** habitantes de la C1 accede a internet solo desde el celular

### 3. `#solucion` — La solución
- Grid de 3 capas del ecosistema:
  - **01 · Camell0bot** — Bot de Telegram como canal de acceso para la C1
  - **02 · Admin Dashboard** — Panel de datos para líderes comunitarios de la C1
  - **03 · Red Comunitaria** — Alianzas con empresas e instituciones

### 4. `#para-quien` — ¿Para quién es?
- Dos perfiles de usuario:
  - **El habitante de la Comuna 1** (ej: Santo Domingo Savio, Carpinelo) — busca empleo y formación
  - **El líder comunitario de la C1** (tarjeta destacada) — necesita datos de los 11 barrios para gestionar

### 5. `#como-funciona` — Cómo funciona
- 4 pasos numerados con burbujas de chat simuladas:
  1. Abrir `@Camello_c1_bot` en Telegram
  2. Decirle qué buscás
  3. Recibir oportunidades verificadas
  4. Generar el CV con IA (feature plus)

### 6. `#cta-final` — CTA final
- Sección en fondo blanco (contraste inverso)
- Label: "¿Vives en la Comuna 1?"
- Botón para unirse a la lista de espera
- Botón de acceso directo a Telegram

### 7. Footer
- Brand + tagline enfocado en la C1
- Links a redes sociales (Instagram, Telegram, LinkedIn)
- Navegación interna rápida
- Badge "Participante de Territorio Inn"

### Modal — Lista de espera
- Formulario con 3 campos: **nombre**, **barrio (de la C1)**, **teléfono**
- Dropdown con los 11 barrios de la Comuna 1 - Popular:
  - Santo Domingo Savio No. 1 y No. 2
  - Popular No. 1 y No. 2
  - Granizal, Moscú No. 2, Villa Guadalupe
  - San Pablo, El Compromiso, La Avanzada, Carpinelo
- Validación inline en cliente (nombre requerido, barrio requerido, teléfono colombiano válido)
- Envío a **Supabase** en tiempo real
- Estado de éxito animado tras envío
- Cierre con clic fuera del modal o tecla `Escape`
- Accesible con `role="dialog"` y `aria-modal="true"`

---

## 🎨 Sistema de diseño

### Paleta de colores (tokens CSS)

```css
--black:   #0a0a0a   /* Fondo principal */
--gray-90: #141414   /* Fondo de secciones alternas */
--gray-80: #1f1f1f   /* Tarjetas */
--gray-70: #2e2e2e   /* Bordes */
--gray-60: #444      /* Acentos / bordes hover */
--gray-40: #888      /* Texto secundario */
--gray-20: #c8c8c8   /* Texto principal secundario */
--gray-10: #e8e8e8   /* Hover en botones claros */
--white:   #f5f5f5   /* Texto principal / fondo CTA */
```

### Tipografía

| Clase | Fuente | Tamaño (clamp) | Uso |
|---|---|---|---|
| `.display-xl` | Syne 800 | `2.4rem → 5.5rem` | Título hero |
| `.display-lg` | Syne 700 | `1.8rem → 3.5rem` | Títulos de sección |
| `.display-md` | Syne 700 | `1.3rem → 2rem` | Subtítulos |
| `.body-lg` | Inter 400 | `1rem → 1.2rem` | Párrafos principales |
| `.body-sm` | Inter 400 | `0.9rem` | Texto auxiliar |
| `.label` | Inter 600 | `0.75rem` | Etiquetas de sección |

### Animaciones

| Nombre | Descripción |
|---|---|
| `camel-float` | Flotación vertical suave del SVG de Camell0bot (4 s, infinite) |
| `pulse-dot` | Pulso del indicador de estado en el badge del hero |
| `fade-in` | Entrada del overlay del modal |
| `slide-up` | Entrada del contenido del modal (spring cubic-bezier) |
| `.reveal` + IntersectionObserver | Scroll reveal: opacidad + translateY para todos los elementos con clase `.reveal` |

---

## 🚀 Deploy en Vercel

### Opción A — Deploy directo desde GitHub (recomendado)

1. Asegúrate de que el repositorio esté en GitHub (`Stivendor/landing-territorio-inn-c1`).
2. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New → Project"**.
4. Selecciona el repositorio `landing-territorio-inn-c1`.
5. En la configuración del proyecto:
   - **Framework Preset:** `Other` (no es un framework)
   - **Root Directory:** `./` (raíz del repo)
   - **Build Command:** _(dejar vacío)_
   - **Output Directory:** `./` (o dejar en blanco)
6. Haz clic en **"Deploy"**.

Vercel detectará automáticamente el `index.html` y lo servirá como sitio estático. ✅

### Opción B — Deploy con Vercel CLI

```bash
# Instalar Vercel CLI globalmente (si no la tenés)
npm i -g vercel

# Desde la carpeta del proyecto
vercel

# Para producción
vercel --prod
```

### Configuración recomendada (opcional)

Si querés tener control sobre headers HTTP, crea un archivo `vercel.json` en la raíz:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Dominio personalizado

1. En el dashboard de Vercel, ve a tu proyecto → **Settings → Domains**.
2. Agrega tu dominio (ej: `nexo-comuna.co`).
3. Configura los registros DNS según las instrucciones de Vercel.

---

## 🔌 Integración del formulario

El modal de lista de espera actualmente envía los datos a **Supabase** en tiempo real. La tabla `waitlist` usa la siguiente estructura:

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  barrio text not null,
  telefono text not null,
  created_at timestamptz default now()
);
```

Los datos se insertan mediante la API REST de Supabase con la anon key configurada en el `<script>`.

---

## 🛠️ Desarrollo local

No requiere instalación de dependencias. Solo abre el archivo en un navegador:

```bash
# Con VS Code + Live Server
# Click derecho en index.html → "Open with Live Server"

# O con cualquier servidor HTTP simple
npx serve .

# O con Python
python -m http.server 3000
```

---

## 📁 Archivos del proyecto

```
landing-territorio-inn-c1/
├── index.html              ✅ Listo
├── README.md               ✅ Listo
├── camello.svg             ✅ Logo de Camell0bot
├── vercel.json             ⬜ Opcional — headers de seguridad
├── favicon.ico             ⬜ Pendiente — ícono del sitio
└── og-image.png            ⬜ Pendiente — imagen para Open Graph
```

---

## 🤝 Ecosistema Nexo-Comuna

Este repositorio es solo la landing page. El ecosistema completo incluye:

| Componente | Repositorio | Estado |
|---|---|---|
| **Landing Page** | `landing-territorio-inn-c1` (este repo) | 🟡 En construcción |
| **CamelloBot (C1)** | — | 🟡 En desarrollo |
| **Admin Dashboard** | [`dashboard-territorio-inn-c1-`](https://github.com/Stivendor/dashboard-territorio-inn-c1-) | 🟡 En desarrollo |

---

## 📄 Licencia

© 2025 Nexo-Comuna · Comuna 1 - Popular, Medellín, Colombia.  
Proyecto de impacto social — participante de **Territorio Inn**.

---

_Construido con ❤️ para la Comuna 1 - Popular de Medellín._

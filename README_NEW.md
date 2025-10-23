# 🚀 FarchoDev Blog

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-green.svg)](CHANGELOG.md)

> **Plataforma moderna de blogging** para desarrollo de software con sistema de autenticación completo (JWT + OAuth), features sociales interactivas, panel de administración avanzado y más. Construida con FastAPI, React 19 y MongoDB.

**[📖 Documentación Completa](DOCS.md) | [🔐 Guía de Autenticación](AUTH_GUIDE.md) | [👨‍💼 Setup Admin](ADMIN_SETUP.md) | [📝 Changelog](CHANGELOG.md)**

---

## 📖 Tabla de Contenidos

- [✨ Características Principales](#-características-principales)
- [🛠 Stack Tecnológico](#-stack-tecnológico)
- [🚀 Inicio Rápido (5 min)](#-inicio-rápido-5-min)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔌 API Endpoints](#-api-endpoints)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [📚 Documentación](#-documentación)
- [❓ FAQ](#-faq)
- [🐛 Solución de Problemas](#-solución-de-problemas)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

---

## ✨ Características Principales

### 🔐 **Sistema de Autenticación Multimétodo**
- ✅ **JWT Local**: Autenticación tradicional con email/contraseña + bcrypt hashing
- ✅ **Google OAuth**: Login rápido con cuenta de Google (via Emergent Auth)
- ✅ **GitHub OAuth**: Autenticación con GitHub para desarrolladores
- ✅ **Gestión de Sesiones**: Cookies HttpOnly seguras con expiración de 7 días
- ✅ **Middleware de Autorización**: Protección basada en roles (admin/user)
- ✅ **Perfil de Usuario**: Dashboard personal con actividad completa

### 👥 **Features para Usuarios Autenticados**
- ❤️ **Sistema de Likes**: Dale like a posts y ve contadores en tiempo real
- 🔖 **Bookmarks**: Guarda artículos para leer después en tu perfil
- 💬 **Comentarios Mejorados**: 
  - Comentar posts (aprobación automática para users autenticados)
  - Editar y eliminar tus propios comentarios
  - Ver historial completo de comentarios
- 👤 **Perfil de Usuario**:
  - Gestiona tu información personal (bio, social links)
  - Ve tu actividad (likes, bookmarks, comentarios)
  - Edita tu perfil y preferencias
- 📊 **Dashboard Personal**: Estadísticas de tu actividad en el blog

### 📝 **Para Visitantes Públicos**
- 📚 **Blog Navegable**: Lee todos los artículos sin necesidad de login
- 🔍 **Búsqueda Avanzada**: Filtra por categorías, tags, o búsqueda de texto
- 📧 **Newsletter**: Suscríbete para recibir nuevos posts
- 👀 **Métricas de Lectura**: Contador de vistas y tiempo estimado de lectura
- 📱 **Responsive Design**: Experiencia optimizada en móvil, tablet y desktop
- 🌙 **UI Moderna**: Diseño limpio con Tailwind CSS

### 👨‍💼 **Panel de Administración**
- 📊 **Dashboard con Estadísticas**:
  - Total de posts (publicados/drafts)
  - Comentarios (aprobados/pendientes)
  - Usuarios registrados
  - Suscriptores al newsletter
  - Total de vistas
- ✍️ **Editor de Posts**:
  - Crear/editar posts con vista previa
  - Soporte Markdown
  - Gestión de featured images
  - Tags y categorías
  - Publicar/despublicar con un click
- 🏷️ **Gestión de Categorías**: Crear, editar y eliminar categorías
- ✅ **Moderación de Comentarios**: Aprobar o eliminar comentarios
- 👥 **Gestión de Usuarios**: Ver lista de usuarios y suscriptores
- 🔐 **Acceso Protegido**: Solo usuarios con role='admin' pueden acceder

---

## 🛠 Stack Tecnológico

### **Backend**
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **FastAPI** | 0.110.1 | Framework web async de alto rendimiento |
| **PyJWT** | 2.10.1+ | Generación y validación de JWT tokens |
| **Bcrypt** | 4.1.3 | Hashing seguro de passwords |
| **Passlib** | 1.7.4+ | Utilidades de password hashing |
| **MongoDB** | 4.4+ | Base de datos NoSQL |
| **Motor** | 3.3.1 | Driver async de MongoDB |
| **Pydantic** | 2.6.4+ | Validación de datos con type hints |
| **Uvicorn** | 0.25.0 | Servidor ASGI |
| **httpx** | 0.28.0+ | Cliente HTTP async (para OAuth) |
| **emergentintegrations** | 0.1.0+ | Integración con Emergent Auth (Google) |

### **Frontend**
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | UI library |
| **React Router DOM** | 7.5.1 | Routing SPA |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Radix UI** | Latest | Componentes UI accesibles |
| **Axios** | 1.8.4 | HTTP client con interceptors |
| **Lucide React** | 0.507.0 | Iconos modernos |
| **Sonner** | 2.0.3 | Toast notifications |
| **React Context API** | - | State management global |

---

## 🚀 Inicio Rápido (5 min)

### **Requisitos Previos**
Asegúrate de tener instalado:
- **Node.js** v16+ ([Descargar](https://nodejs.org/))
- **Python** 3.9+ ([Descargar](https://www.python.org/))
- **MongoDB** 4.4+ ([Descargar](https://www.mongodb.com/try/download/community))
- **Yarn** 1.22+ (`npm install -g yarn`)

### **Instalación Paso a Paso**

#### **1️⃣ Clonar el Repositorio**
```bash
git clone <repository-url>
cd app
```

#### **2️⃣ Configurar Backend**
```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

**Crear archivo `.env` en `/backend/.env`:**
```bash
# Base de datos
MONGO_URL="mongodb://localhost:27017"
DB_NAME="farchodev_blog"
CORS_ORIGINS="http://localhost:3000"

# JWT Secret (CAMBIA ESTO EN PRODUCCIÓN)
JWT_SECRET_KEY="tu-clave-secreta-super-segura-cambiar-en-produccion"

# GitHub OAuth (Opcional - deja vacío por ahora)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_REDIRECT_URI=""
```

#### **3️⃣ Configurar Frontend**
```bash
cd ../frontend

# Instalar dependencias
yarn install
```

**Crear archivo `.env` en `/frontend/.env`:**
```bash
REACT_APP_BACKEND_URL="http://localhost:8001"
```

#### **4️⃣ Iniciar MongoDB**
```bash
# En una terminal separada
mongod

# O si usas macOS con Homebrew:
brew services start mongodb-community
```

#### **5️⃣ Ejecutar la Aplicación**

**Terminal 1 - Backend (FastAPI):**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```
✅ Backend corriendo en: `http://localhost:8001`
📄 API Docs: `http://localhost:8001/docs`

**Terminal 2 - Frontend (React):**
```bash
cd frontend
yarn start
```
✅ Frontend corriendo en: `http://localhost:3000`

#### **6️⃣ Crear tu Usuario Administrador**

1. **Registra un usuario** desde la UI en `http://localhost:3000`
2. **Actualiza el rol a admin** en MongoDB:

```javascript
// Abre la consola de MongoDB
mongosh

// Selecciona la base de datos
use farchodev_blog

// Actualiza el rol del usuario
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)

// Verifica el cambio
db.users.findOne({ email: "tu-email@ejemplo.com" })
```

3. **Refresca el navegador** y accede al panel admin en `/admin`

🎉 **¡Listo!** Ahora puedes:
- ✍️ Crear posts como admin
- 📝 Comentar y dar likes como usuario
- 🔐 Probar los diferentes métodos de autenticación

---

## 📁 Estructura del Proyecto

```
app/
├── backend/                      # 🐍 Backend FastAPI
│   ├── server.py                # App principal con todos los endpoints
│   ├── auth.py                  # ⭐ Sistema de autenticación completo
│   ├── features.py              # ⭐ Models de likes, bookmarks, etc.
│   ├── requirements.txt         # Dependencias Python
│   └── .env                     # Variables de entorno (crear)
│
├── frontend/                     # ⚛️ Frontend React
│   ├── public/                  # Archivos estáticos
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── ui/             # Componentes Radix UI
│   │   │   ├── AdminLayout.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── NewsletterBox.js
│   │   │   └── PostCard.js
│   │   │
│   │   ├── pages/              # Páginas de la aplicación
│   │   │   ├── admin/         # 👨‍💼 Panel de administración
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Posts.js
│   │   │   │   ├── PostEditor.js
│   │   │   │   ├── Categories.js
│   │   │   │   ├── Comments.js
│   │   │   │   └── Newsletter.js
│   │   │   │
│   │   │   ├── Home.js        # Landing page
│   │   │   ├── Blog.js        # Lista de posts
│   │   │   ├── PostDetail.js  # Detalle de post
│   │   │   ├── Category.js    # Posts por categoría
│   │   │   └── About.js       # Acerca de
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   └── use-toast.js
│   │   │
│   │   ├── lib/               # Utilidades
│   │   │   └── utils.js
│   │   │
│   │   ├── App.js             # Componente raíz
│   │   └── index.js           # Entry point
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                    # Variables de entorno (crear)
│
├── tests/                       # 🧪 Tests (futuro)
│
├── 📚 Documentación
├── README.md                    # Este archivo
├── DOCS.md                      # ⭐ Documentación técnica completa
├── AUTH_GUIDE.md                # 🔐 Guía detallada de autenticación
├── ADMIN_SETUP.md               # 👨‍💼 Setup del panel admin
├── CHANGELOG.md                 # 📝 Historial de cambios
└── SETUP_WINDOWS.md             # 🪟 Guía específica para Windows
```

---

## 🔌 API Endpoints

### **Autenticación** (`/api/auth`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Registrar nuevo usuario | ❌ |
| `POST` | `/auth/login` | Login con email/password | ❌ |
| `POST` | `/auth/logout` | Cerrar sesión | ✅ |
| `GET` | `/auth/me` | Obtener usuario actual | ✅ |
| `GET` | `/auth/google/login` | Iniciar OAuth con Google | ❌ |
| `POST` | `/auth/google/callback` | Callback de Google OAuth | ❌ |
| `GET` | `/auth/github/login` | Iniciar OAuth con GitHub | ❌ |
| `GET` | `/auth/github/callback` | Callback de GitHub OAuth | ❌ |

### **Posts Públicos** (`/api/posts`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/posts` | Listar posts publicados | ❌ |
| `GET` | `/posts/{slug}` | Obtener post por slug | ❌ |
| `POST` | `/posts/{post_id}/view` | Incrementar vistas | ❌ |
| `GET` | `/posts/{post_id}/likes` | Ver likes de un post | ❌ |
| `POST` | `/posts/{post_id}/like` | Dar like a un post | ✅ |
| `DELETE` | `/posts/{post_id}/like` | Quitar like | ✅ |
| `GET` | `/posts/{post_id}/bookmark-status` | Ver si está guardado | ✅ |

### **Bookmarks** (`/api/bookmarks`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/bookmarks?post_id={id}` | Guardar post | ✅ |
| `GET` | `/bookmarks` | Listar bookmarks | ✅ |
| `DELETE` | `/bookmarks/{post_id}` | Eliminar bookmark | ✅ |

### **Comentarios** (`/api/comments`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/posts/{post_id}/comments` | Ver comentarios de un post | ❌ |
| `POST` | `/comments` | Crear comentario | ✅ |
| `PUT` | `/comments/{comment_id}` | Editar propio comentario | ✅ |
| `DELETE` | `/comments/{comment_id}` | Eliminar propio comentario | ✅ |

### **Perfil de Usuario** (`/api/users`)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/profile` | Ver perfil propio | ✅ |
| `PUT` | `/users/profile` | Actualizar perfil | ✅ |
| `GET` | `/users/activity` | Ver actividad propia | ✅ |

### **Admin - Posts** (`/api/admin/posts`) 👨‍💼
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/posts` | Listar todos los posts | Admin |
| `POST` | `/admin/posts` | Crear nuevo post | Admin |
| `PUT` | `/admin/posts/{post_id}` | Actualizar post | Admin |
| `DELETE` | `/admin/posts/{post_id}` | Eliminar post | Admin |

### **Admin - Categorías** (`/api/admin/categories`) 👨‍💼
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories` | Listar categorías | ❌ |
| `POST` | `/admin/categories` | Crear categoría | Admin |
| `PUT` | `/admin/categories/{id}` | Actualizar categoría | Admin |
| `DELETE` | `/admin/categories/{id}` | Eliminar categoría | Admin |

### **Admin - Comentarios** (`/api/admin/comments`) 👨‍💼
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/comments` | Listar todos los comentarios | Admin |
| `PUT` | `/admin/comments/{id}/approve` | Aprobar comentario | Admin |
| `DELETE` | `/admin/comments/{id}` | Eliminar comentario | Admin |

### **Admin - Estadísticas** (`/api/admin/stats`) 👨‍💼
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/stats` | Dashboard con estadísticas | Admin |

📖 **Documentación interactiva completa**: `http://localhost:8001/docs` (cuando el backend esté corriendo)

---

## 🔐 Sistema de Autenticación

### **Flujo de Autenticación JWT**

```
┌──────────┐          ┌─────────────┐          ┌──────────┐
│ Frontend │          │   Backend   │          │ MongoDB  │
└────┬─────┘          └──────┬──────┘          └────┬─────┘
     │                       │                       │
     │ 1. POST /auth/register                        │
     │    {email, password, name}                    │
     │──────────────────────>│                       │
     │                       │                       │
     │                       │ 2. Hash password      │
     │                       │    (bcrypt)           │
     │                       │                       │
     │                       │ 3. INSERT user        │
     │                       │──────────────────────>│
     │                       │<──────────────────────│
     │                       │                       │
     │                       │ 4. Generate JWT       │
     │                       │    (expires 7 days)   │
     │                       │                       │
     │ 5. Set-Cookie: session_token (HttpOnly)       │
     │<──────────────────────│                       │
     │    {user, token}      │                       │
     │                       │                       │
     │ 6. GET /api/admin/posts                       │
     │    Cookie: session_token                      │
     │──────────────────────>│                       │
     │                       │                       │
     │                       │ 7. Verify JWT         │
     │                       │    Check role='admin' │
     │                       │                       │
     │                       │ 8. SELECT posts       │
     │                       │──────────────────────>│
     │                       │<──────────────────────│
     │                       │                       │
     │ 9. {posts: [...]}     │                       │
     │<──────────────────────│                       │
```

### **Características de Seguridad Implementadas**

| Feature | Implementación |
|---------|---------------|
| **Password Hashing** | ✅ Bcrypt con salt automático |
| **JWT Tokens** | ✅ Firmados con secret key + expiración 7 días |
| **HttpOnly Cookies** | ✅ Tokens almacenados en cookies seguras (protección XSS) |
| **SameSite Cookie** | ✅ Configurado como 'none' para CORS |
| **CORS** | ✅ Orígenes permitidos explícitamente |
| **Role-Based Access** | ✅ Middleware verifica role='admin' |
| **Input Validation** | ✅ Pydantic valida todos los inputs |
| **Session Management** | ✅ Sesiones persistentes en MongoDB (OAuth) |
| **Token Refresh** | ✅ Tokens de larga duración (7 días) |

### **Métodos de Autenticación Soportados**

1. **JWT Local** ✅
   - Email + Password
   - Registro y login tradicional
   - Tokens JWT firmados

2. **Google OAuth** ✅
   - Via Emergent Auth
   - Sin necesidad de client_id/secret
   - Session token de 7 días

3. **GitHub OAuth** ✅
   - Requiere GitHub OAuth App
   - Access token exchange
   - Obtiene email primario del usuario

📖 Para detalles completos, consulta [AUTH_GUIDE.md](AUTH_GUIDE.md)

---

## 📚 Documentación

Esta aplicación cuenta con documentación completa y actualizada:

| Documento | Descripción | Cuándo usarlo |
|-----------|-------------|---------------|
| **[DOCS.md](DOCS.md)** | 📘 Documentación técnica completa | Desarrollo, arquitectura, API reference |
| **[AUTH_GUIDE.md](AUTH_GUIDE.md)** | 🔐 Guía del sistema de autenticación | Implementar auth, entender flujos OAuth |
| **[ADMIN_SETUP.md](ADMIN_SETUP.md)** | 👨‍💼 Configuración del panel admin | Setup inicial, crear usuarios admin |
| **[CHANGELOG.md](CHANGELOG.md)** | 📝 Historial de cambios | Ver qué cambió en cada versión |
| **[SETUP_WINDOWS.md](SETUP_WINDOWS.md)** | 🪟 Guía específica Windows | Si estás en Windows |

---

## ❓ FAQ

<details>
<summary><b>¿Cómo creo un usuario administrador?</b></summary>

1. Registra un usuario normal desde la UI
2. Conéctate a MongoDB y ejecuta:
```javascript
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)
```
3. Refresca el navegador

O consulta [ADMIN_SETUP.md](ADMIN_SETUP.md) para métodos alternativos.
</details>

<details>
<summary><b>¿Cómo configuro GitHub OAuth?</b></summary>

1. Crea una GitHub OAuth App en [GitHub Developer Settings](https://github.com/settings/developers)
2. Configura el callback URL: `http://localhost:3000/auth/github/callback`
3. Agrega las credenciales en `/backend/.env`:
```bash
GITHUB_CLIENT_ID="tu_client_id"
GITHUB_CLIENT_SECRET="tu_client_secret"
GITHUB_REDIRECT_URI="http://localhost:3000/auth/github/callback"
```
4. Reinicia el backend

Consulta [AUTH_GUIDE.md](AUTH_GUIDE.md) para detalles.
</details>

<details>
<summary><b>¿Por qué las rutas admin me redirigen al login?</b></summary>

Las rutas `/admin/*` están protegidas. Asegúrate de:
1. Estar autenticado (tener un token válido)
2. Tener el rol `admin` en tu usuario de MongoDB
3. El token no haya expirado (7 días)

Verifica en MongoDB:
```javascript
db.users.findOne({ email: "tu-email@ejemplo.com" })
```
</details>

<details>
<summary><b>¿Cómo funciona Google OAuth sin configurar credenciales?</b></summary>

Usamos **Emergent Auth**, un servicio que maneja Google OAuth por ti:
- No necesitas crear OAuth app en Google Cloud
- Solo llamas a `https://auth.emergentagent.com`
- Recibes un session_token listo para usar

Consulta [AUTH_GUIDE.md](AUTH_GUIDE.md) para el flujo completo.
</details>

<details>
<summary><b>¿Puedo usar PostgreSQL en lugar de MongoDB?</b></summary>

No directamente. La aplicación está diseñada para MongoDB (NoSQL).
Para usar PostgreSQL necesitarías:
1. Reescribir todos los modelos para SQLAlchemy
2. Cambiar el cliente de Motor a asyncpg
3. Adaptar las queries

Si necesitas SQL, considera empezar un fork del proyecto.
</details>

<details>
<summary><b>¿Cómo cambio el puerto del backend?</b></summary>

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8080
```

Y actualiza `REACT_APP_BACKEND_URL` en `/frontend/.env`:
```bash
REACT_APP_BACKEND_URL="http://localhost:8080"
```
</details>

<details>
<summary><b>¿Hay límite de usuarios o posts?</b></summary>

No hay límites programáticos. Los límites dependen de:
- Recursos de tu servidor
- Capacidad de MongoDB
- Configuración de conexiones (default: sin límite)

Para producción, considera agregar paginación en los endpoints.
</details>

---

## 🐛 Solución de Problemas

### **Problema: Backend no inicia**

```bash
ERROR: No module named 'fastapi'
```

**Solución:**
```bash
# Asegúrate de estar en el entorno virtual
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

---

### **Problema: MongoDB connection refused**

```bash
pymongo.errors.ServerSelectionTimeoutError
```

**Solución:**
```bash
# Verifica que MongoDB esté corriendo
ps aux | grep mongod

# Si no está corriendo, inícialo
mongod

# O con Homebrew (macOS)
brew services start mongodb-community
```

---

### **Problema: CORS errors en el frontend**

```
Access to fetch at 'http://localhost:8001/api/...' has been blocked by CORS policy
```

**Solución:**
Verifica en `/backend/.env`:
```bash
CORS_ORIGINS="http://localhost:3000"
```

Y reinicia el backend.

---

### **Problema: Login no persiste (se pierde al refrescar)**

**Solución:**
1. Verifica que las cookies estén habilitadas en tu navegador
2. Asegúrate de que Axios esté configurado con `withCredentials: true`
3. Verifica que el backend use cookies HttpOnly:
```python
response.set_cookie(
    key="session_token",
    value=token,
    httponly=True,
    secure=True,  # ⚠️ Requiere HTTPS en producción
    samesite="none"
)
```

---

### **Problema: "Invalid authentication credentials"**

**Causas comunes:**
1. Token expirado (7 días)
2. JWT_SECRET_KEY cambió entre backend y token
3. Cookie no se envía en la request

**Solución:**
1. Logout y login de nuevo
2. Verifica que `JWT_SECRET_KEY` en `.env` no haya cambiado
3. Inspecciona las cookies en DevTools > Application > Cookies

---

Para más problemas, consulta [DOCS.md](DOCS.md) o abre un issue en GitHub.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar el proyecto:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m "feat: agregar nueva feature"
   ```
4. **Push** a tu fork:
   ```bash
   git push origin feature/mi-nueva-feature
   ```
5. **Abre un Pull Request** describiendo tus cambios

### **Guidelines de Contribución**

- Sigue el estilo de código existente
- Escribe mensajes de commit descriptivos
- Actualiza la documentación si es necesario
- Agrega tests para nuevas features (cuando sea posible)
- Verifica que no rompas funcionalidad existente

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 FarchoDev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Agradecimientos

- **FastAPI** - Framework increíble para APIs modernas
- **React Team** - Por React 19 con mejoras de rendimiento
- **Tailwind CSS** - Por hacer el styling tan fácil
- **Emergent Auth** - Por simplificar Google OAuth
- **MongoDB** - Por una base de datos flexible y escalable

---

## 📮 Contacto

- **Autor**: FarchoDev
- **Email**: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- **GitHub**: [@farchodev](https://github.com/farchodev)
- **Twitter**: [@farchodev](https://twitter.com/farchodev)

---

<div align="center">
  
**⭐ Si te gustó este proyecto, dale una estrella en GitHub**

Made with ❤️ by FarchoDev

[⬆ Volver arriba](#-farchodev-blog)

</div>

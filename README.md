# 🚀 FarchoDev Blog - Blog de Desarrollo de Software

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

> Plataforma completa de blog especializada en desarrollo de software con sistema de autenticación robusto, construida con FastAPI, React y MongoDB.

## 📖 Índice

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Completa](#-documentación-completa)
- [API Endpoints](#-api-endpoints)
- [Solución de Problemas](#-solución-de-problemas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### 🔐 Sistema de Autenticación Completo
- **JWT Local**: Autenticación tradicional con email y contraseña
- **Google OAuth**: Login con cuenta de Google (Emergent Auth)
- **GitHub OAuth**: Autenticación con GitHub
- **Gestión de Sesiones**: Sesiones persistentes con cookies seguras
- **Protección de Rutas**: Middleware de autorización basado en roles
- **Perfil de Usuario**: Sistema completo de perfiles y actividad

### 👥 Para Usuarios Autenticados
- ❤️ **Sistema de Likes**: Dale like a tus posts favoritos
- 🔖 **Bookmarks**: Guarda artículos para leer después
- 💬 **Comentarios Mejorados**: Comenta, edita y elimina tus propios comentarios
- 👤 **Perfil de Usuario**: Gestiona tu información personal y actividad
- 📊 **Dashboard Personal**: Ve tu actividad (likes, bookmarks, comentarios)

### 📝 Para Usuarios Públicos
- 📚 Explorar artículos de desarrollo de software
- 🔍 Búsqueda y filtros por categorías y tags
- 📧 Suscripción a newsletter
- 👀 Contador de vistas y tiempo de lectura
- 📱 Diseño responsive y moderno

### 👨‍💼 Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- ✍️ Editor completo de posts con markdown
- 🏷️ Gestión de categorías (crear, editar, eliminar)
- ✅ Moderación de comentarios
- 👥 Gestión de suscriptores
- 🔄 Publicación/despublicación de posts
- 🔐 Protección de rutas con middleware de autorización

## 🛠 Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.110.1
- **Autenticación**: JWT (PyJWT), Bcrypt para hashing
- **OAuth**: Emergent Auth (Google), GitHub OAuth
- **Base de Datos**: MongoDB (Motor 3.3.1 - Async)
- **Validación**: Pydantic 2.6.4+
- **Servidor**: Uvicorn 0.25.0
- **CORS**: Configuración segura para desarrollo y producción

### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.5.1
- **Estilos**: Tailwind CSS 3.4.17
- **Componentes UI**: Radix UI
- **HTTP Client**: Axios 1.8.4 (configurado con credentials)
- **Iconos**: Lucide React 0.507.0
- **Notificaciones**: Sonner 2.0.3
- **State Management**: React Context API (AuthContext)

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js v16+
- Python 3.9+
- MongoDB 4.4+
- Yarn 1.22+

### Instalación

#### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd app
```

#### 2. Configurar Backend
```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

**Editar `/backend/.env`:**
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="farchodev_blog"
CORS_ORIGINS="http://localhost:3000"

# JWT Secret (cambia esto en producción)
JWT_SECRET_KEY="tu-clave-secreta-super-segura-aqui"

# Emails de administradores (separados por comas)
ADMIN_EMAILS="admin@ejemplo.com"

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_REDIRECT_URI=""
```

#### 3. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env
```

**Editar `/frontend/.env`:**
```bash
REACT_APP_BACKEND_URL="http://localhost:8001"
```

#### 4. Iniciar MongoDB
```bash
# En una terminal separada
mongod
```

#### 5. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

✅ Accede a la aplicación en `http://localhost:3000`

#### 6. Crear Usuario Administrador

1. Registra un usuario normal desde la UI
2. En MongoDB, actualiza el rol del usuario:
```javascript
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación JWT

```
┌────────────┐          ┌─────────────┐          ┌──────────┐
│  Frontend  │          │   Backend   │          │ MongoDB  │
└─────┬──────┘          └──────┬──────┘          └────┬─────┘
      │                        │                      │
      │ POST /auth/register    │                      │
      │ {email, password, name}│                      │
      │───────────────────────>│                      │
      │                        │                      │
      │                        │ Hash password (bcrypt)│
      │                        │ Generate JWT         │
      │                        │                      │
      │                        │ INSERT user          │
      │                        │─────────────────────>│
      │                        │                      │
      │ Set-Cookie: session_token (JWT)               │
      │<───────────────────────│                      │
      │ {user, token}          │                      │
      │                        │                      │
      │ GET /api/admin/posts   │                      │
      │ Cookie: session_token  │                      │
      │───────────────────────>│                      │
      │                        │                      │
      │                        │ Verify JWT           │
      │                        │ Check role='admin'   │
      │                        │                      │
      │                        │ SELECT posts         │
      │                        │─────────────────────>│
      │                        │                      │
      │ {posts: [...]}         │<─────────────────────│
      │<───────────────────────│                      │
```

### Características de Seguridad

- ✅ **Passwords Hasheados**: Bcrypt con salt automático
- ✅ **JWT Tokens**: Tokens firmados con expiración de 7 días
- ✅ **HttpOnly Cookies**: Tokens almacenados en cookies seguras
- ✅ **CORS Configurado**: Orígenes permitidos explícitamente
- ✅ **Middleware de Autorización**: Protección basada en roles
- ✅ **Validación de Datos**: Pydantic valida todos los inputs

## 📁 Estructura del Proyecto

```
app/
├── backend/                    # Backend FastAPI
│   ├── .env                   # Variables de entorno
│   ├── server.py              # App principal + Modelos
│   ├── auth.py                # Sistema de autenticación
│   ├── features.py            # Features (Likes, Bookmarks, etc)
│   └── requirements.txt       # Dependencias Python
│
├── frontend/                   # Frontend React
│   ├── public/                # Archivos estáticos
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── ui/           # Componentes Radix UI
│   │   │   ├── AdminLayout.js
│   │   │   ├── Footer.js
│   │   │   ├── LoginModal.js     # ⭐ Modal de login
│   │   │   ├── RegisterModal.js  # ⭐ Modal de registro
│   │   │   ├── ProtectedRoute.js # ⭐ HOC para rutas protegidas
│   │   │   ├── Navbar.js
│   │   │   ├── NewsletterBox.js
│   │   │   └── PostCard.js
│   │   │
│   │   ├── contexts/              # ⭐ React Context
│   │   │   └── AuthContext.js    # Context de autenticación
│   │   │
│   │   ├── utils/                 # ⭐ Utilidades
│   │   │   └── axios.js          # Axios configurado con credentials
│   │   │
│   │   ├── pages/                # Páginas de la app
│   │   │   ├── admin/           # Panel de administración
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Posts.js
│   │   │   │   ├── PostEditor.js
│   │   │   │   ├── Categories.js
│   │   │   │   ├── Comments.js
│   │   │   │   └── Newsletter.js
│   │   │   │
│   │   │   ├── Home.js
│   │   │   ├── Blog.js
│   │   │   ├── PostDetail.js
│   │   │   ├── Category.js
│   │   │   ├── About.js
│   │   │   └── UserProfile.js    # ⭐ Perfil de usuario
│   │   │
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── tests/                      # Tests del proyecto
├── DOCUMENTATION.md            # 📚 Documentación completa
├── AUTH_GUIDE.md               # 🔐 Guía de autenticación
├── TROUBLESHOOTING.md          # 🔧 Solución de problemas
└── README.md                   # Este archivo
```

## 📚 Documentación Completa

Para información detallada, consulta:

- **[📖 DOCUMENTATION_COMPLETE.md](./DOCUMENTATION_COMPLETE.md)** - 📘 Documentación técnica completa (NUEVA)
- **[📋 CHANGELOG.md](./CHANGELOG.md)** - 📝 Resumen completo de implementaciones (NUEVO)
- **[🔐 AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Guía del sistema de autenticación
- **[⚙️ ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Configuración del panel admin
- **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema
- **[🚀 QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Guía de inicio rápido

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registrar usuario | No |
| `POST` | `/api/auth/login` | Iniciar sesión | No |
| `POST` | `/api/auth/logout` | Cerrar sesión | Sí |
| `GET` | `/api/auth/me` | Obtener usuario actual | Sí |
| `GET` | `/api/auth/google/login` | Iniciar login con Google | No |
| `POST` | `/api/auth/google/callback` | Callback de Google OAuth | No |
| `GET` | `/api/auth/github/login` | Iniciar login con GitHub | No |
| `GET` | `/api/auth/github/callback` | Callback de GitHub OAuth | No |

### Posts

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/posts` | Listar posts publicados | No |
| `GET` | `/api/posts/{slug}` | Obtener post por slug | No |
| `POST` | `/api/posts/{id}/view` | Incrementar vistas | No |
| `POST` | `/api/posts/{id}/like` | Like a post | Sí |
| `DELETE` | `/api/posts/{id}/like` | Quitar like | Sí |
| `GET` | `/api/posts/{id}/likes` | Obtener info de likes | No |

### Categorías

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/categories` | Listar categorías | No |
| `POST` | `/api/admin/categories` | Crear categoría | Admin |
| `PUT` | `/api/admin/categories/{id}` | Actualizar categoría | Admin |
| `DELETE` | `/api/admin/categories/{id}` | Eliminar categoría | Admin |

### Comentarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/posts/{id}/comments` | Obtener comentarios | No |
| `POST` | `/api/comments` | Crear comentario (autenticado) | Sí |
| `POST` | `/api/comments/anonymous` | Crear comentario anónimo | No |
| `PUT` | `/api/comments/{id}` | Actualizar comentario | Sí |
| `DELETE` | `/api/comments/{id}` | Eliminar comentario | Sí |
| `GET` | `/api/admin/comments` | Listar todos los comentarios | Admin |
| `PUT` | `/api/admin/comments/{id}/approve` | Aprobar comentario | Admin |
| `DELETE` | `/api/admin/comments/{id}` | Eliminar comentario | Admin |

### Bookmarks

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/bookmarks` | Guardar post | Sí |
| `GET` | `/api/bookmarks` | Listar bookmarks | Sí |
| `DELETE` | `/api/bookmarks/{post_id}` | Eliminar bookmark | Sí |
| `GET` | `/api/posts/{id}/bookmark-status` | Verificar si está guardado | Sí |

### Perfil y Actividad

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users/profile` | Obtener perfil | Sí |
| `PUT` | `/api/users/profile` | Actualizar perfil | Sí |
| `GET` | `/api/users/activity` | Obtener actividad del usuario | Sí |

### Admin

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/stats` | Estadísticas del blog | Admin |
| `GET` | `/api/admin/posts` | Listar todos los posts | Admin |
| `POST` | `/api/admin/posts` | Crear post | Admin |
| `PUT` | `/api/admin/posts/{id}` | Actualizar post | Admin |
| `DELETE` | `/api/admin/posts/{id}` | Eliminar post | Admin |

Ver [DOCUMENTATION.md](./DOCUMENTATION.md#api-reference) para detalles completos y ejemplos.

## 🔧 Solución de Problemas

### Error 401 en Dashboard Admin

**Síntoma**: Al iniciar sesión como admin y acceder al dashboard, aparece error 401.

**Solución**:
1. Verifica que `CORS_ORIGINS` en `/backend/.env` esté configurado con tu origen:
   ```bash
   CORS_ORIGINS="http://localhost:3000"
   ```

2. Asegúrate de que axios esté configurado con `withCredentials: true`

3. Reinicia el backend:
   ```bash
   sudo supervisorctl restart backend
   ```

### Usuario no tiene rol de admin

**Síntoma**: Acceso denegado al panel admin.

**Solución**:
```javascript
// En MongoDB
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)
```

### Las cookies no se guardan

**Síntoma**: El usuario se desloguea al refrescar la página.

**Solución**:
- Verifica que el frontend y backend estén en el mismo dominio en producción
- En desarrollo, usa `localhost` (no `127.0.0.1`) para ambos servicios
- Verifica la configuración de CORS en el backend

Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para más problemas y soluciones.

## 🧪 Testing

### Backend
```bash
cd backend
pytest backend_test.py -v
```

### Frontend
```bash
cd frontend
yarn test
```

## 🚀 Despliegue

### Opción 1: VPS con Docker
```bash
docker-compose up -d
```

### Opción 2: Servicios Cloud
- **Backend**: Railway, Render, Fly.io
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas (recomendado)

**Configuración de producción**:

1. Actualiza CORS en backend:
```bash
CORS_ORIGINS="https://tu-dominio.com"
```

2. Actualiza URL del backend en frontend:
```bash
REACT_APP_BACKEND_URL="https://api.tu-dominio.com"
```

3. Cambia JWT_SECRET_KEY a un valor seguro y aleatorio

4. Configura MongoDB Atlas y actualiza MONGO_URL

Ver [DOCUMENTATION.md](./DOCUMENTATION.md#despliegue) para instrucciones detalladas.

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convención de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Formato/estilo
refactor: Refactorización
test: Tests
chore: Tareas de mantenimiento
```

## 🐛 Reportar Issues

Si encuentras un bug o tienes una sugerencia:
1. Verifica que no exista un issue similar
2. Crea un nuevo issue con descripción detallada
3. Incluye pasos para reproducir (si es un bug)

## 📝 Changelog

### v2.0.1 (Octubre 2025) - Bug Fixes
- 🐛 **Fix: Error 422 en endpoint de Bookmarks**
  - Corregido el endpoint `POST /api/bookmarks` que esperaba `post_id` como query parameter
  - Ahora recibe correctamente `post_id` en el body del request como JSON: `{"post_id": "id"}`
  - Agregado modelo `BookmarkCreate` para validación
- 🔧 **Dependencias actualizadas**
  - Agregado `httpx` para requests HTTP asíncronos en OAuth
  - Actualizados requirements.txt con todas las dependencias necesarias
- 📚 **Documentación actualizada**
  - Actualizado README con el fix reciente
  - Clarificado uso correcto del endpoint de bookmarks

### v2.0.0 (Enero 2025)
- ✅ **Sistema de autenticación completo**
  - JWT local con bcrypt
  - Google OAuth (Emergent Auth)
  - GitHub OAuth
- ✅ **Features interactivas**
  - Sistema de likes
  - Bookmarks (con fix de API en v2.0.1)
  - Comentarios mejorados (editar/eliminar)
- ✅ **Perfil de usuario**
  - Información personal
  - Dashboard de actividad
  - Gestión de bookmarks
- ✅ **Protección de rutas**
  - Middleware de autorización
  - Control basado en roles
- ✅ **Mejoras de seguridad**
  - CORS configurado correctamente
  - HttpOnly cookies
  - Validación de datos mejorada

### v1.0.0 (Julio 2024)
- ✅ Lanzamiento inicial
- ✅ CRUD completo de posts
- ✅ Sistema de categorías
- ✅ Sistema de comentarios
- ✅ Newsletter
- ✅ Dashboard de admin
- ✅ Diseño responsive

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo [LICENSE](./LICENSE) para más detalles.

## 👨‍💻 Autor

**FarchoDev**
- Website: [farchodev.com](https://farchodev.com)
- Email: farcho@farchodev.com
- GitHub: [@farchodev](https://github.com/farchodev)

## 🙏 Agradecimientos

- Comunidad de FastAPI
- Comunidad de React
- Emergent Auth por el sistema de OAuth
- Todos los contribuidores de código abierto

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub

**¿Necesitas ayuda?** Consulta la [documentación completa](./DOCUMENTATION.md) o abre un [issue](https://github.com/farchodev/blog/issues).

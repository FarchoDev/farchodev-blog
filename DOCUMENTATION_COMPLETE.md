# 📖 Documentación Técnica Completa - FarchoDev Blog

## 🎯 Descripción General del Proyecto

FarchoDev Blog es una plataforma completa de blogging especializada en desarrollo de software, construida con tecnologías modernas y un enfoque en la experiencia de usuario y seguridad. El proyecto incluye:

- **Sistema de autenticación robusto** con JWT local, Google OAuth y GitHub OAuth
- **Panel de administración completo** para gestión de contenido
- **Features sociales** para usuarios (likes, bookmarks, comentarios)
- **Sistema de perfiles** con actividad del usuario
- **Diseño responsive** y moderno con Tailwind CSS

---

## 📋 Tabla de Contenidos

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelos de Datos](#modelos-de-datos)
4. [API Reference Completa](#api-reference-completa)
5. [Sistema de Autenticación](#sistema-de-autenticación)
6. [Frontend Components](#frontend-components)
7. [Configuración de Desarrollo](#configuración-de-desarrollo)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🛠 Stack Tecnológico

### Backend Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Python** | 3.9+ | Lenguaje principal |
| **FastAPI** | 0.110.1 | Framework web async |
| **Pydantic** | 2.6.4+ | Validación de datos |
| **MongoDB** | 4.4+ | Base de datos NoSQL |
| **Motor** | 3.3.1 | Driver async para MongoDB |
| **PyJWT** | 2.8+ | JSON Web Tokens |
| **Bcrypt** | 4.0+ | Hashing de passwords |
| **Python-Multipart** | 0.0.6 | Manejo de formularios |
| **Httpx** | 0.24+ | Cliente HTTP async |
| **Uvicorn** | 0.25.0 | Servidor ASGI |

### Frontend Stack

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | UI Library |
| **React Router DOM** | 7.5.1 | Routing |
| **Tailwind CSS** | 3.4.17 | Styling framework |
| **Radix UI** | Latest | Componentes accesibles |
| **Axios** | 1.8.4 | HTTP client |
| **Lucide React** | 0.507.0 | Iconos |
| **Sonner** | 2.0.3 | Toast notifications |
| **date-fns** | 2.29+ | Manipulación de fechas |

### Herramientas de Desarrollo

- **Yarn** - Gestor de paquetes frontend
- **pip** - Gestor de paquetes Python
- **MongoDB Compass** - GUI para MongoDB
- **Postman/Insomnia** - Testing de API

---

## 🏗 Arquitectura del Sistema

### Estructura de Directorios

```
app/
│
├── backend/                          # Backend FastAPI
│   ├── .env                          # Variables de entorno (gitignored)
│   ├── requirements.txt              # Dependencias Python
│   ├── server.py                     # App principal + Modelos base
│   ├── auth.py                       # Sistema de autenticación
│   ├── features.py                   # Features sociales (likes, bookmarks)
│   ├── promote_admin.py              # Script para promover usuarios a admin
│   └── test_admin_system.py          # Test del sistema de admin
│
├── frontend/                         # Frontend React
│   ├── public/                       # Archivos estáticos
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── ui/                   # Radix UI components
│   │   │   │   ├── toast.jsx
│   │   │   │   ├── sonner.jsx
│   │   │   │   └── toaster.jsx
│   │   │   │
│   │   │   ├── AdminLayout.js        # Layout del panel admin
│   │   │   ├── Footer.js             # Footer del sitio
│   │   │   ├── LoginModal.js         # Modal de inicio de sesión
│   │   │   ├── RegisterModal.js      # Modal de registro
│   │   │   ├── Navbar.js             # Navegación principal
│   │   │   ├── NewsletterBox.js      # Formulario de newsletter
│   │   │   ├── PostCard.js           # Card de post
│   │   │   └── ProtectedRoute.js     # HOC para rutas protegidas
│   │   │
│   │   ├── contexts/                 # React Contexts
│   │   │   └── AuthContext.js        # Context de autenticación
│   │   │
│   │   ├── hooks/                    # Custom hooks
│   │   │   └── use-toast.js          # Hook para toasts
│   │   │
│   │   ├── lib/                      # Utilidades
│   │   │   └── utils.js              # Funciones auxiliares
│   │   │
│   │   ├── utils/                    # Configuraciones
│   │   │   └── axios.js              # Axios configurado
│   │   │
│   │   ├── pages/                    # Páginas de la aplicación
│   │   │   ├── admin/                # Páginas del panel admin
│   │   │   │   ├── Dashboard.js      # Dashboard principal
│   │   │   │   ├── Posts.js          # Listado de posts
│   │   │   │   ├── PostEditor.js     # Editor de posts
│   │   │   │   ├── Categories.js     # Gestión de categorías
│   │   │   │   ├── Comments.js       # Moderación de comentarios
│   │   │   │   └── Newsletter.js     # Gestión de suscriptores
│   │   │   │
│   │   │   ├── Home.js               # Página de inicio
│   │   │   ├── Blog.js               # Listado de posts
│   │   │   ├── PostDetail.js         # Detalle de post
│   │   │   ├── Category.js           # Posts por categoría
│   │   │   ├── About.js              # Página sobre nosotros
│   │   │   └── UserProfile.js        # Perfil de usuario
│   │   │
│   │   ├── App.css                   # Estilos globales
│   │   ├── App.js                    # Componente principal
│   │   ├── index.css                 # Estilos base + Tailwind
│   │   └── index.js                  # Entry point
│   │
│   ├── .env                          # Variables de entorno frontend
│   ├── package.json                  # Dependencias frontend
│   ├── tailwind.config.js            # Configuración de Tailwind
│   ├── craco.config.js               # Configuración de CRACO
│   └── jsconfig.json                 # Configuración de JavaScript
│
├── tests/                            # Tests del proyecto
│   ├── backend_test.py               # Tests backend
│   ├── backend_auth_test.py          # Tests de autenticación
│   └── backend_comments_test.py      # Tests de comentarios
│
├── DOCUMENTATION.md                  # Este archivo
├── README.md                         # Readme principal
├── ARCHITECTURE.md                   # Documentación de arquitectura
├── AUTH_GUIDE.md                     # Guía de autenticación
├── ADMIN_SETUP.md                    # Configuración de admin
├── QUICK_START_GUIDE.md              # Guía de inicio rápido
└── test_result.md                    # Historial de testing
```

### Diagrama de Arquitectura

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                          │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    React Application                          │ │
│  │                                                               │ │
│  │  • Pages (Home, Blog, PostDetail, Admin, Profile)           │ │
│  │  • Components (Navbar, Footer, Modals, Cards)               │ │
│  │  • Context (AuthContext - Estado global)                    │ │
│  │  • Axios (HTTP Client con withCredentials)                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────┬───────────────────────────────┘
                                     │
                        HTTP/REST API │ (JSON)
                        Prefix: /api  │
                                     │
┌────────────────────────────────────▼───────────────────────────────┐
│                     SERVIDOR (Backend)                             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    FastAPI Application                        │ │
│  │                                                               │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │  server.py - App principal                             │ │ │
│  │  │  • Modelos (Post, Category, Comment, Newsletter)      │ │ │
│  │  │  • Endpoints públicos (/posts, /categories)           │ │ │
│  │  │  • Endpoints admin (/admin/*)                         │ │ │
│  │  │  • CRUD completo de contenido                         │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │  auth.py - Sistema de autenticación                    │ │ │
│  │  │  • Modelos (User, Session, UserProfile)               │ │ │
│  │  │  • JWT Local (register, login, logout)                │ │ │
│  │  │  • Google OAuth (Emergent Auth)                       │ │ │
│  │  │  • GitHub OAuth                                        │ │ │
│  │  │  • Middleware (get_current_user, require_admin)       │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │  features.py - Features sociales                       │ │ │
│  │  │  • Modelos (PostLike, Bookmark, UserActivity)         │ │ │
│  │  │  • Sistema de likes                                    │ │ │
│  │  │  • Sistema de bookmarks                                │ │ │
│  │  │  • Actividad del usuario                               │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │  Middleware & Configuration                            │ │ │
│  │  │  • CORS (allow_credentials=True)                       │ │ │
│  │  │  • Error Handling                                      │ │ │
│  │  │  • Pydantic Validation                                 │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────┬───────────────────────────────┘
                                     │
                      Motor (Async)  │ MongoDB Wire Protocol
                                     │
┌────────────────────────────────────▼───────────────────────────────┐
│                       BASE DE DATOS                                │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     MongoDB                                   │ │
│  │                                                               │ │
│  │  Collections:                                                │ │
│  │  • users (email, password_hash, role, provider)             │ │
│  │  • sessions (user_id, session_token, expires_at)            │ │
│  │  • user_profiles (bio, social_links)                        │ │
│  │  • posts (title, content, category, tags, published)        │ │
│  │  • categories (name, slug, description)                     │ │
│  │  • comments (post_id, user_id, content, approved)           │ │
│  │  • post_likes (post_id, user_id)                            │ │
│  │  • bookmarks (post_id, user_id)                             │ │
│  │  • newsletter (email, subscribed_at)                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Modelos de Datos

### 1. User (Usuarios)

**Colección**: `users`

```python
{
    "id": "uuid-v4",                    # Primary key
    "email": "user@example.com",        # Unique
    "name": "John Doe",
    "password_hash": "bcrypt-hash",     # Solo para local auth
    "picture": "https://...",           # Opcional (OAuth)
    "role": "admin" | "user",           # Rol del usuario
    "provider": "local" | "google" | "github",
    "created_at": "2025-01-15T10:00:00Z",
    "last_login": "2025-01-15T12:00:00Z"
}
```

**Índices**:
- `email`: Único
- `role`: Normal

**Endpoints relacionados**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

---

### 2. Session (Sesiones)

**Colección**: `sessions`

```python
{
    "id": "uuid-v4",
    "user_id": "uuid-v4",              # FK -> users.id
    "session_token": "jwt-token",
    "provider": "local" | "google" | "github",
    "expires_at": "2025-01-22T10:00:00Z",
    "created_at": "2025-01-15T10:00:00Z"
}
```

**Índices**:
- `user_id`: Normal
- `session_token`: Normal
- `expires_at`: TTL Index (auto-eliminación)

**Nota**: Las sesiones expiradas se eliminan automáticamente por MongoDB TTL index.

---

### 3. UserProfile (Perfiles de Usuario)

**Colección**: `user_profiles`

```python
{
    "user_id": "uuid-v4",              # FK -> users.id (Único)
    "bio": "Full Stack Developer",     # Opcional
    "github_url": "https://github.com/user",
    "twitter_url": "https://twitter.com/user",
    "linkedin_url": "https://linkedin.com/in/user",
    "website_url": "https://example.com",
    "preferences": {},                  # JSON de preferencias
    "updated_at": "2025-01-15T10:00:00Z"
}
```

**Endpoints relacionados**:
- `GET /api/users/profile`
- `PUT /api/users/profile`

---

### 4. Post (Artículos)

**Colección**: `posts`

```python
{
    "id": "uuid-v4",
    "title": "Guía completa de FastAPI",
    "slug": "guia-completa-de-fastapi",  # Único
    "content": "Contenido markdown...",
    "excerpt": "Breve resumen del post",
    "author": "FarchoDev",
    "category": "backend-development",    # FK -> categories.slug
    "tags": ["python", "fastapi", "api"],
    "featured_image_url": "https://...",
    "published": true,
    "published_at": "2025-01-15T10:00:00Z",  # null si draft
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z",
    "views_count": 142,
    "reading_time": 8                     # minutos
}
```

**Índices**:
- `slug`: Único
- `published`: Normal
- `category`: Normal
- `tags`: Normal
- `published_at`: Descendente

**Endpoints relacionados**:
- `GET /api/posts` - Públicos publicados
- `GET /api/posts/{slug}` - Detalle de post
- `POST /api/posts/{id}/view` - Incrementar vistas
- `GET /api/admin/posts` - Todos los posts (admin)
- `POST /api/admin/posts` - Crear post (admin)
- `PUT /api/admin/posts/{id}` - Actualizar (admin)
- `DELETE /api/admin/posts/{id}` - Eliminar (admin)

---

### 5. Category (Categorías)

**Colección**: `categories`

```python
{
    "id": "uuid-v4",
    "name": "Backend Development",
    "slug": "backend-development",      # Único
    "description": "Artículos sobre desarrollo backend",
    "created_at": "2025-01-15T10:00:00Z"
}
```

**Índices**:
- `slug`: Único

**Endpoints relacionados**:
- `GET /api/categories` - Listar categorías
- `POST /api/admin/categories` - Crear (admin)
- `PUT /api/admin/categories/{id}` - Actualizar (admin)
- `DELETE /api/admin/categories/{id}` - Eliminar (admin)

---

### 6. Comment (Comentarios)

**Colección**: `comments`

```python
{
    "id": "uuid-v4",
    "post_id": "uuid-v4",               # FK -> posts.id
    "user_id": "uuid-v4" | null,        # FK -> users.id (null si anónimo)
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "content": "Excelente artículo!",
    "approved": true,                   # Auto-aprobado si user_id != null
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"  # Solo si editado
}
```

**Índices**:
- `post_id`: Normal
- `user_id`: Normal
- `approved`: Normal
- `created_at`: Descendente

**Endpoints relacionados**:
- `GET /api/posts/{id}/comments` - Comentarios aprobados
- `POST /api/comments` - Crear (autenticado)
- `POST /api/comments/anonymous` - Crear (anónimo)
- `PUT /api/comments/{id}` - Actualizar propio
- `DELETE /api/comments/{id}` - Eliminar propio
- `GET /api/admin/comments` - Todos (admin)
- `PUT /api/admin/comments/{id}/approve` - Aprobar (admin)
- `DELETE /api/admin/comments/{id}` - Eliminar (admin)

---

### 7. PostLike (Likes)

**Colección**: `post_likes`

```python
{
    "id": "uuid-v4",
    "post_id": "uuid-v4",               # FK -> posts.id
    "user_id": "uuid-v4",               # FK -> users.id
    "created_at": "2025-01-15T10:00:00Z"
}
```

**Índices**:
- `post_id + user_id`: Único compuesto
- `post_id`: Normal
- `user_id`: Normal

**Endpoints relacionados**:
- `POST /api/posts/{id}/like` - Dar like
- `DELETE /api/posts/{id}/like` - Quitar like
- `GET /api/posts/{id}/likes` - Info de likes

---

### 8. Bookmark (Guardados)

**Colección**: `bookmarks`

```python
{
    "id": "uuid-v4",
    "post_id": "uuid-v4",               # FK -> posts.id
    "user_id": "uuid-v4",               # FK -> users.id
    "created_at": "2025-01-15T10:00:00Z"
}
```

**Índices**:
- `post_id + user_id`: Único compuesto
- `user_id`: Normal

**Endpoints relacionados**:
- `POST /api/bookmarks` - Guardar post
- `GET /api/bookmarks` - Listar guardados
- `DELETE /api/bookmarks/{post_id}` - Remover guardado
- `GET /api/posts/{id}/bookmark-status` - Verificar si está guardado

---

### 9. Newsletter (Suscriptores)

**Colección**: `newsletter`

```python
{
    "id": "uuid-v4",
    "email": "subscriber@example.com",  # Único
    "subscribed_at": "2025-01-15T10:00:00Z",
    "active": true
}
```

**Índices**:
- `email`: Único
- `active`: Normal

**Endpoints relacionados**:
- `POST /api/newsletter/subscribe` - Suscribirse
- `GET /api/admin/newsletter` - Listar suscriptores (admin)

---

## 🔌 API Reference Completa

### Autenticación

#### POST /api/auth/register

Registra un nuevo usuario.

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "name": "Juan Pérez"
}
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "user",
  "provider": "local"
}
```

**Headers Response**:
```
Set-Cookie: session_token=<JWT>; HttpOnly; Max-Age=604800; SameSite=Lax
```

**Errors**:
- `400`: Email ya registrado
- `422`: Datos de validación incorrectos

---

#### POST /api/auth/login

Inicia sesión con email y contraseña.

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "user",
  "provider": "local"
}
```

**Headers Response**:
```
Set-Cookie: session_token=<JWT>; HttpOnly; Max-Age=604800; SameSite=Lax
```

**Errors**:
- `401`: Credenciales inválidas
- `404`: Usuario no encontrado

---

#### GET /api/auth/me

Obtiene información del usuario actual autenticado.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Juan Pérez",
  "role": "user",
  "provider": "local"
}
```

**Errors**:
- `401`: No autenticado o token inválido

---

#### POST /api/auth/logout

Cierra la sesión del usuario actual.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

**Headers Response**:
```
Set-Cookie: session_token=; Max-Age=0
```

---

### Posts

#### GET /api/posts

Obtiene lista de posts publicados.

**Query Parameters**:
- `category` (opcional): Filtrar por categoría (slug)
- `tag` (opcional): Filtrar por tag
- `search` (opcional): Búsqueda en título y contenido
- `limit` (opcional): Número de posts (default: 10)
- `skip` (opcional): Offset para paginación (default: 0)

**Response** (200):
```json
[
  {
    "id": "uuid",
    "title": "Guía de FastAPI",
    "slug": "guia-de-fastapi",
    "excerpt": "Aprende FastAPI...",
    "author": "FarchoDev",
    "category": "backend-development",
    "tags": ["python", "fastapi"],
    "featured_image_url": "https://...",
    "published_at": "2025-01-15T10:00:00Z",
    "views_count": 142,
    "reading_time": 8
  }
]
```

---

#### GET /api/posts/{slug}

Obtiene detalle de un post por slug.

**Response** (200):
```json
{
  "id": "uuid",
  "title": "Guía completa de FastAPI",
  "slug": "guia-completa-de-fastapi",
  "content": "Contenido markdown completo...",
  "excerpt": "Breve resumen",
  "author": "FarchoDev",
  "category": "backend-development",
  "tags": ["python", "fastapi", "api"],
  "featured_image_url": "https://...",
  "published": true,
  "published_at": "2025-01-15T10:00:00Z",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z",
  "views_count": 142,
  "reading_time": 8
}
```

**Errors**:
- `404`: Post no encontrado

---

#### POST /api/posts/{id}/view

Incrementa el contador de vistas de un post.

**Response** (200):
```json
{
  "message": "View counted",
  "views_count": 143
}
```

---

### Likes

#### POST /api/posts/{id}/like

Da like a un post (requiere autenticación).

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Post liked",
  "total_likes": 15
}
```

**Errors**:
- `400`: Ya diste like a este post
- `401`: No autenticado
- `404`: Post no encontrado

---

#### DELETE /api/posts/{id}/like

Quita like de un post.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Like removed",
  "total_likes": 14
}
```

**Errors**:
- `404`: No has dado like a este post
- `401`: No autenticado

---

#### GET /api/posts/{id}/likes

Obtiene información de likes de un post.

**Response** (200):
```json
{
  "total_likes": 15,
  "user_liked": true
}
```

**Nota**: `user_liked` solo aparece si estás autenticado.

---

### Bookmarks

#### POST /api/bookmarks

Guarda un post (requiere autenticación).

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "post_id": "uuid"
}
```

**Response** (200):
```json
{
  "message": "Post bookmarked"
}
```

**Errors**:
- `400`: Post ya está guardado
- `401`: No autenticado
- `404`: Post no encontrado

---

#### GET /api/bookmarks

Obtiene lista de posts guardados del usuario.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "title": "Guía de FastAPI",
    "slug": "guia-de-fastapi",
    "excerpt": "Aprende FastAPI...",
    "category": "backend-development",
    "featured_image_url": "https://...",
    "bookmarked_at": "2025-01-15T10:00:00Z"
  }
]
```

---

#### DELETE /api/bookmarks/{post_id}

Elimina un post de guardados.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Bookmark removed"
}
```

---

#### GET /api/posts/{id}/bookmark-status

Verifica si un post está guardado.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "is_bookmarked": true
}
```

---

### Comentarios

#### GET /api/posts/{id}/comments

Obtiene comentarios aprobados de un post.

**Response** (200):
```json
[
  {
    "id": "uuid",
    "post_id": "uuid",
    "user_id": "uuid",
    "author_name": "Juan Pérez",
    "content": "Excelente artículo!",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
]
```

---

#### POST /api/comments

Crea un comentario (usuario autenticado - auto-aprobado).

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "post_id": "uuid",
  "content": "Excelente artículo!"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "post_id": "uuid",
  "user_id": "uuid",
  "author_name": "Juan Pérez",
  "content": "Excelente artículo!",
  "approved": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

#### POST /api/comments/anonymous

Crea un comentario anónimo (requiere aprobación de admin).

**Request Body**:
```json
{
  "post_id": "uuid",
  "author_name": "Juan Pérez",
  "author_email": "juan@ejemplo.com",
  "content": "Gran artículo!"
}
```

**Response** (200):
```json
{
  "message": "Comment submitted for approval"
}
```

---

#### PUT /api/comments/{id}

Actualiza un comentario propio.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "content": "Contenido actualizado"
}
```

**Response** (200):
```json
{
  "message": "Comment updated",
  "comment": {
    "id": "uuid",
    "content": "Contenido actualizado",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

**Errors**:
- `404`: Comentario no encontrado o no es tuyo

---

#### DELETE /api/comments/{id}

Elimina un comentario propio.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Comment deleted"
}
```

**Errors**:
- `404`: Comentario no encontrado o no es tuyo

---

### Perfil de Usuario

#### GET /api/users/profile

Obtiene perfil del usuario actual.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "user_id": "uuid",
  "bio": "Full Stack Developer",
  "github_url": "https://github.com/user",
  "twitter_url": "https://twitter.com/user",
  "linkedin_url": "https://linkedin.com/in/user",
  "website_url": "https://example.com",
  "updated_at": "2025-01-15T10:00:00Z"
}
```

---

#### PUT /api/users/profile

Actualiza perfil del usuario.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "bio": "Full Stack Developer apasionado",
  "github_url": "https://github.com/user",
  "twitter_url": "https://twitter.com/user",
  "linkedin_url": "https://linkedin.com/in/user",
  "website_url": "https://example.com"
}
```

**Response** (200):
```json
{
  "message": "Profile updated"
}
```

---

#### GET /api/users/activity

Obtiene actividad del usuario (likes, bookmarks, comentarios).

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "total_comments": 15,
  "total_likes": 42,
  "total_bookmarks": 8,
  "recent_comments": [
    {
      "id": "uuid",
      "post_id": "uuid",
      "post_title": "Guía de FastAPI",
      "content": "Excelente!",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "recent_likes": [
    {
      "post_id": "uuid",
      "post_title": "Guía de React",
      "created_at": "2025-01-14T18:00:00Z"
    }
  ],
  "recent_bookmarks": [
    {
      "post_id": "uuid",
      "post_title": "Tutorial MongoDB",
      "created_at": "2025-01-14T16:00:00Z"
    }
  ]
}
```

---

### Categorías

#### GET /api/categories

Obtiene lista de categorías.

**Response** (200):
```json
[
  {
    "id": "uuid",
    "name": "Backend Development",
    "slug": "backend-development",
    "description": "Artículos sobre desarrollo backend",
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

---

### Newsletter

#### POST /api/newsletter/subscribe

Suscribe un email al newsletter.

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response** (200):
```json
{
  "message": "Successfully subscribed to newsletter"
}
```

**Errors**:
- `400`: Email ya suscrito

---

### Admin - Posts

#### GET /api/admin/posts

Obtiene todos los posts (incluye drafts) - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "title": "Post título",
    "slug": "post-titulo",
    "published": false,
    "views_count": 0,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

**Errors**:
- `401`: No autenticado
- `403`: No eres admin

---

#### POST /api/admin/posts

Crea un nuevo post - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "title": "Nuevo Post",
  "content": "Contenido...",
  "excerpt": "Resumen",
  "category": "backend-development",
  "tags": ["python", "fastapi"],
  "featured_image_url": "https://...",
  "published": true
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "title": "Nuevo Post",
  "slug": "nuevo-post",
  "published": true,
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

#### PUT /api/admin/posts/{id}

Actualiza un post - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**: Mismo que POST (todos los campos opcionales)

**Response** (200):
```json
{
  "message": "Post updated",
  "post": { ... }
}
```

**Errors**:
- `404`: Post no encontrado

---

#### DELETE /api/admin/posts/{id}

Elimina un post - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Post deleted successfully"
}
```

---

### Admin - Categorías

#### POST /api/admin/categories

Crea una categoría - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "name": "Nueva Categoría",
  "description": "Descripción opcional"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "name": "Nueva Categoría",
  "slug": "nueva-categoria",
  "description": "Descripción opcional",
  "created_at": "2025-01-15T10:00:00Z"
}
```

---

#### PUT /api/admin/categories/{id}

Actualiza una categoría - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Request Body**:
```json
{
  "name": "Categoría Actualizada",
  "description": "Nueva descripción"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "name": "Categoría Actualizada",
  "slug": "categoria-actualizada",
  "description": "Nueva descripción"
}
```

---

#### DELETE /api/admin/categories/{id}

Elimina una categoría - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Category deleted successfully"
}
```

---

### Admin - Comentarios

#### GET /api/admin/comments

Obtiene todos los comentarios (incluye pendientes) - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "post_id": "uuid",
    "author_name": "Usuario",
    "content": "Comentario...",
    "approved": false,
    "created_at": "2025-01-15T10:00:00Z"
  }
]
```

---

#### PUT /api/admin/comments/{id}/approve

Aprueba un comentario - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Comment approved"
}
```

---

#### DELETE /api/admin/comments/{id}

Elimina un comentario - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Comment deleted successfully"
}
```

---

### Admin - Estadísticas

#### GET /api/admin/stats

Obtiene estadísticas del blog - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "total_posts": 45,
  "published_posts": 38,
  "draft_posts": 7,
  "total_categories": 6,
  "total_comments": 142,
  "pending_comments": 5,
  "total_views": 15240,
  "total_subscribers": 321
}
```

---

### Admin - Newsletter

#### GET /api/admin/newsletter

Obtiene lista de suscriptores - Solo admin.

**Headers Required**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "subscribed_at": "2025-01-15T10:00:00Z",
    "active": true
  }
]
```

---

## 🔐 Sistema de Autenticación

Ver [AUTH_GUIDE.md](./AUTH_GUIDE.md) para documentación completa del sistema de autenticación.

### Resumen Rápido

**Métodos soportados**:
1. JWT Local (email + password)
2. Google OAuth (Emergent Auth)
3. GitHub OAuth

**Características**:
- Passwords hasheados con bcrypt (12 rounds)
- JWT tokens con expiración de 7 días
- Cookies HttpOnly para seguridad
- Middleware de autorización basado en roles
- Sistema de sesiones persistentes

**Roles**:
- `user` - Usuario normal
- `admin` - Administrador del blog

---

## 📦 Frontend Components

### AuthContext

Context principal para manejo de autenticación.

**Ubicación**: `/frontend/src/contexts/AuthContext.js`

**Estado**:
```javascript
{
  user: UserPublic | null,
  loading: boolean,
  isAuthenticated: boolean,
  isAdmin: boolean
}
```

**Métodos**:
- `register(email, password, name)` - Registrar usuario
- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `checkAuth()` - Verificar autenticación actual

**Uso**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function Component() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  
  // ...
}
```

---

### ProtectedRoute

HOC para proteger rutas que requieren autenticación.

**Ubicación**: `/frontend/src/components/ProtectedRoute.js`

**Props**:
- `children` - Componente a renderizar si está autenticado
- `requireAdmin` - Boolean, requiere rol admin (default: false)

**Uso**:
```javascript
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

### LoginModal & RegisterModal

Modales para login y registro de usuarios.

**Ubicación**: 
- `/frontend/src/components/LoginModal.js`
- `/frontend/src/components/RegisterModal.js`

**Features**:
- Validación de formularios
- Manejo de errores
- Toast notifications
- Switch entre login y registro
- Integración con AuthContext

---

### Navbar

Navegación principal con integración de autenticación.

**Ubicación**: `/frontend/src/components/Navbar.js`

**Features**:
- Responsive (mobile + desktop)
- Dropdown de usuario autenticado
- Botones de login/registro para no autenticados
- Link a panel admin (solo para admins)
- Avatar con iniciales del usuario

---

### PostCard

Card para mostrar posts en listados.

**Ubicación**: `/frontend/src/components/PostCard.js`

**Props**:
- `post` - Objeto de post
- `featured` - Boolean, estilo destacado (default: false)

---

### AdminLayout

Layout del panel de administración.

**Ubicación**: `/frontend/src/components/AdminLayout.js`

**Features**:
- Sidebar con navegación
- Área de contenido principal
- Header con info de usuario
- Responsive

---

## ⚙️ Configuración de Desarrollo

### Backend Setup

#### 1. Instalar Dependencias

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt
```

#### 2. Configurar Variables de Entorno

Crear archivo `/backend/.env`:

```bash
# MongoDB
MONGO_URL="mongodb://localhost:27017"
DB_NAME="farchodev_blog"

# CORS
CORS_ORIGINS="http://localhost:3000"

# JWT
JWT_SECRET_KEY="tu-clave-super-secreta-generada-aleatoriamente"

# Admin Emails (separados por comas)
ADMIN_EMAILS="admin@ejemplo.com,otro@ejemplo.com"

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_REDIRECT_URI="http://localhost:8001/api/auth/github/callback"
```

**Generar JWT_SECRET_KEY seguro**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 3. Iniciar MongoDB

```bash
# Linux/Mac
mongod

# Windows
mongod.exe
```

#### 4. Iniciar Backend

```bash
cd backend
source venv/bin/activate  # Activar entorno
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

✅ Backend disponible en: `http://localhost:8001`
📚 Docs interactivos: `http://localhost:8001/docs`

---

### Frontend Setup

#### 1. Instalar Dependencias

```bash
cd frontend
yarn install
```

#### 2. Configurar Variables de Entorno

Crear archivo `/frontend/.env`:

```bash
REACT_APP_BACKEND_URL="http://localhost:8001"
```

#### 3. Iniciar Frontend

```bash
cd frontend
yarn start
```

✅ Frontend disponible en: `http://localhost:3000`

---

### Crear Usuario Administrador

**Opción 1: Variable de entorno (Recomendado)**

1. Agrega tu email a `ADMIN_EMAILS` en `/backend/.env`
2. Reinicia el backend
3. Regístrate con ese email
4. Automáticamente tendrás rol admin

**Opción 2: Script de promoción**

```bash
cd backend
python promote_admin.py tu@email.com
```

**Opción 3: Directamente en MongoDB**

```javascript
db.users.updateOne(
  { email: "tu@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🚀 Deployment

### Configuración de Producción

#### Backend

**Variables de entorno**:
```bash
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
DB_NAME="farchodev_blog_prod"
CORS_ORIGINS="https://tudominio.com"
JWT_SECRET_KEY="<clave-aleatoria-super-segura>"
ADMIN_EMAILS="admin@tudominio.com"
```

**Recomendaciones**:
- Usar MongoDB Atlas para producción
- Generar JWT_SECRET_KEY único y seguro
- Configurar CORS con dominio específico
- Habilitar HTTPS
- Configurar rate limiting
- Implementar logging estructurado

**Opciones de deploy**:
- Railway
- Render
- Fly.io
- AWS EC2 + Docker
- DigitalOcean App Platform

---

#### Frontend

**Variables de entorno**:
```bash
REACT_APP_BACKEND_URL="https://api.tudominio.com"
```

**Build**:
```bash
cd frontend
yarn build
```

**Opciones de deploy**:
- Vercel (recomendado)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Nginx + VPS

---

### Docker Deployment

#### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:4.4
    restart: always
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    restart: always
    ports:
      - "8001:8001"
    env_file:
      - ./backend/.env
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend

volumes:
  mongo_data:
```

**Deploy con Docker**:
```bash
docker-compose up -d
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest backend_test.py -v
pytest backend_auth_test.py -v
pytest backend_comments_test.py -v
```

### Test Manual con cURL

**Registro**:
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123",
    "name": "Usuario Test"
  }' \
  -c cookies.txt
```

**Login**:
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Endpoint Protegido**:
```bash
curl -X GET http://localhost:8001/api/auth/me \
  -b cookies.txt
```

---

## 🔧 Troubleshooting

### Error: Cookies no se guardan

**Síntoma**: Usuario se desloguea al refrescar.

**Soluciones**:
1. Usa `localhost` (no `127.0.0.1`) para frontend y backend
2. Verifica `withCredentials: true` en axios
3. Verifica `credentials: 'include'` en fetch
4. Verifica configuración de CORS en backend

---

### Error: 401 en rutas admin

**Síntoma**: Token no se envía al backend.

**Soluciones**:
1. Verifica que axios use `withCredentials: true`
2. Verifica que CORS_ORIGINS no sea `"*"`
3. Revisa las cookies en DevTools

---

### Error: Cannot connect to MongoDB

**Síntoma**: Backend no inicia o error de conexión.

**Soluciones**:
1. Verifica que MongoDB esté corriendo: `mongod`
2. Verifica MONGO_URL en `.env`
3. Para MongoDB Atlas, whitelist tu IP
4. Verifica credenciales de MongoDB

---

### Error: Port already in use

**Síntoma**: No se puede iniciar backend/frontend.

**Soluciones**:

**Linux/Mac**:
```bash
# Encontrar proceso
lsof -i :8001  # Backend
lsof -i :3000  # Frontend

# Matar proceso
kill -9 <PID>
```

**Windows**:
```bash
# Encontrar proceso
netstat -ano | findstr :8001

# Matar proceso
taskkill /PID <PID> /F
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Pydantic Docs](https://docs.pydantic.dev/)

### Tutoriales Útiles

- [JWT Authentication](https://jwt.io/introduction)
- [MongoDB Indexing](https://docs.mongodb.com/manual/indexes/)
- [React Context API](https://react.dev/reference/react/useContext)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

### Herramientas

- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI para MongoDB
- [Postman](https://www.postman.com/) - Testing de API
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug de React

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Revisa [AUTH_GUIDE.md](./AUTH_GUIDE.md) para problemas de autenticación
3. Revisa [ADMIN_SETUP.md](./ADMIN_SETUP.md) para configuración de admin
4. Abre un issue en GitHub
5. Consulta la documentación oficial de las tecnologías

---

**¿Te ha sido útil esta documentación?** ⭐ Dale una estrella al proyecto en GitHub.

**¿Encontraste un error?** Abre un PR o issue para ayudarnos a mejorar.

---

**Autor**: FarchoDev  
**Versión**: 2.0.0  
**Última actualización**: Enero 2025

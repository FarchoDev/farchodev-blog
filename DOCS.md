# 📖 FarchoDev Blog - Documentación Técnica Completa

> Documentación técnica completa del blog FarchoDev. Incluye arquitectura, API reference, modelos de datos, guías de desarrollo y deployment.

**Versión:** 2.1.0  
**Última actualización:** Enero 2025

---

## 📑 Índice

1. [Arquitectura del Sistema](#1-arquitectura-del-sistema)
2. [Estructura del Código](#2-estructura-del-código)
3. [Modelos de Datos](#3-modelos-de-datos)
4. [API Reference Completa](#4-api-reference-completa)
5. [Sistema de Autenticación](#5-sistema-de-autenticación)
6. [Guía de Desarrollo](#6-guía-de-desarrollo)
7. [Deployment](#7-deployment)
8. [Testing](#8-testing)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Arquitectura del Sistema

### 1.1 Visión General

FarchoDev Blog es una aplicación full-stack moderna construida con:
- **Backend**: FastAPI (Python) - API RESTful asíncrona
- **Frontend**: React 19 - SPA con React Router
- **Base de Datos**: MongoDB - NoSQL document database
- **Autenticación**: JWT + OAuth 2.0 (Google, GitHub)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARQUITECTURA                             │
└─────────────────────────────────────────────────────────────────┘

    [Usuario/Browser]
           │
           │ HTTP/HTTPS
           ▼
    ┌──────────────┐
    │   Frontend   │  React 19 + Tailwind CSS
    │  (Port 3000) │  - SPA routing
    │              │  - State management (Context API)
    └──────┬───────┘  - Axios HTTP client
           │
           │ REST API
           │ /api/*
           ▼
    ┌──────────────┐
    │   Backend    │  FastAPI + Uvicorn
    │  (Port 8001) │  - Async endpoints
    │              │  - JWT auth middleware
    └──────┬───────┘  - CORS configured
           │
           │ Motor (async driver)
           ▼
    ┌──────────────┐
    │   MongoDB    │  NoSQL Database
    │ (Port 27017) │  - users, posts, comments
    │              │  - sessions, bookmarks, likes
    └──────────────┘  - categories, newsletter
```

### 1.2 Flujo de Datos

#### Flujo de Autenticación (JWT Local)
```
1. User → Frontend: Submit login form {email, password}
2. Frontend → Backend: POST /api/auth/login
3. Backend: Verify password (bcrypt)
4. Backend: Generate JWT token (exp: 7 days)
5. Backend → Frontend: Set-Cookie: session_token (HttpOnly)
6. Frontend: Store user in AuthContext
7. User authenticated ✅

Subsequent requests:
Frontend → Backend: Cookie: session_token
Backend: Verify JWT → Middleware → Protected endpoint
```

#### Flujo de OAuth (Google/GitHub)
```
1. User → Frontend: Click "Login with Google/GitHub"
2. Frontend → OAuth Provider: Redirect to auth URL
3. User authorizes on OAuth Provider
4. OAuth Provider → Frontend: Redirect with code/session_id
5. Frontend → Backend: POST /api/auth/{google|github}/callback
6. Backend → OAuth Provider: Exchange code for token
7. Backend: Get user info from OAuth API
8. Backend: Create/update user in MongoDB
9. Backend: Generate session token
10. Backend → Frontend: Set-Cookie: session_token
11. Frontend: Store user in AuthContext
12. User authenticated ✅
```

#### Flujo de Interacción (Likes/Bookmarks)
```
1. User (authenticated) → Frontend: Click like button
2. Frontend: Check AuthContext (user logged in?)
3. Frontend → Backend: POST /api/posts/{id}/like
4. Backend: Verify JWT token (middleware)
5. Backend: Check if already liked
6. Backend: Insert into post_likes collection
7. Backend: Count total likes
8. Backend → Frontend: {message, total_likes}
9. Frontend: Update UI (filled heart icon, new count)
```

### 1.3 Componentes Principales

#### Backend (FastAPI)
```
backend/
├── server.py (680 líneas)
│   ├── FastAPI app initialization
│   ├── MongoDB connection (Motor)
│   ├── CORS middleware
│   ├── Modelos Pydantic:
│   │   ├── Post, PostCreate, PostUpdate
│   │   ├── Category, CategoryCreate
│   │   ├── Comment, CommentCreate, CommentUpdate
│   │   └── Newsletter, NewsletterSubscribe
│   ├── Public endpoints:
│   │   ├── GET /api/posts
│   │   ├── GET /api/posts/{slug}
│   │   ├── GET /api/categories
│   │   └── POST /api/newsletter/subscribe
│   ├── Auth endpoints (JWT + OAuth)
│   ├── User engagement endpoints (likes, bookmarks, comments)
│   └── Admin endpoints (protected)
│
├── auth.py (340 líneas)
│   ├── Models:
│   │   ├── User, UserRegister, UserLogin, UserPublic
│   │   ├── Session, UserProfile
│   │   └── TokenData
│   ├── Password utilities:
│   │   ├── hash_password()
│   │   ├── verify_password()
│   │   └── CryptContext (bcrypt)
│   ├── JWT utilities:
│   │   ├── create_access_token()
│   │   ├── decode_token()
│   │   └── SECRET_KEY, ALGORITHM
│   ├── Auth middleware:
│   │   ├── get_current_user()
│   │   └── require_admin()
│   ├── GitHub OAuth:
│   │   ├── create_github_auth_url()
│   │   ├── exchange_github_code()
│   │   └── get_github_user()
│   ├── Google OAuth (Emergent):
│   │   └── get_google_user_from_session()
│   └── User management:
│       ├── create_or_update_user()
│       ├── create_session()
│       └── delete_session()
│
└── features.py (60 líneas)
    └── Models:
        ├── PostLike (post_id, user_id)
        ├── Bookmark (post_id, user_id)
        └── UserActivity (summary)
```

#### Frontend (React)
```
frontend/src/
├── App.js
│   └── React Router setup
│
├── components/
│   ├── AdminLayout.js - Layout para admin panel
│   ├── Footer.js - Footer del sitio
│   ├── Navbar.js - Navigation bar
│   ├── NewsletterBox.js - Subscription widget
│   ├── PostCard.js - Card component para posts
│   └── ui/ - Componentes Radix UI
│       ├── button.js
│       ├── card.js
│       ├── input.js
│       └── toast.js
│
├── pages/
│   ├── Home.js - Landing page
│   ├── Blog.js - Lista de posts
│   ├── PostDetail.js - Detalle de post
│   ├── Category.js - Posts por categoría
│   ├── About.js - Acerca de
│   └── admin/
│       ├── Dashboard.js - Admin dashboard
│       ├── Posts.js - Gestión de posts
│       ├── PostEditor.js - Editor de posts
│       ├── Categories.js - Gestión de categorías
│       ├── Comments.js - Moderación de comentarios
│       └── Newsletter.js - Gestión de suscriptores
│
├── hooks/
│   └── use-toast.js - Custom hook para notificaciones
│
└── lib/
    └── utils.js - Utilidades generales
```

### 1.4 Patrones de Diseño

#### Backend Patterns

1. **Repository Pattern (Implícito)**
   - MongoDB collections actúan como repositorios
   - Abstracción de acceso a datos via Motor

2. **Dependency Injection**
   - FastAPI maneja inyección de dependencias
   - `get_current_user()` y `require_admin()` como dependencies

3. **Middleware Pattern**
   - CORS middleware para cross-origin requests
   - Auth middleware para proteger endpoints

4. **DTO Pattern**
   - Pydantic models como DTOs
   - Validación automática de inputs/outputs

#### Frontend Patterns

1. **Context API** (State Management)
   - Global auth state management
   - Evita prop drilling

2. **Component Composition**
   - Componentes pequeños y reutilizables
   - Separación clara de concerns

3. **Custom Hooks**
   - `use-toast` para notificaciones
   - Reutilización de lógica

4. **Protected Routes** (HOC Pattern)
   - Envuelve rutas admin con verificación de auth
   - Redirect automático a login si no autenticado

---

## 2. Estructura del Código

### 2.1 Backend (`/app/backend/`)

#### `server.py` - Aplicación Principal

**Imports y Setup**
```python
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from auth import get_current_user, require_admin, ...
from features import PostLike, Bookmark, UserActivity

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# FastAPI app
app = FastAPI()
api_router = APIRouter(prefix="/api")
```

**Modelos Principales**
```python
class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    author: str = "FarchoDev"
    featured_image_url: Optional[str] = None
    category: str
    tags: List[str] = []
    published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    views_count: int = 0
    reading_time: int = 1

class Comment(BaseModel):
    id: str
    post_id: str
    user_id: Optional[str] = None  # Para usuarios autenticados
    author_name: str
    author_email: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    approved: bool = False
```

**Utilidades**
```python
def create_slug(title: str) -> str:
    """Convierte título a URL-friendly slug"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    return slug[:100]

def calculate_reading_time(content: str) -> int:
    """Calcula tiempo de lectura (200 palabras/min)"""
    word_count = len(content.split())
    return max(1, round(word_count / 200))
```

#### `auth.py` - Sistema de Autenticación

**Configuración de Seguridad**
```python
# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 días

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security (FastAPI)
security = HTTPBearer(auto_error=False)
```

**Modelos de Usuario**
```python
class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    password_hash: Optional[str] = None  # Solo para local auth
    picture: Optional[str] = None
    role: Literal["admin", "user"] = "user"
    provider: Literal["local", "google", "github"] = "local"
    created_at: datetime
    last_login: datetime

class Session(BaseModel):
    id: str
    user_id: str
    session_token: str
    provider: Literal["local", "google", "github"]
    expires_at: datetime
    created_at: datetime
```

**Funciones de Autenticación**
```python
async def get_current_user(request: Request, db) -> User:
    """
    Obtiene usuario actual desde:
    1. Cookie: session_token (preferido)
    2. Header: Authorization: Bearer {token}
    
    Valida:
    - JWT tokens (local auth)
    - Session tokens (OAuth)
    - Expiration
    """
    ...

async def require_admin(request: Request, db) -> User:
    """
    Require role='admin'
    Raises 403 si no es admin
    """
    user = await get_current_user(request, db)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
```

#### `features.py` - Funcionalidades Adicionales

```python
class PostLike(BaseModel):
    """Like de un usuario en un post"""
    id: str
    post_id: str
    user_id: str
    created_at: datetime

class Bookmark(BaseModel):
    """Post guardado por un usuario"""
    id: str
    post_id: str
    user_id: str
    created_at: datetime

class UserActivity(BaseModel):
    """Resumen de actividad del usuario"""
    total_comments: int = 0
    total_likes: int = 0
    total_bookmarks: int = 0
    recent_comments: list = []
    recent_likes: list = []
    recent_bookmarks: list = []
```

### 2.2 Frontend (`/app/frontend/src/`)

#### Estructura de Componentes

**Pages (Páginas principales)**
- `Home.js` - Landing con hero section y featured posts
- `Blog.js` - Lista de posts con paginación y filtros
- `PostDetail.js` - Vista detallada de post + comentarios
- `Category.js` - Posts filtrados por categoría
- `About.js` - Página acerca de

**Admin Pages**
- `Dashboard.js` - Estadísticas y métricas del blog
- `Posts.js` - Lista de todos los posts (publicados/drafts)
- `PostEditor.js` - Crear/editar posts con markdown
- `Categories.js` - CRUD de categorías
- `Comments.js` - Moderación de comentarios
- `Newsletter.js` - Gestión de suscriptores

**Components (Reutilizables)**
- `Navbar.js` - Navigation bar con auth UI
- `Footer.js` - Footer del sitio
- `AdminLayout.js` - Layout wrapper para admin pages
- `PostCard.js` - Card component para mostrar posts
- `NewsletterBox.js` - Widget de suscripción

---

## 3. Modelos de Datos

### 3.1 Colecciones de MongoDB

La base de datos `farchodev_blog` contiene las siguientes colecciones:

#### Collection: `users`
**Descripción**: Usuarios registrados del sistema

```javascript
{
  "_id": ObjectId("..."),  // MongoDB ID (no se usa)
  "id": "uuid-v4",         // ID primario usado en la app
  "email": "user@example.com",
  "name": "John Doe",
  "password_hash": "$2b$12$...",  // Solo para local auth
  "picture": "https://...",        // URL del avatar
  "role": "user",                  // "admin" | "user"
  "provider": "local",             // "local" | "google" | "github"
  "created_at": ISODate("2025-01-15T10:30:00Z"),
  "last_login": ISODate("2025-01-20T14:45:00Z")
}
```

**Índices**:
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "id": 1 }, { unique: true })
```

#### Collection: `sessions`
**Descripción**: Sesiones activas (principalmente OAuth)

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "user_id": "user-uuid",
  "session_token": "random-secure-token",
  "provider": "google",  // "local" | "google" | "github"
  "expires_at": ISODate("2025-01-27T10:30:00Z"),  // 7 días
  "created_at": ISODate("2025-01-20T10:30:00Z")
}
```

**Índices**:
```javascript
db.sessions.createIndex({ "session_token": 1 }, { unique: true })
db.sessions.createIndex({ "user_id": 1 })
db.sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 })  // TTL index
```

#### Collection: `posts`
**Descripción**: Artículos del blog

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "title": "Introducción a FastAPI",
  "slug": "introduccion-a-fastapi",
  "content": "# FastAPI\n\nFastAPI es...",  // Markdown
  "excerpt": "Breve descripción del post...",
  "author": "FarchoDev",
  "featured_image_url": "https://images.unsplash.com/...",
  "category": "backend",
  "tags": ["python", "fastapi", "api"],
  "published": true,
  "published_at": ISODate("2025-01-15T10:00:00Z"),
  "created_at": ISODate("2025-01-15T09:30:00Z"),
  "updated_at": ISODate("2025-01-15T10:00:00Z"),
  "views_count": 1250,
  "reading_time": 5  // minutos
}
```

**Índices**:
```javascript
db.posts.createIndex({ "slug": 1 }, { unique: true })
db.posts.createIndex({ "published": 1, "published_at": -1 })
db.posts.createIndex({ "category": 1 })
db.posts.createIndex({ "tags": 1 })
```

#### Collection: `categories`
**Descripción**: Categorías de posts

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "name": "Backend",
  "slug": "backend",
  "description": "Artículos sobre desarrollo backend",
  "created_at": ISODate("2025-01-10T10:00:00Z")
}
```

**Índices**:
```javascript
db.categories.createIndex({ "slug": 1 }, { unique: true })
```

#### Collection: `comments`
**Descripción**: Comentarios en posts

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "post_id": "post-uuid",
  "user_id": "user-uuid",           // null para comentarios anónimos (legacy)
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "content": "Excelente artículo!",
  "created_at": ISODate("2025-01-15T11:30:00Z"),
  "updated_at": ISODate("2025-01-15T12:00:00Z"),  // null si no editado
  "approved": true  // auto-approved para usuarios autenticados
}
```

**Índices**:
```javascript
db.comments.createIndex({ "post_id": 1, "approved": 1 })
db.comments.createIndex({ "user_id": 1 })
```

#### Collection: `post_likes`
**Descripción**: Likes de usuarios en posts

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "post_id": "post-uuid",
  "user_id": "user-uuid",
  "created_at": ISODate("2025-01-15T12:00:00Z")
}
```

**Índices**:
```javascript
db.post_likes.createIndex({ "post_id": 1, "user_id": 1 }, { unique: true })
db.post_likes.createIndex({ "user_id": 1 })
```

#### Collection: `bookmarks`
**Descripción**: Posts guardados por usuarios

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "post_id": "post-uuid",
  "user_id": "user-uuid",
  "created_at": ISODate("2025-01-15T13:00:00Z")
}
```

**Índices**:
```javascript
db.bookmarks.createIndex({ "post_id": 1, "user_id": 1 }, { unique: true })
db.bookmarks.createIndex({ "user_id": 1 })
```

#### Collection: `user_profiles`
**Descripción**: Perfiles extendidos de usuarios

```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user-uuid",
  "bio": "Desarrollador Full Stack apasionado por Python y React",
  "github_url": "https://github.com/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "website_url": "https://johndoe.dev",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "updated_at": ISODate("2025-01-15T14:00:00Z")
}
```

**Índices**:
```javascript
db.user_profiles.createIndex({ "user_id": 1 }, { unique: true })
```

#### Collection: `newsletter`
**Descripción**: Suscriptores al newsletter

```javascript
{
  "_id": ObjectId("..."),
  "id": "uuid-v4",
  "email": "subscriber@example.com",
  "subscribed_at": ISODate("2025-01-15T15:00:00Z"),
  "active": true
}
```

**Índices**:
```javascript
db.newsletter.createIndex({ "email": 1 }, { unique: true })
db.newsletter.createIndex({ "active": 1 })
```

### 3.2 Relaciones Entre Colecciones

```
users (1) ──< sessions (N)
users (1) ──< comments (N)
users (1) ──< post_likes (N)
users (1) ──< bookmarks (N)
users (1) ──o user_profiles (1)

posts (1) ──< comments (N)
posts (1) ──< post_likes (N)
posts (1) ──< bookmarks (N)
posts (N) ──> categories (1)  // via category field
```

### 3.3 Ejemplo de Queries Comunes

**Obtener posts con likes count**
```javascript
db.posts.aggregate([
  { $match: { published: true } },
  { $lookup: {
      from: "post_likes",
      localField: "id",
      foreignField: "post_id",
      as: "likes"
  }},
  { $addFields: { likes_count: { $size: "$likes" } } },
  { $project: { likes: 0 } },
  { $sort: { likes_count: -1 } },
  { $limit: 10 }
])
```

**Obtener actividad de un usuario**
```javascript
db.comments.find({ user_id: "user-uuid" }).count()
db.post_likes.find({ user_id: "user-uuid" }).count()
db.bookmarks.find({ user_id: "user-uuid" }).count()
```

**Obtener posts guardados de un usuario**
```javascript
db.bookmarks.aggregate([
  { $match: { user_id: "user-uuid" } },
  { $lookup: {
      from: "posts",
      localField: "post_id",
      foreignField: "id",
      as: "post"
  }},
  { $unwind: "$post" },
  { $replaceRoot: { newRoot: "$post" } },
  { $sort: { created_at: -1 } }
])
```

---

## 4. API Reference Completa

### 4.1 Autenticación (`/api/auth`)

#### `POST /api/auth/register`
Registrar nuevo usuario con autenticación local

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": null,
  "role": "user",
  "provider": "local"
}
```

**Cookies Set:**
```
Set-Cookie: session_token={jwt_token}; HttpOnly; Secure; SameSite=None; Max-Age=604800
```

**Errors:**
- `400 Bad Request` - Email ya registrado
- `422 Unprocessable Entity` - Validación fallida

---

#### `POST /api/auth/login`
Login con email y contraseña

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": null,
  "role": "user",
  "provider": "local"
}
```

**Cookies Set:**
```
Set-Cookie: session_token={jwt_token}; HttpOnly; Secure; SameSite=None; Max-Age=604800
```

**Errors:**
- `401 Unauthorized` - Email o contraseña incorrectos

---

#### `POST /api/auth/logout`
Cerrar sesión

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Cookies Cleared:**
```
Set-Cookie: session_token=; HttpOnly; Secure; SameSite=None; Max-Age=0
```

---

#### `GET /api/auth/me`
Obtener usuario actual

**Headers Required:**
```
Cookie: session_token={token}
```
O
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "role": "user",
  "provider": "local"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado o token inválido

---

#### `GET /api/auth/google/login`
Obtener URL de autenticación de Google (Emergent Auth)

**Query Parameters:**
- `redirect_url` (string, required) - URL a donde redirigir después del login

**Response (200 OK):**
```json
{
  "auth_url": "https://auth.emergentagent.com/?redirect=http://localhost:3000/dashboard"
}
```

**Flujo completo:**
1. Frontend llama a este endpoint
2. Frontend redirige usuario a `auth_url`
3. Usuario autoriza en Google
4. Emergent redirige a `redirect_url#session_id={id}`
5. Frontend extrae `session_id` del hash
6. Frontend llama a `/api/auth/google/callback`

---

#### `POST /api/auth/google/callback`
Completar autenticación de Google

**Request Body:**
```json
{
  "session_id": "emergent-session-id"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "role": "user",
  "provider": "google"
}
```

**Cookies Set:**
```
Set-Cookie: session_token={emergent_session_token}; HttpOnly; Secure; SameSite=None; Max-Age=604800
```

**Errors:**
- `400 Bad Request` - Session ID inválido

---

#### `GET /api/auth/github/login`
Iniciar autenticación con GitHub

**Response (200 OK):**
```json
{
  "auth_url": "https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=user:email&state=...",
  "state": "random-state-token"
}
```

**Flujo completo:**
1. Frontend llama a este endpoint
2. Frontend guarda `state` en sessionStorage
3. Frontend redirige usuario a `auth_url`
4. Usuario autoriza en GitHub
5. GitHub redirige a `redirect_uri?code={code}&state={state}`
6. Frontend llama a `/api/auth/github/callback`

---

#### `GET /api/auth/github/callback`
Completar autenticación de GitHub

**Query Parameters:**
- `code` (string, required) - Authorization code de GitHub
- `state` (string, required) - State token para validación

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "email": "user@github.com",
  "name": "John Doe",
  "picture": "https://avatars.githubusercontent.com/...",
  "role": "user",
  "provider": "github"
}
```

**Cookies Set:**
```
Set-Cookie: session_token={session_token}; HttpOnly; Secure; SameSite=None; Max-Age=604800
```

**Errors:**
- `400 Bad Request` - Code inválido o email no disponible

---

### 4.2 Posts Públicos (`/api/posts`)

#### `GET /api/posts`
Listar posts publicados con filtros opcionales

**Query Parameters:**
- `skip` (int, default: 0) - Offset para paginación
- `limit` (int, default: 10) - Cantidad de posts a retornar
- `category` (string, optional) - Filtrar por categoría
- `tag` (string, optional) - Filtrar por tag
- `search` (string, optional) - Buscar en título/contenido/excerpt

**Example Request:**
```
GET /api/posts?skip=0&limit=10&category=backend&search=fastapi
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4",
    "title": "Introducción a FastAPI",
    "slug": "introduccion-a-fastapi",
    "content": "# FastAPI\n\n...",
    "excerpt": "Breve descripción...",
    "author": "FarchoDev",
    "featured_image_url": "https://...",
    "category": "backend",
    "tags": ["python", "fastapi", "api"],
    "published": true,
    "published_at": "2025-01-15T10:00:00Z",
    "created_at": "2025-01-15T09:30:00Z",
    "updated_at": "2025-01-15T10:00:00Z",
    "views_count": 1250,
    "reading_time": 5
  }
]
```

---

#### `GET /api/posts/{slug}`
Obtener un post por su slug

**Path Parameters:**
- `slug` (string, required) - Slug del post

**Example Request:**
```
GET /api/posts/introduccion-a-fastapi
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4",
  "title": "Introducción a FastAPI",
  "slug": "introduccion-a-fastapi",
  "content": "# FastAPI\n\nFastAPI es un framework...",
  "excerpt": "Breve descripción del post...",
  "author": "FarchoDev",
  "featured_image_url": "https://...",
  "category": "backend",
  "tags": ["python", "fastapi", "api"],
  "published": true,
  "published_at": "2025-01-15T10:00:00Z",
  "created_at": "2025-01-15T09:30:00Z",
  "updated_at": "2025-01-15T10:00:00Z",
  "views_count": 1250,
  "reading_time": 5
}
```

**Errors:**
- `404 Not Found` - Post no encontrado

---

#### `POST /api/posts/{post_id}/view`
Incrementar contador de vistas

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Response (200 OK):**
```json
{
  "message": "View count incremented"
}
```

**Errors:**
- `404 Not Found` - Post no encontrado

---

#### `GET /api/posts/{post_id}/likes`
Obtener información de likes de un post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Optional:**
```
Cookie: session_token={token}  // Para saber si el usuario actual dio like
```

**Response (200 OK):**
```json
{
  "total_likes": 42,
  "user_liked": true  // false si no autenticado
}
```

---

#### `POST /api/posts/{post_id}/like`
Dar like a un post (requiere autenticación)

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "message": "Post liked",
  "total_likes": 43
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `400 Bad Request` - Ya dio like a este post

---

#### `DELETE /api/posts/{post_id}/like`
Quitar like de un post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "message": "Post unliked",
  "total_likes": 42
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `404 Not Found` - No había dado like

---

#### `GET /api/posts/{post_id}/bookmark-status`
Ver si el usuario guardó un post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Optional:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "bookmarked": true  // false si no autenticado
}
```

---

### 4.3 Bookmarks (`/api/bookmarks`)

#### `POST /api/bookmarks`
Guardar un post (requiere autenticación)

**Query Parameters:**
- `post_id` (string, required) - ID del post a guardar

**Headers Required:**
```
Cookie: session_token={token}
```

**Example Request:**
```
POST /api/bookmarks?post_id=uuid-v4
```

**Response (200 OK):**
```json
{
  "message": "Bookmark added"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `400 Bad Request` - Ya guardado

---

#### `GET /api/bookmarks`
Listar posts guardados del usuario

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
[
  {
    "id": "post-uuid",
    "title": "Post Title",
    "slug": "post-slug",
    "excerpt": "...",
    "featured_image_url": "https://...",
    "category": "backend",
    "published_at": "2025-01-15T10:00:00Z",
    "reading_time": 5
  }
]
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

#### `DELETE /api/bookmarks/{post_id}`
Eliminar bookmark

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "message": "Bookmark removed"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `404 Not Found` - No existe bookmark

---

### 4.4 Comentarios (`/api/comments`)

#### `GET /api/posts/{post_id}/comments`
Listar comentarios aprobados de un post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Response (200 OK):**
```json
[
  {
    "id": "comment-uuid",
    "post_id": "post-uuid",
    "user_id": "user-uuid",
    "author_name": "John Doe",
    "author_email": "john@example.com",
    "content": "Excelente artículo!",
    "created_at": "2025-01-15T11:30:00Z",
    "updated_at": null,
    "approved": true
  }
]
```

---

#### `POST /api/comments`
Crear comentario (requiere autenticación)

**Headers Required:**
```
Cookie: session_token={token}
```

**Request Body:**
```json
{
  "post_id": "post-uuid",
  "content": "Excelente artículo!"
}
```

**Response (200 OK):**
```json
{
  "id": "comment-uuid",
  "post_id": "post-uuid",
  "user_id": "user-uuid",
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "content": "Excelente artículo!",
  "created_at": "2025-01-15T11:30:00Z",
  "updated_at": null,
  "approved": true
}
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

#### `PUT /api/comments/{comment_id}`
Editar propio comentario

**Path Parameters:**
- `comment_id` (string, required) - ID del comentario

**Headers Required:**
```
Cookie: session_token={token}
```

**Request Body:**
```json
{
  "content": "Excelente artículo! Actualizado."
}
```

**Response (200 OK):**
```json
{
  "id": "comment-uuid",
  "post_id": "post-uuid",
  "user_id": "user-uuid",
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "content": "Excelente artículo! Actualizado.",
  "created_at": "2025-01-15T11:30:00Z",
  "updated_at": "2025-01-15T12:00:00Z",
  "approved": true
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Comentario no encontrado o no pertenece al usuario

---

#### `DELETE /api/comments/{comment_id}`
Eliminar propio comentario

**Path Parameters:**
- `comment_id` (string, required) - ID del comentario

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "message": "Comment deleted"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Comentario no encontrado o no pertenece al usuario

---

### 4.5 Perfil de Usuario (`/api/users`)

#### `GET /api/users/profile`
Obtener perfil del usuario actual

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "user_id": "user-uuid",
  "bio": "Desarrollador Full Stack apasionado por Python y React",
  "github_url": "https://github.com/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "website_url": "https://johndoe.dev",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "updated_at": "2025-01-15T14:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

#### `PUT /api/users/profile`
Actualizar perfil del usuario

**Headers Required:**
```
Cookie: session_token={token}
```

**Request Body:**
```json
{
  "bio": "Desarrollador Full Stack apasionado por Python y React",
  "github_url": "https://github.com/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "website_url": "https://johndoe.dev",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

**Response (200 OK):**
```json
{
  "user_id": "user-uuid",
  "bio": "Desarrollador Full Stack apasionado por Python y React",
  "github_url": "https://github.com/johndoe",
  "twitter_url": "https://twitter.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "website_url": "https://johndoe.dev",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "updated_at": "2025-01-20T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

#### `GET /api/users/activity`
Obtener resumen de actividad del usuario

**Headers Required:**
```
Cookie: session_token={token}
```

**Response (200 OK):**
```json
{
  "total_comments": 15,
  "total_likes": 42,
  "total_bookmarks": 8,
  "recent_comments": [
    {
      "id": "comment-uuid",
      "post_id": "post-uuid",
      "content": "...",
      "created_at": "2025-01-20T10:00:00Z"
    }
  ],
  "recent_likes": [
    {
      "id": "like-uuid",
      "post_id": "post-uuid",
      "created_at": "2025-01-20T09:00:00Z"
    }
  ],
  "recent_bookmarks": [
    {
      "id": "bookmark-uuid",
      "post_id": "post-uuid",
      "created_at": "2025-01-19T15:00:00Z"
    }
  ]
}
```

**Errors:**
- `401 Unauthorized` - No autenticado

---

### 4.6 Categorías (`/api/categories` + `/api/admin/categories`)

#### `GET /api/categories`
Listar todas las categorías (público)

**Response (200 OK):**
```json
[
  {
    "id": "category-uuid",
    "name": "Backend",
    "slug": "backend",
    "description": "Artículos sobre desarrollo backend",
    "created_at": "2025-01-10T10:00:00Z"
  }
]
```

---

#### `POST /api/admin/categories`
Crear categoría (solo admin)

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Request Body:**
```json
{
  "name": "Frontend",
  "description": "Artículos sobre desarrollo frontend"
}
```

**Response (200 OK):**
```json
{
  "id": "category-uuid",
  "name": "Frontend",
  "slug": "frontend",
  "description": "Artículos sobre desarrollo frontend",
  "created_at": "2025-01-20T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin

---

#### `PUT /api/admin/categories/{category_id}`
Actualizar categoría (solo admin)

**Path Parameters:**
- `category_id` (string, required) - ID de la categoría

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Request Body:**
```json
{
  "name": "Frontend Development",
  "description": "Artículos sobre desarrollo frontend moderno"
}
```

**Response (200 OK):**
```json
{
  "id": "category-uuid",
  "name": "Frontend Development",
  "slug": "frontend-development",
  "description": "Artículos sobre desarrollo frontend moderno",
  "created_at": "2025-01-20T10:00:00Z"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Categoría no encontrada

---

#### `DELETE /api/admin/categories/{category_id}`
Eliminar categoría (solo admin)

**Path Parameters:**
- `category_id` (string, required) - ID de la categoría

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Category deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Categoría no encontrada

---

### 4.7 Admin - Posts (`/api/admin/posts`)

Todos los endpoints de admin requieren autenticación y role='admin'.

#### `GET /api/admin/posts`
Listar todos los posts (incluye drafts)

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
[
  {
    "id": "post-uuid",
    "title": "Post Title",
    "slug": "post-slug",
    "content": "...",
    "excerpt": "...",
    "author": "FarchoDev",
    "featured_image_url": "https://...",
    "category": "backend",
    "tags": ["python", "fastapi"],
    "published": false,
    "published_at": null,
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z",
    "views_count": 0,
    "reading_time": 5
  }
]
```

---

#### `POST /api/admin/posts`
Crear nuevo post

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Request Body:**
```json
{
  "title": "Nuevo Post",
  "content": "# Contenido del post...",
  "excerpt": "Breve descripción...",
  "featured_image_url": "https://...",
  "category": "backend",
  "tags": ["python", "fastapi"],
  "published": false
}
```

**Response (200 OK):**
```json
{
  "id": "new-post-uuid",
  "title": "Nuevo Post",
  "slug": "nuevo-post",
  "content": "# Contenido del post...",
  "excerpt": "Breve descripción...",
  "author": "FarchoDev",
  "featured_image_url": "https://...",
  "category": "backend",
  "tags": ["python", "fastapi"],
  "published": false,
  "published_at": null,
  "created_at": "2025-01-20T11:00:00Z",
  "updated_at": "2025-01-20T11:00:00Z",
  "views_count": 0,
  "reading_time": 5
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin

---

#### `PUT /api/admin/posts/{post_id}`
Actualizar post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Request Body (todos los campos opcionales):**
```json
{
  "title": "Título Actualizado",
  "content": "# Contenido actualizado...",
  "excerpt": "Nueva descripción...",
  "featured_image_url": "https://...",
  "category": "frontend",
  "tags": ["react", "javascript"],
  "published": true
}
```

**Response (200 OK):**
```json
{
  "id": "post-uuid",
  "title": "Título Actualizado",
  "slug": "titulo-actualizado",
  "content": "# Contenido actualizado...",
  "excerpt": "Nueva descripción...",
  "author": "FarchoDev",
  "featured_image_url": "https://...",
  "category": "frontend",
  "tags": ["react", "javascript"],
  "published": true,
  "published_at": "2025-01-20T12:00:00Z",
  "created_at": "2025-01-20T11:00:00Z",
  "updated_at": "2025-01-20T12:00:00Z",
  "views_count": 0,
  "reading_time": 5
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Post no encontrado

---

#### `DELETE /api/admin/posts/{post_id}`
Eliminar post

**Path Parameters:**
- `post_id` (string, required) - ID del post

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Post no encontrado

---

### 4.8 Admin - Comentarios (`/api/admin/comments`)

#### `GET /api/admin/comments`
Listar todos los comentarios (incluye pendientes)

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
[
  {
    "id": "comment-uuid",
    "post_id": "post-uuid",
    "user_id": null,
    "author_name": "Anonymous",
    "author_email": "anon@example.com",
    "content": "Comentario pendiente de aprobación",
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": null,
    "approved": false
  }
]
```

---

#### `PUT /api/admin/comments/{comment_id}/approve`
Aprobar comentario

**Path Parameters:**
- `comment_id` (string, required) - ID del comentario

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Comment approved"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Comentario no encontrado

---

#### `DELETE /api/admin/comments/{comment_id}`
Eliminar comentario (admin)

**Path Parameters:**
- `comment_id` (string, required) - ID del comentario

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin
- `404 Not Found` - Comentario no encontrado

---

### 4.9 Admin - Estadísticas (`/api/admin/stats`)

#### `GET /api/admin/stats`
Obtener estadísticas del blog

**Headers Required:**
```
Cookie: session_token={admin_token}
```

**Response (200 OK):**
```json
{
  "total_posts": 45,
  "published_posts": 30,
  "draft_posts": 15,
  "total_comments": 120,
  "pending_comments": 5,
  "approved_comments": 115,
  "total_subscribers": 250,
  "total_users": 180,
  "total_views": 15420
}
```

**Errors:**
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No es admin

---

### 4.10 Newsletter (`/api/newsletter`)

#### `POST /api/newsletter/subscribe`
Suscribirse al newsletter

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "newsletter-uuid",
  "email": "subscriber@example.com",
  "subscribed_at": "2025-01-20T15:00:00Z",
  "active": true
}
```

**Errors:**
- `422 Unprocessable Entity` - Email inválido

**Nota**: Si el email ya existe, se reactiva si estaba inactivo.

---

## 5. Sistema de Autenticación

### 5.1 Métodos de Autenticación

FarchoDev Blog soporta **3 métodos de autenticación**:

1. **JWT Local** (Email + Password)
2. **Google OAuth** (via Emergent Auth)
3. **GitHub OAuth** (OAuth 2.0 standard)

Todos los métodos resultan en:
- Usuario creado/actualizado en MongoDB (`users` collection)
- Token de sesión almacenado en cookie HttpOnly
- Sesión válida por 7 días

### 5.2 JWT Local Authentication

#### Flujo de Registro
```
1. Usuario envía {email, password, name}
2. Backend valida que email no exista
3. Backend hashea password con bcrypt (12 rounds)
4. Backend crea usuario en DB con role='user'
5. Backend genera JWT token:
   {
     "user_id": "uuid",
     "email": "...",
     "role": "user",
     "exp": timestamp + 7 days
   }
6. Backend firma JWT con SECRET_KEY (HS256)
7. Backend devuelve token en cookie HttpOnly
```

#### Flujo de Login
```
1. Usuario envía {email, password}
2. Backend busca usuario por email
3. Backend verifica password con bcrypt.verify()
4. Si válido, genera JWT token (igual que registro)
5. Backend actualiza last_login en DB
6. Backend devuelve token en cookie HttpOnly
```

#### Validación de Token
```python
async def get_current_user(request: Request, db) -> User:
    # 1. Obtener token desde cookie o header
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(401, "Not authenticated")
    
    # 2. Verificar si es session token (OAuth)
    session = await db.sessions.find_one({"session_token": token})
    if session:
        # Verificar expiración
        if datetime.now(timezone.utc) > session["expires_at"]:
            await db.sessions.delete_one({"session_token": token})
            raise HTTPException(401, "Session expired")
        # Obtener usuario
        user = await db.users.find_one({"id": session["user_id"]})
        return User(**user)
    
    # 3. Si no es session, debe ser JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(401, "User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.JWTError:
        raise HTTPException(401, "Invalid token")
```

### 5.3 Google OAuth (Emergent Auth)

**Ventaja**: No necesitas crear OAuth app en Google Cloud Console.

#### Configuración
No se requiere configuración. Emergent Auth maneja todo.

#### Flujo Completo
```
1. Frontend: GET /api/auth/google/login?redirect_url=http://localhost:3000/dashboard
2. Backend devuelve: {auth_url: "https://auth.emergentagent.com/?redirect=..."}
3. Frontend redirige usuario a auth_url
4. Usuario autoriza en Google
5. Emergent procesa OAuth y redirige a: 
   http://localhost:3000/dashboard#session_id={emergent_session_id}
6. Frontend extrae session_id del hash (#)
7. Frontend: POST /api/auth/google/callback {session_id}
8. Backend llama a Emergent:
   GET https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data
   Headers: X-Session-ID: {session_id}
9. Emergent devuelve: 
   {
     "id": "...",
     "email": "user@gmail.com",
     "name": "John Doe",
     "picture": "https://...",
     "session_token": "emergent-token-7-days"
   }
10. Backend crea/actualiza usuario en MongoDB
11. Backend crea sesión con emergent session_token
12. Backend devuelve session_token en cookie HttpOnly
```

#### Código Frontend (React)
```javascript
// Iniciar login
const handleGoogleLogin = async () => {
  const response = await axios.get('/api/auth/google/login', {
    params: { redirect_url: 'http://localhost:3000/dashboard' }
  });
  window.location.href = response.data.auth_url;
};

// Procesar callback (en useEffect de Dashboard)
useEffect(() => {
  const hash = window.location.hash;
  if (hash.includes('session_id=')) {
    const session_id = hash.split('session_id=')[1].split('&')[0];
    
    axios.post('/api/auth/google/callback', { session_id })
      .then(response => {
        // Usuario autenticado
        setUser(response.data);
        // Limpiar hash
        window.history.replaceState(null, '', window.location.pathname);
      })
      .catch(error => {
        console.error('Auth failed:', error);
      });
  }
}, []);
```

### 5.4 GitHub OAuth

**Requiere**: GitHub OAuth App configurada.

#### Configuración Necesaria

1. Crear GitHub OAuth App:
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in:
     - Application name: "FarchoDev Blog"
     - Homepage URL: "http://localhost:3000"
     - Authorization callback URL: "http://localhost:3000/auth/github/callback"
   - Copy Client ID and Client Secret

2. Agregar en `/backend/.env`:
```bash
GITHUB_CLIENT_ID="tu_client_id_aqui"
GITHUB_CLIENT_SECRET="tu_client_secret_aqui"
GITHUB_REDIRECT_URI="http://localhost:3000/auth/github/callback"
```

3. Reiniciar backend

#### Flujo Completo
```
1. Frontend: GET /api/auth/github/login
2. Backend devuelve:
   {
     "auth_url": "https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=user:email&state=random",
     "state": "random-secure-state"
   }
3. Frontend guarda state en sessionStorage
4. Frontend redirige a auth_url
5. Usuario autoriza en GitHub
6. GitHub redirige a:
   http://localhost:3000/auth/github/callback?code={code}&state={state}
7. Frontend verifica state contra sessionStorage
8. Frontend: GET /api/auth/github/callback?code={code}&state={state}
9. Backend:
   - Valida state
   - POST https://github.com/login/oauth/access_token
     {client_id, client_secret, code, redirect_uri}
   - Recibe: {access_token}
   - GET https://api.github.com/user
     Headers: Authorization: Bearer {access_token}
   - Recibe datos del usuario
   - GET https://api.github.com/user/emails
     (para obtener email primario)
10. Backend crea/actualiza usuario en MongoDB
11. Backend genera session_token aleatorio
12. Backend crea sesión con expires_at = now + 7 days
13. Backend devuelve session_token en cookie HttpOnly
```

#### Código Backend (auth.py)
```python
async def exchange_github_code(code: str) -> dict:
    """Exchange GitHub code for access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        return response.json()

async def get_github_user(access_token: str) -> dict:
    """Get GitHub user info and primary email"""
    async with httpx.AsyncClient() as client:
        # Get user data
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        user_data = user_response.json()
        
        # Get primary email
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        emails = email_response.json()
        primary_email = next(
            (e["email"] for e in emails if e["primary"]),
            user_data.get("email")
        )
        user_data["email"] = primary_email
        
        return user_data
```

### 5.5 Protección de Rutas

#### Backend Middleware

**Para rutas que requieren autenticación:**
```python
@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    user = await get_current_user(request, db)  # ← Middleware
    # user es garantizado como autenticado
    ...
```

**Para rutas que requieren admin:**
```python
@api_router.get("/admin/posts")
async def get_all_posts_admin(request: Request):
    user = await require_admin(request, db)  # ← Middleware admin
    # user es garantizado como autenticado Y admin
    ...
```

#### Frontend ProtectedRoute (React)

**Crear componente ProtectedRoute.js:**
```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

**Uso en App.js:**
```javascript
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout />
    </ProtectedRoute>
  } 
/>
```

### 5.6 Cookies Seguras

**Configuración de cookies:**
```python
response.set_cookie(
    key="session_token",
    value=token,
    httponly=True,      # No accesible desde JavaScript (protección XSS)
    secure=True,        # Solo HTTPS en producción
    samesite="none",    # Necesario para CORS cross-origin
    max_age=604800      # 7 días en segundos
)
```

**Lectura de cookies en requests:**
```python
token = request.cookies.get("session_token")
```

**Axios configuración (Frontend):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true  // ← CRÍTICO: Enviar cookies en cross-origin
});

export default api;
```

### 5.7 Expiración y Renovación

**JWT Tokens (Local Auth)**:
- Expiración: 7 días
- No se renuevan automáticamente
- Usuario debe hacer login de nuevo

**Session Tokens (OAuth)**:
- Expiración: 7 días
- Almacenados en MongoDB con `expires_at`
- TTL index en MongoDB para limpieza automática:
```javascript
db.sessions.createIndex(
  { "expires_at": 1 }, 
  { expireAfterSeconds: 0 }
)
```

**Para renovar tokens**:
```python
# Opción 1: Usuario hace login de nuevo
# Opción 2: Implementar refresh token endpoint (futuro)
```

---

## 6. Guía de Desarrollo

### 6.1 Setup del Entorno de Desarrollo

#### Requisitos
- Python 3.9+
- Node.js 16+
- MongoDB 4.4+
- Yarn 1.22+
- Git

#### Setup Completo (10 min)

**1. Clonar y configurar backend:**
```bash
cd /app/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear .env
cp .env.example .env
# Editar .env con tus valores
```

**2. Configurar frontend:**
```bash
cd /app/frontend

# Instalar dependencias
yarn install

# Crear .env
cp .env.example .env
# Editar .env: REACT_APP_BACKEND_URL="http://localhost:8001"
```

**3. Iniciar MongoDB:**
```bash
# Opción 1: Comando directo
mongod --dbpath ~/data/db

# Opción 2: Service (Linux)
sudo systemctl start mongod

# Opción 3: Homebrew (macOS)
brew services start mongodb-community
```

**4. Iniciar aplicación:**
```bash
# Terminal 1 - Backend
cd /app/backend
source venv/bin/activate
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2 - Frontend
cd /app/frontend
yarn start
```

✅ Backend: http://localhost:8001  
✅ API Docs: http://localhost:8001/docs  
✅ Frontend: http://localhost:3000

### 6.2 Comandos Útiles

#### Backend

```bash
# Activar entorno virtual
source venv/bin/activate

# Instalar nueva dependencia
pip install package_name
pip freeze > requirements.txt

# Correr servidor con hot reload
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Correr servidor en producción
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4

# Ver logs en tiempo real
tail -f /var/log/supervisor/backend.err.log

# Linting
ruff check .
black .

# Type checking
mypy server.py
```

#### Frontend

```bash
# Instalar dependencia
yarn add package_name

# Correr en desarrollo
yarn start

# Build para producción
yarn build

# Servir build de producción
serve -s build

# Linting
yarn lint

# Format con Prettier
yarn format
```

#### MongoDB

```bash
# Conectar a MongoDB
mongosh

# Seleccionar DB
use farchodev_blog

# Ver colecciones
show collections

# Contar documentos
db.users.countDocuments()
db.posts.countDocuments()

# Ver todos los usuarios
db.users.find().pretty()

# Crear usuario admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)

# Backup de DB
mongodump --db farchodev_blog --out backup/

# Restore de backup
mongorestore --db farchodev_blog backup/farchodev_blog/

# Eliminar colección
db.sessions.drop()

# Crear índice
db.posts.createIndex({ "slug": 1 }, { unique: true })
```

### 6.3 Agregar Nuevas Funcionalidades

#### Ejemplo: Agregar Sistema de "Trending Posts"

**Paso 1: Actualizar modelo de datos**

No se necesita cambio en MongoDB (NoSQL), pero actualizar modelo Pydantic si es necesario:

```python
# server.py
class Post(BaseModel):
    ...
    trending_score: float = 0.0  # ← Nuevo campo
```

**Paso 2: Crear endpoint backend**

```python
# server.py

@api_router.get("/posts/trending", response_model=List[Post])
async def get_trending_posts(limit: int = 10):
    """
    Get trending posts based on views, likes, and recency
    Formula: score = (views * 0.5) + (likes * 2) + (days_old * -1)
    """
    # Aggregate pipeline
    pipeline = [
        {"$match": {"published": True}},
        {
            "$lookup": {
                "from": "post_likes",
                "localField": "id",
                "foreignField": "post_id",
                "as": "likes"
            }
        },
        {
            "$addFields": {
                "likes_count": {"$size": "$likes"},
                "days_old": {
                    "$divide": [
                        {"$subtract": [datetime.now(timezone.utc), "$published_at"]},
                        86400000  # ms in a day
                    ]
                }
            }
        },
        {
            "$addFields": {
                "trending_score": {
                    "$add": [
                        {"$multiply": ["$views_count", 0.5]},
                        {"$multiply": ["$likes_count", 2]},
                        {"$multiply": ["$days_old", -1]}
                    ]
                }
            }
        },
        {"$sort": {"trending_score": -1}},
        {"$limit": limit},
        {"$project": {"likes": 0, "days_old": 0}}
    ]
    
    posts = await db.posts.aggregate(pipeline).to_list(limit)
    
    # Convert datetime strings
    for post in posts:
        for field in ['created_at', 'updated_at', 'published_at']:
            if field in post and isinstance(post[field], str):
                post[field] = datetime.fromisoformat(post[field])
    
    return posts
```

**Paso 3: Consumir desde frontend**

```javascript
// pages/Home.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get('/api/posts/trending?limit=5');
        setTrendingPosts(response.data);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">🔥 Trending Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
```

**Paso 4: Testing**

```bash
# Test manual con curl
curl http://localhost:8001/api/posts/trending?limit=5

# O en API Docs
# Open http://localhost:8001/docs
# Find GET /api/posts/trending
# Click "Try it out"
# Execute
```

### 6.4 Debugging

#### Backend Debugging

**Ver logs en tiempo real:**
```bash
tail -f /var/log/supervisor/backend.err.log
```

**Agregar logging en código:**
```python
import logging

logger = logging.getLogger(__name__)

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    user = await get_current_user(request, db)
    logger.info(f"User {user.email} liking post {post_id}")
    
    # Check if already liked
    existing = await db.post_likes.find_one({"post_id": post_id, "user_id": user.id})
    if existing:
        logger.warning(f"User {user.email} already liked post {post_id}")
        raise HTTPException(400, "Already liked")
    
    logger.info(f"Creating like for user {user.email} on post {post_id}")
    # ... rest of code
```

**Debugging con pdb:**
```python
import pdb

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    user = await get_current_user(request, db)
    pdb.set_trace()  # ← Debugger breakpoint
    # ... rest of code
```

#### Frontend Debugging

**Console logging:**
```javascript
const handleLike = async (postId) => {
  console.log('Liking post:', postId);
  try {
    const response = await axios.post(`/api/posts/${postId}/like`);
    console.log('Like response:', response.data);
  } catch (error) {
    console.error('Like error:', error.response?.data);
  }
};
```

**React DevTools:**
- Instalar: https://react.dev/learn/react-developer-tools
- Ver component tree
- Inspeccionar props y state
- Ver context values

**Network Tab (Chrome DevTools):**
- F12 → Network
- Ver todas las requests
- Inspeccionar headers, body, response
- Ver cookies enviadas

---

## 7. Deployment

### 7.1 Variables de Entorno de Producción

**Backend (`/backend/.env`):**
```bash
# Database
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/"
DB_NAME="farchodev_blog_prod"

# CORS (tu dominio frontend)
CORS_ORIGINS="https://farchodev.com"

# JWT Secret (GENERAR UNO NUEVO Y SEGURO)
JWT_SECRET_KEY="super-secure-random-key-generated-with-secrets-token-urlsafe-64"

# Admin emails (separados por coma)
ADMIN_EMAILS="admin@farchodev.com,owner@farchodev.com"

# GitHub OAuth (si se usa)
GITHUB_CLIENT_ID="production_client_id"
GITHUB_CLIENT_SECRET="production_client_secret"
GITHUB_REDIRECT_URI="https://farchodev.com/auth/github/callback"
```

**Frontend (`/frontend/.env`):**
```bash
REACT_APP_BACKEND_URL="https://api.farchodev.com"
```

### 7.2 Build de Producción

#### Backend

**Opción 1: Con Gunicorn (recomendado)**
```bash
pip install gunicorn

# Correr con 4 workers
gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

**Opción 2: Con Uvicorn directo**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

#### Frontend

**Build:**
```bash
cd /app/frontend
yarn build

# Genera carpeta /build con assets optimizados
```

**Servir build:**

*Opción 1: Con Nginx*
```nginx
server {
    listen 80;
    server_name farchodev.com;
    root /var/www/farchodev/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

*Opción 2: Con serve*
```bash
npm install -g serve
serve -s build -l 3000
```

### 7.3 Deployment en Vercel (Frontend)

**1. Conectar GitHub repo:**
- Go to https://vercel.com
- Import project from GitHub
- Select `frontend` directory

**2. Configurar build:**
```
Build Command: yarn build
Output Directory: build
Install Command: yarn install
```

**3. Agregar variables de entorno:**
```
REACT_APP_BACKEND_URL=https://api.farchodev.com
```

**4. Deploy:**
- Push a main branch
- Vercel auto-deploys

### 7.4 Deployment en Railway (Backend + MongoDB)

**1. Crear nuevo proyecto:**
- Go to https://railway.app
- New Project → Deploy from GitHub

**2. Agregar MongoDB:**
- Add → Database → MongoDB
- Railway crea MONGO_URL automáticamente

**3. Agregar variables de entorno:**
```
DB_NAME=farchodev_blog
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=https://farchodev.vercel.app
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_REDIRECT_URI=https://farchodev.vercel.app/auth/github/callback
```

**4. Configurar start command:**
```
uvicorn server:app --host 0.0.0.0 --port $PORT
```

**5. Deploy:**
- Push to main
- Railway auto-deploys

### 7.5 Deployment en VPS (DigitalOcean, AWS EC2, etc.)

**Setup completo:**

**1. Instalar dependencias:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3.9 python3-pip python3-venv -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install nginx -y
```

**2. Clonar proyecto:**
```bash
cd /var/www
git clone <your-repo-url> farchodev
cd farchodev
```

**3. Setup backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Crear .env con valores de producción
nano .env
```

**4. Setup frontend:**
```bash
cd ../frontend
yarn install
nano .env  # REACT_APP_BACKEND_URL=https://api.farchodev.com
yarn build
```

**5. Configurar Nginx:**
```bash
sudo nano /etc/nginx/sites-available/farchodev
```

```nginx
# Frontend
server {
    listen 80;
    server_name farchodev.com www.farchodev.com;
    root /var/www/farchodev/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.farchodev.com;

    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/farchodev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. Setup SSL con Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d farchodev.com -d www.farchodev.com -d api.farchodev.com
```

**7. Crear systemd service para backend:**
```bash
sudo nano /etc/systemd/system/farchodev-backend.service
```

```ini
[Unit]
Description=FarchoDev Blog Backend
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/farchodev/backend
Environment="PATH=/var/www/farchodev/backend/venv/bin"
ExecStart=/var/www/farchodev/backend/venv/bin/gunicorn server:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start farchodev-backend
sudo systemctl enable farchodev-backend
sudo systemctl status farchodev-backend
```

**8. Setup logrotate:**
```bash
sudo nano /etc/logrotate.d/farchodev
```

```
/var/log/farchodev/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload farchodev-backend
    endscript
}
```

### 7.6 Health Checks y Monitoring

**Agregar health check endpoint:**
```python
# server.py

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check MongoDB connection
        await db.command('ping')
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "service": "farchodev-blog-api",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )
```

**Setup monitoring con UptimeRobot:**
1. Go to https://uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: https://api.farchodev.com/api/health
4. Interval: 5 minutes
5. Alert contacts: your email

**Setup logging con Sentry:**
```bash
pip install sentry-sdk[fastapi]
```

```python
# server.py
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)

# Sentry will auto-capture exceptions
```

---

## 8. Testing

### 8.1 Testing Manual

**Backend (con curl):**

```bash
# Health check
curl http://localhost:8001/api/health

# Register
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test User","password":"test123"}'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt  # Save cookies

# Get current user
curl http://localhost:8001/api/auth/me \
  -b cookies.txt  # Use saved cookies

# Create post (admin)
curl -X POST http://localhost:8001/api/admin/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"Test Post",
    "content":"# Content",
    "excerpt":"Test",
    "category":"backend",
    "tags":["test"],
    "published":true
  }'
```

**Backend (API Docs - Interactive):**
1. Open http://localhost:8001/docs
2. Click "Authorize" → Enter JWT token
3. Try any endpoint interactively

### 8.2 Testing Automatizado (Futuro)

**Setup pytest:**
```bash
pip install pytest pytest-asyncio httpx
```

**Crear test file:**
```python
# tests/test_auth.py
import pytest
from httpx import AsyncClient
from server import app

@pytest.mark.asyncio
async def test_register():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/auth/register", json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "testpass123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "id" in data

@pytest.mark.asyncio
async def test_login():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First register
        await client.post("/api/auth/register", json={
            "email": "login@example.com",
            "name": "Login User",
            "password": "loginpass"
        })
        
        # Then login
        response = await client.post("/api/auth/login", json={
            "email": "login@example.com",
            "password": "loginpass"
        })
        assert response.status_code == 200
        assert "session_token" in response.cookies
```

**Correr tests:**
```bash
pytest tests/ -v
```

---

## 9. Troubleshooting

### 9.1 Problemas Comunes

#### Problema: Backend no inicia
```
ERROR: No module named 'fastapi'
```

**Solución:**
```bash
# Asegurarse de estar en el entorno virtual
cd /app/backend
source venv/bin/activate
pip install -r requirements.txt
```

---

#### Problema: MongoDB connection refused
```
pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 61] Connection refused
```

**Solución:**
```bash
# Verificar que MongoDB esté corriendo
ps aux | grep mongod

# Si no está corriendo, iniciarlo
mongod

# O con systemd
sudo systemctl start mongod

# O con Homebrew (macOS)
brew services start mongodb-community
```

---

#### Problema: CORS errors en frontend
```
Access to fetch at 'http://localhost:8001/api/posts' has been blocked by CORS policy
```

**Solución:**
1. Verificar `CORS_ORIGINS` en `/backend/.env`:
```bash
CORS_ORIGINS="http://localhost:3000"
```

2. Verificar que Axios esté configurado con credentials:
```javascript
// utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true  // ← CRÍTICO
});

export default api;
```

3. Reiniciar backend
```bash
sudo supervisorctl restart backend
```

---

#### Problema: Login no persiste (se pierde al refrescar)
```
User is null after page refresh
```

**Solución:**
1. Verificar cookies en DevTools:
   - F12 → Application → Cookies
   - Debe existir `session_token`

2. Verificar configuración de cookies en backend:
```python
response.set_cookie(
    key="session_token",
    value=token,
    httponly=True,
    secure=True,      # ⚠️ Requiere HTTPS en producción
    samesite="none"   # Necesario para CORS
)
```

3. Si estás en localhost (desarrollo), considera:
```python
secure=False  # Solo en desarrollo local
```

---

#### Problema: "Invalid authentication credentials"
```
401 Unauthorized: Invalid authentication credentials
```

**Causas:**
1. Token expirado (7 días)
2. `JWT_SECRET_KEY` cambió
3. Cookie no se envía en request

**Solución:**
1. Logout y login de nuevo
2. Verificar que `JWT_SECRET_KEY` no haya cambiado en `.env`
3. Inspeccionar request en Network tab → ver si cookie está presente

---

#### Problema: Admin routes redirect to home
```
User authenticated but redirected from /admin/*
```

**Solución:**
1. Verificar rol en MongoDB:
```javascript
db.users.findOne({ email: "your-email@example.com" })
```

2. Si rol es "user", actualizarlo:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

3. Logout y login de nuevo

---

#### Problema: "Post not found" al acceder por slug
```
404 Not Found: Post not found
```

**Solución:**
1. Verificar que el post esté publicado:
```javascript
db.posts.findOne({ slug: "your-slug" })
// Debe tener: published: true
```

2. Si es draft, publicarlo:
```javascript
db.posts.updateOne(
  { slug: "your-slug" },
  { 
    $set: { 
      published: true,
      published_at: new Date()
    } 
  }
)
```

---

#### Problema: GitHub OAuth no funciona
```
Failed to get access token from GitHub
```

**Solución:**
1. Verificar credenciales en `.env`:
```bash
GITHUB_CLIENT_ID="correct_client_id"
GITHUB_CLIENT_SECRET="correct_client_secret"
GITHUB_REDIRECT_URI="http://localhost:3000/auth/github/callback"
```

2. Verificar que redirect_uri coincida EXACTAMENTE en:
   - GitHub OAuth App settings
   - `.env` GITHUB_REDIRECT_URI
   - Frontend redirect logic

3. Reiniciar backend después de cambiar `.env`

---

#### Problema: Frontend no se conecta al backend
```
Network Error
```

**Solución:**
1. Verificar que backend esté corriendo:
```bash
curl http://localhost:8001/api/health
```

2. Verificar `REACT_APP_BACKEND_URL` en `/frontend/.env`:
```bash
REACT_APP_BACKEND_URL="http://localhost:8001"
```

3. Reiniciar frontend:
```bash
yarn start
```

---

#### Problema: Estilos Tailwind no se aplican
```
className="bg-blue-500" no tiene efecto
```

**Solución:**
1. Verificar `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // ← Debe incluir todos los archivos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. Reiniciar servidor de desarrollo:
```bash
yarn start
```

---

### 9.2 Logs y Debugging

**Ver logs del backend:**
```bash
# Logs de error
tail -f /var/log/supervisor/backend.err.log

# Logs de output
tail -f /var/log/supervisor/backend.out.log

# Últimas 100 líneas
tail -n 100 /var/log/supervisor/backend.err.log

# Buscar errores específicos
grep "ERROR" /var/log/supervisor/backend.err.log
```

**Ver logs del frontend (browser):**
1. F12 → Console
2. Ver errors y warnings
3. Network tab → ver requests fallidas

**Agregar logging en código:**
```python
# Backend
import logging
logger = logging.getLogger(__name__)

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    logger.info(f"Attempting to like post {post_id}")
    try:
        user = await get_current_user(request, db)
        logger.info(f"User {user.email} authenticated")
        # ... rest of code
    except Exception as e:
        logger.error(f"Error liking post: {str(e)}")
        raise
```

```javascript
// Frontend
const handleLike = async (postId) => {
  console.log('[Like] Starting like for post:', postId);
  try {
    const response = await axios.post(`/api/posts/${postId}/like`);
    console.log('[Like] Success:', response.data);
  } catch (error) {
    console.error('[Like] Error:', error.response?.data || error.message);
  }
};
```

---

## 10. Conclusión

Este documento cubre la arquitectura completa, API reference, y guías de desarrollo para FarchoDev Blog.

**Para soporte adicional:**
- 📖 Consulta [AUTH_GUIDE.md](AUTH_GUIDE.md) para detalles de autenticación
- 👨‍💼 Consulta [ADMIN_SETUP.md](ADMIN_SETUP.md) para configuración de admin
- 📝 Consulta [CHANGELOG.md](CHANGELOG.md) para historial de cambios
- 🪟 Consulta [SETUP_WINDOWS.md](SETUP_WINDOWS.md) si estás en Windows

**Recursos:**
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- MongoDB Docs: https://docs.mongodb.com/
- Tailwind CSS Docs: https://tailwindcss.com/docs

**Contacto:**
- GitHub: [@farchodev](https://github.com/farchodev)
- Email: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

<div align="center">

**Made with ❤️ by FarchoDev**

v2.1.0 | Enero 2025

</div>

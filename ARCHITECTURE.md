# 🏗️ Arquitectura Técnica - FarchoDev Blog

## Índice
1. [Visión General de Arquitectura](#1-visión-general-de-arquitectura)
2. [Capas de la Aplicación](#2-capas-de-la-aplicación)
3. [Patrones de Diseño](#3-patrones-de-diseño)
4. [Flujo de Datos](#4-flujo-de-datos)
5. [Estructura de Base de Datos](#5-estructura-de-base-de-datos)
6. [Manejo de Estado](#6-manejo-de-estado)
7. [Seguridad](#7-seguridad)
8. [Escalabilidad](#8-escalabilidad)

---

## 1. Visión General de Arquitectura

### 1.1 Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                        │ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │  Public UI  │  │   Admin UI   │  │  Shared Comps.  │  │ │
│  │  │  (Navbar,   │  │  (Dashboard, │  │  (PostCard,     │  │ │
│  │  │   Home,     │  │   Editor,    │  │   Footer)       │  │ │
│  │  │   Blog)     │  │   Tables)    │  │                 │  │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         React Router (Routing)                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         Axios (HTTP Client)                          │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┬─┘ │
│                                                              │   │
└──────────────────────────────────────────────────────────────┼───┘
                                                               │
                              HTTP/REST (JSON)                 │
                              /api/* prefix                    │
                                                               │
┌──────────────────────────────────────────────────────────────▼───┐
│                        CAPA DE APLICACIÓN                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    FastAPI Application                      │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Routers & Endpoints                     │ │ │
│  │  │  ┌────────────────┐  ┌──────────────────────────┐  │ │ │
│  │  │  │ Public Routes  │  │    Admin Routes          │  │ │ │
│  │  │  │ /posts         │  │    /admin/posts          │  │ │ │
│  │  │  │ /categories    │  │    /admin/categories     │  │ │ │
│  │  │  │ /comments      │  │    /admin/comments       │  │ │ │
│  │  │  │ /newsletter    │  │    /admin/stats          │  │ │ │
│  │  │  └────────────────┘  └──────────────────────────┘  │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         Pydantic Models (Validation)                 │ │ │
│  │  │  Post, Category, Comment, Newsletter                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         Business Logic & Utilities                   │ │ │
│  │  │  create_slug(), calculate_reading_time()            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Middleware Layer                        │ │ │
│  │  │  CORS, Error Handling, Logging                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┬─┘ │
│                                                              │   │
└──────────────────────────────────────────────────────────────┼───┘
                                                               │
                           Motor Driver (Async)                │
                           MongoDB Wire Protocol               │
                                                               │
┌──────────────────────────────────────────────────────────────▼───┐
│                        CAPA DE PERSISTENCIA                       │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MongoDB Database                         │ │
│  │                                                             │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐          │ │
│  │  │   posts    │  │ categories │  │  comments  │          │ │
│  │  │ collection │  │ collection │  │ collection │          │ │
│  │  └────────────┘  └────────────┘  └────────────┘          │ │
│  │                                                             │ │
│  │  ┌────────────┐                                            │ │
│  │  │ newsletter │                                            │ │
│  │  │ collection │                                            │ │
│  │  └────────────┘                                            │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Indexes & Optimization                   │ │ │
│  │  │  slug (unique), published, category, tags            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 1.2 Arquitectura de Componentes Frontend

```
App.js (BrowserRouter)
│
├── Public Routes
│   │
│   ├── Home
│   │   ├── Navbar
│   │   ├── Hero Section
│   │   ├── Features Section
│   │   ├── Featured Post (PostCard)
│   │   ├── Recent Posts Grid (PostCard × n)
│   │   ├── NewsletterBox
│   │   └── Footer
│   │
│   ├── Blog
│   │   ├── Navbar
│   │   ├── Search & Filters
│   │   ├── Posts Grid (PostCard × n)
│   │   ├── Pagination
│   │   └── Footer
│   │
│   ├── PostDetail
│   │   ├── Navbar
│   │   ├── Post Content
│   │   ├── Comment Section
│   │   ├── Comment Form
│   │   ├── Related Posts
│   │   └── Footer
│   │
│   ├── Category
│   │   ├── Navbar
│   │   ├── Category Info
│   │   ├── Posts Grid (PostCard × n)
│   │   └── Footer
│   │
│   └── About
│       ├── Navbar
│       ├── About Content
│       ├── NewsletterBox
│       └── Footer
│
└── Admin Routes (AdminLayout wrapper)
    │
    ├── Dashboard
    │   ├── Stats Cards
    │   ├── Quick Actions
    │   └── Recent Activity
    │
    ├── Posts
    │   ├── Posts Table
    │   ├── Search & Filters
    │   └── Action Buttons (Edit, Delete)
    │
    ├── PostEditor
    │   ├── Form Fields
    │   ├── Rich Text Editor
    │   ├── Category Selector
    │   ├── Tags Input
    │   └── Publish Toggle
    │
    ├── Categories
    │   ├── Categories Grid
    │   ├── Create/Edit Form
    │   └── Action Buttons (Edit, Delete)
    │
    ├── Comments
    │   ├── Comments Table
    │   ├── Filter (All/Pending/Approved)
    │   └── Action Buttons (Approve, Delete)
    │
    └── Newsletter
        ├── Subscribers Table
        ├── Search
        └── Export Options
```

---

## 2. Capas de la Aplicación

### 2.1 Capa de Presentación (Frontend)

**Responsabilidades**:
- Renderizar interfaz de usuario
- Capturar interacciones del usuario
- Validación básica de formularios
- Gestión de estado local
- Comunicación con backend vía HTTP

**Tecnologías**:
- React 19 (componentes funcionales + hooks)
- Tailwind CSS (estilos)
- Radix UI (componentes accesibles)
- Axios (cliente HTTP)
- React Router (navegación)
- Sonner (notificaciones)

**Patrones**:
- **Componentes Funcionales**: Todo construido con functional components
- **Custom Hooks**: Reutilización de lógica (use-toast)
- **Props Drilling**: Paso de datos entre componentes padres/hijos
- **Conditional Rendering**: Basado en estado (loading, error, success)

### 2.2 Capa de Aplicación (Backend)

**Responsabilidades**:
- Lógica de negocio
- Validación de datos
- Procesamiento de requests
- Serialización/deserialización
- Autenticación y autorización (pendiente)
- Logging y monitoreo

**Tecnologías**:
- FastAPI (framework web)
- Pydantic (validación de datos)
- Uvicorn (servidor ASGI)

**Patrones**:
- **RESTful API**: Recursos identificados por URLs
- **Dependency Injection**: FastAPI DI system
- **Async/Await**: Todo es asíncrono
- **Schema Validation**: Pydantic models
- **Error Handling**: Try/catch con HTTPException

### 2.3 Capa de Persistencia (Database)

**Responsabilidades**:
- Almacenamiento de datos
- Queries y búsquedas
- Integridad de datos
- Indexación
- Backups

**Tecnologías**:
- MongoDB (NoSQL database)
- Motor (driver async para Python)

**Patrones**:
- **Document Store**: Datos en formato JSON/BSON
- **Schema-less**: Flexibilidad en estructura
- **Indexes**: Optimización de queries
- **UUID como Primary Key**: En lugar de ObjectID

---

## 3. Patrones de Diseño

### 3.1 Backend Patterns

#### Repository Pattern (Implícito)
```python
# Motor client actúa como repository
db.posts.find()        # Leer
db.posts.insert_one()  # Crear
db.posts.update_one()  # Actualizar
db.posts.delete_one()  # Eliminar
```

#### Factory Pattern
```python
def create_slug(title: str) -> str:
    """Factory para crear slugs"""
    # Transformación consistente de títulos a slugs
    ...
```

#### Strategy Pattern
```python
# Diferentes estrategias de query basadas en parámetros
@api_router.get("/posts")
async def get_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None
):
    query = {"published": True}
    
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [...]  # Strategy de búsqueda
    
    return await db.posts.find(query).to_list()
```

### 3.2 Frontend Patterns

#### Container/Presentational Pattern
```jsx
// Container (lógica)
function PostsContainer() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return <PostsList posts={posts} />;
}

// Presentational (UI)
function PostsList({ posts }) {
  return (
    <div>
      {posts.map(post => <PostCard post={post} />)}
    </div>
  );
}
```

#### Higher-Order Component Pattern
```jsx
// AdminLayout actúa como HOC
function AdminLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

#### Render Props Pattern
```jsx
// Usado en PostCard para diferentes variantes
<PostCard 
  post={post} 
  featured={true}  // Prop que controla renderizado
/>
```

---

## 4. Flujo de Datos

### 4.1 Flujo de Lectura de Posts

```
Usuario → Frontend → Backend → MongoDB
  ↓         ↓          ↓         ↓
Browser  React      FastAPI   Motor
         (Axios)    (Uvicorn)

Paso 1: Usuario navega a /blog
  ↓
Paso 2: React carga componente Blog.js
  ↓
Paso 3: useEffect() ejecuta fetchPosts()
  ↓
Paso 4: Axios hace GET /api/posts
  ↓
Paso 5: Request llega a FastAPI endpoint
  ↓
Paso 6: FastAPI valida query params (Pydantic)
  ↓
Paso 7: Motor ejecuta query en MongoDB
  ↓
Paso 8: MongoDB retorna documentos
  ↓
Paso 9: FastAPI serializa a JSON (Pydantic)
  ↓
Paso 10: Response HTTP con array de posts
  ↓
Paso 11: Axios recibe response.data
  ↓
Paso 12: React actualiza estado: setPosts(data)
  ↓
Paso 13: Re-render con nuevos datos
  ↓
Paso 14: Usuario ve posts en pantalla
```

### 4.2 Flujo de Creación de Post

```
Admin → Frontend → Backend → MongoDB
  ↓        ↓          ↓         ↓
Form    React      FastAPI   Motor
        (Axios)    (Uvicorn)

Paso 1: Admin completa formulario en PostEditor
  ↓
Paso 2: Admin hace click en "Guardar"
  ↓
Paso 3: handleSubmit() valida datos localmente
  ↓
Paso 4: Axios hace POST /api/admin/posts con body
  ↓
Paso 5: Request llega a FastAPI endpoint
  ↓
Paso 6: Pydantic valida PostCreate schema
  ↓
Paso 7: FastAPI ejecuta lógica de negocio:
        - Genera slug desde título
        - Calcula reading_time
        - Genera UUID
        - Establece published_at si published=true
  ↓
Paso 8: Crea objeto Post con datos procesados
  ↓
Paso 9: Serializa fechas a ISO strings
  ↓
Paso 10: Motor inserta documento en MongoDB
  ↓
Paso 11: MongoDB retorna confirmación
  ↓
Paso 12: FastAPI retorna Post creado (JSON)
  ↓
Paso 13: Frontend recibe response
  ↓
Paso 14: Muestra notificación de éxito (toast)
  ↓
Paso 15: Navega a /admin/posts
```

### 4.3 Flujo de Actualización de Categoría

```
Admin → Frontend → Backend → MongoDB
  ↓        ↓          ↓         ↓
Form    React      FastAPI   Motor
        (Axios)    (Uvicorn)

Paso 1: Admin hace click en "Editar" en categoría
  ↓
Paso 2: Frontend carga datos en formulario
  ↓
Paso 3: Admin modifica nombre/descripción
  ↓
Paso 4: Admin hace click en "Guardar"
  ↓
Paso 5: Axios hace PUT /api/admin/categories/{id}
  ↓
Paso 6: FastAPI busca categoría existente
  ↓
Paso 7: Si no existe → 404 Not Found
  ↓
Paso 8: Si existe:
        - Regenera slug desde nuevo nombre
        - Actualiza campos
  ↓
Paso 9: Motor ejecuta update en MongoDB
  ↓
Paso 10: MongoDB actualiza documento
  ↓
Paso 11: FastAPI retorna categoría actualizada
  ↓
Paso 12: Frontend muestra toast de éxito
  ↓
Paso 13: Recarga lista de categorías
```

---

## 5. Estructura de Base de Datos

### 5.1 Modelo de Datos Detallado

#### Colección: posts
```javascript
{
  // Identificación
  "id": "uuid-v4",           // Primary key (string)
  "slug": "url-friendly",    // Unique index
  
  // Contenido
  "title": "string",
  "content": "markdown text",
  "excerpt": "summary",
  
  // Metadata
  "author": "FarchoDev",
  "featured_image_url": "url",
  
  // Organización
  "category": "category-slug",  // Foreign key (string)
  "tags": ["tag1", "tag2"],     // Array of strings
  
  // Estado
  "published": boolean,
  "published_at": "ISO date" | null,
  
  // Timestamps
  "created_at": "ISO date",
  "updated_at": "ISO date",
  
  // Analytics
  "views_count": 0,
  "reading_time": 5  // minutos
}
```

**Índices**:
```javascript
db.posts.createIndex({ "slug": 1 }, { unique: true })
db.posts.createIndex({ "published": 1 })
db.posts.createIndex({ "category": 1 })
db.posts.createIndex({ "tags": 1 })
db.posts.createIndex({ "published_at": -1 })
db.posts.createIndex({ "created_at": -1 })
```

**Queries Comunes**:
```javascript
// Posts publicados ordenados por fecha
db.posts.find({ published: true })
  .sort({ published_at: -1 })
  .limit(10)

// Posts por categoría
db.posts.find({ 
  published: true, 
  category: "backend-development" 
})

// Posts por tag
db.posts.find({ 
  published: true, 
  tags: "python" 
})

// Búsqueda full-text
db.posts.find({
  published: true,
  $or: [
    { title: { $regex: "api", $options: "i" } },
    { content: { $regex: "api", $options: "i" } }
  ]
})

// Incrementar vistas
db.posts.updateOne(
  { id: "post-id" },
  { $inc: { views_count: 1 } }
)
```

#### Colección: categories
```javascript
{
  "id": "uuid-v4",
  "name": "Backend Development",
  "slug": "backend-development",  // Unique index
  "description": "optional text",
  "created_at": "ISO date"
}
```

**Índices**:
```javascript
db.categories.createIndex({ "slug": 1 }, { unique: true })
db.categories.createIndex({ "name": 1 })
```

#### Colección: comments
```javascript
{
  "id": "uuid-v4",
  "post_id": "uuid-v4",           // Foreign key
  "author_name": "string",
  "author_email": "email",
  "content": "comment text",
  "created_at": "ISO date",
  "approved": boolean             // Default: false
}
```

**Índices**:
```javascript
db.comments.createIndex({ "post_id": 1 })
db.comments.createIndex({ "approved": 1 })
db.comments.createIndex({ "created_at": -1 })
```

**Queries Comunes**:
```javascript
// Comentarios de un post (públicos)
db.comments.find({ 
  post_id: "post-id", 
  approved: true 
}).sort({ created_at: -1 })

// Comentarios pendientes (admin)
db.comments.find({ approved: false })
  .sort({ created_at: -1 })
```

#### Colección: newsletter
```javascript
{
  "id": "uuid-v4",
  "email": "user@example.com",   // Unique index
  "subscribed_at": "ISO date",
  "active": boolean              // Default: true
}
```

**Índices**:
```javascript
db.newsletter.createIndex({ "email": 1 }, { unique: true })
db.newsletter.createIndex({ "active": 1 })
```

### 5.2 Relaciones entre Colecciones

```
┌──────────────┐
│  categories  │
│              │
│  id (PK)     │←─────────┐
│  name        │          │
│  slug        │          │ Relationship
│  ...         │          │ (1:N)
└──────────────┘          │
                          │
                          │
┌──────────────┐          │
│    posts     │          │
│              │          │
│  id (PK)     │          │
│  category ───┼──────────┘
│  tags[]      │
│  ...         │
└──────┬───────┘
       │
       │ Relationship
       │ (1:N)
       │
       ▼
┌──────────────┐
│   comments   │
│              │
│  id (PK)     │
│  post_id (FK)│
│  ...         │
└──────────────┘
```

**Nota**: MongoDB no tiene foreign keys nativos, pero mantenemos integridad referencial en la aplicación.

---

## 6. Manejo de Estado

### 6.1 Estado en Frontend

#### Estado Local (useState)
Usado para:
- Datos de formularios
- Estados de carga (loading)
- Modales abiertos/cerrados
- Filtros y búsquedas locales

```jsx
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
```

#### Efectos (useEffect)
Usado para:
- Cargar datos al montar componente
- Reaccionar a cambios de parámetros de ruta
- Cleanup al desmontar

```jsx
useEffect(() => {
  fetchPosts();
}, [category]); // Re-ejecuta cuando category cambia
```

#### Estado de Navegación (useLocation, useParams)
```jsx
const location = useLocation();  // Ruta actual
const { slug } = useParams();    // Parámetros de URL
```

### 6.2 Flujo de Estado Típico

```
Initial State
     ↓
Component Mount → useEffect ejecuta
     ↓
setLoading(true)
     ↓
API Call (async)
     ↓
Response recibida
     ↓
setData(response.data)
setLoading(false)
     ↓
Component Re-render
     ↓
UI actualizada
```

---

## 7. Seguridad

### 7.1 Configuración Actual

**Backend**:
- ✅ CORS configurado (puede ser restrictivo en producción)
- ✅ Validación de entrada con Pydantic
- ✅ Manejo de errores
- ❌ NO hay autenticación en endpoints admin (pendiente)
- ❌ NO hay rate limiting (pendiente)

**Frontend**:
- ✅ Validación básica de formularios
- ✅ HTTPS en producción (si se configura)
- ❌ NO hay protección de rutas admin (pendiente)

### 7.2 Mejoras de Seguridad Recomendadas

#### Autenticación JWT
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_admin(credentials = Depends(security)):
    token = credentials.credentials
    # Verificar JWT token
    if not is_valid_token(token):
        raise HTTPException(status_code=401)
    return token

@api_router.post("/admin/posts", dependencies=[Depends(verify_admin)])
async def create_post(post_data: PostCreate):
    ...
```

#### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/comments")
@limiter.limit("5/minute")
async def create_comment(request: Request, ...):
    ...
```

#### Sanitización de Input
```python
import bleach

def sanitize_html(content: str) -> str:
    """Sanitizar contenido HTML para prevenir XSS"""
    return bleach.clean(content)
```

---

## 8. Escalabilidad

### 8.1 Estrategias de Escalabilidad

#### Escalado Horizontal (Backend)
```
Load Balancer
      │
      ├──> FastAPI Instance 1 ──┐
      │                          │
      ├──> FastAPI Instance 2 ──┼──> MongoDB
      │                          │
      └──> FastAPI Instance 3 ──┘
```

**Implementación**:
- Usar Gunicorn con múltiples workers
- Nginx como load balancer
- Stateless backend (no sesiones en memoria)

#### Caché (Redis)
```
Frontend → Nginx → FastAPI → Redis (cache)
                      │              ↓
                      └─────────> MongoDB (fallback)
```

**Casos de uso**:
- Posts más visitados
- Categorías (cambian raramente)
- Estadísticas del dashboard

#### CDN para Imágenes
```
Frontend → CDN (imágenes) → S3/Cloud Storage
    ↓
Backend API (solo metadata)
```

### 8.2 Optimizaciones de Base de Datos

#### Índices Compuestos
```javascript
// Para queries frecuentes
db.posts.createIndex({ 
  published: 1, 
  category: 1, 
  published_at: -1 
})
```

#### Agregaciones Eficientes
```javascript
// Para dashboard stats
db.posts.aggregate([
  { $match: { published: true } },
  { $group: { 
    _id: "$category", 
    count: { $sum: 1 } 
  }}
])
```

#### Proyecciones
```javascript
// No cargar campos innecesarios
db.posts.find(
  { published: true },
  { 
    id: 1, 
    title: 1, 
    excerpt: 1, 
    category: 1 
    // Excluir 'content' para listados
  }
)
```

### 8.3 Optimizaciones de Frontend

#### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

#### Memoization
```jsx
const PostsList = React.memo(({ posts }) => {
  return posts.map(post => <PostCard key={post.id} post={post} />);
});

// En componente padre
const filteredPosts = useMemo(() => {
  return posts.filter(p => p.category === selectedCategory);
}, [posts, selectedCategory]);
```

#### Virtual Scrolling
Para listas muy largas:
```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={posts.length}
  itemSize={200}
>
  {({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## 9. Monitoreo y Observabilidad

### 9.1 Logging Estructurado

```python
import logging
import json

logger = logging.getLogger(__name__)

@api_router.post("/posts")
async def create_post(post_data: PostCreate):
    logger.info(json.dumps({
        "event": "post_created",
        "title": post_data.title,
        "category": post_data.category,
        "published": post_data.published,
        "timestamp": datetime.now().isoformat()
    }))
    ...
```

### 9.2 Métricas

```python
from prometheus_client import Counter, Histogram

post_created_counter = Counter(
    'posts_created_total', 
    'Total posts created'
)

request_latency = Histogram(
    'request_latency_seconds', 
    'Request latency in seconds'
)

@api_router.post("/posts")
async def create_post(...):
    post_created_counter.inc()
    with request_latency.time():
        # Lógica del endpoint
        ...
```

### 9.3 Health Checks

```python
@api_router.get("/health")
async def health_check():
    # Verificar MongoDB
    try:
        await db.command("ping")
        db_status = "healthy"
    except:
        db_status = "unhealthy"
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "timestamp": datetime.now().isoformat()
    }
```

---

## 10. Diagrama de Secuencia: Crear Post

```
Admin     Frontend      Backend       MongoDB
  │           │            │             │
  │  Fill     │            │             │
  │  Form     │            │             │
  ├──────────>│            │             │
  │           │            │             │
  │  Click    │            │             │
  │  Save     │            │             │
  ├──────────>│            │             │
  │           │            │             │
  │           │ POST       │             │
  │           │ /api/admin/posts         │
  │           ├──────────> │             │
  │           │            │             │
  │           │            │ Validate    │
  │           │            │ (Pydantic)  │
  │           │            │             │
  │           │            │ Generate    │
  │           │            │ slug, UUID  │
  │           │            │             │
  │           │            │ INSERT      │
  │           │            ├──────────>  │
  │           │            │             │
  │           │            │   ACK       │
  │           │            │<──────────  │
  │           │            │             │
  │           │  Response  │             │
  │           │  (Post)    │             │
  │           │<──────────  │            │
  │           │            │             │
  │  Toast    │            │             │
  │  Success  │            │             │
  │<──────────│            │             │
  │           │            │             │
  │  Navigate │            │             │
  │  to list  │            │             │
  │<──────────│            │             │
```

---

Este documento proporciona una visión profunda de la arquitectura técnica del proyecto. Para información más práctica, consulta [DOCUMENTATION.md](./DOCUMENTATION.md).

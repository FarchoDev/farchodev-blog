# 📚 FarchoDev Blog - Documentación Completa del Proyecto

## 📋 Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura Técnica](#2-arquitectura-técnica)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Backend - FastAPI](#4-backend---fastapi)
5. [Frontend - React](#5-frontend---react)
6. [Base de Datos - MongoDB](#6-base-de-datos---mongodb)
7. [Flujos de Trabajo](#7-flujos-de-trabajo)
8. [Guía de Desarrollo](#8-guía-de-desarrollo)
9. [API Reference](#9-api-reference)
10. [Variables de Entorno](#10-variables-de-entorno)
11. [Testing](#11-testing)
12. [Despliegue](#12-despliegue)

---

## 1. Visión General del Proyecto

### 1.1 Descripción

**FarchoDev Blog** es una plataforma de blog completa especializada en desarrollo de software. El proyecto está construido como una aplicación full-stack que permite:

- **Lectura pública de artículos** con sistema de categorías, búsqueda y filtrado
- **Panel de administración** completo para gestionar contenido
- **Sistema de comentarios** con moderación
- **Newsletter** para suscriptores
- **Estadísticas** del blog en tiempo real

### 1.2 Características Principales

#### Para Usuarios Públicos:
- ✅ Explorar artículos publicados
- ✅ Filtrar por categorías y tags
- ✅ Búsqueda de contenido
- ✅ Sistema de comentarios
- ✅ Suscripción a newsletter
- ✅ Contador de vistas por artículo
- ✅ Tiempo estimado de lectura

#### Para Administradores:
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de posts (Crear, Leer, Actualizar, Eliminar)
- ✅ Gestión de categorías (Crear, Editar, Eliminar)
- ✅ Moderación de comentarios
- ✅ Gestión de suscriptores
- ✅ Publicación/despublicación de posts
- ✅ Editor de posts con preview

### 1.3 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React | 19.0.0 |
| **Routing** | React Router DOM | 7.5.1 |
| **Estilos** | Tailwind CSS | 3.4.17 |
| **Componentes UI** | Radix UI | Varios |
| **HTTP Client** | Axios | 1.8.4 |
| **Iconos** | Lucide React | 0.507.0 |
| **Notificaciones** | Sonner | 2.0.3 |
| **Backend** | FastAPI | 0.110.1 |
| **Servidor** | Uvicorn | 0.25.0 |
| **Base de Datos** | MongoDB | Motor 3.3.1 |
| **ODM** | Motor (Async) | 3.3.1 |
| **Validación** | Pydantic | 2.6.4+ |

---

## 2. Arquitectura Técnica

### 2.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│                     Puerto 3000                              │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │  Páginas   │  │ Componentes│  │  Admin Panel        │  │
│  │  Públicas  │  │     UI     │  │  (Dashboard, CRUD)  │  │
│  └────────────┘  └────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Router + Axios + Tailwind CSS                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │ /api/*
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│                     Puerto 8001                              │
│                                                              │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Public Routes  │  │ Admin Routes │  │   Middleware  │ │
│  │  /api/posts     │  │ /api/admin/* │  │   (CORS)      │ │
│  │  /api/categories│  │              │  └───────────────┘ │
│  └─────────────────┘  └──────────────┘                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pydantic Models + Utility Functions                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────────────┘
                      │
                      │ Motor (Async MongoDB Driver)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB                                   │
│                    Puerto 27017                              │
│                                                              │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │  posts   │  │ categories │  │ comments │  │newsletter│ │
│  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Comunicación

1. **Usuario → Frontend**: El navegador carga la aplicación React desde el puerto 3000
2. **Frontend → Backend**: Las solicitudes HTTP se envían a través de Axios al puerto 8001 con prefijo `/api`
3. **Backend → MongoDB**: FastAPI utiliza Motor (driver asíncrono) para comunicarse con MongoDB
4. **MongoDB → Backend → Frontend → Usuario**: Los datos fluyen de vuelta a través de la misma cadena

### 2.3 Principios de Diseño

- **Separación de Responsabilidades**: Frontend y Backend completamente desacoplados
- **API RESTful**: Endpoints claros y semánticos
- **Asincronía**: Todo el backend es asíncrono para mejor rendimiento
- **Validación**: Pydantic valida todos los datos de entrada/salida
- **Componentización**: Frontend construido con componentes reutilizables
- **Responsive Design**: Diseño adaptable a todos los tamaños de pantalla

---

## 3. Estructura de Directorios

### 3.1 Vista General

```
/app/
├── backend/                    # Backend FastAPI
│   ├── .env                   # Variables de entorno del backend
│   ├── server.py              # Aplicación principal FastAPI
│   └── requirements.txt       # Dependencias Python
│
├── frontend/                   # Frontend React
│   ├── public/                # Archivos públicos estáticos
│   ├── src/                   # Código fuente React
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── ui/           # Componentes UI de Radix
│   │   │   ├── AdminLayout.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── NewsletterBox.js
│   │   │   └── PostCard.js
│   │   │
│   │   ├── pages/            # Páginas de la aplicación
│   │   │   ├── admin/        # Páginas del panel admin
│   │   │   │   ├── Categories.js
│   │   │   │   ├── Comments.js
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Newsletter.js
│   │   │   │   ├── PostEditor.js
│   │   │   │   └── Posts.js
│   │   │   │
│   │   │   ├── About.js      # Página "Acerca de"
│   │   │   ├── Blog.js       # Listado de posts
│   │   │   ├── Category.js   # Posts por categoría
│   │   │   ├── Home.js       # Página principal
│   │   │   └── PostDetail.js # Detalle de un post
│   │   │
│   │   ├── hooks/            # Custom React Hooks
│   │   │   └── use-toast.js
│   │   │
│   │   ├── lib/              # Utilidades
│   │   │   └── utils.js
│   │   │
│   │   ├── App.css           # Estilos globales
│   │   ├── App.js            # Componente principal
│   │   ├── index.css         # Estilos base
│   │   └── index.js          # Punto de entrada
│   │
│   ├── .env                   # Variables de entorno del frontend
│   ├── package.json           # Dependencias y scripts
│   ├── tailwind.config.js     # Configuración de Tailwind
│   ├── craco.config.js        # Configuración de CRACO
│   └── jsconfig.json          # Configuración de JS
│
├── tests/                      # Tests del proyecto
│   └── __init__.py
│
├── backend_test.py             # Tests del backend
├── test_result.md              # Resultados de testing
└── README.md                   # Documentación básica
```

### 3.2 Descripción de Carpetas Clave

#### Backend (`/app/backend/`)
- `server.py`: Contiene toda la lógica del servidor FastAPI, modelos Pydantic, y endpoints
- `requirements.txt`: Lista de todas las dependencias Python necesarias
- `.env`: Configuración de conexión a MongoDB y variables de entorno

#### Frontend (`/app/frontend/src/`)
- **`components/`**: Componentes React reutilizables
  - `ui/`: Componentes de UI de la librería Radix UI
  - Componentes de layout: `Navbar.js`, `Footer.js`, `AdminLayout.js`
  - Componentes de contenido: `PostCard.js`, `NewsletterBox.js`

- **`pages/`**: Páginas completas de la aplicación
  - Páginas públicas: `Home.js`, `Blog.js`, `PostDetail.js`, `Category.js`, `About.js`
  - Páginas admin: Todas en subcarpeta `admin/`

- **`hooks/`**: Custom hooks de React para lógica reutilizable

- **`lib/`**: Funciones utilitarias y helpers

---

## 4. Backend - FastAPI

### 4.1 Estructura del Archivo `server.py`

El archivo `server.py` está organizado en las siguientes secciones:

```python
# 1. Imports y configuración inicial
# 2. Conexión a MongoDB
# 3. Configuración de la app FastAPI
# 4. Funciones utilitarias
# 5. Modelos Pydantic
# 6. Rutas públicas
# 7. Rutas de administración
# 8. Middleware y configuración final
```

### 4.2 Modelos de Datos (Pydantic)

#### Category (Categoría)
```python
class Category(BaseModel):
    id: str                    # UUID generado automáticamente
    name: str                  # Nombre de la categoría
    slug: str                  # URL-friendly slug
    description: Optional[str] # Descripción opcional
    created_at: datetime       # Fecha de creación
```

#### Post (Artículo)
```python
class Post(BaseModel):
    id: str                         # UUID generado automáticamente
    title: str                      # Título del post
    slug: str                       # URL-friendly slug
    content: str                    # Contenido completo (Markdown)
    excerpt: str                    # Resumen/extracto
    author: str = "FarchoDev"       # Autor (por defecto)
    featured_image_url: Optional[str] # URL de imagen destacada
    category: str                   # ID de la categoría
    tags: List[str] = []           # Lista de tags
    published: bool = False         # Estado de publicación
    published_at: Optional[datetime] # Fecha de publicación
    created_at: datetime            # Fecha de creación
    updated_at: datetime            # Última actualización
    views_count: int = 0            # Contador de vistas
    reading_time: int = 1           # Tiempo de lectura (minutos)
```

#### Comment (Comentario)
```python
class Comment(BaseModel):
    id: str              # UUID generado automáticamente
    post_id: str         # ID del post asociado
    author_name: str     # Nombre del autor
    author_email: str    # Email del autor
    content: str         # Contenido del comentario
    created_at: datetime # Fecha de creación
    approved: bool = False # Estado de aprobación
```

#### Newsletter (Suscripción)
```python
class Newsletter(BaseModel):
    id: str                # UUID generado automáticamente
    email: str             # Email del suscriptor
    subscribed_at: datetime # Fecha de suscripción
    active: bool = True    # Estado de la suscripción
```

### 4.3 Funciones Utilitarias

#### `create_slug(title: str) -> str`
Convierte un título en un slug URL-friendly:
- Convierte a minúsculas
- Elimina caracteres especiales
- Reemplaza espacios con guiones
- Limita a 100 caracteres

**Ejemplo:**
```python
create_slug("Introducción a FastAPI y Python")
# Output: "introduccion-a-fastapi-y-python"
```

#### `calculate_reading_time(content: str) -> int`
Calcula el tiempo estimado de lectura:
- Asume 200 palabras por minuto
- Retorna mínimo 1 minuto

**Ejemplo:**
```python
calculate_reading_time("contenido de 400 palabras...")
# Output: 2  # minutos
```

### 4.4 Endpoints Principales

#### Endpoints Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/` | Mensaje de bienvenida |
| `GET` | `/api/posts` | Listar posts publicados con filtros |
| `GET` | `/api/posts/{slug}` | Obtener un post por su slug |
| `POST` | `/api/posts/{post_id}/view` | Incrementar contador de vistas |
| `GET` | `/api/categories` | Listar todas las categorías |
| `POST` | `/api/comments` | Crear un comentario (requiere aprobación) |
| `GET` | `/api/posts/{post_id}/comments` | Obtener comentarios aprobados |
| `POST` | `/api/newsletter/subscribe` | Suscribirse a newsletter |

#### Endpoints de Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/posts` | Listar todos los posts (incluye borradores) |
| `POST` | `/api/admin/posts` | Crear un nuevo post |
| `PUT` | `/api/admin/posts/{post_id}` | Actualizar un post |
| `DELETE` | `/api/admin/posts/{post_id}` | Eliminar un post |
| `POST` | `/api/admin/categories` | Crear una categoría |
| `PUT` | `/api/admin/categories/{category_id}` | Actualizar una categoría |
| `DELETE` | `/api/admin/categories/{category_id}` | Eliminar una categoría |
| `GET` | `/api/admin/comments` | Listar todos los comentarios |
| `PUT` | `/api/admin/comments/{comment_id}/approve` | Aprobar un comentario |
| `DELETE` | `/api/admin/comments/{comment_id}` | Eliminar un comentario |
| `GET` | `/api/admin/stats` | Obtener estadísticas del blog |

### 4.5 Lógica de Negocio Importante

#### Publicación de Posts
- Un post puede estar en estado `draft` (borrador) o `published` (publicado)
- Solo posts publicados aparecen en endpoints públicos
- Al publicar un post por primera vez, se establece `published_at` automáticamente

#### Gestión de Slugs
- Los slugs se generan automáticamente desde el título
- Se regeneran al actualizar el título de un post o categoría
- Garantiza URLs amigables y SEO-friendly

#### Tiempo de Lectura
- Se calcula automáticamente al crear o actualizar un post
- Basado en el conteo de palabras del contenido
- Se actualiza automáticamente si cambia el contenido

#### Comentarios con Moderación
- Todos los comentarios nuevos tienen `approved: false`
- Solo comentarios aprobados aparecen en la vista pública
- Los administradores pueden aprobar o eliminar comentarios

---

## 5. Frontend - React

### 5.1 Arquitectura del Frontend

El frontend sigue una arquitectura basada en componentes con las siguientes capas:

```
┌─────────────────────────────────────────┐
│         App.js (Router Principal)       │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼───────┐   ┌──────▼──────────┐
│ Páginas       │   │  Admin Pages    │
│ Públicas      │   │  (AdminLayout)  │
└───────┬───────┘   └──────┬──────────┘
        │                   │
        │                   │
┌───────▼───────────────────▼──────────┐
│      Componentes Compartidos         │
│  (Navbar, Footer, PostCard, etc.)    │
└──────────────────────────────────────┘
```

### 5.2 Componentes Principales

#### 5.2.1 Componentes de Layout

##### `Navbar.js`
**Propósito**: Barra de navegación superior fija

**Características**:
- Logo de FarchoDev
- Navegación a Home, Blog, Acerca de
- Botón de acceso al Admin
- Menú responsive para móviles
- Indicador de página activa

**Props**: Ninguna (usa `useLocation` de React Router)

##### `Footer.js`
**Propósito**: Pie de página del sitio

**Características**:
- Información del blog
- Enlaces a páginas principales
- Información de contacto/redes sociales
- Copyright

##### `AdminLayout.js`
**Propósito**: Layout wrapper para todas las páginas de administración

**Características**:
- Sidebar lateral con navegación admin
- Logo y título del panel
- Enlaces a Dashboard, Posts, Categorías, Comentarios, Newsletter
- Indicador de página activa
- Botón "Volver al Sitio"

**Props**:
```javascript
{
  children: ReactNode  // Contenido de la página admin
}
```

#### 5.2.2 Componentes de Contenido

##### `PostCard.js`
**Propósito**: Tarjeta de vista previa de un post

**Características**:
- Imagen destacada
- Título y excerpt
- Categoría y tags
- Tiempo de lectura
- Vista adaptable (normal vs featured)

**Props**:
```javascript
{
  post: Object,          // Objeto post completo
  featured: Boolean      // Si es tarjeta destacada (más grande)
}
```

##### `NewsletterBox.js`
**Propósito**: Formulario de suscripción a newsletter

**Características**:
- Input de email con validación
- Manejo de estado de carga
- Notificaciones de éxito/error
- Diseño atractivo con gradientes

### 5.3 Páginas Públicas

#### 5.3.1 `Home.js` - Página Principal

**Ruta**: `/`

**Funcionalidad**:
- Sección hero con título y CTAs
- Sección de características (3 cards)
- Post destacado (el más reciente)
- Grid de posts recientes (5 posts)
- Caja de suscripción a newsletter

**Estado Manejado**:
```javascript
{
  featuredPosts: Array,   // Post destacado
  recentPosts: Array,     // Posts recientes
  loading: Boolean        // Estado de carga
}
```

**API Calls**:
- `GET /api/posts?limit=6` - Obtiene los 6 posts más recientes

#### 5.3.2 `Blog.js` - Listado de Posts

**Ruta**: `/blog`

**Funcionalidad**:
- Listado completo de posts publicados
- Filtros por categoría
- Búsqueda por texto
- Paginación
- Grid responsive de PostCards

**Estado Manejado**:
```javascript
{
  posts: Array,           // Lista de posts
  categories: Array,      // Lista de categorías para filtros
  loading: Boolean,
  searchTerm: String,     // Término de búsqueda
  selectedCategory: String // Categoría seleccionada
}
```

**API Calls**:
- `GET /api/posts` - Con parámetros de filtro y búsqueda
- `GET /api/categories` - Para mostrar filtros

#### 5.3.3 `PostDetail.js` - Detalle de Post

**Ruta**: `/post/:slug`

**Funcionalidad**:
- Muestra post completo
- Incrementa contador de vistas al cargar
- Sección de comentarios
- Formulario para agregar comentarios
- Posts relacionados (misma categoría)

**Estado Manejado**:
```javascript
{
  post: Object,           // Post completo
  comments: Array,        // Comentarios aprobados
  relatedPosts: Array,    // Posts relacionados
  loading: Boolean,
  commentForm: Object     // Datos del formulario de comentario
}
```

**API Calls**:
- `GET /api/posts/{slug}` - Obtener post
- `POST /api/posts/{post_id}/view` - Incrementar vistas
- `GET /api/posts/{post_id}/comments` - Obtener comentarios
- `POST /api/comments` - Crear comentario

#### 5.3.4 `Category.js` - Posts por Categoría

**Ruta**: `/category/:category`

**Funcionalidad**:
- Muestra posts filtrados por categoría
- Información de la categoría
- Grid de PostCards

**Estado Manejado**:
```javascript
{
  posts: Array,
  categoryInfo: Object,
  loading: Boolean
}
```

**API Calls**:
- `GET /api/posts?category={category}` - Posts filtrados
- `GET /api/categories` - Info de categorías

#### 5.3.5 `About.js` - Acerca de

**Ruta**: `/about`

**Funcionalidad**:
- Información sobre el blog
- Misión y visión
- Información sobre el autor
- Suscripción a newsletter

### 5.4 Páginas de Administración

#### 5.4.1 `Dashboard.js` - Panel Principal

**Ruta**: `/admin`

**Funcionalidad**:
- Cards con estadísticas principales:
  - Total de posts
  - Posts publicados
  - Posts en borrador
  - Comentarios pendientes
  - Comentarios aprobados
  - Suscriptores activos
  - Total de vistas
- Gráficos y métricas visuales
- Accesos rápidos a secciones

**API Calls**:
- `GET /api/admin/stats` - Obtener todas las estadísticas

#### 5.4.2 `Posts.js` - Gestión de Posts

**Ruta**: `/admin/posts`

**Funcionalidad**:
- Tabla con todos los posts (publicados y borradores)
- Botón para crear nuevo post
- Botones de editar y eliminar por post
- Indicador visual de estado (publicado/borrador)
- Búsqueda y filtros

**Estado Manejado**:
```javascript
{
  posts: Array,
  loading: Boolean,
  searchTerm: String
}
```

**API Calls**:
- `GET /api/admin/posts` - Obtener todos los posts
- `DELETE /api/admin/posts/{post_id}` - Eliminar post

#### 5.4.3 `PostEditor.js` - Editor de Posts

**Ruta**: 
- `/admin/posts/new` (crear)
- `/admin/posts/edit/:id` (editar)

**Funcionalidad**:
- Formulario completo para crear/editar posts
- Campos:
  - Título
  - Contenido (textarea grande)
  - Excerpt
  - Categoría (selector)
  - Tags (input con chips)
  - Imagen destacada (URL)
  - Estado de publicación (switch)
- Vista previa del post
- Validación de campos
- Auto-guardado (opcional)

**Estado Manejado**:
```javascript
{
  formData: Object,       // Datos del formulario
  categories: Array,      // Para el selector
  loading: Boolean,
  isEditMode: Boolean,    // true si está editando
  postId: String          // ID del post en edición
}
```

**API Calls**:
- `GET /api/admin/posts` (si es edición) - Obtener post existente
- `GET /api/categories` - Para el selector
- `POST /api/admin/posts` - Crear post
- `PUT /api/admin/posts/{post_id}` - Actualizar post

#### 5.4.4 `Categories.js` - Gestión de Categorías

**Ruta**: `/admin/categories`

**Funcionalidad**:
- Grid de tarjetas con todas las categorías
- Botón para crear nueva categoría
- Formulario modal/inline para crear/editar
- Botones de editar y eliminar por categoría
- Confirmación antes de eliminar

**Estado Manejado**:
```javascript
{
  categories: Array,
  loading: Boolean,
  showForm: Boolean,      // Mostrar formulario
  editingCategory: Object, // Categoría en edición (null si es nueva)
  formData: Object        // Datos del formulario
}
```

**Funcionalidades Recientes** (mejoras implementadas):
- ✅ Editar categorías existentes
- ✅ Eliminar categorías con confirmación
- ✅ Reutilización del formulario para crear/editar
- ✅ Notificaciones toast de éxito/error

**API Calls**:
- `GET /api/categories` - Obtener categorías
- `POST /api/admin/categories` - Crear categoría
- `PUT /api/admin/categories/{category_id}` - Actualizar categoría
- `DELETE /api/admin/categories/{category_id}` - Eliminar categoría

#### 5.4.5 `Comments.js` - Moderación de Comentarios

**Ruta**: `/admin/comments`

**Funcionalidad**:
- Lista de todos los comentarios (aprobados y pendientes)
- Filtro por estado (todos/pendientes/aprobados)
- Botón para aprobar comentarios pendientes
- Botón para eliminar comentarios
- Información del post asociado
- Información del autor (nombre y email)

**Estado Manejado**:
```javascript
{
  comments: Array,
  loading: Boolean,
  filter: String          // 'all', 'pending', 'approved'
}
```

**API Calls**:
- `GET /api/admin/comments` - Obtener todos los comentarios
- `PUT /api/admin/comments/{comment_id}/approve` - Aprobar comentario
- `DELETE /api/admin/comments/{comment_id}` - Eliminar comentario

#### 5.4.6 `Newsletter.js` - Gestión de Suscriptores

**Ruta**: `/admin/newsletter`

**Funcionalidad**:
- Tabla con todos los suscriptores
- Información de fecha de suscripción
- Estado activo/inactivo
- Opciones de exportar lista
- Búsqueda de suscriptores

**Estado Manejado**:
```javascript
{
  subscribers: Array,
  loading: Boolean,
  searchTerm: String
}
```

### 5.5 Configuración de Rutas

El archivo `App.js` define todas las rutas de la aplicación:

```javascript
<Routes>
  {/* Rutas Públicas */}
  <Route path="/" element={<Home />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/post/:slug" element={<PostDetail />} />
  <Route path="/category/:category" element={<Category />} />
  <Route path="/about" element={<About />} />
  
  {/* Rutas de Administración */}
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/posts" element={<AdminPosts />} />
  <Route path="/admin/posts/new" element={<AdminPostEditor />} />
  <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />
  <Route path="/admin/categories" element={<AdminCategories />} />
  <Route path="/admin/comments" element={<AdminComments />} />
  <Route path="/admin/newsletter" element={<AdminNewsletter />} />
</Routes>
```

### 5.6 Gestión de Estado

El proyecto utiliza **React Hooks** para la gestión de estado:

- `useState` - Para estado local de componentes
- `useEffect` - Para efectos secundarios (API calls)
- `useParams` - Para obtener parámetros de ruta
- `useLocation` - Para obtener información de la ruta actual
- `useNavigate` - Para navegación programática

### 5.7 Comunicación con el Backend

Toda la comunicación se realiza mediante **Axios** con la siguiente configuración:

```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Ejemplo de llamada
const response = await axios.get(`${API}/posts`);
```

**Patrones comunes**:

```javascript
// GET Request
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${API}/posts`);
    setPosts(response.data);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar datos');
  } finally {
    setLoading(false);
  }
};

// POST Request
const createPost = async (postData) => {
  try {
    await axios.post(`${API}/admin/posts`, postData);
    toast.success('Post creado exitosamente');
    navigate('/admin/posts');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al crear post');
  }
};

// PUT Request
const updatePost = async (postId, updateData) => {
  try {
    await axios.put(`${API}/admin/posts/${postId}`, updateData);
    toast.success('Post actualizado');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al actualizar');
  }
};

// DELETE Request
const deletePost = async (postId) => {
  if (!window.confirm('¿Estás seguro?')) return;
  
  try {
    await axios.delete(`${API}/admin/posts/${postId}`);
    toast.success('Post eliminado');
    fetchPosts(); // Recargar lista
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al eliminar');
  }
};
```

### 5.8 Sistema de Notificaciones

Se utiliza **Sonner** para mostrar notificaciones toast:

```javascript
import { toast } from 'sonner';

// Éxito
toast.success('Operación exitosa');

// Error
toast.error('Ha ocurrido un error');

// Información
toast.info('Información importante');

// Advertencia
toast.warning('Ten cuidado');
```

### 5.9 Estilos y Diseño

#### Tailwind CSS
El proyecto utiliza Tailwind CSS para todos los estilos:

**Clases personalizadas definidas en `index.css`**:
```css
.btn-primary {
  /* Botón principal con gradiente teal */
}

.btn-secondary {
  /* Botón secundario con borde */
}

.glass-effect {
  /* Efecto glassmorphism */
}

.gradient-text {
  /* Texto con gradiente */
}
```

**Paleta de colores principal**:
- Primary: Teal (700, 600, 500)
- Secondary: Orange (500)
- Accent: Blue (600)
- Background: Gray (50, 100)
- Text: Gray (900, 600)

#### Componentes Radix UI
Se utilizan componentes de Radix UI para elementos interactivos:
- Dialogs
- Dropdowns
- Tooltips
- Accordions
- Y más...

#### Responsive Design
Breakpoints de Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Ejemplo de uso:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 columna móvil, 2 tablet, 3 desktop */}
</div>
```

---

## 6. Base de Datos - MongoDB

### 6.1 Estructura de la Base de Datos

El proyecto utiliza **MongoDB** como base de datos NoSQL. La base de datos se llama `test_database` (configurable via `.env`).

### 6.2 Colecciones

#### 6.2.1 Colección `posts`

Almacena todos los artículos del blog.

**Estructura del documento**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Introducción a FastAPI",
  "slug": "introduccion-a-fastapi",
  "content": "Contenido completo del artículo en markdown...",
  "excerpt": "FastAPI es un framework moderno y rápido...",
  "author": "FarchoDev",
  "featured_image_url": "https://example.com/image.jpg",
  "category": "backend",
  "tags": ["python", "fastapi", "api"],
  "published": true,
  "published_at": "2025-07-15T10:30:00Z",
  "created_at": "2025-07-14T08:00:00Z",
  "updated_at": "2025-07-15T10:30:00Z",
  "views_count": 142,
  "reading_time": 5
}
```

**Índices recomendados**:
```javascript
db.posts.createIndex({ slug: 1 }, { unique: true })
db.posts.createIndex({ published: 1 })
db.posts.createIndex({ category: 1 })
db.posts.createIndex({ tags: 1 })
db.posts.createIndex({ published_at: -1 })
```

#### 6.2.2 Colección `categories`

Almacena las categorías del blog.

**Estructura del documento**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Backend Development",
  "slug": "backend-development",
  "description": "Artículos sobre desarrollo backend",
  "created_at": "2025-07-01T00:00:00Z"
}
```

**Índices recomendados**:
```javascript
db.categories.createIndex({ slug: 1 }, { unique: true })
db.categories.createIndex({ name: 1 })
```

#### 6.2.3 Colección `comments`

Almacena los comentarios de los posts.

**Estructura del documento**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "post_id": "550e8400-e29b-41d4-a716-446655440000",
  "author_name": "Juan Pérez",
  "author_email": "juan@example.com",
  "content": "Excelente artículo, muy útil!",
  "created_at": "2025-07-16T14:20:00Z",
  "approved": true
}
```

**Índices recomendados**:
```javascript
db.comments.createIndex({ post_id: 1 })
db.comments.createIndex({ approved: 1 })
db.comments.createIndex({ created_at: -1 })
```

#### 6.2.4 Colección `newsletter`

Almacena los suscriptores al newsletter.

**Estructura del documento**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "email": "usuario@example.com",
  "subscribed_at": "2025-07-16T10:00:00Z",
  "active": true
}
```

**Índices recomendados**:
```javascript
db.newsletter.createIndex({ email: 1 }, { unique: true })
db.newsletter.createIndex({ active: 1 })
```

### 6.3 Convenciones y Buenas Prácticas

#### Uso de UUIDs en lugar de ObjectID
El proyecto utiliza **UUIDs v4** como identificadores en lugar de MongoDB ObjectID. Esto facilita:
- Serialización JSON sin conversiones especiales
- Compatibilidad con otros sistemas
- Identificadores predecibles en tests

#### Manejo de Fechas
- Todas las fechas se almacenan como **strings en formato ISO 8601**
- Se convierten a objetos `datetime` de Python al leer
- Se serializan a ISO strings al guardar

```python
# Al guardar
doc['created_at'] = datetime.now(timezone.utc).isoformat()

# Al leer
if isinstance(post['created_at'], str):
    post['created_at'] = datetime.fromisoformat(post['created_at'])
```

#### Proyecciones
Se excluye siempre el campo `_id` de MongoDB en las queries:
```python
await db.posts.find({}, {"_id": 0}).to_list(100)
```

---

## 7. Flujos de Trabajo

### 7.1 Flujo de Creación de un Post

```
┌─────────────────────────────────────────────────────────┐
│ 1. Admin accede a /admin/posts/new                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend carga PostEditor.js                        │
│    - Obtiene categorías (GET /api/categories)          │
│    - Muestra formulario vacío                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Admin completa el formulario:                       │
│    - Título                                             │
│    - Contenido                                          │
│    - Excerpt                                            │
│    - Categoría                                          │
│    - Tags                                               │
│    - Imagen destacada (URL)                            │
│    - Estado publicación (toggle)                        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Admin hace click en "Guardar"                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend valida datos y envía:                      │
│    POST /api/admin/posts                                │
│    Body: { title, content, excerpt, ... }              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Backend (FastAPI) procesa:                          │
│    - Valida con Pydantic                                │
│    - Genera slug desde título                           │
│    - Calcula reading_time                               │
│    - Genera UUID                                        │
│    - Si published=true, establece published_at          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Backend guarda en MongoDB                            │
│    - Serializa fechas a ISO strings                     │
│    - Inserta documento en colección 'posts'            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Backend responde con el post creado                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Frontend muestra notificación toast                 │
│    "Post creado exitosamente"                           │
│    Redirige a /admin/posts                              │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Flujo de Lectura de un Post (Usuario Público)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuario accede a /post/{slug}                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend (PostDetail.js) extrae slug de URL         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend hace llamadas paralelas:                   │
│    - GET /api/posts/{slug}                              │
│    - POST /api/posts/{post_id}/view                     │
│    - GET /api/posts/{post_id}/comments                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Backend busca post:                                  │
│    - Query: { slug: slug, published: true }            │
│    - Si no existe: 404 Not Found                       │
│    - Si existe: retorna post completo                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Backend incrementa vistas:                          │
│    - $inc: { views_count: 1 }                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Backend retorna comentarios aprobados:              │
│    - Query: { post_id: id, approved: true }            │
│    - Ordenados por fecha (más recientes primero)       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Frontend renderiza:                                  │
│    - Título, imagen, metadata (autor, fecha, tiempo)   │
│    - Contenido completo                                 │
│    - Lista de comentarios                               │
│    - Formulario para nuevo comentario                   │
│    - Posts relacionados (misma categoría)              │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Flujo de Edición de Categoría

```
┌─────────────────────────────────────────────────────────┐
│ 1. Admin ve lista de categorías en /admin/categories   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Admin hace click en botón "Editar" de una categoría │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend (Categories.js):                           │
│    - Establece editingCategory = categoria              │
│    - Carga datos en formData                            │
│    - Muestra formulario con datos precargados          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Admin modifica nombre y/o descripción               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Admin hace click en "Guardar"                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Frontend envía:                                      │
│    PUT /api/admin/categories/{category_id}              │
│    Body: { name, description }                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Backend:                                             │
│    - Valida que la categoría existe                    │
│    - Regenera slug desde el nuevo nombre               │
│    - Actualiza documento en MongoDB                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Backend retorna categoría actualizada               │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Frontend:                                            │
│    - Muestra toast "Categoría actualizada exitosamente"│
│    - Limpia formulario                                  │
│    - Recarga lista de categorías                        │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Flujo de Comentarios con Moderación

```
Usuario Público                 Backend                 Admin
      │                            │                      │
      │ 1. POST /api/comments      │                      │
      │ ──────────────────────────>│                      │
      │                            │                      │
      │                            │ 2. Guardar con       │
      │                            │    approved: false   │
      │                            │                      │
      │<─ "Comentario enviado"     │                      │
      │   "Pendiente moderación"   │                      │
      │                            │                      │
      │                            │                      │
      │                            │<───────────────────  │
      │                            │ 3. GET /admin/       │
      │                            │    comments          │
      │                            │                      │
      │                            │ ──────────────────>  │
      │                            │ Retorna todos los    │
      │                            │ comentarios          │
      │                            │                      │
      │                            │<───────────────────  │
      │                            │ 4. PUT /admin/       │
      │                            │    comments/{id}/    │
      │                            │    approve           │
      │                            │                      │
      │                            │ 5. Set approved:true │
      │                            │                      │
      │                            │ ──────────────────>  │
      │                            │ "Comentario          │
      │                            │  aprobado"           │
      │                            │                      │
      │ 6. GET /posts/{id}/        │                      │
      │    comments                │                      │
      │ ──────────────────────────>│                      │
      │                            │                      │
      │                            │ 7. Query approved    │
      │                            │    comments only     │
      │                            │                      │
      │<─ Lista de comentarios     │                      │
      │   aprobados (incluye       │                      │
      │   el nuevo)                │                      │
```

---

## 8. Guía de Desarrollo

### 8.1 Requisitos Previos

- **Node.js**: v16 o superior
- **Python**: 3.9 o superior
- **MongoDB**: 4.4 o superior
- **Yarn**: 1.22 o superior (gestor de paquetes)
- **Git**: Para control de versiones

### 8.2 Instalación Inicial

#### Paso 1: Clonar el repositorio
```bash
git clone <repository-url>
cd app
```

#### Paso 2: Configurar Backend

```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Editar .env con las credenciales correctas
nano .env
```

Contenido de `backend/.env`:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
```

#### Paso 3: Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias con Yarn
yarn install

# Configurar variables de entorno
nano .env
```

Contenido de `frontend/.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=true
ENABLE_HEALTH_CHECK=false
```

#### Paso 4: Iniciar MongoDB

```bash
# Si MongoDB no está corriendo
mongod --dbpath /path/to/data/directory
```

### 8.3 Ejecutar el Proyecto

#### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Si usas venv
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

El backend estará disponible en: `http://localhost:8001`

#### Terminal 2 - Frontend:
```bash
cd frontend
yarn start
```

El frontend estará disponible en: `http://localhost:3000`

### 8.4 Estructura de Trabajo con Git

#### Branches Recomendadas
```
main (production)
├── develop (development)
│   ├── feature/nueva-funcionalidad
│   ├── fix/correccion-bug
│   └── hotfix/arreglo-urgente
```

#### Flujo de Trabajo Git Flow

```bash
# Crear nueva feature
git checkout develop
git checkout -b feature/nombre-de-feature

# Hacer cambios y commits
git add .
git commit -m "feat: descripción de la funcionalidad"

# Mergear a develop
git checkout develop
git merge feature/nombre-de-feature

# Crear release
git checkout -b release/v1.1.0
# Testing, ajustes finales
git checkout main
git merge release/v1.1.0
git tag v1.1.0
```

#### Convención de Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato/estilo
refactor: Refactorización de código
test: Añadir o modificar tests
chore: Tareas de mantenimiento
```

### 8.5 Agregar una Nueva Funcionalidad

#### Ejemplo: Agregar Sistema de "Me Gusta" a Posts

**Paso 1: Backend - Actualizar Modelo**
```python
# En server.py
class Post(BaseModel):
    # ... campos existentes ...
    likes_count: int = 0  # Nuevo campo
```

**Paso 2: Backend - Crear Endpoint**
```python
@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str):
    """Incrementar contador de me gusta"""
    result = await db.posts.update_one(
        {"id": post_id},
        {"$inc": {"likes_count": 1}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "Like added"}
```

**Paso 3: Frontend - Crear Componente de Botón**
```javascript
// En components/LikeButton.js
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

const LikeButton = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(`${API}/posts/${postId}/like`);
      setLikes(likes + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={liked}
      className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-600'}`}
    >
      <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;
```

**Paso 4: Frontend - Integrar en PostDetail**
```javascript
// En pages/PostDetail.js
import LikeButton from '../components/LikeButton';

// ... dentro del JSX
<LikeButton postId={post.id} initialLikes={post.likes_count} />
```

**Paso 5: Testing**
```bash
# Test del endpoint
curl -X POST http://localhost:8001/api/posts/{post_id}/like
```

### 8.6 Debugging

#### Backend (FastAPI)
```python
# Activar logs detallados
import logging
logging.basicConfig(level=logging.DEBUG)

# Usar breakpoints
import pdb; pdb.set_trace()
```

#### Frontend (React)
```javascript
// Console logs
console.log('Estado actual:', posts);

// React DevTools
// Instalar extensión de Chrome/Firefox

// Ver estado de componentes
useEffect(() => {
  console.log('Posts cargados:', posts);
}, [posts]);
```

#### MongoDB
```bash
# Conectar a MongoDB shell
mongosh

# Usar base de datos
use test_database

# Ver documentos
db.posts.find().pretty()

# Contar documentos
db.posts.countDocuments()

# Queries específicas
db.posts.find({ published: true }).pretty()
```

### 8.7 Linting y Formateo

#### Backend (Python)
```bash
# Black - Formateo
black backend/

# Isort - Ordenar imports
isort backend/

# Flake8 - Linting
flake8 backend/

# Mypy - Type checking
mypy backend/
```

#### Frontend (JavaScript)
```bash
cd frontend

# ESLint - Linting
yarn lint

# Prettier - Formateo (si está configurado)
yarn format
```

---

## 9. API Reference

### 9.1 Endpoints Públicos

#### 9.1.1 Root
```
GET /api/
```

**Descripción**: Mensaje de bienvenida de la API

**Respuesta**:
```json
{
  "message": "FarchoDev Blog API"
}
```

---

#### 9.1.2 Listar Posts
```
GET /api/posts
```

**Descripción**: Obtener lista de posts publicados con filtros opcionales

**Query Parameters**:
| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `skip` | int | Número de posts a saltar (paginación) | `0` |
| `limit` | int | Máximo de posts a retornar | `10` |
| `category` | string | Filtrar por slug de categoría | `backend-development` |
| `tag` | string | Filtrar por tag específico | `python` |
| `search` | string | Buscar en título/contenido/excerpt | `fastapi` |

**Ejemplo de Request**:
```bash
GET /api/posts?limit=5&category=backend-development&search=api
```

**Respuesta**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Introducción a FastAPI",
    "slug": "introduccion-a-fastapi",
    "content": "Contenido completo...",
    "excerpt": "Resumen del post...",
    "author": "FarchoDev",
    "featured_image_url": "https://example.com/image.jpg",
    "category": "backend-development",
    "tags": ["python", "fastapi", "api"],
    "published": true,
    "published_at": "2025-07-15T10:30:00Z",
    "created_at": "2025-07-14T08:00:00Z",
    "updated_at": "2025-07-15T10:30:00Z",
    "views_count": 142,
    "reading_time": 5
  }
]
```

---

#### 9.1.3 Obtener Post por Slug
```
GET /api/posts/{slug}
```

**Descripción**: Obtener un post específico por su slug

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `slug` | string | Slug del post (URL-friendly) |

**Ejemplo de Request**:
```bash
GET /api/posts/introduccion-a-fastapi
```

**Respuesta Exitosa (200)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Introducción a FastAPI",
  "slug": "introduccion-a-fastapi",
  "content": "Contenido completo del post...",
  "excerpt": "Resumen del post...",
  "author": "FarchoDev",
  "featured_image_url": "https://example.com/image.jpg",
  "category": "backend-development",
  "tags": ["python", "fastapi", "api"],
  "published": true,
  "published_at": "2025-07-15T10:30:00Z",
  "created_at": "2025-07-14T08:00:00Z",
  "updated_at": "2025-07-15T10:30:00Z",
  "views_count": 142,
  "reading_time": 5
}
```

**Respuesta Error (404)**:
```json
{
  "detail": "Post not found"
}
```

---

#### 9.1.4 Incrementar Vistas de Post
```
POST /api/posts/{post_id}/view
```

**Descripción**: Incrementar el contador de vistas de un post

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `post_id` | string | ID del post (UUID) |

**Ejemplo de Request**:
```bash
POST /api/posts/550e8400-e29b-41d4-a716-446655440000/view
```

**Respuesta**:
```json
{
  "message": "View count incremented"
}
```

---

#### 9.1.5 Listar Categorías
```
GET /api/categories
```

**Descripción**: Obtener todas las categorías disponibles

**Respuesta**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Backend Development",
    "slug": "backend-development",
    "description": "Artículos sobre desarrollo backend",
    "created_at": "2025-07-01T00:00:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Frontend Development",
    "slug": "frontend-development",
    "description": "Artículos sobre desarrollo frontend",
    "created_at": "2025-07-01T00:00:00Z"
  }
]
```

---

#### 9.1.6 Crear Comentario
```
POST /api/comments
```

**Descripción**: Crear un nuevo comentario (requiere aprobación del admin)

**Request Body**:
```json
{
  "post_id": "550e8400-e29b-41d4-a716-446655440000",
  "author_name": "Juan Pérez",
  "author_email": "juan@example.com",
  "content": "Excelente artículo, muy útil!"
}
```

**Respuesta (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "post_id": "550e8400-e29b-41d4-a716-446655440000",
  "author_name": "Juan Pérez",
  "author_email": "juan@example.com",
  "content": "Excelente artículo, muy útil!",
  "created_at": "2025-07-16T14:20:00Z",
  "approved": false
}
```

---

#### 9.1.7 Obtener Comentarios de un Post
```
GET /api/posts/{post_id}/comments
```

**Descripción**: Obtener comentarios aprobados de un post específico

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `post_id` | string | ID del post (UUID) |

**Respuesta**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "author_name": "Juan Pérez",
    "author_email": "juan@example.com",
    "content": "Excelente artículo, muy útil!",
    "created_at": "2025-07-16T14:20:00Z",
    "approved": true
  }
]
```

---

#### 9.1.8 Suscribirse a Newsletter
```
POST /api/newsletter/subscribe
```

**Descripción**: Suscribirse al newsletter del blog

**Request Body**:
```json
{
  "email": "usuario@example.com"
}
```

**Respuesta**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440020",
  "email": "usuario@example.com",
  "subscribed_at": "2025-07-16T10:00:00Z",
  "active": true
}
```

---

### 9.2 Endpoints de Administración

#### 9.2.1 Listar Todos los Posts (Admin)
```
GET /api/admin/posts
```

**Descripción**: Obtener todos los posts incluyendo borradores

**Respuesta**: Similar a GET /api/posts pero incluye posts no publicados

---

#### 9.2.2 Crear Post
```
POST /api/admin/posts
```

**Descripción**: Crear un nuevo post

**Request Body**:
```json
{
  "title": "Nuevo Post sobre React",
  "content": "Contenido completo del post en markdown...",
  "excerpt": "Breve descripción del post",
  "featured_image_url": "https://example.com/react.jpg",
  "category": "frontend-development",
  "tags": ["react", "javascript", "frontend"],
  "published": false
}
```

**Notas**:
- El `slug` se genera automáticamente desde el título
- El `reading_time` se calcula automáticamente desde el contenido
- El `id` se genera automáticamente (UUID)
- Si `published: true`, se establece `published_at` automáticamente

**Respuesta (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440030",
  "title": "Nuevo Post sobre React",
  "slug": "nuevo-post-sobre-react",
  "content": "Contenido completo del post en markdown...",
  "excerpt": "Breve descripción del post",
  "author": "FarchoDev",
  "featured_image_url": "https://example.com/react.jpg",
  "category": "frontend-development",
  "tags": ["react", "javascript", "frontend"],
  "published": false,
  "published_at": null,
  "created_at": "2025-07-16T15:00:00Z",
  "updated_at": "2025-07-16T15:00:00Z",
  "views_count": 0,
  "reading_time": 5
}
```

---

#### 9.2.3 Actualizar Post
```
PUT /api/admin/posts/{post_id}
```

**Descripción**: Actualizar un post existente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `post_id` | string | ID del post a actualizar |

**Request Body** (todos los campos son opcionales):
```json
{
  "title": "Título actualizado",
  "content": "Contenido actualizado...",
  "excerpt": "Nuevo excerpt",
  "featured_image_url": "https://example.com/nueva-imagen.jpg",
  "category": "nueva-categoria",
  "tags": ["nuevo", "tags"],
  "published": true
}
```

**Notas**:
- Solo se actualizan los campos proporcionados
- `updated_at` se actualiza automáticamente
- Si se cambia el título, el slug se regenera
- Si se cambia el contenido, el reading_time se recalcula
- Si se pasa de draft a published, se establece `published_at`

**Respuesta (200)**: Post actualizado completo

---

#### 9.2.4 Eliminar Post
```
DELETE /api/admin/posts/{post_id}
```

**Descripción**: Eliminar un post permanentemente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `post_id` | string | ID del post a eliminar |

**Respuesta (200)**:
```json
{
  "message": "Post deleted successfully"
}
```

**Respuesta Error (404)**:
```json
{
  "detail": "Post not found"
}
```

---

#### 9.2.5 Crear Categoría
```
POST /api/admin/categories
```

**Descripción**: Crear una nueva categoría

**Request Body**:
```json
{
  "name": "DevOps",
  "description": "Artículos sobre DevOps y deployment"
}
```

**Respuesta (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440040",
  "name": "DevOps",
  "slug": "devops",
  "description": "Artículos sobre DevOps y deployment",
  "created_at": "2025-07-16T16:00:00Z"
}
```

---

#### 9.2.6 Actualizar Categoría
```
PUT /api/admin/categories/{category_id}
```

**Descripción**: Actualizar una categoría existente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category_id` | string | ID de la categoría a actualizar |

**Request Body**:
```json
{
  "name": "DevOps & Cloud",
  "description": "Artículos sobre DevOps, Cloud y deployment"
}
```

**Respuesta (200)**: Categoría actualizada completa

---

#### 9.2.7 Eliminar Categoría
```
DELETE /api/admin/categories/{category_id}
```

**Descripción**: Eliminar una categoría permanentemente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category_id` | string | ID de la categoría a eliminar |

**Respuesta (200)**:
```json
{
  "message": "Category deleted successfully"
}
```

---

#### 9.2.8 Listar Todos los Comentarios (Admin)
```
GET /api/admin/comments
```

**Descripción**: Obtener todos los comentarios (aprobados y pendientes)

**Respuesta**: Array de comentarios similar a GET /api/posts/{post_id}/comments

---

#### 9.2.9 Aprobar Comentario
```
PUT /api/admin/comments/{comment_id}/approve
```

**Descripción**: Aprobar un comentario pendiente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `comment_id` | string | ID del comentario a aprobar |

**Respuesta (200)**:
```json
{
  "message": "Comment approved"
}
```

---

#### 9.2.10 Eliminar Comentario
```
DELETE /api/admin/comments/{comment_id}
```

**Descripción**: Eliminar un comentario permanentemente

**Path Parameters**:
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `comment_id` | string | ID del comentario a eliminar |

**Respuesta (200)**:
```json
{
  "message": "Comment deleted successfully"
}
```

---

#### 9.2.11 Obtener Estadísticas
```
GET /api/admin/stats
```

**Descripción**: Obtener estadísticas generales del blog

**Respuesta**:
```json
{
  "total_posts": 25,
  "published_posts": 20,
  "draft_posts": 5,
  "total_comments": 150,
  "pending_comments": 10,
  "approved_comments": 140,
  "total_subscribers": 1200,
  "total_views": 15000
}
```

---

### 9.3 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Request exitoso (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos de entrada inválidos |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Error de validación de Pydantic |
| 500 | Internal Server Error | Error del servidor |

---

## 10. Variables de Entorno

### 10.1 Backend (`/app/backend/.env`)

```env
# Conexión a MongoDB
MONGO_URL="mongodb://localhost:27017"

# Nombre de la base de datos
DB_NAME="test_database"

# Configuración de CORS
# Usar "*" para desarrollo, dominios específicos en producción
CORS_ORIGINS="*"
```

**Detalles**:
- `MONGO_URL`: String de conexión a MongoDB. Para producción usar MongoDB Atlas.
- `DB_NAME`: Nombre de la base de datos a utilizar.
- `CORS_ORIGINS`: Orígenes permitidos para CORS. Separar múltiples con comas.

### 10.2 Frontend (`/app/frontend/.env`)

```env
# URL del backend
REACT_APP_BACKEND_URL=http://localhost:8001

# Puerto del WebSocket (para hot reload)
WDS_SOCKET_PORT=443

# Habilitar ediciones visuales (feature específico)
REACT_APP_ENABLE_VISUAL_EDITS=true

# Health check (para monitoreo)
ENABLE_HEALTH_CHECK=false
```

**Detalles**:
- `REACT_APP_BACKEND_URL`: URL base del backend API. En producción usar la URL del servidor.
- `WDS_SOCKET_PORT`: Puerto para el WebSocket de desarrollo.
- Otras variables son específicas del entorno de desarrollo.

---

## 11. Testing

### 11.1 Testing del Backend

El archivo `backend_test.py` contiene tests para los endpoints del backend.

**Estructura de Tests**:
```python
import pytest
import asyncio
from httpx import AsyncClient
from server import app

# Tests de Posts
def test_get_posts()
def test_get_post_by_slug()
def test_create_post()
def test_update_post()
def test_delete_post()

# Tests de Categorías
def test_get_categories()
def test_create_category()
def test_update_category()
def test_delete_category()

# Tests de Comentarios
def test_create_comment()
def test_approve_comment()
def test_get_post_comments()

# Tests de Newsletter
def test_subscribe_newsletter()

# Tests de Stats
def test_get_stats()
```

**Ejecutar Tests**:
```bash
cd /app
pytest backend_test.py -v
```

**Ejemplo de Test**:
```python
@pytest.mark.asyncio
async def test_create_post():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        post_data = {
            "title": "Test Post",
            "content": "Test content",
            "excerpt": "Test excerpt",
            "category": "test-category",
            "tags": ["test"],
            "published": True
        }
        response = await ac.post("/api/admin/posts", json=post_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Post"
        assert data["slug"] == "test-post"
        assert data["reading_time"] > 0
```

### 11.2 Testing del Frontend

El frontend utiliza React Testing Library (incluido en react-scripts).

**Ejecutar Tests**:
```bash
cd frontend
yarn test
```

**Ejemplo de Test** (crear en `src/components/PostCard.test.js`):
```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from './PostCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'Test excerpt',
  category: 'test',
  tags: ['test'],
  reading_time: 5,
  featured_image_url: 'https://example.com/image.jpg'
};

test('renders post card with title', () => {
  render(
    <BrowserRouter>
      <PostCard post={mockPost} />
    </BrowserRouter>
  );
  
  const titleElement = screen.getByText(/Test Post/i);
  expect(titleElement).toBeInTheDocument();
});
```

### 11.3 Testing de Integración

**Testing Manual con curl**:

```bash
# Test crear post
curl -X POST http://localhost:8001/api/admin/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Content...",
    "excerpt": "Excerpt...",
    "category": "backend",
    "tags": ["test"],
    "published": true
  }'

# Test obtener posts
curl http://localhost:8001/api/posts

# Test crear categoría
curl -X POST http://localhost:8001/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Testing",
    "description": "Category for testing"
  }'

# Test actualizar categoría
curl -X PUT http://localhost:8001/api/admin/categories/{category_id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Testing Updated",
    "description": "Updated description"
  }'

# Test eliminar categoría
curl -X DELETE http://localhost:8001/api/admin/categories/{category_id}
```

### 11.4 Herramientas de Testing

- **Backend**: pytest, httpx (para async requests)
- **Frontend**: Jest, React Testing Library
- **E2E**: Playwright (opcional, no configurado actualmente)
- **API Testing**: Postman, Insomnia, o Thunder Client (VSCode)

---

## 12. Despliegue

### 12.1 Preparación para Producción

#### Backend

**1. Actualizar `requirements.txt`** con versiones fijas:
```txt
fastapi==0.110.1
uvicorn[standard]==0.25.0
motor==3.3.1
pydantic==2.6.4
python-dotenv==1.0.1
...
```

**2. Configurar variables de entorno para producción**:
```env
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net"
DB_NAME="farchodev_blog_production"
CORS_ORIGINS="https://farchodev.com,https://www.farchodev.com"
```

**3. Configurar Uvicorn para producción**:
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
```

O usar Gunicorn con workers de Uvicorn:
```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8001
```

#### Frontend

**1. Build de producción**:
```bash
cd frontend
yarn build
```

Esto genera una carpeta `build/` con archivos estáticos optimizados.

**2. Configurar variables de entorno**:
```env
REACT_APP_BACKEND_URL=https://api.farchodev.com
```

### 12.2 Opciones de Deployment

#### Opción 1: Servidor VPS (Digital Ocean, AWS EC2, Linode)

**Arquitectura**:
```
Internet
   │
   ▼
Nginx (Reverse Proxy)
   │
   ├──> Frontend (build estático) :80
   │
   └──> Backend (Uvicorn) :8001
          │
          └──> MongoDB :27017
```

**Pasos**:

1. **Instalar dependencias en el servidor**:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python, Node, MongoDB
sudo apt install python3 python3-pip nodejs npm mongodb -y

# Instalar yarn
npm install -g yarn

# Instalar nginx
sudo apt install nginx -y
```

2. **Clonar y configurar proyecto**:
```bash
cd /var/www
git clone <repo-url> farchodev-blog
cd farchodev-blog

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
yarn install
yarn build
```

3. **Configurar Nginx**:
```nginx
# /etc/nginx/sites-available/farchodev
server {
    listen 80;
    server_name farchodev.com www.farchodev.com;

    # Frontend
    root /var/www/farchodev-blog/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Configurar Supervisor para Backend**:
```ini
# /etc/supervisor/conf.d/farchodev-backend.conf
[program:farchodev-backend]
directory=/var/www/farchodev-blog/backend
command=/var/www/farchodev-blog/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
autostart=true
autorestart=true
stderr_logfile=/var/log/farchodev-backend.err.log
stdout_logfile=/var/log/farchodev-backend.out.log
```

5. **Activar y reiniciar servicios**:
```bash
# Nginx
sudo ln -s /etc/nginx/sites-available/farchodev /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start farchodev-backend
```

6. **Configurar SSL con Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d farchodev.com -d www.farchodev.com
```

#### Opción 2: Docker

**Crear Dockerfiles**:

`backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

`frontend/Dockerfile`:
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:4.4
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: farchodev_blog
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      MONGO_URL: mongodb://mongodb:27017
      DB_NAME: farchodev_blog
      CORS_ORIGINS: "*"
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      REACT_APP_BACKEND_URL: http://backend:8001
    depends_on:
      - backend

volumes:
  mongo-data:
```

**Ejecutar**:
```bash
docker-compose up -d
```

#### Opción 3: Servicios en la Nube

**Backend**:
- **Heroku**: Deploy con git push
- **Railway**: Deploy automático desde GitHub
- **Render**: Deploy con Dockerfile
- **AWS Elastic Beanstalk**: Deploy completo gestionado

**Frontend**:
- **Vercel**: Deploy optimizado para React
- **Netlify**: Deploy con integración GitHub
- **AWS S3 + CloudFront**: Hosting estático escalable

**Base de Datos**:
- **MongoDB Atlas**: MongoDB como servicio (recomendado)
- **AWS DocumentDB**: Compatible con MongoDB
- **DigitalOcean Managed MongoDB**

### 12.3 Configuración de MongoDB Atlas (Recomendado)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito (M0)
3. Configurar acceso:
   - Agregar IP addresses (0.0.0.0/0 para desarrollo)
   - Crear usuario de base de datos
4. Obtener connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/farchodev_blog?retryWrites=true&w=majority
```
5. Actualizar `MONGO_URL` en `.env` del backend

### 12.4 Monitoreo y Logs

**Logs del Backend**:
```bash
# Si usas supervisor
tail -f /var/log/farchodev-backend.out.log
tail -f /var/log/farchodev-backend.err.log

# Si usas Docker
docker logs -f <container_name>
```

**Herramientas de Monitoreo**:
- **Sentry**: Tracking de errores
- **LogRocket**: Replay de sesiones
- **New Relic**: Monitoreo de performance
- **Datadog**: Monitoreo integral

**Health Checks**:
```python
# Agregar en server.py
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "farchodev-blog-api"}
```

---

## 13. Mejores Prácticas y Recomendaciones

### 13.1 Seguridad

**Backend**:
- ✅ **NUNCA** commitear `.env` al repositorio
- ✅ Implementar autenticación para endpoints admin (JWT, OAuth)
- ✅ Validar y sanitizar todas las entradas de usuario
- ✅ Usar HTTPS en producción
- ✅ Configurar CORS restrictivamente en producción
- ✅ Implementar rate limiting para prevenir abuse
- ✅ Mantener dependencias actualizadas

**Frontend**:
- ✅ Validar datos en el cliente y en el servidor
- ✅ No almacenar información sensible en localStorage
- ✅ Sanitizar contenido antes de renderizar (XSS protection)
- ✅ Usar HTTPS para todas las comunicaciones

### 13.2 Performance

**Backend**:
- ✅ Usar índices en MongoDB para queries frecuentes
- ✅ Implementar paginación en endpoints de listado
- ✅ Cachear respuestas frecuentes (Redis)
- ✅ Optimizar queries (proyecciones, solo campos necesarios)

**Frontend**:
- ✅ Code splitting y lazy loading de rutas
- ✅ Optimizar imágenes (WebP, lazy loading)
- ✅ Implementar service workers para PWA
- ✅ Minimizar re-renders innecesarios (React.memo, useMemo)

### 13.3 SEO

- ✅ Server-Side Rendering (considerar Next.js)
- ✅ Meta tags apropiados en cada página
- ✅ Open Graph tags para redes sociales
- ✅ Sitemap.xml y robots.txt
- ✅ URLs amigables (ya implementado con slugs)
- ✅ Structured data (JSON-LD)

### 13.4 Mantenimiento

- ✅ Backups regulares de MongoDB
- ✅ Logs centralizados
- ✅ Documentación actualizada
- ✅ Tests automatizados
- ✅ CI/CD pipeline (GitHub Actions, GitLab CI)

---

## 14. Solución de Problemas Comunes

### 14.1 Backend no se conecta a MongoDB

**Síntomas**: Error "ServerSelectionTimeoutError"

**Soluciones**:
```bash
# Verificar que MongoDB está corriendo
sudo systemctl status mongodb

# Iniciar MongoDB
sudo systemctl start mongodb

# Verificar connection string en .env
echo $MONGO_URL
```

### 14.2 CORS Errors en Frontend

**Síntomas**: "Access to XMLHttpRequest blocked by CORS policy"

**Soluciones**:
1. Verificar `CORS_ORIGINS` en backend/.env
2. Verificar que el middleware CORS está configurado correctamente
3. En desarrollo, usar `CORS_ORIGINS="*"`

### 14.3 Frontend no encuentra Backend

**Síntomas**: Network errors, 404 en llamadas API

**Soluciones**:
1. Verificar `REACT_APP_BACKEND_URL` en frontend/.env
2. Verificar que el backend está corriendo en el puerto correcto
3. Verificar que las rutas API tienen prefijo `/api`

### 14.4 Build de Frontend Falla

**Síntomas**: Errores al ejecutar `yarn build`

**Soluciones**:
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
rm yarn.lock
yarn install

# Verificar versiones de Node
node --version  # Debe ser 16+
```

### 14.5 Slugs Duplicados

**Síntomas**: Error al crear posts/categorías con títulos similares

**Solución**: Implementar lógica de slugs únicos:
```python
def create_unique_slug(title: str, collection) -> str:
    base_slug = create_slug(title)
    slug = base_slug
    counter = 1
    
    while await collection.find_one({"slug": slug}):
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug
```

---

## 15. Roadmap y Futuras Mejoras

### 15.1 Funcionalidades Pendientes

#### Alta Prioridad
- [ ] Sistema de autenticación para admin (JWT)
- [ ] Editor de markdown con preview en tiempo real
- [ ] Upload de imágenes al servidor (no solo URLs)
- [ ] Búsqueda avanzada con Elasticsearch
- [ ] Sistema de tags más robusto (autocompletado)

#### Media Prioridad
- [ ] Sistema de likes/reactions en posts
- [ ] Compartir en redes sociales
- [ ] RSS Feed
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Analytics dashboard más completo

#### Baja Prioridad
- [ ] Sistema de notificaciones
- [ ] Chat en vivo
- [ ] Integración con CMS headless
- [ ] Mobile app (React Native)

### 15.2 Mejoras Técnicas

- [ ] Migrar a Next.js para SSR y mejor SEO
- [ ] Implementar GraphQL como alternativa a REST
- [ ] Agregar Redis para caché
- [ ] Implementar rate limiting
- [ ] Agregar logs estructurados (ELK Stack)
- [ ] Implementar CI/CD completo
- [ ] Aumentar cobertura de tests (>80%)

---

## 16. Recursos Adicionales

### 16.1 Documentación Oficial

- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **MongoDB**: https://www.mongodb.com/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/

### 16.2 Tutoriales Útiles

- FastAPI + MongoDB: https://www.mongodb.com/languages/python/pymongo-tutorial
- React Hooks: https://react.dev/reference/react
- Tailwind UI Components: https://tailwindui.com/components

### 16.3 Herramientas Recomendadas

- **IDE**: VSCode, PyCharm, WebStorm
- **API Testing**: Postman, Insomnia
- **Database GUI**: MongoDB Compass, Studio 3T
- **Git Client**: GitKraken, Sourcetree
- **Design**: Figma, Sketch

---

## 17. Contacto y Soporte

### 17.1 Contribuciones

Para contribuir al proyecto:
1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

### 17.2 Reportar Issues

Para reportar bugs o sugerir mejoras:
1. Ir a la sección "Issues" del repositorio
2. Crear un nuevo issue
3. Usar las plantillas proporcionadas
4. Agregar labels apropiados

### 17.3 Información de Contacto

- **Email**: farcho@farchodev.com
- **Website**: https://farchodev.com
- **GitHub**: https://github.com/farchodev
- **Twitter**: @farchodev

---

## 18. Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 19. Changelog

### v1.0.0 (Julio 2025)
- ✅ Lanzamiento inicial
- ✅ CRUD completo de posts
- ✅ Sistema de categorías con edición y eliminación
- ✅ Sistema de comentarios con moderación
- ✅ Newsletter
- ✅ Dashboard de admin con estadísticas
- ✅ Diseño responsive y moderno

---

## 20. Agradecimientos

Agradecimientos especiales a:
- La comunidad de FastAPI
- La comunidad de React
- Todos los contribuidores de código abierto
- Los usuarios que prueban y dan feedback

---

**Última actualización**: Julio 2025  
**Versión de la documentación**: 1.0  
**Autor**: FarchoDev

---

*Esta documentación es un documento vivo y se actualiza regularmente. Si encuentras algún error o tienes sugerencias para mejorarla, por favor abre un issue o contribuye directamente.*

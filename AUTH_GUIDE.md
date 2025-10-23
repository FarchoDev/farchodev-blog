# 🔐 Guía del Sistema de Autenticación - FarchoDev Blog

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelos de Datos](#modelos-de-datos)
4. [Flujos de Autenticación](#flujos-de-autenticación)
5. [API Endpoints](#api-endpoints)
6. [Implementación Frontend](#implementación-frontend)
7. [Seguridad](#seguridad)
8. [Configuración](#configuración)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Visión General

El sistema de autenticación de FarchoDev Blog proporciona múltiples métodos de autenticación y un sistema robusto de autorización basado en roles.

### Métodos de Autenticación

1. **🔑 JWT Local** - Autenticación tradicional con email y contraseña
2. **🔵 Google OAuth** - Login con cuenta de Google (Emergent Auth)
3. **⚫ GitHub OAuth** - Autenticación con GitHub

### Características Principales

- ✅ Registro e inicio de sesión con JWT
- ✅ Gestión de sesiones con cookies HttpOnly
- ✅ Tokens con expiración automática (7 días)
- ✅ Passwords hasheados con bcrypt
- ✅ Autorización basada en roles (user/admin)
- ✅ Middleware de protección de rutas
- ✅ Perfil de usuario editable
- ✅ Sistema de actividad del usuario

---

## Arquitectura del Sistema

### Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────┐                 │
│  │  AuthContext    │  │  Components      │                 │
│  │  - user         │  │  - LoginModal    │                 │
│  │  - login()      │  │  - RegisterModal │                 │
│  │  - logout()     │  │  - ProtectedRoute│                 │
│  │  - checkAuth()  │  │  - Navbar        │                 │
│  └────────┬────────┘  └──────────────────┘                 │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            │
            │ HTTP Requests
            │ withCredentials: true
            ▼
┌──────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  auth.py                                               │ │
│  │  - register()                                          │ │
│  │  - login()                                             │ │
│  │  - get_current_user()                                  │ │
│  │  - require_admin()                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware                                            │ │
│  │  - CORS (allow_credentials=True)                       │ │
│  │  - JWT Verification                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ MongoDB Motor
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    MONGODB                                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   users      │  │   sessions   │  │  profiles    │      │
│  │  - email     │  │  - user_id   │  │  - user_id   │      │
│  │  - password  │  │  - token     │  │  - bio       │      │
│  │  - role      │  │  - created   │  │  - socials   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

---

## Modelos de Datos

### User (Usuario)

```python
class User(BaseModel):
    id: str                          # UUID único
    email: str                       # Email (único)
    password_hash: str               # Hash de contraseña (bcrypt)
    name: str                        # Nombre del usuario
    role: str = "user"              # Rol: "user" o "admin"
    oauth_provider: Optional[str]    # "google", "github", o None
    oauth_id: Optional[str]          # ID del proveedor OAuth
    created_at: datetime             # Fecha de creación
    last_login: Optional[datetime]   # Último login
```

**Campos Calculados**:
- `is_admin`: Propiedad que verifica si `role == "admin"`

**Índices**:
- `email`: Índice único
- `oauth_provider + oauth_id`: Índice único compuesto

### Session (Sesión)

```python
class Session(BaseModel):
    id: str                    # UUID de la sesión
    user_id: str              # ID del usuario
    session_token: str        # JWT token
    created_at: datetime      # Fecha de creación
    expires_at: datetime      # Fecha de expiración
    ip_address: Optional[str] # IP del cliente
    user_agent: Optional[str] # User agent del navegador
```

**Limpieza Automática**: Las sesiones expiradas se eliminan automáticamente.

### UserProfile (Perfil de Usuario)

```python
class UserProfile(BaseModel):
    id: str              # UUID del perfil
    user_id: str        # ID del usuario (único)
    bio: Optional[str]  # Biografía
    website: Optional[str]
    github: Optional[str]
    twitter: Optional[str]
    linkedin: Optional[str]
    created_at: datetime
    updated_at: datetime
```

### UserPublic (Respuesta Pública)

Versión sanitizada del usuario para respuestas API:

```python
class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: datetime
    # NO incluye: password_hash, oauth_id
```

---

## Flujos de Autenticación

### 1. Registro de Usuario (JWT Local)

```
┌────────┐                 ┌─────────┐                 ┌──────────┐
│Frontend│                 │ Backend │                 │ MongoDB  │
└───┬────┘                 └────┬────┘                 └────┬─────┘
    │                           │                           │
    │ POST /auth/register       │                           │
    │ {email, password, name}   │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │                           │ 1. Validar datos         │
    │                           │ 2. Verificar email único  │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 3. Hash password (bcrypt) │
    │                           │    - Salt automático      │
    │                           │    - 12 rounds            │
    │                           │                           │
    │                           │ 4. Generar JWT            │
    │                           │    - Expira en 7 días     │
    │                           │    - Include: id, email   │
    │                           │                           │
    │                           │ 5. Crear usuario          │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 6. Crear sesión           │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │ Set-Cookie: session_token │                           │
    │ (HttpOnly, Secure)        │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ {user: UserPublic}        │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ Update AuthContext        │                           │
    │ - setUser(user)           │                           │
    │ - Navigate to /           │                           │
    │                           │                           │
```

**Código Frontend**:
```javascript
const register = async (email, password, name) => {
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    credentials: 'include',  // ¡Importante!
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  const data = await response.json();
  setUser(data);  // Actualiza el estado global
  return { success: true, user: data };
};
```

**Código Backend**:
```python
@router.post("/auth/register", response_model=UserPublic)
async def register(
    email: str = Body(...),
    password: str = Body(...),
    name: str = Body(...),
    response: Response = None
):
    # 1. Validar que el email no exista
    existing = await users_collection.find_one({"email": email})
    if existing:
        raise HTTPException(400, "Email ya registrado")
    
    # 2. Hash del password
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    
    # 3. Crear usuario
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": password_hash.decode(),
        "name": name,
        "role": "admin" if email in ADMIN_EMAILS else "user",
        "created_at": datetime.utcnow()
    }
    await users_collection.insert_one(user)
    
    # 4. Generar JWT
    token = jwt.encode(
        {"user_id": user["id"], "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET,
        algorithm="HS256"
    )
    
    # 5. Guardar sesión
    session = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "session_token": token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=7)
    }
    await sessions_collection.insert_one(session)
    
    # 6. Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        max_age=7*24*60*60,
        samesite="lax"
    )
    
    return UserPublic(**user)
```

### 2. Inicio de Sesión (JWT Local)

```
┌────────┐                 ┌─────────┐                 ┌──────────┐
│Frontend│                 │ Backend │                 │ MongoDB  │
└───┬────┘                 └────┬────┘                 └────┬─────┘
    │                           │                           │
    │ POST /auth/login          │                           │
    │ {email, password}         │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │                           │ 1. Buscar usuario         │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 2. Verificar password     │
    │                           │    bcrypt.checkpw()       │
    │                           │                           │
    │                           │ 3. Generar nuevo JWT      │
    │                           │                           │
    │                           │ 4. Crear nueva sesión     │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 5. Actualizar last_login  │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │ Set-Cookie: session_token │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ {user: UserPublic}        │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
```

### 3. Verificación de Usuario Actual (GET /auth/me)

```
┌────────┐                 ┌─────────┐                 ┌──────────┐
│Frontend│                 │ Backend │                 │ MongoDB  │
└───┬────┘                 └────┬────┘                 └────┬─────┘
    │                           │                           │
    │ GET /auth/me              │                           │
    │ Cookie: session_token     │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │                           │ 1. Extraer token          │
    │                           │    de Cookie              │
    │                           │                           │
    │                           │ 2. Verificar JWT          │
    │                           │    jwt.decode()           │
    │                           │                           │
    │                           │ 3. Buscar usuario         │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │ {user: UserPublic}        │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
```

### 4. Cerrar Sesión (POST /auth/logout)

```
┌────────┐                 ┌─────────┐                 ┌──────────┐
│Frontend│                 │ Backend │                 │ MongoDB  │
└───┬────┘                 └────┬────┘                 └────┬─────┘
    │                           │                           │
    │ POST /auth/logout         │                           │
    │ Cookie: session_token     │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │                           │ 1. Extraer token          │
    │                           │                           │
    │                           │ 2. Eliminar sesión        │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │ Clear-Cookie              │                           │
    │ session_token             │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
    │ {message: "Logout OK"}    │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
```

### 5. Solicitud Autenticada a Ruta Protegida

```
┌────────┐                 ┌─────────┐                 ┌──────────┐
│Frontend│                 │ Backend │                 │ MongoDB  │
└───┬────┘                 └────┬────┘                 └────┬─────┘
    │                           │                           │
    │ GET /api/admin/posts      │                           │
    │ Cookie: session_token     │                           │
    ├──────────────────────────>│                           │
    │                           │                           │
    │                           │ Middleware:               │
    │                           │ 1. get_current_user()     │
    │                           │    - Verificar JWT        │
    │                           │    - Buscar usuario       │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │                           │ 2. require_admin()        │
    │                           │    - Verificar role       │
    │                           │                           │
    │                           │ 3. Ejecutar endpoint      │
    │                           │    - Obtener posts        │
    │                           ├──────────────────────────>│
    │                           │<──────────────────────────┤
    │                           │                           │
    │ {posts: [...]}            │                           │
    │<──────────────────────────┤                           │
    │                           │                           │
```

---

## API Endpoints

### POST /api/auth/register

Registra un nuevo usuario.

**Request**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña-segura",
  "name": "Nombre Usuario"
}
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "role": "user",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Set-Cookie**: `session_token=<JWT>; HttpOnly; Max-Age=604800; SameSite=Lax`

**Errores**:
- `400`: Email ya registrado
- `422`: Datos de validación incorrectos

---

### POST /api/auth/login

Inicia sesión con email y contraseña.

**Request**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña-segura"
}
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "role": "user",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Set-Cookie**: `session_token=<JWT>; HttpOnly; Max-Age=604800; SameSite=Lax`

**Errores**:
- `401`: Credenciales inválidas
- `404`: Usuario no encontrado

---

### GET /api/auth/me

Obtiene información del usuario actual.

**Headers**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario",
  "role": "user",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Errores**:
- `401`: No autenticado o token inválido

---

### POST /api/auth/logout

Cierra la sesión del usuario.

**Headers**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

**Clear-Cookie**: `session_token`

---

### GET /api/users/profile

Obtiene el perfil del usuario actual.

**Headers**:
```
Cookie: session_token=<JWT>
```

**Response** (200):
```json
{
  "id": "profile-uuid",
  "user_id": "user-uuid",
  "bio": "Desarrollador Full Stack",
  "website": "https://ejemplo.com",
  "github": "https://github.com/usuario",
  "twitter": "https://twitter.com/usuario",
  "linkedin": "https://linkedin.com/in/usuario",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T12:00:00Z"
}
```

---

### PUT /api/users/profile

Actualiza el perfil del usuario.

**Headers**:
```
Cookie: session_token=<JWT>
```

**Request**:
```json
{
  "bio": "Nueva biografía",
  "website": "https://mi-sitio.com",
  "github": "https://github.com/usuario",
  "twitter": "https://twitter.com/usuario",
  "linkedin": "https://linkedin.com/in/usuario"
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully"
}
```

---

### GET /api/users/activity

Obtiene la actividad reciente del usuario.

**Headers**:
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
      "id": "comment-uuid",
      "post_id": "post-uuid",
      "content": "Excelente artículo!",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "recent_likes": [
    {
      "post_id": "post-uuid",
      "created_at": "2025-01-15T09:00:00Z"
    }
  ],
  "recent_bookmarks": [
    {
      "post_id": "post-uuid",
      "created_at": "2025-01-14T18:00:00Z"
    }
  ]
}
```

---

## Implementación Frontend

### AuthContext

El `AuthContext` maneja el estado global de autenticación.

**Ubicación**: `/frontend/src/contexts/AuthContext.js`

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Verificar autenticación al montar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: 'include'  // ¡Importante! Envía cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Error en el registro');
    }

    setUser(data);
    return { success: true, user: data };
  };

  const login = async (email, password) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Error en el login');
    }

    setUser(data);
    return { success: true, user: data };
  };

  const logout = async () => {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### ProtectedRoute Component

Componente para proteger rutas que requieren autenticación.

**Ubicación**: `/frontend/src/components/ProtectedRoute.js`

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <a href="/" className="btn-primary">
            Volver al Inicio
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
```

### Uso en App.js

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          
          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/posts" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminPosts />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Configuración de Axios

Para hacer que todas las peticiones axios incluyan cookies:

**Ubicación**: `/frontend/src/utils/axios.js`

```javascript
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,  // ¡Importante! Envía cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejo de errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login o mostrar modal
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**Uso**:
```javascript
import axiosInstance from '../utils/axios';

// En lugar de:
// axios.get(`${API}/admin/posts`)

// Usa:
axiosInstance.get('/admin/posts')
```

---

## Seguridad

### 1. Hashing de Contraseñas

```python
import bcrypt

# Al registrar
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Al verificar
is_valid = bcrypt.checkpw(
    password.encode('utf-8'),
    stored_hash.encode('utf-8')
)
```

**Características**:
- Salt automático y único por contraseña
- 12 rounds por defecto (configurable)
- Resistente a ataques de fuerza bruta
- No reversible

### 2. JWT (JSON Web Tokens)

```python
import jwt
from datetime import datetime, timedelta

# Generar token
token = jwt.encode(
    {
        "user_id": user["id"],
        "email": user["email"],
        "exp": datetime.utcnow() + timedelta(days=7)
    },
    JWT_SECRET_KEY,
    algorithm="HS256"
)

# Verificar token
try:
    payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    user_id = payload["user_id"]
except jwt.ExpiredSignatureError:
    # Token expirado
    raise HTTPException(401, "Token expired")
except jwt.InvalidTokenError:
    # Token inválido
    raise HTTPException(401, "Invalid token")
```

**Configuración Recomendada**:
- Algoritmo: HS256
- Expiración: 7 días
- Secret Key: Mínimo 256 bits, generado aleatoriamente

### 3. Cookies Seguras (HttpOnly)

Las cookies de sesión utilizan la bandera `HttpOnly` para prevenir ataques XSS y `SameSite` para proteger contra CSRF.

```python
# Configuración automática según entorno
IS_PRODUCTION = os.environ.get('ENV', 'development') == 'production'
COOKIE_SECURE = IS_PRODUCTION  # Solo secure en producción (HTTPS)
COOKIE_SAMESITE = "none" if IS_PRODUCTION else "lax"

response.set_cookie(
    key="session_token",
    value=token,
    httponly=True,        # ⚠️ CRÍTICO: No accesible desde JavaScript
    secure=COOKIE_SECURE, # True en producción (requiere HTTPS)
    samesite=COOKIE_SAMESITE,  # "lax" en dev, "none" en prod
    max_age=604800        # 7 días en segundos
)
```

**Características de Seguridad**:
- ✅ **HttpOnly=True**: Previene acceso desde JavaScript (protege contra XSS)
- ✅ **Secure**: Requiere HTTPS en producción
- ✅ **SameSite**: "lax" en desarrollo, "none" en producción (protege contra CSRF)
- ✅ **Max-Age**: Expiración automática después de 7 días

### 4. CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,  # Permite cookies
    allow_origins=[
        "http://localhost:3000",      # Desarrollo
        "https://tudominio.com"       # Producción
    ],
    allow_methods=["*"],
    allow_headers=["*"]
)
```

⚠️ **IMPORTANTE**: Nunca uses `allow_origins=["*"]` con `allow_credentials=True`

### 5. Validación de Datos

```python
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr  # Valida formato de email
    password: str = Field(..., min_length=6)  # Mínimo 6 caracteres
    name: str = Field(..., min_length=2, max_length=100)
```

### 6. Rate Limiting (Recomendado)

Para producción, implementa rate limiting:

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/login")
@limiter.limit("5/minute")  # Máximo 5 intentos por minuto
async def login(...):
    pass
```

---

## Configuración

### Variables de Entorno - Backend

**Archivo**: `/backend/.env`

```bash
# MongoDB
MONGO_URL="mongodb://localhost:27017"
DB_NAME="farchodev_blog"

# CORS
CORS_ORIGINS="http://localhost:3000"

# JWT
JWT_SECRET_KEY="tu-clave-super-secreta-minimo-256-bits"

# Admin Emails (separados por comas)
ADMIN_EMAILS="admin@ejemplo.com,otro-admin@ejemplo.com"

# Environment (development/production)
ENV="development"  # En producción: "production"

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID="tu-client-id"
GITHUB_CLIENT_SECRET="tu-client-secret"
GITHUB_REDIRECT_URI="http://localhost:8001/api/auth/github/callback"
```

**Generar JWT_SECRET_KEY seguro**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Variables de Entorno - Frontend

**Archivo**: `/frontend/.env`

```bash
REACT_APP_BACKEND_URL="http://localhost:8001"
```

### Configuración de Producción

**Backend**:
```bash
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
CORS_ORIGINS="https://tudominio.com"
JWT_SECRET_KEY="<clave-super-secreta-aleatoria>"
```

**Frontend**:
```bash
REACT_APP_BACKEND_URL="https://api.tudominio.com"
```

---

## Testing

### Test de Registro

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

### Test de Login

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Test de Endpoint Protegido

```bash
curl -X GET http://localhost:8001/api/auth/me \
  -b cookies.txt
```

### Test de Endpoint Admin

```bash
curl -X GET http://localhost:8001/api/admin/posts \
  -b cookies.txt
```

---

## Troubleshooting

### Error: Cookies no se guardan

**Problema**: El usuario se desloguea al refrescar la página.

**Soluciones**:
1. Verifica `credentials: 'include'` en el frontend
2. Verifica `withCredentials: true` en axios
3. Usa `localhost` (no `127.0.0.1`) en desarrollo
4. Verifica que CORS esté configurado correctamente

### Error: 401 Unauthorized en peticiones admin

**Problema**: El token JWT no se está enviando.

**Soluciones**:
1. Verifica que axios use `withCredentials: true`
2. Verifica que el CORS no sea `"*"`
3. Revisa los logs del backend para ver si llega el token

### Error: Token inválido

**Problema**: El JWT no se puede decodificar.

**Soluciones**:
1. Verifica que el `JWT_SECRET_KEY` sea el mismo en registro y verificación
2. Verifica que no haya cambiado el secret key
3. Limpia las cookies y vuelve a hacer login

### Error: Admin access denied

**Problema**: Usuario autenticado pero sin permisos de admin.

**Solución**:
```javascript
// En MongoDB
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)
```

---

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Siempre hashar passwords** con bcrypt
2. **Usar HTTPS en producción** para cookies seguras
3. **Validar todos los inputs** con Pydantic
4. **Implementar rate limiting** en producción
5. **Rotar JWT secrets** periódicamente
6. **Loguear intentos de login fallidos**
7. **Implementar 2FA** para cuentas admin (futuro)

### ❌ DON'T (No Hacer)

1. **No guardar passwords en texto plano**
2. **No usar `CORS_ORIGINS="*"` con credentials**
3. **No exponer JWT secrets** en repositorios
4. **No usar tokens sin expiración**
5. **No confiar en datos del cliente** sin validar
6. **No loguear tokens o passwords**

---

## Recursos Adicionales

- [JWT.io](https://jwt.io/) - Debugger de JWT
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**¿Preguntas o problemas?** Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) o abre un issue en GitHub.

# 🪟 Guía de Instalación para Windows - FarchoDev Blog

Esta guía está específicamente diseñada para configurar el proyecto en **Windows 10/11**.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [ ] **Python 3.9+** - [Descargar](https://www.python.org/downloads/)
- [ ] **Node.js v16+** - [Descargar](https://nodejs.org/)
- [ ] **MongoDB** - [Descargar](https://www.mongodb.com/try/download/community)
- [ ] **Git** - [Descargar](https://git-scm.com/download/win)
- [ ] **Yarn** - Instalar después de Node.js con: `npm install -g yarn`

## 🚀 Instalación Paso a Paso

### 1️⃣ Verificar Instalaciones

Abre **PowerShell** o **CMD** y verifica:

```powershell
python --version
# Debe mostrar: Python 3.9.x o superior

node --version
# Debe mostrar: v16.x.x o superior

yarn --version
# Debe mostrar: 1.22.x o similar

mongod --version
# Debe mostrar la versión de MongoDB
```

### 2️⃣ Clonar el Repositorio

```powershell
cd C:\Users\TuUsuario\Documents
git clone <URL-DEL-REPOSITORIO>
cd farchodev-blog
```

### 3️⃣ Configurar Backend

#### A. Crear y Activar Entorno Virtual

```powershell
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (PowerShell)
.\venv\Scripts\Activate.ps1

# Si tienes error de permisos, ejecuta esto primero:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Alternativa para CMD:
# venv\Scripts\activate.bat
```

#### B. Instalar Dependencias

```powershell
# Actualizar pip primero
python -m pip install --upgrade pip

# Instalar todas las dependencias
pip install -r requirements.txt

# Instalar emergentintegrations (si no está en requirements.txt)
pip install emergentintegrations
```

**⚠️ Si obtienes errores durante la instalación:**

```powershell
# Para Windows, algunos paquetes pueden necesitar compiladores
# Instala Visual C++ Build Tools:
# https://visualstudio.microsoft.com/visual-cpp-build-tools/

# O instala paquetes binarios pre-compilados:
pip install --only-binary :all: bcrypt
pip install --only-binary :all: cryptography
```

#### C. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend`:

```powershell
# Crear archivo .env
New-Item -Path .env -ItemType File

# Editar con notepad
notepad .env
```

Contenido del archivo `.env`:

```env
# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="farchodev_blog"
CORS_ORIGINS="*"

# JWT Secret (cambiar en producción)
JWT_SECRET_KEY="tu-clave-secreta-super-segura-cambiala-en-produccion"

# Admin Emails (tu email para acceso admin)
ADMIN_EMAILS="tu-email@gmail.com"

# GitHub OAuth (opcional - dejar vacío por ahora)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GITHUB_REDIRECT_URI=""
```

### 4️⃣ Configurar Frontend

#### A. Instalar Dependencias

Abre una **nueva terminal PowerShell**:

```powershell
cd frontend

# Instalar dependencias con Yarn
yarn install

# Si yarn no funciona, puedes usar npm:
# npm install
```

#### B. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend`:

```powershell
# Crear archivo .env
New-Item -Path .env -ItemType File

# Editar con notepad
notepad .env
```

Contenido del archivo `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=0
```

### 5️⃣ Iniciar MongoDB

#### Opción A: Como Servicio de Windows

```powershell
# Iniciar servicio de MongoDB
net start MongoDB

# Para detenerlo:
# net stop MongoDB
```

#### Opción B: Manualmente

```powershell
# Navegar a la carpeta de MongoDB (ajusta la ruta según tu instalación)
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# Iniciar MongoDB
.\mongod.exe --dbpath="C:\data\db"

# Nota: Asegúrate de que la carpeta C:\data\db existe
# Si no existe, créala:
# mkdir C:\data\db
```

#### Verificar que MongoDB está corriendo

```powershell
# Conectar a MongoDB
mongosh

# Dentro de mongosh:
show dbs
exit
```

### 6️⃣ Iniciar la Aplicación

#### Terminal 1 - Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1

# Iniciar servidor FastAPI
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

#### Terminal 2 - Frontend

```powershell
cd frontend

# Iniciar servidor React
yarn start
```

El navegador debería abrirse automáticamente en `http://localhost:3000`

### 7️⃣ Verificar Instalación

1. **Backend**: Abre http://localhost:8001/docs
   - Deberías ver la documentación interactiva de la API (Swagger UI)

2. **Frontend**: Abre http://localhost:3000
   - Deberías ver la página principal del blog

3. **Base de Datos**: Conecta con MongoDB Compass
   - URI: `mongodb://localhost:27017`
   - Database: `farchodev_blog`

## 🔧 Comandos Útiles en Windows

### Backend

```powershell
# Activar entorno virtual
cd backend
.\venv\Scripts\Activate.ps1

# Instalar nueva dependencia
pip install nombre-paquete
pip freeze > requirements.txt

# Ejecutar tests
pytest -v

# Ver procesos usando puerto 8001
netstat -ano | findstr :8001

# Matar proceso por PID
taskkill /PID <numero-pid> /F
```

### Frontend

```powershell
# Limpiar caché y reinstalar
cd frontend
Remove-Item -Recurse -Force node_modules
yarn install

# Build de producción
yarn build

# Ver procesos usando puerto 3000
netstat -ano | findstr :3000
```

### MongoDB

```powershell
# Conectar a MongoDB
mongosh

# En MongoDB shell:
use farchodev_blog
db.posts.find()
db.categories.find()
show collections
```

## 🐛 Solución de Problemas Comunes

### ❌ Error: "No module named 'httpx'" o similar

**Causa**: Dependencias no instaladas

**Solución**:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### ❌ Error: "cannot be loaded because running scripts is disabled"

**Causa**: Política de ejecución de PowerShell

**Solución**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Error: "Port 8001 is already in use"

**Solución**:
```powershell
# Encontrar el proceso
netstat -ano | findstr :8001

# Matar el proceso (reemplaza <PID> con el número que aparece)
taskkill /PID <PID> /F
```

### ❌ Error: "MongoDB connection failed"

**Soluciones**:

1. Verificar que MongoDB está corriendo:
   ```powershell
   net start MongoDB
   ```

2. Verificar que la carpeta de datos existe:
   ```powershell
   mkdir C:\data\db
   ```

3. Verificar la URL en `.env`:
   ```
   MONGO_URL="mongodb://localhost:27017"
   ```

### ❌ Error: Frontend no carga o muestra página en blanco

**Soluciones**:

1. Limpiar caché del navegador (Ctrl+Shift+Delete)

2. Verificar que el backend está corriendo:
   ```powershell
   curl http://localhost:8001/api/
   ```

3. Verificar `.env` del frontend:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Reiniciar el frontend:
   ```powershell
   # Detener con Ctrl+C, luego:
   yarn start
   ```

### ❌ Error: "yarn : The term 'yarn' is not recognized"

**Solución**:
```powershell
npm install -g yarn

# Si no funciona, usa npm en su lugar:
npm install
npm start
```

### ❌ Error de compilación de bcrypt o cryptography

**Solución**:
```powershell
# Instalar versiones pre-compiladas
pip install --only-binary :all: bcrypt
pip install --only-binary :all: cryptography

# O instalar Visual C++ Build Tools:
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

## 🎯 Primeros Pasos

### 1. Registrarse como Usuario

1. Ve a http://localhost:3000
2. Click en "Registrarse"
3. Completa el formulario con tu email (el que pusiste en ADMIN_EMAILS)
4. Inicia sesión

### 2. Acceder al Panel Admin

1. Como tu email está en ADMIN_EMAILS, automáticamente tienes rol de admin
2. Click en tu avatar → "Admin Panel"
3. O ve directamente a http://localhost:3000/admin

### 3. Crear tu Primera Categoría

1. Admin → Categorías
2. Click "Nueva Categoría"
3. Nombre: "Desarrollo Web"
4. Descripción: "Artículos sobre desarrollo web"
5. Guardar

### 4. Crear tu Primer Post

1. Admin → Posts → "Nuevo Post"
2. Completa el formulario
3. Marca "Publicado"
4. Guardar

## 📊 Estructura de Carpetas

```
farchodev-blog/
├── backend/
│   ├── venv/                 # Entorno virtual (no subir a Git)
│   ├── .env                  # Variables de entorno (no subir a Git)
│   ├── server.py             # Aplicación principal
│   ├── auth.py               # Autenticación
│   ├── features.py           # Features (likes, bookmarks, etc.)
│   └── requirements.txt      # Dependencias Python
│
├── frontend/
│   ├── node_modules/         # Dependencias (no subir a Git)
│   ├── .env                  # Variables de entorno (no subir a Git)
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas
│   │   └── contexts/        # Contextos (AuthContext)
│   └── package.json         # Dependencias JavaScript
│
└── README.md
```

## 🔐 Seguridad

**⚠️ IMPORTANTE**: Antes de hacer deploy en producción:

1. Cambia `JWT_SECRET_KEY` por algo seguro:
   ```python
   # Generar clave segura en Python:
   import secrets
   print(secrets.token_urlsafe(32))
   ```

2. Cambia `CORS_ORIGINS="*"` por tu dominio:
   ```
   CORS_ORIGINS="https://tudominio.com"
   ```

3. Usa MongoDB Atlas en lugar de localhost

4. No subas archivos `.env` a Git

## 📚 Recursos Adicionales

- **FastAPI Docs**: http://localhost:8001/docs (cuando el servidor está corriendo)
- **MongoDB Compass**: Interfaz gráfica para MongoDB
- **Postman**: Para probar la API
- **VS Code**: Editor recomendado con extensiones de Python y React

## 🆘 Obtener Ayuda

Si tienes problemas:

1. Revisa esta guía completamente
2. Verifica los logs en las terminales
3. Busca el error en Google
4. Consulta la documentación oficial de cada tecnología

---

**¡Listo! Tu entorno de desarrollo está configurado.** 🎉

Para información más avanzada, consulta [DOCUMENTATION.md](./DOCUMENTATION.md).

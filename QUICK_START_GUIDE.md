# 🚀 Guía de Inicio Rápido - FarchoDev Blog

Esta guía te ayudará a tener el proyecto funcionando en **menos de 10 minutos**.

## ⚡ Resumen Ejecutivo

**FarchoDev Blog** es un sistema de blog completo para desarrollo de software:
- **Backend**: FastAPI (Python) + MongoDB
- **Frontend**: React + Tailwind CSS
- **Funcionalidades**: CRUD de posts, categorías, comentarios, newsletter, panel admin

## 📋 Checklist de Instalación

- [ ] Node.js v16+ instalado
- [ ] Python 3.9+ instalado
- [ ] MongoDB instalado y corriendo
- [ ] Yarn instalado
- [ ] Git instalado

## 🎯 Pasos de Instalación (5 minutos)

### 1️⃣ Preparar el Proyecto

```bash
# Clonar o navegar al directorio del proyecto
cd /app

# Verificar que tienes todo instalado
node --version    # Debe ser v16+
python --version  # Debe ser 3.9+
yarn --version    # Cualquier versión
mongod --version  # Debe estar instalado
```

### 2️⃣ Configurar Backend (2 minutos)

```bash
cd /app/backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv

# Activar entorno virtual
# En Linux/Mac:
source venv/bin/activate
# En Windows:
# venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Verificar archivo .env
cat .env
# Debe contener:
# MONGO_URL="mongodb://localhost:27017"
# DB_NAME="test_database"
# CORS_ORIGINS="*"
```

### 3️⃣ Configurar Frontend (1 minuto)

```bash
cd /app/frontend

# Instalar dependencias
yarn install

# Verificar archivo .env
cat .env
# Debe contener la URL del backend
# REACT_APP_BACKEND_URL=http://localhost:8001
```

### 4️⃣ Iniciar MongoDB

```bash
# Verificar que MongoDB está corriendo
sudo systemctl status mongodb

# Si no está corriendo, iniciarlo:
sudo systemctl start mongodb

# O simplemente:
mongod
```

### 5️⃣ Ejecutar la Aplicación (2 minutos)

**Opción A: Dos Terminales**

Terminal 1 - Backend:
```bash
cd /app/backend
source venv/bin/activate  # Si usas venv
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Terminal 2 - Frontend:
```bash
cd /app/frontend
yarn start
```

**Opción B: Usando Supervisor (si está configurado)**

```bash
sudo supervisorctl restart all
```

### 6️⃣ Verificar que Todo Funciona

1. **Backend**: Abre http://localhost:8001/api/
   - Deberías ver: `{"message": "FarchoDev Blog API"}`

2. **Frontend**: Abre http://localhost:3000
   - Deberías ver la página principal del blog

3. **Admin Panel**: Abre http://localhost:3000/admin
   - Deberías ver el dashboard de administración

## 🎨 Primeros Pasos en la Aplicación

### Crear tu Primera Categoría

1. Ve a http://localhost:3000/admin/categories
2. Click en "Nueva Categoría"
3. Completa:
   - Nombre: "Backend Development"
   - Descripción: "Artículos sobre desarrollo backend"
4. Click en "Crear"

### Crear tu Primer Post

1. Ve a http://localhost:3000/admin/posts
2. Click en "Nuevo Post"
3. Completa el formulario:
   - Título: "Mi Primer Post"
   - Contenido: Escribe algo (puedes usar Markdown)
   - Excerpt: "Este es mi primer post"
   - Categoría: Selecciona la categoría que creaste
   - Tags: Escribe algunos tags separados por coma
4. Activa "Publicado" si quieres que sea visible
5. Click en "Guardar"

### Ver tu Post

1. Ve a http://localhost:3000/blog
2. Deberías ver tu post listado
3. Click en el post para ver el detalle

## 🔧 Comandos Útiles

### Backend

```bash
# Iniciar servidor de desarrollo
cd /app/backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Ejecutar tests
pytest backend_test.py -v

# Ver logs
tail -f /var/log/supervisor/backend.*.log

# Verificar sintaxis Python
python -m py_compile server.py
```

### Frontend

```bash
# Iniciar desarrollo
cd /app/frontend
yarn start

# Build de producción
yarn build

# Ejecutar tests
yarn test

# Linting
yarn lint
```

### MongoDB

```bash
# Conectar a MongoDB
mongosh

# En MongoDB shell:
use test_database
db.posts.find().pretty()           # Ver posts
db.categories.find().pretty()      # Ver categorías
db.comments.find().pretty()        # Ver comentarios
db.newsletter.find().pretty()      # Ver suscriptores

# Contar documentos
db.posts.countDocuments()
db.categories.countDocuments()

# Limpiar colecciones (¡cuidado!)
db.posts.deleteMany({})
```

## 🐛 Solución Rápida de Problemas

### ❌ Error: "MongoDB connection failed"

**Solución**:
```bash
# Verificar que MongoDB está corriendo
sudo systemctl status mongodb

# Iniciar MongoDB
sudo systemctl start mongodb
```

### ❌ Error: "Port 8001 already in use"

**Solución**:
```bash
# Encontrar proceso usando el puerto
lsof -i :8001

# Matar el proceso
kill -9 <PID>
```

### ❌ Error: "Module not found" en Backend

**Solución**:
```bash
cd /app/backend
pip install -r requirements.txt
```

### ❌ Error: "Cannot find module" en Frontend

**Solución**:
```bash
cd /app/frontend
rm -rf node_modules
yarn install
```

### ❌ Frontend no se conecta al Backend

**Solución**:
1. Verificar que el backend está corriendo: `curl http://localhost:8001/api/`
2. Verificar REACT_APP_BACKEND_URL en `/app/frontend/.env`
3. Reiniciar el frontend: `yarn start`

### ❌ CORS Error

**Solución**:
Editar `/app/backend/.env`:
```
CORS_ORIGINS="*"
```
Reiniciar backend.

## 📊 Estructura de Datos Básica

### Post (Artículo)
```json
{
  "title": "Título del post",
  "content": "Contenido en markdown...",
  "excerpt": "Resumen breve",
  "category": "slug-de-categoria",
  "tags": ["tag1", "tag2"],
  "published": true
}
```

### Categoría
```json
{
  "name": "Nombre de Categoría",
  "description": "Descripción opcional"
}
```

### Comentario
```json
{
  "post_id": "id-del-post",
  "author_name": "Juan Pérez",
  "author_email": "juan@example.com",
  "content": "Contenido del comentario"
}
```

## 🎯 Flujo de Trabajo Típico

### Para Publicar un Nuevo Artículo:

1. **Crear/Verificar Categoría**
   - Admin → Categorías
   - Crear si no existe

2. **Escribir el Post**
   - Admin → Posts → Nuevo Post
   - Completar formulario
   - Marcar como "Publicado" cuando esté listo

3. **Verificar**
   - Ir a /blog
   - Ver que el post aparece
   - Verificar que se puede acceder al detalle

4. **Moderar Comentarios (si los hay)**
   - Admin → Comentarios
   - Aprobar comentarios apropiados

### Para Hacer Cambios en el Código:

1. **Backend**
   ```bash
   # Editar server.py
   nano /app/backend/server.py
   
   # El servidor se recarga automáticamente (--reload)
   # Si no, reiniciar manualmente:
   # Ctrl+C y volver a ejecutar uvicorn
   ```

2. **Frontend**
   ```bash
   # Editar componentes en src/
   nano /app/frontend/src/pages/Home.js
   
   # El navegador se recarga automáticamente (hot reload)
   ```

## 📚 Recursos de Aprendizaje

### Si eres nuevo en...

**FastAPI**:
- Documentación oficial: https://fastapi.tiangolo.com/
- Tutorial interactivo: http://localhost:8001/docs (cuando el servidor está corriendo)

**React**:
- Documentación oficial: https://react.dev/
- Tutorial: https://react.dev/learn

**MongoDB**:
- Documentación: https://www.mongodb.com/docs/
- Tutorial: https://www.mongodb.com/basics

**Tailwind CSS**:
- Documentación: https://tailwindcss.com/docs
- Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet

## 🚀 Siguientes Pasos

Ahora que tienes el proyecto funcionando:

1. **Explora el Código**
   - Lee `/app/backend/server.py` para entender los endpoints
   - Revisa `/app/frontend/src/App.js` para ver las rutas
   - Explora los componentes en `/app/frontend/src/components/`

2. **Lee la Documentación Completa**
   - Abre `/app/DOCUMENTATION.md`
   - Contiene información detallada sobre arquitectura, API, y más

3. **Experimenta**
   - Crea posts de prueba
   - Modifica estilos en Tailwind
   - Agrega nuevas funcionalidades

4. **Haz Deploy**
   - Sigue la guía de despliegue en DOCUMENTATION.md
   - Prueba con Heroku, Vercel, o tu VPS

## 💡 Tips Rápidos

- **Logs del Backend**: Revisa la consola donde ejecutaste uvicorn
- **Logs del Frontend**: Abre DevTools del navegador (F12)
- **MongoDB GUI**: Usa MongoDB Compass para visualizar datos
- **API Testing**: Usa http://localhost:8001/docs para probar la API
- **Hot Reload**: Ambos backend y frontend se recargan automáticamente

## 🆘 Obtener Ayuda

Si te atascas:

1. Consulta [DOCUMENTATION.md](./DOCUMENTATION.md) - Sección 14: Solución de Problemas
2. Revisa los logs en la consola
3. Verifica que todos los servicios estén corriendo
4. Busca el error en Google/Stack Overflow
5. Abre un issue en el repositorio

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, verifica:

- [ ] MongoDB está corriendo
- [ ] Backend responde en http://localhost:8001/api/
- [ ] Frontend carga en http://localhost:3000
- [ ] Puedes acceder al admin en http://localhost:3000/admin
- [ ] Puedes crear una categoría
- [ ] Puedes crear un post
- [ ] El post aparece en /blog

---

**¡Listo para empezar a desarrollar!** 🎉

Para información más detallada, consulta [DOCUMENTATION.md](./DOCUMENTATION.md).

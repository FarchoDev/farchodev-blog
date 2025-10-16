# 🚀 FarchoDev Blog - Blog de Desarrollo de Software

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

> Plataforma completa de blog especializada en desarrollo de software, construida con FastAPI, React y MongoDB.

## 📖 Índice

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación Completa](#-documentación-completa)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### Para Usuarios Públicos
- 📝 Explorar artículos de desarrollo de software
- 🔍 Búsqueda y filtros por categorías y tags
- 💬 Sistema de comentarios
- 📧 Suscripción a newsletter
- 👀 Contador de vistas y tiempo de lectura
- 📱 Diseño responsive y moderno

### Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- ✍️ Editor completo de posts con markdown
- 🏷️ Gestión de categorías (crear, editar, eliminar)
- ✅ Moderación de comentarios
- 👥 Gestión de suscriptores
- 🔄 Publicación/despublicación de posts

## 🛠 Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.110.1
- **Base de Datos**: MongoDB (Motor 3.3.1 - Async)
- **Validación**: Pydantic 2.6.4+
- **Servidor**: Uvicorn 0.25.0

### Frontend
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.5.1
- **Estilos**: Tailwind CSS 3.4.17
- **Componentes UI**: Radix UI
- **HTTP Client**: Axios 1.8.4
- **Iconos**: Lucide React 0.507.0
- **Notificaciones**: Sonner 2.0.3

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
cp .env.example .env  # Editar con tus credenciales
```

#### 3. Configurar Frontend
```bash
cd ../frontend

# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env  # Editar con la URL del backend
```

#### 4. Iniciar MongoDB
```bash
# Asegúrate de que MongoDB esté corriendo
mongod
```

#### 5. Ejecutar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

Accede a la aplicación en `http://localhost:3000` 🎉

## 📁 Estructura del Proyecto

```
app/
├── backend/                 # Backend FastAPI
│   ├── .env                # Variables de entorno
│   ├── server.py           # Aplicación principal
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # Frontend React
│   ├── public/            # Archivos estáticos
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── ui/       # Componentes Radix UI
│   │   │   ├── AdminLayout.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   └── PostCard.js
│   │   │
│   │   ├── pages/        # Páginas de la app
│   │   │   ├── admin/    # Panel de administración
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
│   │   │   └── About.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── tests/                  # Tests del proyecto
├── DOCUMENTATION.md        # 📚 DOCUMENTACIÓN COMPLETA
└── README.md              # Este archivo
```

## 📚 Documentación Completa

Para información detallada sobre arquitectura, API, desarrollo y despliegue, consulta:

### [📖 DOCUMENTACIÓN COMPLETA](./DOCUMENTATION.md)

La documentación incluye:
- Arquitectura técnica detallada
- Guía completa de todos los modelos de datos
- API Reference con ejemplos
- Flujos de trabajo explicados
- Guía de desarrollo paso a paso
- Instrucciones de despliegue
- Solución de problemas comunes
- Mejores prácticas

## 📷 Capturas de Pantalla

### Página Principal
Sección hero con artículos destacados y recientes

### Panel de Administración
Dashboard con estadísticas, gestión de posts, categorías y comentarios

### Editor de Posts
Editor completo con vista previa y publicación

## 🔌 API Endpoints

### Endpoints Públicos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/posts` | Listar posts publicados |
| `GET` | `/api/posts/{slug}` | Obtener post por slug |
| `GET` | `/api/categories` | Listar categorías |
| `POST` | `/api/comments` | Crear comentario |
| `POST` | `/api/newsletter/subscribe` | Suscribirse a newsletter |

### Endpoints de Administración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/admin/posts` | Listar todos los posts |
| `POST` | `/api/admin/posts` | Crear post |
| `PUT` | `/api/admin/posts/{id}` | Actualizar post |
| `DELETE` | `/api/admin/posts/{id}` | Eliminar post |
| `POST` | `/api/admin/categories` | Crear categoría |
| `PUT` | `/api/admin/categories/{id}` | Actualizar categoría |
| `DELETE` | `/api/admin/categories/{id}` | Eliminar categoría |
| `GET` | `/api/admin/stats` | Obtener estadísticas |

Ver [DOCUMENTATION.md](./DOCUMENTATION.md#9-api-reference) para detalles completos.

## 🧪 Testing

### Backend
```bash
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
- **Backend**: Heroku, Railway, Render
- **Frontend**: Vercel, Netlify
- **Database**: MongoDB Atlas (recomendado)

Ver [DOCUMENTATION.md](./DOCUMENTATION.md#12-despliegue) para instrucciones detalladas.

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

### v1.0.0 (Julio 2025)
- ✅ Lanzamiento inicial
- ✅ CRUD completo de posts
- ✅ Sistema de categorías con edición y eliminación
- ✅ Sistema de comentarios con moderación
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
- Todos los contribuidores de código abierto

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub

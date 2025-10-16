# 🔐 Sistema de Administración - FarchoDev Blog

## Configuración de Usuarios Admin

El blog tiene un sistema de roles donde ciertos usuarios pueden acceder al panel de administración (`/admin`).

---

## 📋 **Método 1: Admin Emails Automáticos (Recomendado)**

### Configuración Inicial

1. Abre el archivo `/app/backend/.env`
2. Busca la variable `ADMIN_EMAILS`
3. Agrega los emails que deben tener acceso admin (separados por comas):

```env
# Admin Emails (comma-separated list of emails that will have admin role)
ADMIN_EMAILS="admin@example.com,otro@example.com,tumail@gmail.com"
```

4. Reinicia el backend:
```bash
sudo supervisorctl restart backend
```

### Cómo Funciona

- Cualquier usuario que se **registre** con un email de la lista será automáticamente **admin**
- Los usuarios existentes serán actualizados a admin en su **próximo login**
- Puedes agregar/remover emails en cualquier momento

---

## 🛠️ **Método 2: Script de Promoción Manual**

Si ya tienes un usuario registrado y quieres promoverlo a admin:

### Promover un Usuario

```bash
cd /app/backend
python promote_admin.py usuario@example.com
```

**Salida esperada:**
```
✅ Usuario usuario@example.com promovido a admin exitosamente!
   Nombre: Juan Pérez
   Provider: local
```

### Listar Todos los Usuarios

```bash
cd /app/backend
python promote_admin.py --list
```

**Salida esperada:**
```
📋 USUARIOS REGISTRADOS:
--------------------------------------------------------------------------------
👑 Admin User                      | admin@example.com                   | admin | local
👤 Normal User                     | user@example.com                    | user  | local
--------------------------------------------------------------------------------
```

---

## 🔍 **Verificar Acceso Admin**

### En el Frontend

1. Inicia sesión con tu usuario
2. El navbar debe mostrar un link **"Admin"** (solo visible para admins)
3. Accede a `/admin` para ver el panel de administración

### En la API

Haz una petición autenticada a cualquier endpoint admin:

```bash
curl -X GET "http://localhost:8001/api/admin/stats" \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

Si eres admin, recibirás las estadísticas. Si no, recibirás:
```json
{
  "detail": "Admin access required"
}
```

---

## 🚨 **Notas Importantes**

1. **Seguridad**: No compartas el archivo `.env` ni expongas los emails admin públicamente
2. **Primer Admin**: Asegúrate de configurar al menos un email admin antes de desplegar a producción
3. **Múltiples Admins**: Puedes tener tantos admins como necesites
4. **Cambio de Email**: Si un admin cambia su email, debes actualizar la variable `ADMIN_EMAILS`

---

## ❓ **Troubleshooting**

### "No veo el botón Admin en el navbar"

- Verifica que tu email esté en `ADMIN_EMAILS` del `.env`
- Cierra sesión y vuelve a iniciar sesión
- Verifica en MongoDB que tu usuario tenga `role: "admin"`

### "Recibo 403 Forbidden en endpoints admin"

- Tu usuario no tiene el role admin
- Usa el script `promote_admin.py` para promoverte
- O agrega tu email a `ADMIN_EMAILS` y vuelve a iniciar sesión

### "El script promote_admin.py no funciona"

- Verifica que MongoDB esté corriendo: `sudo supervisorctl status mongodb`
- Verifica la variable `MONGO_URL` en el `.env`
- Asegúrate de que el usuario esté registrado primero

---

## 📚 **Referencia de Comandos**

```bash
# Promover usuario a admin
python promote_admin.py email@example.com

# Listar todos los usuarios
python promote_admin.py --list

# Reiniciar backend después de cambiar .env
sudo supervisorctl restart backend

# Ver logs del backend
tail -f /var/log/supervisor/backend.err.log
```

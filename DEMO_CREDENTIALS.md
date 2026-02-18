# Demo Credentials para Testing

Usa estas credenciales para probar la app con el mock:

## 📱 Demo Account

**Email:** demo@example.com
**Password:** password123

O cualquier combinación de email/password para crear cuentas de prueba dinámicamente.

## 🎯 Features en Mock

- ✅ Sign Up - Crea usuarios de prueba
- ✅ Sign In - Autentica con cualquier email/password
- ✅ Session Persistence - Simula almacenamiento de sesión
- ✅ Token Refresh - Auto-refresh cada hora
- ✅ Profile Management - Lee/edita perfil mock
- ✅ Error Handling - Mensajes descriptivos

## 🔄 Cambiar a Supabase Real

1. Crea proyecto en https://supabase.com
2. Copia credenciales a `.env`:
   ```
   REACT_APP_SUPABASE_URL=tu_url
   REACT_APP_SUPABASE_ANON_KEY=tu_key
   ```
3. Copia schema SQL de `/docs/DATABASE.md` a Supabase
4. Restart app - automáticamente usará cliente real

## 📊 Mock Database

Actualmente el mock simula:
- User signup/signin
- Session management
- Profile storage
- Auth state changes
- Basic storage operations

Para Fase 1+:
- Posts, comments, likes
- Following/followers
- Notifications
- Direct messages
- Media upload

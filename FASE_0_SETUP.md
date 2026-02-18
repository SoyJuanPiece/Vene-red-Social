# Fase 0 - Setup Guide

## ✅ Fase 0 Complete!

Los siguientes archivos han sido creados:

### Tipos & Theme (Fundación)
- `src/types/index.ts` - TypeScript types (User, Post, Media, etc.)
- `src/theme/colors.ts` - Color palette (Púrpura + Turquesa)
- `src/theme/typography.ts` - Typography scale (h1-h4, body, etc.)
- `src/theme/spacing.ts` - Spacing grid (8pt)
- `src/theme/index.ts` - Central theme export

### Componentes UI Base
- `src/components/ui/Button.tsx` - Primary, secondary, text, destructive variants
- `src/components/ui/Input.tsx` - Text input con validación y error states
- `src/components/ui/Text.tsx` - Typography component
- `src/components/ui/Card.tsx` - Cards reusables
- `src/components/ui/Index.ts` - Exports

### Backend & Auth
- `src/supabase/client.ts` - Supabase client initialization
- `src/services/auth.ts` - Auth service (signUp, signIn, signOut, refreshToken, etc.)
- `src/context/AuthContext.tsx` - Global auth state + useAuth hook

### Screens & Navigation
- `src/screens/auth/SplashScreen.tsx` - Loading screen
- `src/screens/auth/LoginScreen.tsx` - Login con validación
- `src/screens/auth/SignUpScreen.tsx` - Registro con validación
- `src/navigation/RootNavigator.tsx` - Main navigation (Auth ↔ App)

### Actualizado
- `App.tsx` - Integración con AuthProvider y RootNavigator
- `package.json` - Agregadas todas las dependencias necesarias

---

## 🚀 Próximos Pasos

### 1. Instalar Dependencias
```bash
cd /workspaces/Vene-red-Social/Venered
npm install
```

### 2. Configurar Supabase

**a) Crear proyecto en Supabase**
1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Copia la URL y ANON_KEY

**b) Crear archivo `.env`**
```
REACT_APP_SUPABASE_URL=tu_url_aqui
REACT_APP_SUPABASE_ANON_KEY=tu_key_aqui
```

**c) Copiar schema SQL**
- Ve a [/docs/DATABASE.md](../docs/DATABASE.md)
- Copia TODO el SQL (desde "-- Venered Database Schema" hasta el final)
- Abre Supabase > SQL Editor > New Query
- Pega y ejecuta

### 3. Verificar Build

```bash
# Iniciar Metro bundler
npm start

# En otra terminal - compilar Android
npm run android
```

### 4. Expected Flow (Fase 0)

1. **Splash Screen** - Loading inicial
2. **Auth State Check** - Valida sesión guardada
3. **Login Screen** - Si no hay sesión guardada
4. **SignUp Screen** - Opción para registrarse
5. **App Tabs** - Después de login (con placeholders - Fase 1+)

---

## 📋 Fase 0 Checklist

- ✅ Types definidos (User, Post, Media, Comment, Notification, etc.)
- ✅ Theme system creado (colors, typography, spacing)
- ✅ Base UI components (Button, Input, Text, Card, Avatar)
- ✅ Supabase client setup
- ✅ Auth service completa (signUp, signIn, signOut, refresh, profile)
- ✅ Auth context + useAuth hook
- ✅ Auth screens (Splash, Login, SignUp) con validación
- ✅ Navigation structure (Root, Auth, App tabs)
- ✅ App.tsx integración
- ⏳ npm install (próximo paso)
- ⏳ Supabase configuración (próximo paso)
- ⏳ Build & test (próximo paso)

---

## 🔍 Validaciones Implementadas

### LoginScreen
- Email required
- Formato email válido
- Contraseña required
- Mensajes de error claros

### SignUpScreen
- Email required + formato válido
- Username required (3+ caracteres, solo alphanumeric + _)
- Display name required
- Contraseña required (6+ caracteres)
- Confirmación de contraseña coincide

### Auth Service
- Auto-refresh de tokens (5 min antes de expirar)
- Session persistence en AsyncStorage
- Error handling descriptivo
- Profile sync Supabase ↔ App

---

## 🎨 Design System

### Colors
- **Primary**: #6C5CE7 (Púrpura vibrante)
- **Secondary**: #00D2D3 (Turquesa)
- **Error**: #D63031 (Rojo)
- **Like**: #FD79A8 (Rosa - diferente!)

### Typography
- h1-h4: Headers
- bodyLarge, body, bodySmall: Texto
- button, label: Especiales

### Spacing (8pt grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

---

## 📚 Próximas Fases

**Fase 1**: Profiles + Follows + Timeline (Home feed)
**Fase 2**: Posts + Media + Likes/Comments
**Fase 3**: Notifications + Search + Explore
**Fase 4**: Moderation + Admin panel
**Fase 5**: Federation (ActivityPub)
**Fase 6**: Stories + Direct Messages

---

## ⚠️ Troubleshooting

### Metro bundler cache issues
```bash
npm start -- --reset-cache
```

### Android build issues (vector-icons)
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### AsyncStorage access denied
- Vector icons needs linking (already in RN 0.84.0)
- Async storage also auto-linked

### Supabase null
- Check .env file exists and REACT_APP_* env vars are set
- Restart Metro bundler after .env changes

---

## 📞 Notas Importantes

1. **Auth persistence**: Session se guarda en AsyncStorage y se restaura al iniciar app
2. **Token refresh**: Automático 5 min antes de expirar
3. **Profile sync**: User profile viene de tabla `users` en Supabase
4. **Navigation**: Solo ve Auth screens si no hay sesión válida
5. **Error handling**: Todos los errores tienen mensajes descriptivos en español

---

## ✨ Capas Implementadas

```
App.tsx (Entry point)
  ↓
AuthProvider (GlobalState)
  ↓
RootNavigator (Auth ↔ App switcher)
  ├─ AuthStack → SplashScreen → Login/SignUp
  └─ AppStack → BottomTabs (Home, Search, Create, Notif, Profile)
      ↓
      useAuth() hook (acceso a user, session, signIn, signOut)
      ↓
      AuthService (Supabase operations)
      ↓
      supabase client (Low-level API)
```

---

¡Listo! Fase 0 completada. Ahora instala dependencias y configura Supabase. 🎉

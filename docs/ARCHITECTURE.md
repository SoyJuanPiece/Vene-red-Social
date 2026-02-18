# Arquitectura de Venered

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  REACT NATIVE APP                    │
│                   (Android Only)                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │     Auth     │  │    Social    │  │   Posts   │ │
│  │   Screens    │  │   Screens    │  │  Screens  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         React Navigation (Stack/Tabs)        │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │    Auth      │  │   Social     │  │   Media   │ │
│  │   Service    │  │   Service    │  │  Service  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          Supabase Client Library             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS/WSS
                   │
┌──────────────────▼──────────────────────────────────┐
│                  SUPABASE BACKEND                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │            Supabase Auth (JWT)               │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          PostgreSQL Database                 │  │
│  │  + Row Level Security (RLS)                  │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Supabase Storage (Media)             │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │        Realtime (Subscriptions)              │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Edge Functions (Optional)            │  │
│  │  - ActivityPub Federation                    │  │
│  │  - Media Processing                          │  │
│  │  - Moderation Tools                          │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. **Capa de Presentación (UI Layer)**
- **Screens**: Pantallas de la app (Login, Feed, Profile, etc.)
- **Components**: Componentes reutilizables (Button, Card, Input, etc.)
- **Navigation**: React Navigation con stack y tabs
- **Theme**: Sistema de diseño (colores, tipografía, espaciado)

### 2. **Capa de Lógica de Negocio (Business Logic Layer)**
- **Services**: Servicios modulares por funcionalidad
  - `AuthService`: Login, signup, logout, sesiones
  - `SocialService`: Follow, unfollow, block, mute
  - `PostService`: Crear, editar, eliminar posts
  - `MediaService`: Upload y gestión de archivos
  - `NotificationService`: Gestión de notificaciones
  - `FederationService`: ActivityPub (MVP avanzado)
- **Hooks**: Custom hooks para lógica compartida
- **Context/State**: React Context API + AsyncStorage para estado global

### 3. **Capa de Datos (Data Layer)**
- **Supabase Client**: Cliente configurado con credenciales
- **API Interfaces**: Tipos TypeScript para las respuestas
- **Cache**: Estrategias de cache local para media y datos

### 4. **Capa de Backend (Supabase)**
- **Auth**: JWT con refresh tokens
- **Database**: PostgreSQL con RLS
- **Storage**: Buckets para media (photos, videos, avatars)
- **Realtime**: Subscripciones para notificaciones y DMs
- **Edge Functions**: Lógica serverless para operaciones complejas

## Flujo de Datos Principales

### Autenticación
```
User Input → AuthService → Supabase Auth → JWT Token
                              ↓
                        AsyncStorage (session)
                              ↓
                        Set Auth Context
                              ↓
                        Navigate to Home
```

### Crear Post
```
Media Selection → MediaService → Compress/Resize
                                       ↓
                                 Upload to Supabase Storage
                                       ↓
                                  Get Public URL
                                       ↓
Post Data + Media URLs → PostService → Insert into DB (RLS check)
                                       ↓
                                  Realtime broadcast
                                       ↓
                                 Update Feed Cache
```

### Timeline/Feed
```
Load Feed Screen → Fetch from Supabase (paginated)
                              ↓
                        Apply RLS filters
                              ↓
                        Cache locally
                              ↓
                        Render posts
                              ↓
                   Listen to Realtime updates
```

## Tecnologías y Librerías Clave

### React Native Core
- React Native 0.84.0 (bare workflow)
- React 18.x
- TypeScript

### Navegación
- @react-navigation/native
- @react-navigation/stack
- @react-navigation/bottom-tabs

### Backend
- @supabase/supabase-js
- AsyncStorage para persistencia local

### Media
- react-native-image-picker (selección)
- react-native-fast-image (cache de imágenes)
- react-native-video (reproducción)

### UI/UX
- react-native-vector-icons
- react-native-gesture-handler
- react-native-reanimated

### Utilidades
- date-fns (fechas)
- axios o fetch nativo (HTTP adicional si necesario)

## Principios de Arquitectura

1. **Separación de Responsabilidades**: Cada servicio maneja una funcionalidad específica
2. **Single Source of Truth**: Supabase es la fuente de verdad, cache local solo para performance
3. **Seguridad First**: RLS en todas las tablas, validación en cliente y servidor
4. **Performance**: Paginación, lazy loading, cache inteligente
5. **Offline Support** (futuro): Queue de operaciones cuando no hay red
6. **Escalabilidad**: Diseño modular permite agregar features sin romper existentes

## Endpoints Clave

### Auth
- `POST /auth/v1/signup` - Registro
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `POST /auth/v1/token?grant_type=refresh_token` - Refresh token

### Profiles
- `GET /rest/v1/profiles?id=eq.{userId}` - Get profile
- `PATCH /rest/v1/profiles?id=eq.{userId}` - Update profile

### Posts
- `GET /rest/v1/posts?order=created_at.desc&limit=20` - Timeline
- `POST /rest/v1/posts` - Crear post
- `DELETE /rest/v1/posts?id=eq.{postId}` - Eliminar post

### Social
- `POST /rest/v1/follows` - Seguir usuario
- `DELETE /rest/v1/follows?follower_id=eq.{id}&following_id=eq.{id}` - Dejar de seguir

### Media Upload
- `POST /storage/v1/object/{bucket}/{path}` - Upload archivo
- `GET /storage/v1/object/public/{bucket}/{path}` - URL pública

## Estrategia de Cache

### Niveles de Cache
1. **AsyncStorage**: Sesión, preferencias del usuario
2. **In-Memory**: Posts del feed actual, profiles recientes
3. **Fast Image**: Cache de imágenes con LRU

### Invalidación
- Realtime: Invalidar cache en updates
- Time-based: Posts > 5 min requieren refresh
- Manual: Pull-to-refresh en feeds

# Fases de Desarrollo - Venered

## Estrategia de Implementación

Desarrollo incremental en fases para evitar conflictos y mantener estabilidad:
- Cada fase termina con la app funcional
- Testing exhaustivo antes de pasar a la siguiente fase
- Commits frecuentes en cada fase
- Branches para features grandes

## Fase 0: Fundación (1-2 semanas)

### Objetivos
Configurar infraestructura básica y autenticación.

### Tareas

#### Setup Inicial
- [x] Crear proyecto React Native bare
- [ ] Configurar TypeScript
- [ ] Configurar ESLint y Prettier
- [ ] Configurar estructura de carpetas
- [ ] Instalar dependencias core

#### Supabase Setup
- [ ] Crear proyecto en Supabase
- [ ] Configurar autenticación (email/password)
- [ ] Crear tabla `profiles`
- [ ] Configurar RLS básico
- [ ] Configurar Storage buckets (avatars)

#### Autenticación
- [ ] Screens: Login, Signup, Splash
- [ ] AuthService con Supabase
- [ ] Almacenamiento seguro de tokens (AsyncStorage)
- [ ] Context de autenticación
- [ ] Auto-login con token guardado

#### Navegación
- [ ] Configurar React Navigation
- [ ] Stack de autenticación
- [ ] Stack principal (placeholder)
- [ ] Protección de rutas

#### Sistema de Diseño
- [ ] Crear carpeta theme/
- [ ] Definir colores y tipografía
- [ ] Crear componentes base: Button, Input, Text
- [ ] Implementar theme provider

### Entregables
- App que permite registro, login y logout
- Sesión persistente entre reinicios
- Navegación básica funcional

### Testing Phase 0
```bash
# Checklist
- [ ] Registro de usuario nuevo funciona
- [ ] Login con credenciales correctas funciona
- [ ] Login con credenciales incorrectas muestra error
- [ ] Logout limpia sesión
- [ ] App recuerda sesión al reiniciar
- [ ] Navegación entre screens funciona
- [ ] No hay crashes en flujo completo
```

---

## Fase 1: Perfiles y Social Básico (2 semanas)

### Objetivos
Perfiles de usuario, timeline básico, follows.

### Tareas

#### Perfiles
- [ ] Screen de perfil propio
- [ ] Screen de perfil de otros usuarios
- [ ] Editar perfil (username, bio, avatar)
- [ ] Upload de avatar a Supabase Storage
- [ ] Visualización de stats (posts, followers, following)

#### Base de Datos
- [ ] Tabla `follows`
- [ ] Tabla `posts` (básica, sin media todavía)
- [ ] Triggers para contadores
- [ ] RLS para follows y posts

#### Social
- [ ] Botón Follow/Unfollow
- [ ] Lista de followers
- [ ] Lista de following
- [ ] Contador de followers/following en tiempo real

#### Timeline
- [ ] Screen de Home Feed (vacío inicialmente)
- [ ] Screen de Public Feed
- [ ] Paginación básica
- [ ] Pull-to-refresh
- [ ] Placeholder para posts sin media

#### Navegación
- [ ] Bottom tabs: Home, Search, Create, Notifications, Profile
- [ ] Navegación entre perfiles
- [ ] Stack de perfil con seguidos/seguidores

### Entregables
- Perfiles completos con edición
- Sistema de follows funcional
- Timeline con paginación (sin posts visuales todavía)

### Testing Phase 1
```bash
# Checklist
- [ ] Editar perfil guarda cambios
- [ ] Avatar se sube y muestra correctamente
- [ ] Follow/Unfollow actualiza inmediatamente
- [ ] Contadores de followers/following son correctos
- [ ] Timeline carga posts (texto placeholder)
- [ ] Paginación carga más posts
- [ ] Pull-to-refresh recarga timeline
- [ ] Ver perfil de otro usuario funciona
```

---

## Fase 2: Posts con Media (2-3 semanas)

### Objetivos
Crear posts con fotos/videos, likes, comentarios.

### Tareas

#### Media Upload
- [ ] Integrar react-native-image-picker
- [ ] Selección de foto/video de galería
- [ ] Captura de foto con cámara
- [ ] Compresión de imágenes
- [ ] Preview antes de subir
- [ ] Upload a Supabase Storage
- [ ] Progress indicator

#### Base de Datos
- [ ] Tabla `media`
- [ ] Tabla `likes`
- [ ] Tabla `comments`
- [ ] Triggers para likes_count y comments_count
- [ ] RLS para todas las tablas

#### Crear Post
- [ ] Screen de creación de post
- [ ] Selección múltiple de media (álbum)
- [ ] Editor de caption
- [ ] Detección de hashtags y menciones
- [ ] Selector de visibilidad (public/private/unlisted)
- [ ] Post con múltiples fotos (carrusel)

#### Visualización de Posts
- [ ] Componente PostCard completo
- [ ] Visualización de media (imágenes)
- [ ] Carrusel para múltiples fotos
- [ ] Reproductor de video básico
- [ ] Cache de imágenes (react-native-fast-image)

#### Interacciones
- [ ] Like/Unlike (animación)
- [ ] Comentar en post
- [ ] Ver lista de comentarios
- [ ] Reply a comentarios
- [ ] Ver lista de likes

#### Timeline Updates
- [ ] Mostrar posts con media en feeds
- [ ] Optimistic updates para likes
- [ ] Realtime: nuevos posts aparecen automáticamente

### Entregables
- Crear posts con fotos/videos funcional
- Timeline visual con media
- Likes y comentarios operativos

### Testing Phase 2
```bash
# Checklist
- [ ] Upload de foto desde galería funciona
- [ ] Upload de foto desde cámara funciona
- [ ] Crear post con múltiples fotos funciona
- [ ] Caption con hashtags se guarda
- [ ] Post aparece en timeline inmediatamente
- [ ] Like/Unlike actualiza contador
- [ ] Comentar en post funciona
- [ ] Reply a comentario funciona
- [ ] Ver lista de comentarios carga correctamente
- [ ] Videos se reproducen sin problemas
- [ ] Carrusel de fotos funciona smooth
```

---

## Fase 3: Notificaciones y Búsqueda (1-2 semanas)

### Objetivos
Sistema de notificaciones, búsqueda de usuarios/posts/hashtags.

### Tareas

#### Notificaciones
- [ ] Tabla `notifications` completa
- [ ] Trigger: notificar en like
- [ ] Trigger: notificar en comentario
- [ ] Trigger: notificar en follow
- [ ] Trigger: notificar en mención
- [ ] Screen de notificaciones
- [ ] Badge con count de no leídas
- [ ] Marcar como leída
- [ ] Navegación desde notificación al contenido

#### Realtime Notifications
- [ ] Suscripción a tabla notifications
- [ ] Update en tiempo real del badge
- [ ] Sonido/vibración opcional

#### Búsqueda
- [ ] Screen de búsqueda
- [ ] Buscar usuarios por username
- [ ] Buscar posts por caption
- [ ] Buscar hashtags
- [ ] Historial de búsquedas recientes
- [ ] Sugerencias de usuarios

#### Hashtags
- [ ] Tabla `hashtags` y `post_hashtags`
- [ ] Extracción automática de hashtags al crear post
- [ ] Screen de hashtag (posts con ese hashtag)
- [ ] Trending hashtags

#### Explore
- [ ] Tab de Explore
- [ ] Posts públicos populares (más likes)
- [ ] Grid de fotos
- [ ] Hashtags en tendencia

### Entregables
- Notificaciones en tiempo real
- Búsqueda completa (usuarios, posts, hashtags)
- Página de Explore funcional

### Testing Phase 3
```bash
# Checklist
- [ ] Notificación aparece cuando alguien da like
- [ ] Notificación aparece cuando alguien comenta
- [ ] Notificación aparece cuando te siguen
- [ ] Badge de notificaciones actualiza en tiempo real
- [ ] Tap en notificación navega al contenido correcto
- [ ] Buscar usuario por nombre funciona
- [ ] Buscar hashtag muestra posts relevantes
- [ ] Hashtags trending se calculan correctamente
- [ ] Explore muestra posts populares
```

---

## Fase 4: Moderación y Admin (1-2 semanas)

### Objetivos
Reportes, bloqueo, muteo, panel de administración.

### Tareas

#### Block y Mute
- [ ] Tablas `blocks` y `mutes`
- [ ] RLS: bloquear acceso cruzado
- [ ] Botón Block user
- [ ] Botón Mute user
- [ ] Lógica: usuarios bloqueados no ven tu contenido
- [ ] Lógica: usuarios muteados no aparecen en tu feed

#### Reportes
- [ ] Tabla `reports`
- [ ] Screen de reportar usuario/post
- [ ] Razones predefinidas (spam, harassment, etc.)
- [ ] Descripción opcional

#### Panel Admin (básico)
- [ ] Flag `is_admin` en profiles
- [ ] Screen de admin (solo visible para admins)
- [ ] Ver reportes pendientes
- [ ] Revisar contenido reportado
- [ ] Acciones: dismiss, delete post, ban user
- [ ] Tabla `admin_actions` (log de acciones)

#### Content Moderation
- [ ] Flag `is_nsfw` en posts
- [ ] Content warning overlay
- [ ] Filtro NSFW en settings

### Entregables
- Block y mute funcionales
- Sistema de reportes operativo
- Panel admin básico

### Testing Phase 4
```bash
# Checklist
- [ ] Bloquear usuario impide ver su contenido
- [ ] Usuario bloqueado no puede ver tu contenido
- [ ] Mutear usuario quita sus posts del feed
- [ ] Reportar post envía reporte
- [ ] Admin puede ver reportes
- [ ] Admin puede eliminar post reportado
- [ ] Admin puede banear usuario
- [ ] Content warning funciona en posts NSFW
```

---

## Fase 5: Federación ActivityPub (3-4 semanas) - AVANZADO

### Objetivos
Implementar protocolo ActivityPub para federación con otras instancias.

### Tareas

#### Setup ActivityPub
- [ ] Tabla `instances` (instancias federadas conocidas)
- [ ] Tabla `actors` (usuarios remotos)
- [ ] Tabla `activities` (inbox/outbox)
- [ ] WebFinger endpoint
- [ ] Actor endpoint (perfil ActivityPub)

#### Outbox (Enviar actividades)
- [ ] Edge Function: publicar Create activity
- [ ] Edge Function: publicar Like activity
- [ ] Edge Function: publicar Follow activity
- [ ] Firmado HTTP signatures
- [ ] Retry lógica

#### Inbox (Recibir actividades)
- [ ] Edge Function: inbox endpoint
- [ ] Validación de firmas
- [ ] Procesar Follow
- [ ] Procesar Like
- [ ] Procesar Create (posts remotos)
- [ ] Shared inbox (optimización)

#### Discovery
- [ ] Buscar usuarios remotos (@user@instance.com)
- [ ] Fetch perfil remoto
- [ ] Fetch posts remotos
- [ ] Cache de actores remotos

#### UI Federada
- [ ] Indicador de usuarios remotos
- [ ] Seguir usuario remoto
- [ ] Ver posts de usuarios remotos en timeline
- [ ] Interactuar con posts remotos (like, comment)

### Entregables
- Federación básica con otras instancias ActivityPub
- Seguir usuarios remotos
- Ver contenido federado en timeline

### Testing Phase 5
```bash
# Checklist
- [ ] Buscar usuario remoto retorna resultado
- [ ] Seguir usuario remoto envía Follow activity
- [ ] Posts locales se envían a seguidores remotos
- [ ] Likes en posts locales notifican instancias remotas
- [ ] Posts remotos aparecen en timeline si sigues al autor
- [ ] Inbox procesa Follow correctamente
- [ ] Inbox procesa Like correctamente
```

---

## Fase 6: Stories, DMs y Push (2-3 semanas)

### Objetivos
Historias temporales, mensajes directos, notificaciones push.

### Tareas

#### Stories
- [ ] Tabla `stories` y `story_views`
- [ ] Upload de story (foto/video)
- [ ] Bucket de storage para stories
- [ ] Visualización de stories (fullscreen)
- [ ] Timer de expiración (24h)
- [ ] Lista de viewers
- [ ] Realtime: nuevas stories aparecen
- [ ] Cron job para eliminar stories expiradas

#### DMs
- [ ] Tabla `direct_messages`
- [ ] Screen de mensajes (lista de conversaciones)
- [ ] Screen de conversación (chat)
- [ ] Enviar mensaje
- [ ] Enviar foto en DM
- [ ] Realtime: mensajes llegan instantáneamente
- [ ] Indicador de "escribiendo..."
- [ ] Marcar como leído

#### Push Notifications (Opcional)
- [ ] Configurar Firebase Cloud Messaging (FCM)
- [ ] Guardar device tokens en DB
- [ ] Edge Function: enviar push en like/comment/follow
- [ ] Edge Function: enviar push en DM
- [ ] Handle push tap (deep linking)

### Entregables
- Stories con expiración 24h
- DMs en tiempo real
- Push notifications (opcional)

### Testing Phase 6
```bash
# Checklist
- [ ] Subir story funciona
- [ ] Story aparece en barra de stories
- [ ] Ver story ajena funciona
- [ ] Story expira después de 24h
- [ ] Enviar DM entrega mensaje
- [ ] DM aparece en tiempo real
- [ ] Foto en DM se envía correctamente
- [ ] Push notification llega cuando alguien comenta
- [ ] Tap en push abre la app en el contenido correcto
```

---

## Métricas de Calidad

### Performance Targets

| Métrica | Target | Método de Medición |
|---------|--------|-------------------|
| Cold start | < 3s | Flipper performance monitor |
| Feed initial load | < 2s (WiFi), < 4s (LTE) | Network tab + timer |
| Media upload success rate | > 99% | Analytics events |
| Crash-free sessions | > 99.5% | Crashlytics (opcional) |
| API error rate | < 1% | Supabase dashboard |
| Frame rate | > 55 FPS | React DevTools profiler |

### Code Quality

```bash
# ESLint: 0 errores
npm run lint

# TypeScript: 0 errores de tipo
npm run type-check

# Tests unitarios: > 70% coverage (opcional)
npm run test -- --coverage
```

### Test Devices Mínimos

- Android 8.0 (API 26) - Low-end device
- Android 11 (API 30) - Mid-range device
- Android 14 (API 34) - High-end device

---

## Checklist General de Testing

### Funcional
- [ ] Todos los flujos principales sin crashes
- [ ] Validación de formularios funciona
- [ ] Mensajes de error son claros
- [ ] Estados de loading visibles
- [ ] Offline: no crashes (graceful degradation)

### UI/UX
- [ ] Navegación intuitiva
- [ ] Animaciones smooth
- [ ] Imágenes cargan con placeholders
- [ ] Botones tienen feedback visual
- [ ] Inputs tienen labels claros

### Performance
- [ ] Scroll en feeds es fluido (60fps)
- [ ] Imágenes no consumen memoria excesiva
- [ ] App no se congela al subir media
- [ ] Paginación no hace refetch innecesario

### Seguridad
- [ ] Tokens no se loguean en consola
- [ ] API keys no en código
- [ ] Inputs sanitizados
- [ ] RLS impide acceso no autorizado

---

## Plan de Releases

### v0.1.0 - MVP Alpha (Fase 0 + Fase 1)
- Autenticación
- Perfiles
- Follows
- Timeline básico

### v0.2.0 - Beta (Fase 2)
- Posts con media
- Likes y comentarios
- Timeline visual completo

### v0.3.0 - Feature Complete (Fase 3)
- Notificaciones
- Búsqueda
- Explore

### v0.4.0 - Moderation (Fase 4)
- Block/Mute
- Reportes
- Admin panel

### v1.0.0 - Production
- Todo estable y testeado
- Performance optimizado
- Documentación completa

### v1.1.0 - Federation (Fase 5)
- ActivityPub

### v1.2.0 - Advanced (Fase 6)
- Stories
- DMs
- Push notifications

---

## Backlog de Features Futuras

- [ ] Collections/Saved posts en carpetas
- [ ] 2FA para seguridad extra
- [ ] Modo oscuro completo
- [ ] Temas personalizables
- [ ] Estadísticas de cuenta (insights)
- [ ] Programar posts
- [ ] Borradores
- [ ] Archivos (posts antiguos ocultos)
- [ ] Close friends para stories
- [ ] Polls en stories
- [ ] Live streaming (muy avanzado)
- [ ] Monetización (e-commerce, tips)

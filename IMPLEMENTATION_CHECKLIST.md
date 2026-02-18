# Checklist de Implementación - Venered

Este documento es un checklist exhaustivo para el desarrollo completo del proyecto.

## Pre-requisitos

### Configuración del Sistema
- [ ] Node.js v20+ instalado
- [ ] npm v10+ instalado
- [ ] Java JDK 17 instalado
- [ ] Android SDK configurado en $ANDROID_HOME
- [ ] Gradle funcionando
- [ ] Git configurado

### Proyecto Base
- [ ] Repositorio creado
- [ ] Rama main protegida
- [ ] .gitignore configurado
- [ ] README.md creado
- [ ] Documentación en `/docs`

### Supabase Setup
- [ ] Proyecto creado en Supabase
- [ ] URL y ANON_KEY obtenidas
- [ ] Email verification habilitado
- [ ] Database backups configurados (7 días)

---

## FASE 0: Fundación

### Backend Setup
- [ ] Database schema creado (DATABASE.md)
- [ ] RLS policies configuradas
- [ ] Storage buckets creados (avatars, posts, stories)
- [ ] Storage policies configuradas
- [ ] Triggers de actualización creados
- [ ] Functions creadas

### TypeScript & Config
- [ ] [ ] tsconfig.json configurado
- [ ] eslint configuration (.eslintrc.js)
- [ ] Prettier configuration (.prettierrc)
- [ ] jest.config.js para tests
- [ ] Type definitions (src/types/)

### Theme & Components
- [ ] `src/theme/colors.ts` - Paleta de colores
- [ ] `src/theme/typography.ts` - Tipos y estilos
- [ ] `src/theme/spacing.ts` - Escala de espaciado
- [ ] `src/theme/index.ts` - Export central
- [ ] Componente `Button.tsx`
- [ ] Componente `Input.tsx`
- [ ] Componente `Card.tsx`
- [ ] Componente `Text.tsx`
- [ ] Componente `Avatar.tsx`

### Auth Service
- [ ] `src/supabase/client.ts` - Cliente Supabase
- [ ] `src/services/auth.ts` - AuthService
  - [ ] `signUp(email, password)`
  - [ ] `signIn(email, password)`
  - [ ] `signOut()`
  - [ ] `refreshSession()`
  - [ ] `getCurrentUser()`
  - [ ] `updateProfile(data)`
- [ ] Keychain/Secure storage para tokens
- [ ] Token refresh automático

### Context & State
- [ ] `src/context/AuthContext.tsx`
- [ ] `src/context/AppContext.tsx`
- [ ] Hooks: `useAuth()`, `useApp()`

### Navigation
- [ ] `src/navigation/RootNavigator.tsx`
- [ ] `src/navigation/AuthStack.tsx`
- [ ] `src/navigation/AppStack.tsx`
- [ ] Navigation linking configurado

### Screens Auth
- [ ] `src/screens/auth/SplashScreen.tsx`
- [ ] `src/screens/auth/LoginScreen.tsx`
- [ ] `src/screens/auth/SignUpScreen.tsx`
- [ ] `src/screens/auth/ForgotPasswordScreen.tsx` (opcional)
- [ ] Validación de inputs
- [ ] Error handling y feedback

### App Root
- [ ] `src/App.tsx` - Componente principal
- [ ] Theme provider configurado
- [ ] Navigation stack integrado
- [ ] Auth context provider

### Version Control
- [ ] `.env` copiad del `.env.example`
- [ ] `.env` añadido a `.gitignore`
- [ ] Initial commit en rama main
- [ ] Rama develop creada

### Documentación Fase 0
- [ ] ARCHITECTURE.md completado
- [ ] BUILD_GUIDE.md completado
- [ ] SECURITY.md completado

### Testing Fase 0
- [ ] Signup registra usuario
- [ ] Login inicia sesión correctamente
- [ ] Sesión persiste tras reinicio
- [ ] Logout limpia sesión
- [ ] Navegación funciona
- [ ] No hay crashes

---

## FASE 1: Perfiles y Social Básico

### Database Expand
- [ ] Tabla `profiles` con RLS
- [ ] Tabla `follows` con RLS
- [ ] Tabla `blocks` con RLS
- [ ] Tabla `mutes` con RLS
- [ ] Triggers para contadores

### Social Service
- [ ] `src/services/social.ts`
  - [ ] `followUser(userId)`
  - [ ] `unfollowUser(userId)`
  - [ ] `blockUser(userId)`
  - [ ] `unblockUser(userId)`
  - [ ] `muteUser(userId)`
  - [ ] `unmuteUser(userId)`
  - [ ] `getFollowers(userId)`
  - [ ] `getFollowing(userId)`
  - [ ] `getUser(userId)`
  - [ ] `updateProfile(data)`

### Profile Components
- [ ] `src/components/profile/ProfileHeader.tsx`
- [ ] `src/components/profile/ProfileStats.tsx`
- [ ] `src/components/profile/FollowButton.tsx`
- [ ] `src/components/profile/FollowersList.tsx`
- [ ] `src/components/profile/FollowingList.tsx`

### Profile Screens
- [ ] `src/screens/social/ProfileScreen.tsx` (perfil propio)
- [ ] `src/screens/social/OtherProfileScreen.tsx` (otro usuario)
- [ ] `src/screens/social/EditProfileScreen.tsx`
- [ ] `src/screens/social/FollowersScreen.tsx`
- [ ] `src/screens/social/FollowingScreen.tsx`

### Media Service
- [ ] `src/services/media.ts`
  - [ ] `uploadAvatar(uri)`
  - [ ] `deleteAvatar()`

### Timeline
- [ ] `src/screens/home/HomeScreen.tsx`
- [ ] `src/screens/home/PublicFeedScreen.tsx`
- [ ] Paginación básica (offset/limit)
- [ ] Pull-to-refresh
- [ ] Loading states

### Database Queries
- [ ] `getTimeline(userId, limit, offset)`
- [ ] `getPublicFeed(limit, offset)`
- [ ] Índices creados para perfomance

### Navigation Update
- [ ] Bottom tabs: Home, Explore (placeholder), Create (placeholder), Notifications (placeholder), Profile
- [ ] Stack de perfil

### Testing Fase 1
- [ ] Editar perfil guarda cambios
- [ ] Avatar se sube y muestra
- [ ] Follow/Unfollow actualiza
- [ ] Contadores correctos
- [ ] Timeline carga posts
- [ ] Paginación funciona
- [ ] Perfiles de otros usuarios visibles

---

## FASE 2: Posts con Media

### Database Expand
- [ ] Tabla `posts` con RLS
- [ ] Tabla `media` con RLS
- [ ] Tabla `likes` con RLS
- [ ] Tabla `comments` con RLS
- [ ] Triggers para contadores de likes/comments
- [ ] Tabla `post_hashtags`
- [ ] Tabla `hashtags`

### Media Service Expand
- [ ] Compresión de imágenes
- [ ] Generación de thumbnails
- [ ] Upload a Storage
- [ ] Progress tracking

### Post Service
- [ ] `src/services/posts.ts`
  - [ ] `createPost(caption, media, visibility)`
  - [ ] `getPost(postId)`
  - [ ] `getPosts(filters)`
  - [ ] `updatePost(postId, data)`
  - [ ] `deletePost(postId)`
  - [ ] `likePost(postId)`
  - [ ] `unlikePost(postId)`
  - [ ] `getLikes(postId)`
  - [ ] `commentPost(postId, content)`
  - [ ] `getComments(postId)`
  - [ ] `deleteComment(commentId)`
  - [ ] `replyComment(commentId, content)`

### Components
- [ ] `src/components/feed/PostCard.tsx`
- [ ] `src/components/feed/MediaCarousel.tsx`
- [ ] `src/components/feed/LikeButton.tsx`
- [ ] `src/components/feed/CommentSection.tsx`
- [ ] `src/components/feed/CommentItem.tsx`

### Screens
- [ ] `src/screens/create/CreatePostScreen.tsx`
  - [ ] Image/video selection
  - [ ] Media preview
  - [ ] Caption input
  - [ ] Visibility selector
  - [ ] Upload with progress

### Media Upload Flow
- [ ] Validación de tipo y tamaño
- [ ] Compresión local
- [ ] Upload paralelo
- [ ] Retry logic
- [ ] Error handling

### Timeline Update
- [ ] Mostrar posts con media
- [ ] Carrusel de fotos
- [ ] Reproductor de video
- [ ] Cache de imágenes (react-native-fast-image)

### Interacciones
- [ ] Like/Unlike con animación
- [ ] Contador de likes
- [ ] Comentarios en modal
- [ ] Replies a comentarios

### Realtime
- [ ] Supabase Realtime listeners
- [ ] Nuevos posts aparecen automáticamente
- [ ] Likes/comments actualizan en tiempo real

### Testing Fase 2
- [ ] Crear post con fotos funciona
- [ ] Crear post con video funciona
- [ ] Upload múltiples fotos
- [ ] Like/Unlike actualiza
- [ ] Comentar funciona
- [ ] Reply a comentario funciona
- [ ] Timeline muestra media correctamente
- [ ] Carrusel de fotos smooth
- [ ] Video se reproduce

---

## FASE 3: Notificaciones y Búsqueda

### Database Expand
- [ ] Tabla `notifications` con RLS
- [ ] Triggers para notificaciones en likes
- [ ] Triggers para notificaciones en comments
- [ ] Triggers para notificaciones en follows
- [ ] Triggers para notificaciones en mentions

### Notification Service
- [ ] `src/services/notifications.ts`
  - [ ] `getNotifications(userId)`
  - [ ] `markAsRead(notificationId)`
  - [ ] `markAllAsRead(userId)`
  - [ ] `deleteNotification(notificationId)`
  - [ ] Realtime subscription

### Notification Components
- [ ] `src/components/notifications/NotificationItem.tsx`
- [ ] `src/components/notifications/NotificationBadge.tsx`

### Notification Screens
- [ ] `src/screens/notifications/NotificationsScreen.tsx`
- [ ] Badge con count

### Search Service
- [ ] `src/services/search.ts`
  - [ ] `searchUsers(query)`
  - [ ] `searchPosts(query)`
  - [ ] `searchHashtags(query)`
  - [ ] `getSearchHistory(userId)`
  - [ ] `addSearchHistory(userId, query)`
  - [ ] `clearSearchHistory(userId)`

### Search Components
- [ ] `src/components/search/SearchBar.tsx`
- [ ] `src/components/search/SearchResult.tsx`

### Search Screens
- [ ] `src/screens/social/SearchScreen.tsx`
- [ ] `src/screens/social/HashtagScreen.tsx`

### Explore
- [ ] `src/screens/explore/ExploreScreen.tsx`
- [ ] Grid de posts populares
- [ ] Trending hashtags
- [ ] Usuarios recomendados

### Hashtags
- [ ] Extracción automática de hashtags
- [ ] Guardar en post_hashtags
- [ ] Trending calculation
- [ ] Hashtag screen

### Testing Fase 3
- [ ] Notificaciones llegan en tiempo real
- [ ] Badge actualiza
- [ ] Buscar usuarios funciona
- [ ] Buscar posts funciona
- [ ] Buscar hashtags funciona
- [ ] Explore muestra posts populares
- [ ] Hashtag trending calcula correctamente

---

## FASE 4: Moderación y Admin

### Database Expand
- [ ] Tabla `reports` con RLS
- [ ] Tabla `admin_actions` (log)
- [ ] Flag `is_admin` en profiles
- [ ] Flag `is_nsfw` en posts
- [ ] Content warning field en posts

### Moderation Service
- [ ] `src/services/moderation.ts`
  - [ ] `reportUser(userId, reason, description)`
  - [ ] `reportPost(postId, reason, description)`
  - [ ] `getReports(filters)`
  - [ ] `resolveReport(reportId, action)`
  - [ ] `banUser(userId, reason)`
  - [ ] `unbanUser(userId)`
  - [ ] `deletePost(postId, reason)`

### Admin Service
- [ ] `src/services/admin.ts`
  - [ ] `getAdminStats()`
  - [ ] `getUsers(filters, pagination)`
  - [ ] `getReports(filters, pagination)`
  - [ ] `getUserActivity(userId)`

### Moderation Components
- [ ] `src/components/moderation/ReportModal.tsx`
- [ ] `src/components/moderation/ContentWarningBanner.tsx`

### Admin Screens
- [ ] `src/screens/admin/AdminDashboard.tsx`
- [ ] `src/screens/admin/ReportsScreen.tsx`
- [ ] `src/screens/admin/ReviewContentScreen.tsx`
- [ ] `src/screens/admin/UsersManagementScreen.tsx`
- [ ] `src/screens/admin/BannedUsersScreen.tsx`

### Admin Components
- [ ] `src/components/admin/ReportItem.tsx`
- [ ] `src/components/admin/AdminStats.tsx`
- [ ] `src/components/admin/UserManagementItem.tsx`

### Block/Mute Update
- [ ] Bloquear usuario impide verlo
- [ ] Muteado no aparece en feed
- [ ] List de bloqueados

### Testing Fase 4
- [ ] Bloquear usuario funciona
- [ ] Mutear usuario funciona
- [ ] Reportar post funciona
- [ ] Admin ve reportes
- [ ] Admin puede resolver reportes
- [ ] Admin puede banear usuarios
- [ ] Content warning funciona

---

## FASE 5: ActivityPub Federation (Avanzado)

### Federation Service
- [ ] `src/services/federation.ts`
- [ ] WebFinger protocol implementation
- [ ] HTTP Signature validation
- [ ] Actor endpoint
- [ ] Inbox endpoint
- [ ] Outbox endpoint
- [ ] Shared inbox

### Database Expand
- [ ] Tabla `instances`
- [ ] Tabla `actors` (usuarios remotos)
- [ ] Tabla `activities` (inbox log)

### Edge Functions (Supabase)
- [ ] Handle POST /inbox
- [ ] Handle POST /shared-inbox
- [ ] Procesamiento de actividades
- [ ] Firma HTTP

### Federation Features
- [ ] Buscar usuarios remotos
- [ ] Seguir usuario remoto
- [ ] Recibir sigue de remoto
- [ ] Publicar posts (Create activity)
- [ ] Like remoto
- [ ] Comment remoto
- [ ] Actualización de perfil federado

### Discovery
- [ ] WebFinger lookup
- [ ] Actor fetch
- [ ] Collections pagination

### Testing Fase 5
- [ ] Buscar usuario remoto funciona
- [ ] Seguir usuario remoto funciona
- [ ] Actividades se envían correctamente
- [ ] Inbox procesa Follow
- [ ] Inbox procesa Like
- [ ] Posts federados aparecen en timeline

---

## FASE 6: Stories, DMs y Push

### Database Expand
- [ ] Tabla `stories` con RLS
- [ ] Tabla `story_views` con RLS
- [ ] Tabla `direct_messages` con RLS

### Story Service
- [ ] `src/services/stories.ts`
  - [ ] `createStory(media)`
  - [ ] `getStories(userId)`
  - [ ] `viewStory(storyId)`
  - [ ] `deleteExpiredStories()`
  - [ ] `getStoryViewers(storyId)`

### Story Components
- [ ] `src/components/stories/StoryRing.tsx`
- [ ] `src/components/stories/StoryViewer.tsx`
- [ ] `src/components/stories/StoriesBar.tsx`

### Story Screens
- [ ] `src/screens/stories/CreateStoryScreen.tsx`
- [ ] `src/screens/stories/ViewStoryScreen.tsx`
- [ ] `src/screens/stories/StoryViewersScreen.tsx`

### DM Service
- [ ] `src/services/messages.ts`
  - [ ] `sendMessage(recipientId, content, media?)`
  - [ ] `getConversations(userId)`
  - [ ] `getMessages(conversationId, pagination)`
  - [ ] `markAsRead(conversationId)`
  - [ ] `deleteMessage(messageId)`
  - [ ] Realtime subscriptions

### DM Components
- [ ] `src/components/messages/MessageItem.tsx`
- [ ] `src/components/messages/ConversationPreview.tsx`
- [ ] `src/components/messages/MessageInput.tsx`
- [ ] `src/components/messages/TypingIndicator.tsx`

### DM Screens
- [ ] `src/screens/messages/ConversationsScreen.tsx`
- [ ] `src/screens/messages/ChatScreen.tsx`

### Push Notifications (Opcional)
- [ ] Firebase Cloud Messaging setup
- [ ] Request permission from user
- [ ] Save device token to DB
- [ ] Edge Function para enviar push
- [ ] Handle deep linking desde push

### Testing Fase 6
- [ ] Upload story funciona
- [ ] Story expira 24h
- [ ] Ver story cuenta viewers
- [ ] Enviar DM funciona
- [ ] DM realtime entrega
- [ ] DM con foto funciona
- [ ] Push notification llega
- [ ] Push tap abre contenido correcto

---

## Testing General

### Unit Tests
- [ ] Auth Service tests
- [ ] Social Service tests
- [ ] Post Service tests
- [ ] Validation functions tests
- [ ] Utility functions tests
- [ ] Coverage > 70%

### Integration Tests
- [ ] Auth flow completo
- [ ] Create post flow
- [ ] Follow/Timeline flow
- [ ] Notification flow

### E2E Tests (Opcional)
- [ ] Signup → Login → Create Post → Timeline
- [ ] Follow user → See posts → Like
- [ ] Search user → View profile
- [ ] Admin actions

### Device Testing
- [ ] Android 8.0 (API 26)
- [ ] Android 11 (API 30)
- [ ] Android 14 (API 34)

### Performance Testing
- [ ] Cold start time
- [ ] Feed load time
- [ ] Media upload success rate
- [ ] Crash-free sessions
- [ ] Frame rate (fps)

### Security Testing
- [ ] RLS bypass attempts
- [ ] Token expiration
- [ ] Input validation
- [ ] Media file validation
- [ ] Rate limiting

---

## CI/CD

### GitHub Actions
- [ ] `.github/workflows/android-build.yml` - Build APK
- [ ] `.github/workflows/lint.yml` - Lint & Type check
- [ ] `.github/workflows/test.yml` - Run tests
- [ ] `.github/workflows/deploy.yml` - Deploy release
- [ ] Secrets configurados

### Pre-commit Hooks
- [ ] Husky instalado
- [ ] lint-staged configurado
- [ ] ESLint runs on commit
- [ ] Type check on commit

### Build Optimization
- [ ] ProGuard configurado
- [ ] Hermes engine enabled
- [ ] Gradle caching enabled
- [ ] Parallel builds enabled

---

## Documentation

- [x] ARCHITECTURE.md
- [x] DATABASE.md
- [x] DESIGN_SYSTEM.md
- [x] BUILD_GUIDE.md
- [x] DEVELOPMENT_PHASES.md
- [x] GITHUB_ACTIONS.md
- [x] SECURITY.md
- [x] MEDIA_UPLOAD_FLOW.md
- [ ] API_REFERENCE.md (opcional)
- [ ] TROUBLESHOOTING.md

---

## Release Preparation

### v0.1.0 (Alpha)
- [ ] Test Fase 0 completamente
- [ ] Documentation completa
- [ ] Security review
- [ ] Performance baseline

### v0.2.0 (Beta)
- [ ] Test Fase 1 + Fase 2
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] User feedback incorporation

### v0.3.0 (Feature Complete)
- [ ] Test Fase 3
- [ ] All features working
- [ ] Performance targets met
- [ ] Final polish

### v1.0.0 (Production)
- [ ] All phases complete
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Performance verified
- [ ] Launch ready

---

## Post-Launch

- [ ] Analytics integration
- [ ] Error tracking (Sentry)
- [ ] User feedback mechanism
- [ ] Regular security audits
- [ ] Backups schedule
- [ ] Monitoring & alerts
- [ ] Update strategy

---

**Status**: 🟡 En Desarrollo - Fase 0

**Última Actualización**: Febrero 2026

Usar este checklist para:
1. Trackear progreso
2. Evitar olvidar tareas
3. Asegurar calidad
4. Documentar decisiones

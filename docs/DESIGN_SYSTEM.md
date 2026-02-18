# Sistema de Diseño - Venered

## Filosofía de Diseño

Venered tiene una identidad visual inspirada en redes sociales modernas pero con personalidad propia:
- **Familiar pero único**: Layouts reconocibles con toques distintivos
- **Minimalista y limpio**: Enfoque en el contenido, no en decoración excesiva
- **Accesible**: Contraste adecuado, tamaños de toque generosos
- **Consistente**: Mismo lenguaje visual en toda la app

## Paleta de Colores

### Colores Primarios

```javascript
const colors = {
  // Brand Colors
  primary: '#6C5CE7',        // Púrpura vibrante (acento principal)
  primaryDark: '#5443C7',    // Púrpura oscuro (pressed state)
  primaryLight: '#A29BFE',   // Púrpura claro (backgrounds sutiles)
  
  // Secondary Colors
  secondary: '#00D2D3',      // Turquesa (acciones secundarias)
  secondaryDark: '#00A8A9',  
  secondaryLight: '#81E6E6', 
  
  // Neutrals (Light Theme)
  background: '#FFFFFF',     // Fondo principal
  surface: '#F8F9FA',        // Cards, inputs
  surfaceAlt: '#E9ECEF',     // Separadores sutiles
  
  // Text
  textPrimary: '#212529',    // Texto principal
  textSecondary: '#6C757D',  // Texto secundario
  textTertiary: '#ADB5BD',   // Placeholders, disabled
  
  // Semantic Colors
  success: '#00B894',        // Verde
  error: '#D63031',          // Rojo
  warning: '#FDCB6E',        // Amarillo
  info: '#74B9FF',           // Azul
  
  // Interactive
  link: '#6C5CE7',
  like: '#FD79A8',           // Rosa para likes (diferente de Instagram)
  bookmark: '#FDCB6E',       // Amarillo para bookmarks
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.3)',
  
  // Borders
  border: '#DEE2E6',
  borderDark: '#CED4DA',
};
```

### Dark Theme (Opcional - MVP2)

```javascript
const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceAlt: '#2D2D2D',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#707070',
  
  border: '#2D2D2D',
  borderDark: '#3D3D3D',
};
```

## Tipografía

### Familia de Fuentes

```javascript
const fonts = {
  // System fonts para mejor performance
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  
  // Weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### Escala Tipográfica

```javascript
const typography = {
  // Headers
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0,
  },
  
  // Body
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0,
  },
  
  // Special
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
};
```

## Espaciado

### Escala de Espaciado (8pt grid)

```javascript
const spacing = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  xxl: 48,  // 3rem
  xxxl: 64, // 4rem
};

// Shortcuts comunes
const padding = {
  container: spacing.md,     // 16px
  card: spacing.md,          // 16px
  section: spacing.lg,       // 24px
  screen: spacing.md,        // 16px horizontal
};
```

## Componentes UI

### Button

```javascript
// Variantes de botones
const buttonStyles = {
  // Primary Button (acciones principales)
  primary: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 44, // Accesibilidad táctil
  },
  
  // Secondary Button (acciones secundarias)
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    color: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 44,
  },
  
  // Text Button (acciones terciarias)
  text: {
    backgroundColor: 'transparent',
    color: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  
  // Destructive (acciones peligrosas)
  destructive: {
    backgroundColor: colors.error,
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
};

// Tamaños
const buttonSizes = {
  small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
  medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15 },
  large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 17 },
};
```

### Input

```javascript
const inputStyles = {
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
};
```

### Card

```javascript
const cardStyles = {
  // Card básico
  default: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Card flat (sin sombra)
  flat: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  
  // Card con borde
  outlined: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
```

### Avatar

```javascript
const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  xxl: 128,
};

const avatarStyles = {
  container: (size) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  }),
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  // Ring para stories (distintivo!)
  storyRing: {
    borderWidth: 3,
    borderColor: colors.secondary, // Turquesa en vez de gradiente
    padding: 3,
  },
};
```

## Componentes Específicos de Venered

### Post Card (Feed Item)

```javascript
const postCardStyles = {
  container: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatar: avatarSizes.md,
  userInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  username: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  timestamp: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  moreButton: {
    padding: spacing.xs,
  },
  
  // Media
  mediaContainer: {
    width: '100%',
    aspectRatio: 1, // Cuadrado como Instagram
    backgroundColor: colors.surfaceAlt,
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    padding: spacing.xs,
  },
  
  // Likes count
  likesCount: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  likesText: {
    ...typography.body,
    fontWeight: '600',
  },
  
  // Caption
  caption: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  captionUsername: {
    ...typography.body,
    fontWeight: '600',
  },
  captionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  
  // Comments preview
  commentsPreview: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  viewCommentsText: {
    ...typography.body,
    color: colors.textSecondary,
  },
};
```

### Profile Header

```javascript
const profileHeaderStyles = {
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  avatar: avatarSizes.xl,
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h3,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  
  // Bio section
  bioSection: {
    marginBottom: spacing.md,
  },
  displayName: {
    ...typography.bodyLarge,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  bio: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  website: {
    ...typography.body,
    color: colors.link,
  },
  
  // Action buttons
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
};
```

### Story Ring

```javascript
const storyStyles = {
  container: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarContainer: {
    width: avatarSizes.lg + 8,
    height: avatarSizes.lg + 8,
    borderRadius: (avatarSizes.lg + 8) / 2,
    borderWidth: 3,
    borderColor: colors.secondary, // Turquesa (diferente!)
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatarViewed: {
    borderColor: colors.borderDark, // Gris si ya se vio
  },
  avatar: avatarSizes.lg,
  username: {
    ...typography.caption,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    maxWidth: 72,
  },
};
```

### Bottom Tab Bar

```javascript
const tabBarStyles = {
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 56,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    size: 24,
  },
  activeColor: colors.primary,
  inactiveColor: colors.textTertiary,
};
```

### Modal

```javascript
const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end', // Bottom sheet style
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.borderDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  content: {
    // Variable según contenido
  },
};
```

## Iconografía

### Biblioteca de Iconos
Usar **react-native-vector-icons** con Ionicons (similar pero no idéntico a Instagram)

```javascript
const icons = {
  // Navigation
  home: 'home-outline',
  homeActive: 'home',
  search: 'search-outline',
  searchActive: 'search',
  create: 'add-circle-outline', // Distintivo!
  createActive: 'add-circle',
  notifications: 'notifications-outline',
  notificationsActive: 'notifications',
  profile: 'person-circle-outline',
  profileActive: 'person-circle',
  
  // Actions
  like: 'heart-outline',
  liked: 'heart', // Relleno
  comment: 'chatbubble-outline',
  share: 'paper-plane-outline',
  bookmark: 'bookmark-outline',
  bookmarked: 'bookmark',
  more: 'ellipsis-horizontal',
  
  // Social
  follow: 'person-add-outline',
  following: 'person-remove-outline',
  
  // Media
  camera: 'camera-outline',
  gallery: 'images-outline',
  video: 'videocam-outline',
  
  // General
  back: 'chevron-back',
  forward: 'chevron-forward',
  close: 'close',
  checkmark: 'checkmark',
  settings: 'settings-outline',
};
```

## Animaciones

### Micro-interacciones

```javascript
const animations = {
  // Like button (escala + color)
  likeButton: {
    scale: [1, 1.2, 1],
    duration: 300,
  },
  
  // Follow button
  followButton: {
    scale: [1, 0.95, 1],
    duration: 200,
  },
  
  // Tab switch (fade)
  tabSwitch: {
    fade: true,
    duration: 150,
  },
  
  // Modal slide up
  modalSlide: {
    type: 'slide',
    direction: 'up',
    duration: 250,
  },
};
```

## Layout Specs

### Screen Padding
- Horizontal: 16px
- Vertical: Safe area aware

### Feed
- Post width: 100% (full width)
- Media aspect ratio: 1:1 (square) por defecto
- Spacing entre posts: 16px

### Grid (Profile)
- Columns: 3
- Gap: 2px (minimal, moderno)
- Aspect ratio: 1:1

### Stories Bar
- Horizontal scroll
- Item spacing: 16px
- Padding: 16px horizontal

## Convenciones de Nombres

### Archivos de componentes
- `ComponentName.tsx` - Componente
- `ComponentName.styles.ts` - Estilos (si son complejos)
- `ComponentName.test.ts` - Tests

### Colores y tokens
- Usar constantes centralizadas en `src/theme/`
- Nunca hardcodear valores de color
- Preferir semantic tokens sobre color directo

## Accesibilidad

### Targets táctiles
- Mínimo: 44x44 dp
- Preferido: 48x48 dp

### Contraste
- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Elementos UI: mínimo 3:1

### Labels
- Todos los botones deben tener `accessibilityLabel`
- Imágenes decorativas: `accessibilityRole="none"`

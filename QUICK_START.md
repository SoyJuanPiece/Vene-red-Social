# Guía Rápida de Inicio - Venered

## 5 Minutos para Empezar

### 1. Clonar y Setup Inicial

```bash
# En /workspaces/Vene-red-Social (ya hecho)
cd Venered

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales (reemplazar valores):
# SUPABASE_URL=https://tu-proyecto.supabase.co
# SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

En [supabase.com](https://supabase.com):

1. Crear proyecto nuevo
2. Settings > API → Copiar URL y anon key
3. Pegar en `.env`
4. En SQL Editor: Copiar todo de `docs/DATABASE.md`
5. Ejecutar queries (crear tablas, RLS, triggers)

### 4. Build Inicial (Android)

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2 (en otra terminal)
npm run android
```

### 5. ✅ ¡Listo!

Si ves la app ejecutándose sin errores en el emulador/dispositivo, **el setup está completo**.

---

## Próximos Pasos

### Para Desarrollar

1. Crear rama: `git checkout -b feature/mi-feature`
2. Leer [ARCHITECTURE.md](docs/ARCHITECTURE.md) para entender el flujo
3. Seguir [DEVELOPMENT_PHASES.md](docs/DEVELOPMENT_PHASES.md) para saber qué implementar
4. Ver [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) para componentes UI

### Para Buildear Producción

Ver [BUILD_GUIDE.md](docs/BUILD_GUIDE.md):
- Setup keystore para firma
- Build release APK/AAB
- Optimize para production

### Para Seguridad

Ver [SECURITY.md](docs/SECURITY.md):
- RLS configurado ✅
- Almacenamiento de tokens ✅
- Validación de inputs ✅
- Rate limiting ✅

---

## Estructura Actual

```
Venered/
├── android/               ← Build Android (Gradle)
├── docs/                  ← 📚 Documentación completa
│   ├── ARCHITECTURE.md    ← Diseño y flujos
│   ├── DATABASE.md        ← Schema SQL + RLS
│   ├── DESIGN_SYSTEM.md   ← UI/UX componentes
│   ├── BUILD_GUIDE.md     ← Instrucciones build
│   ├── DEVELOPMENT_PHASES.md ← Fases de dev
│   ├── GITHUB_ACTIONS.md  ← CI/CD
│   ├── SECURITY.md        ← Seguridad
│   └── MEDIA_UPLOAD_FLOW.md ← Upload detallado
├── src/                   ← (A crear en Fase 0)
│   ├── screens/           ← Pantallas
│   ├── components/        ← Componentes reutilizables
│   ├── services/          ← Lógica de negocio
│   ├── theme/             ← Design system
│   └── ...
├── .env.example           ← Variables de entorno
├── IMPLEMENTATION_CHECKLIST.md ← Checklist exhaustivo
├── README.md              ← Este archivo
└── package.json           ← Dependencias
```

---

## Stack Tecnológico

| Parte | Tecnología |
|-------|-----------|
| **Mobile** | React Native 0.84.0 (CLI bare) |
| **Backend** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime |
| **Navigation** | React Navigation |
| **UI** | Custom components + react-native-vector-icons |
| **Language** | TypeScript |

---

## Documentación Disponible

### Esencial para Empezar

- 📐 **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Entender la app
- 🛠️ **[BUILD_GUIDE.md](docs/BUILD_GUIDE.md)** - Cómo compilar

### Para Desarrollar Fase 0

- 🎨 **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** - Colores, tipografía, componentes
- 📋 **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Qué hacer

### Para Datos y Seguridad

- 🗄️ **[DATABASE.md](docs/DATABASE.md)** - Schema SQL + RLS
- 🔒 **[SECURITY.md](docs/SECURITY.md)** - Best practices

### Para Subir Media

- 📸 **[MEDIA_UPLOAD_FLOW.md](docs/MEDIA_UPLOAD_FLOW.md)** - Paso a paso

### Para Deploy y CI/CD

- 🚀 **[GITHUB_ACTIONS.md](docs/GITHUB_ACTIONS.md)** - Automatización

---

## Comando Útiles Durante Desarrollo

```bash
# Iniciar
npm start              # Metro bundler (dejar abierto)
npm run android        # Compilar y ejecutar en Android

# Revisar código
npm run lint           # Errores de eslint
npm run type-check     # Errores de TypeScript

# Limpiar
npm run clean:android  # Limpiar build anterior
npm start -- --reset-cache  # Reset Metro cache

# Testing (cuando empieces a escribir tests)
npm test              # Ejecutar tests
npm run test:watch    # En watch mode
```

---

## Solución de Problemas Comunes

### "SDK location not found"
```bash
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### "Metro bundler connot find module"
```bash
npm start -- --reset-cache
```

### "Cannot find symbol: class R" (Android)
```bash
npm run clean:android
npm run android
```

### "Device not found" (adb)
```bash
adb kill-server
adb start-server
adb devices
```

---

## Roadmap Rápido

| Versión | Contenido | ETA |
|---------|----------|-----|
| **v0.1.0** | Auth + Proyectos + Basic Nav | Semana 1-2 |
| **v0.2.0** | Perfiles + Follows + Timeline | Semana 3-4 |
| **v0.3.0** | Posts + Media + Likes | Semana 5-6 |
| **v0.4.0** | Notificaciones + Búsqueda | Semana 7-8 |
| **v1.0.0** | MVP Completo | Semana 9-10 |

Ver [DEVELOPMENT_PHASES.md](docs/DEVELOPMENT_PHASES.md) para detalles.

---

## ¿Dónde Empezar a Codear?

### Si quieres hacer Fase 0 (Auth)

1. Leer: [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Sección "Capas"
2. Ver: [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - Colores, componentes base
3. Crear carpeta `src/` con estructura de carpetas (ver línea ~340 en [.env.example](.env.example))
4. Crear `src/theme/` con colores, tipografía
5. Crear componentes base: Button, Input, Text
6. Crear `src/screens/auth/` con LoginScreen, SignUpScreen
7. Conectar con Supabase Auth

### Si quieres hacer Fase 1 (Perfiles)

1. Primero completar Fase 0 ↑
2. Crear tabla `profiles`, `follows` en Supabase (DATABASE.md línea ~100)
3. Crear `src/services/social.ts`
4. Crear screens de perfil
5. Implementar follow/unfollow
6. Conectar con database

---

## Preguntas Frecuentes

**¿Por qué Android only en MVP?**
- Objetivo es iterar rápido. iOS se añade después en v1.1

**¿Necesito Android Studio?**
- No, usamos CLI + Gradle. Solo Android SDK command-line tools

**¿Cómo subir fotos/videos?**
- Ver [MEDIA_UPLOAD_FLOW.md](docs/MEDIA_UPLOAD_FLOW.md) - paso a paso completo

**¿Cómo configurar bases de datos?**
- Ver [DATABASE.md](docs/DATABASE.md) - copiar y pegar en Supabase SQL Editor

**¿Cómo asegurar que está seguro?**
- Ver [SECURITY.md](docs/SECURITY.md) - RLS, validación, tokens

---

## Recursos Externos

- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Android Developer Docs](https://developer.android.com/)

---

## Checklist antes de empezar

- [ ] Node.js 20+ instalado: `node --version`
- [ ] Java JDK 17: `java -version`
- [ ] Android SDK: `echo $ANDROID_HOME`
- [ ] Proyecto Supabase creado
- [ ] .env configurado con credenciales Supabase
- [ ] `npm install` completado sin errores
- [ ] `npm start` inicia sin errores
- [ ] APK se compila: `npm run android`

---

**¡Listo para codear!** 🚀

Próximos pasos: Leer [ARCHITECTURE.md](docs/ARCHITECTURE.md) y empezar Fase 0

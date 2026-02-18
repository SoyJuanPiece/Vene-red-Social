# Seguridad y Privacidad - Venered

## Autenticación y Sesiones

### Almacenamiento Seguro de Tokens

```typescript
// ❌ NUNCA hacer esto
localStorage.setItem('token', token);

// ✅ Usar AsyncStorage con encriptación
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

// Opción 1: AsyncStorage (básico)
await AsyncStorage.setItem('@auth_token', token);

// Opción 2: Keychain (más seguro, recomendado)
await Keychain.setGenericPassword('auth_token', token, {
  service: 'com.venered.auth',
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
});
```

### Rotación de Tokens

```typescript
// Implementar refresh token automático
const refreshSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) {
    // Token expirado, logout
    await logout();
  } else {
    // Guardar nuevo token
    await saveToken(data.session?.access_token);
  }
};

// Llamar cada 50 minutos (tokens expiran en 60min)
setInterval(refreshSession, 50 * 60 * 1000);
```

### Logout Seguro

```typescript
const logout = async () => {
  // 1. Llamar logout en Supabase
  await supabase.auth.signOut();
  
  // 2. Limpiar storage local
  await AsyncStorage.clear();
  await Keychain.resetGenericPassword({ service: 'com.venered.auth' });
  
  // 3. Limpiar estado global
  resetAuthContext();
  
  // 4. Navegar a login
  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
};
```

## Row Level Security (RLS)

### Principios

1. **Siempre habilitado**: Todas las tablas deben tener RLS enabled
2. **Default deny**: Sin políticas = sin acceso
3. **Mínimos privilegios**: Solo permisos necesarios
4. **Test exhaustivo**: Verificar políticas con diferentes usuarios

### Políticas Críticas

#### Proteger datos sensibles

```sql
-- Users solo pueden ver su propio email
CREATE POLICY "Users can view own email"
  ON auth.users FOR SELECT
  USING (auth.uid() = id);

-- Users solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Prevenir escalada de privilegios

```sql
-- Users NO pueden promocionarse a admin
CREATE POLICY "Users cannot self-promote to admin"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    CASE 
      WHEN (SELECT is_admin FROM profiles WHERE id = auth.uid()) THEN true
      ELSE (SELECT is_admin FROM profiles WHERE id = auth.uid()) = NEW.is_admin
    END
  );
```

#### Respetar bloqueos

```sql
-- Posts no visibles para usuarios bloqueados
CREATE POLICY "Blocked users cannot see posts"
  ON posts FOR SELECT
  USING (
    NOT EXISTS (
      SELECT 1 FROM blocks 
      WHERE blocker_id = posts.user_id 
      AND blocked_id = auth.uid()
    )
  );
```

## Validación de Inputs

### Cliente (React Native)

```typescript
// Validación de username
const validateUsername = (username: string): boolean => {
  const regex = /^[a-zA-Z0-9_]{3,30}$/;
  return regex.test(username);
};

// Validación de email
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Sanitizar caption (prevenir XSS si hay web view)
const sanitizeCaption = (caption: string): string => {
  return caption
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .slice(0, 2200); // Max length
};
```

### Servidor (Supabase Functions)

```typescript
// Edge Function con validación
Deno.serve(async (req) => {
  const { caption, visibility } = await req.json();
  
  // Validar inputs
  if (!caption || caption.length > 2200) {
    return new Response('Invalid caption', { status: 400 });
  }
  
  if (!['public', 'private', 'unlisted'].includes(visibility)) {
    return new Response('Invalid visibility', { status: 400 });
  }
  
  // Procesar...
});
```

## Media Upload Seguro

### Validación de Tipo de Archivo

```typescript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const validateMediaFile = (file: {
  type: string;
  size: number;
}): { valid: boolean; error?: string } => {
  // Validar tipo
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  
  if (!isImage && !isVideo) {
    return { valid: false, error: 'Tipo de archivo no permitido' };
  }
  
  // Validar tamaño
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Archivo muy grande (máx ${maxSize / 1024 / 1024}MB)` 
    };
  }
  
  return { valid: true };
};
```

### Storage Policies

```sql
-- Solo el owner puede subir a su carpeta
CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Solo el owner puede eliminar sus archivos
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Compresión y Sanitización

```typescript
import ImageResizer from 'react-native-image-resizer';

const compressImage = async (uri: string) => {
  const compressed = await ImageResizer.createResizedImage(
    uri,
    1080, // Max width
    1080, // Max height
    'JPEG',
    80, // Quality
    0, // Rotation
    undefined,
    false,
    { mode: 'contain' }
  );
  
  return compressed;
};
```

## Rate Limiting

### Supabase Edge Function

```typescript
// Rate limiting simple con Redis/Upstash
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_URL')!,
  token: Deno.env.get('UPSTASH_REDIS_TOKEN')!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
});

Deno.serve(async (req) => {
  const userId = req.headers.get('X-User-ID');
  
  const { success } = await ratelimit.limit(userId!);
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Procesar request...
});
```

### Cliente: Implementar Debounce

```typescript
import { debounce } from 'lodash';

// Buscar con debounce para evitar spam
const searchUsers = debounce(async (query: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10);
  
  return data;
}, 300); // 300ms delay
```

## Prevención de Spam

### Contenido Duplicado

```typescript
// Hash de contenido para detectar duplicados
import crypto from 'crypto';

const hashContent = (caption: string, mediaUrls: string[]): string => {
  const content = caption + mediaUrls.join('');
  return crypto.createHash('sha256').update(content).digest('hex');
};

// Verificar antes de crear post
const checkDuplicate = async (hash: string, userId: string) => {
  const { data } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId)
    .eq('content_hash', hash)
    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
  
  return data && data.length > 0;
};
```

### Captcha para Acciones Sensibles

```typescript
// Implementar reCAPTCHA en signup (opcional)
// react-native-google-recaptcha

const verifyRecaptcha = async (token: string) => {
  const response = await fetch('https://your-edge-function.supabase.co/verify-recaptcha', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  
  const { success } = await response.json();
  return success;
};
```

## Protección de API Keys

### Variables de Entorno

```bash
# .env (NUNCA commitear a git)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# .env.example (sí commitear)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

### react-native-config

```typescript
import Config from 'react-native-config';

const supabaseUrl = Config.SUPABASE_URL;
const supabaseKey = Config.SUPABASE_ANON_KEY;

// Verificar que existen
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}
```

### Ofuscar en Release

```gradle
// android/app/build.gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

## Logging Seguro

### NO Loguear

```typescript
// ❌ NUNCA
console.log('Token:', authToken);
console.log('User data:', user);

// ✅ Sí
console.log('User authenticated:', !!authToken);
if (__DEV__) {
  console.log('[DEV] User ID:', user.id);
}
```

### Implementar Logger Seguro

```typescript
class SecureLogger {
  static log(message: string, data?: any) {
    if (__DEV__) {
      console.log(`[${new Date().toISOString()}]`, message, data);
    }
  }
  
  static error(message: string, error?: Error) {
    // En producción, enviar a servicio de error tracking
    console.error(`[${new Date().toISOString()}]`, message, error?.message);
  }
  
  static sensitive(message: string) {
    // NUNCA loguear en producción
    if (__DEV__) {
      console.log(`[SENSITIVE]`, message);
    }
  }
}
```

## HTTPS y Certificados

### Configurar Network Security

`android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- Solo para development con localhost -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Referenciar en `AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

## Permisos de Android

### Mínimos Necesarios

`android/app/src/main/AndroidManifest.xml`

```xml
<manifest>
    <!-- Necesarios -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    
    <!-- Android 12 y menores -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="29" />
    
    <!-- Opcional para notificaciones -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
</manifest>
```

### Runtime Permissions

```typescript
import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Permiso de cámara',
      message: 'Venered necesita acceso a tu cámara para tomar fotos',
      buttonPositive: 'Permitir',
      buttonNegative: 'Denegar',
    }
  );
  
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
```

## Backups y Recuperación

### Backup Automático de Supabase

Configurar en Supabase Dashboard:
- Settings > Database > Point-in-time recovery (PITR)
- Retention: 7 días (mínimo)

### Backup Manual

```bash
# Backup de la base de datos
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Backup de Storage

```typescript
// Script para backup de media
const backupStorage = async () => {
  const { data } = await supabase.storage.from('posts').list();
  
  for (const file of data) {
    const { data: blob } = await supabase.storage
      .from('posts')
      .download(file.name);
    
    // Guardar localmente o en otro storage
    await saveToBackup(blob, file.name);
  }
};
```

## Monitoreo de Seguridad

### Alertas de Intentos de Login Fallidos

```sql
-- Tabla de logs de seguridad
CREATE TABLE security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger en auth failures
CREATE OR REPLACE FUNCTION log_auth_failure()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_logs (event_type, metadata)
  VALUES ('auth_failure', jsonb_build_object('email', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Dashboard de Admin

- Ver intentos de login fallidos
- Ver reportes pendientes
- Ver usuarios con actividad sospechosa (muchos posts en poco tiempo)

## Checklist de Seguridad Pre-Release

### Autenticación
- [ ] Tokens almacenados de forma segura (Keychain)
- [ ] Refresh token implementado
- [ ] Logout limpia toda la sesión
- [ ] Timeout de sesión configurado

### Base de Datos
- [ ] RLS habilitado en todas las tablas
- [ ] Políticas testeadas con diferentes roles
- [ ] No hay queries que expongan datos sensibles
- [ ] Triggers funcionan correctamente

### Media
- [ ] Validación de tipo de archivo
- [ ] Validación de tamaño de archivo
- [ ] Compresión implementada
- [ ] Storage policies configuradas

### API
- [ ] Rate limiting en endpoints críticos
- [ ] Validación de inputs en cliente y servidor
- [ ] Errores no exponen información sensible
- [ ] CORS configurado correctamente

### App
- [ ] Variables de entorno no commiteadas
- [ ] API keys ofuscadas en release
- [ ] Logging seguro implementado
- [ ] Permisos mínimos en AndroidManifest

### Network
- [ ] HTTPS enforced
- [ ] Certificate pinning (opcional)
- [ ] Network Security Config configurado

### Backups
- [ ] Backups automáticos habilitados
- [ ] Restore procedure testeado
- [ ] Storage backup configurado

### Compliance
- [ ] Política de privacidad creada
- [ ] Términos de servicio creados
- [ ] GDPR compliance (si aplica)
- [ ] Manejo de datos de menores (COPPA si aplica)

## Recursos

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth)
- [React Native Security Guide](https://reactnative.dev/docs/security)

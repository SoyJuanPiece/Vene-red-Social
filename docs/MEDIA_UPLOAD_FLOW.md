# Flujo de Upload de Media - Venered

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                  USUARIO SUBE MEDIA                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: Selección de Media                                 │
├─────────────────────────────────────────────────────────────┤
│  • Abrir galería o cámara                                   │
│  • Usuario selecciona foto(s)/video(s)                      │
│  • react-native-image-picker retorna URI local              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 2: Validación Cliente                                 │
├─────────────────────────────────────────────────────────────┤
│  ✓ Verificar tipo de archivo (JPEG, PNG, MP4)              │
│  ✓ Verificar tamaño (< 10MB fotos, < 100MB videos)         │
│  ✓ Verificar cantidad (máx 10 por post)                    │
│  ✗ Si falla → Mostrar error y detener                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 3: Procesamiento Local                                │
├─────────────────────────────────────────────────────────────┤
│  Fotos:                                                      │
│  • Comprimir (max 1080x1080, quality 80%)                   │
│  • Generar thumbnail (300x300)                              │
│  • Calcular dimensiones                                     │
│                                                              │
│  Videos:                                                     │
│  • Extraer primer frame como thumbnail                      │
│  • Obtener duración                                         │
│  • Comprimir si excede límite (opcional)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 4: UI de Creación de Post                             │
├─────────────────────────────────────────────────────────────┤
│  • Mostrar preview de media                                 │
│  • Input para caption                                       │
│  • Selector de visibilidad (public/private/unlisted)       │
│  • Tag de ubicación (opcional)                              │
│  • Content warning toggle                                   │
│  • Usuario presiona "Publicar"                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 5: Upload a Supabase Storage                          │
├─────────────────────────────────────────────────────────────┤
│  Para cada archivo:                                         │
│  1. Generar nombre único (UUID + timestamp)                 │
│  2. Construir path: {userId}/{postId}/{fileName}            │
│  3. Upload con progress tracking                            │
│  4. Obtener URL pública                                     │
│  5. Upload thumbnail si es video                            │
│                                                              │
│  Progress bar visible: 0% → 100%                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 6: Crear Post en Database                             │
├─────────────────────────────────────────────────────────────┤
│  Transaction:                                               │
│  1. INSERT INTO posts (caption, visibility, user_id, ...)  │
│  2. Obtener post_id                                         │
│  3. INSERT INTO media (post_id, url, type, ...) x N         │
│  4. Extraer y guardar hashtags en post_hashtags             │
│  5. Commit transaction                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 7: Broadcast Realtime (opcional)                      │
├─────────────────────────────────────────────────────────────┤
│  • Supabase Realtime notifica a seguidores                  │
│  • Nuevo post aparece en feeds sin refresh                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  PASO 8: Navegación y Feedback                              │
├─────────────────────────────────────────────────────────────┤
│  • Ocultar modal de creación                                │
│  • Navegar a timeline o perfil                              │
│  • Mostrar toast "Post publicado ✓"                         │
│  • Post aparece inmediatamente en lista                     │
└─────────────────────────────────────────────────────────────┘
```

## Implementación Paso a Paso

### PASO 1: Selección de Media

```typescript
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const pickImages = async () => {
  const result = await launchImageLibrary({
    mediaType: 'mixed', // 'photo', 'video', or 'mixed'
    selectionLimit: 10, // Máximo 10 archivos
    quality: 1,
  });
  
  if (result.didCancel) {
    return;
  }
  
  if (result.errorCode) {
    console.error('Error picking images:', result.errorMessage);
    return;
  }
  
  return result.assets; // Array of selected files
};

const takePhoto = async () => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true,
  });
  
  if (!result.didCancel && !result.errorCode) {
    return result.assets;
  }
};
```

### PASO 2: Validación

```typescript
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILES = 10;

const validateMedia = (
  assets: Asset[]
): { valid: boolean; error?: string } => {
  if (assets.length > MAX_FILES) {
    return { 
      valid: false, 
      error: `Máximo ${MAX_FILES} archivos permitidos` 
    };
  }
  
  for (const asset of assets) {
    const isImage = ALLOWED_IMAGE_TYPES.includes(asset.type || '');
    const isVideo = ALLOWED_VIDEO_TYPES.includes(asset.type || '');
    
    if (!isImage && !isVideo) {
      return { 
        valid: false, 
        error: `Tipo ${asset.type} no permitido` 
      };
    }
    
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if ((asset.fileSize || 0) > maxSize) {
      return { 
        valid: false, 
        error: `Archivo muy grande (máx ${maxSize / 1024 / 1024}MB)` 
      };
    }
  }
  
  return { valid: true };
};
```

### PASO 3: Procesamiento Local

```typescript
import ImageResizer from 'react-native-image-resizer';
import { createThumbnail } from 'react-native-create-thumbnail';

const processImage = async (uri: string) => {
  // Comprimir imagen
  const compressed = await ImageResizer.createResizedImage(
    uri,
    1080, // Max width
    1080, // Max height
    'JPEG',
    80, // Quality
    0, // Rotation
    undefined,
    false,
    { mode: 'contain', onlyScaleDown: true }
  );
  
  // Generar thumbnail
  const thumbnail = await ImageResizer.createResizedImage(
    uri,
    300,
    300,
    'JPEG',
    70,
    0,
    undefined,
    false,
    { mode: 'cover' }
  );
  
  return {
    uri: compressed.uri,
    width: compressed.width,
    height: compressed.height,
    size: compressed.size,
    thumbnailUri: thumbnail.uri,
  };
};

const processVideo = async (uri: string) => {
  // Generar thumbnail del primer frame
  const thumbnail = await createThumbnail({
    url: uri,
    timeStamp: 0, // Primer frame
  });
  
  return {
    uri,
    thumbnailUri: thumbnail.path,
  };
};
```

### PASO 4: UI de Creación

```typescript
const CreatePostScreen = () => {
  const [media, setMedia] = useState<ProcessedMedia[]>([]);
  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isUploading, setIsUploading] = useState(false);
  
  const handleSelectMedia = async () => {
    const assets = await pickImages();
    
    if (!assets) return;
    
    const { valid, error } = validateMedia(assets);
    if (!valid) {
      Alert.alert('Error', error);
      return;
    }
    
    // Procesar cada archivo
    const processed = await Promise.all(
      assets.map(async (asset) => {
        if (asset.type?.startsWith('image')) {
          return await processImage(asset.uri!);
        } else {
          return await processVideo(asset.uri!);
        }
      })
    );
    
    setMedia(processed);
  };
  
  const handlePost = async () => {
    setIsUploading(true);
    
    try {
      await createPost({
        media,
        caption,
        visibility,
      });
      
      navigation.goBack();
      showToast('Post publicado ✓');
    } catch (error) {
      Alert.alert('Error', 'No se pudo publicar el post');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <View>
      {/* Media preview */}
      <MediaCarousel items={media} />
      
      {/* Caption input */}
      <TextInput
        placeholder="Escribe un caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
        maxLength={2200}
      />
      
      {/* Visibility selector */}
      <VisibilityPicker 
        value={visibility} 
        onChange={setVisibility} 
      />
      
      {/* Actions */}
      <Button 
        title={isUploading ? 'Publicando...' : 'Publicar'}
        onPress={handlePost}
        disabled={isUploading || media.length === 0}
      />
      
      {/* Progress indicator */}
      {isUploading && <UploadProgress />}
    </View>
  );
};
```

### PASO 5: Upload a Storage

```typescript
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

const uploadMedia = async (
  mediaFile: ProcessedMedia,
  userId: string,
  postId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; thumbnailUrl?: string }> => {
  // Generar nombre único
  const fileExt = mediaFile.uri.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${postId}/${fileName}`;
  
  // Leer archivo
  const fileData = await fetch(mediaFile.uri).then(r => r.blob());
  
  // Upload archivo principal
  const { data, error } = await supabase.storage
    .from('posts')
    .upload(filePath, fileData, {
      contentType: mediaFile.type,
      upsert: false,
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from('posts')
    .getPublicUrl(filePath);
  
  let thumbnailUrl: string | undefined;
  
  // Upload thumbnail si existe
  if (mediaFile.thumbnailUri) {
    const thumbFileName = `${uuidv4()}_thumb.jpg`;
    const thumbPath = `${userId}/${postId}/${thumbFileName}`;
    const thumbData = await fetch(mediaFile.thumbnailUri).then(r => r.blob());
    
    await supabase.storage
      .from('posts')
      .upload(thumbPath, thumbData, { contentType: 'image/jpeg' });
    
    const { data: thumbUrlData } = supabase.storage
      .from('posts')
      .getPublicUrl(thumbPath);
    
    thumbnailUrl = thumbUrlData.publicUrl;
  }
  
  return {
    url: urlData.publicUrl,
    thumbnailUrl,
  };
};
```

### PASO 6: Crear Post en Database

```typescript
const createPost = async ({
  media,
  caption,
  visibility,
}: {
  media: ProcessedMedia[];
  caption: string;
  visibility: 'public' | 'private' | 'unlisted';
}) => {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Generar ID del post
  const postId = uuidv4();
  
  // 1. Upload todas las media
  const uploadedMedia = await Promise.all(
    media.map((item, index) => 
      uploadMedia(item, userId, postId, (progress) => {
        // Update progress UI
        updateUploadProgress(index, progress);
      })
    )
  );
  
  // 2. Crear post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert({
      id: postId,
      user_id: userId,
      caption,
      visibility,
      has_media: true,
      media_count: media.length,
    })
    .select()
    .single();
  
  if (postError) {
    // Rollback: eliminar media subidas
    await cleanupUploadedMedia(uploadedMedia);
    throw postError;
  }
  
  // 3. Crear registros de media
  const mediaRecords = uploadedMedia.map((item, index) => ({
    post_id: postId,
    media_type: media[index].type?.startsWith('image') ? 'photo' : 'video',
    url: item.url,
    thumbnail_url: item.thumbnailUrl,
    width: media[index].width,
    height: media[index].height,
    duration: media[index].duration,
    sort_order: index,
  }));
  
  const { error: mediaError } = await supabase
    .from('media')
    .insert(mediaRecords);
  
  if (mediaError) {
    // Rollback
    await supabase.from('posts').delete().eq('id', postId);
    await cleanupUploadedMedia(uploadedMedia);
    throw mediaError;
  }
  
  // 4. Procesar hashtags
  const hashtags = extractHashtags(caption);
  if (hashtags.length > 0) {
    await saveHashtags(postId, hashtags);
  }
  
  return post;
};

const extractHashtags = (text: string): string[] => {
  const regex = /#(\w+)/g;
  const matches = text.match(regex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
};

const saveHashtags = async (postId: string, hashtags: string[]) => {
  // Insertar hashtags (upsert)
  for (const tag of hashtags) {
    const { data: hashtag } = await supabase
      .from('hashtags')
      .upsert({ name: tag.toLowerCase() }, { onConflict: 'name' })
      .select()
      .single();
    
    if (hashtag) {
      // Crear relación con post
      await supabase
        .from('post_hashtags')
        .insert({ post_id: postId, hashtag_id: hashtag.id });
      
      // Incrementar contador
      await supabase
        .from('hashtags')
        .update({ usage_count: hashtag.usage_count + 1 })
        .eq('id', hashtag.id);
    }
  }
};
```

### PASO 7 & 8: Realtime y Feedback

```typescript
// Componente de timeline suscrito a nuevos posts
const TimelineScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Suscribirse a nuevos posts
    const subscription = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `visibility=eq.public`,
        },
        (payload) => {
          // Añadir nuevo post al inicio
          setPosts(prev => [payload.new as Post, ...prev]);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return <PostList posts={posts} />;
};
```

## Manejo de Errores

```typescript
const handleUploadError = async (error: Error, uploadedMedia: string[]) => {
  console.error('Upload error:', error);
  
  // Limpiar archivos subidos
  for (const url of uploadedMedia) {
    const path = extractPathFromUrl(url);
    await supabase.storage.from('posts').remove([path]);
  }
  
  // Mostrar error al usuario
  Alert.alert(
    'Error al publicar',
    'No se pudo subir tu post. Intenta de nuevo.',
    [
      { text: 'Reintentar', onPress: () => retryUpload() },
      { text: 'Cancelar', style: 'cancel' },
    ]
  );
};
```

## Optimizaciones

### Upload en Background (Android)

```typescript
import BackgroundUpload from 'react-native-background-upload';

const uploadInBackground = async (filePath: string, uploadUrl: string) => {
  const options = {
    url: uploadUrl,
    path: filePath,
    method: 'POST',
    type: 'multipart',
    notification: {
      enabled: true,
      notificationChannel: 'venered-uploads',
      notificationTitle: 'Subiendo post...',
    },
  };
  
  const uploadId = await BackgroundUpload.startUpload(options);
  
  return uploadId;
};
```

### Retry Logic

```typescript
const uploadWithRetry = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};
```

## Testing del Flujo

```typescript
// Test checklist
describe('Media Upload Flow', () => {
  it('should validate media type', () => {
    const result = validateMedia([{ type: 'image/gif', size: 1000 }]);
    expect(result.valid).toBe(false);
  });
  
  it('should validate media size', () => {
    const result = validateMedia([{ 
      type: 'image/jpeg', 
      size: 20 * 1024 * 1024 
    }]);
    expect(result.valid).toBe(false);
  });
  
  it('should compress large images', async () => {
    const result = await processImage('large-image.jpg');
    expect(result.width).toBeLessThanOrEqual(1080);
    expect(result.height).toBeLessThanOrEqual(1080);
  });
  
  it('should create post with media', async () => {
    const post = await createPost({
      media: [mockMedia],
      caption: 'Test post',
      visibility: 'public',
    });
    
    expect(post.id).toBeDefined();
    expect(post.has_media).toBe(true);
  });
});
```

## Monitoreo

```typescript
// Analytics events
const trackUploadEvent = (event: string, data?: object) => {
  analytics().logEvent(event, {
    timestamp: Date.now(),
    ...data,
  });
};

// Eventos a trackear:
// - upload_started
// - upload_progress
// - upload_completed
// - upload_failed
// - post_created
```

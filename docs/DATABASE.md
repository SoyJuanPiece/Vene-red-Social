# Esquema de Base de Datos - Venered

## Tablas Principales

### 1. profiles
Extensión del auth.users de Supabase con información del perfil.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  is_private BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
```

### 2. posts
Posts principales con texto, visibilidad y metadata.

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  caption TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  has_media BOOLEAN DEFAULT false,
  media_count INTEGER DEFAULT 0,
  location TEXT,
  is_nsfw BOOLEAN DEFAULT false,
  content_warning TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON posts(visibility);
```

### 3. media
Archivos adjuntos a posts (fotos/videos).

```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- para videos, en segundos
  file_size BIGINT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_post_id ON media(post_id);
CREATE INDEX idx_media_sort_order ON media(post_id, sort_order);
```

### 4. likes
Likes en posts.

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);
```

### 5. comments
Comentarios en posts.

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- para replies
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) > 0 AND char_length(content) <= 2000)
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 6. follows
Relaciones de seguimiento entre usuarios.

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_status ON follows(status);
```

### 7. blocks
Usuarios bloqueados.

```sql
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

CREATE INDEX idx_blocks_blocker_id ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked_id ON blocks(blocked_id);
```

### 8. mutes
Usuarios silenciados.

```sql
CREATE TABLE mutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  muter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  muted_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(muter_id, muted_id),
  CHECK (muter_id != muted_id)
);

CREATE INDEX idx_mutes_muter_id ON mutes(muter_id);
CREATE INDEX idx_mutes_muted_id ON mutes(muted_id);
```

### 9. notifications
Sistema de notificaciones.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'mention', 'reply')),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(recipient_id, is_read);
```

### 10. stories
Historias con expiración de 24h.

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 5, -- segundos de visualización
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
```

### 11. story_views
Visualizaciones de stories.

```sql
CREATE TABLE story_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(story_id, viewer_id)
);

CREATE INDEX idx_story_views_story_id ON story_views(story_id);
CREATE INDEX idx_story_views_viewer_id ON story_views(viewer_id);
```

### 12. hashtags
Hashtags extraídos de posts.

```sql
CREATE TABLE hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  trending_score FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_format CHECK (name ~ '^[a-zA-Z0-9_]+$')
);

CREATE INDEX idx_hashtags_name ON hashtags(name);
CREATE INDEX idx_hashtags_trending ON hashtags(trending_score DESC);
```

### 13. post_hashtags
Relación many-to-many entre posts y hashtags.

```sql
CREATE TABLE post_hashtags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  hashtag_id UUID REFERENCES hashtags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags(hashtag_id);
```

### 14. bookmarks
Posts guardados por usuarios.

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id, created_at DESC);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
```

### 15. direct_messages
Mensajes directos entre usuarios.

```sql
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) > 0 AND char_length(content) <= 5000)
);

CREATE INDEX idx_dms_sender_id ON direct_messages(sender_id);
CREATE INDEX idx_dms_recipient_id ON direct_messages(recipient_id);
CREATE INDEX idx_dms_created_at ON direct_messages(created_at DESC);
CREATE INDEX idx_dms_conversation ON direct_messages(sender_id, recipient_id, created_at DESC);
```

### 16. reports
Sistema de reportes y moderación.

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'hate_speech', 'violence', 'nudity', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

## Row Level Security (RLS) Policies

### profiles

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### posts

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public posts are viewable by everyone
CREATE POLICY "Public posts are viewable" 
  ON posts FOR SELECT 
  USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR (visibility = 'unlisted')
  );

-- Users can create their own posts
CREATE POLICY "Users can create own posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts" 
  ON posts FOR DELETE 
  USING (auth.uid() = user_id);
```

### media

```sql
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Media is viewable if the post is viewable
CREATE POLICY "Media viewable with post" 
  ON media FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = media.post_id 
      AND (posts.visibility = 'public' OR posts.user_id = auth.uid())
    )
  );

-- Users can insert media for their own posts
CREATE POLICY "Users can insert media for own posts" 
  ON media FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = post_id AND posts.user_id = auth.uid()
    )
  );
```

### likes

```sql
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Likes are viewable by everyone on public posts
CREATE POLICY "Likes viewable on public posts" 
  ON likes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = likes.post_id 
      AND (posts.visibility = 'public' OR posts.user_id = auth.uid())
    )
  );

-- Users can like posts
CREATE POLICY "Users can create likes" 
  ON likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can unlike (delete their likes)
CREATE POLICY "Users can delete own likes" 
  ON likes FOR DELETE 
  USING (auth.uid() = user_id);
```

### comments

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments viewable on accessible posts
CREATE POLICY "Comments viewable on public posts" 
  ON comments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND (posts.visibility = 'public' OR posts.user_id = auth.uid())
    )
  );

-- Users can create comments
CREATE POLICY "Users can create comments" 
  ON comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);
```

### follows

```sql
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Follows are viewable by involved users
CREATE POLICY "Follows viewable by users" 
  ON follows FOR SELECT 
  USING (true);

-- Users can follow others
CREATE POLICY "Users can create follows" 
  ON follows FOR INSERT 
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can delete own follows" 
  ON follows FOR DELETE 
  USING (auth.uid() = follower_id);
```

### notifications

```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" 
  ON notifications FOR SELECT 
  USING (auth.uid() = recipient_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
  ON notifications FOR UPDATE 
  USING (auth.uid() = recipient_id);
```

### blocks & mutes

```sql
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutes ENABLE ROW LEVEL SECURITY;

-- Users can view their own blocks/mutes
CREATE POLICY "Users can view own blocks" 
  ON blocks FOR SELECT 
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks" 
  ON blocks FOR INSERT 
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete blocks" 
  ON blocks FOR DELETE 
  USING (auth.uid() = blocker_id);

-- Same for mutes
CREATE POLICY "Users can view own mutes" 
  ON mutes FOR SELECT 
  USING (auth.uid() = muter_id);

CREATE POLICY "Users can create mutes" 
  ON mutes FOR INSERT 
  WITH CHECK (auth.uid() = muter_id);

CREATE POLICY "Users can delete mutes" 
  ON mutes FOR DELETE 
  USING (auth.uid() = muter_id);
```

## Database Functions

### Trigger para actualizar updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger para incrementar likes_count

```sql
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_created AFTER INSERT ON likes
  FOR EACH ROW EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER on_like_deleted AFTER DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION decrement_likes_count();
```

### Trigger para comments_count

```sql
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_created AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION increment_comments_count();

CREATE TRIGGER on_comment_deleted AFTER DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION decrement_comments_count();
```

### Function para obtener timeline del usuario

```sql
CREATE OR REPLACE FUNCTION get_user_timeline(user_uuid UUID, page_limit INT, page_offset INT)
RETURNS TABLE (
  post_id UUID,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  caption TEXT,
  likes_count INT,
  comments_count INT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    pr.username,
    pr.avatar_url,
    p.caption,
    p.likes_count,
    p.comments_count,
    p.created_at
  FROM posts p
  INNER JOIN profiles pr ON p.user_id = pr.id
  WHERE p.user_id IN (
    SELECT following_id FROM follows 
    WHERE follower_id = user_uuid AND status = 'accepted'
  )
  AND p.visibility = 'public'
  AND NOT EXISTS (
    SELECT 1 FROM blocks WHERE blocker_id = user_uuid AND blocked_id = p.user_id
  )
  AND NOT EXISTS (
    SELECT 1 FROM mutes WHERE muter_id = user_uuid AND muted_id = p.user_id
  )
  ORDER BY p.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Storage Buckets

### avatars
```sql
-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Policy para upload de avatares
CREATE POLICY "Users can upload their own avatar" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy para leer avatares
CREATE POLICY "Avatars are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');
```

### posts
```sql
-- Bucket para media de posts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('posts', 'posts', true);

-- Policy para upload
CREATE POLICY "Users can upload post media" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'posts' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy para leer
CREATE POLICY "Post media is publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'posts');
```

### stories
```sql
-- Bucket para stories
INSERT INTO storage.buckets (id, name, public) 
VALUES ('stories', 'stories', true);

CREATE POLICY "Users can upload stories" 
  ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'stories' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Stories are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'stories');
```

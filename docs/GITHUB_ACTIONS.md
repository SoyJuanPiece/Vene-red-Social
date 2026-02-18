# GitHub Actions Workflow - Venered

## Workflow para Build Android

Archivo: `.github/workflows/android-build.yml`

```yaml
name: Android Build

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    name: Build Android APK/AAB
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Java JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Cache Gradle
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-
      
      - name: Make gradlew executable
        run: chmod +x android/gradlew
      
      - name: Build Debug APK
        run: |
          cd android
          ./gradlew assembleDebug --no-daemon --stacktrace
      
      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
  
  build-release:
    name: Build Release APK/AAB
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Java JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Decode Keystore
        env:
          KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
        run: |
          echo $KEYSTORE_BASE64 | base64 -d > android/app/venered-release.keystore
      
      - name: Create gradle.properties
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: |
          echo "VENERED_UPLOAD_STORE_FILE=venered-release.keystore" > android/gradle.properties
          echo "VENERED_UPLOAD_KEY_ALIAS=$KEY_ALIAS" >> android/gradle.properties
          echo "VENERED_UPLOAD_STORE_PASSWORD=$KEYSTORE_PASSWORD" >> android/gradle.properties
          echo "VENERED_UPLOAD_KEY_PASSWORD=$KEY_PASSWORD" >> android/gradle.properties
      
      - name: Build Release APK
        run: |
          cd android
          ./gradlew assembleRelease --no-daemon --stacktrace
      
      - name: Build Release AAB
        run: |
          cd android
          ./gradlew bundleRelease --no-daemon --stacktrace
      
      - name: Upload Release APK
        uses: actions/upload-artifact@v4
        with:
          name: app-release-apk
          path: android/app/build/outputs/apk/release/app-release.apk
          retention-days: 30
      
      - name: Upload Release AAB
        uses: actions/upload-artifact@v4
        with:
          name: app-release-aab
          path: android/app/build/outputs/bundle/release/app-release.aab
          retention-days: 30
      
      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/v')
        uses: softprops/action-gh-release@v1
        with:
          files: |
            android/app/build/outputs/apk/release/app-release.apk
            android/app/build/outputs/bundle/release/app-release.aab
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
```

## Configuración de Secrets en GitHub

Ir a: `Repository Settings > Secrets and variables > Actions`

Añadir los siguientes secrets:

### 1. KEYSTORE_BASE64

```bash
# Convertir keystore a base64
base64 -w 0 android/app/venered-release.keystore > keystore.txt

# Copiar el contenido de keystore.txt y pegarlo como secret
cat keystore.txt
```

### 2. KEYSTORE_PASSWORD
La contraseña del keystore que usaste en `keytool`

### 3. KEY_ALIAS
El alias que usaste (ejemplo: `venered-key`)

### 4. KEY_PASSWORD
La contraseña de la key (puede ser igual a KEYSTORE_PASSWORD)

## Workflow para Auto-versioning

Archivo: `.github/workflows/version-bump.yml`

```yaml
name: Version Bump

on:
  workflow_dispatch:
    inputs:
      version_type:
        description: 'Version bump type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

jobs:
  bump-version:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Bump version
        id: bump
        run: |
          npm version ${{ github.event.inputs.version_type }} --no-git-tag-version
          NEW_VERSION=$(node -p "require('./package.json').version")
          echo "new_version=$NEW_VERSION" >> $GITHUB_OUTPUT
      
      - name: Update Android versionName and versionCode
        run: |
          VERSION="${{ steps.bump.outputs.new_version }}"
          VERSION_CODE=$(date +%s)
          
          # Update build.gradle
          sed -i "s/versionName \".*\"/versionName \"$VERSION\"/" android/app/build.gradle
          sed -i "s/versionCode [0-9]*/versionCode $VERSION_CODE/" android/app/build.gradle
      
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add package.json package-lock.json android/app/build.gradle
          git commit -m "chore: bump version to ${{ steps.bump.outputs.new_version }}"
          git tag "v${{ steps.bump.outputs.new_version }}"
          git push origin main --tags
```

## Workflow para Deployment a Google Play (Opcional)

Archivo: `.github/workflows/deploy-play-store.yml`

```yaml
name: Deploy to Google Play

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Decode Keystore
        env:
          KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
        run: |
          echo $KEYSTORE_BASE64 | base64 -d > android/app/venered-release.keystore
      
      - name: Create gradle.properties
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
        run: |
          echo "VENERED_UPLOAD_STORE_FILE=venered-release.keystore" > android/gradle.properties
          echo "VENERED_UPLOAD_KEY_ALIAS=$KEY_ALIAS" >> android/gradle.properties
          echo "VENERED_UPLOAD_STORE_PASSWORD=$KEYSTORE_PASSWORD" >> android/gradle.properties
          echo "VENERED_UPLOAD_KEY_PASSWORD=$KEY_PASSWORD" >> android/gradle.properties
      
      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Deploy to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_STORE_SERVICE_ACCOUNT }}
          packageName: com.venered
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: internal # o 'alpha', 'beta', 'production'
          status: completed
```

## Configuración de Play Store Service Account

1. Ir a Google Play Console
2. Setup > API access
3. Crear service account
4. Descargar JSON key
5. Copiar contenido completo del JSON y guardarlo como secret `PLAY_STORE_SERVICE_ACCOUNT`

## Scripts en package.json

Añadir estos scripts útiles:

```json
{
  "scripts": {
    "android": "react-native run-android",
    "start": "react-native start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build:android:debug": "cd android && ./gradlew assembleDebug",
    "build:android:release": "cd android && ./gradlew assembleRelease",
    "build:android:bundle": "cd android && ./gradlew bundleRelease",
    "clean:android": "cd android && ./gradlew clean",
    "postinstall": "patch-package"
  }
}
```

## Optimizaciones de CI

### Cache de dependencias

El workflow ya incluye caching de:
- npm packages
- Gradle cache
- Java packages

### Paralelización

Los jobs `build`, `lint` y `test` corren en paralelo para mayor velocidad.

### Artifacts

Los APK/AAB se guardan como artifacts de GitHub:
- Debug APKs: 14 días
- Release APKs/AABs: 30 días

### Triggers

- **Push a main/develop**: Build debug
- **PR a main**: Lint + Test
- **Tag v***: Build + Release
- **Manual**: Version bump

## Monitoreo de Builds

### Status Badge

Añadir al README.md:

```markdown
![Android Build](https://github.com/TU_USUARIO/Vene-red-Social/workflows/Android%20Build/badge.svg)
```

### Notificaciones

GitHub enviará notificaciones automáticas de:
- Build failures
- Successful releases

## Troubleshooting CI

### Build falla por falta de memoria

```yaml
# Añadir en el step de build
- name: Build with more memory
  run: |
    cd android
    ./gradlew assembleRelease --no-daemon --max-workers=2
  env:
    GRADLE_OPTS: -Xmx2048m
```

### Timeout en builds lentos

```yaml
# Aumentar timeout
- name: Build Release APK
  timeout-minutes: 30
  run: |
    cd android
    ./gradlew assembleRelease
```

### Problemas con cache

```yaml
# Limpiar cache si hay problemas
- name: Clear Gradle cache
  run: rm -rf ~/.gradle/caches/
```

## Checklist Pre-CI

- [ ] Keystore generado y convertido a base64
- [ ] Secrets configurados en GitHub
- [ ] build.gradle configurado para signing
- [ ] Scripts en package.json funcionan localmente
- [ ] .gitignore incluye archivos sensibles
- [ ] README con instrucciones de setup

## Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Android Build Action](https://github.com/marketplace/actions/android-build)
- [Upload to Play Store Action](https://github.com/r0adkll/upload-google-play)

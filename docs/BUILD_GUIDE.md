# Guía de Build - Venered (Linux)

## Requisitos del Sistema

### Software Necesario
- **OS**: Ubuntu 20.04+ (o cualquier distribución Linux moderna)
- **Node.js**: v18+ (recomendado: v20 LTS)
- **npm**: v9+ o yarn v1.22+
- **Java**: JDK 17 (OpenJDK o Azul Zulu)
- **Android SDK**: Command Line Tools latest
- **Gradle**: Se instalará automáticamente con el proyecto

### Memoria y Disco
- RAM: Mínimo 8GB (recomendado 16GB)
- Espacio en disco: ~10GB libres

## Instalación Paso a Paso

### 1. Instalar Node.js

```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Verificar instalación
node --version  # Debe ser v20.x.x
npm --version   # Debe ser v10.x.x
```

### 2. Instalar Java JDK 17

```bash
# OpenJDK 17
sudo apt update
sudo apt install -y openjdk-17-jdk

# Verificar instalación
java -version  # Debe mostrar version 17.x.x

# Configurar JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verificar
echo $JAVA_HOME
```

### 3. Instalar Android SDK Command Line Tools

```bash
# Crear directorio para Android SDK
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk

# Descargar Command Line Tools
# Obtener URL más reciente desde: https://developer.android.com/studio#command-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# Extraer
unzip commandlinetools-linux-*_latest.zip
rm commandlinetools-linux-*_latest.zip

# Crear estructura correcta
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# Configurar variables de entorno
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/platform-tools:$PATH' >> ~/.bashrc
echo 'export PATH=$ANDROID_HOME/emulator:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verificar
echo $ANDROID_HOME
```

### 4. Instalar Paquetes del SDK con sdkmanager

```bash
# Aceptar licencias
yes | sdkmanager --licenses

# Instalar paquetes necesarios
sdkmanager "platform-tools"
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
sdkmanager "ndk;25.1.8937393"
sdkmanager "cmake;3.22.1"

# Verificar instalación
sdkmanager --list_installed
```

### 5. Clonar e Instalar Dependencias del Proyecto

```bash
# Clonar repositorio (o crear proyecto nuevo)
cd /workspaces
git clone <url-del-repo> Vene-red-Social
cd Vene-red-Social/Venered

# Instalar dependencias
npm install

# Si hay problemas de permisos
npm install --unsafe-perm
```

### 6. Configurar Supabase

```bash
# Crear archivo .env en la raíz del proyecto
cat > .env << EOF
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
EOF

# IMPORTANTE: Añadir .env al .gitignore
echo ".env" >> .gitignore
```

## Build de Desarrollo

### Iniciar Metro Bundler

```bash
# En una terminal
npm start

# O con limpieza de cache
npm start -- --reset-cache
```

### Build Debug APK

```bash
# Método 1: Usar react-native CLI
npx react-native run-android

# Método 2: Usar Gradle directamente
cd android
./gradlew assembleDebug

# El APK estará en:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalar en Dispositivo/Emulador

```bash
# Con dispositivo conectado por USB (habilitar USB debugging)
adb devices  # Verificar que aparece el dispositivo

# Instalar APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Ver logs en tiempo real
adb logcat | grep ReactNative
```

## Build de Producción

### 1. Generar Keystore para Firma

```bash
cd android/app

# Generar keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore venered-release.keystore \
  -alias venered-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Guardar la contraseña de forma segura!
# IMPORTANTE: NO commitear el keystore al repositorio
```

### 2. Configurar Gradle para Firma

```bash
# Crear archivo gradle.properties (si no existe)
cat > android/gradle.properties << EOF
VENERED_UPLOAD_STORE_FILE=venered-release.keystore
VENERED_UPLOAD_KEY_ALIAS=venered-key
VENERED_UPLOAD_STORE_PASSWORD=tu-password-aqui
VENERED_UPLOAD_KEY_PASSWORD=tu-password-aqui
EOF

# Añadir al .gitignore
echo "android/gradle.properties" >> .gitignore
```

Editar `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('VENERED_UPLOAD_STORE_FILE')) {
                storeFile file(VENERED_UPLOAD_STORE_FILE)
                storePassword VENERED_UPLOAD_STORE_PASSWORD
                keyAlias VENERED_UPLOAD_KEY_ALIAS
                keyPassword VENERED_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. Build Release APK

```bash
cd android

# Limpiar builds anteriores
./gradlew clean

# Build APK release
./gradlew assembleRelease

# El APK firmado estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

### 4. Build Android App Bundle (AAB) para Google Play

```bash
cd android

# Build AAB
./gradlew bundleRelease

# El AAB estará en:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Optimizaciones de Build

### Habilitar Hermes

En `android/app/build.gradle`:

```gradle
project.ext.react = [
    enableHermes: true,  // Habilitar Hermes JS engine
]
```

### Configurar ProGuard

Crear/editar `android/app/proguard-rules.pro`:

```proguard
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Supabase
-keep class io.supabase.** { *; }

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable

# Prevent obfuscation of native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
```

### Configurar Gradle para Performance

En `android/gradle.properties`:

```properties
# Aumentar memoria para Gradle
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m

# Habilitar daemon
org.gradle.daemon=true

# Build paralelo
org.gradle.parallel=true

# Cache de configuración
org.gradle.configureondemand=true

# AndroidX
android.useAndroidX=true
android.enableJetifier=true
```

## Troubleshooting

### Error: "SDK location not found"

```bash
# Crear local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### Error: "Execution failed for task ':app:mergeDebugResources'"

```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
```

### Error: "Could not resolve all dependencies"

```bash
# Limpiar cache de Gradle
cd android
./gradlew clean
rm -rf ~/.gradle/caches/
./gradlew build --refresh-dependencies
```

### Error de memoria "Out of memory"

```bash
# Aumentar memoria de Gradle en android/gradle.properties
org.gradle.jvmargs=-Xmx8192m -XX:MaxMetaspaceSize=1024m
```

### Build muy lento

```bash
# Habilitar cache de Gradle
mkdir -p ~/.gradle
echo "org.gradle.caching=true" >> ~/.gradle/gradle.properties

# Usar watchman (monitoreo de archivos)
sudo apt install watchman
```

### Problemas con USB Debugging

```bash
# Reiniciar ADB server
adb kill-server
adb start-server
adb devices

# Si no se detecta el dispositivo, verificar udev rules
sudo usermod -aG plugdev $LOGNAME
```

## Build en Entornos CI/CD

Ver [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) para configuración de GitHub Actions.

## Checklist Pre-Release

- [ ] Versión actualizada en `android/app/build.gradle` (versionCode y versionName)
- [ ] Iconos de la app configurados (mipmap en android/app/src/main/res/)
- [ ] Nombre de la app configurado en `android/app/src/main/res/values/strings.xml`
- [ ] Variables de entorno de producción configuradas
- [ ] Keystore de firma generado y configurado
- [ ] ProGuard configurado correctamente
- [ ] APK/AAB testeado en release mode
- [ ] Permisos en AndroidManifest.xml revisados
- [ ] Supabase en modo producción (no development)

## Comandos Útiles

```bash
# Ver tamaño del APK
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Analizar contenido del APK
unzip -l android/app/build/outputs/apk/release/app-release.apk

# Ver dependencias de Gradle
cd android && ./gradlew app:dependencies

# Limpiar todo (node_modules + builds)
rm -rf node_modules android/app/build ios/build
npm install
```

## Recursos Adicionales

- [React Native Docs](https://reactnative.dev/docs/environment-setup)
- [Android Developer Docs](https://developer.android.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Gradle User Guide](https://docs.gradle.org/current/userguide/userguide.html)

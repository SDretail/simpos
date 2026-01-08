#!/bin/bash
set -e

echo "🚀 Starting Build in Docker..."

# 1. Build Frontend
echo "📦 Building Frontend..."
npm run build

# 2. Copy Assets for Native Shell
echo "📂 Copying assets to Android project..."
mkdir -p src-tauri/gen/android/app/src/main/assets
cp -r dist/* src-tauri/gen/android/app/src/main/assets/

# 3. Build Android APK
echo "🤖 Building Android APK..."
cd src-tauri/gen/android
chmod +x gradlew
./gradlew assembleDebug

echo "✅ Build Complete!"
echo "APK Location: src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk"

#!/bin/bash
set -e

echo "🚀 Starting Android Build & Deploy..."

# 1. Build Frontend
echo "📦 Building Frontend..."
npm run build

# 2. Run Gradle Build directly (Bypassing tauri cli to avoid assembleUniversalDebug error)
# 2. Run Gradle Build directly (Bypassing tauri cli to avoid assembleUniversalDebug error)
echo "🧹 Cleaning previous build..."
./scripts/android-env.sh ./src-tauri/gen/android/gradlew clean \
    --project-dir ./src-tauri/gen/android

# 1.5 Sync Assets (Manual copy since we bypassed tauri cli)
echo "🔄 Syncing contents from dist to Android assets..."
ASSETS_DIR="src-tauri/gen/android/app/src/main/assets"
rm -rf "$ASSETS_DIR"/*
cp -r dist/* "$ASSETS_DIR/"

echo "🔧 Running Gradle assembly..."
./scripts/android-env.sh ./src-tauri/gen/android/gradlew assembleDebug \
    --project-dir ./src-tauri/gen/android

# 2. Define the exact path to the debug APK (based on previous findings)
APK_PATH="src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk"

# 3. Verify APK exists
if [ ! -f "$APK_PATH" ]; then
    echo "❌ Error: APK not found at $APK_PATH"
    echo "Build might have failed or output path changed."
    exit 1
fi

echo "✅ Build successful! Found APK at: $APK_PATH"

# 3.5 Save APK to build/android folder
OUTPUT_DIR="build/android"
mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
DEST_PATH="$OUTPUT_DIR/simpos-debug-$TIMESTAMP.apk"

echo "📂 Copying APK to $DEST_PATH..."
cp "$APK_PATH" "$DEST_PATH"
# Also copy as 'latest.apk' for easy access
cp "$APK_PATH" "$OUTPUT_DIR/latest.apk"

# 4. Check for connected devices
if ! adb get-state 1>/dev/null 2>&1; then
    echo "❌ Error: No Android device connected via ADB."
    echo "Please connect your Sunmi T2 and try again."
    exit 1
fi

# 5. Install the APK
echo "📲 Installing on device..."
adb install -r "$APK_PATH"

echo "🎉 Deployment Complete!"

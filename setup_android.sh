#!/bin/bash
set -e

ANDROID_HOME="$HOME/android-sdk"
mkdir -p "$ANDROID_HOME/cmdline-tools"

# URL for Command Line Tools (version 13.0 - 11076708)
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"

echo "Downloading Android Command Line Tools..."
wget -q --show-progress "$CMDLINE_TOOLS_URL" -O cmdline-tools.zip

echo "Extracting..."
unzip -q cmdline-tools.zip
# The zip extracts to a 'cmdline-tools' folder. We need to move its content to 'latest'
mv cmdline-tools latest
mv latest "$ANDROID_HOME/cmdline-tools/"
rm cmdline-tools.zip

# Set temporary environment variables for installation
export ANDROID_HOME="$ANDROID_HOME"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null

echo "Installing Platform Tools, SDK 34, Build Tools 34.0.0, and NDK..."
# Installing:
# - platform-tools
# - platforms;android-34 (Android 14)
# - build-tools;34.0.0
# - ndk;26.1.10909125 (LTS version commonly recommended)
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;26.1.10909125"

echo ""
echo "======================================================="
echo "Installation complete!"
echo ""
echo "Please add the following lines to your ~/.bashrc or ~/.profile:"
echo ""
echo "export ANDROID_HOME=\$HOME/android-sdk"
echo "export NDK_HOME=\$ANDROID_HOME/ndk/26.1.10909125"
echo "export PATH=\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools:\$PATH"
echo ""
echo "After adding them, run: source ~/.bashrc"
echo "======================================================="

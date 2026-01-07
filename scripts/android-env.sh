#!/bin/bash

# Define paths explicitly to ensure they are found regardless of shell state
export ANDROID_HOME="$HOME/android-sdk"
export NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
export CARGO_HOME="$HOME/.cargo"

# Construct PATH to include Rust and Android tools
export PATH="$CARGO_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

# Log environment for debugging
echo "🔧 Configuring Android Environment..."
echo "  ANDROID_HOME: $ANDROID_HOME"
echo "  NDK_HOME:     $NDK_HOME"
echo "  CARGO:        $(which cargo)"

# Check if cargo exists
if ! command -v cargo &> /dev/null; then
    echo "❌ Error: 'cargo' not found in PATH. Please install Rust."
    exit 1
fi

# Execute the passed command (e.g., "tauri android build")
exec "$@"

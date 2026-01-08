FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    build-essential \
    openjdk-17-jdk \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Set Environment Variables
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV ANDROID_HOME="/opt/android-sdk"
ENV PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
ENV NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"

# Install Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O android_tools.zip \
    && unzip -q android_tools.zip -d ${ANDROID_HOME}/cmdline-tools \
    && mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest \
    && rm android_tools.zip

# Accept Licenses and Install SDK Components
RUN yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;26.1.10909125"

# Install Node.js (Latest LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Rust (Standard method)
ENV RUSTUP_HOME=/opt/rust
ENV CARGO_HOME=/opt/rust
ENV PATH=$PATH:/opt/rust/bin
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path
# Install Tauri CLI using cargo (optional, but good for tool consistency)
# RUN cargo install tauri-cli

WORKDIR /app

# Copy dependency files first for caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build Script (Can be overridden)
CMD ["./scripts/docker-build-entrypoint.sh"]

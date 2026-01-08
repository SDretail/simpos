# Fix Android 7.1 Crash (BootstrapMethodError)

## Goal

Fix the `java.lang.ClassNotFoundException: Didn't find class "java.lang.BootstrapMethodError"` crash on Sunmi T2 (Android 7.1).

## Status

- **ALL ATTEMPTS FAILED.**
- The system is failing to desugar `invokedynamic` instructions in `TauriActivity`.

## Final Analysis

The issue is likely that `tauri-android` (the AAR) was compiled with Java 11/17 compatibility upstream, and re-compiling it locally isn't fully overriding the bytecode or my patches aren't being picked up because Gradle is using a cached AAR instead of the source, despite the `project()` inclusion in `tauri.settings.gradle`.
Wait, `tauri.settings.gradle` uses `project(':tauri-android').projectDir = ...`, so it SHOULD be building from source.

## Nuclear Option: Remove the offending code

If we can't fix the compiler/desugarer, we must change the code.
The crash happens at `PluginManager(this)`.
This line likely uses a lambda or method reference if it passes `this` in a way that triggers `invokedynamic`.

## Plan

1.  **Modify `TauriActivity.kt`** in `~/.cargo/registry/.../tauri-2.9.5/mobile/android/src/main/java/app/tauri/TauriActivity.kt`.
2.  Inspect the code around line 14.
3.  If it's just `var pluginManager: PluginManager = PluginManager(this)`, that shouldn't cause `BootstrapMethodError` unless `PluginManager`'s constructor causes it.
4.  **Inspect `PluginManager.kt`**.

## Action

1.  View `TauriActivity.kt` source.
2.  View `PluginManager.kt` source.
3.  Rewrite any lambdas to anonymous inner classes manually.

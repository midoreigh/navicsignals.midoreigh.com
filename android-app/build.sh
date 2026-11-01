#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
BT="$SDK/build-tools/34.0.0"
JAR="$SDK/platforms/android-34/android.jar"
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

rm -rf build && mkdir -p build/res build/classes build/dex build/src

echo "==> 1. Compiling resources with aapt2..."
"$BT/aapt2" compile --dir res -o build/res.zip

echo "==> 2. Linking resources and generating R.java..."
"$BT/aapt2" link -o build/unsigned.apk -I "$JAR" --manifest AndroidManifest.xml \
    --min-sdk-version 26 --target-sdk-version 34 --version-code 9 --version-name 0.9 \
    --java build/src \
    build/res.zip

echo "==> 3. Compiling Java sources..."
javac -source 8 -target 8 -Xlint:-options -cp "$JAR:build/src" -d build/classes $(find src build/src -name '*.java')

echo "==> 4. Converting to DEX bytecode with d8..."
"$BT/d8" --min-api 26 --lib "$JAR" --output build/dex $(find build/classes -name '*.class')

echo "==> 5. Packaging classes.dex into APK..."
(cd build/dex && zip -q ../unsigned.apk classes.dex)

echo "==> 6. Aligning APK with zipalign..."
"$BT/zipalign" -f -p 4 build/unsigned.apk build/aligned.apk

echo "==> 7. Signing APK with apksigner..."
KS="$HOME/.android/debug.keystore"
if [ ! -f "$KS" ]; then
    mkdir -p "$HOME/.android"
    keytool -genkeypair -keystore "$KS" -storepass android -keypass android -alias androiddebugkey \
        -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
fi
"$BT/apksigner" sign --ks "$KS" --ks-pass pass:android --out NavICSkyView.apk build/aligned.apk

# The APK is published to GitHub Releases, not hosted locally on the website.
echo "==> SUCCESS: Built $(pwd)/NavICSkyView.apk"

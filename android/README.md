# Trickologue for Android

The same tracker as the Scriptable script, as an Android app: all four levels and the 30 variations, your own tricks and levels, the coach's reminders and the EN / LT switch. It is one screen showing the page built from `app/` and `data/`, so the iPhone and Android versions cannot drift apart.

- **No permissions and no network.** The page and the brand fonts are bundled.
- **Progress** is kept in the app's own `progress.json` (ticks, language, the tricks and levels you added). Android's backup carries it to a new phone.
- **Links** to booking and the book open in the browser.
- Android 8.0 or later.

## Get the APK

Every push to `main` builds a debug APK: open the repository's **Actions** tab, pick the latest **Android APK** run and download the `Trickologue-debug-apk` artifact. Copy the `.apk` to the phone and open it; Android asks once to allow installing from that source.

That APK is built from the public sources, so trick descriptions point to the book.

## Build it yourself

You need Node 22, a JDK 17 or later and the Android SDK (platform 35, build-tools 35).

```sh
node tools/build.mjs            # writes android/app/src/main/assets/index.html
cd android
./gradlew assembleDebug         # app/build/outputs/apk/debug/app-debug.apk
```

`node tools/build.mjs --full` embeds the book's descriptions and coach's cues, if `data/descriptions.private.json` is on your machine (see `tools/extract-descriptions.py`). Never commit an APK built that way.

## Release build

A debug APK is fine for testing and for handing to a few people. For Google Play or wider sharing, sign a release build with a key you keep:

```sh
keytool -genkeypair -v -keystore trickologue.jks -alias trickologue -keyalg RSA -keysize 4096 -validity 10000
export TRICKOLOGUE_KEYSTORE=$PWD/trickologue.jks TRICKOLOGUE_KEYSTORE_PASSWORD=... TRICKOLOGUE_KEY_ALIAS=trickologue TRICKOLOGUE_KEY_PASSWORD=...
./gradlew assembleRelease       # or bundleRelease for the Play Store's .aab
```

Keep the keystore and its passwords out of the repository and backed up: every later update must be signed with the same key. Before each release raise `versionCode` and `versionName` in `app/build.gradle`.

## Not there yet

- Home-screen widgets (the Scriptable script has them).
- Moving progress between the iPhone and Android versions.
- It has been built and its page tested in Chrome with a stand-in for the app bridge, but not yet run on a phone.

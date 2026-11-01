plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.isro.navicskyview"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.isro.navicskyview"
        minSdk = 26
        targetSdk = 34
        // The Android app is versioned on its own; releases are tagged android-v<versionName>.
        versionCode = 9
        versionName = "0.9"
    }

    sourceSets {
        getByName("main") {
            manifest.srcFile("../AndroidManifest.xml")
            java.directories.add("../src")
            res.directories.add("../res")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

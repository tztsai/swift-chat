// Dummy C++ file for React Native New Architecture
// This file ensures proper C++ standard library linking and headers availability

#include <jni.h>
#include <android/log.h>

#ifdef __cplusplus
extern "C" {
#endif

// Dummy function to ensure C++ standard library symbols are available
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void* reserved) {
    (void)vm;      // Silence unused parameter warning
    (void)reserved; // Silence unused parameter warning
    __android_log_print(ANDROID_LOG_INFO, "ReactNativeNewArch", "AppModules JNI_OnLoad called");
    return JNI_VERSION_1_6;
}

#ifdef __cplusplus
}
#endif 
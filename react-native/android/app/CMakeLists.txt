cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE ON)

# Set the project name and languages
project(appmodules CXX)

# Require C++20 for new architecture compatibility  
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Configure for New Architecture if enabled
if(REACT_NATIVE_NEW_ARCH_ENABLED)
    message(STATUS "Configuring for React Native New Architecture")
    
    # Set standard library to shared
    set(CMAKE_ANDROID_STL_TYPE c++_shared)
    
    # Add compile definitions
    add_compile_definitions(
        REACT_NATIVE_NEW_ARCH_ENABLED=1
        ANDROID_STL=c++_shared
    )
    
    # Compiler flags for C++20 and exception handling
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20 -fexceptions -frtti")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -fPIC")
    
    # Linker flags
    set(CMAKE_SHARED_LINKER_FLAGS "${CMAKE_SHARED_LINKER_FLAGS} -Wl,--as-needed")
    
    # Find required libraries
    find_library(log-lib log)
    find_library(android-lib android)
    
    # Create a dummy appmodules target to satisfy the build system
    add_library(appmodules SHARED
        ${CMAKE_SOURCE_DIR}/src/main/jni/appmodules_dummy.cpp
    )
    
    # Link against system libraries
    target_link_libraries(appmodules
        ${log-lib}
        ${android-lib}
    )
    
    # Ensure the C++ standard library is available
    target_link_libraries(appmodules -static-libgcc)
    
else()
    message(STATUS "Configuring for React Native Legacy Architecture")
endif() 
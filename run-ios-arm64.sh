#!/bin/bash

# Script to run React Native iOS with correct ARM64 architecture
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Force ARM64 architecture
exec /usr/bin/arch -arm64 /bin/bash -c "
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Change to project directory
cd /Users/mac/Desktop/RayyanMFB

# Run the React Native CLI
yarn react-native run-ios --mode=retailDebug ENVFILE=.env.retail
"

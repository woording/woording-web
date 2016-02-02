#!/bin/sh

# Delete the old build
rm -rf build.zip
rm -rf build/

# Create a new build
npm run build

# Create new build dir
mkdir build
mkdir build/dist/

# Copy files to new build dir 
cp index.html build/index.html
cp dist/build.js build/dist/build.js

cp -R img build/img 
cp -R css build/css

cp favicons/* build/

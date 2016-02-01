#!/bin/sh

# Delete the old build
rm -rf build.zip
rm -rf build/

# Create a new build
npm run build

mkdir build
mkdir build/dist/

# Copy files 
cp index.html build/index.html
cp dist/build.js build/dist/build.js
cp -R img build/img 
cp -R css build/css
cp favicons/* build/
cp run-server.sh build/run-server.sh

ls -laG

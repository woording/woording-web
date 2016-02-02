#!/bin/bash
cd `dirname $0`

# remove the previous version
rm -rf woording-web-old

# keep the current version in case something goes wrong
mv woording-web woording-web-old

# extract the new package
tar -xzf package.tgz

# remove the .tgz file as it is now no longer needed
rm package.tgz

# the package _should_ contian a folder called build, rename it to woording-web
mv build woording-web


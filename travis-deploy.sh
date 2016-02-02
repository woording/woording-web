#!/bin/bash
cd /home/cor/server/woording

#This file is located at /home/cor/server/woording/ on the woording.com server
rm -rf woording-web
rm -rf build

tar -xzf package.tgz
rm package.tgz

screen -r web -X quit

rm -rf woording-web
mv build woording-web

chmod 777 woording-web
cd /home/cor/server/woording/woording-web

screen -d -f -S web -m "/home/cor/server/woording/woording-web/run-server.sh"

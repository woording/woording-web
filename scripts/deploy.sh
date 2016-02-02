#!/bin/sh

starttime=`date +%s`

./create-build.sh

scp build.zip cor@woording.com:/home/cor/server/build.zip

ssh cor@woording.com -t 'cd /home/cor/server/;
sudo mv /home/cor/server/build.zip /home/cor/server/woording/build.zip;
sudo rm -rf /home/cor/server/woording/build;
cd /home/cor/server/woording/; 
sudo unzip build.zip; 
cd /home/cor/server/woording/build/;

screen -r web -X quit;

screen -S web -m "/home/cor/server/woording/build/run-server.sh";'


endtime=`date +%s`

runtime=$((endtime - starttime))

echo "Site deployed, runtime: $runtime seconds"

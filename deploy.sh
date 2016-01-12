#!/bin/sh

starttime=`date +%s`

cd ..
rm -rf woordbeta/
rm -rf woordbeta.zip
cp -r -v woording-web/ woordbeta

cd woordbeta
rm -rf node_modules/
npm install
npm run build

cd ..
zip -r woordbeta.zip woordbeta
scp woordbeta.zip cor@woording.com:/home/cor/server/woording-beta/woordbeta.zip

ssh cor@woording.com -t 'cd /home/cor/server/woording-beta;
sudo rm -rf /home/cor/server/woording-beta/woordbeta;
sudo rm -rf /home/cor/server/woording-beta/woording-web-old;
sudo rm -rf /home/cor/server/woording-beta/woording-web;

screen -S beta -X quit;

echo unzipping woordbeta.zip...;
sudo unzip woordbeta.zip;

sudo mv woordbeta woording-web;

cd woording-web;
screen -S beta -m "/home/cor/server/woording-beta/woording-web/run-server.sh";'

endtime=`date +%s`

runtime=$((endtime - starttime))

echo "Site deployed, runtime: $runtime seconds"

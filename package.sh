mkdir comvie
mkdir comvie/js comvie/css comvie/img comvie/_locales

cp popup.html manifest.json background.html ./comvie
cp -r js/* ./comvie/js
cp -r css/* ./comvie/css
cp -r img/icon-16.png img/icon-48.png img/icon-128.png ./comvie/img
cp -r _locales/* ./comvie/_locales

zip -q -r ./comvie.zip  ./comvie/

rm -rf ./comvie/
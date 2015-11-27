#!/bin/bash

echo "CLEANING BUILD DIR"
rm -rf build

echo "GENERATING SOURCE CODE"
pyqtdeploycli --project osxdeploy.pdy --output build build

echo "COMPILING convert2fnt"
cp convert2fnt.icns ./build/
cp convert2fnt.plist ./build/
cd build
PRO=convert2fnt.pro
# echo "INCLUDEPATH += /usr/local/guroot-static/lib/libffi-3.1/include" >> $PRO
# echo "LIBS += /usr/local/guroot-static/lib/libffi.a" >> $PRO
echo "ICON = convert2fnt.icns" >> $PRO
# echo "QMAKE_LFLAGS += -Wl,-no_compact_unwind" >> $PRO
echo "QMAKE_INFO_PLIST = convert2fnt.plist" >> $PRO
qmake && make
cd ..

echo "DEPLOYING APPLICATION"
macdeployqt build/convert2fnt.app

echo "FINISHED"

pyinstaller ../1.images2fnt/images2fnt.py -F --distpath . -p %PYTHONHOME%\Lib\site-packages\pil;..\utility;

rd /s/q "build"

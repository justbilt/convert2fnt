# -*- mode: python -*-
a = Analysis(['../1.images2fnt/images2fnt.py'],
             pathex=['D:\\360yunpan\\Tools\\Python27\\Lib\\site-packages\\pil', '..\\utility', '', 'c:\\work\\git\\fnt_convert\\build'],
             hiddenimports=[],
             hookspath=None,
             runtime_hooks=None)
pyz = PYZ(a.pure)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='images2fnt.exe',
          debug=False,
          strip=None,
          upx=True,
          console=True )

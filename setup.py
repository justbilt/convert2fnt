from distutils.core import setup
import convert2fnt.c2f as c2f

setup(
    name = 'convert2fnt',
    packages = ['convert2fnt'],
    version = c2f.VERSION,
    description = 'convert images/plist to .fnt file',
    author='justbilt',
    author_email = "wangbilt@gmail.com",
    url = "https://github.com/justbilt/convert2fnt",
    download_url = "https://github.com/justbilt/convert2fnt",
    keywords = ["images2fnt", "plist2fnt", "convert2fnt", "utilities"],
    install_requires=["Pillow>=2.4.0"],
    classifiers = [
        "Development Status :: 4 - Beta",
        "Environment :: Console",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: GNU Library or Lesser General Public License (LGPL)",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 2.7",
        "Topic :: Utilities",
        ],
)
# -*- coding: utf-8 -*-
import sys
import os

VERSION = "0.1.0"


def help():
    print """
convert2fnt - %s

usage:
    c2f <input> [ouput]

input:
    <xxx.plist>     convert a plist file to fnt file.
    <images>        support wildcard character(xxx_*.png), this image must have similar name,
                    convert this image to a sprite sheet, and create a fnt file .
    # <folder>        try find all file that could be convert and then convert them.

ouput:
    <ouput-path/ouput-name> output file to 'ouput-path' and named 'ouput-name', default is 'output/<input-name>.fnt'

samples:
    1. c2f sample_*.png
    2. c2f sample.plist out/sample.fnt


""" %(VERSION)


def plist2fnt(params):
    import images2fnt
    images2fnt.convert(params)

def images2fnt(params):
    print "images2fnt..."

def main():
    if len(sys.argv) < 2:
        help()
        return 0

    params = dict()
    params["root"] = os.getcwd()
    params["input"] = sys.argv[1]

    try:
        output = sys.argv[2]
        index = output.rfind("/")
        if index != -1:
            params["output-path"] = output[0:index]
            params["output-name"] = output[index+1:]
        else:
            params["output-path"] = ""
            params["output-name"] = output
    except IndexError, e:
        params["output-path"] = "output"
        params["output-name"] = ""

    if params["input"].find(".plist") != -1:
        plist2fnt(params)
    elif params["input"].find(".png") != -1 or sys.argv[2].find(".jpg") != -1:
        images2fnt(params)
    # else:
    #     fodler_path = cd + "/" +sys.argv[2]
    #     if os.path.ispath(fodler_path):
    #         folder2fnt()
    #     else:
    #         print "invalide argv :", sys.argv[2]
    #         return 0




if __name__ == '__main__':
    main()
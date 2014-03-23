#!C:/Python27
# Filename: utility.py
import os
from PIL import Image


"""
-define
----size		#face size
----lineHeight	#line height
----base		#???
----scaleW		#scale width
----scaleH		#scale height
----file 		#texture file name
----count 		#char count
----data 		#item data
--------data[0]
------------id
------------x
------------y
------------width
------------height
------------xoffset
------------yoffset
------------xadvance
------------page
------------chnl
------------letter
------------id
"""

def create_fnt_file(fnt_name,fnt_define):
	write_file=open(fnt_name,"w")

	head_msg="""info face="Arial-Black" size=%s bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2
common lineHeight=%s base=%s scaleW=%s scaleH=%s pages=1 packed=0
page id=0 file="%s"
chars count=%s
""" % (fnt_define["size"],fnt_define["lineHeight"],fnt_define["base"],fnt_define["scaleW"],fnt_define["scaleH"],fnt_define["file"],fnt_define["count"])

	write_file.write(head_msg)

	for i in range(0,int(fnt_define["count"])):
		data=fnt_define["data"][i]
		line="char id=%s x=%s y=%s width=%s height=%s xoffset=%s yoffset=%s xadvance=%s page=%s chnl=%s letter=\"%s\"\n" %(data["id"],data["x"],data["y"],data["width"],data["height"],data["xoffset"],data["yoffset"],data["xadvance"],data["page"],data["chnl"],data["letter"])
		write_file.write(line)

	write_file.close()


def image_size_at_path(path):
	im=Image.open(path)
	# print "\tImage ",path,"size is:",im.size
	return im.size
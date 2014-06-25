# -*- coding: utf-8 -*-
import os,sys
import utility
import shutil

output_path_name="output"


G_ITEMKEY={"textureFilename":"string","itemWidth":"integer","itemHeight":"integer","firstChar":"integer"}

def formatline(line):
	trip=(' ','\t','\n', '\f', '\b', '\r')
	temp_line=line
	for key in trip:
		temp_line=temp_line.replace(key,"")
	return line


def getKeyFromLine(line,mask):
	if line == "":
		print "line mustn't be empty!"
		input()

	# print "getKeyFromLine: ",line," ",mask

	real_mask_1 = "<%s>" % mask
	real_mask_2 = "</%s>" % mask


	temp_line=formatline(line)
	temp_line=temp_line.replace(real_mask_1,"").replace(real_mask_2,"").strip().lstrip().rstrip('\r')
	# print "templine= ",temp_line
	return temp_line

def read_info_from_file(name):
	global G_ITEMKEY

	plist_info={"textureFilename":"nil.png","itemWidth":0,"itemHeight":0,"firstChar":0}

	plist_file=open(name,"r")

	while True:
		line = plist_file.readline()
		if line == "":
			break

		for key in G_ITEMKEY:
			real_key="<key>%s</key>" % key
			if line.find(real_key)!=-1:
				line = plist_file.readline()
				plist_info[key]=getKeyFromLine(line,G_ITEMKEY[key])
				break


	return plist_info


def write_fnt_file(output_path,output_name,plist_info):
	print "*************************************************************"
	print "plist_info :", plist_info
	print "output_path:", output_path
	print "output_name:", output_name

	image_size=utility.image_size_at_path(plist_info["textureFilename"])

	# print "\tImage  %s ,width=%d ,height= %d" % (plist_info["textureFilename"],image_size[0],image_size[1])

	nCount=image_size[0]/int(plist_info["itemWidth"])
	nFirstID=int(plist_info["firstChar"])
	nCharWidth=int(plist_info["itemWidth"])
	nCharHeight=int(plist_info["itemHeight"])
	fnt_define=dict()
	fnt_define_item=list()

	for index in range(0,nCount):
		fnt_define_item_data=dict()
		fnt_define_item_data["id"]=str(nFirstID+index)
		fnt_define_item_data["x"]=str(index*nCharWidth)
		fnt_define_item_data["y"]=str(0)
		fnt_define_item_data["width"]=str(nCharWidth)
		fnt_define_item_data["height"]=str(nCharHeight)
		fnt_define_item_data["xoffset"]=str(0)
		fnt_define_item_data["yoffset"]=str(0)
		fnt_define_item_data["xadvance"]=str(nCharWidth)
		fnt_define_item_data["page"]=str(0)
		fnt_define_item_data["chnl"]=str(0)
		fnt_define_item_data["letter"]=chr(index+nFirstID)

		fnt_define_item.append(fnt_define_item_data)


	fnt_define["data"]=fnt_define_item
	fnt_define["size"]=str(nCharWidth)
	fnt_define["lineHeight"]=str(nCharHeight)
	fnt_define["base"]=str(nCharWidth)
	fnt_define["scaleW"]=str(image_size[0])
	fnt_define["scaleH"]=str(image_size[1])
	fnt_define["file"]=output_name+".png"
	fnt_define["count"]=nCount


	fnt_name = output_path+"/"+output_name
	print "make:",fnt_name
	utility.create_fnt_file(fnt_name, fnt_define)
	print "make:",fnt_name,"done!"

	image_name=output_path+"/"+output_name+".png"
	print "make:",image_name
	shutil.copyfile(plist_info["textureFilename"],image_name)
	print "make:",image_name,"done!"
	print"*************************************************************"


# params["root"]
# params["input"]
# params["output-path"]
# params["output-name"]
# params["images"]
def convert(params):
	# check inout file
	if not os.path.isfile(params["input"]) or params["input"].find(".plist") == -1:
		print "error: file not find :", params["input"]
		return

	if params["output-name"] == "":
		params["output-name"] = params["input"].replace('.plist','')
	elif params["output-name"].find('.fnt'):
		params["output-name"] = params["output-name"].replace('.fnt','')

	# check output path
	if params["output-path"] != "." and not os.path.exists(params["output-path"]):
		os.makedirs(params["output-path"])

	# 从plist文件中获取信息
	plist_info=read_info_from_file(params["input"])

	write_fnt_file(params["output-path"],params["output-name"],plist_info)


# 将plist文件转化为.fnt文件
def main():
	print 'please run ./convert2fnt.py .'


if __name__ == '__main__':
	main()





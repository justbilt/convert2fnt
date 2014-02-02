# -*- coding: utf-8 -*-
import os
import utility

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


def write_fnt_file(name,info):

	image_size=utility.image_size_at_path(info["textureFilename"])

	# print "\tImage  %s ,width=%d ,height= %d" % (info["textureFilename"],image_size[0],image_size[1])

	nCount=image_size[0]/int(info["itemWidth"])
	nFirstID=int(info["firstChar"])
	nCharWidth=int(info["itemWidth"])
	nCharHeight=int(info["itemHeight"])
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
	fnt_define["file"]=info["textureFilename"]
	fnt_define["count"]=nCount

	utility.create_fnt_file(name, fnt_define)

# 将plist文件转化为.fnt文件
def main():
	file_list=os.listdir(os.getcwd())
	for file_name in file_list:
		# 判断目标是否是plist文件
		if os.path.isfile(file_name) and file_name.find(".plist")!=-1:
			print "\n\tFile: ",file_name

			# 从plist文件中获取信息
			plist_info=read_info_from_file(file_name)

			# 打印信息
			for k in plist_info:
				print "\tInfo  ",k , "=",plist_info[k]

			# 转化为fnt文件
			fnt_name=file_name.replace(".plist",".fnt")
			write_fnt_file(fnt_name,plist_info)

	print "\n\tSuccessed!"



if __name__ == '__main__':
	main()





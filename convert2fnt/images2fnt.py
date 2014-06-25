# -*- coding: utf-8 -*-
import os
from PIL import Image

# import utility
import utility


output_path_name="output"


def joint_image(out_image_name,image_dict):
	outW=0
	outH=0
	for key in image_dict.keys():
		size=utility.image_size_at_path(key)
		outW+=size[0]
		outH=max(size[1],outH)

	print "out image size %dx%d" %(outW,outH)

	toImage = Image.new('RGBA', (outW, outH))

	x=0
	for key in image_dict.keys():
		fromImage=Image.open(key)
		toImage.paste(fromImage,( x, 0))
		# print "\t %s offset %d" %(key,x)
		x+=fromImage.size[0]

	toImage.save(out_image_name)


# params["root"]
# params["input"]
# params["output-path"]
# params["output-name"]
# params["images"]
def convert(params):
	# check image counts
	if len(params["images"]) <= 2:
		print "error: less images..."
		return

	# check output path
	if params["output-path"] != "." and not os.path.exists(params["output-path"]):
		os.makedirs(params["output-path"])

	image_dict,prefix = split_images(params["images"])

	# check output name
	if params["output-name"] == "":
		params["output-name"] = prefix
	elif params["output-name"].find('.fnt'):
		params["output-name"] = params["output-name"].replace('.fnt','')


	do_convert(image_dict,params["output-path"],params["output-name"])


def split_images(images_list):
	image_dict = dict()
	prefix = ""
	for image_name in images_list:
		tmp_prefix = image_name[0:image_name.rfind('_')]

		if prefix == "":
			prefix = tmp_prefix
		elif prefix != tmp_prefix:
			print "error: invalide prefix : ",tmp_prefix

		str_ext = image_name[image_name.rfind('_')+1:image_name.rfind('.')]
		image_dict[image_name]=str_ext

	return image_dict,prefix

def do_convert(image_dict,output_path,output_name):
	print "*************************************************************"
	print "image_dict :", image_dict
	print "output_path:", output_path
	print "output_name:", output_name



	fnt_name=output_path+"/"+output_name+".fnt"
	image_name=output_name+".png"
	fnt_define=dict()
	index=0
	xOffset=0
	max_height=0
	max_width=0
	fnt_define_item=list()
	for key in image_dict.keys():
		# print "\t+",key+"\t","Key:",chr(int(image_dict[key]))

		image_size=utility.image_size_at_path(key)
		fnt_define_item_data=dict()
		fnt_define_item_data["id"]=image_dict[key]
		fnt_define_item_data["x"]=str(xOffset)
		fnt_define_item_data["y"]=str(0)
		fnt_define_item_data["width"]=str(image_size[0])
		fnt_define_item_data["height"]=str(image_size[1])
		fnt_define_item_data["xoffset"]=str(0)
		fnt_define_item_data["yoffset"]=str(0)
		fnt_define_item_data["xadvance"]=str(image_size[0])
		fnt_define_item_data["page"]=str(0)
		fnt_define_item_data["chnl"]=str(0)
		fnt_define_item_data["letter"]=chr(int(image_dict[key]))

		fnt_define_item.append(fnt_define_item_data)

		index+=1
		xOffset+=image_size[0]
		max_width=max(max_width,image_size[0])
		max_height=max(max_height,image_size[1])

	fnt_define["data"]=fnt_define_item
	fnt_define["size"]=str(max_width)
	fnt_define["lineHeight"]=str(max_height)
	fnt_define["base"]=str(max_width)
	fnt_define["scaleW"]=str(xOffset)
	fnt_define["scaleH"]=str(max_height)
	fnt_define["file"]=image_name
	fnt_define["count"]=len(image_dict)

	image_name=output_path+"/"+output_name+".png"

	print "make:",fnt_name
	utility.create_fnt_file(fnt_name, fnt_define)
	print "make:",fnt_name,"done!"

	print "make:",image_name
	joint_image(image_name,image_dict)
	print "make:",image_name,"done!"
	print"*************************************************************"

def main():
	print 'please run ./convert2fnt.py .'


if __name__ == '__main__':
	main()





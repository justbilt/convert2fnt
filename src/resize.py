# -*- coding: utf-8 -*-
import os,sys
# import utility
sys.path.append("../utility")
import utility


left=1
right=1
top=0
bottom=1



def main():
	file_list=os.listdir(os.getcwd())

	for file_name in file_list:
		if not os.path.isfile(file_name) or file_name.find(".png") == -1:
			continue

		size=utility.image_size_at_path(file_name)

		new_image_cmd="convert -size %dx%d -strip -colors 8 -depth 8 xc:none tmp.png" %(size[0]+left+right,size[1]+top+bottom)
		os.system(new_image_cmd)

		composite_image_cmd="composite -geometry +%d+%d %s tmp.png %s" %(left,right,file_name,file_name)
		os.system(composite_image_cmd)




if __name__ == '__main__':
	main()





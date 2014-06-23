import sys
import glob

if __name__ == "__main__":
	for s in sys.argv:
		print s

	file_names = glob.glob(sys.argv[1])
	print(file_names)
	for file_name in file_names:
		print(file_name)
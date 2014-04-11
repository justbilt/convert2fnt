学习了Python也有一段时间了,一直在看书啊什么的,没有写些东西,感觉这样不太好,刚好项目中需要一个CCLabrlTTF但美术妹纸只给了一堆散图,自己写一个小工具吧!
<!--more-->

>2014年4月11日更新:
1. 去除了``ImageMagick``的依赖,改用``PIL``
2. 用``Pyinstaller``打包出了win32和mac的可执行程序,不用安装任何东西了!

发现之前写的那个脚本依赖的东西太多了,加上最近对Python的了解又有所增加,所以重写了这个工具,变得更加易用了,小伙伴赶紧更新下吧~

### 一.使用
新版的工具已经不需要安装任何附属的东西了,只需两步,就可解脱~

#### 1).修改图片名
这一步十分容易,我们约定一个规则,规定图片的命名为`x_y.png`,这样x就是最终`.fnt`和`.png`的名字,而y就是对应字符的ASCII码,这样我的图片最后命名是这个样子的:

```python
fighting_header_shuzi_48.png 	#0
fighting_header_shuzi_49.png 	#1
fighting_header_shuzi_50.png 	#2
fighting_header_shuzi_51.png 	#3
fighting_header_shuzi_52.png 	#4
fighting_header_shuzi_53.png 	#5
fighting_header_shuzi_54.png 	#6
fighting_header_shuzi_55.png 	#7
fighting_header_shuzi_56.png 	#8
fighting_header_shuzi_57.png 	#9
fighting_header_shuzi_109.png 	#m
```
最后一个m是因为我的图片中包含了一个`m`字样的图片,具体ascii码表可以在[这里][3]查.


#### 2).下载可执行程序
**windows:**

从[这里][1]下载images2fnt.exe,在你的碎图目录双击运行

**mac:**

从[这里][2]下载images2fnt,在你的碎图目录启动终端,键入``./images2fnt``

然后...然后就神奇的东西出现了呢,在`output`目录下会找到你想要的东西~


### 二.项目
工程已开源到github上,点击[这里][4]查看,项目采用Python编写,主要依赖了这几个库:
1. Pillow
2. Pyinstaller

Pillow是Python的图片处理库,前身是Pil,项目使用Pillow拼接图片,获取图片信息.
Pyinstaller是Python的一个发布工具,会将代码打包成可执行文件,十分方便.



[1]:https://github.com/justbilt/fnt_convert/blob/master/build/images2fnt.exe
[2]:https://github.com/justbilt/fnt_convert/blob/master/build/images2fnt
[3]:http://www.weste.net/tools/ASCII.asp
[4]:https://github.com/justbilt/fnt_convert



## (全文完)

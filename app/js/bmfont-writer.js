//
// info face="Arial-Black" size=30 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2
// common lineHeight=54 base=30 scaleW=319 scaleH=54 pages=1 packed=0
// page id=0 file="attack_num.png"
// chars count=11
// char id=45 x=0 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="-"
// char id=48 x=30 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="0"
// char id=49 x=60 y=0 width=19 height=54 xoffset=0 yoffset=0 xadvance=19 page=0 chnl=0 letter="1"
// char id=50 x=79 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="2"
// char id=51 x=109 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="3"
// char id=52 x=139 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="4"
// char id=53 x=169 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="5"
// char id=54 x=199 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="6"
// char id=55 x=229 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="7"
// char id=56 x=259 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="8"
// char id=57 x=289 y=0 width=30 height=54 xoffset=0 yoffset=0 xadvance=30 page=0 chnl=0 letter="9"

const fs = require("fs")
const path = require("path");
const nativeImage = require('electron').nativeImage;
var Jimp = require("jimp");

class BMFontWriter {
    constructor(){
        this._charList = Array();
        this._font = "Arial"
        this._fontSize = 10
    }

    setFont(_name, _size) {
        this._font = _name;
        this._size = _size;
    }

    appendItem(image, char) {
        this._charList.push({image: image, char:char});
    }

    save(_file) {

        if (path.extname(_file) != ".fnt") {
            return
        }

        var lines = Array()
        var imageName = path.basename(_file, path.extname(_file)) + ".png";
        var imagePathName = path.join(path.dirname(_file), imageName);

        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;

        for (var index = 0; index < this._charList.length; index++) {
            var element = this._charList[index];
            var bmp = element.image.bitmap;

            var argumentList = Array();
            argumentList.push("char");
            argumentList.push("id="+element.char.charCodeAt(0));
            argumentList.push("x="+x);
            argumentList.push("y="+y);
            argumentList.push("width="+bmp.width);
            argumentList.push("height="+bmp.height);
            argumentList.push("xoffset="+0);
            argumentList.push("yoffset="+0);
            argumentList.push("xadvance="+bmp.width);
            argumentList.push("page="+0);
            argumentList.push("chnl="+0);
            argumentList.push("page="+0);
            argumentList.push(String.format("letter=\"{0}\"",element.char.charAt(0)));

            lines.push(argumentList.join(" "));

            x = x + bmp.width;
            h = Math.max(h, bmp.height);
            w = w + bmp.width;
        }

        lines.splice(
            0, 
            0,
            String.format("info face=\"{0}\" size={1} bold=0 italic=0 charset=\"\" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2", this._font, this._fontSize),
            String.format("common lineHeight={0} base={2} scaleW={1} scaleH={0} pages=1 packed=0", h, w, this._fontSize),
            String.format("page id=0 file=\"{0}\"", imageName),
            String.format("chars count={0}", this._charList.length)
        )

        fs.writeFileSync(_file, lines.join("\n"));

        x = 0;
        y = 0;
        var image = new Jimp(w, h, function (err, image) {
            console.log(this);
            for (var index = 0; index < this._charList.length; index++) {
                var element = this._charList[index];
                var bmp = element.image.bitmap;

                image.composite(element.image, x, y);
                x = x + bmp.width;
            }            
            image.write(imagePathName);
        }.bind(this));
    }
}   

exports.BMFontWriter = BMFontWriter;
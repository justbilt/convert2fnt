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

    appendItem(_image, _char) {
        this._charList.push({image: _image, char: _char});
    }

    _appendLine(_config, _image, _charcode, _char) {
        var line = Array();
        
        line.push("char");
        line.push("id=" + _charcode);
        line.push("x=" + _config.x);
        line.push("y=" + _config.y);
        line.push("width=" + _image.width);
        line.push("height=" + _image.height);
        line.push("xoffset=" + 0);
        line.push("yoffset=" + 0);
        line.push("xadvance=" + _image.width);
        line.push("page=" + 0);
        line.push("chnl=" + 0);
        line.push("page=" + 0);
        line.push(String.format("letter=\"{0}\"", _char));

        _config.lines.push(line.join(" "));

        _config.x = _config.x + _image.width;
        _config.max_h = Math.max(_config.max_h, _image.height);
        _config.min_w = Math.max(_config.min_w, _image.width);
        _config.w = _config.w + _image.width;        
    }

    save(_file) {

        if (path.extname(_file) != ".fnt") {
            return
        }

        var lines = Array()
        var imageName = path.basename(_file, path.extname(_file)) + ".png";
        var imagePathName = path.join(path.dirname(_file), imageName);

        var config = {
            x: 0,
            y: 0,
            w: 0,
            max_h: this._charList[0].image.bitmap.height,
            min_w: this._charList[0].image.bitmap.width,
            lines: Array()
        }

        for (var index = 0; index < this._charList.length; index++) {
            var element = this._charList[index];
            var bmp = element.image.bitmap;

            this._appendLine(config, bmp, element.char.charCodeAt(0), element.char);
        }

        var space = {width: config.min_w, height: config.max_h};
        this._appendLine(config, space, " ".charCodeAt(0), "space");

        config.lines.splice(
            0, 
            0,
            String.format("info face=\"{0}\" size={1} bold=0 italic=0 charset=\"\" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=2,2", this._font, this._fontSize),
            String.format("common lineHeight={0} base={2} scaleW={1} scaleH={0} pages=1 packed=0", config.max_h, config.w, this._fontSize),
            String.format("page id=0 file=\"{0}\"", imageName),
            String.format("chars count={0}", config.lines.length)
        )

        fs.writeFileSync(_file, config.lines.join("\n"));

        config.x = 0;
        config.y = 0;
        var image = new Jimp(config.w, config.max_h, function (err, image) {
            for (var index = 0; index < this._charList.length; index++) {
                var element = this._charList[index];
                var bmp = element.image.bitmap;

                image.composite(element.image, config.x, config.y);
                config.x = config.x + bmp.width;
            }            
            image.write(imagePathName);
        }.bind(this));
    }
}   

exports.BMFontWriter = BMFontWriter;
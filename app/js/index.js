const path = require("path");
const nativeImage = require('electron').nativeImage;
const remote = require("electron").remote;
const BMFontWriter = require("./js/bmfont-writer").BMFontWriter;
const Jimp = require("jimp");

var ITEM_PARENT = document.getElementById("item-list");
var FNTITEMARRAY = Array();
var UID = 0;
var CURRENTFONT = {
  name: "Arial",
  size: 10
}

function onClickTableItemRemove(o) {
  var id = Number(o.id);
  for (var index = 0; index < FNTITEMARRAY.length; index++) {
    var element = FNTITEMARRAY[index];
    if(element.uid == id)
    {
      FNTITEMARRAY.splice(index, 1);
      var p = o.parentNode.parentNode;
      p.parentNode.removeChild(p);
      break;
    }
  }  

}

function onClickSaveFnt(event) {
  remote.dialog.showSaveDialog({ title: "untitle.fnt" }, function (filename) {
    if (!filename) {
      return;
    }

    if (path.extname(filename) != ".fnt") {
        filename = filename + ".fnt";
    }

    var writer = new BMFontWriter();

    writer.setFont(CURRENTFONT.name, CURRENTFONT.size);
    
    for (var index = 0; index < FNTITEMARRAY.length; index++) {
      var element = FNTITEMARRAY[index];
      writer.appendItem(element.image, element.input.value);
    }

    writer.save(filename);
  });
}

function onClickClear(event) {
  UID = 0;
  FNTITEMARRAY = Array();
  while (ITEM_PARENT.firstChild) {
    ITEM_PARENT.removeChild(ITEM_PARENT.firstChild);
  }
}

if (!String.format) {
  String.format = function (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

function calcImageKey(imagePath) {
    var char = path.basename(imagePath, path.extname(imagePath));
    var split = char.split("_")
    if (split.length >= 2) {
      var temp = Number(split[split.length-1]);
      if (temp) {
        char = String.fromCharCode(temp)
      }
    }
    return char
}

function appendFntItem(imagePath, char) {
  if (!char) {
    char = calcImageKey(imagePath);
  }
  var basename = path.basename(imagePath);

  var text1 = document.createTextNode(basename);
  var image = document.createElement("img");
  var text3 = document.createTextNode("");
  var input = document.createElement("input");
  input.className = "form-control input-sm";
  input.value = char[0];
  input.maxLength = 1;

  var index = FNTITEMARRAY.push({ input: input, uid: UID }) - 1;

  Jimp.read(imagePath, function (err, lenna) {
    if (err) { throw err };
    FNTITEMARRAY[index].image = lenna;
    text3.nodeValue = String.format("{0}x{1}", lenna.bitmap.width, lenna.bitmap.height);

    var baseW = 50;
    var baseH = 50;

    var scacle = Math.min(baseW / lenna.bitmap.width, baseH / lenna.bitmap.height);
    image.src = imagePath;
    image.width = lenna.bitmap.width * scacle;
    image.height = lenna.bitmap.height * scacle;
  })

  var tr = document.createElement('tr');
  var tdList = Array();

  tdList[0] = document.createElement('td');
  tdList[0].appendChild(text1);

  tdList[1] = document.createElement('td');
  tdList[1].appendChild(image);

  tdList[2] = document.createElement('td');
  tdList[2].appendChild(text3);

  tdList[3] = document.createElement('td');
  tdList[3].appendChild(input);

  tdList[4] = document.createElement('td');
  tdList[4].innerHTML = String.format("<button class=\"btn btn-xs btn-danger\" type=\"button\", id=\"{0}\", onclick=\"onClickTableItemRemove(this)\"><span class=\"glyphicon glyphicon-trash\"></span></button>", UID);

  tdList.forEach(function (element) {
    element.className = "text-center";
    tr.appendChild(element);
  }, this);

  ITEM_PARENT.appendChild(tr);

  UID = UID + 1;  
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  for (var i = 0; i < ev.dataTransfer.files.length; i++) {
    var filePath = ev.dataTransfer.files[i].path;
    if (path.extname(filePath) == ".png") {
      appendFntItem(filePath)
    }
  }
  ev.preventDefault()
}

document.getElementById("btn-save").addEventListener("click", onClickSaveFnt);
document.getElementById("btn-clear").addEventListener("click", onClickClear);

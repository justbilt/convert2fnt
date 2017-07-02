const path = require("path");
const nativeImage = require('electron').nativeImage;
const remote = require("electron").remote;
const BMFontWriter = require("./js/bmfont-writer").BMFontWriter;
const Jimp = require("jimp");
const SystemFonts = require('system-font-families').default;
const SystemFontsIns = new SystemFonts();

var fntItemArray = Array();
var table = document.getElementById("item-list");
var fonts = null;
var currentFont = {
  name: "Arial",
  size: 10
}

SystemFontsIns.getFonts().then(
  function (res) {
    fonts = res;
  },
  function (err) {
  }
);

function refreshFontButtonLabel() {
  var btn = document.getElementById("btn-font");
  if (btn.value) {
    btn.value = currentFont.name + "," + currentFont.size;
  }
  else {
    btn.innerText = currentFont.name + "," + currentFont.size;
  }
}

function onClickTableItemRemove(o) {
  var p = o.parentNode.parentNode;
  p.parentNode.removeChild(p);
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

    writer.setFont(currentFont.name, currentFont.size);
    
    for (var index = 0; index < fntItemArray.length; index++) {
      var element = fntItemArray[index];
      writer.appendItem(element.image, element.input.value);
    }

    writer.save(filename);
  });
}

function onClickChangeFont(event) {
  if (!fonts) {
    return;
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

function appendFntItem(imagePath, char) {
  if (!char) {
    char = path.basename(imagePath, path.extname(imagePath));
  }
  var basename = path.basename(imagePath);

  var text1 = document.createTextNode(basename);
  var image = document.createElement("img");
  var text3 = document.createTextNode("");
  var input = document.createElement("input");
  input.className = "form-control input-sm";
  input.value = char;

  var index = fntItemArray.push({ input: input }) - 1;

  Jimp.read(imagePath, function (err, lenna) {
    if (err) { throw err };
    fntItemArray[index].image = lenna;
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
  tdList[4].innerHTML = "<button class=\"btn btn-xs btn-danger\" type=\"button\", id=\"btn-save\", onclick=\"onClickTableItemRemove(this)\"><span class=\"glyphicon glyphicon-trash\"></span></button>";

  tdList.forEach(function (element) {
    element.className = "text-center";
    tr.appendChild(element);
  }, this);

  table.appendChild(tr);
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev)
  for (var i = 0; i < ev.dataTransfer.files.length; i++) {
    var filePath = ev.dataTransfer.files[i].path;
    if (path.extname(filePath) == ".png") {
      appendFntItem(filePath)
    }
  }
  ev.preventDefault()
}


refreshFontButtonLabel();
document.getElementById("btn-save").addEventListener("click", onClickSaveFnt);
document.getElementById("btn-font").addEventListener("click", onClickChangeFont);
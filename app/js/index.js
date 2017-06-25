const path = require("path");
const nativeImage = require('electron').nativeImage;
const remote = require("electron").remote;
const BMFontWriter = require("./js/bmfont-writer").BMFontWriter;
var Jimp = require("jimp");

var fntItemArray = Array();
var table = document.getElementById("item-list");

// 保存
document.getElementById("btn-save").addEventListener("click", function(event){
  // dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: 'GPX', extensions: ['gpx'] }]});
  remote.dialog.showSaveDialog({title: "untitle.fnt"}, function(filename){
    if(!filename){
      return;
    }
    console.log(filename);
    var writer = new BMFontWriter();

    for (var index = 0; index < fntItemArray.length; index++) {
      var element = fntItemArray[index];
      writer.appendItem(element.image, element.input.value);
    }

    writer.save(filename);
  });
})

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

function createTableElement(imagePath){


    var basename = path.basename(imagePath);

    var text1 = document.createTextNode(basename);

    var image = document.createElement("img");    
    

    var text3 = document.createTextNode("");

    var input = document.createElement("input");
    input.className = "form-control";
    input.value = path.basename(imagePath, path.extname(imagePath));

    var index = fntItemArray.push({input: input}) - 1 ;

    Jimp.read(imagePath, function(err, lenna){
      if(err) {throw err};
      fntItemArray[index].image = lenna;
      text3.nodeValue = String.format("{0}x{1}", lenna.bitmap.width, lenna.bitmap.height);

      var baseW = 50;
      var baseH = 50;

      var scacle = Math.min(baseW/lenna.bitmap.width, baseH/lenna.bitmap.height);
      image.src = imagePath;
      image.width = lenna.bitmap.width * scacle;
      image.height = lenna.bitmap.height * scacle;

    })


    var tr = document.createElement('tr');   

    var td1 = document.createElement('td');
    td1.className = "text-center";    
    var td2 = document.createElement('td');
    td2.className = "text-center";    
    var td3 = document.createElement('td');
    td3.className = "text-center";    
    var td4 = document.createElement('td');

    td1.appendChild(text1);
    td2.appendChild(image);
    td3.appendChild(text3);
    td4.appendChild(input);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    table.appendChild(tr);
}



document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev)
  for(var i=0; i<ev.dataTransfer.files.length; i++){
      var filePath = ev.dataTransfer.files[i].path;
      if(path.extname(filePath) == ".png"){
        createTableElement(filePath)
      }
  }
  ev.preventDefault()
}


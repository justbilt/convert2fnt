const path = require("path");
const nativeImage = require('electron').nativeImage;
const remote = require("electron").remote;
const BMFontWriter = require("./js/bmfont-writer").BMFontWriter;
var Jimp = require("jimp");
var SystemFonts = require('system-font-families').default;

const systemFonts = new SystemFonts();

var fntItemArray = Array();
var table = document.getElementById("item-list");
var writer = new BMFontWriter();
var fonts = null;
var currentFont = {
  name: "Arial",
  size: 10
}

systemFonts.getFonts().then(
  function(res)
  {
    fonts = res;
  },
  function(err)
  {

  }
);

function FontButtonText()
{
  writer.setFont(currentFont.name, currentFont.size);

  var btn = document.getElementById("btn-font");
  if (btn.value)
  {
    btn.value = currentFont.name + "," + currentFont.size;  
  }
  else
  {
    btn.innerText = currentFont.name + "," + currentFont.size;      
  }
}

FontButtonText();


// 保存
document.getElementById("btn-save").addEventListener("click", function(event){
  // dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: 'GPX', extensions: ['gpx'] }]});
  remote.dialog.showSaveDialog({title: "untitle.fnt"}, function(filename){
    if(!filename){
      return;
    }
    console.log(filename);

    for (var index = 0; index < fntItemArray.length; index++) {
      var element = fntItemArray[index];
      writer.appendItem(element.image, element.input.value);
    }

    writer.save(filename);
  });
})

document.getElementById("btn-font").addEventListener("click", function(event){
  if (!fonts)
  {
    return;
  }
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

function onClickTableItemRemove(o){
  console.log(o);
  var p=o.parentNode.parentNode;
  console.log(p);
         p.parentNode.removeChild(p);
}

function createTableElement(imagePath,char){


    var basename = path.basename(imagePath);

    var text1 = document.createTextNode(basename);

    var image = document.createElement("img");    
    

    var text3 = document.createTextNode("");

    var input = document.createElement("input");
    input.className = "form-control";
    if(char)
    {
      input.value = char;
    }
    else
    {
      input.value = path.basename(imagePath, path.extname(imagePath));      
    }

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
    // var del = document.createElement();


    var tr = document.createElement('tr');   

    var td1 = document.createElement('td');
    td1.className = "text-center";    
    var td2 = document.createElement('td');
    td2.className = "text-center";    
    var td3 = document.createElement('td');
    td3.className = "text-center";    
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    td5.className = "text-center";

    td5.innerHTML = "<button class=\"btn btn-xs btn-danger\" type=\"button\", id=\"btn-save\", onclick=\"onClickTableItemRemove(this)\"><span class=\"glyphicon glyphicon-trash\"></span></button>";

    td1.appendChild(text1);
    td2.appendChild(image);
    td3.appendChild(text3);
    td4.appendChild(input);
    // td5.appendChild(del);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

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

















createTableElement("C:/Users/wangb/Documents/work/easy_slg_client/res/flag/TW.png", 1)
createTableElement("C:/Users/wangb/Documents/work/easy_slg_client/res/flag/TZ.png", 2)
createTableElement("C:/Users/wangb/Documents/work/easy_slg_client/res/flag/UA.png", 3)

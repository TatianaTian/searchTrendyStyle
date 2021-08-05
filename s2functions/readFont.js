// scan through source code and filter font-family
// currently not to use computer vision to read images
// pass text and fonts (dictionary)


//var fs = require("fs");
//var text = fs.readFileSync('/Users/tatianatian/Desktop/Startup/ReviewMyStore/Try/websites/tatianatian.com/23000/css/style.css').toString('utf-8');

//const text = require('/Users/tatianatian/Desktop/Startup/ReviewMyStore/Try/websites/tatianatian.com/23000/css/style.css')
//console.log(text)

//searchFonts(text,[])

function searchFonts(text, fonts){
    for (var i=0; i<text.length-8; i++){
        var ind = text.substring(i,i+12)
        if (ind === 'font-family:'){
          const sub = text.substring(i,i+30)
          var location = sub.search(';')
          if (location !== -1){
            var font_all = text.substring(i+12,i+location)   
            var font_all = font_all.replace(/'/g, "");
            var font_all = font_all.replace(/"/g, "");
            var font_list = font_all.split(',');
            for (var j=0; j<font_list.length; j++){
              const font = font_list[j].trim()
              if (font in fonts){
                fonts[font] += 1
              } else{
                fonts[font] = 1
              }
            }
          }              
      }
    }
    return fonts
}

exports.searchFonts = searchFonts;



//output: { Ionicons: 2, ' Flaticon': 3, Icons: 2, ' icomoon': 1 }
//can further sort the font families by value
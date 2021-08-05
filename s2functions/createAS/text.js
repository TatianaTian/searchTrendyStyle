var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

//var moveFrom = "../hackDataBmk/after_json/";
var moveFrom = "../hackDataBmk/after_json_by_category/fashion/";

// Loop through all the files in the temp directory
var analysisList = []

fs.readdir(moveFrom, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(function (file, index) {
        // Make one pass and make the file complete
        //console.log('file: ',file)
        if (file.includes('json')){
            let analysis = fs.readFileSync(path.join(moveFrom, file));
            analysisList.push(JSON.parse(JSON.parse(analysis.toString())))
        }
    });

    // text count list
    /*
    var textCountList = []
    var textCountDict = {}
    for (var i=0; i<analysisList.length; i++){
        textCountList.push(analysisList[i].pdf_analysis[3])
        if (Math.floor(analysisList[i].pdf_analysis[3]/100) in textCountDict){
            textCountDict[Math.floor(analysisList[i].pdf_analysis[3]/100)] += 1
        } else {
            textCountDict[Math.floor(analysisList[i].pdf_analysis[3]/100)] = 1
        }
    }

    console.log('textCountDict: ', textCountDict)*/

    // font count 
    /*
    var fontCountList = []
    var fontCountDict = {}
    for (var i=0; i<analysisList.length; i++){
        const fonts_list = analysisList[i].fonts
        var count = Object.keys(fonts_list).length
        fontCountList.push(count)
    }

    for (var i=0; i<fontCountList.length; i++){
        if (fontCountList[i] in fontCountDict){
            fontCountDict[fontCountList[i]] += 1
        } else {
            fontCountDict[fontCountList[i]] = 1
        }
    }

    console.log("fontCountDict: ", fontCountDict)*/


    // front text count
    
    var frontTextCountList = []
    var frontTextCountDict = {}
    for (var i=0; i<analysisList.length; i++){
        frontTextCountList.push(analysisList[i].pdf_analysis[5])
        if (Math.floor(analysisList[i].pdf_analysis[5]/100) in frontTextCountDict){
            frontTextCountDict[Math.floor(analysisList[i].pdf_analysis[5]/100)] += 1
        } else {
            frontTextCountDict[Math.floor(analysisList[i].pdf_analysis[5]/100)] = 1
        }
    }
    
    console.log(frontTextCountDict)
});



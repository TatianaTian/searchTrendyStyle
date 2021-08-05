var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var moveFrom = "../hackDataBmk/after_json/";
//var moveFrom = "../hackDataBmk/after_json_by_category/fashion/";

// Loop through all the files in the temp directory
var analysisList = []

fs.readdir(moveFrom, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
    var count = 0

    files.forEach(function (file, index) {
        // Make one pass and make the file complete
        if (file.includes('json')){
            let analysis = fs.readFileSync(path.join(moveFrom, file));
            analysisList.push(JSON.parse(JSON.parse(analysis.toString())))
            count += 1
        }
    });

    // page length list
    var pageLengthList = []
    var pageLengthDict = {}
    for (var i=0; i<analysisList.length; i++){
        pageLengthList.push(Math.floor(analysisList[i].pdf_analysis[12]/2))
        if (analysisList[i].pdf_analysis[12] in pageLengthDict){
            pageLengthDict[analysisList[i].pdf_analysis[12]] += 1
        } else {
            pageLengthDict[analysisList[i].pdf_analysis[12]] = 1
        }
    }

    console.log('pageLengthDict: ',pageLengthDict)
});



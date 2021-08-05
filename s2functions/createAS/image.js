var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

//var moveFrom = "../hackDataBmk/after_json/"
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
        if (file.includes('json')){
            let analysis = fs.readFileSync(path.join(moveFrom, file));
            analysisList.push(JSON.parse(JSON.parse(analysis.toString())))
        }
    }); 
 

    // image number list
    /*
    var imageNumberList = []
    var imageNumberDict = {}
    for (var i=0; i<analysisList.length; i++){
        imageNumberList.push(analysisList[i].pdf_analysis[1])        
        if (analysisList[i].pdf_analysis[1].length-1 in imageNumberDict){
            imageNumberDict[analysisList[i].pdf_analysis[1].length-1] += 1
        } else {
            imageNumberDict[analysisList[i].pdf_analysis[1].length-1] = 1
        }
    }
    console.log(imageNumberDict)
    */


    // image score
    /*
    var imageScoreList = []
    var imageAScoreList = []
    var imageTScoreList = []
    var imageAScoreDict = {}
    var imageTScoreDict = {}
    for (var i=0; i<analysisList.length; i++){
        imageScoreList.push(analysisList[i].pdf_analysis[0]) 
        //console.log(analysisList[i].pdf_analysis[0])
        for (var j=0; j<analysisList[i].pdf_analysis[0].length;j++){
            imageAScoreList.push(analysisList[i].pdf_analysis[0][j].aesthetic_score)
            imageTScoreList.push(analysisList[i].pdf_analysis[0][j].technical_score)
        }
    }

    for (var i=0; i<imageAScoreList.length; i++){
        var score = 0
        if ((imageAScoreList[i]*2-Math.floor(imageAScoreList[i]*2))>0.5){
            score = Math.ceil(imageAScoreList[i]*2)/2
          } else {
            score = Math.floor(imageAScoreList[i]*2)/2
          }
        if (score in imageAScoreDict){
            imageAScoreDict[score] += 1
        } else {
            imageAScoreDict[score] = 1
        }
    }

    for (var i=0; i<imageTScoreList.length; i++){
        var score = 0
        if ((imageTScoreList[i]*2-Math.floor(imageTScoreList[i]*2))>0.5){
            score = Math.ceil(imageTScoreList[i]*2)/2
          } else {
            score = Math.floor(imageTScoreList[i]*2)/2
          }
        if (score in imageTScoreDict){
            imageTScoreDict[score] += 1
        } else {
            imageTScoreDict[score] = 1
        }
    }

    console.log('imageTScoreDict: ', imageTScoreDict)
    console.log('imageAScoreDict: ', imageAScoreDict)
*/

    // image objects
    /*
    var imageObjectsList = []
    var imageObjectsDict = {}
    var imageObjectsNameList = []
    var ratioList = []
    var ratioDict = {}

    for (var i=0; i<analysisList.length; i++){
        imageObjectsList.push(analysisList[i].pdf_analysis[1])        
    }

    for (var i=0; i<imageObjectsList.length;i++){
        var imagePerStore = 0
        var imageProductPerStore = 0
        for (var j=0; j<imageObjectsList[i].length; j++){
            imagePerStore += 1
            var storeProduct = 0
            for (var k=0; k<imageObjectsList[i][j].objects.length; k++){
                imageObjectsNameList.push(imageObjectsList[i][j].objects[k].name)
                if (imageObjectsList[i][j].objects[k].name){
                    if (imageObjectsList[i][j].objects[k].name.includes('store product')){
                        storeProduct=1
                    }
                }
            }
            if (storeProduct === 1){
                imageProductPerStore += 1
            }
        }
        var ratio = imageProductPerStore/imagePerStore
        ratioList.push(ratio)
    }


    for (var i=0; i<ratioList.length; i++){
        var score = 0
        if ((ratioList[i]*10*2-Math.floor(ratioList[i]*10*2))>0.5){
            score = Math.ceil(ratioList[i]*10*2)/2
          } else {
            score = Math.floor(ratioList[i]*10*2)/2
          }
        if (score in ratioDict){
            ratioDict[score] += 1
        } else {
            ratioDict[score] = 1
        }
    }

    //console.log('ratioList: ', ratioList)
    console.log('ratioDict: ', ratioDict)*/


// first impression score
    /*
    var imageScoreList = []
    var imageAScoreList = []
    var imageAScoreDict = {}

    for (var i=0; i<analysisList.length; i++){
        imageScoreList.push(analysisList[i].pdf_analysis[0]) 
        for (var j=0; j<analysisList[i].pdf_analysis[0].length;j++){
            if (analysisList[i].pdf_analysis[0][j].image_id === '1'){
                imageAScoreList.push(analysisList[i].pdf_analysis[0][j].aesthetic_score)
            }
        }
    }

    
    for (var i=0; i<imageAScoreList.length; i++){
        var score = 0
        if ((imageAScoreList[i]*2-Math.floor(imageAScoreList[i]*2))>0.5){
            score = Math.ceil(imageAScoreList[i]*2)/2
        } else {
            score = Math.floor(imageAScoreList[i]*2)/2
        }
        if (score in imageAScoreDict){
            imageAScoreDict[score] += 1
        } else {
            imageAScoreDict[score] = 1
        }
    }

    console.log('imageAScoreDict: ', imageAScoreDict)*/

    // first impression objects
    
    var imageObjectsList = []
    var imageObjectsNameList = []
    var haveProduct = {
        yes:0,
        no:0
    }

    for (var i=0; i<analysisList.length; i++){
        imageObjectsList.push(analysisList[i].pdf_analysis[1])        
    }

    for (var i=0; i<imageObjectsList.length;i++){
        for (var j=0; j<imageObjectsList[i].length; j++){
            //console.log(imageObjectsList[i][j])
            if (imageObjectsList[i][j].image_id === 1){
                //imageObjectsNameList.push(imageObjectsList[i][j])
                var storeProduct = 0
                for (var k=0; k<imageObjectsList[i][j].objects.length; k++){
                    imageObjectsNameList.push(imageObjectsList[i][j].objects[k].name)
                    
                    if (imageObjectsList[i][j].objects[k].name){
                        if (imageObjectsList[i][j].objects[k].name.includes('store product')){
                            storeProduct=1
                        }
                    }
                }
                if (storeProduct === 1){
                    haveProduct.yes += 1
                } else {
                    haveProduct.no += 1
                }
            }
        }
    }

    console.log(haveProduct)
});



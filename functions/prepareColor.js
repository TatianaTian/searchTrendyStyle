const data = require('./x11.json')
var convert = require('color-convert');

category_lab = {}
lab_list = []
data.map((hex)=>{
     category_lab[convert.hex.lab(hex.hex)] = hex.category
     lab_list.push(convert.hex.lab(hex.hex))
}
)

console.log(category_lab)
console.log(lab_list)


var json = JSON.stringify({category_lab});
var json2 = JSON.stringify({lab_list});

const fsLibrary  = require('fs') 
fsLibrary.writeFile('color_categories.json', json, 'utf8', (error)=>{console.log('error: ', error)})
fsLibrary.writeFile('lab_list.json', json2, 'utf8', (error)=>{console.log('error: ', error)})
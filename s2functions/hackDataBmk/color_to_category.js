var distance = require('euclidean-distance')
var convert = require('color-convert');
const data = require('../../functions/color_categories.json')
const data2 = require('../../functions/lab_list.json')
const data3 = require('../../functions/categories.json')
const data4 = require('../../functions/emotions_categories.json')
const AWS = require('aws-sdk');
const urls = require('../urls.json')

fs = require('fs');

const lab_category = data.category_lab
const x11_lab = data2.lab_list_data
const emotions = data4.emotions

async function hackData(returned_color_list) {


    var lab_list = []
    for (var i=0; i<returned_color_list.length; i++){
        lab = convert.hex.lab(returned_color_list[i]); 
        lab_list.push(lab)
    }

    //console.log('lab_list: ',lab_list)

    var categories = []
    for (var i=0; i<lab_list.length; i++){
        let min_distance = 1000000
        let min_lab_str = ''
        x11_lab.map(obj => {
            const d = distance(obj,lab_list[i])
            if (d<min_distance){
            min_distance = d
            min_lab_str = obj.toString()
            }
        })
        const category = lab_category[min_lab_str]
        if (!categories.includes(category)){
            categories.push(category)
        }
    }

    console.log(categories)

}

const info = ["#EBC5FF","#FEEE35","#C8F34E"]

const edit = async () => {

    await hackData(info)
    
}

edit()


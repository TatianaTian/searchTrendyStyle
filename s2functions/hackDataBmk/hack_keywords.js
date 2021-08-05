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

const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
});

async function hackData(store_url, info) {

    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };
    
    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))

    const new_all_list = info['all']
    var new_all = []
    for (var i=0; i<new_all_list.length; i++){
        new_all.push( { text: new_all_list[i],
        sentiment: { score: 0, label: 'positive' },
        emotion: 'joy' } )
    }

    const new_first_list = info['first']
    var new_first = []
    for (var i=0; i<new_first_list.length; i++){
        new_first.push( { text: new_first_list[i],
        sentiment: { score: 0, label: 'positive' },
        emotion: 'joy' } )
    }

    const all_keywords = obj.pdf_analysis[7]
    const first_keywords = obj.pdf_analysis[10]


    //console.log('all_keywords: ', all_keywords)
    //console.log('new_all: ', new_all)

    //console.log('first_keywords: ', first_keywords)
    //console.log('new_first: ', new_first)

    obj.pdf_analysis[7] = new_all
    obj.pdf_analysis[10] = new_first
 
    
    const params_upload_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to save as in S3
        Body: JSON.stringify(JSON.stringify(obj))
    };
    await s3.upload(params_upload_json).promise()
    
    console.log('done uploading keywords')
}

const info = {
    "all": ['DI BRUNO BROS','FREE SHIPPING','WINTER HOLIDAY CATERING','TRY SOMETHING NEW','OUR STORES'],
    "first": ['DI BRUNO BROS','FREE SHIPPING','SHOP NOW','CHEESE']
}


const edit = async () => {

    await hackData('dibruno.com', info)
    
}

edit()


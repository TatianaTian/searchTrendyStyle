var distance = require('euclidean-distance')
var convert = require('color-convert');
const data = require('../../functions/color_categories.json')
const data2 = require('../../functions/lab_list.json')
const data3 = require('../../functions/categories.json')
const data4 = require('../../functions/emotions_categories.json')
const AWS = require('aws-sdk');
const urls = require('../urls.json')

fs = require('fs');


const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
});

async function hackData(store_url, list) { 

    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };
    
    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))


    var font_new_list = {}
    for (var i=0; i<list.length; i++){
        font_new_list[list[i]] = 1
    }

    obj.fonts = font_new_list

    const params_upload_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to save as in S3
        Body: JSON.stringify(JSON.stringify(obj))
    };
    await s3.upload(params_upload_json).promise()
    
    console.log('done uploading fonts')
}



const edit = async () => {

    await hackData('theoandharris.com',["Open Sans", "Arial", "Helvetica","Lucida", "Georgia","Times New Roman", "ETmodules", "proxima-nova", "Helvetica Neue"]                                                                         
    )
    
}

edit()


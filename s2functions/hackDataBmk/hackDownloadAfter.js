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

async function hackData(store_url) {
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };

    const data_analysis = await s3.getObject(params_download_json).promise()

    console.log('data_analysis: ', data_analysis)
    /*
    fs.writeFile(`after_json/`+store_url+`.json`, data_analysis.Body, function(err) {
        if (err) {
            console.log(err);
        }
    });*/
    fs.writeFile(`after_json/`+store_url+`.json`, data_analysis.Body, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

hackData('dibruno.com')


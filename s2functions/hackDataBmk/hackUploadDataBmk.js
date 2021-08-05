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

async function hackData(store_url) {
    let analysis = fs.readFileSync('analysisTest_'+store_url+'.json');
    console.log('analysis: ', analysis)
    const params_upload_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to save as in S3
        Body: analysis
    };
    await s3.upload(params_upload_json).promise()
}


//exports.parseData = parseData


//hackData('headsupfortails.com')
//hackData('bestfriendsbysheri.com')


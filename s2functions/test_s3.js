//const useGM = require('./useGoogleVision')
const AWS = require('aws-sdk');

//const num_images = 1
//const url = 'tatianatian.com'




const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
});

/*
for (var i=0; i<num_images; i++){
    // Setting up S3 upload parameters
    const index = i+1
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${url}/images/${index}.png`, // File name you want to download from S3
    };

    s3.getObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        //console.log(data.Body)
        console.log('index is ', index)
        useGM.google_computer_vision(data.Body, url, index, ID, SECRET_KEY);
    })
}*/

const test_s3 = async () => {

    /*
    var store_url = 'gopawsbeyond.com'
    var url_dict = {}
    var params = { Bucket: BUCKET_NAME, Prefix: `${store_url}/image_objects` };

    s3.listObjects(params, async function(err, data){
        if (err) return console.error(err);
        
        for (var i=0; i<data.Contents.length; i++){
            var key = data.Contents[i].Key
            const n = key.lastIndexOf("/");
            const index = key.substring(n+1, key.length-4)

            if (index !== 'store_front'){
                url_dict[index] = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: data.Contents[i].Key})
            }
        }

        console.log('url_dict: ', url_dict)
        return; */

        /*
    var store_url = 'gopawsbeyond.com'
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
        };
    try {
        const data_analysis = await s3.getObject(params_download_json).promise()
        console.log('success')
    }
    catch(err){
        console.log('fail')
    }*/

    /*
    var store_url = 'twotem.com'
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/original/store_front.png`, // File name you want to download from S3
        };

    s3.headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          // Handle no object on cloud here  
          console.log(false)
        } else {  
            console.log(true)
          //s3.getSignedUrl('getObject', params, callback);  
        }
      });*/

      

      /*
      const params = {
        Bucket: BUCKET_NAME,
        Key: `${short_store_url}/analysis.json`, // File name you want to download from S3
        };
    
        const data_analysis = await s3.getObject(params).promise()
        const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
        //console.log("obj['pdf_analysis']: ", obj['pdf_analysis'])
        if (obj['pdf_analysis2']){
          console.log(true)
        } else {
            console.log(false)
        }
*/

    var short_store_url = 'redstonestyle.com'
    var params = {
        Bucket: BUCKET_NAME,
        Prefix: `${short_store_url}/`
    };
    
    s3.listObjects(params, function(err, data) {
        if (err) return console.log(err);
        console.log('data: ', data)
        
        if (data.Contents.length === 0) console.log('data.Contents.length == 0');
        else {
            params = {Bucket: BUCKET_NAME};
            params.Delete = {Objects:[]};
        
            data.Contents.forEach(function(content) {
                params.Delete.Objects.push({Key: content.Key});
                s3.deleteObjects(params, function(err, data) {
                    console.log('done deleting: ', content.Key)
                })
            });
        }
    });
    

}


test_s3()



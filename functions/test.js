const AWS = require('aws-sdk');
require('dotenv').config()

//const S3_accessKeyIda = require("../config/keys").S3_accessKeyId;
//const S3_secretAccessKeya = require("../config/keys").S3_secretAccessKey;
/*
try{
    var s3 = new AWS.S3({accessKeyId:process.env.S3_accessKeyId, secretAccessKey:process.env.S3_secretAccessKey, region:'us-east-1'});
    var params = {Bucket: 'reviewmystore', Key: `websites/a.jpg`, ContentType: 'image/jpeg'};
    s3.getSignedUrl('putObject', params, function (err, url) {
        console.log('url is ', url)
    });    
    
}catch(err){
    console.log('err is ', err)
}

*/

//console.log('S3_accessKeyId is ', process.env.S3_accessKeyId)
//console.log('S3_secretAccessKey is ', process.env.S3_secretAccessKey)

//console.log('S3_accessKeyIda is ', process.env.S3_accessKeyIda)
//console.log('S3_secretAccessKeya is ', process.env.S3_secretAccessKeya)

const requestS3Url = () => {
    var s3 = new AWS.S3({accessKeyId:process.env.S3_accessKeyId, secretAccessKey:process.env.S3_secretAccessKey, region:'us-east-1'});
    var params = {Bucket: 'reviewmystore', Key: `test/as`, ContentType: 'text/html'};
    s3.getSignedUrl('putObject', params, function (err, url) {
    //console.log('Your generated pre-signed URL is', url);
    //res.send([url, req.user._id]);
    console.log('url in requestS3Url is ', url);
    return url
    });  
    
}

exports.requestS3Url = requestS3Url;

requestS3Url()
    

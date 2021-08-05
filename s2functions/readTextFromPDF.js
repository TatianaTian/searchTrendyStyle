const fs  = require('fs') 
var extract = require('pdf-text-extract')
var path = require('path')
const AWS = require('aws-sdk');


async function read_text_from_pdf(short_store_url, ID, SECRET_KEY) {

  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
  });

  const params = {
    Bucket: 'reviewmystore',
    Key: `${short_store_url}/original/store_front.pdf`, // File name you want to download from S3
  };

  console.log('1')
  s3.getObject(params, function(err, data) {
    if (err) {
        throw err;
    }
    console.log('2')
    fs.writeFileSync('test2.pdf', data.Body);

    extract('test2.pdf', { splitPages: false }, function (err, pages) {
      if (err) {
        console.dir(err)
        return
      }
      let text = ''
      for (var i=0; i<pages.length; i++){
        text += pages[i]
      }

      texts = text.split(' ')
      non_empty_text = []
  
      for (var i=0; i<texts.length; i++){
        if (texts[i] !== '') non_empty_text.push(texts[i])
      }
      console.log('text count: ', non_empty_text.length)
  
      text = non_empty_text.length.toString() + ' ' + text

      const params = {
        Bucket: 'reviewmystore',
        Key: `${short_store_url}/text/text_all.txt`, // File name you want to save as in S3
        Body: text
      };

      s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);

      })
    })
  })
}

exports.read_text_from_pdf = read_text_from_pdf;

const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
read_text_from_pdf('tatianatian.com', ID, SECRET_KEY);
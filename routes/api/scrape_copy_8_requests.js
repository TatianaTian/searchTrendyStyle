const express = require("express");
const router = express.Router();
const scrape = require('website-scraper');
const PuppeteerPlugin = require('./puppeteer-plugin/index');
const analyzeAll = require('../../s2functions/analyzeAll')
const analyzeAllBmk = require('../../s2functions/analyzeAllBmk')
const searchFonts = require('../../s2functions/readFont')
const parseData = require('../../s2functions/parseData')
require('dotenv').config()
const AWS = require('aws-sdk');

const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET_KEY
});


const Websites = require("../../models/Websites");


router.post("/scrape_png", async (req, res) => {
  console.log('Start to scrape a website')

  let number = Math.floor(Math.random() * 1000000).toString()
  let website_name = req.body.url.substring(8,req.body.url.length)
  let name = website_name + number

  var fonts = {}
  class MyPlugin {
    apply(registerAction) {
      registerAction('saveResource', async ({resource}) => {  
        const filename = resource.getFilename();
        const text = resource.getText();
    
        if (filename.substring(filename.length-3, ) === 'css' || filename === 'index.html'){
          fonts = searchFonts.searchFonts(text, fonts)
        }        
      });
    }
  }

  const options = {
    urls:[req.body.url],
    directory: `./websites/${name}`,
    sources: [
        {selector: 'link[rel="stylesheet"]', attr: 'href'},
        {selector: 'script', attr: 'src'}
      ],
    plugins: [ 
      new PuppeteerPlugin({
        //launchOptions: { headless: false }, /* optional */
        //scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
        //blockNavigation: true, /* optional */
      }),
      new MyPlugin() 
    ]
  };

  const skip_font = async () => {
    if (scraped === 0){

     console.log('Error with scraping, skipped font, response back')
     res.json([JSON.stringify(req.body.url)])
     var final_analysis

     if (req.body.process === 1){
      final_analysis = await analyzeAll.analyzeAllPng(req.body.url, 1)
      console.log('final_analysis: ', final_analysis)
      if (final_analysis.png_analysis){
        //res.json([JSON.stringify('done analysis')])
      } else {
        //res.json([JSON.stringify('cannot scrape')])
      }
    }}
  }

  setTimeout(skip_font, 10000);
  var scraped = 0
  scrape(options).then(async (result) => {
    scraped = 1
    console.log("1/19 Done scraping fonts, response back")
    res.json([JSON.stringify(req.body.url)])
    //console.log(fonts)

    var final_analysis
    try{
        //???1????????????????????? 1/19 + 2/19 Done uploading store_front.png??????return "true" or "false", ???return??????analysis
      if (req.body.process === 1){
        final_analysis = await analyzeAll.analyzeAllPng(req.body.url, 1)
        console.log('final_analysis: ', final_analysis)
        if (final_analysis.png_analysis){
          //res.json([JSON.stringify('done analysis')])
        } else {
          //res.json([JSON.stringify('cannot scrape')])
        }
      }

    } catch (error) {
      //res.json([JSON.stringify('cannot scrape')])
    }
   });
});


router.post("/check_process1", async (req, res) => {

    var short_store_url
    req.body.url.includes('https')? short_store_url=req.body.url.substring(8, ) : short_store_url=req.body.url.substring(7, )
    short_store_url.substring(short_store_url.length-1,) === '/'? short_store_url=short_store_url.substring(0,short_store_url.length-1) : null 

    // Using callbacks
    
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${short_store_url}/original/store_front.png`, // File name you want to download from S3
        };

    s3.headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          // Handle no object on cloud here  
          console.log(false)
          res.json([JSON.stringify(false)])
        } else {  
            console.log(true)
            res.json([JSON.stringify(true)])
          //s3.getSignedUrl('getObject', params, callback);  
        }
      });
})


router.post("/scrape_png_process2", async (req, res) => {
    console.log('Start scrape_png_process2')

    var final_analysis
    try{
      //???2??????????????????????????? png?????????png analysis.json, 
      final_analysis = await analyzeAll.analyzeAllPng(req.body.url, 2)
      console.log('final_analysis: ', final_analysis)
      if (!final_analysis.png_analysis){
        console.log('!final_analysis.png_analysis: ', !final_analysis.png_analysis)
        res.json([JSON.stringify('cannot scrape1')])
      } else {
          console.log('4/19 Done analyzing PNG')
          //final_analysis['fonts'] = fonts    

          const params_upload_analysis = {
            Bucket: BUCKET_NAME,
            Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
            Body: JSON.stringify(JSON.stringify(final_analysis))
          };
          await s3.upload(params_upload_analysis).promise()
          console.log('6/19 Done uploading PNG analysis.json')

          if (final_analysis.png_analysis && final_analysis.short_store_url){
              console.log('7/19 Check all PNG analysis are successful')
              console.log('Response back')
              res.json([JSON.stringify('done analysis')])
            }
            else {
              console.log('Check some PNG analysis failed')
              res.json([JSON.stringify('cannot scrape')])
            }
      }
    } catch (error) {
      console.log('err: ', error)
      res.json([JSON.stringify('cannot scrape2')])
    }
  });




router.post("/scrape_pdf", async (req, res) => {
  console.log('Start to analyze PDF part 1')
  var final_analysis
  try{
    
    console.log('process: ', req.body.process)
    //???3????????????pdf????????????s3???
    if (req.body.process === 3){
      final_analysis = await analyzeAll.analyzeAllPdf(req.body.url, req.body.process, 0)
      console.log('final_analysis: ', final_analysis)
      if (final_analysis.pdf_analysis){
        res.json([JSON.stringify('done analysis')])
      }
    }
    //console.log('final_analysis in scrape_pdf: ', final_analysis)
    
    //???4????????????pdf???????????? ??????s3??? return?????????????????????
    if (req.body.process === 4){
      final_analysis = await analyzeAll.analyzeAllPdf(req.body.url, req.body.process, 0)
      console.log('final_analysis: ', final_analysis)
      if (final_analysis.pdf_analysis[0]){
        //res.json([JSON.stringify('done analysis')])
        console.log("9/19 Done extracting images from PDF")
        res.json([JSON.stringify('done analysis'), final_analysis.pdf_analysis[1]])
      }
    }

    //???5???????????????score, ?????? s3, ??????pdf analysis, ?????? s3
    if (req.body.process === 5){
      final_analysis = await analyzeAll.analyzeAllPdf(req.body.url, req.body.process, req.body.num)
      console.log('final_analysis: ', final_analysis)

      if (!final_analysis.pdf_analysis){
        res.json([JSON.stringify('cannot scrape')])
      } else {
        console.log('11/19 Done analyzing PDF')

        const params_download_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
        };
        const data_analysis = await s3.getObject(params_download_analysis).promise()
        const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
        obj['pdf_analysis'] =final_analysis['pdf_analysis']
    
        const params_upload_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
          Body: JSON.stringify(JSON.stringify(obj))
        };
        await s3.upload(params_upload_analysis).promise()
  
        console.log('12/19 Done uploading PDF analysis.json')

        if (final_analysis.pdf_analysis){

          console.log('13/19 Check all PDF analysis are successful')
          console.log('Response back')
  
          res.json([JSON.stringify('done analysis'), final_analysis['num_images']])
        }
        else {
  
          console.log('Check some PNG analysis failed')
  
          res.json([JSON.stringify('cannot scrape')])
        }

      }
    }


  } catch (error) {
    console.log('err: ', error)
    res.json([JSON.stringify('cannot scrape3')])
  }
});


router.post("/scrape_pdf_p2", async (req, res) => {
  // google vision?????????????????????pdf??????text??????ibm
  console.log('Start to analyze PDF part 2')

  console.log('process: ', req.body.process)

  var short_store_url
  req.body.url.includes('https')? short_store_url=req.body.url.substring(8, ) : short_store_url=req.body.url.substring(7, )
  short_store_url.substring(short_store_url.length-1,) === '/'? short_store_url=short_store_url.substring(0,short_store_url.length-1) : null 


  if (req.body.process === 6) {
    try {
      final_analysis = await analyzeAll.analyzePdfP2(req.body.url, req.body.num, req.body.process, [], [])
      console.log('final_analysis: ', final_analysis)
      if (!final_analysis.pdf_analysis){
        res.json([JSON.stringify('cannot scrape')])
      } else {
        
        /*
        fs.writeFile(`./tmp/${short_store_url}/google_results.json`, JSON.stringify(final_analysis), function (err) {
          if (err) return console.log(err); 
          console.log('Done writing tmp file');
          res.json(JSON.stringify('done analysis'))
        });*/


        const params_download_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
        };
        const data_analysis = await s3.getObject(params_download_analysis).promise()
        const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
        obj['google_results'] = final_analysis.pdf_analysis

        const params_upload_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
          Body: JSON.stringify(JSON.stringify(obj))
        };
        await s3.upload(params_upload_analysis).promise()
        console.log('done uploading analysis.json to s3')
        res.json(JSON.stringify('done analysis'))
      }
    } catch (err) {
      res.json([JSON.stringify('cannot scrape')])
    }
  }


  if (req.body.process === 7) {
    try {
      final_analysis = await analyzeAll.analyzePdfP2(req.body.url, req.body.num, req.body.process, [], [])
      console.log('final_analysis: ', final_analysis)
      if (!final_analysis.pdf_analysis){
        res.json([JSON.stringify('cannot scrape')])
      } else {

        const params_download_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
        };
        const data_analysis = await s3.getObject(params_download_analysis).promise()
        const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
        obj['text_results'] = final_analysis.pdf_analysis['0']
        obj['text_results2'] = final_analysis.pdf_analysis['1']

        console.log("obj['text_results']: ", obj['text_results'])
        console.log("obj['text_results2']: ", obj['text_results2'])

        const params_upload_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
          Body: JSON.stringify(JSON.stringify(obj))
        };
        await s3.upload(params_upload_analysis).promise()
        console.log('done uploading analysis.json to s3')
        res.json([JSON.stringify('done analysis'),final_analysis.pdf_analysis['0'][0],final_analysis.pdf_analysis['0'][2]])
      }
    } catch (err) {
      res.json([JSON.stringify('cannot scrape')])
    }
  }



  if (req.body.process === 8) {
    console.log('req.body.text_list1: ', req.body.text_list1)
    console.log('req.body.text_list2: ', req.body.text_list2)
    try {
      final_analysis = await analyzeAll.analyzePdfP2(req.body.url, req.body.num, req.body.process, req.body.text_list1, req.body.text_list2)
      console.log('final_analysis: ', final_analysis)
      if (!final_analysis.pdf_analysis){
        res.json([JSON.stringify('cannot scrape')])
      } else {
        
        /*
        fs.writeFile(`./tmp/${short_store_url}/text_results.json`, JSON.stringify(final_analysis), function (err) {
          if (err) return console.log(err); 
          console.log('Done writing tmp file');
          res.json(JSON.stringify('done analysis'))
        });*/

        const params_download_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
        };
        const data_analysis = await s3.getObject(params_download_analysis).promise()
        const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
        obj['ibm_results'] = final_analysis.pdf_analysis

        const params_upload_analysis = {
          Bucket: BUCKET_NAME,
          Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
          Body: JSON.stringify(JSON.stringify(obj))
        };
        await s3.upload(params_upload_analysis).promise()
        console.log('done uploading analysis.json to s3')
        res.json(JSON.stringify('done analysis'))
      }
    } catch (err) {
      res.json([JSON.stringify('cannot scrape')])
    }
  }


/*

  try{

    
    final_analysis = await analyzeAll.analyzePdfP2(req.body.url, req.body.num)


    if (!final_analysis.pdf_analysis){
      res.json([JSON.stringify('cannot scrape')])
    } else {

      console.log('17/19 Done analyzing PDF part 2')

      const params_download_analysis = {
        Bucket: BUCKET_NAME,
        Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
      };
      const data_analysis = await s3.getObject(params_download_analysis).promise()
      const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))

      var original_pdf_analysis = obj['pdf_analysis']
      const new_pdf_analysis = original_pdf_analysis.concat(final_analysis['pdf_analysis']);
      obj['pdf_analysis'] = new_pdf_analysis
  
      const params_upload_analysis = {
        Bucket: BUCKET_NAME,
        Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
        Body: JSON.stringify(JSON.stringify(obj))
      };
      await s3.upload(params_upload_analysis).promise()

      console.log('18/19 Done uploading PDF part 2 analysis.json')

      //const impression_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/image_objects/1.png`})
      const impression_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${obj.short_store_url}/images/1.png`})
      //const full_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/images/1.png`})

      if (final_analysis.pdf_analysis){





        console.log('19/19 Check all PDF part 2 analysis are successful')
        console.log('Response back')

        res.json([JSON.stringify('done analysis'),obj.short_store_url, impression_url])
      }
      else { 

        console.log('Check some PNG part 2 analysis failed')

        res.json([JSON.stringify('cannot scrape')])
      }
    }
    
  } catch (error) {
    res.json([JSON.stringify('cannot scrape')])
  }*/
});


router.post("/scrape_pdf_bmk", async (req, res) => {
  console.log('Start to analyze PDF part 1')
  try{
    final_analysis = await analyzeAllBmk.analyzeAllPdf(req.body.url, req.body.image_num)

    if (!final_analysis.pdf_analysis){
      res.json([JSON.stringify('cannot scrape')])
    } else {

      console.log('11/19 Done analyzing PDF')

      const params_download_analysis = {
        Bucket: BUCKET_NAME,
        Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to download from S3
      };
      const data_analysis = await s3.getObject(params_download_analysis).promise()
      const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
      obj['pdf_analysis'] =final_analysis['pdf_analysis']
  
      const params_upload_analysis = {
        Bucket: BUCKET_NAME,
        Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
        Body: JSON.stringify(JSON.stringify(obj))
      };
      await s3.upload(params_upload_analysis).promise()

      console.log('12/19 Done uploading PDF analysis.json')

      if (final_analysis.pdf_analysis){

        console.log('13/19 Check all PDF analysis are successful')
        console.log('Response back')

        res.json([JSON.stringify('done analysis'), final_analysis['num_images']])
      }
      else {

        console.log('Check some PNG analysis failed')

        res.json([JSON.stringify('cannot scrape')])
      }
    }
  } catch (error) {
    res.json([JSON.stringify('cannot scrape')])
  }
});




router.post("/fetch_data", async (req, res) => {
  const store_url = req.body.store_url
  console.log('Start to fetch data')
  console.log(store_url)

  const data = await parseData.parseData(store_url)
  res.json(data)
});


router.post("/fetch_urls", async (req, res) => {
  const store_url = req.body.store_url
  const category = req.body.category
  console.log('Start to fetch urls')
  console.log(store_url)

  {/* ??????store????????? */}
  var short_store_url
  if (store_url.includes('https')){
      short_store_url = store_url.substring(8, )
  } else if (store_url.includes('http')){
      short_store_url = store_url.substring(7, )
  } else {
      short_store_url = store_url
  }
  if (short_store_url.substring(short_store_url.length-1,short_store_url.length) === '/'){
      short_store_url = short_store_url.substring(0, short_store_url.length-1)
  }

  const data = await parseData.parseUrls(short_store_url, category)
  //console.log('data: ', data)
  res.json(data)
});



router.post("/fetch_objects_urls", async (req, res) => {
  const store_url = req.body.store_url
  var short_store_url = ''
  store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )


  var url_dict = []
  var params = { Bucket: BUCKET_NAME, Prefix: `${short_store_url}/image_objects` };

  s3.listObjects(params, async function(err, data){
      if (err) return console.error(err);
      for (var i=0; i<data.Contents.length; i++){
          var key = data.Contents[i].Key
          const n = key.lastIndexOf("/");
          const index = key.substring(n+1, key.length-4)

          if (index !== 'store_front'){
              url_dict.push(
                {
                  image_id: index,
                  url: await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: data.Contents[i].Key})
                }
              )
          }
      }
      res.json(url_dict)
      return; 
  });
});


router.post("/fetch_images_urls", async (req, res) => {
  console.log('start to fetch_images_urls')
  const store_url = req.body.store_url
  var short_store_url = ''
  store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )

  var url_dict = []
  var params = { Bucket: BUCKET_NAME, Prefix: `${short_store_url}/images` };

  {/* ?????????????????? */}
  const params_download_json = {
    Bucket: BUCKET_NAME,
    Key: `${short_store_url}/analysis.json`, // File name you want to download from S3
  };
  const data_analysis = await s3.getObject(params_download_json).promise()
  const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
  const scores = obj.pdf_analysis[0]

  {/* ?????????????????? */}
  s3.listObjects(params, async function(err, data){
      if (err) return console.error(err);
      
      for (var i=0; i<data.Contents.length; i++){
          var key = data.Contents[i].Key
          const n = key.lastIndexOf("/");
          const index = key.substring(n+1, key.length-4)

          const image = scores.filter((img)=>img.image_id === index)
          console.log('image: ', image)
          if (image.length > 0){
            url_dict.push(
              {
                image_id: index,
                url: await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: data.Contents[i].Key}),
                aesthetic_score: image[0].aesthetic_score,
                technical_score: image[0].technical_score
              }
            )
          }
      }

      console.log('url_dict: ', url_dict)
      res.json(url_dict)
      return; 
  });
});


{/* ??????object effectiveness */}
router.post("/image_effectiveness", async (req, res) => {
    const store_url = req.body.store_url
    var short_store_url = ''
    store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )


    var params = { Bucket: BUCKET_NAME, Prefix: `${short_store_url}/image_objects` };

    s3.listObjects(params, async function(err, data){
        if (err) return console.error(err);
        res.json(data.Contents.length-1)
        return; 
    });
});

  
{/* ??????????????? */}
router.post("/fetch_keywords", async (req, res) => {
  const store_url = req.body.store_url
  var short_store_url = ''
  store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )


  console.log('Start to fetch keywords')
  console.log(short_store_url)

  const data = await parseData.parseKeywords(short_store_url)
  console.log('data: ', data)
  res.json(data)
});


{/* ?????????????????? */}
router.post("/fetch_colors", async (req, res) => {
  const store_url = req.body.store_url
  var short_store_url = ''
  store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )


  console.log('Start to fetch colors')
  console.log(short_store_url)

  const data = await parseData.parseColors(short_store_url)
  console.log('data: ', data)
  res.json(data)
});


{/* ?????????????????? text, font, image???????????? */}
router.post("/fetch_store_number", async (req, res) => {
  const store_url = req.body.store_url
  var short_store_url = ''
  store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )

  

  console.log('Start to fetch numbers')
  console.log(short_store_url)

  const data = await parseData.parseNumbers(short_store_url)
  console.log('data: ', data)
  res.json(data)
});
 

{/* ??????????????????????????????????????? */}
router.post("/fetch_tested", async (req, res) => {

    {/* ??????store????????? */}
    var short_store_url
    if (req.body.store_url.includes('https')){
        short_store_url = req.body.store_url.substring(8, )
    } else if (req.body.store_url.includes('http')){
        short_store_url = req.body.store_url.substring(7, )
    } else {
        short_store_url = req.body.store_url
    }
    if (short_store_url.substring(short_store_url.length-1,short_store_url.length) === '/'){
        short_store_url = short_store_url.substring(0, short_store_url.length-1)
    }


  console.log('start to fetch tested')
  console.log('short_store_url: ', short_store_url)

  const params_download_json = {
    Bucket: BUCKET_NAME,
    Key: `${short_store_url}/analysis.json`, // File name you want to download from S3
  };


  try {
      
      const data_analysis = await s3.getObject(params_download_json).promise()
      //console.log('true')
      res.json(true)
  }
  catch(err){
      //console.log('false')
      res.json(false)
  }
});


module.exports = router;

          // ??????drawing???????????????
          /*
          console.log('start to delete folder: ', final_analysis['short_store_url'])
          var dir = `./tmp/${final_analysis['short_store_url']}`
          
          try {
            fs.rmdirSync(dir, { recursive: true });
        
            console.log(`${dir} is deleted!`);
          } catch (err) {
              console.error(`Error while deleting ${dir}: `, err);
          }

          fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error while deleting ${dir}: `, err);
                throw err;
            }
        
            console.log(`${dir} is deleted!`);
        });*/
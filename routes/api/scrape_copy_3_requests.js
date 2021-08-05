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

     console.log('Error with scraping, skipped font')

     var final_analysis
     try{
       final_analysis = await analyzeAll.analyzeAllPng(req.body.url)
       if (!final_analysis.png_analysis){
          res.json([JSON.stringify('cannot scrape')])
       } else {
          console.log('4/19 Done analyzing PNG')
          //console.log(final_analysis)
        
          final_analysis['fonts'] = fonts      
    
          const params_upload_analysis = {
            Bucket: BUCKET_NAME,
            Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
            Body: JSON.stringify(JSON.stringify(final_analysis))
          };
          await s3.upload(params_upload_analysis).promise()
    
          console.log('5/19 Done PNG analysis.json')
          //console.log(final_analysis.pdf_analysis)
    
          if (final_analysis.png_analysis && final_analysis.fonts && final_analysis.short_store_url){

            console.log('6/19 Check all PNG analysis are successful')
            console.log('Response back')

            res.json([JSON.stringify('done analysis')])
          }
          else {

            console.log('Check some PNG analysis failed')

            res.json([JSON.stringify('cannot scrape')])
          }
       }
     } catch (error) {
       res.json([JSON.stringify('cannot scrape')])
     }

    }
  }

  setTimeout(skip_font, 10000);
  var scraped = 0
  scrape(options).then(async (result) => {
    scraped = 1
    console.log("1/19 Done scraping fonts")
    //console.log(fonts)

    var final_analysis
    try{
      final_analysis = await analyzeAll.analyzeAllPng(req.body.url)
      if (!final_analysis.png_analysis){
         res.json([JSON.stringify('cannot scrape')])
      } else {
         console.log('4/19 Done analyzing PNG')
         //console.log(final_analysis)
       
         final_analysis['fonts'] = fonts      
   
         const params_upload_analysis = {
           Bucket: BUCKET_NAME,
           Key: `${final_analysis['short_store_url']}/analysis.json`, // File name you want to save as in S3
           Body: JSON.stringify(JSON.stringify(final_analysis))
         };
         await s3.upload(params_upload_analysis).promise()
   
         console.log('6/19 Done uploading PNG analysis.json')
         
         //console.log('final_analysis.pdf_analysis')
         //console.log(final_analysis.pdf_analysis)
   
         if (final_analysis.png_analysis && final_analysis.fonts && final_analysis.short_store_url){
          
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
      res.json([JSON.stringify('cannot scrape')])
    }
   });
});


router.post("/scrape_pdf", async (req, res) => {
  console.log('Start to analyze PDF part 1')
  try{
    final_analysis = await analyzeAll.analyzeAllPdf(req.body.url)

    //console.log('final_analysis in scrape_pdf: ', final_analysis)


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




router.post("/scrape_pdf_p2", async (req, res) => {
  // google vision过每张图片，从pdf读取text并用ibm
  console.log('Start to analyze PDF part 2')
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

          // 删除drawing的临时文件
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

  {/* 修正store的格式 */}
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

  {/* 读取图片分数 */}
  const params_download_json = {
    Bucket: BUCKET_NAME,
    Key: `${short_store_url}/analysis.json`, // File name you want to download from S3
  };
  const data_analysis = await s3.getObject(params_download_json).promise()
  const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))
  const scores = obj.pdf_analysis[0]

  {/* 读取图片链接 */}
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


{/* 读取object effectiveness */}
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

  
{/* 读取关键词 */}
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


{/* 读取颜色类别 */}
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


{/* 读取用户网店 text, font, image数量信息 */}
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
 

{/* 读取用户网店是否在数据库内 */}
router.post("/fetch_tested", async (req, res) => {

    {/* 修正store的格式 */}
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


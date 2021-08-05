var distance = require('euclidean-distance')
var convert = require('color-convert');
const data = require('../functions/color_categories.json')
const data2 = require('../functions/lab_list.json')
const data3 = require('../functions/categories.json')
const data4 = require('../functions/emotions_categories.json')
const AWS = require('aws-sdk');
const urls = require('./urls.json')

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

const parseData = async function parseData(store_url) {
    console.log('arrvied parseData')
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };

    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))


    function colors_emotions(){
        // find the top 5 colors and their scores
        
        var color_array = []
        var color_list = obj.png_analysis[1]
        const returned_color_list = color_list.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 3);
        
        for (var j=0; j<3; j++){
            color_array.push(returned_color_list[j].color)
        }
        
        // find the emotions of the 3 colors
        var lab_list = []
        for (var i=0; i<returned_color_list.length; i++){
            lab = convert.hex.lab(returned_color_list[i].color); 
            lab_list.push(lab)
        }

        categories = []
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


        var emotion_array = []
        for (var j=0; j<categories.length; j++){
            var emotions_string = emotions[categories[j]]
            var emotions_list = emotions_string.split(',')
            emotion_array = emotion_array.concat(emotions_list)
        }
        return {
            colors:color_array,
            emotions:emotion_array
        }
        //[color_array, emotions_str.substring(0,emotions_str.length-1)]
    }


    //console.log(colors_emotions())

    function texts(){
        const text = obj.pdf_analysis[2]
        const text_count = obj.pdf_analysis[3]
        const text_syntax = {
            NUM: obj.pdf_analysis[6].NUM,
            PRON: obj.pdf_analysis[6].PRON,
            NOUN: obj.pdf_analysis[6].NOUN,
            ADV: obj.pdf_analysis[6].ADV,
            ADJ: obj.pdf_analysis[6].ADJ,
            VERB: obj.pdf_analysis[6].VERB,
        }
        const text_keywords = obj.pdf_analysis[7]

        var keywords = []
        if (text_keywords.length === 0){
            keywords.push('no keywords')
        } else {
            for (var i=0; i<text_keywords.length;i++){
                keywords.push(text_keywords[i].text)
            }
        }

        return {
            text:text,
            text_count:text_count,
            text_syntax:text_syntax, 
            text_keywords: keywords
        }
        //[text, text_count, text_syntax, text_keywords]
    }


    //console.log(texts())

    function fonts(){
        const fonts_list = obj.fonts
        var fonts = []
        var count = 0
        for (var font in fonts_list){
            fonts.push(font)
            count += 1
        }
        return {
            fonts:fonts,
            count:count
        }
        //[fonts, count]
    }


    function images(){
        const image_scores = obj.pdf_analysis[0]
        const image_properties = obj.pdf_analysis[1]
        var image_info = image_scores.filter(a=>a.image_id !== '1')

        for (var i=0; i<image_info.length; i++){
            const image_id = image_info[i].image_id   
           // if (image_id !== '1'){
                for (var j=0; j<image_properties.length; j++){
                    if (image_properties[j].image_id.toString() === image_id){
                        image_info[i]['labels']=image_properties[j].labels
                        image_info[i]['colors']=image_properties[j].colors

                        var objects_list = []
                        const objects = image_properties[j].objects
                        for (var k=0; k<objects.length; k++){
                            objects_list.push(objects[k].name)
                        }
                        image_info[i]['objects']=objects_list
                    }
                }
           // } 
        }
        return image_info
    }

    //console.log(images())
    


    function first_impression(){
        //text
        const first_impression_text = obj.pdf_analysis[4]
        const first_impression_text_count = obj.pdf_analysis[5]
        const first_impression_text_syntax = {
            NUM: obj.pdf_analysis[9].NUM,
            PRON: obj.pdf_analysis[9].PRON,
            NOUN: obj.pdf_analysis[9].NOUN,
            ADV: obj.pdf_analysis[9].ADV,
            ADJ: obj.pdf_analysis[9].ADJ,
            VERB: obj.pdf_analysis[9].VERB,
        }
        var keywords = []
        const first_impression_text_keywords = obj.pdf_analysis[10]
        for (var i=0; i<first_impression_text_keywords.length;i++){
            keywords.push(first_impression_text_keywords[i].text)
        }


        //images
        var image_properties_impression
        const image_properties = obj.pdf_analysis[1]
        for (var i=0; i<image_properties.length; i++){
            const image_id = image_properties[i].image_id
            if (image_id === 1){
                image_properties_impression = image_properties[i]
            }    
        }

        // find the emotions of the 5 colors
        var color_array = []
        const returned_color_list = image_properties_impression.colors.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 5);
        for (var j=0; j<5; j++){
            color_array.push(returned_color_list[j].color)
        }


        var lab_list = []
        for (var i=0; i<returned_color_list.length; i++){
            lab = convert.hex.lab(returned_color_list[i].color); 
            lab_list.push(lab)
        }

        categories = []
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
        var emotion_array = []
        for (var j=0; j<categories.length; j++){
            var emotions_string = emotions[categories[j]]
            var emotions_list = emotions_string.split(',')
            emotion_array = emotion_array.concat(emotions_list)
        }

        var image_scores_impression
        var impression_scores={}
        const image_scores = obj.pdf_analysis[0]
        for (var i=0; i<image_scores.length; i++){
            const image_id = image_scores[i].image_id
            if (image_id === '1'){
                image_scores_impression=image_scores[i]
                impression_scores['aesthetic_score'] = image_scores_impression.aesthetic_score.toFixed(2)
                impression_scores['technical_score'] = image_scores_impression.technical_score.toFixed(2);
            }    
        }

        return {
            colors:color_array,
            emotions:emotion_array,
            scores:impression_scores,
            text:first_impression_text,
            text_count:first_impression_text_count,
            text_syntax:first_impression_text_syntax,
            text_keywords:keywords,
            objects: image_properties_impression.objects
        }
    }

   const impression_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/image_objects/1.png`})
   const full_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/images/1.png`})

   var image_urls = {}
   var image_or_urls = {}
   for (var j=0; j<images().length; j++){
       var index = j+2
       image_urls[index] = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/image_objects/${index}.png`})
       image_or_urls[index] = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/images/${index}.png`})
   }


    return {
        full_colors:{ colors: first_impression().colors, emotions: first_impression().emotions},
        full_texts: texts(),
        full_fonts: fonts(),
        full_images: images(),
        first_impression: first_impression(),
        urls:{
            impression_url: impression_url,
            full_url: full_url,
            image_urls: image_urls,
            image_or_urls: image_or_urls
        },
        length: obj.pdf_analysis[12]
    }
}
 

const parseUrls = async function parseUrls(store_url, category) {
    console.log('start to fetch urls (store url, category): ', store_url, ' ', category)
    const store_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${store_url}/images/1.png`})
    const review1_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${urls[category].review1.url}/images/1.png`})
    const review2_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${urls[category].review2.url}/images/1.png`})
    const review3_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${urls[category].review3.url}/images/1.png`})
    const review4_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${urls[category].review4.url}/images/1.png`})
    const review5_image_url = await s3.getSignedUrl('getObject', {Bucket: BUCKET_NAME, Key: `${urls[category].review5.url}/images/1.png`})
    return [store_image_url, review1_image_url, review2_image_url, review3_image_url, review4_image_url, review5_image_url]
}

const parseObjectUrls = async function parseObjectsUrls(store_url) {
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

        //console.log('url_dict: ', url_dict)
        return await url_dict; 
    });
}

const parseKeywords = async function parseKeywords(store_url) {
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };
    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))


    const full_keywords = obj.pdf_analysis[7]
    const first_keywords = obj.pdf_analysis[10]
    var keywords_list = []
    var keywords_list_front = []

    for (var i=0; i<full_keywords.length; i++){
        if (!keywords_list.includes(full_keywords[i].text)){
            keywords_list.push(full_keywords[i].text)
        }
    }
    for (var j=0; j<first_keywords.length; j++){
        if (!keywords_list.includes(first_keywords[j].text)){
            keywords_list.push(first_keywords[j].text)
        }
        keywords_list_front.push(first_keywords[j].text)
    }
    return [keywords_list, keywords_list_front]
}


const parseColors = async function parseColors(store_url) {
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };

    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))

    
    var image_properties_impression
    const image_properties = obj.pdf_analysis[1]
    for (var i=0; i<image_properties.length; i++){
        const image_id = image_properties[i].image_id
        if (image_id === 1){
            image_properties_impression = image_properties[i]
        }    
    }

    
    var color_array = []
    const returned_color_list = image_properties_impression.colors.sort((a, b) => (a.score < b.score) ? 1 : -1).slice(0, 5);
    for (var j=0; j<5; j++){
        color_array.push(returned_color_list[j].color)
    }


    var lab_list = []
    for (var i=0; i<returned_color_list.length; i++){
        lab = convert.hex.lab(returned_color_list[i].color); 
        lab_list.push(lab)
    }

    console.log('lab_list: ',lab_list)

    categories = []
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
    return [categories, returned_color_list]
}


const parseNumbers = async function parseNumbers(store_url) {
    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };

    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))

    const page_length = obj.pdf_analysis[12]
    const image_number = obj.pdf_analysis[0].length - 1 
    const text_count = obj.pdf_analysis[3]
    const text_count_front = obj.pdf_analysis[5] 
    const fonts_list = obj.fonts
    var font_number = 0
    for (var font in fonts_list){
        font_number += 1
    }

    return {
        page_length,
        image_number,
        text_count,
        text_count_front,
        font_number
    }
}

exports.parseData = parseData
exports.parseUrls = parseUrls
exports.parseObjectUrls = parseObjectUrls
exports.parseKeywords = parseKeywords
exports.parseColors = parseColors
exports.parseNumbers = parseNumbers





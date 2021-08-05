
const axios = require('axios');
fs = require('fs');
PNG = require("pngjs").PNG;
const AWS = require('aws-sdk');
const useGM = require('./useGoogleVision')
const callIBM = require('./useIBM')
const PDFExtract = require('pdf.js-extract').PDFExtract;

const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
});

// amazon s3 upload file
const analyze_pdf_process3 = async (fileContent, s3Name) => {
    // Setting up S3 upload parameters
    const params_upload_original = {
        Bucket: BUCKET_NAME,
        Key: s3Name, // File name you want to save as in S3
        Body: fileContent
    };

    await s3.upload(params_upload_original).promise()

    console.log('8/19 Done uploading store_front.pdf')
    return true
};

// amazon s3 upload file
const analyze_pdf_process4 = async (short_store_url) => {
    console.log('start analyze_pdf_process4')
    try {       
        //extract images from pdf and save to s3-images
        url_images = `https://extract-images.herokuapp.com/extract?file=${short_store_url}/original/store_front.pdf&url=${short_store_url}`
        const response_images = await axios({
            url:url_images,
            method: 'GET',
        })
        //console.log('response_images: ', response_images)
        if (response_images.data.MESSAGE === 'done'){
            return [true, response_images.data.num]
        } else {
            return [false]
        }
    } catch (err){
        console.log(err)
        console.log('Error with analyzing pdf all')
        return [false]
    }
};

// 
const analyze_pdf_process5 = async (short_store_url, num) => {
    console.log('start analyze_pdf_process5')

    //calculate image scores and return in scores
    url_scores = `https://image-quality-assessment-api.herokuapp.com/prediction?folder_name=${short_store_url}/images&num=${num}`
    //console.log('image num: ', response_images.data.num)
    const response_scores = await axios({
        url:url_scores,
        method: 'GET',
    })
    var scores 
    try{
        scores = response_scores.data
        console.log("10/19 Done calculating images' scores")
    } catch {
        console.log('Error in assessing image qualities')
    }
    const analysis = [scores]
    return [analysis, num]
};



// amazon s3 upload file
const analyze_pdf_copy = async (fileContent, s3Name, short_store_url) => {
    // Setting up S3 upload parameters
    const params_upload_original = {
        Bucket: BUCKET_NAME,
        Key: s3Name, // File name you want to save as in S3
        Body: fileContent
    };

    await s3.upload(params_upload_original).promise()

    console.log('8/19 Done uploading store_front.pdf')

    const analyze_pdf_all = async () => {
        try {       
            //extract images from pdf and save to s3-images
            url_images = `https://extract-images.herokuapp.com/extract?file=${short_store_url}/original/store_front.pdf&url=${short_store_url}`
            const response_images = await axios({
                url:url_images,
                method: 'GET',
            })

            if (response_images.data.MESSAGE === 'done'){
                console.log("9/19 Done extracting images from PDF")
                //calculate image scores and return in scores
                url_scores = `https://image-quality-assessment-api.herokuapp.com/prediction?folder_name=${short_store_url}/images&num=${response_images.data.num}`
                //console.log('image num: ', response_images.data.num)
                const response_scores = await axios({
                    url:url_scores,
                    method: 'GET',
                })
                var scores 
                try{
                    scores = response_scores.data
                    console.log("10/19 Done calculating images' scores")
                } catch {
                    console.log('Error in assessing image qualities')
                }
                
                const analysis = [scores]
                return [analysis, response_images.data.num]

            } else {
                console.log('Error with extracting images from pdf')
                return null
            }
        } catch (err){
            console.log(err)
            console.log('Error with analyzing pdf all')
        }
    }
    return await analyze_pdf_all();    
};




const analyze_pdf_p2_process6 = async (short_store_url, num, process) => {
    //run google vision and save object image objects to s3-image_objects
    var google_results = []
    for (var i=0; i<num; i++){
        const index = i+1
        //console.log('index is: ', index)
        const params_download_image = {
            Bucket: BUCKET_NAME,
            Key: `${short_store_url}/images/${index}.png`, // File name you want to download from S3
        };
        const data = await s3.getObject(params_download_image).promise()
        const use_google = async () => {
            const results = await useGM.google_computer_vision(data.Body, short_store_url, index, ID, SECRET_KEY);
            google_results.push({image_id:results[3], labels: results[0], colors: results[1], objects: results[2]})
        }
        await use_google();
    }

    console.log("14/19 Done google vision analysis")
    
    return google_results

    //const analysis = [google_results, text_results[0], text_results[2], text_results[3], text_results[4], ibm_results[0][0], ibm_results[0][1], ibm_results[0][2], ibm_results[1][0], ibm_results[1][1], ibm_results[1][2], text_results[5]]
    //return analysis
}



const analyze_pdf_p2_process7 = async (short_store_url) => {
    //extract texts from pdf
    const params_download_pdf = {
        Bucket: 'reviewmystore',
        Key: `${short_store_url}/original/store_front.pdf`, // File name you want to download from S3
    };

    const data = await s3.getObject(params_download_pdf).promise()
    fs.writeFileSync('test2.pdf', data.Body);
    
    const options = {};
    const pdfExtract = new PDFExtract();

    const extract_words = async () => {
        const data = await pdfExtract.extract('test2.pdf', options)
        const num_pages = data.pages.length
        var text = ''
        var first_page_content
        var all_strings = {}

        var string_pool = []
        var string_pool2 = []
        for (var i=0; i< num_pages; i++){
            string_pool = string_pool2
            string_pool2 = []
            const contents = data.pages[i].content

            //console.log(`page ${i} content: `)
            //console.log(`string_pool: `, string_pool)

            if (i === 0){
                contents.forEach(str=>{
                    string_pool2.push(str.str)
                })
            } else {
                contents.forEach(str=>{
                    if (string_pool.includes(str.str)){
                        string_pool2.push(str.str)
                    } 
                })
            }
        }

        //console.log('final string_pool2: ', string_pool2)
        

        for (var i=0; i< num_pages; i++){
            const contents = data.pages[i].content
            contents.forEach(str=>{
                if (i === 0){
                    first_page_content += str.str
                    text += str.str
                } else {
                    if (!string_pool2.includes(str.str)){
                        text += str.str
                    }
                }
            })
        }

        var text_split = text.split(" ");
        //console.log('first_page_content: ', first_page_content)
        var first_page_text_split = first_page_content.split(" ");
        return [text, text_split, text_split.length, first_page_content, first_page_text_split.length, num_pages]
    }

    var text_results
    try{
        text_results = await extract_words()
        console.log("15/19 Done extracting texts from images")
    } catch (error){
        console.log("Error in extracting texts from images")
    }
    
    console.log("{1:[text_results[0], text_results[2], text_results[3], text_results[4]],2: text_results[5]}: ",  {1:[text_results[0], text_results[2], text_results[3], text_results[4]],2: text_results[5]})
    return {1:[text_results[0], text_results[2], text_results[3], text_results[4]],2: text_results[5]}

    //const analysis = [google_results, text_results[0], text_results[2], text_results[3], text_results[4], ibm_results[0][0], ibm_results[0][1], ibm_results[0][2], ibm_results[1][0], ibm_results[1][1], ibm_results[1][2], text_results[5]]
    //return analysis
}


const analyze_pdf_p2_process8 = async (list1, list2) => {
    //run IBM and save object image objects to s3-image_objects

    const call_ibm = async () =>{
        const results = await callIBM.callIBM(list1)
        const first_page_result = await callIBM.callIBM(list2)
        return [results, first_page_result]
    }

    var ibm_results

    try{
        ibm_results = await call_ibm();
        console.log("16/19 Done ibm analysis")
    } catch(error){
        console.log("error in analyzing ibm_results")
    }

    return [ibm_results[0][0], ibm_results[0][1], ibm_results[0][2], ibm_results[1][0], ibm_results[1][1], ibm_results[1][2]]

    //const analysis = [google_results, text_results[0], text_results[2], text_results[3], text_results[4], ibm_results[0][0], ibm_results[0][1], ibm_results[0][2], ibm_results[1][0], ibm_results[1][1], ibm_results[1][2], text_results[5]]
    //return analysis
}



const analyze_pdf_p2_copy = async (short_store_url, num, process) => {


    //run google vision and save object image objects to s3-image_objects
    var google_results = []
    for (var i=0; i<num; i++){
        const index = i+1
        //console.log('index is: ', index)
        const params_download_image = {
            Bucket: BUCKET_NAME,
            Key: `${short_store_url}/images/${index}.png`, // File name you want to download from S3
        };
        const data = await s3.getObject(params_download_image).promise()
        const use_google = async () => {
            const results = await useGM.google_computer_vision(data.Body, short_store_url, index, ID, SECRET_KEY);
            google_results.push({image_id:results[3], labels: results[0], colors: results[1], objects: results[2]})
        }
        await use_google();
    }

    console.log("14/19 Done google vision analysis")


    //extract texts from pdf
    const params_download_pdf = {
        Bucket: 'reviewmystore',
        Key: `${short_store_url}/original/store_front.pdf`, // File name you want to download from S3
    };

    const data = await s3.getObject(params_download_pdf).promise()
    fs.writeFileSync('test2.pdf', data.Body);
    
    const options = {};
    const pdfExtract = new PDFExtract();

    const extract_words = async () => {
        const data = await pdfExtract.extract('test2.pdf', options)
        const num_pages = data.pages.length
        var text = ''
        var first_page_content
        var all_strings = {}

        var string_pool = []
        var string_pool2 = []
        for (var i=0; i< num_pages; i++){
            string_pool = string_pool2
            string_pool2 = []
            const contents = data.pages[i].content

            //console.log(`page ${i} content: `)
            //console.log(`string_pool: `, string_pool)

            if (i === 0){
                contents.forEach(str=>{
                    string_pool2.push(str.str)
                })
            } else {
                contents.forEach(str=>{
                    if (string_pool.includes(str.str)){
                        string_pool2.push(str.str)
                    } 
                })
            }
        }

        //console.log('final string_pool2: ', string_pool2)
        

        for (var i=0; i< num_pages; i++){
            const contents = data.pages[i].content
            contents.forEach(str=>{
                if (i === 0){
                    first_page_content += str.str
                    text += str.str
                } else {
                    if (!string_pool2.includes(str.str)){
                        text += str.str
                    }
                }
            })
        }

        var text_split = text.split(" ");
        //console.log('first_page_content: ', first_page_content)
        var first_page_text_split = first_page_content.split(" ");
        return [text, text_split, text_split.length, first_page_content, first_page_text_split.length, num_pages]
    }
    var text_results
    try{
        text_results = await extract_words()
        console.log("15/19 Done extracting texts from images")
    } catch (error){
        console.log("Error in extracting texts from images")
    }

    //console.log('text_results: ', text_results)
    //start to analyze text with IBM
    const call_ibm = async () =>{
        const results = await callIBM.callIBM(text_results[0])
        const first_page_result = await callIBM.callIBM(text_results[3])
        return [results, first_page_result]
    }

    var ibm_results

    try{
        ibm_results = await call_ibm();
        console.log("16/19 Done ibm analysis")
    } catch(error){
        console.log("error in analyzing ibm_results")
    }

    const analysis = [google_results, text_results[0], text_results[2], text_results[3], text_results[4], ibm_results[0][0], ibm_results[0][1], ibm_results[0][2], ibm_results[1][0], ibm_results[1][1], ibm_results[1][2], text_results[5]]
    
    return analysis
}


const analyze_png = async (fileContent, s3Name) => {
   // if (process === 1)
   // {
        // Setting up S3 upload parameters
        const params_upload_original = {
            Bucket: BUCKET_NAME,
            Key: s3Name, // File name you want to save as in S3
            Body: fileContent
        };
        try {
            await s3.upload(params_upload_original).promise()
            console.log('2/19 Done uploading store_front.png')
            return true
        } catch (error) {
            return false
        }
  //  }   

    /*
    if (process === 2) {
        // analyze colors of the front page
        const gm_analyze_png = async () => {
            const params_download_original = {
                Bucket: BUCKET_NAME,
                Key: `${short_store_url}/original/store_front.png`, // File name you want to download from S3
            };
            const data = await s3.getObject(params_download_original).promise()
            console.log('data: ', data)
            var analysis
            const use_Google = async () => {
                const results = await useGM.google_computer_vision(data.Body, short_store_url, 'store_front', ID, SECRET_KEY);
                analysis = results
            }
            await use_Google();
            return analysis
        }
        try {
            console.log('3/19 Done PNG google vision analysis') 
            return await gm_analyze_png();  
        } catch (error){
            return 'Error in PNG google vision'
        }
    }*/
};


const analyze_png_process2 = async ( short_store_url) => {
    // analyze colors of the front page
    const gm_analyze_png = async () => {
        const params_download_original = {
            Bucket: BUCKET_NAME,
            Key: `${short_store_url}/original/store_front.png`, // File name you want to download from S3
        };
        const data = await s3.getObject(params_download_original).promise()
        console.log('data: ', data)
        var analysis
        const use_Google = async () => {
            const results = await useGM.google_computer_vision(data.Body, short_store_url, 'store_front', ID, SECRET_KEY);
            analysis = results
        }
        await use_Google();
        return analysis
    }
    try {
        console.log('3/19 Done PNG google vision analysis') 
        return await gm_analyze_png();  
    } catch (error){
        return 'Error in PNG google vision'
    }
};






const analyze_impression = async (fileContent, s3Name, short_store_url) => {
    // Setting up S3 upload parameters
    const params_upload_original = {
        Bucket: BUCKET_NAME,
        Key: s3Name, // File name you want to save as in S3
        Body: fileContent
    };

    await s3.upload(params_upload_original).promise()
    console.log('4/19 Done uploading first impression png (1.png)')

    // analyze colors of the front page
    const gm_analyze_png = async () => {
        const params_download_original = {
            Bucket: BUCKET_NAME,
            Key: `${short_store_url}/images/1.png`, // File name you want to download from S3
        };
        const data = await s3.getObject(params_download_original).promise()
        var analysis
        const use_Google = async () => {
            const results = await useGM.google_computer_vision(data.Body, short_store_url, '1', ID, SECRET_KEY);
            analysis = results
        }
        await use_Google();
        return analysis
    }
    try {
        console.log('5/19 Done impression google vision analysis') 
        return await gm_analyze_png();  
    }catch (error){
        return 'Error in impression google vision'
    }
};



const analyzeAllPng = async (store_url, process) => {
    var short_store_url
    store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )
    short_store_url.substring(short_store_url.length-1,) === '/'? short_store_url=short_store_url.substring(0,short_store_url.length-1) : null 

    //console.log('short url is: ', short_store_url) 

    console.log('process: ', process)
    var final_analysis = {}
    const url_to_png = async (store_url, process) => {
        //convert url to pdf and png
        //console.log('process in url_to_png: ', process)
        try {       
         
            if (process === 1){
                var url = `https://url-to-image-api.herokuapp.com/api/render?url=${store_url}&output=screenshot`
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream'
                    })    
                //console.log('response.data: ', response.data)
                const png_analysis = await analyze_png(response.data,`${short_store_url}/original/store_front.png`)
                console.log('png_analysis: ', png_analysis)
                final_analysis['png_analysis'] = png_analysis 
            }

            if (process === 2 ){
                const png_analysis = await analyze_png_process2(short_store_url)
                console.log('png_analysis: ', png_analysis)
                final_analysis['png_analysis'] = png_analysis 
            }
   
            
           
                //var url_png_1impression = `https://url-to-image-api.herokuapp.com/api/render?url=${store_url}&output=screenshot&screenshot.fullPage=false`
                //const response_impression = await axios({
                //    url: url_png_1impression,
                //    method: 'GET', 
                //    responseType: 'stream'
                //  })            
                //const impression_analysis = await analyze_impression(response_impression.data,`${short_store_url}/images/1.png`, short_store_url)
                //final_analysis['impression_analysis'] = impression_analysis
            


            } catch (err){
                console.log(err)
                console.log(' with url_to_png')
            }
    }

    await url_to_png(store_url, process);
    final_analysis['short_store_url'] = short_store_url
    return final_analysis
}


const analyzeAllPdf = async (store_url, process, num) => {
    var short_store_url
    store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )
    short_store_url.substring(short_store_url.length-1,) === '/'? short_store_url=short_store_url.substring(0,short_store_url.length-1) : null 

    //console.log('short url is: ', short_store_url) 

    var final_analysis = {}
    const url_to_pdf = async (store_url, process, num) => {
        //convert url to pdf
        try {      
            console.log('process in analyzeAllPdf: ', process) 
            
            if (process === 3){
                var url_pdf = `https://url-to-image-api.herokuapp.com/api/render?url=${store_url}`
                const response_pdf = await axios({
                    url: url_pdf,
                    method: 'GET',
                    responseType: 'stream'
                })
                final_analysis['pdf_analysis'] = await analyze_pdf_process3(response_pdf.data,`${short_store_url}/original/store_front.pdf`)
            }

            if (process === 4){
                final_analysis['pdf_analysis'] = await analyze_pdf_process4(short_store_url)
            }

            if (process === 5){
                const pdf_analysis = await analyze_pdf_process5(short_store_url, num)
                final_analysis['pdf_analysis'] = pdf_analysis[0]
                final_analysis['num_images'] = pdf_analysis[1]
            }

            //const pdf_analysis = await analyze_pdf(response_pdf.data,`${short_store_url}/original/store_front.pdf`, short_store_url, process)

            //console.log('pdf_analysis in pdf: ', pdf_analysis)

            //final_analysis['pdf_analysis'] = pdf_analysis[0]
            //final_analysis['num_images'] = pdf_analysis[1]

            } catch (err){
                console.log(err)
                console.log('Error with url_to_pdf')
            }
    }



    await url_to_pdf(store_url, process, num);
    final_analysis['short_store_url'] = short_store_url

    //console.log('final_analysis in pdf: ', final_analysis)


    //return [final_analysis, pdf_analysis[1]]
    //return {a: final_analysis, b: pdf_analysis[1]}
    return final_analysis
}


const analyzePdfP2 = async (store_url, num_images, process, text_list1, text_list2) => {
    var short_store_url
    store_url.includes('https')? short_store_url=store_url.substring(8, ) : short_store_url=store_url.substring(7, )
    short_store_url.substring(short_store_url.length-1,) === '/'? short_store_url=short_store_url.substring(0,short_store_url.length-1) : null 

    //console.log('short url is: ', short_store_url) 

    var final_analysis = {}
    console.log('process in analyzePdfP2: ', process) 

    const url_to_pdf = async () => {
        //convert url to pdf
        if (process === 6){
            try {       
                const pdf_analysis = await analyze_pdf_p2_process6(short_store_url, num_images, process)
                console.log('pdf_analysis: ', pdf_analysis)
                final_analysis['pdf_analysis'] = pdf_analysis
            } catch (err){
                console.log(err)
                console.log('Error with analyze_pdf_p2_process6')
            }
        }

        if (process === 7){
            try {       
                const pdf_analysis = await analyze_pdf_p2_process7(short_store_url)
                console.log('pdf_analysis: ', pdf_analysis)
                final_analysis['pdf_analysis'] = pdf_analysis
            } catch (err){
                console.log(err)
                console.log('Error with analyze_pdf_p2_process7')
            }
        }

        if (process === 8){
            try {       
                const pdf_analysis = await analyze_pdf_p2_process8(text_list1, text_list2)
                console.log('pdf_analysis: ', pdf_analysis)
                final_analysis['pdf_analysis'] = pdf_analysis
            } catch (err){
                console.log(err)
                console.log('Error with analyze_pdf_p2_process8')
            }
        }
        /*
        try {       
            const pdf_analysis = await analyze_pdf_p2(short_store_url, num_images, process)
            final_analysis['pdf_analysis'] = pdf_analysis
        } catch (err){
            console.log(err)
            console.log('Error with analyzePdfP2')
        }*/
    }

    await url_to_pdf();
    final_analysis['short_store_url'] = short_store_url
    return final_analysis
}




exports.analyzeAllPng = analyzeAllPng
exports.analyzeAllPdf = analyzeAllPdf
exports.analyzePdfP2 = analyzePdfP2
//analyzeAll('https://brewsandrescuescoffee.com/')
//analyzeAll('https://tatianatian.com/')


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

async function hackData(store_url, info) {

    const params_download_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to download from S3
    };
    
    const data_analysis = await s3.getObject(params_download_json).promise()
    const obj = JSON.parse(JSON.parse(data_analysis.Body.toString()))


    const delete_all = info.deleteAll
    const delete_extra = info.deleteExtra
    const change = info.change
    const change_map = info.change_map
    const add = info.add
    const image_id = info.image_id
    const objects = obj.pdf_analysis[1]

    var image_info = objects.filter(a=>a.image_id === image_id)
    var new_objects = []
    var once_objects = []

    for (var i=0; i<image_info[0].objects.length; i++){
         // delete all
        if (!delete_all.includes(image_info[0].objects[i].name)){
            //console.log('done deleting all')
             // delete extra 
             if (delete_extra.includes(image_info[0].objects[i].name) && !once_objects.includes(image_info[0].objects[i].name)){
                once_objects.push(image_info[0].objects[i].name)
                new_objects.push(image_info[0].objects[i])
             } else if (!delete_extra.includes(image_info[0].objects[i].name)){
                //console.log('done deleting extra')
                // change words
                if (change.includes(image_info[0].objects[i].name)){
                    image_info[0].objects[i].name = change_map[image_info[0].objects[i].name]
                    new_objects.push(image_info[0].objects[i])
                } else {
                    new_objects.push(image_info[0].objects[i])
                }
             }
        }
    }

    if (add){
        for (var j=0; j<add.length; j++){
            const a = {
                name: add[j], 
                score: 0 
            }
            new_objects.push(a)
        }
    }


    objects.map(a=>{
        if (a.image_id === image_id){
            a.objects = new_objects
        }
    })

    obj.pdf_analysis[1] = objects

    const params_upload_json = {
        Bucket: BUCKET_NAME,
        Key: `${store_url}/analysis.json`, // File name you want to save as in S3
        Body: JSON.stringify(JSON.stringify(obj))
    };
    await s3.upload(params_upload_json).promise()
    
    console.log('done image: ', image_id)
}


const info = [

    {
        image_id: 8,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 8,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 10,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 10,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 20,
        deleteAll:['Bagged packaged goods'],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 20,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 12,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 12,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 14,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 14,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 18,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 18,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 13,
        deleteAll:['Clothing'],
        deleteExtra: ['Person',''],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 3,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 3,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 15,
        deleteAll:[''],
        deleteExtra: ['Door','Window'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 11,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 11,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 19,
        deleteAll:[''],
        deleteExtra: ['Tableware','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 19,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 4,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 4,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 17,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food','Bowl'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 17,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 9,
        deleteAll:['Luggage & bags'],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 9,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 6,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 6,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 7,
        deleteAll:['Bottled and jarred packaged goods'],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 7,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 5,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 5,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 2,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 2,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 16,
        deleteAll:[''],
        deleteExtra: ['Packaged goods','Food','Umbrella','Building'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 16,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
    {
        image_id: 1,
        deleteAll:['Bagged packaged goods'],
        deleteExtra: ['Packaged goods','Food'],
        change:[''],
        change_map:{
            'Swimwear':'Brassiere (store product)',
        },
    },
    {
        image_id: 1,
        deleteAll:[''],
        deleteExtra: [''],
        change:['Packaged goods','Food'],
        change_map:{
            'Packaged goods':'Packaged goods (store product)',
            'Food':'Food (store product)'
        },
    },
]






const edit = async () => {
    for (var j=0; j<info.length; j++){
        await hackData('dibruno.com', info[j])
    }
}

edit() 
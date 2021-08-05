var fs = require('fs')
var gm = require('gm');
const AWS = require('aws-sdk');



function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
} 

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
 

async function google_computer_vision(imgPath, folder, num_images, ID, SECRET_KEY) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
    
    
    // Performs label detection on the image file
    const [label_result] = await client.labelDetection(imgPath);
    const labels = label_result.labelAnnotations;
    //console.log(`Labels for ${num_images}: `, labels);

    var labels_des = []
    labels.forEach(label => labels_des.push(label.description));


    // Performs image properties detection on the image file
    const [properties_result] = await client.imageProperties(imgPath);
    const colors = properties_result.imagePropertiesAnnotation.dominantColors.colors;
    var colors_score = []
    //console.log('Image properties: ');
    
    //colors.forEach(color => colors_score.push({color:color.color, score:color.score}));
    colors.forEach(color => colors_score.push({color:rgbToHex(color.color.red, color.color.green, color.color.blue), score:color.score}));
    console.log(`colors_score for ${num_images}: `, colors_score)


    //Performs objects detection on the image file, draw the top 5 objects
    const [objects_result] = await client.objectLocalization(imgPath);
    const objects = objects_result.localizedObjectAnnotations;
    var line_list = []
    var object_names = []
    objects.forEach(object => {
        object_names.push({name: object.name, score: object.score})
        //console.log(`Name: ${object.name}`);
        //console.log(`Confidence: ${object.score}`);
        const veritices = object.boundingPoly.normalizedVertices;
        veritices.forEach(v => {
            //console.log(`x: ${v.x}, y:${v.y}`);
            line_list.push([v.x,v.y]);
            }
        ); 
    });


    console.log('start to check tmp')
    if (fs.existsSync(`./tmp`)){
        console.log(`tmp exists`)
    } else {
        console.log(`tmp not exists; start to create folder: tmp}`)
        fs.mkdirSync(`./tmp`);
    }

    // 查看folder是否存在，建立folder
    //console.log('start to check sub folder')
    if (fs.existsSync(`./tmp/${folder}`)){
        //console.log(`folder ${folder} exists`)
    } else {
        //console.log(`tmp/${folder} not exists; start to create folder: tmp/${folder}`)
        fs.mkdirSync(`./tmp/${folder}`);
        //fs.makedirs(`./tmp/${folder}`)

        // 检查是否建立
        if (fs.existsSync(`./tmp/${folder}`)){
            console.log(`folder: tmp/${folder} created.`)
        } else {
            console.log(`folder: tmp/${folder} failed being created.`)
        }
    }


    //console.log('imgPath: ', imgPath)
    console.log('num_images: ', num_images)
    
    gm(imgPath)
        .size(function (err, size) {
            //console.log('size: ', size)
            //console.log('err: ', err)
        if (!err)
            var width = size.width
            var height = size.height
            var new_line_list = []
            line_list.forEach(v=>{
                new_line_list.push([v[0]*width, v[1]*height])
            })

            //console.log('object_names are: ', object_names)
            //console.log('object_names.length are: ', object_names.length)

            const num = object_names.length

            if (num > 0){            
                const indices = []
                for (var i=0; i<num*4;i++){
                    if (i < 20) indices.push(i)
                }

                if (num < 5){
                    while (indices.length<20){
                        indices.push(indices[indices.length%(num*4)])
                    }
                }

                console.log('indices are: ', indices)

                gm(imgPath)
                .stroke('#5BFF7E')
                .strokeWidth(10)
                .drawLine(new_line_list[indices[0]][0],new_line_list[indices[0]][1],new_line_list[indices[1]][0],new_line_list[indices[1]][1])
                .drawLine(new_line_list[indices[1]][0],new_line_list[indices[1]][1],new_line_list[indices[2]][0],new_line_list[indices[2]][1])
                .drawLine(new_line_list[indices[2]][0],new_line_list[indices[2]][1],new_line_list[indices[3]][0],new_line_list[indices[3]][1])
                .drawLine(new_line_list[indices[3]][0],new_line_list[indices[3]][1],new_line_list[indices[0]][0],new_line_list[indices[0]][1])
                
                .drawLine(new_line_list[indices[4]][0],new_line_list[indices[4]][1],new_line_list[indices[5]][0],new_line_list[indices[5]][1])
                .drawLine(new_line_list[indices[5]][0],new_line_list[indices[5]][1],new_line_list[indices[6]][0],new_line_list[indices[6]][1])
                .drawLine(new_line_list[indices[6]][0],new_line_list[indices[6]][1],new_line_list[indices[7]][0],new_line_list[indices[7]][1])
                .drawLine(new_line_list[indices[7]][0],new_line_list[indices[7]][1],new_line_list[indices[4]][0],new_line_list[indices[4]][1])

                .drawLine(new_line_list[indices[8]][0],new_line_list[indices[8]][1],new_line_list[indices[9]][0],new_line_list[indices[9]][1])
                .drawLine(new_line_list[indices[9]][0],new_line_list[indices[9]][1],new_line_list[indices[10]][0],new_line_list[indices[10]][1])
                .drawLine(new_line_list[indices[10]][0],new_line_list[indices[10]][1],new_line_list[indices[11]][0],new_line_list[indices[11]][1])
                .drawLine(new_line_list[indices[11]][0],new_line_list[indices[11]][1],new_line_list[indices[8]][0],new_line_list[indices[8]][1])

                .drawLine(new_line_list[indices[12]][0],new_line_list[indices[12]][1],new_line_list[indices[13]][0],new_line_list[indices[13]][1])
                .drawLine(new_line_list[indices[13]][0],new_line_list[indices[13]][1],new_line_list[indices[14]][0],new_line_list[indices[14]][1])
                .drawLine(new_line_list[indices[14]][0],new_line_list[indices[14]][1],new_line_list[indices[15]][0],new_line_list[indices[15]][1])
                .drawLine(new_line_list[indices[15]][0],new_line_list[indices[15]][1],new_line_list[indices[12]][0],new_line_list[indices[12]][1])

                .drawLine(new_line_list[indices[16]][0],new_line_list[indices[16]][1],new_line_list[indices[17]][0],new_line_list[indices[17]][1])
                .drawLine(new_line_list[indices[17]][0],new_line_list[indices[17]][1],new_line_list[indices[18]][0],new_line_list[indices[18]][1])
                .drawLine(new_line_list[indices[18]][0],new_line_list[indices[18]][1],new_line_list[indices[19]][0],new_line_list[indices[19]][1])
                .drawLine(new_line_list[indices[19]][0],new_line_list[indices[19]][1],new_line_list[indices[16]][0],new_line_list[indices[16]][1])

                .write(`./tmp/${folder}/drawing${num_images}.png`, function(err){
                    if (err) return console.log('error')

                    //console.log(`done writing drawings ${num_images}`)

                    const fileContent = fs.readFileSync(`tmp/${folder}/drawing${num_images}.png`);

                    //console.log('fileContent: ', fileContent)
                    //console.log(`done reading drawings ${num_images}`)

                    const s3 = new AWS.S3({
                        accessKeyId: ID,
                        secretAccessKey: SECRET_KEY
                    });
        
                    // Setting up S3 upload parameters
                    //console.log('13~14/19 image_num: ', num_images)
                    const params = {
                        Bucket: 'reviewmystore',
                        Key: `${folder}/image_objects/${num_images}.png`, // File name you want to download from S3
                        Body: fileContent
                    };
        
                    s3.upload(params, function(err, data) {
                        if (err) {
                            console.log('s3 upload error: ', err)
                            throw err;
                        }
                        console.log(`Done uploading image_objects: ${folder}/image_objects/${num_images}.png`);
                    })
                })

            }

        });



        return [labels_des, colors_score, object_names, num_images]
  }

  exports.google_computer_vision = google_computer_vision;



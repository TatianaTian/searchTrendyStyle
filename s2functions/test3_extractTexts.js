
const PDFExtract = require('pdf.js-extract').PDFExtract;
const options = {};

const pdfExtract = new PDFExtract();

const test = async () => {
    const data = await pdfExtract.extract('test2.pdf', options)

    const num_pages = data.pages.length
    var text = ''
    var first_page_content
    for (var i=0; i< num_pages; i++){
        const contents = data.pages[i].content
        contents.forEach(str=>{
            text += str.str
            if (i === 0){
                first_page_content = text
            }
        })
    }
    var text_split = text.split(" ");
    console.log('first_page_content: ', first_page_content)
    var first_page_text_split = first_page_content.split(" ");

    console.log(text)
    console.log(text_split)
    console.log(text_split.length)
    console.log(first_page_content)
    console.log(first_page_text_split.length)

    return [text, text_split, text_split.length, first_page_content, first_page_text_split.length]
}

test()
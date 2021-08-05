
const AWS = require('aws-sdk');
fs = require('fs');


function createAC(all_urls) {
    
    var analysisList = []
    for (var i=0; i<all_urls.length; i++){
        let analysis = fs.readFileSync('../after_json/'+all_urls[i]+'.json');
        analysisList.push(JSON.parse(JSON.parse(analysis.toString())))
    }
    var [web1, web2, web3, web4, web5, web6, web7, web8, web9, web10, web11, web12] = analysisList

    console.log('web1: ', web1.short_store_url)
    console.log('web2: ', web2.short_store_url)
    console.log('web3: ', web3.short_store_url)
    console.log('web4: ', web4.short_store_url)
    console.log('web5: ', web5.short_store_url)
    console.log('web6: ', web6.short_store_url)
    console.log('web7: ', web7.short_store_url)
    console.log('web8: ', web8.short_store_url)
    console.log('web9: ', web9.short_store_url)
    console.log('web10: ', web10.short_store_url)
    console.log('web11: ', web11.short_store_url)
    console.log('web12: ', web12.short_store_url)
}


const edit = () => {
    createAC(all_urls)
}

const all_urls = [
    'bestfriendsbysheri.com',
    'headsupfortails.com',
    'zestypaws.com',
    'roccoandroxie.com',
    'petbelong.com',
    'www.fetchingware.com.au',
    'happypetbrand.com',
    'wildone.com',
    'fablepets.com',
    'petssogood.com',
    'www.freshpawz.com',
    'www.petplay.com'
]

edit(all_urls)


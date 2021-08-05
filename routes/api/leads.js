const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const AWS = require('aws-sdk');

const ID = 'AKIAVAD25KVOWQB6CGIN'
const SECRET_KEY = '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'
const BUCKET_NAME = 'reviewmystore';


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET_KEY
});

// Load Lead model
const Lead = require("../../models/Lead");


router.post("/initialize", (req, res) => {

    console.log('arrived initialize')

    {/* 修正store的格式 */}
    var short_store_url
    if (req.body.url.includes('https')){
        short_store_url = req.body.url.substring(8, )
    } else if (req.body.url.includes('http')){
        short_store_url = req.body.url.substring(7, )
    } 
    if (short_store_url.substring(short_store_url.length-1,short_store_url.length) === '/'){
        short_store_url = short_store_url.substring(0, short_store_url.length-1)
    }

    req.body.url = short_store_url


    Lead.findOne({ url: req.body.url }).then(lead => {
        if (lead) {
            console.log('the lead exists')
            res.json('exists')

        } else {
            console.log('set up new lead')
            const newLead = new Lead({
                url: req.body.url,
                category: req.body.category,
                test: req.body.test,
                channel: req.body.channel,
                review_example: req.body.review_example,
                AS_example: req.body.AS_example,
                review_example_button: req.body.review_example_button,
                AS_example_button: req.body.AS_example_button,
                init_signup: false,
                init_go_premium: false, 
                signup_button: '0',
                go_premium_button: '0', 
                NPS_score: '0', 
                NPS_reason: 'null',
                email: 'null', 
                click_survey: false,
                click_survey_button: '0',
                crash_no:0,
                crashed_link: false,
                reached_results: false
            });

            newLead
            .save()
            .then(lead => console.log('successfully set up a new lead: ', lead))
            .catch(err => console.log('Failed setting up a new lead: ', err));

            res.json('created')
    }
  });

});


router.post("/update", async (req, res) => {
    console.log('arrived update')
    console.log('req.body: ', req.body)

    {/* 修正store的格式 */}
    var short_store_url
    if (req.body.url.includes('https')){
        short_store_url = req.body.url.substring(8, )
    } else if (req.body.url.includes('http')){
        short_store_url = req.body.url.substring(7, )
    } else {
        short_store_url = req.body.url
    }
    if (short_store_url.substring(short_store_url.length-1,short_store_url.length) === '/'){
        short_store_url = short_store_url.substring(0, short_store_url.length-1)
    }

    req.body.url = short_store_url

    let lead = await Lead.findOne({url: req.body.url})  
    if (lead) {
        console.log('found the lead')
        console.log('lead: ', lead)

        {/* 标记 crash */}
        if (req.body.item === 'crash'){
            await lead.updateOne({
                crash_no: lead.crash_no + 1,
            })
            console.log('updated lead')

            {/* 删除 s3 */}
            var params = {
                Bucket: BUCKET_NAME,
                Prefix: `${short_store_url}/`
            };
            
            s3.listObjects(params, function(err, data) {
                if (err) return console.log(err);
                //console.log('data: ', data)
                
                if (data.Contents.length === 0) console.log('no content');
                else {
                    params = {Bucket: BUCKET_NAME};
                    params.Delete = {Objects:[]};
                
                    data.Contents.forEach(function(content) {
                        params.Delete.Objects.push({Key: content.Key});
                        s3.deleteObjects(params, function(err, data) {
                            console.log('done deleting: ', content.Key)
                        })
                    });
                }
            });

            res.json('updated lead')
        }

        {/* 标记 crash link */}
        if (req.body.item === 'crash_link'){
            await lead.updateOne({
                crash_link: true,
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记 review example link */}
        if (req.body.item === 'review_example_button'){
            await lead.updateOne({
                review_example: true,
                review_example_button: lead.review_example_button + ',' + req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记 AS example link */}
        if (req.body.item === 'AS_example_button'){
            await lead.updateOne({
                AS_example: true,
                AS_example_button: lead.AS_example_button + ',' + req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记注册位置 */}
        if (req.body.item === 'signup_button'){
            await lead.updateOne({
                init_signup: true,
                signup_button: lead.signup_button + ',' + req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记付费位置 */}
        if (req.body.item === 'go_premium_button'){
            await lead.updateOne({
                init_go_premium: true,
                go_premium_button: lead.go_premium_button + ',' + req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记 nps 分数 */}
        if (req.body.item === 'NPS'){
            await lead.updateOne({
                NPS_score: req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记 nps 原因 */}
        if (req.body.item === 'NPS reason'){
            await lead.updateOne({
                NPS_reason: req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记 survey 邮箱 */}
        if (req.body.item === 'email'){
            await lead.updateOne({
                email: req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记feedback位置 */}
        if (req.body.item === 'click_survey_button'){
            await lead.updateOne({
                click_survey: true,
                click_survey_button: lead.click_survey_button + ',' + req.body.value
            })
            console.log('updated lead')
            res.json('updated lead')
        }

        {/* 标记是否进入result页面 */}
        if (req.body.item === 'reached_results'){
            await lead.updateOne({
                reached_results: true,
            })
            console.log('updated lead')
            res.json('updated lead')
        }
        
    } else {
        console.log("lead doesn't exist")
        res.json("lead doesn't exist")
    }

  
});






module.exports = router;




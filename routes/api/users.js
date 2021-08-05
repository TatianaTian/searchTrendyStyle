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


// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const WLUser = require("../../models/WLUser");
const RequestProducts = require("../../models/Request");
const LandingButton = require("../../models/LandingButton");
const StyleButton = require("../../models/StyleButton");
const MfrButton = require("../../models/MfrButton");
const StyleMatchMfr = require("../../models/StyleMatchMfr");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  console.log('arrived register')
  const { errors, isValid } = validateRegisterInput(req.body);
  console.log(errors)

  // Check validation
  if (!isValid) {
    console.log('is not valid')
    return res.status(400).json(errors);
  }

  // lowercase 
  req.body.email = req.body.email.toLowerCase()

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      console.log('email already exists')
      return res.status(400).json({ msg: "Email already exists." });
    } else {
      console.log('set up new user')

      {/* 修正store的格式 
      if (req.body.store.substring(req.body.store.length-1,req.body.store.length) === '/'){
        req.body.store = req.body.store.substring(0, req.body.store.length-1)
      }*/}

      const newUser = new User({
        storeLink: req.body.storeLink,
        store: req.body.storeName,
        email: req.body.email,
        password: req.body.password,
        collection_link: '',
        /*
        paid: req.body.paid,
        doneSurvey: req.body.doneSurvey,
        doneLabel: false,
        category: req.body.category,
        LabelResult:{
          image_id: '',
          keyword: '',
          section: '',
          style: ''
        }*/
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "Email is not found." });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        console.log("user:")
        console.log(user)
        console.log(user.paid)
        console.log(user.doneSurvey)
        const payload = {
          name: user.name,
          store: user.store,
          id: user.id,
          paid: user.paid,
          doneSurvey: user.doneSurvey,
          email: user.email,
          doneLabel: user.doneLabel,
          labelResults: user.LabelResult,
          category: user.category,
          collection_link: user.collection_link,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              //paid: 'paid',
              //doneSurvey: 'survey'
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ msg: "Password is not correct." });
      }
    });
  });
});


router.post("/waitlist", (req, res) => {
  console.log('arrived waitlist')
  console.log('req.body: ', req.body)
  WLUser.findOne({ email: req.body.email }).then(user => {
    console.log('user: ', user)
    if (!user){
      const newUser = new WLUser({
        email: req.body.email,
      });
      console.log('newUser: ', newUser)
      newUser.save()
      res.send(true)
    }
});

});

router.post("/update", async (req, res) => {
  // Form validation
  console.log('arrived update')

  let user = await User.findOne({_id: req.body.id})
  if (user) {
    //console.log('found user: ', user)

    if (req.body.doneSurvey){
      console.log('updating doneSurvey: ', req.body.doneSurvey)
      await user.updateOne({
        doneSurvey: req.body.doneSurvey,
      })
      res.json('updated user')
    } 

    {/* 标记是否完成支付 */}
    if (req.body.paid){
      await user.updateOne({
        paid: req.body.paid,
      })
      res.json('updated user')
    } 

    {/* 标记是否完成label */}
    if (req.body.doneLabel){
      await user.updateOne({
        doneLabel: req.body.doneLabel,
      })
      res.json('updated user')
    }

    {/* 记录image objects的label结果 */}
    if (req.body.image_ids){
      var newLabelResult = {
        image_id: req.body.image_ids.toString(),
        keyword: user.LabelResult.keyword,
        section: user.LabelResult.section,
        style: user.LabelResult.style
      }
      await user.updateOne({
        LabelResult: newLabelResult
      })
      res.json('updated user')
    }

    {/* 记录keywords的label结果 */}
    if (req.body.keywords_1){
      const new_keywords = {
        keywords_1: req.body.keywords_1.toString(),
        keywords_2: req.body.keywords_2.toString(),
        keywords_3: req.body.keywords_3.toString(),
      }
      const newLabelResult = {
        image_id: user.LabelResult.image_id,
        keyword: new_keywords,
        section: user.LabelResult.section,
        style: user.LabelResult.style
      }
      await user.updateOne({
        LabelResult: newLabelResult
      })
      res.json('updated user')
    }

    {/* 记录section和style的label结果 */}
    if (req.body.sections && req.body.style){
      const newLabelResult = {
        image_id: user.LabelResult.image_id,
        keyword: user.LabelResult.keyword,
        section: req.body.sections.toString(),
        style: req.body.style.toString()
      }
      await user.updateOne({
        LabelResult: newLabelResult
      })
      res.json('updated user')
    }

    {/* 更新store url和产品种类 */}
    if (req.body.store_url && req.body.category){

      {/* 修正store的格式 */}
      if (req.body.store_url.substring(req.body.store_url.length-1,req.body.store_url.length) === '/'){
        req.body.store_url = req.body.store_url.substring(0, req.body.store_url.length-1)
      }

      await user.updateOne({
        store: req.body.store_url,
        category: req.body.category,
        doneLabel: false
      })
      res.json('updated user')
    }
  }
});


//get the latest user status
router.post("/refreshData", async (req, res) => {
  console.log('arrived refreshData')

  let user = await User.findOne({_id: req.body.id})
  if (user) {
    console.log('found user')

    const payload = {
      name: user.name,
      store: user.store,
      id: user.id,
      paid: user.paid,
      doneSurvey: user.doneSurvey,
      email: user.email,
      doneLabel: user.doneLabel,
      labelResults: user.LabelResult,
      category: user.category,
      collection_link: user.collection_link
    };

    res.json(payload)
  }
});

{/* 上传request style的细节（图片，preview中选中的款） */}
router.post("/requestDetails", (req, res) => {
  const user_id = req.body.userId
  const img_key = req.body.img_key
  const more_info_product = req.body.more_info_product

  const newRequest = new RequestProducts({
    userId: user_id,
    requested_style_url: 'https://1688imgsearch.s3.amazonaws.com/search_style_images/'+img_key,
    requested_product_urls: more_info_product,
    delivered_details: false,
    detail_link: null
  })
  newRequest.save()
  res.send(true)
});

{/* 读取某一用户request历史记录 */}
router.post("/requestHistory", (req, res) => {
  console.log('arrived requestHistory')
  const user_id = req.body.userId
  console.log('user_id: ', user_id)
  RequestProducts.find({userId: user_id}, function(err, data) {
    if (!err) { 
        console.log('data: ', data);
        res.send(data)
    }
    else {
      res.send(err)
      throw err;
    }
});
});

{/* trendy styles hack tool - 上传首页按钮数据 */}
router.post("/landingPress", (req, res) => {
  console.log('enter landingPress')
  const gender = req.body.gender
  const category = req.body.category
  const style = req.body.style

  const newLandingButton = new LandingButton({
    gender,
    category,
    style
  })
  newLandingButton.save()
  res.send(true)
});

{/* trendy styles hack tool - 上传style页面按钮数据 */}
router.post("/stylePress", (req, res) => {
  console.log('enter stylePress')
  const gender = req.body.gender
  const category = req.body.category
  const style = req.body.style
  const stylePicNumber = req.body.stylePicNumber

  console.log('stylePicNumber: ', stylePicNumber)

  const newStyleButton = new StyleButton({
    gender,
    category,
    style,
    stylePicNumber
  })
  newStyleButton.save()
  res.send(true)
});

{/* trendy styles hack tool - 上传mfr页面按钮数据 */}
router.post("/mfrPress", (req, res) => {
  console.log('enter mfrPress')
  const brandName = req.body.brandName
  const email = req.body.email
  const gender = req.body.gender
  const category = req.body.category
  const style = req.body.style
  const stylePicNumber = req.body.stylePicNumber
  const mfrNumber = req.body.mfrNumber

  console.log('mfrNumber: ', mfrNumber)

  const newMfrButton = new MfrButton({
    brandName,
    email,
    gender,
    category,
    style,
    stylePicNumber,
    mfrNumber
  })
  newMfrButton.save()
  res.send(true)
});

{/* trendy styles hack tool - 手动筛选6个工厂/style，记录在数据库中 */}
router.post("/styleMatchMfr", (req, res) => {
  console.log('enter styleMatchMfr')
  console.log('req.body: ', req.body)
  
  const img_key = req.body.img_key
  const style1 = req.body.more_info_product[0]
  const style2 = req.body.more_info_product[1]
  const style3 = req.body.more_info_product[2]
  const style4 = req.body.more_info_product[3]
  const style5 = req.body.more_info_product[4]
  const style6 = req.body.more_info_product[5]

  const styleMatchMfr = new StyleMatchMfr({
    img_key,
    style1, style2, style3, style4, style5, style6
  })
  styleMatchMfr.save()
  res.send(true)
});

{/* trendy styles hack tool - 读取style->mfr数据 */}
router.post("/searchMfr", (req, res) => {
  console.log('enter searchMfr')
  console.log('req.body: ', req.body)
  const img_key = req.body.img_key

    // Find mfr by img_key
    StyleMatchMfr.findOne({ img_key }).then(mfrs => {
      // Check if user exists
      
      if (!mfrs) {
        return res.status(404).json({ msg: "style not found." });
      }
      else {res.send(mfrs)}
    });
});

module.exports = router;




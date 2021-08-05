import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch, faCheckCircle, faHourglassHalf, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import ReactGA from 'react-ga';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';

import AnalysisContext from '../context/AnalysisContext';
import { Form, Input, Icon, Segment, Grid, Card, Image, Reveal, Progress, Divider, Dropdown, TextArea  } from 'semantic-ui-react';
import { hotjar } from 'react-hotjar';
import ImageUploader from "react-images-upload";
import S3 from 'react-aws-s3';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import validator from "email-validator";



const width = window.innerWidth
const height = window.innerHeight
//var validator = require("email-validator");

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      url: "",
      loading: false,
      error_message:'',
      window: false,
      email: '',
      thankYou: false,
      emailError: '',
      selectedOption: null,
      progress: 5,
      image_num: 0,
      value: null,
      select: null,
      invitation_code: null,
      review_example: localStorage.getItem('review_example')? true : false,
      AS_example: localStorage.getItem('AS_example')? true : false,
      tested: false,
      pictures: [],
      selectedFile: null,
      email: null,
      emailMsg: null,
      selectedOption1: null,
      selectedOption2: null,
      selectedOption3: null,
    };
    this.onDrop = this.onDrop.bind(this);
  }

  static contextType = AnalysisContext;

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
    console.log("this picture file: ", pictureFiles[0])
    console.log("this picture url: ", pictureDataURLs)
    
    axios
    .get("/api/scrape/image_upload")
    .then((data)=>{
      console.log('data: ', data)

      var signedUrl = data.data;

      // upload the picture to S3
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedUrl)
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
              console.log('Image successfully uploaded to S3')
              } else {
                  console.log('Error while sending the image to S3')
              }
          }
      }
      xhr.setRequestHeader('Content-Type', 'image/jpeg')
      //xhr.send({ uri: '', type: 'image/jpeg', name: `test2.jpg`}, error => console.log('error is ',error));
      xhr.send(pictureFiles[0], error => console.log('error is ',error));
    })
  }

  fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] })
  }

  
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };  

  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`,
      state: { option1: this.state.selectedOption1, option2: this.state.selectedOption2, option3: this.state.selectedOption3}
    }) 
  }

  handleSubmit = () => {
    //检查是否选选项
    if (this.state.selectedOption2 === null || this.state.selectedOption3 === null){
      this.setState({error_message:'please select all fields'})
    }
    else {
      console.log('start to landing button')
      
      var option2String = ''
      var option3String = ''
      for (var i=0; i<this.state.selectedOption2.length;i++){
        option2String += ','+this.state.selectedOption2[i].value
      }
      for (var i=0; i<this.state.selectedOption3.length;i++){
        option3String += ','+this.state.selectedOption3[i].value
      }
      
      axios.post("/api/users/landingPress", {
        gender: 'women',
        category: option2String,
        style: option3String
      }).then((res)=>{
        if (res){
          this.handleNavigation('trendystyles')
        }
      })
      
    }
  }

  handleChange2 = (e, { value }) => this.setState({ email: value })
  

  handleEmail = (email) => {
    if (!validator.validate(email)){
      this.setState({emailMsg: "Please check the email format."})
    } else {
      axios.post("/api/users/waitlist", {
        email: email 
      }).then((res)=>{
        if (res){
          this.setState({emailMsg: "Thank you for signing up!"})
        }
      })
    }
  } 

  handleChange3 = (selected, index) => {
    console.log('selected: ', selected)
    console.log('index: ', index)
    if (index===1) this.setState({ selectedOption1:  selected})
    if (index===2) this.setState({ selectedOption2:  selected})
    if (index===3) this.setState({ selectedOption3:  selected})
    //this.setState({ index:  selected})
  };

  render() {
    const { selectedOption1, selectedOption2, selectedOption3, email } = this.state;
    ReactGA.initialize('UA-156517751-6', { debug: true });
    hotjar.initialize(2026192,6);


    console.log('selectedOption2: ', selectedOption2)
    console.log('selectedOption3: ', selectedOption3)
    

    const options2 = [
      { value: 'tops', label: '#Tops' },
      { value: 'dress', label: '#Dress' },
      { value: 'two-piece set', label: '#Two-piece Set' },
      { value: 'jumpsuits/rompers/bodysuit', label: '#Jumpsuits/rompers/bodysuit' },
      { value: 'blazer', label: '#Blazer' },
      { value: 'bottoms', label: '#Bottoms' },
      { value: 'sweaters', label: '#Sweaters' },
      { value: 'outerwear', label: '#Outerwear' },
      { value: 'costumes/accessories', label: '#Costumes/accessories' },
      { value: 'loungewear', label: '#Loungewear' },
      { value: 'activewear', label: '#Activewear' },
      { value: 'partywear', label: '#Partywear' },
      { value: 'beachwear', label: '#Beachwear' },
    ];

    const options3 = [
      { value: 'sexy', label: '#Sexy' },
      { value: 'cutout', label: '#Cutout' },
      { value: 'basics', label: '#Basics' },
      { value: 'cute', label: '#Cute' },
      { value: 'floral', label: '#Floral' },
      { value: 'chic', label: '#Chic' },
      { value: 'comfy', label: '#Comfy' },
      { value: 'edgy', label: '#Edgy' },
      { value: 'family look', label: '#Family look' },
      { value: 'seamless', label: '#Seamless' },
      { value: 'bright color', label: '#Bright color' },
      { value: 'cotton linen', label: '#Cotton linen' },
      { value: 'tie dye', label: '#Tie dye' },
      { value: 'prints', label: '#Prints' },
      { value: 'gen z', label: '#Gen Z' },
    ];

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        zIndex:999
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
    
        return { ...provided, opacity, transition };
      }
    }

    

    const main_desktop = (
      <div style={{ height: "75vh", paddingTop:50, backgroundColor:'#FEFDFD'}}>
    <div style={{ 
      backgroundImage: `url("https://1688imgsearch.s3.amazonaws.com/ins_background.png")`,
      //width:'100%',
      height:0.8*height,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundSize: "cover"
    }}>
      <div style={{
        backgroundColor:'rgba(0,0,0,0.2)',    
        width:'100%',
        height:0.8*height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        }}>
          <Grid column={3} style={{marginBottom:'-10px', zIndex: 9999}} className="center-align">
            <Grid.Row>
              <Grid.Column width={3} style={{}}/>
              <Grid.Column width={10} style={{}}>
                <h1 className="heading h1" style={{lineHeight:"1.25", color:'white'}}>Get ahead of what your customer really wants and source the right products from manufacturers in 2 weeks</h1>
                <p className="navheading" style={{color:"white", marginTop:10}}>last time update: 2021-8-2</p>
                <Grid.Row>
                  <Grid.Column width={6}/>
                  <Grid.Column width={4}>
                    <p className="navheading h3" style={{color:"white", marginTop:60}}>the most accurate fashion trends backed by big data in real time</p>
                  </Grid.Column>
                  <Grid.Column width={6}/>
                </Grid.Row>
                <Grid column={3}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={6}>
                    <Select
                      placeholder='Trendy category'
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedOption2}
                      onChange={(selected)=>this.handleChange3(selected, 2)}
                      options={options2}/>
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <Select
                      placeholder="Trendy style"
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedOption3}
                      onChange={(selected)=>this.handleChange3(selected, 3)}
                      options={options3}
                      />
                  </Grid.Column>
                </Grid>
                <Grid style={{marginTop:40}}>
                <Grid.Column width={6}/>
                <Grid.Column width={4}>
                  <div style={{color:'white', fontWeight:'bold'}}>
                    {
                      this.state.error_message?
                      this.state.error_message:
                      null
                    }
                    <br/>
                    <button
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          marginTop: "-2rem",
                          fontWeight:'bold',
                          backgroundColor:'#FFFBDB',
                          color:'#4537BB',
                          height: '50px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                          zIndex: 0
                        }}
                        className="btn waves-effect waves-light hoverable accent-3"
                        onClick={this.handleSubmit}
                    >
                        <p>Search trendy styles</p>
                    </button>
                  </div>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              <Grid.Column width={3}/>
            </Grid.Row>

          </Grid>
        </div>
    </div>


      <div style={{backgroundColor:"", paddingTop:'60px', paddingBottom:'60px'}}>
          <div className="container" >
            <Grid>
              <Grid.Row>
                <Grid.Column width={6}>
                  <p className="navheading" style={{color:"1b1b1c"}}>Menu</p>
                  <p><a href="https://products.vicgarments.com/pages/contact-us" style={{color:"#1b1b1c"}}>Contact Us</a></p>
                  <p><a href="https://products.vicgarments.com/policies/privacy-policy" style={{color:"#1b1b1c"}}>Privacy Policy</a></p>
                  <p><a href="https://products.vicgarments.com/policies/terms-of-service" style={{color:"#1b1b1c"}}>Terms of Service</a></p>
                  <p><a href="https://products.vicgarments.com/pages/faqs" style={{color:"#1b1b1c"}}>FAQs</a></p>
                  </Grid.Column>
                <Grid.Column width={5}>
                  <p className="navheading" style={{color:"1b1b1c"}}>Contact Us</p>
                  <p style={{color:"#1b1b1c"}}>+1 984 244 9682</p>
                  <p style={{color:"#1b1b1c"}}>ziqi@vicgarments.com</p>
                </Grid.Column>
                <Grid.Column width={5}>
                  <p className="navheading" style={{color:"white"}}>We Accept</p>
                  <img src={process.env.PUBLIC_URL + '/payment.png'} alt='payment' style={{width:'40%'}}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
    </div>
    )

    const main_mobile = (
      <div style={{ height: "75vh", paddingTop:50, backgroundColor:'#FEFDFD'}}>

      <div style={{ 
        backgroundImage: `url("https://1688imgsearch.s3.amazonaws.com/ins_background.png")`,
        width:'100%',
        height:0.6*height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover"
      }}>
        <div style={{
          backgroundColor:'rgba(0,0,0,0.2)',    
          width:'100%',
          height:0.6*height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          }}>

          <Grid column={3} className="center-align" style={{marginBottom:'-10px', zIndex:0}}>
            <Grid.Row>
              <Grid.Column width={1} style={{}}/>
              <Grid.Column width={14} style={{}}>
                <h1 className="heading h1" style={{lineHeight:"1.25", color:'white'}}>Get ahead of what your customer really wants and source the right products from manufacturers in 2 weeks</h1>
                <p className="navheading" style={{color:"white", marginTop:10}}>last time update: 2021-8-2</p>

              </Grid.Column>
              <Grid.Column width={1}/>
            </Grid.Row>

          </Grid>
        </div>
      </div>

              <div className="center-align" style={{zIndex:1}}>
                <Grid column={3} style={{zIndex:9999}}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={12}>
                    <p className="navheading h3" style={{color:"#0e0c1d", marginTop:0}}>The most accurate fashion trends backed by big data in real time</p>
                    <Select
                      placeholder='Trendy category'
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedOption2}
                      onChange={(selected)=>this.handleChange3(selected, 2)}
                      options={options2}/>
                    <br/>
                    <Select
                      placeholder="Trendy style"
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={selectedOption3}
                      onChange={(selected)=>this.handleChange3(selected, 3)}
                      options={options3}
                      styles={customStyles}
                      />
                      
                  </Grid.Column>
                  <Grid.Column width={2}/>
                </Grid>
                <div style={{marginTop:'20px'}}>
                  <button
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          //marginTop: "1rem",
                          fontWeight:'bold',
                          backgroundColor:'#533eb5',
                          color:'white',
                          height: '50px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                          //marginRight:'8px'
                          zIndex: 0
                        }}
                        className="btn waves-effect waves-light hoverable accent-3"
                        onClick={this.handleSubmit}
                    >
                        <p>Search trendy styles</p>
                    </button>
                  </div>
                </div>
              
      <div style={{paddingTop:'60px', paddingBottom:'60px'}}>
          <div className="container" >
            <Grid>
              <Grid.Row>
                <Grid.Column width={5} style={{paddingLeft:'25px'}}>
                  <p className="navheading" style={{color:"white"}}>Menu</p>
                  <p><a href="https://products.vicgarments.com/pages/contact-us" style={{color:"#CCD4D2"}}>Contact Us</a></p>
                  <p><a href="https://products.vicgarments.com/policies/privacy-policy" style={{color:"#CCD4D2"}}>Privacy Policy</a></p>
                  <p><a href="https://products.vicgarments.com/policies/terms-of-service" style={{color:"#CCD4D2"}}>Terms of Service</a></p>
                  <p><a href="https://products.vicgarments.com/pages/faqs" style={{color:"#CCD4D2"}}>FAQs</a></p>
                  </Grid.Column>
                <Grid.Column width={5}>
                  <p className="navheading" style={{color:"white"}}>Contact Us</p>
                  <p style={{color:"#CCD4D2"}}>+1 984 244 9682</p>
                  <p style={{color:"#CCD4D2"}}>ziqi@vicgarments.com</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <p className="navheading" style={{color:"white"}}>We Accept</p>
                  <img src={process.env.PUBLIC_URL + '/payment.png'} alt='payment' style={{width:'80%'}}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
   
    </div>
    )


    const main_content =  (
      <div style={{ marginTop:-50, backgroundColor:'#FEFDFD'}}>
        <div className="desktop-only">
          {main_desktop}
        </div>
        <div className="mobile-only">
          {main_mobile}
        </div>
      </div>
    )

    return <>
    {main_content}
    </>
  
  }
}

export default Landing;


/*

      <ImageUploader
        withIcon={true}
        buttonText="Choose image"
        onChange={this.onDrop}
        imgExtension={[".jpg", ".png"]}
        maxFileSize={5242880}
        withPreview={true}
          
      />



      <div style={{paddingBottom:40, backgroundColor:'#EFEEE9'}}>
        <div className="row container" > 
          <div className="col m4 s12" style={{marginLeft:0}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c", backgroundColor:'#EFEEE9'}}>
              <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/1.png'} className='image_feature_icon' alt='test'/> Pick the styles you are willing to pool</p>
              <p style={{color:'#4B4B4B'}}>Go through our style book and pick the style(s) you want to pool. Estimate your order quantity to help us determine if a style can successfully be pooled!</p>
            </div>
          </div>
        
         <div className="col m4 s12" style={{marginLeft: 0}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c", backgroundColor:'#EFEEE9'}}>
            <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/2.png'} className='image_feature_icon' alt='strategy_list'/> Receive a sample before making bulk order decisions  </p>
            <p style={{color:'#4B4B4B'}}>We will start making samples if enough brands are interested in a style. You can chime in during the fabric and color decision if you are interested, but we will make the final decision.  </p>
            </div>
          </div>

          <div className="col m4 s12" style={{marginLeft: 0}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c", backgroundColor:'#EFEEE9'}}>
            <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/3.png'} className='image_feature_icon' alt='strategy_list'/> Commit your bulk order quantity</p>
            <p style={{color:'#4B4B4B'}}>Once you receive your sample, we expect you to place an order with a desired quantity. We will start manufacturing as soon as brands place orders.  </p>
            </div>
          </div>
        </div>
      
        <div className="row container" > 
          <div className="col m4 s12" style={{marginLeft:0}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c", backgroundColor:'#EFEEE9'}}>
              <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/4.png'} className='image_feature_icon' alt='test'/> Send us your logo and hang tag design</p>
              <p style={{color:'#4B4B4B'}}>We will customize the style by adding your logo and hang tag if you want. Send us the design and let us know how you want them to be made!  </p>
            </div>
          </div>
        
         <div className="col m4 s12" style={{marginLeft: 0}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c", backgroundColor:'#EFEEE9'}}>
            <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/5.png'} className='image_feature_icon' alt='strategy_list'/> Receive your bulk order </p>
            <p style={{color:'#4B4B4B'}}>We will take care of everything from now on and you can divert your focus on your customer and marketing and let us deal with the logistics! </p>
            </div>
          </div>

        </div>      
      </div>


    */
import React, { Component } from "react";
import {Button, Form } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faQuestionCircle, faSadTear, faSmile, faAngry, faMehRollingEyes, faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import AnalysisContext from '../context/AnalysisContext';
//import 'semantic-ui-css/semantic.min.css'
import { Icon, Step } from 'semantic-ui-react'

var store_url
class Comparison extends Component {
  constructor(props) {
    super();
    this.state = {
        //signedIn: props.location.state,
        signedIn: localStorage.getItem('signedIn'),
        first_impression: null,
        full_colors: null,
        full_fonts: null,
        full_texts: null,
        full_images: null,
        urls: {}
    };
  }

  

  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    console.log(store_url)
    console.log('start to request data')
    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        this.setState({
            first_impression: res.data.first_impression,
            full_colors: res.data.full_colors,
            full_fonts: res.data.full_fonts,
            full_texts: res.data.full_texts,
            full_images: res.data.full_images,
            urls: res.data.urls
        })
    })
  }

  static contextType = AnalysisContext;

  render() {

    //console.log(this.state.full_images)


    const onChange = e => {
        this.setState({ url: e.target.value });
    };
      
    const onEmailChange = e => {
      this.setState({ email: e.target.value });
    };


    const listColor = (list) =>{
        const color_list = list.map((color) =>
        <>
        <span style={{
        display: "inline-block",  
        backgroundColor:color,
        borderRadius:"15px",
        marginLeft: "15px",
        borderColor:'red'
        }} className="color_block">
        <div style={{textAlign:"center", color:"#404040"}} className="color_text">{color}</div></span>
        </>
        );
        return color_list
    }

    const listArray = (list, color) => {
        const styled_list = list.map((emotion) =>
            <span style={{
            display: "inline-block", 
            borderRadius: "5px",
            backgroundColor: color,
            paddingLeft:'15px',
            paddingRight:'15px',
            paddingTop: '5px',
            paddingBottom: '5px',
            fontSize:'15px',
            fontFamily:'monospace',
            marginTop:'5px',
            marginRight:'10px'
            }}>
                {emotion}
            </span>
            );
        return styled_list
    }
    
   //const colors1 = ['#FBFAFA','#CACBCD','#282A70','#EE6850','#F4B3A9']
   var listItems, listEmotions, im_aes_score, im_tec_score, im_text, im_text_count, listKeywords, full_listItems, full_listEmotions, full_listKeywords, fu_text, fu_text_count, fu_fonts, fu_fonts_count, full_listFonts

   if (this.state.first_impression !== null){
        const im_colors = this.state.first_impression.colors
        listItems = listColor(im_colors)

        const emotions = this.state.first_impression.emotions
        listEmotions = listArray(emotions, '#f5faf6')

        im_aes_score = this.state.first_impression.scores.aesthetic_score
        im_tec_score = this.state.first_impression.scores.technical_score
        im_text = this.state.first_impression.text
        im_text_count = this.state.first_impression.text_count

        //console.log('first impression')
        //console.log(this.state.first_impression.text_keywords)
        const keywords = this.state.first_impression.text_keywords
        listKeywords = listArray(keywords, '#f5faf6')
   }

   if (this.state.full_colors !== null){
        const fu_colors = this.state.full_colors.colors
        full_listItems = listColor(fu_colors)

        const fu_emotions = this.state.full_colors.emotions
        full_listEmotions = listArray(fu_emotions, '#f5faf6')
    }

    if (this.state.full_fonts !== null){
        fu_fonts = this.state.full_fonts.fonts
        full_listFonts = listArray(fu_fonts, '#f5faf6')
        fu_fonts_count = this.state.full_fonts.count
    }

    var num, pron, noun, adv, adj, verb, syntaxFonts1
    if (this.state.full_texts !== null){
        fu_text = this.state.full_texts.text
        fu_text_count = this.state.full_texts.text_count

        const full_keywords = this.state.full_texts.text_keywords
        full_listKeywords = listArray(full_keywords, '#f5faf6')

        const full_syntax = this.state.full_texts.text_syntax
        num = full_syntax.NUM
        pron = full_syntax.PRON
        noun = full_syntax.NOUN
        adv = full_syntax.ADV
        adj = full_syntax.ADJ 
        verb = full_syntax.VERB

        const syntax = [`Adv: ${adv} words`, `Adj: ${adj} words`, `Noun: ${noun} words`, `Verb: ${verb} words`, `Number: ${num} words`, `Pronoun: ${pron} words`]
        syntaxFonts1 = listArray(syntax, '#f5faf6')
    }

    var image_card_list
    var image_card_num = null
    if (this.state.full_images !== null && this.state.urls !== null){
        image_card_num = this.state.full_images.length
        const listImages = this.state.full_images 
        //console.log(listImages)
        image_card_list = listImages.map(image=>{
            //console.log('image.labels')
            
            var labels = null
            if (image.labels !== undefined){
                labels = listArray(image.labels, '#f5faf6')
                //console.log(labels)
            }
            
            var objects = null
            if (image.objects !== undefined){
                objects = listArray(image.objects, '#f5faf6')
            }

            return (
                <div className='row image-card'>
                <div className="col m6">
                    <p>original image</p>
                    <img 
                        src={this.state.urls.image_or_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    <p>image with outlined objects</p>
                    {image.objects.length>0?
                        <img 
                        src={this.state.urls.image_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    :
                        <img 
                        src={this.state.urls.image_or_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    }
                </div>
                <div className="col m6" style={{textAlign:'left'}}>
                    <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                    {image.aesthetic_score.toFixed(2)} / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                    <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                    {image.technical_score.toFixed(2)} / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                    <p className='navheading'>How customers understand this image after a quick look: </p>{labels}
                    <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{objects}
                </div>
            </div>)
        })
        //return image_card_list
    }



    const colors2 = ['#2E3732','#4A5352','#E3AC98','#CE9682','#E7C668']
    const listItems2 = listColor(colors2)


    const label1 = ['Person']
    const listLabel1 = listArray(label1, '#f5faf6')

    const objects1 = ['body', 'feet']
    const listObjects1 = listArray(objects1, '#f5faf6')

    const fonts = ['Times', 'Open Sans']
    const listFonts1 = listArray(fonts, '#f5faf6')


    const emotions2 = ['Neutral', 'cleanliness', 'happy', 'energetic', 'excitement']
    const listEmotions2 = listArray(emotions2, '#f4e7be')

    const keywords2 = ['Tatiana Tian', 'entrepreneur', 'enthusiast']
    const listKeywords2 = listArray(keywords2, '#f4e7be')

    const label2 = ['Person']
    const listLabel2 = listArray(label2, '#f4e7be')

    const objects2 = ['body', 'feet']
    const listObjects2 = listArray(objects2, '#f4e7be')

    const fonts2 = ['Open Sans']
    const listFonts2 = listArray(fonts2, '#f4e7be')

    const syntax2 = ['Adv: 10 words', 'Adj: 10 words', 'Noun: 5 words', 'Verb: 5 words']
    const syntaxFonts2 = listArray(syntax2, '#f4e7be')

    console.log('signedIn: ', this.state.signedIn)


    return (
        <>
        <div className="container">  
        
            {this.state.signedIn === 'true' || this.state.signedIn === true ?
                <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                dashboard
                </Link>
            :
            <Link to="/results" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to
            dashboard
          </Link>
            }


            {/* flow chart */}
            <div className="row">

            <Step.Group size='mini' widths={6}>
                <Step href='/comparison'>
                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                <Step.Content>
                    <Step.Title><b>First impression</b></Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/images'>
                <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                <Step.Content>
                    <Step.Title>Images</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/colors'>
                <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                <Step.Content>
                    <Step.Title>Colors</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/texts'>
                <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                <Step.Content>
                    <Step.Title>Texts</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/typographies'>
                <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                <Step.Content>
                    <Step.Title>Typographies</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/strategies'>
                <Icon name='info' />
                <Step.Content>
                    <Step.Title>Actionable Strategies</Step.Title>
                </Step.Content>
                </Step>
            </Step.Group>

            </div>




            <div className="row">
                <div className="col m6 s12">
                    <p className="center"><b>{store_url}</b></p>
                    <div className="result-card" style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%'}}>
                        <h5 className='heading center'><span className="highlight">First impression</span></h5>
                        <div className="center">
                        <img 
                            src={this.state.urls.impression_url}
                            width="80%" style={{paddingBottom:'10px'}} alt='example1'/>
                        </div>
                        
                        <p className='navheading'>The first impression colors perceived by customers:</p>
                        {listItems}

                        <p className='navheading'>Customers' emotions triggered by the colors:</p>
                        {listEmotions}
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of the first impression:</p>
                        <p>{im_aes_score} / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p> 
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of the first impression:</p>
                        <p>{im_tec_score} / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p>
                        <p className='navheading'>Text in the first screen contents:</p>
                        <p>{im_text_count} words</p>
                            {im_text}
                        <p className='navheading'>Key words that customers would notice by glimpsing the text:</p>
                        {listKeywords}

                        <h5 className='heading center'><span className="highlight">Images</span></h5>
                        <p className='subheading'>Total number of images: {image_card_num}</p>

                        {image_card_list}

                        <h5 className='heading center'><span className="highlight">Colors</span></h5>
                        <p className='navheading'>homepage colors perceived by customers:</p>
                        {full_listItems}
                        <p className='navheading'>Customers' emotions triggered by homepage colors:</p>
                        {full_listEmotions}

                        <h5 className='heading center'><span className="highlight">Texts</span></h5>
                        <p className='navheading'>All text in the homepage:</p> 
                        {fu_text}
                        <p className='navheading'>Total count of words:</p> {fu_text_count}
                        <p className='navheading'>Keywords that customers could notice after glimpsing:</p>
                        {full_listKeywords}
                        <p className='navheading'>Emotions that customers could read from the texts:</p>
                        <FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/> sadness
                        &nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                        &nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear
                        <p className='navheading'>Syntax: </p>
                        <p>It's used to tweak how to write effective store introduction and product description.</p>
                        {syntaxFonts1}

                        <h5 className='heading center'><span className="highlight">Typographies</span></h5>
                        <p className='navheading'>What typographies are used:</p> 
                        {full_listFonts}
                        <p className='navheading'>Count of typographies:</p>{fu_fonts_count}

                        <h5 className='heading center'><span className="highlight">Actionable Strategies</span></h5>
                        <p className='subheading'>                
                        We benchmarked your store to 20 successful online stores in your category. 
                        Haloy found what <span style={{textDecoration:'underline'}}>{store_url}</span> is missing and recommended a list of actionable strategies. 
                        Check out our example below!</p> 
                        <div className="center">
                        <Button 
                        variant="outline-light" 
                        size="sm" 
                        style={{backgroundColor:'#cfe5d5', color:'#1b1b1c'}}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/strategy_example"
                              })
                        }}
                        >Example</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button 
                            variant="outline-light" 
                            size="sm" 
                            style={{backgroundColor:'#1b1b1c', color:'white'}}
                            onClick={()=> {
                                this.props.history.push({
                                    pathname: "/strategy"
                                  })
                            }}
                            >Check strategies</Button>
                        </div>
                        
                    </div>
                </div>


                <div className="col m6 s12">
                <p className="center"><b>https://www.anthropologie.com/</b></p>
                <div className="result-card" style={{paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%'}}>
                        <h5 className='heading center'><span className="highlight">First impression</span></h5>
                        <div className="center">
                        <img 
                            src={process.env.PUBLIC_URL + '/example4.png'}
                            width="100%" style={{paddingBottom:'10px'}} alt='example1'/>
                        </div>
                        
                        <p className='navheading'>The first impression colors perceived by customers:</p>
                        {listItems2}

                        <p className='navheading'>Customers' emotions triggered by the colors:</p>
                        {listEmotions2}
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of the first impression:</p>
                        <p>6.28 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p> 
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of the first impression:</p>
                        <p>6.63 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p>
                        <p className='navheading'>Text in the first screen contents:</p>
                        <p>36 words</p>
                        shop dresses Discover free-form shapes, high-bohemian touches, and pastoral prints.shop new arrivalsAs the seasonal sunlight works its alchemy, nature commands our attention (and piques our creativity).shop the collectionshop skirtsshop jacketsMug for the Camera!
                        <p className='navheading'>Key words that customers would notice by glimpsing the text:</p>
                        {listKeywords2}

                        <h5 className='heading center'><span className="highlight">Images</span></h5>
                        <p className='subheading'>Total number of images: 9</p>

                        <div className='row image-card'>
                            <div className="col m6">
                                <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/4.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/4.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                5.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/6.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/6.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                6.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/7.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/7.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                6.20 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.14 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/8.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/8.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                6.02 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                5.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/9.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/9.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/10.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/10.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.98 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                5.88 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/11.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/11.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/12.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/12.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                            <p>original image</p>
                                <img src={process.env.PUBLIC_URL + '/13.jpeg'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                                <p>image with outlined objects</p>
                                <img 
                                    src={process.env.PUBLIC_URL + '/13.png'}
                                    width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel2}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects2}
                            </div>
                        </div>



                        <h5 className='heading center'><span className="highlight">Colors</span></h5>
                        <p className='navheading'>homepage colors perceived by customers:</p>
                        {listItems2}
                        <p className='navheading'>Customers' emotions triggered by homepage colors:</p>
                        {listEmotions2}

                        <h5 className='heading center'><span className="highlight">Texts</span></h5>
                        <p className='navheading'>All text in the homepage:</p> 
                        shop dressesDiscover free-form shapes, high-bohemian touches, and pastoral prints.shop new arrivalsAs the seasonal sunlight works its alchemy, nature commands our attention (and piques our creativity).shop the collectionshop skirtsshop jacketsMug for the Camera!There’s a reason that these insta-classic cups get so many likes.shop kitchen & diningLove LettersOur favorite necklaces are better together.shop jewelrySweater WeatherCozy up in layers of every stripe.shop pullovers, cardigans & moreAbout UsOur mission at Anthropologie has always been to surprise and delight you with unexpected, distinctive finds foryour closet and home. We source and craft all of our products with care, ensuring that any treasure you find atAnthropologie is unique, just like you. Explore our dress shop to find styles and fits perfect for any occasion, fromc...Read MoreHome StretchWe’re leaning into fitness and wellness, sans studio.shop activewearInspired by this home's sweeping structure, we curated gorgeous, graceful rooms that segue seamlessly asyou explore.More to ExploreThe 2020 Holiday Gi\\u0000 GuideCome back often: We’re adding new must-haves to our holiday gift guide every week!GlamThe fastake the full house tourshop home: new arrivalsget giftingshop theSign Up For Anthropologie EmailsPlus, hear about the latest and greatest from our family of brands!BHLDN WeddingsTerrain GardensEmail Address**SUBMITBy signing up, you will receive Anthropologie offers, promotions and other commercial messages. You are also agreeing toAnthropologie’s Privacy Policy. You may unsubscribe at any time.Store LocatorGet EmailHelpAbout UsServicesConnectDownload on the App StorePinterestInstagramFacebookTwitterUS|France|Germany|UKPrivacy Policy |Terms of Use |CA Transparency |Recall Notice |Accessibility |URBN.com |For CA Residents 2020 URBN.com. All Rights Reserved.
                        <p className='navheading'>Total count of words:</p> 241
                        <p className='navheading'>Keywords that customers could notice after glimpsing:</p>
                        {listKeywords2}
                        <p className='navheading'>Emotions that customers could read from the texts:</p>
                        <FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/> sadness
                        &nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                        &nbsp;&nbsp;&nbsp;
                        <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear
                        <p className='navheading'>Syntax: </p>
                        <p>It's used to tweak how to write effective store introduction and product description.</p>
                        {syntaxFonts2}

                        <h5 className='heading center'><span className="highlight">Typographies</span></h5>
                        <p className='navheading'>What typographies are used:</p> 
                        {listFonts2}
                        <p className='navheading'>Count of typographies:</p>1                       
                        
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col m4">
                </div>
                <div className="col m4 center" >
                    <p style={{fontWeight:'bold'}}><FontAwesomeIcon icon={faPaperPlane} style={{color:'#1b1b1c'}}/> &nbsp; <span className="prompt highlight">Send the report</span> <span className="prompt"> to my email address</span></p>
                    <span style={{color:'grey'}}>The link in the email will be valid for <span className="highlight" style={{fontWeight:'bold'}}>7 days</span>.<br/> 
                    <span>
                    <button
              style={{
                //width: "150px",
                //borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="waves-light white accent-3"
            >
              Signup
            </button>
                    </span> to save the review in your account <span className="highlight" style={{fontWeight:'bold'}}>forever</span>.</span>
                    <div className="row">
                        <form>
                            <div className="input-field col s12" >
                            <input
                                value={this.state.email}
                                id="url"
                                type="email"
                                />
                                <label>Email address </label>
                            </div>
                        </form> 
                        <br/>
                        <Button 
                        variant="outline-light" 
                        size="sm" 
                        >Send to inbox</Button>
                    </div>
                </div>
                <div className="col m4">
                </div>
            </div>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
        </>
    )

  }
}

export default Comparison;




/*

                        <h5 className='heading center'><span className="highlight">Full homepage</span></h5>
                        <div className="center">
                        <img 
                            src={this.state.urls.full_url}
                            width="80%" style={{paddingBottom:'10px'}} alt='example1'/>
                        </div>

                        */
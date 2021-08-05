import React, { Component } from "react";
import {Button, Form } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faQuestionCircle, faSadTear, faSmile, faAngry, faMehRollingEyes, faFrownOpen, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { updateUser } from "../../actions/authActions";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon, Step, Divider, Grid, Segment, Card } from 'semantic-ui-react'

var store_url
class Survey extends Component {
  constructor() {
    super();
    this.state = {
        select1: 0,
        select2: 0,
        //doneSurvey: localStorage.getItem('doneSurvey'),
        doneSurvey: false,
        signedIn: localStorage.getItem('signedIn'),
        store_url: null,
        email: ''
    };
  }

  static contextType = SigninContext;

  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    console.log('store_url inside: ', store_url)
    this.setState({store_url})
    window.scrollTo(0, 0)

    if (this.state.doneSurvey=== 'true' || this.state.doneSurvey=== true){
        this.props.history.push({
            pathname: "/overview"
          })
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  

  render() {

    console.log('this.state.email: ', this.state.email)

    
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
    
    const colors1 = ['#FBFAFA','#CACBCD','#282A70','#EE6850','#F4B3A9']
    const listItems = listColor(colors1)

    const colors2 = ['#F39E91','#D0BC9E','#E29181','#E29181','#EEECE6']
    const listItems2 = listColor(colors2)
    
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

    const emotions = ['Neutral', 'cleanliness', 'happy', 'energetic', 'excitement']
    const listEmotions = listArray(emotions, '#f5faf6')

    const keywords = ['Tatiana Tian', 'entrepreneur', 'enthusiast']
    const listKeywords = listArray(keywords, '#f5faf6')

    const label1 = ['Person']
    const listLabel1 = listArray(label1, '#f5faf6')

    const objects1 = ['body', 'feet']
    const listObjects1 = listArray(objects1, '#f5faf6')

    const fonts = ['Times', 'Open Sans']
    const listFonts1 = listArray(fonts, '#f5faf6')

    const syntax = ['Adv: 10 words', 'Adj: 10 words', 'Noun: 5 words', 'Verb: 5 words']
    const syntaxFonts1 = listArray(syntax, '#f5faf6')

    const emotions2 = ['Neutral', 'cleanliness', 'happy', 'energetic', 'excitement']
    const listEmotions2 = listArray(emotions2, '#f4e7be')

    const keywords2 = ['Tatiana Tian', 'entrepreneur', 'enthusiast']
    const listKeywords2 = listArray(keywords2, '#f4e7be')

    const label2 = ['Person']
    const listLabel2 = listArray(label2, '#f4e7be')

    const objects2 = ['body', 'feet']
    const listObjects2 = listArray(objects2, '#f4e7be')

    const fonts2 = ['Times', 'Open Sans']
    const listFonts2 = listArray(fonts2, '#f4e7be')

    const syntax2 = ['Adv: 10 words', 'Adj: 10 words', 'Noun: 5 words', 'Verb: 5 words']
    const syntaxFonts2 = listArray(syntax2, '#f4e7be')


    /*
    const comparison = (
        <div className="container">  
            {this.state.signedIn?
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

            <div className="row">
                <div className="col m6 s12">
                <p className="center"><b>https://www.haloy.co/</b></p>
                    <div className="result-card" style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%'}}>
                        <h5 className='heading center'><span className="highlight">First impression</span></h5>
                        <div className="center">
                        <img src={process.env.PUBLIC_URL + '/example1.png'} width="80%" style={{paddingBottom:'10px'}} alt='example1'/>
                        </div>
                        
                        <p className='navheading'>The first impression colors perceived by customers:</p>
                        {listItems}

                        <p className='navheading'>Customers' emotions triggered by the colors:</p>
                        {listEmotions}
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of the first impression:</p>
                        <p>5.28 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p> 
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of the first impression:</p>
                        <p>5.63 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p>
                        <p className='navheading'>Text in the first screen contents:</p>
                        <p>30 words</p>
                        Hi there! I'm Tatiana Tian A product-focused software engineer and serial entrepreneur An enthusiast who turns coffee to code, code to products Check out some of my projects Thanks for visiting  
                        <p className='navheading'>Key words that customers would notice by glimpsing the text:</p>
                        {listKeywords}

                        <h5 className='heading center'><span className="highlight">Images</span></h5>
                        <p className='subheading'>Total number of images: 3</p>

                        <div className='row image-card'>
                            <div className="col m6">
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel1}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects1}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel1}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects1}
                            </div>
                        </div>

                        <div className='row image-card'>
                            <div className="col m6">
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                            </div>
                            <div className="col m6" style={{textAlign:'left'}}>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of this image:</p>
                                4.52 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of this image:</p>
                                6.25 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a>
                                <p className='navheading'>How customers understand this image after a quick look: </p>{listLabel1}
                                <p className='navheading'>Objects that customers could observe by glimpsing this image: </p>{listObjects1}
                            </div>
                        </div>

                        <h5 className='heading center'><span className="highlight">Colors</span></h5>
                        <p className='navheading'>homepage colors perceived by customers:</p>
                        {listItems}
                        <p className='navheading'>Customers' emotions triggered by homepage colors:</p>
                        {listEmotions}

                        <h5 className='heading center'><span className="highlight">Texts</span></h5>
                        <p className='navheading'>All text in the homepage:</p> 
                        Hi there! I'm Tatiana Tian A product-focused software engineer and serial entrepreneur An enthusiast who turns coffee to code, code to products Check out some of my projects Thanks for visiting 
                        <p className='navheading'>Total count of words:</p> 30
                        <p className='navheading'>Keywords that customers could notice after glimpsing:</p>
                        {listKeywords}
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
                        {listFonts1}
                        <p className='navheading'>Count of typographies:</p>2

                        <h5 className='heading center'><span className="highlight">Actionable Strategies</span></h5>
                        <p className='subheading'>                
                        We benchmarked your store to 20 successful online stores in your category. 
                        Haloy found what <span style={{textDecoration:'underline'}}>www.haloy.co</span> is missing and recommended a list of actionable strategies. 
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
                <p className="center"><b>https://shopthecurated.net/</b></p>
                <div className="result-card" style={{paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%'}}>
                        <h5 className='heading center'><span className="highlight">First impression</span></h5>
                        <div className="center">
                        <img src={process.env.PUBLIC_URL + '/example4.png'} width="80%" style={{paddingBottom:'10px'}} alt='example4'/>
                        </div>
                        
                        <p className='navheading'>The first impression colors perceived by customers:</p>
                        {listItems2}

                        <p className='navheading'>Customers' emotions triggered by the colors:</p>
                        {listEmotions2}
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Aesthetic score</a> of the first impression:</p>
                        <p>5.28 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p> 
                        <p className='navheading'><a href="http://localhost:3000/term" target="_blank">Technical score</a> of the first impression:</p>
                        <p>5.63 / 10 <a href="http://localhost:3000/term" target="_blank"><FontAwesomeIcon icon={faQuestionCircle} style={{color:'#ababab'}}/></a></p>
                        <p className='navheading'>Text in the first screen contents:</p>
                        <p>30 words</p>
                        Hi there! I'm Tatiana Tian A product-focused software engineer and serial entrepreneur An enthusiast who turns coffee to code, code to products Check out some of my projects Thanks for visiting  
                        <p className='navheading'>Key words that customers would notice by glimpsing the text:</p>
                        {listKeywords2}

                        <h5 className='heading center'><span className="highlight">Images</span></h5>
                        <p className='subheading'>Total number of images: 3</p>

                        <div className='row image-card'>
                            <div className="col m6">
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
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
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
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
                                <img src={process.env.PUBLIC_URL + '/image_example1.png'} width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
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
                        Hi there! I'm Tatiana Tian A product-focused software engineer and serial entrepreneur An enthusiast who turns coffee to code, code to products Check out some of my projects Thanks for visiting 
                        <p className='navheading'>Total count of words:</p> 30
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
                        <p className='navheading'>Count of typographies:</p>2
                        
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
        )*/

/*
    const survey = (
        
  <div className ="container row">

        
        <div className="col m8 s12 survey-card" style={{paddingLeft:'25px', paddingRight:'25px', paddingTop: '25px'}}>
        <p className="prompt" style={{fontWeight:'bold'}}>Comparison between <span className="highlight">www.haloy.co</span> and <span className="highlight">www.anthropologie.com</span> is 3 questions away! 
        </p>
            <form>
                <p>Where do you get suggestions on how to improve <span style={{textDecoration:'underline'}}>www.haloy.co</span>?</p>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <p>Haloy will thoroughly analyze your store and benchmark it to the most successful stores in your 
                    category. We aim to be the most effective and affordable choice to improve the conversion rate of <span style={{textDecoration:'underline'}}>www.haloy.co</span>. 
                    Would you like to try our new tools when they are launched?</p>

                    <div className="row" style={{paddingLeft:'20px'}}>
                    <span onClick={() => this.setState({select1:1})}>
                        {this.state.select1 === 1? <FontAwesomeIcon icon={faCircle} style={{color:'#26A69A'}}/> : <FontAwesomeIcon icon={faCircle} style={{color:'#ababab'}}/> }
                        &nbsp;&nbsp;Yes
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span onClick={() => this.setState({select1:2})}>
                        {this.state.select1 === 2? <FontAwesomeIcon icon={faCircle} style={{color:'#26A69A'}}/> : <FontAwesomeIcon icon={faCircle} style={{color:'#ababab'}}/> }
                        &nbsp;&nbsp;No
                    </span>
                    </div>

                    <input type="email" value={this.state.value} onChange={this.handleChange}/>
                    <label>Email address </label>
                    
                    
                <p>Will you recommend this tool to your e-commerce friends?</p>
                    <div className="row" style={{paddingLeft:'20px'}}>
                    <span onClick={() => this.setState({select2:1})}>
                        {this.state.select2 === 1? <FontAwesomeIcon icon={faCircle} style={{color:'#26A69A'}}/> : <FontAwesomeIcon icon={faCircle} style={{color:'#ababab'}}/> }
                        &nbsp;&nbsp;Yes
                    </span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span onClick={() => this.setState({select2:2})}>
                        {this.state.select2 === 2? <FontAwesomeIcon icon={faCircle} style={{color:'#26A69A'}}/> : <FontAwesomeIcon icon={faCircle} style={{color:'#ababab'}}/> }
                        &nbsp;&nbsp;No
                    </span>
                    </div>
        </form>
        <div className="center">
        <SigninContext.Consumer>
            {({ signin, pay, survey, setValue }) => (
            <Button 
            variant="outline-light" 
            size="sm" 
            style={{marginTop:'20px'}}
            onClick={()=> {
                setValue(signin, pay, true)
                this.setState({doneSurvey:true})

                const updateUser = {
                    id: localStorage.getItem('id'),
                    doneSurvey: true 
                  };
              
                this.props.updateUser(updateUser, this.props.history);
                localStorage.setItem('doneSurvey', 'true')

            }}
            >Go to Review 2</Button>
            )}</SigninContext.Consumer>


                 <p><span className="highlight">Thank you very much!</span></p>
            </div>
        </div>

        </div>
        
    )*/

    const survey2 = (
        <div className="container row">
            <div className="desktop-only">
                <Card style={{width:'50%', marginLeft:'25%', marginTop:150}}>
                    <div className="col m12 s12">
                        <div className="" style={{backgroundColor:'#f0f7f2', paddingTop: '25px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', marginTop:10, marginBottom:10}}>
                            {
                                this.state.onEmailList
                                ? <>
                                <h3 className='heading center'><span className="highlight">Thank you for joining on our list!</span></h3>
                                <p className='subheading center' style={{color:'grey'}}>We will let you know as soon as new features are launched.</p>
                                </>
                                :<>
                                    <h3 className='heading center'><FontAwesomeIcon icon={faPaperPlane} style={{color:'#1b1b1c'}}/>&nbsp;&nbsp;&nbsp;<span className="highlight">Be the First to Know Our New Tools!</span></h3>
                                    <p className='subheading' style={{color:'grey'}}>                
                                    We aim to be the most effective and affordable choice to improve the conversion rate of <span style={{textDecoration:'underline'}}>{this.state.store_url}</span>. We review stores, make actionable suggestions, and A/B test each element 
                                    to find the storefront that convert the best! Would you like to try our new tools when they are beta launched?
                                    </p> 
                                    <div className="center">
                                    &nbsp;&nbsp;&nbsp;
                                    <form>
                                        <div className="input-field col s12" >
                                            <input
                                                value={this.state.email}
                                                id="email"
                                                type="email"
                                                onChange={this.onChange}
                                                />
                                                <label>Email address </label>
                                        </div>
                                    </form> 
                                    <Button 
                                        variant="outline-light" 
                                        size="sm" 
                                        style={{backgroundColor:'#1b1b1c', color:'white'}}
                                        onClick={()=> { 

                                            axios.post("/api/users/waitlist",{email: this.state.email})
                                            axios.post("/api/leads/update", {
                                                url: store_url,
                                                item: 'email',
                                                value: this.state.email
                                            })
                                            localStorage.setItem('doneSurvey', true)
                                            this.props.history.push("/overview")
                                        }}
                                    >Go to Review 2
                                    </Button>

                                    <button
                                        style={{
                                        borderRadius: "3px",
                                        letterSpacing: "1px",
                                        marginTop: "1rem",
                                        borderWidth:'0px',
                                        backgroundColor:'white',
                                        marginBottom: '30px',
                                        marginLeft:'50px',
                                        backgroundColor:'#f0f7f2'
                                        }}
                                        onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/overview"
                                        })
                                    }}
                                    >
                                        Cancel
                                    </button>

                                    </div>
                                </>
                            }
                            <br/>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mobile-only">
                <Card style={{width:'95%', marginLeft:'2.5%', marginTop:20}}>
                    <div className="col m12 s12">
                        <div className="" style={{backgroundColor:'#f0f7f2', paddingTop: '25px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', marginTop:10, marginBottom:10}}>
                            {
                                this.state.onEmailList
                                ? <>
                                <h3 className='heading center'><span className="highlight">Thank you for joining on our list!</span></h3>
                                <p className='subheading center' style={{color:'grey'}}>We will let you know as soon as new features are launched.</p>
                                </>
                                :<>
                                    <h3 className='heading center'><FontAwesomeIcon icon={faPaperPlane} style={{color:'#1b1b1c'}}/>&nbsp;&nbsp;&nbsp;<span className="highlight">Be the First to Know Our New Tools!</span></h3>
                                    <p className='subheading' style={{color:'grey'}}>                
                                    We aim to be the most effective and affordable choice to improve the conversion rate of <span style={{textDecoration:'underline'}}>{this.state.store_url}</span>. We review stores, recommend actionable suggestions, and A/B test each element 
                                    to find the storefront that converts the best! Would you like to try our new tools when they are beta launched?
                                    </p> 
                                    <div className="center">
                                    &nbsp;&nbsp;&nbsp;
                                    <form>
                                        <div className="input-field col s12" >
                                            <input
                                                value={this.state.email}
                                                id="email"
                                                type="email"
                                                onChange={this.onChange}
                                                />
                                                <label>Email address </label>
                                        </div>
                                    </form> 
                                    <Button 
                                        variant="outline-light" 
                                        size="mini" 
                                        style={{backgroundColor:'#1b1b1c', color:'white'}}
                                        onClick={()=> {

                                            axios.post("/api/leads/update", {
                                                url: store_url,
                                                item: 'email',
                                                value: this.state.email
                                            })
                                            localStorage.setItem('doneSurvey', true)
                                            this.props.history.push("/overview")
                                        }}
                                    >Go to Review 2
                                    </Button>
                                    <br/>
                                    <button
                                        style={{
                                        borderRadius: "3px",
                                        letterSpacing: "1px",
                                        marginTop: "20px",
                                        borderWidth:'0px',
                                        backgroundColor:'white',
                                        margin: '10px',
                                        marginLeft:'0px',
                                        backgroundColor:'#f0f7f2'
                                        }}
                                        onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/overview"
                                        })
                                    }}
                                    >
                                        Not interested
                                    </button>

                                    </div>
                                </>
                            }
                            <br/>
                        </div>
                    </div>
                </Card>
            </div>
    </div>
    )


    console.log('get storage doneSurvey: ', this.state.doneSurvey)
    console.log('doneSurvey: ', this.state.doneSurvey==='true')
    //console.log('localStorage doneSurvey: ', localStorage.getItem('doneSurvey'))

    console.log('store_url: ', this.state.store_url)
    if (!this.state.store_url) {
        return null
    }
    
    return  <div className="">
            {survey2}
        </div>

  }
}



//export default Survey;

Survey.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  
  export default connect(
    mapStateToProps,
    { updateUser }
  )(withRouter(Survey));
  


  /*




        ((this.state.doneSurvey=== 'true' || this.state.doneSurvey=== true) ? 
        comparison
    :
    <>
    <div className="survey">
     {survey}
    </div>
    <div className="overlay">
        {comparison}
    </div>
    </>) 

    */
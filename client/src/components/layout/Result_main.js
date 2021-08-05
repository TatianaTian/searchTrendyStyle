import React, { Component, useContext } from "react";
import { CarouselProvider, Image, Slide, Slider } from "pure-react-carousel";
import { Button, Carousel} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faHeart } from '@fortawesome/free-solid-svg-icons';
import Scroll from 'react-scroll';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_signup_free from './Result_signup_free';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment, Card, Rating, Menu, Form, TextArea, Button as Button2, Accordion } from 'semantic-ui-react';
import CustomCardSlide from "../innerComponents/CustomCardSlide";
import CustomDotGroup from "../innerComponents/CustomDotGroup";
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import urls from '../../data/urls.json';




const ScrollLink = Scroll.Link
const width = window.innerWidth
 
var store_url
var product_category
//const temp_store = 'petssogood.com'
//const temp_cat = 'Animals & Pet Supplies'
class Result_main extends React.Component  { 
    constructor(props) {
        super();
        console.log('props in result main: ', props)
        this.state = {
            store_url: props.store_url,
            history: props.history,
            product_category: props.product_category,
            image_urls: null,
            activeIndex:0,
            contactUs: false,
            activeItem:0,
            sendFeedback: false,
            nps_reason:'',
            render: 0,
        };
    }
 
    componentDidMount = async () =>{
      //store_url = localStorage.getItem('store_url');
      store_url = this.state.store_url
      if (!this.state.store_url){
        store_url = localStorage.getItem('store_url');
      }
      //store_url = temp_store
      //localStorage.setItem('store_url', temp_store)

      //product_category = localStorage.getItem('product_category');
      //product_category = temp_cat
      product_category = this.state.product_category
      if (!this.state.product_category){
        product_category = localStorage.getItem('product_category');
      }

      console.log('after componentDidMount, store_url: ', store_url)
      console.log('after componentDidMount, product_category: ', product_category)
      //localStorage.setItem('product_category', this.state.product_category)

      this.setState({render: this.state.render+1})
      console.log('render: ', this.state.render)

      localStorage.setItem('review_num', '')
      await AsyncLocalStorage.setItem('PromptSignIn', false)

      //console.log('store_url: ', this.state.store_url)
  
      // fetch image urls 
      axios
      .post("/api/scrape/fetch_urls", {store_url: store_url, category: product_category })
      .then(res=>{
        this.setState({image_urls: res.data, store_url})
      })
    }

    handleClick = (e, titleProps) => {
      const { index } = titleProps
      const { activeIndex } = this.state
      //const activeIndex = this.state.activeIndex
      const newIndex = activeIndex === index ? -1 : index
  
      this.setState({ activeIndex: newIndex })
    }

    handleItemClick = (e, { name }) =>{
      this.setState({ activeItem: name })

      console.log('name: ', name)

      axios.post("/api/leads/update", {
        url: store_url,
        item: 'NPS',
        value: name
      })

    } 

    handleExample = () => {
      axios.post("/api/leads/update", {
        url: store_url,
        item: 'AS_example_button',
        value: '5'
      })
    }

    
  render() {
    console.log("this.state.images_urls: ", this.state.image_urls)
    console.log('product_category in render: ', this.state.product_category)
    console.log('in render, store_url: ', store_url)
    console.log('in render, product_category: ', product_category)
    console.log('in render this.state.product_category: ', this.state.product_category)

    
    if (!this.state.image_urls || !product_category){
      return null
    }

    

    const sign_up = (
        <>
        <Button 
        variant="outline-light" 
        size="sm" 
        style={{backgroundColor:'#1b1b1c'}}
        onClick={()=> {
          
          this.props.history.push({
            pathname: "/promptFreeSignup",
          })
      }}
        >
        Sign up
        </Button>
        </>
      )

    return (
        <>
        <div className="container center">  
            <div style={{textAlign:'left', marginLeft:25, marginBottom: 30, marginTop: 30}}>
            <h4 className="prompt"><FontAwesomeIcon icon={faSearch} style={{color:'#80e98f'}}/>  Store reviews for <span className="heading highlight" >{this.state.store_url}</span> is ready!
              Get started with the <span className='heading highlight'>Free</span> reviews.
              </h4>
            </div>
            
            {/* desktop屏幕的免费专区 */}
            <div className="row free_square desktop-only" style={{borderRadius:5}} >
              <Segment.Group>
                <Segment >
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s6" style={{marginLeft:-10}}>
                    <h2 className='heading'>Free</h2>
                    </div>
                  </span>
                  <div style={{color: '#696969'}}>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive 2 reviews about store colors, images, text, and typographies</span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Save the reviews after signup</span>
                  </div>
                  </div>
                </Segment>

                {/* Reviews 指导 */}
                <Segment style={{overflow: 'auto', maxHeight: 500}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                      <div className="col s12" style={{marginLeft:-10}}>
                        <h3 className='heading'>How to read the reviews</h3>
                      </div>
                    </span>
                    <div className="row">
                          <div className="col m7">
                        <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                            <Accordion.Title
                            active={this.state.activeIndex === 0}
                            index={0}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Intro
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 0}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                              We reviewed the first impression, images, colors, texts, and typographies of your store and compared these elements against those of the most successful e-commerce stores in the <b>{product_category}</b> product category. <b>Each review contains the comparison to a different store.</b> Here is how we suggest to read the reviews:
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 1}
                            index={1}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 1: Read Review 1
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 1}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            This review compared <u><b>{store_url}</b></u> against <u><b>{urls[product_category].review1.url}</b></u> in first impression, images, colors, texts, and typographies. Pay attention to how <u><b>{store_url}</b></u> is different from <u><b>{urls[product_category].review1.url}</b></u> in these aspects, especially the part that <u><b>{store_url}</b></u> underperformed.
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 2}
                            index={2}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 2: Read Review 2
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 2}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            This review compared <u><b>{store_url}</b></u> against <u><b>{urls[product_category].review2.url}</b></u> in first impression, images, colors, texts, and typographies. Pay attention to how <u><b>{store_url}</b></u> is different from <u><b>{urls[product_category].review2.url}</b></u> in these aspects, especially the part that <u><b>{store_url}</b></u> underperformed.
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 3}
                            index={3}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 3: Find what <u>{this.state.store_url}</u> is missing
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 3}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            Both <u><b>{urls[product_category].review1.url}</b></u> and <u><b>{urls[product_category].review2.url}</b></u> are hand-picked good e-commerce stores in the <b>{product_category}</b> product category. Look into what <u><b>{urls[product_category].review1.url}</b></u> and <u><b>{urls[product_category].review2.url}</b></u> are in common in images, colors,  texts, typographies and the first impression, check what <u><b>{store_url}</b></u> is missing, and improve <u><b>{store_url}</b></u>!
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 4}
                            index={4}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 4: Further steps
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 4}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            Hope you have extracted some actionable strategies by yourself from step 3! We also prepared a full list of actionable strategies on how to improve <u><b>{store_url}</b></u>. We compared your store against 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate strategies to improve your store. Check out our Premium account!
                            </p>
                            </Accordion.Content>
                        </Accordion>
                        </div>
                        <div className="col m5" style={{alignSelf:"center"}}>
                        <img src={this.state.image_urls[0]} className="round_image" alt='round' style={{width:'100%', height:"auto", borderRadius:10}}/>
                        </div>
                    </div>
                  </div>
                </Segment>

                {/* Reviews */}
                <Segment placeholder style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                    <div className="col s12" style={{marginLeft:-10}}>
                      <h3 className='heading'>Reviews</h3>
                      </div>
                    </span>
                    </div>
               
                  <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5, marginTop:10}}>
                        <br/>
                        <p className="prompt">Review 1</p>
                        <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review1.url}</span></p>
                        <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#009688'}}
                          onClick={()=> {
                              //await AsyncLocalStorage.setItem('review_store', 'atto-digital.com')
                              localStorage.setItem('review_store', urls[product_category].review1.url)
                              localStorage.setItem('review_number', 1)
                              this.state.history.push({
                                  pathname: "/overview",
                                })
                          }}
                          >Read</Button>
                        <p></p>
                        <img src={this.state.image_urls[1]} width="100%" style={{paddingBottom:'10px'}} alt='example6'/>  
                        </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5, marginTop:10}}>
                          <br/>
                          <p className="prompt">Review 2</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review2.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#009688'}}
                          onClick={()=> {
                              localStorage.setItem('review_store', urls[product_category].review2.url)
                              localStorage.setItem('review_number', 2)
                              this.state.history.push({
                                  pathname: "/survey"
                                })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[2]} width="100%" style={{paddingBottom:'10px'}} alt='example4'/>  
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <p style={{marginTop:0, textAlign:'left'}}>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSct-dX2cC2noEpovcECOxu5MGGNCtvkNnIPHbwQz_KOVgFmqw/viewform?usp=sf_link"
                      target="_blank"
                      style={{fontSize:12, marginLeft:10, color:''}}>Cannot see the store reviews?</a>
                    </p>
                </Segment>

                {/* NPS 反馈 */}
                <Segment>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s12" style={{marginLeft:-10}}>
                    <h3 className='heading'>How likely would you be to <span className="highlight">recommend</span> the automated review tool to an e-commerce <span className="highlight">friend</span>?</h3>
                    </div>
                  </span>

                  <Menu pagination style={{marginTop:15}}>
                    <Menu.Item
                      name='1'
                      active={this.state.activeItem === '1'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='2'
                      active={this.state.activeItem === '2'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='3'
                      active={this.state.activeItem === '3'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='4'
                      active={this.state.activeItem === '4'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='5'
                      active={this.state.activeItem === '5'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='6'
                      active={this.state.activeItem === '6'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='7'
                      active={this.state.activeItem === '7'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='8'
                      active={this.state.activeItem === '8'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='9'
                      active={this.state.activeItem === '9'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='10'
                      active={this.state.activeItem === '10'}
                      onClick={this.handleItemClick}
                    />
                  </Menu>
                  <br/>
                  { parseInt(this.state.activeItem) < 6 && parseInt(this.state.activeItem) > 0 ?
                      <>
                        <Form style={{marginTop:10}}>
                          <TextArea 
                              placeholder='We try to be as helpful as we can. Could you please tell us why you are hesitant to recommend the review tool to your friend?'
                              onChange={(f,data)=>{this.setState({nps_reason: data.value})}}
                               />
                        </Form>
                      
                        <Button2 basic color='teal' style={{marginTop:10}} size='small' content='SEND' 
                        onClick={()=>{

                          axios.post("/api/leads/update", {
                            url: store_url,
                            item: 'NPS reason',
                            value: this.state.nps_reason
                          })

                          this.setState({sendFeedback: true})
                        }} />
                        &nbsp;&nbsp;&nbsp;
                        {
                          this.state.sendFeedback ? <span style={{color: '#04B5AE'}}>Thank you!</span> : null
                        }
                      </>
                    :
                    null
                  }
                  </div>
                </Segment>

                {/* 注册保存 */}
                <Segment>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s6" style={{marginLeft:-10}}>
                    <h3 className='heading'>How to save the reviews</h3>
                    </div>
                  </span>
                  <div style={{color: '#696969'}}>
                    <p>Start an account with us! You can always find your reviews in the dashboard.</p>
                  </div>
                  <br/>
                  {sign_up}
                  </div>
                </Segment>
              </Segment.Group>
              </div>




              {/* mobile屏幕免费专区 */}
              <div className="row free_square mobile-only" style={{borderRadius:5, width:"100%"}} >
                <img src={this.state.image_urls[0]} alt='round' style={{width: "100%", height:'auto', borderRadius:10}}/>
               
              <Segment.Group>
                <Segment >
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s12" style={{marginLeft:-10}}>
                    <h2 className='heading'>Free</h2>
                    </div>
                  </span>
                  <div style={{color: '#696969'}}>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp; Receive 2 reviews about store colors, images, text, and typographies</span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp; Save the reviews after signup</span>
                  </div>
                  </div>
                </Segment>

                {/* Reviews 指导 */}
                <Segment style={{overflow: 'auto', maxHeight: 500}}>
                  <div style={{textAlign:"left", marginLeft: 0}}>
                    <span className="row" >
                      <div className="col s12" style={{marginLeft:0}}>
                        <h3 className='heading'>How to read the reviews</h3>
                      </div>
                    </span>
              
                        <Accordion styled style={{width:'120%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                            <Accordion.Title
                            active={this.state.activeIndex === 0}
                            index={0}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Intro
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 0}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            We reviewed the first impression, images, colors, texts, and typographies of your store and compared these elements against those of the most successful e-commerce stores in the <b>{product_category}</b> product category. <b>Each review contains the comparison to a different store.</b> Here is how we suggest to read the reviews:
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 1}
                            index={1}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 1: Read Review 1
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 1}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            This review compared <u><b>{store_url}</b></u> against <u><b>{urls[product_category].review1.url}</b></u> in first impression, images, colors, texts, and typographies. Pay attention to how <u><b>{store_url}</b></u> is different from <u><b>{urls[product_category].review1.url}</b></u> in these aspects, especially the part that <u><b>{store_url}</b></u> underperformed.
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 2}
                            index={2}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 2: Read Review 2
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 2}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            This review compared <u><b>{store_url}</b></u> against <u><b>{urls[product_category].review2.url}</b></u> in first impression, images, colors, texts, and typographies. Pay attention to how <u><b>{store_url}</b></u> is different from <u><b>{urls[product_category].review2.url}</b></u> in these aspects, especially the part that <u><b>{store_url}</b></u> underperformed.
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 3}
                            index={3}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 3: Find what <u>{this.state.store_url}</u> is missing
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 3}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            Both <u><b>{urls[product_category].review1.url}</b></u> and <u><b>{urls[product_category].review2.url}</b></u> are hand-picked good e-commerce stores in the <b>{product_category}</b> product category. Look into what <u><b>{urls[product_category].review1.url}</b></u> and <u><b>{urls[product_category].review2.url}</b></u> are in common in images, colors,  texts, typographies and the first impression, check what <u><b>{store_url}</b></u> is missing, and improve <u><b>{store_url}</b></u>!
                            </p>
                            </Accordion.Content>

                            <Accordion.Title
                            active={this.state.activeIndex === 4}
                            index={4}
                            onClick={this.handleClick}
                            >
                            <Icon name='dropdown' />
                            Step 4: Further steps
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex === 4}>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%'}}>
                            Hope you have extracted some actionable strategies by yourself from step 3! We also prepared a full list of actionable strategies on how to improve <u><b>{store_url}</b></u>. We compared your store against 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate strategies to improve your store. Check out our Premium account!
                            </p>
                            </Accordion.Content>
                        </Accordion>
         
                  </div>
                </Segment>

                {/* Reviews */}
                <Segment placeholder style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                    <div className="col s12" style={{marginLeft:-10}}>
                      <h3 className='heading'>Reviews</h3>
                      </div>
                    </span>
                    </div>
               
                  <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5, marginTop:10}}>
                        <br/>
                        <p className="prompt">Review 1</p>
                        <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review1.url}</span></p>
                        <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#009688'}}
                          onClick={()=> {
                              //await AsyncLocalStorage.setItem('review_store', 'atto-digital.com')
                              localStorage.setItem('review_store', urls[product_category].review1.url)
                              localStorage.setItem('review_number', 1)
                              this.state.history.push({
                                  pathname: "/overview",
                                })
                          }}
                          >Read</Button>
                        <p></p>
                        <img src={this.state.image_urls[1]} width="100%" style={{paddingBottom:'10px'}} alt='example6'/>  
                        </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5, marginTop:10}}>
                          <br/>
                          <p className="prompt">Review 2</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review2.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#009688'}}
                          onClick={()=> {
                              localStorage.setItem('review_store', urls[product_category].review2.url)
                              localStorage.setItem('review_number', 2)
                              this.state.history.push({
                                  pathname: "/survey"
                                })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[2]} width="100%" style={{paddingBottom:'10px'}} alt='example4'/>  
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  <p style={{marginTop:0, textAlign:'left'}}>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSct-dX2cC2noEpovcECOxu5MGGNCtvkNnIPHbwQz_KOVgFmqw/viewform?usp=sf_link"
                      target="_blank"
                      style={{fontSize:12, marginLeft:10, color:''}}>Cannot see the store reviews?</a>
                    </p>
                </Segment>

                {/* NPS 反馈 */}
                <Segment>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s12" style={{marginLeft:-10}}>
                    <h3 className='heading'>How likely would you be to <span className="highlight">recommend</span> the automated review tool to an e-commerce <span className="highlight">friend</span>?</h3>
                    </div>
                  </span>

                  <Menu compact style={{marginTop:15}}>
                    <Menu.Item
                      name='1'
                      active={this.state.activeItem === '1'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='2'
                      active={this.state.activeItem === '2'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='3'
                      active={this.state.activeItem === '3'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='4'
                      active={this.state.activeItem === '4'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='5'
                      active={this.state.activeItem === '5'}
                      onClick={this.handleItemClick}
                    />
                  </Menu>

                  <Menu compact style={{marginTop:5}}>
                    <Menu.Item
                      name='6'
                      active={this.state.activeItem === '6'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='7'
                      active={this.state.activeItem === '7'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='8'
                      active={this.state.activeItem === '8'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='9'
                      active={this.state.activeItem === '9'}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name='10'
                      active={this.state.activeItem === '10'}
                      onClick={this.handleItemClick}
                    />
                  </Menu>


                  <br/>
                  { parseInt(this.state.activeItem) < 6 && parseInt(this.state.activeItem) > 0 ?
                      <>
                        <Form style={{marginTop:10}}>
                          <TextArea 
                            style={{height:80}}
                            placeholder='Could you let us know why you are hesitant to recommend the review tool to your friend?' 
                            onChange={(f,data)=>{this.setState({nps_reason: data.value})}}
                            />
                        </Form> 
                      
                        <Button2 basic color='teal' style={{marginTop:10}} size='small' content='SEND' 
                          onClick={()=>
                            {
                            axios.post("/api/leads/update", {
                              url: store_url,
                              item: 'NPS reason',
                              value: this.state.nps_reason
                            })
                            this.setState({sendFeedback: true})}
                          } />
                        &nbsp;&nbsp;&nbsp;
                        {
                          this.state.sendFeedback ? <span style={{color: '#04B5AE'}}>Thank you!</span> : null
                        }
                      </>
                    :
                    null
                  }
                  </div>
                </Segment>

                {/* 注册保存 */}
                <Segment>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                  <span className="row" >
                  <div className="col s6" style={{marginLeft:-10}}>
                    <h3 className='heading'>How to save the reviews</h3>
                    </div>
                  </span>
                  <div style={{color: '#696969'}}>
                    <p>Start an account with us! You can always find your reviews in the dashboard.</p>
                  </div>
                  <br/>
                  {sign_up}
                  </div>
                </Segment>
              </Segment.Group>
              </div>
              <br/>




            
            {/* desktop 屏幕付费专区 */}
            <div className="row premium_square desktop-only" style={{borderRadius:5, backgroundColor:'#80E98F'}} id="premium">
              <Segment.Group >
                <Segment style={{backgroundColor:''}}>
                  <div className="desktop-only">
                    <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h2 className='heading'>Premium</h2>
                      </div>
                      <div className="col s6" style={{textAlign:"right"}}>
                        <h2 className='heading' style={{marginRight: 20}}><span className="highlight">5 USD</span></h2>
                      </div>
                    </span>

                    <span className="row" >
                      <div className="col s6" style={{color: '#696969', marginLeft:-10}}>
                        <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                        <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive additional 3 reviews</span><br/>
                        <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Obtain well-prepared actionable strategies on first impression, homepage contents, colors, images, texts, and typographies</span><br/>
                      </div>
                      <div className="col s6" style={{textAlign:"right"}}>
                        <br/>
                        <Button
                          style={{marginRight: 20, backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold"}}
                          variant="outline-light" 
                          size="sm" 
                          onClick={()=>{
                            axios.post("/api/leads/update", {
                              url: store_url,
                              item: 'go_premium_button',
                              value: '1'
                            })
                            this.props.history.push({
                              pathname: "/promptGoPremium"
                            })
                          }}
                          >
                          Go Premium
                          </Button>
                      </div>
                    </span>
                    </div>
                  </div>

{/*
                  <div className="mobile-only">
                    <div style={{textAlign:"left", marginLeft: 10}}>
                      <span className="row" >
                        <div className="col s6" style={{marginLeft:-10}}>
                          <h2 className='heading'>Premium</h2>
                        </div>
                        <div className="col s6" style={{textAlign:"right"}}>
                            <h2 className='heading' style={{marginRight: -10}}><span className="highlight">5 USD</span></h2>
                        </div>
                        <div className="col s12" style={{color: '#696969', marginLeft:-10}}>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive additional 3 reviews</span><br/>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Obtain 1 well-prepared actionable strategy report</span><br/>
                        </div>
                      </span>

                      <Button
                          style={{backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold", marginTop: 20}}
                          variant="outline-light" 
                          size="sm" 
                          onClick={()=>{
                            axios.post("/api/leads/update", {
                              url: this.state.store,
                              item: 'go_premium_button',
                              value: '1'
                            })
                            this.props.history.push({
                              pathname: "/promptGoPremium"
                            })}
                          }
                          >
                          Go Premium
                        </Button>

                    </div>
                        </div> */}
                </Segment>


                <Segment style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                      <div className="col s6" style={{marginLeft:-10}}>
                        <h3 className='heading'>Actionable Strategies</h3>
                      </div>
                    </span>
                    <br/>
                    <Grid columns={2} stackable textAlign='center'>
                      <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                          <Card style={{width: '100%'}}>
                            <div className="desktop-only">
                              <div style={{backgroundColor:'white', borderRadius:5, paddingBottom:10}} className="center shadow">
                                <div className="" style={{paddingLeft:25, paddingRight:25, paddingTop: 25}}>
                                  <p className="prompt" style={{fontWeight:'bold'}}>Actionable Strategies</p>
                                  <p style={{color: '#696969'}}>We benchmarked <u><b>{this.state.store_url}</b></u> to 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate actionable strategies to improve your store.</p>
                                  <a href="/as_example" target="_blank">
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#009688', color:'white', marginBottom:10}}
                                   /* onClick={()=> {
                                        this.handleExample()
                                        this.state.history.push({
                                            pathname: "/strategy_example"
                                          })
                                    }}*/
                                    >Example</Button></a>
                                  &nbsp;&nbsp;&nbsp;
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#b1b1b1', marginRight:'10px', marginBottom:10}}
                                    onClick={()=> {
                                        //this.setState({unlock_button:true})
                                        this.state.history.push({
                                          pathname: "/prompt",
                                          state: {signup:false}
                                        })
                                    }}
                                    >Check strategies</Button>
                                </div> 
                              </div>
                            </div>
                            
                            <div className="mobile-only">
                              <div style={{backgroundColor:'white', borderRadius:5}} className="center">
                                <div className="shadow" style={{paddingLeft:5, paddingRight:5, paddingTop: 5}}>
                                  <p >We benchmarked <u>{this.state.store_url}</u> to 20 successful online stores in the same product category. We found what <u>{this.state.store_url}</u> is missing and recommended a list of <span style={{color:"#1b1b1c", fontWeight:"bold"}}>actionable strategies</span>. Check out our example below!</p>
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#009688', color:'white', marginTop: 5}}
                                    onClick={()=> {
                                        this.handleExample()
                                        this.state.history.push({
                                            pathname: "/as_example"
                                          })
                                    }}
                                    >Example</Button>
                                  &nbsp;&nbsp;&nbsp;
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#b1b1b1', marginRight:'10px', marginTop: 5, marginBottom: 10}}
                                    onClick={()=> {
                                        //this.setState({unlock_button:true})
                                        this.state.history.push({
                                          pathname: "/prompt",
                                          state: {signup:false}
                                        })
                                    }}
                                    >Check strategies</Button>
                                </div> 
                              </div>
                            </div>
                          </Card>
                        </Grid.Column>
                        <Grid.Column>
                            <img src={this.state.image_urls[0]} width="100%" style={{paddingBottom:'10px', borderRadius:'10px'}} alt='storefront'/>   
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </Segment>

                <Segment placeholder style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h3 className='heading'>Additional Reviews</h3>
                      </div>
                    </span>
                    </div>
                    <br/>
               
                  <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                          <br/>
                          <p className="prompt">Review 3</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review3.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#b1b1b1'}}
                          onClick={()=> {
                            this.state.history.push({
                                pathname: "/prompt",
                                state: {signup:false}
                              })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[3]} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                            </div>
                            </Grid.Column>

                            <Grid.Column>
                            <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                            <br/>
                            <p className="prompt">Review 4</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review4.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#b1b1b1'}}
                          onClick={()=> {
                            this.state.history.push({
                                pathname: "/prompt",
                                state: {signup:false}
                              })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[4]} width="100%" style={{paddingBottom:'10px'}} alt='example5'/>  
                                  </div>
                            </Grid.Column>

                            <Grid.Column>
                              <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                                <br/>
                                <p className="prompt">Review 5</p>
                                <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review5.url}</span></p>
                                <Button 
                                variant="outline-light" 
                                size="sm" 
                                style={{backgroundColor:'#b1b1b1'}}
                                onClick={()=> {
                                    this.state.history.push({
                                        pathname: "/prompt",
                                        state: {signup:false}
                                      })
                                }}
                                >Read</Button>
                                <p></p>
                                <img src={this.state.image_urls[5]} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                              </div>
                            </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

              </Segment.Group>
      
              </div>



              {/* mobile屏幕付费专区 */}
              <div className="row premium_square mobile-only" style={{borderRadius:5, backgroundColor:'#80E98F', width:"100%"}} id="premium">
              <Segment.Group >
                <Segment style={{backgroundColor:''}}>
                  <div className="mobile-only">
                    <div style={{textAlign:"left", marginLeft: 10}}>
                      <span className="row" >
                        <div className="col s6" style={{marginLeft:-10}}>
                          <h2 className='heading'>Premium</h2>
                        </div>
                        <div className="col s6" style={{textAlign:"right"}}>
                            <h2 className='heading' style={{marginRight: -10}}><span className="highlight">5 USD</span></h2>
                        </div>
                        <div className="col s12" style={{color: '#696969', marginLeft:-10}}>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive additional 3 reviews</span><br/>
                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Obtain well-prepared actionable strategies on first impression, homepage contents, colors, images, texts, and typographies</span><br/>
                        </div>
                      </span>

                      <Button
                          style={{backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold", marginTop: 20}}
                          variant="outline-light" 
                          size="sm" 
                          onClick={()=>{
                            
                            axios.post("/api/leads/update", {
                              url: store_url,
                              item: 'go_premium_button',
                              value: '1'
                            })
                            this.props.history.push({
                              pathname: "/promptGoPremium"
                            })}
                          }
                          >
                          Go Premium
                        </Button>

                    </div>
                  </div>
                </Segment>


                <Segment style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                      <div className="col s12" style={{marginLeft:-10}}>
                        <h3 className='heading'>Actionable Strategies</h3>
                      </div>
                    </span>
                    <br/>
                    <Grid columns={2} stackable textAlign='center'>
                      <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                          <Card style={{width: '100%'}}>
                            <div className="mobile-only">
                              <div style={{backgroundColor:'white', borderRadius:5}} className="center">
                                <div className="shadow" style={{paddingLeft:8, paddingRight:8, paddingTop: 5}}>
                                <p style={{color: '#696969'}}>We benchmarked <u><b>{this.state.store_url}</b></u> to 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate actionable strategies to improve your store.</p>
                                  <a href="/as_example" target="_blank">
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#009688', color:'white', marginTop: 5}}
                                    //onClick={()=> {
                                    //    this.handleExample()
                                    //    this.state.history.push({
                                    //        pathname: "/strategy_example"
                                    //      })
                                    //}}
                                    >Example</Button>
                                    </a>
                                  &nbsp;&nbsp;&nbsp;
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#b1b1b1', marginRight:'10px', marginTop: 5, marginBottom: 10}}
                                    onClick={()=> {
                                        //this.setState({unlock_button:true})
                                        this.state.history.push({
                                          pathname: "/prompt",
                                          state: {signup:false}
                                        })
                                    }}
                                    >Check strategies</Button>
                                </div> 
                              </div>
                            </div>
                          </Card>
                        </Grid.Column>
                        <Grid.Column>
                            <img src={this.state.image_urls[0]} width="100%" style={{paddingBottom:'10px', borderRadius:'10px'}} alt='storefront'/>   
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </Segment>

                <Segment placeholder style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                    <div className="col s12" style={{marginLeft:-10}}>
                      <h3 className='heading'>Additional Reviews</h3>
                      </div>
                    </span>
                    </div>
                    <br/>
               
                  <Grid columns={3} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                          <br/>
                          <p className="prompt">Review 3</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review3.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#b1b1b1'}}
                          onClick={()=> {
                            this.state.history.push({
                                pathname: "/prompt",
                                state: {signup:false}
                              })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[3]} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                            </div>
                            </Grid.Column>

                            <Grid.Column>
                            <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                            <br/>
                            <p className="prompt">Review 4</p>
                          <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review4.url}</span></p>
                          <Button 
                          variant="outline-light" 
                          size="sm" 
                          style={{backgroundColor:'#b1b1b1'}}
                          onClick={()=> {
                            this.state.history.push({
                                pathname: "/prompt",
                                state: {signup:false}
                              })
                          }}
                          >Read</Button>
                          <p></p>
                          <img src={this.state.image_urls[4]} width="100%" style={{paddingBottom:'10px'}} alt='example5'/>  
                                  </div>
                            </Grid.Column>

                            <Grid.Column>
                              <div className="shadow" style={{backgroundColor:'white', borderRadius:5}}>
                                <br/>
                                <p className="prompt">Review 5</p>
                                <p style={{paddingLeft:5, paddingRight:5}}>Compare store <span style={{textDecoration:'underline'}}>{this.state.store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>{urls[product_category].review5.url}</span></p>
                                <Button 
                                variant="outline-light" 
                                size="sm" 
                                style={{backgroundColor:'#b1b1b1'}}
                                onClick={()=> {
                                    this.state.history.push({
                                        pathname: "/prompt",
                                        state: {signup:false}
                                      })
                                }}
                                >Read</Button>
                                <p></p>
                                <img src={this.state.image_urls[5]} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                              </div>
                            </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>

              </Segment.Group>
      
              </div>




        </div>

        <div className="center-align" style={{marginLeft:10}}>
            <button 
                class="ui button"
                onClick={()=>this.setState({contactUs: !this.state.contactUs})}
            >Contact us</button>
        </div>
        {
            this.state.contactUs
            ?
            <Grid columns={1} stackable className="container">
            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20, width:'50%', marginLeft:'25%'}}>
                    <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Email address</p> 
                    <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>hello@haloy.co</p> 
                    <br/>
                    <p className="subheading" style={{marginLeft:10, fontWeight:'bold'}}>It's our goal to get back to you within 24 hours with a solution to your problem.</p> 
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
            :
            null
        }

        <div className="row">
        <br/> 
        <p className="subheading center-align" style={{color:'grey'}}>Built with <FontAwesomeIcon icon={faHeart} style={{color:'#DD7B65'}}/> in New York City </p>
        <br/>
      </div>
        </> 

    )
  }
}

export default Result_main;
 
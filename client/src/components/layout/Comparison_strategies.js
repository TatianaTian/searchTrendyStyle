import React, { Component } from "react";
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faQuestionCircle, faSadTear, faSmile, faAngry, faMehRollingEyes, faFrownOpen, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import AnalysisContext from '../context/AnalysisContext';
//import 'semantic-ui-css/semantic.min.css'
import { Icon, Step, Segment, Button, Card, Grid, Accordion, Label, Message  } from 'semantic-ui-react'
import urls from '../../data/urls.json';


var store_url, review_num, review_store, product_category
class Comparison_strategies extends Component {
  constructor(props) {
    super();
    this.state = {
        signedIn: localStorage.getItem('signedIn'),
        urls: {},
        onEmailList: false,
        email:'',
        feedback: true,
        showMenu: false
    };
  }

  
  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    review_num = localStorage.getItem('review_number')
    review_store = localStorage.getItem('review_store')
    product_category = localStorage.getItem('product_category')

    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        this.setState({
            urls: res.data.urls
        })
    })
  }

  handleExample = () => {
    axios.post("/api/leads/update", {
      url: store_url,
      item: 'AS_example_button',
      value: review_num === 1 || review_num === '1' ? '3': '4'
    })
  }

  static contextType = AnalysisContext;

  render() {

    var panels2
    if (product_category){
      //console.log('urls[product_category].review1.url: ', urls[product_category].review1.url)
    
      panels2 = [
          {
              key: `panel-1`,
              title: {
                content: <Label color='blue' content={'Actionable strategies'} />,
              },
              content: {
                content: (
                  <Message
                    info 
                    header={''}
                    content={"Although both " + urls[product_category].review1.url + " (Review 1) and " + urls[product_category].review2.url + " (Review 2) are great e-commerce stores, it doesn't mean all the visual contents they used are the best choices. In the premium account, we benchmark your store to 130 top stores and 10 successful "+ product_category +" product category stores, found the consistent trends in these stores, spotted what "+ store_url + "is missing, and recommended the most accurate actionable strategies to improve your store!"}
                  />
                ),
              },
          },
          {
              key: `panel-2`,
              title: {
                content: <Label color='blue' content={'Additional reviews'} />,
              },
              content: {
                content: (
                  <Message
                    info
                    header={''}
                    content={'If you have picked up some actionable tips by comparing your store to ' + urls[product_category].review1.url + ' and ' + urls[product_category].review2.url + ' in Review 1 and Review 2, thoroughly studying three more great stores will enable you to quickly find the common features of successful pet product stores. Learning from other successful pet product stores is the fastest way to lift your store up to the par.'}
                  />
                ),
              },
          },
          {
              key: `panel-3`,
              title: {
                content: <Label color='blue' content={'All features in the "Free" tier'} />,
              },
              content: {
                content: (
                  <Message
                    info
                    header={''}
                    content={"In the “Free” account, you will have free access to two detailed reviews about store images, colors,  texts, typographies and the first impression. Sign up an account with us! You can always find your reviews in the dashboard."}
                  />
                ),
              },
          }
      ]
    }

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


            {/* 电脑版本 */}
            <div className="desktop-only">
            {/* introduction/explaination */}
            <h2 className='heading' style={{marginLeft:'0%'}}>Review {review_num}</h2>
            <Grid columns='equal'>
                <Grid.Column width={5}>
                    {/*<Segment style={{backgroundColor:'#F5F5F5', width:'100%', marginLeft:'0%', color:'#313132'}}>
                    <h3 className='heading' style={{ marginLeft:'0%'}}>Intro</h3>*/}
                    <Segment style={{backgroundColor:'#F7FFFF', width:'100%', marginLeft:'0%', color:'#313132'}}>
                        <p style={{width:'90%', marginLeft:'5%', fontSize:15}}>
                        This review compared <b><u>{store_url}</u></b> against <b><u>{review_store}</u></b> in the first impression, images, colors,  texts, and typographies. Pay attention to how <b><u>{store_url}</u></b> is different from <b><u>{review_store}</u></b> in these aspects, especially the part that <b><u>{store_url}</u></b> underperformed.
                        <br/>
                        <br/>
                        </p>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <h3 className='heading' style={{marginLeft:'0%'}}>What are included in "Premium"</h3>
                        <Accordion defaultActiveIndex={0} panels={panels2}/>
                    </Segment>
                </Grid.Column>
            </Grid>


            {/* flow chart */}
            <div className="row" style={{marginTop:30}}>

            <Step.Group size='mini' widths={7}>

                <Step style={{opacity: 0.5}} href='/overview'>
                <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                <Step.Content>
                    <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
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

                <Step style={{opacity: 0.5}} href='/comparison'>
                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                <Step.Content>
                    <Step.Title>First impression</Step.Title>
                </Step.Content>
                </Step>

                <Step href='/strategies' active>
                <Icon name='info' />
                <Step.Content>
                    <Step.Title><b style={{color:'black'}}>Actionable Strategies</b></Step.Title>
                </Step.Content>
                </Step>

            </Step.Group>

            </div>


            <div className="row">
                <div className="col s6">
                    <Button
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/comparison"
                                })
                        }}
                  >Last: First Impression</Button>
                </div>
            </div>

            <div className="row premium_square" style={{borderRadius:5, backgroundColor:'#80E98F', width:"50%", padding:5}} id="premium">
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
                              value: review_num === 1 || review_num === '1' ? '3' : '4'
                            })
                            this.props.history.push({
                              pathname: "/promptGoPremium"
                            })}
                          }
                          >
                          Go Premium
                          </Button>
                      </div>
                    </span>
                    </div>
                  </div>
                </Segment>


                <Segment style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                      <div className="col s6" style={{marginLeft:-10}}>
                        <h4 className='heading'>Actionable Strategies</h4>
                      </div>
                    </span>
                    <br/>

                  <Grid columns={1} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                      <Card style={{width:'100%'}}>
                        <div className="desktop-only">
                          <div style={{backgroundColor:'white', borderRadius:5}} className="center ">
                            <div className="" style={{paddingLeft:25, paddingRight:25, paddingTop: 25}}>
                              <h3 className='heading center'><span className="highlight">Actionable Strategies</span></h3>
                              <p style={{color: '#696969'}}>We benchmarked <u><b>{store_url}</b></u> to 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate actionable strategies to improve your store.</p>
                              <a 
                                href="/as_example"
                                target="_blank"
                                onClick={this.handleExample}
                              >
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#1b1b1c', color:'white', marginBottom:20}}
                                    >Example
                                    </Button>
                                </a>
                              &nbsp;&nbsp;&nbsp;
                              <Button 
                                variant="outline-light" 
                                size="sm" 
                                style={{backgroundColor:'#b1b1b1', color:'white', marginRight:'10px', marginBottom:20}}
                                onClick={()=> {
                                    //this.setState({unlock_button:true})
                                    this.props.history.push({
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
                      <Grid.Column >
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  </div>
                </Segment>
              </Segment.Group>
            </div>

      
        {
          this.state.feedback?
            <div style={{width:"100%", marginLeft:"35%", textAlign:'center', marginTop:40}}>
              <Card style={{width:'30%'}}>
                  <Card.Content>  
                      <Card.Header>Feedback</Card.Header>
                      <Card.Meta>Let us know how we did and tell us what features you would like us to develop for your store.</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='red' onClick={()=>this.setState({feedback:false})}>
                            No
                        </Button>
                        <Button basic color='green' onClick={()=>{
                            window.open("https://forms.gle/Na2JwXNq8MWDjGHa9", "_blank")
                            axios.post("/api/leads/update", {
                              url: store_url,
                              item: 'click_survey_button',
                              value: review_num === 1 || review_num === '1' ? '1' : '2'
                            })
                        }}>
                            Yes
                        </Button>
                      </div>
                  </Card.Content>
              </Card>
            </div>  
          :
          null
        }
        <div style={{height:300}}>
          </div>
        </div>



           {/* 手机版本 */}
           <div className="mobile-only">
            {/* introduction/explaination */}
            <h2 className='heading' style={{marginLeft:'0%'}}>Review {review_num}</h2>
            <Grid columns='equal'>
                <Grid.Column width={16}>
                    {/*<Segment style={{backgroundColor:'#F5F5F5', width:'100%', marginLeft:'0%', color:'#313132'}}>
                    <h3 className='heading' style={{ marginLeft:'0%'}}>Intro</h3>*/}
                    <Segment style={{backgroundColor:'#F7FFFF', width:'100%', marginLeft:'0%', color:'#313132'}}>
                        <p style={{width:'90%', marginLeft:'5%', fontSize:15}}>
                        This review compared <b><u>{store_url}</u></b> against <b><u>{review_store}</u></b> in the first impression, images, colors,  texts, and typographies. Pay attention to how <b><u>{store_url}</u></b> is different from <b><u>{review_store}</u></b> in these aspects, especially the part that <b><u>{store_url}</u></b> underperformed.
                        <br/>
                        <br/>
                        </p>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <h3 className='heading' style={{marginLeft:'0%'}}>What are included in "Premium"</h3>
                        <Accordion defaultActiveIndex={0} panels={panels2}/>
                    </Segment>
                </Grid.Column>
            </Grid>


            {/* flow chart */}
            <div className="row" style={{marginTop:30}}>

            <Button
                    style={{backgroundColor:'transparent'}}
                    onClick={()=>this.setState({showMenu: !this.state.showMenu})}
                    >
                    <i class="bars icon" style={{fontSize:25, color:'#1b1b1c'}}/>
                </Button>


                {
                this.state.showMenu?
                <Step.Group size='mini' widths={7}>
                        <Step style={{opacity: 0.5}} href='/overview' >
                        <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                        <Step.Content>
                            <Step.Title>Overview</Step.Title>
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

                        <Step style={{opacity: 0.5}} href='/comparison'>
                        <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                        <Step.Content>
                            <Step.Title>First impression</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step href='/strategies' active>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}></b>Actionable Strategies</Step.Title>
                        </Step.Content>
                        </Step>
                    </Step.Group>
                : <Step.Group size="small">
                        <Step href='/strategies' active>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}></b>Actionable Strategies</Step.Title>
                        </Step.Content>
                        </Step>
                </Step.Group>
            }

            </div>


            <div className="row">
                <div className="col s6">
                    <Button
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/comparison"
                                })
                        }}
                  >Last: First Impression</Button>
                </div>
            </div>

            <div className="row premium_square" style={{borderRadius:5, backgroundColor:'#80E98F', width:"90%", padding:5}} id="premium">
              <Segment.Group >
                <Segment style={{backgroundColor:''}}>

   
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
                              value: review_num === 1 || review_num === '1' ? '3' : '4'
                            })
                            this.props.history.push({
                              pathname: "/promptGoPremium"
                            })}
                          }
                          >
                          Go Premium
                        </Button>

                    </div>
           
                </Segment>


                <Segment style={{backgroundColor:'#f2f2f2'}}>
                  <div style={{textAlign:"left", marginLeft: 10}}>
                    <span className="row" >
                      <div className="col s12" style={{marginLeft:-10}}>
                        <h4 className='heading'>Actionable Strategies</h4>
                      </div>
                    </span>
                    <br/>
 
                    <Grid columns={1} stackable textAlign='center'>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                      <Card style={{width:'100%'}}>

                          <div style={{backgroundColor:'white', borderRadius:5}} className="center ">
                            <div className="" style={{paddingLeft:10, paddingRight:10, paddingTop: 25}}>
                              <h3 className='heading center'><span className="highlight">Actionable Strategies</span></h3>
                              <p style={{color: '#696969'}}>We benchmarked <u><b>{store_url}</b></u> to 130 top stores and 10 successful <b>{product_category}</b> product category stores, found the consistent trends in these stores, spotted what <u><b>{store_url}</b></u> is missing, and recommended the most accurate actionable strategies to improve your store.</p>
                              <a  
                                href="/as_example"
                                target="_blank"
                                onClick={this.handleExample}
                              >
                                  <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#1b1b1c', color:'white', marginBottom:10}}
                                    >Example
                                    </Button>
                                </a>
                              &nbsp;&nbsp;&nbsp;
                              <Button 
                                variant="outline-light" 
                                size="sm" 
                                style={{backgroundColor:'#b1b1b1', color:'white', marginRight:'10px', marginBottom:10}}
                                onClick={()=> {
                                    //this.setState({unlock_button:true})
                                    this.props.history.push({
                                      pathname: "/prompt",
                                      state: {signup:false}
                                    })
                                }}
                                >Check strategies</Button>
                            </div> 
                          </div>
                        </Card>
                      </Grid.Column>
                      <Grid.Column >
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  </div>
                </Segment>
              </Segment.Group>
            </div>

      
        {
          this.state.feedback?
            <div style={{width:"100%", marginLeft:"5%", textAlign:'center', marginTop:60}}>
              <Card style={{width:'90%'}}>
                  <Card.Content>  
                      <Card.Header>Feedback</Card.Header>
                      <Card.Meta>Let us know how we did and tell us what features you would like us to develop for your store.</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='red' onClick={()=>this.setState({feedback:false})}>
                            No
                        </Button>
                        <Button basic color='green' onClick={()=>{
                            window.open("https://forms.gle/Na2JwXNq8MWDjGHa9", "_blank")
                            axios.post("/api/leads/update", {
                              url: store_url,
                              item: 'click_survey_button',
                              value: review_num === 1 || review_num === '1' ? '1' : '2'
                            })
                        }}>
                            Yes
                        </Button>
                      </div>
                  </Card.Content>
              </Card>
            </div>  
          :
          null
        }
          
            
        </div>
        <div style={{height:300}}>
          </div>
        </div>
        </>
    )

  }
}

export default Comparison_strategies;

import React, { Component } from "react";
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faQuestionCircle, faSadTear, faSmile, faAngry, faMehRollingEyes, faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import AnalysisContext from '../context/AnalysisContext';
//import 'semantic-ui-css/semantic.min.css'
import { Icon, Step, Divider, Grid, Button, Segment, Card, Accordion, Label, Message  } from 'semantic-ui-react'

var store_url, review_num, review_store, product_category
class Comparison_colors_example extends Component {
  constructor(props) {
    super();
    this.state = {
        //signedIn: props.location.state,
        signedIn: localStorage.getItem('signedIn'),
        full_colors: null,
        full_colors2: null,
        showMenu: false
        //urls: {},
        //urls2: {}
    };
  }

  

  componentDidMount() {
    //store_url = localStorage.getItem('store_url');
    //review_num = localStorage.getItem('review_number')
    //review_store = localStorage.getItem('review_store')
    //product_category = localStorage.getItem('product_category')

    store_url = 'gopawsbeyond.com'
    review_num = 1
    review_store = 'wildone.com'
    product_category = 'Animals & Pet Supplies'

    window.scrollTo(0, 0)
    console.log(store_url)
    console.log('start to request data')
    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        var temp_colors = res.data.full_colors
        //var temp_urls = res.data.urls
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                full_colors: temp_colors,
                full_colors2: res.data.full_colors,
                //urls: temp_urls,
                //urls2: res.data.urls
            })
        })
    })
  }

  static contextType = AnalysisContext;

  render() {
    if (!this.state.full_colors || !this.state.full_colors2){
        return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
    }

    const listColor = (list) =>{
        const color_list = list.map((color) =>
        <>
        <span style={{
        display: "inline-block",  
        backgroundColor:color,
        borderRadius:"15px",
        marginLeft: "15px",
        marginTop:10,
        borderColor:'red',
        height:60,
        width:60,
        }} className="color_block">
        <div style={{textAlign:"center", color:"#404040", marginTop:65}}>{color}</div></span>
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

   var full_listItems, full_listEmotions, full_listItems2, full_listEmotions2

   if (this.state.full_colors !== null){
        const fu_colors = this.state.full_colors.colors
        full_listItems = listColor(fu_colors)

        const fu_emotions = this.state.full_colors.emotions
        full_listEmotions = listArray(fu_emotions, '#f4e3be')

        // generate comparison 
        const fu_colors2 = this.state.full_colors2.colors
        full_listItems2 = listColor(fu_colors2)

        const fu_emotions2 = this.state.full_colors2.emotions
        full_listEmotions2 = listArray(fu_emotions2, '#d3e9d7')
    }


    const panels2 = [
        {
            key: `panel-1`,
            title: {
              content: <Label color='blue' content={'Major homepage colors'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'We listed the major colors you used in the e-commerce store. Although there are no right or wrong colors, certain color categories do convert better than others. See what color themes that '+ review_store +' is using and brainstorm if you are picking a good color theme for '+ store_url +'.'}
                />
              ),
            },
        },
        {
            key: `panel-2`,
            title: {
              content: <Label color='blue' content={"Customers' emotions triggered by store colors"} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows the customer emotions triggered by the store theme colors. Are they the emotions you want to trigger? How are they different from '+ review_store +'’s customer emotions?'}
                />
              ),
            },
        },
        {
            key: `panel-3`,
            title: {
              content: <Label color='blue' content={'Check multiple reviews'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={"Although "+review_store+" is a great e-commerce store, it doesn't mean all visual contents "+review_store+" used are perfect. That's why we recommend you to look into multiple reviews and see how different stores handle them differently. In the premium account, we benchmark your store to 130 top stores and 10 successful "+product_category+" stores, find the consistent trends in the these stores, and recommend the most accurate actionable strategies to improve your store!"}
                />
              ),
            },
        }
    ]
    
    function renderTooltip1(props) {
        return (
            <Tooltip id="button-tooltip" {...props}
            style={{
            backgroundColor: '#80e98f',
            padding: '3px 3px 3px 3px',
            color: '#1b1b1c',
            borderRadius: 5,
            ...props.style,
            }}
            >
                <Card style={{width:300, padding:10}}>
                <p style={{fontWeight:'bold'}}>Major colors</p>
                <p className = "text_footnote" >
                We listed the major colors you used in the e-commerce store. Although there are no right or wrong colors, certain color categories do convert better than others. See what color themes that {review_store} is using and brainstorm if you are picking a good color theme for {store_url}.
                </p>
            </Card>
            </Tooltip>
        );
    }

    function renderTooltip2(props) {
        return (
            <Tooltip id="button-tooltip" {...props}
            style={{
            backgroundColor: '#80e98f',
            padding: '3px 3px 3px 3px',
            color: '#1b1b1c',
            borderRadius: 5,
            ...props.style,
            }}
            >
                <Card style={{width:300, padding:10}}>
                <p style={{fontWeight:'bold'}}>Customers' emotions</p>
                <p className = "text_footnote" >
                It shows the customer emotions triggered by the store theme colors. Are they the emotions you want to trigger? How are they different from {review_store}’s customer emotions?
                </p>
            </Card>
            </Tooltip>
        );
    }

    return (
        <>
        <div className="container">  
        
            {this.state.signedIn === 'true' || this.state.signedIn === true ?
                <Link to="/" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
            :
            <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to
            home
          </Link>
            }

            {/* 电脑版本 */}
            <div className="desktop-only">
            {/* introduction/explaination */}
            <h2 className='heading' style={{marginLeft:'0%'}}>Example Review for <span className="highlight">{store_url}</span></h2>
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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Colors"</h3>
                        <Accordion defaultActiveIndex={0} panels={panels2}/>
                    </Segment>
                </Grid.Column>
            </Grid>

            {/* flow chart */}
            <div className="row" style={{marginTop:30}}>

            <Step.Group size='mini' widths={7}>

                <Step style={{opacity: 0.5}} href='/overview_example'>
                <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                <Step.Content>
                    <Step.Title>Overview</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/images_example'>
                <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                <Step.Content>
                    <Step.Title>Images</Step.Title>
                </Step.Content>
                </Step>

                <Step  href='/colors_example' active>
                <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                <Step.Content>
                    <Step.Title><b style={{color:'black'}}>Colors</b></Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/texts_example'>
                <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                <Step.Content>
                    <Step.Title>Texts</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/typographies_example'>
                <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                <Step.Content>
                    <Step.Title>Typographies</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/example'>
                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                <Step.Content>
                    <Step.Title>First impression</Step.Title>
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
                                pathname: "/images_example"
                                })
                        }}
                  >Last: Images</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/texts_example"
                                })
                        }}
                    >Next: Texts</Button>
                </div>
            </div>


            <Segment placeholder style={{backgroundColor:'white'}}>
                <Grid columns={2} stackable textAlign='center'>
                <Divider vertical> </Divider>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column>

                    <div style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                        <h4 className='heading center'><span className="highlight">Color Overview</span></h4>
                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Major homepage colors</span><br/></p>
                                <span>{full_listItems}
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip1}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>
                                </span>
                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Customers' emotions triggered by homepage colors</span><br/></p>
                                <span>{full_listEmotions}
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip2}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>
                                </span>
                        </Card>

 
                        {/*<p className='navheading'>Major homepage colors:</p>
                        {full_listItems}
                        <p className='navheading' style={{marginTop:20}}>Customers' emotions triggered by homepage colors:</p>
                        {full_listEmotions}*/}
                    </div>

                    </Grid.Column>

                    <Grid.Column>
                    <div style={{backgroundColor:'#f0f7f2',paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                        <h4 className='heading center'><span className="highlight">Color Overview</span></h4>
                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                            <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Major homepage colors</span><br/></p>
                            <span>{full_listItems2}</span>
                            <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Customers' emotions triggered by homepage colors</span><br/></p>
                            <span>{full_listEmotions2}</span>
                        </Card>

                        {/*<p className='navheading'>Major homepage colors:</p>
                        {full_listItems2}
                        <p className='navheading' style={{marginTop:20}}>Customers' emotions triggered by homepage colors:</p>    
                        {full_listEmotions2}*/}     

                    </div>
                    </Grid.Column>
                </Grid.Row>
                </Grid>
            </Segment>

            <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/texts_example"
                                })
                        }}
                    >Next: Texts</Button>
                </div>
            </div>

            <div style={{height:5}}>
            </div>
            </div>


        {/* 手机版本 */}
        <div className="mobile-only">
            {/* introduction/explaination */}
            <h2 className='heading' style={{marginLeft:'0%'}}>Example Review for <span className="highlight">{store_url}</span></h2>
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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Colors"</h3>
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
                        <Step style={{opacity: 0.5}} href='/overview_example' >
                        <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                        <Step.Content>
                            <Step.Title>Overview</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/images_example'>
                        <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                        <Step.Content>
                            <Step.Title>Images</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step href='/colors_example' active>
                        <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>Colors</b></Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/texts_example'>
                        <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                        <Step.Content>
                            <Step.Title>Texts</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/typographies_example'>
                        <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                        <Step.Content>
                            <Step.Title>Typographies</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/example'>
                        <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                        <Step.Content>
                            <Step.Title>First impression</Step.Title>
                        </Step.Content>
                        </Step>

                    </Step.Group>
                : <Step.Group size="small">
                        <Step href='/colors' active >
                        <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>Colors</b></Step.Title>
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
                                pathname: "/images_example"
                                })
                        }}
                  >Last: Images</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/texts_example"
                                })
                        }}
                    >Next: Texts</Button>
                </div>
            </div>


            <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                <h4 className='heading center'><span className="highlight">Color Overview</span></h4>
                <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Major homepage colors</span><br/></p>
                        <span>{full_listItems}
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip1}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                        </span>
                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Customers' emotions triggered by homepage colors</span><br/></p>
                        <span>{full_listEmotions}
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip2}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                        </span>
                </Card>
            </Segment>

            <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f0f7f2', textAlign:'center'}}>
                <h4 className='heading center'><span className="highlight">Color Overview</span></h4>
                <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                    <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Major homepage colors</span><br/></p>
                    <span>{full_listItems2}</span>
                    <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Customers' emotions triggered by homepage colors</span><br/></p>
                    <span>{full_listEmotions2}</span>
                </Card>
            </Segment>

            <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/texts_example"
                                })
                        }}
                    >Next: Texts</Button>
                </div>
            </div>

            <div style={{height:5}}>
            </div>
            </div>
        </div>
        </>
    )

  }
}

export default Comparison_colors_example;


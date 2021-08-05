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
import { Icon, Step, Divider, Grid, Button, Segment, Card, Accordion, Label, Message  } from 'semantic-ui-react';

var store_url, review_num, review_store, product_category
class Comparison_typographies_example extends Component {
  constructor(props) {
    super();
    this.state = {
        signedIn: localStorage.getItem('signedIn'),
        full_fonts: null,
        full_fonts2: null,
        urls: {},
        showMenu: false
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
        var temp_fonts = res.data.full_fonts
        //var temp_urls = res.data.urls
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                full_fonts: temp_fonts,
                full_fonts2: res.data.full_fonts,
            })
        })
    })
  }


  static contextType = AnalysisContext;

  render() {

    if (!this.state.full_fonts || !this.state.full_fonts2){
        return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
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
    
    var fu_fonts, fu_fonts_count, full_listFonts, fu_fonts2, fu_fonts_count2, full_listFonts2

    if (this.state.full_fonts !== null){
        fu_fonts = this.state.full_fonts.fonts
        full_listFonts = listArray(fu_fonts, '#d3e9d7')
        fu_fonts_count = this.state.full_fonts.count

        // generate comparison
        fu_fonts2 = this.state.full_fonts2.fonts
        full_listFonts2 = listArray(fu_fonts2, '#f4e3be')
        fu_fonts_count2 = this.state.full_fonts2.count
    }

    const panels2 = [
        {
            key: `panel-1`,
            title: {
              content: <Label color='blue' content={'Count of typographies'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows the number of typographies used in the homepage. A store may look messy and inconsistent if using too many fonts, but monotonous and boring with too few fonts. Compare your typography count with that of '+review_store+' below.'}
                />
              ),
            },
        },
        {
            key: `panel-2`,
            title: {
              content: <Label color='blue' content={'List of typographies'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'We extracted typographies from your homepage. Just like words, fonts also commute messages to customers. A font style that does not represent your brand image is just like a cheating scandal. It takes away users’ trust and decreases loyalty. See how ' + review_store +' picked their fonts and compare your typographies with theirs.'}
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
                <p style={{fontWeight:'bold'}}>Count of typographies</p>
                <p className = "text_footnote" >
                It shows the number of typographies used in the homepage. A store may look messy and inconsistent if using too many fonts, but monotonous and boring with too few fonts. Compare your typography count with that of {review_store} below.
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
                <p style={{fontWeight:'bold'}}>List of typographies</p>
                <p className = "text_footnote" >
                We extracted typographies from your homepage. Just like words, fonts also commute messages to customers. A font style that does not represent your brand image is just like a cheating scandal. It takes away users’ trust and decreases loyalty. See how {review_store} picked their fonts and compare your typographies with theirs.
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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Typographies"</h3>
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
                    <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/images_example'>
                <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                <Step.Content>
                    <Step.Title>Images</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/colors_example'>
                <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                <Step.Content>
                    <Step.Title>Colors</Step.Title>
                </Step.Content>
                </Step>

                <Step style={{opacity: 0.5}} href='/texts_example'>
                <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                <Step.Content>
                    <Step.Title>Texts</Step.Title>
                </Step.Content>
                </Step>

                <Step href='/typographies_example' active>
                <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                <Step.Content>
                    <Step.Title><b style={{color:'black'}}>Typographies</b></Step.Title>
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
                                pathname: "/texts_example"
                                })
                        }}
                  >Last: Texts</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/example"
                                })
                        }}
                    >Next: First Impression</Button>
                </div>
            </div>

            <Segment placeholder style={{backgroundColor:'white'}}>
                <Grid columns={2} stackable textAlign='center'>
                <Divider vertical> </Divider>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column>

                    <div style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                        <h4 className='heading center'><span className="highlight">Typography Overview</span></h4>

                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Count of typographies</span><br/>
                                    <span
                                        style={{
                                            display: "inline-block", 
                                            borderRadius: "5px",
                                            backgroundColor: "#d3e9d7",
                                            paddingLeft:'15px',
                                            paddingRight:'15px',
                                            paddingTop: '5px',
                                            paddingBottom: '5px',
                                            fontSize:'15px',
                                            fontFamily:'monospace',
                                            marginTop:'5px',
                                            marginRight:'5px',
                                            marginLeft:'5px'
                                            }}>
                                        {fu_fonts_count}
                                    </span>
                                    <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTooltip1}
                                        >
                                            <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>
                                </p>
                                <p className='subheading' style={{marginTop:20}}><span style={{fontWeight:'bold'}}>List of typographies used in homepage</span><br/></p>
                                <span>{full_listFonts}
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip2}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>
                                </span>
                        </Card>

                    </div>

                    </Grid.Column>

                    <Grid.Column>
                    <div style={{backgroundColor:'#f0f7f2', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                        <h4 className='heading center'><span className="highlight">Typography Overviews</span></h4>

                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Count of typographies</span><br/>
                                <span
                                    style={{
                                        display: "inline-block", 
                                        borderRadius: "5px",
                                        backgroundColor: "#f4e3be",
                                        paddingLeft:'15px',
                                        paddingRight:'15px',
                                        paddingTop: '5px',
                                        paddingBottom: '5px',
                                        fontSize:'15px',
                                        fontFamily:'monospace',
                                        marginTop:'5px',
                                        marginRight:'5px',
                                        marginLeft:'5px'
                                        }}>
                                    {fu_fonts_count2}
                                </span></p>
                                <p className='subheading' style={{marginTop:20}}><span style={{fontWeight:'bold'}}>List of typographies used in homepage</span><br/></p>
                                <span>{full_listFonts2}</span>
                        </Card>
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
                                pathname: "/example"
                                })
                        }}
                    >Next: First Impression</Button>
                </div>
            </div>
        </div>
        <div style={{height:5}}>
        </div>

        
        {/* 手机版本 */}
        <div className="mobile-only">
            {/* introduction/explaination */}
            <h2 className='heading' style={{marginLeft:'0%'}}>Example Review for <span className="highlight">{store_url}</span></h2>
            <Grid columns='equal'>
                <Grid.Column width={16}>
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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Typographies"</h3>
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

                        <Step style={{opacity: 0.5}} href='/colors_example'>
                        <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                        <Step.Content>
                            <Step.Title>Colors</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/texts_example'>
                        <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                        <Step.Content>
                            <Step.Title>Texts</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step href='/typographies_example' active>
                        <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>Typographies</b></Step.Title>
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
                        <Step href='/typographies' active>
                        <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>Typographies</b></Step.Title>
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
                                pathname: "/texts_example"
                                })
                        }}
                  >Last: Texts</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/example"
                                })
                        }}
                    >Next: First Impression</Button>
                </div>
            </div>

            <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                <h4 className='heading center'><span className="highlight">Typography Overview</span></h4>
                <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Count of typographies</span><br/>
                            <span
                                style={{
                                    display: "inline-block", 
                                    borderRadius: "5px",
                                    backgroundColor: "#d3e9d7",
                                    paddingLeft:'15px',
                                    paddingRight:'15px',
                                    paddingTop: '5px',
                                    paddingBottom: '5px',
                                    fontSize:'15px',
                                    fontFamily:'monospace',
                                    marginTop:'5px',
                                    marginRight:'5px',
                                    marginLeft:'5px'
                                    }}>
                                {fu_fonts_count}
                            </span>
                            <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip1}
                                >
                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                        </p>
                        <p className='subheading' style={{marginTop:20}}><span style={{fontWeight:'bold'}}>List of typographies used in homepage</span><br/></p>
                        <span>{full_listFonts}
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
                <h4 className='heading center'><span className="highlight">Typography Overviews</span></h4>
                <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading' style={{marginBottom:10}}><span style={{fontWeight:'bold'}}>Count of typographies</span><br/>
                        <span
                            style={{
                                display: "inline-block", 
                                borderRadius: "5px",
                                backgroundColor: "#f4e3be",
                                paddingLeft:'15px',
                                paddingRight:'15px',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                                fontSize:'15px',
                                fontFamily:'monospace',
                                marginTop:'5px',
                                marginRight:'5px',
                                marginLeft:'5px'
                                }}>
                            {fu_fonts_count2}
                        </span></p>
                        <p className='subheading' style={{marginTop:20}}><span style={{fontWeight:'bold'}}>List of typographies used in homepage</span><br/></p>
                        <span>{full_listFonts2}</span>
                </Card>
            </Segment>

            <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/example"
                                })
                        }}
                    >Next: First Impression</Button>
                </div>
            </div>
        </div>
        <div style={{height:5}}>

        </div>

        </div>
        </>
    )

  }
}

export default Comparison_typographies_example;



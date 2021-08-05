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
import { Rating } from '@material-ui/lab';

var store_url, review_num, review_store, product_category
class Comparison extends Component {
  constructor(props) {
    super();
    this.state = {
        //signedIn: props.location.state,
        signedIn: localStorage.getItem('signedIn'),
        first_impression: null,
        first_impression2: null,
        urls: {},
        urls2: {},
        showMenu: false
    };
  }



  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    review_num = localStorage.getItem('review_number')
    review_store = localStorage.getItem('review_store')
    product_category = localStorage.getItem('product_category')

    window.scrollTo(0, 0)
    console.log(store_url)
    console.log('start to request data')
    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        var temp_first_impression = res.data.first_impression
        var temp_urls = res.data.urls
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                first_impression: temp_first_impression,
                first_impression2: res.data.first_impression,
                urls: temp_urls,
                urls2: res.data.urls
            })
        })
    })
  }

  nearestRating(x){
    if ((x*2-Math.floor(x*2))>0.5){
      return Math.ceil(x*2)/2
    } else {
      return Math.floor(x*2)/2
    }
  }

  rating(x){
    if (x<4){
        return "very poor"
    } else if (x>=4 && x<5){
        return "poor"
    } else if (x>=5 && x<6){
        return "good"
    } else {
        return "excellent"
    }
  }

  mostObjects(all_objects){
    var objects = []
    for (var i=0; i<all_objects.length;i++){
        objects.push(all_objects[i].name)
    }

    return objects
 }


  static contextType = AnalysisContext;

  render() {

    if (!this.state.first_impression || !this.state.first_impression2){
        return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
    }

    const listColor = (list) =>{
        const color_list = list.map((color) =>
        <>
        <span style={{
        display: "inline-block",  
        backgroundColor:color,
        borderRadius:"10px",
        marginLeft: "15px",
        height:60,
        width:60,
        borderColor:'red'
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
    
   var listItems, listEmotions, im_aes_score, im_tec_score, im_text, im_text_count, listKeywords, listItems2, listEmotions2, im_aes_score2, im_tec_score2, im_text2, im_text_count2, listKeywords2

   if (this.state.first_impression !== null){
        const im_colors = this.state.first_impression.colors
        listItems = listColor(im_colors)

        const emotions = this.state.first_impression.emotions
        listEmotions = listArray(emotions, '#f4e3be')

        im_aes_score = this.state.first_impression.scores.aesthetic_score
        im_tec_score = this.state.first_impression.scores.technical_score
        im_text = this.state.first_impression.text
        im_text = im_text.replace('undefined','')
        im_text_count = this.state.first_impression.text_count

        const keywords = this.state.first_impression.text_keywords
        listKeywords = listArray(keywords, '#f4e3be')
        

        // generate comparison
        const im_colors2 = this.state.first_impression2.colors
        listItems2 = listColor(im_colors2)

        const emotions2 = this.state.first_impression2.emotions
        listEmotions2 = listArray(emotions2, '#d3e9d7')

        im_aes_score2 = this.state.first_impression2.scores.aesthetic_score
        im_tec_score2 = this.state.first_impression2.scores.technical_score
        im_text2 = this.state.first_impression2.text
        im_text_count2 = this.state.first_impression2.text_count

        const keywords2 = this.state.first_impression2.text_keywords
        listKeywords2 = listArray(keywords2, '#d3e9d7')
   }

   const panels2 = [
    {
        key: `panel-1`,
        title: {
          content: <Label color='blue' content={'Intro'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Now you have seen the breakdown of images, colors, texts, and typographies of the store. Here, we analyzed all these elements in your “first impression page”. “First impression page” is defined as the page that customers would see after landing on the website without scrolling down.'}
            />
          ),
        },
    },
    {
        key: `panel-2`,
        title: {
          content: <Label color='blue' content={'Aesthetic score of the first impression'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Same instructions as in the “Images” section. Aesthetic score is exceptionally important for the first impression page. Successful e-commerce stores usually have very beautiful first impression pages. Compare your first impression page score with that of '+ review_store +'. '}
            />
          ),
        },
    },
    {
        key: `panel-3`,
        title: {
          content: <Label color='blue' content={'Objects that customers firstly see'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Same instructions as in the “Images” section. Objects in the first screen are critical in telling potential customers what the store is selling. If the detected objects are not very related to your store products, consider changing the images in the first impression screen.'}
            />
          ),
        },
    },
    {
        key: `panel-4`,
        title: {
          content: <Label color='blue' content={'Colors in the first impression screen'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Same instructions as in the “Colors” section. First impression colors set the foundation for the whole visitor session. Compare how your first impression colors are different from those of '+ review_store +'.'}
            />
          ),
        },
    },
    {
        key: `panel-5`,
        title: {
          content: <Label color='blue' content={'Text in the first impression screen'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Same instructions as in the “Texts” section. It displayed all the texts that your customers can see after landing on the page without scrolling down. Customers should know what ' + store_url + ' is selling by looking at the text and pictures on the first screen.'}
            />
          ),
        },
    },
    {
        key: `panel-6`,
        title: {
          content: <Label color='blue' content={'Key words that customers would notice'} />,
        },
        content: {
          content: (
            <Message
              info
              header={''}
              content={'Same instructions as in the “Texts” section. Keywords extracted from the first screen text are exceptionally important, because these keywords are most likely how your potential customers understand the store right after they land on the page. Do the keywords deliver the key information about your store and the products? Compare how your first impression page keywords are different from those of '+ review_store + ' and see if you need to make any changes.'}
            />
          ),
        },
    },
    {
        key: `panel-7`,
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
            <p style={{fontWeight:'bold'}}>Aesthetic score</p>
            <p className = "text_footnote" >
            Same instructions as in the “Images” section. Aesthetic score is exceptionally important for the first impression page. Successful e-commerce stores usually have very beautiful first impression pages. Compare your first impression page score with that of {review_store}. 
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
            <p style={{fontWeight:'bold'}}>First impression objects</p>
            <p className = "text_footnote" >
            Same instructions as in the “Images” section. Objects in the first screen are critical in telling potential customers what the store is selling. If the detected objects are not very related to your store products, consider changing the images in the first impression screen.
            </p>
        </Card>
        </Tooltip>
    );
}

function renderTooltip3(props) {
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
            <p style={{fontWeight:'bold'}}>First impression colors</p>
            <p className = "text_footnote" >
            Same instructions as in the “Colors” section. First impression colors set the foundation for the whole visitor session. Compare how your first impression colors are different from those of {review_store}.
            </p>
        </Card>
        </Tooltip>
    );
}

function renderTooltip4(props) {
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
            <p style={{fontWeight:'bold'}}>Texts on the first screen</p>
            <p className = "text_footnote" >
            Same instructions as in the “Texts” section. It displayed all the texts that your customers can see after landing on the page without scrolling down. Customers should know what {store_url} is selling by looking at the text and pictures on the first screen. 
            </p>
        </Card>
        </Tooltip>
    );
}

function renderTooltip5(props) {
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
            <p style={{fontWeight:'bold'}}>Keywords in texts</p>
            <p className = "text_footnote" >
            Same instructions as in the “Texts” section. Keywords extracted from the first screen text are exceptionally important, because these keywords are most likely how your potential customers understand the store right after they land on the page. Do the keywords deliver the key information about your store and the products? Compare how your first impression page keywords are different from those of {review_store} and see if you need to make any changes.
            </p>
        </Card>
        </Tooltip>
    );
}


console.log('first_impression: ', this.state.first_impression)
console.log('first_impression2: ', this.state.first_impression2)

    return (
        <>
        <div className="container">  
            <Link to="/results" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to
            dashboard
          </Link>

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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "First impression"</h3>
                        <Accordion defaultActiveIndex={0} panels={panels2}/>
                    </Segment>
                </Grid.Column>
            </Grid>

            {/* flow chart */}
            <div className="row">

            <Step.Group size='mini' widths={7} style={{marginTop:30}}>

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

                <Step href='/comparison' active >
                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                <Step.Content>
                    <Step.Title><b style={{color:'black'}}>First impression</b></Step.Title>
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
                <div className="col s6">
                    <Button
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/typographies"
                                })
                        }}
                  >Last: Typographies</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/strategies"
                                })
                        }}
                    >Next: Strategies</Button>
                </div> 
            </div>

            <Segment placeholder style={{backgroundColor:'white'}}>
                <Grid columns={2} stackable textAlign='center'>
                <Divider vertical> </Divider>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column>
                    {/*store_url*/}
                    <div style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:5}}>
                        <h4 className='heading center'><span className="highlight">First impression</span></h4>
                            <div className="center">
                                <img src={this.state.urls.impression_url} width="90%" style={{paddingBottom:'10px'}} alt='example1'/>
                            </div>

                            <Card style={{width:'90%', marginLeft:'5%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                <p className='subheading' style={{marginBottom:10, marginTop:10}}><span style={{fontWeight:'bold'}}><a href="/term" target="_blank">Aesthetic score</a> of the first impression</span><br/></p>
                                <span>
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(im_aes_score)} precision={0.5} max={10} size='small' readOnly/> 
                                &nbsp; {this.rating(this.nearestRating(im_aes_score))}
                                &nbsp; &nbsp;
                                <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip1}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                                </p>
                                </span>
                                <p style={{fontSize:10, color:'gray', marginTop: 2}}>
                                    <a href="/term"
                                        target="_blank">How's the score calculated?
                                    </a>
                                </p>
                                <p className='subheading' style={{marginBottom:10, marginTop:15}}><span style={{fontWeight:'bold'}}>Objects that customers firstly see after landing on the page</span><br/></p>
                                <span>{/*listEmotions*/}{listArray(this.mostObjects(this.state.first_impression.objects), '#f4e3be')}
                                <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip2}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                                </span>

                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>The first impression colors perceived by customers</span><br/></p>
                                <span>{listItems}
                                &nbsp; &nbsp;
                                <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip3}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                                </span>

                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Text in the first impression screen</span><br/></p>
                                <p>{im_text_count} words
                                &nbsp; &nbsp;
                                <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip4}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                                </p>
                                {im_text}
                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Key words that customers would notice by glimpsing the text</span><br/>
                                {listKeywords}
                                <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip5}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                                </p>
                            </Card>
                    </div>

                    </Grid.Column>

                    <Grid.Column>
                        {/*review_store*/}
                        <div style={{backgroundColor:'#f0f7f2', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:5}}>
                            <h4 className='heading center'><span className="highlight">First impression</span></h4>
                            <div className="center">
                            <img 
                                //src={process.env.PUBLIC_URL + '/example4.png'}
                                src={this.state.urls2.impression_url}
                                width="90%" style={{paddingBottom:'10px'}} alt='example1'/>
                            </div>

                            <Card style={{width:'90%', marginLeft:'5%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                <p className='subheading' style={{marginBottom:10, marginTop:10}}><span style={{fontWeight:'bold'}}><a href="/term" target="_blank">Aesthetic score</a> of the first impression</span><br/></p>
                                <span>
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(im_aes_score)} precision={0.5} max={10} size='small' readOnly/> 
                                &nbsp; {this.rating(this.nearestRating(im_aes_score2))}</p>
                                </span>
                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Objects that customers firstly see after landing on the page</span><br/></p>
                                <span>{/*listEmotions2*/}{listArray(this.mostObjects(this.state.first_impression2.objects), '#d3e9d7')}</span>
                                <p className='subheading' style={{marginBottom:10, marginTop: 20}}><span style={{fontWeight:'bold'}}>The first impression colors perceived by customers</span><br/></p>
                                <span>{listItems2}</span>
                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Text in the first impression screen</span><br/></p>
                                <p>{im_text_count2} words</p>
                                {im_text2}
                                <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Key words that customers would notice by glimpsing the text</span><br/>
                                {listKeywords2}</p>
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
                                pathname: "/strategies"
                                })
                        }}
                    >Next: Strategies</Button>
                </div>
            </div>
            <div style={{height:5}}>
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
                        <h3 className='heading' style={{marginLeft:'0%'}}>How to read "First impression"</h3>
                        <Accordion defaultActiveIndex={0} panels={panels2}/>
                    </Segment>
                </Grid.Column>
            </Grid>

            {/* flow chart */}
            <div className="row">

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

                        <Step href='/comparison' active>
                        <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>First impression</b></Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.5}} href='/strategies'>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title>Actionable Strategies</Step.Title>
                        </Step.Content>
                        </Step>
                    </Step.Group>
                : <Step.Group size="small">
                        <Step href='/comparison' active>
                        <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>First impression</b></Step.Title>
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
                                pathname: "/typographies"
                                })
                        }}
                  >Last: Typographies</Button>
                </div>

                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/strategies"
                                })
                        }}
                    >Next: Strategies</Button>
                </div> 
            </div>

            <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                <h4 className='heading center'><span className="highlight">First impression</span></h4>
                    <div className="center">
                        <img src={this.state.urls.impression_url} width="90%" style={{paddingBottom:'10px'}} alt='example1'/>
                    </div>

                    <Card style={{width:'90%', marginLeft:'5%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading' style={{marginBottom:10, marginTop:10}}><span style={{fontWeight:'bold'}}><a href="/term" target="_blank">Aesthetic score</a> of the first impression</span><br/></p>
                        <span>
                        <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(im_aes_score)} precision={0.5} max={10} size='small' readOnly/> 
                        &nbsp; {this.rating(this.nearestRating(im_aes_score))}
                        &nbsp; &nbsp;
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={renderTooltip1}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </p>
                        </span>
                        <p style={{fontSize:10, color:'gray', marginTop: 2}}>
                            <a href="/term"
                                target="_blank">How's the score calculated?
                            </a>
                        </p>
                        <p className='subheading' style={{marginBottom:10, marginTop:15}}><span style={{fontWeight:'bold'}}>Objects that customers firstly see after landing on the page</span><br/></p>
                        <span>{/*listEmotions*/}{listArray(this.mostObjects(this.state.first_impression.objects), '#f4e3be')}
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={renderTooltip2}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </span>

                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>The first impression colors perceived by customers</span><br/></p>
                        <span>{listItems}
                        &nbsp; &nbsp;
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={renderTooltip3}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </span>

                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Text in the first impression screen</span><br/></p>
                        <p>{im_text_count} words
                        &nbsp; &nbsp;
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={renderTooltip4}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </p>
                        {im_text}
                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Key words that customers would notice by glimpsing the text</span><br/>
                        {listKeywords}
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 200 }}
                                overlay={renderTooltip5}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </p>
                    </Card>
                </Segment>

                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f0f7f2', textAlign:'center'}}>
                    {/*review_store*/}
                    <h4 className='heading center'><span className="highlight">First impression</span></h4>
                    <div className="center">
                    <img 
                        //src={process.env.PUBLIC_URL + '/example4.png'}
                        src={this.state.urls2.impression_url}
                        width="90%" style={{paddingBottom:'10px'}} alt='example1'/>
                    </div>

                    <Card style={{width:'90%', marginLeft:'5%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading' style={{marginBottom:10, marginTop:10}}><span style={{fontWeight:'bold'}}><a href="/term" target="_blank">Aesthetic score</a> of the first impression</span><br/></p>
                        <span>
                        <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(im_aes_score)} precision={0.5} max={10} size='small' readOnly/> 
                        &nbsp; {this.rating(this.nearestRating(im_aes_score2))}</p>
                        </span>
                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Objects that customers firstly see after landing on the page</span><br/></p>
                        <span>{/*listEmotions2*/}{listArray(this.mostObjects(this.state.first_impression2.objects), '#d3e9d7')}</span>
                        <p className='subheading' style={{marginBottom:10, marginTop: 20}}><span style={{fontWeight:'bold'}}>The first impression colors perceived by customers</span><br/></p>
                        <span>{listItems2}</span>
                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Text in the first impression screen</span><br/></p>
                        <p>{im_text_count2} words</p>
                        {im_text2}
                        <p className='subheading' style={{marginBottom:10, marginTop:20}}><span style={{fontWeight:'bold'}}>Key words that customers would notice by glimpsing the text</span><br/>
                        {listKeywords2}</p>
                    </Card>
                </Segment>

            <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/strategies"
                                })
                        }}
                    >Next: Strategies</Button>
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

export default Comparison;

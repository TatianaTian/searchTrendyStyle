import React, { Component } from "react";
import { OverlayTrigger, Tooltip} from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import AnalysisContext from '../context/AnalysisContext';
import { Icon, Step, Divider, Grid, Button, Segment, Card, Accordion, Label, Message } from 'semantic-ui-react'
import _ from 'lodash'
import { Rating } from '@material-ui/lab';
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';

var store_url, review_num, review_store, user
class Dashboard_overview extends Component {
  constructor(props) {
    super();
    this.state = {
        signedIn: localStorage.getItem('signedIn'),
        full_images: null,
        full_images2: null,
        full_texts: null,
        full_texts2: null,
        full_fonts:null,
        full_fonts2:null,
        length: null,
        length2: null,
        urls: {},
        urls2: {},
        showMenu: false,
        //user: props.auth.user,
    };
  }
  

  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    review_num = localStorage.getItem('review_number')
    review_store = localStorage.getItem('review_store')
    user = {
        name: localStorage.getItem('username'),
        store: localStorage.getItem('user_store')
    }

    window.scrollTo(0, 0)
    console.log(store_url)
    console.log('start to request data')
    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        var temp_images = res.data.full_images
        var temp_texts = res.data.full_texts
        var temp_fonts = res.data.full_fonts
        var temp_urls = res.data.urls
        var temp_length = res.data.length
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                full_images: temp_images,
                full_images2: res.data.full_images,
                full_texts: temp_texts,
                full_texts2: res.data.full_texts,
                full_fonts: temp_fonts,
                full_fonts2: res.data.full_fonts,
                length: temp_length,
                length2: res.data.length,
                urls: temp_urls,
                urls2: res.data.urls,
                activeIndex: 0
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

  averageScore(full_image, index){
      var total = 0
      for (var i=0; i<full_image.length;i++){
          if (index === 0){
            total += full_image[i].aesthetic_score
          } else {
            total += full_image[i].technical_score
          }
      }
      return total/full_image.length
  }

  mostObjects(full_image){
      var objects = []
      for (var i=0; i<full_image.length;i++){
        for (var j=0; j<full_image[i].objects.length;j++){
          objects.push(full_image[i].objects[j])
        }
      }

      var dict = {};
      for (var k=0; k<objects.length; k++){
        if (objects[k] in dict){
            dict[objects[k]] += 1
        } else {
            dict[objects[k]] = 1
        }
      }

      var mostObjects=[]
      for (const object in dict) {
        if (dict[object]>1){
            mostObjects.push(object)
        }
      }
      return mostObjects
   }

   //state = { activeIndex: 0 }

   handleClick = (e, titleProps) => {
     const { index } = titleProps
     const { activeIndex } = this.state
     const newIndex = activeIndex === index ? -1 : index
 
     this.setState({ activeIndex: newIndex })
   }



  static contextType = AnalysisContext;

  render() {
    console.log('user:', user)

    if (this.state.full_images) console.log('most objects:', this.mostObjects(this.state.full_images))

    if (!this.state.full_images || !this.state.full_images){
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
            marginRight:'5px',
            marginLeft:'5px'
            }}>
                {emotion}
            </span>
            );
        return styled_list
    }


    var image_card_num = null
    var image_card_num2 = null
    if (this.state.full_images !== null && this.state.urls !== null){
        image_card_num = this.state.full_images.length

        // generate comparison 
        image_card_num2 = this.state.full_images2.length
    }


    var fu_text_count, fu_text_count2
    if (this.state.full_texts !== null){
        fu_text_count = this.state.full_texts.text_count

        // generate comparison
        fu_text_count2 = this.state.full_texts2.text_count
    }

    var fu_fonts_count, fu_fonts_count2
    if (this.state.full_fonts !== null){
        fu_fonts_count = this.state.full_fonts.count

        // generate comparison
        fu_fonts_count2 = this.state.full_fonts2.count
    }

    const panels2 = [
        {
            key: `panel-1`,
            title: {
              content: <Label color='blue' content={'homepage length'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={`It shows the estimated page number when the store is displayed on a desktop. It indicates how long your homepage is and how much information you put there. If your page number is significantly smaller or larger than that of `+review_store+`. May consider adding/reducing contents on your homepage.`}
                />
              ),
            },
        },
        {
            key: `panel-2`,
            title: {
              content: <Label color='blue' content={'Total number of images'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows the number of images in the '+ store_url + ' homepage. Having the right number of pictures will make the website look neat and catchy, effectively attracting customers and selling more products. If ' + store_url + ' has significantly more or fewer images than ' + review_store + ', you may consider adding/reducing pictures on your homepage.'}
                />
              ),
            },
        },
        {
            key: `panel-3`,
            title: {
              content: <Label color='blue' content={'Average aesthetic score & technical score'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={"We give each of your images an aesthetic score and a technical score. The aesthetic score measures how customers perceive your store images from an aesthetic perspective; the technical score measures the picture's technical quality (contrast, blurriness, exposure, brightness, etc.) The average aesthetic score and technical score indicate the overall quality of your store images. Successful e-commerce stores usually have both high aesthetic scores and high technical scores - compare your image scores with those of "+ review_store +" and see if you need to improve your image quality."}
                />
              ),
            },
        },
        {
            key: `panel-4`,
            title: {
              content: <Label color='blue' content={'Word count in the lading page'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows how many words you used in the homepage. Customers usually spend less than 20 seconds on a page, so make sure you have enough texts to introduce the store and products, but not too many to overwhelm potential customers. If ' + store_url + ' uses significantly more or fewer words than ' + review_store + '. You may consider adding/reducing texts on your homepage.'}
                />
              ),
            },
        },
        {
            key: `panel-5`,
            title: {
              content: <Label color='blue' content={'Total number of typographies'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows the number of typographies used in the homepage. A store may look messy and inconsistent if using too many fonts, but monotonous and boring with too few fonts. Compare your typography count with that of ' + review_store + ' below.'}
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
                <p style={{fontWeight:'bold'}}>homepage length</p>
                <p className = "text_footnote" >
                It shows the estimated page number when the store is displaying on a desktop. It indicates how long your homepage is and how much information you put there. If your page number is significantly smaller or larger than that of {review_store}. May consider adding/reducing contents on your homepage.
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
                <p style={{fontWeight:'bold'}}>Total number of images</p>
                <p className = "text_footnote" >
                It shows the number of images in the {store_url} homepage. Having the right amount of pictures will make the website look neat and catchy, effectively attracting customers and selling more products. If {store_url} has significantly more or fewer images than {review_store}. May consider adding/reducing pictures on your homepage.
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
                <p style={{fontWeight:'bold'}}>Average aesthetic score</p>
                <p className = "text_footnote" >
                We give each of your images an aesthetic score. The aesthetic score measures how customers perceive your store images from an aesthetic perspective. The average aesthetic score indicates the overall quality of your store images. Successful e-commerce stores usually have high aesthetic scores - compare your image scores with that of {review_store} and see if you need to improve your image quality.
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
                <p style={{fontWeight:'bold'}}>Average technical score</p>
                <p className = "text_footnote" >
                We give each of your images a technical score. The technical score measures the picture technical quality (contrast, blurriness, exposure, brightness, etc.) The average technical scores indicates the overall quality of your store images. Successful e-commerce stores usually have high technical scores - compare your image scores with that of {review_store} and see if you need to improve your image quality.
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
                <p style={{fontWeight:'bold'}}>Word count</p>
                <p className = "text_footnote" >
                It shows how many words you used in the homepage. Customers usually spend less than 20 seconds on the page, so make sure you have enough texts to introduce the store and product, but not too many to overwhelm potential customers. If {store_url} uses significantly more or fewer words than {review_store}. May consider adding/reducing texts on your homepage.
                </p>
            </Card>
            </Tooltip>
        );
    }

    function renderTooltip6(props) {
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
                It shows the number of typographies used in the homepage. A store may look messy and inconsistent if using too many fonts, but monotonous and boring with too few fonts. Compare your typography count with that of {review_store}.
                </p>
            </Card>
            </Tooltip>
        );
    }

    console.log('this.state.length: ', this.state.length)

    return (
        <>

            {/* 电脑版本 */}
            <div className="desktop-only row">
                <div className="col s2">
                    <Dashboard_sidebar active={1} user={user}/>
                </div>

                <div className="col s10">  
                    {/* introduction/explaination */}
                    <div style={{marginLeft:"1%", marginTop:50, marginBottom:30}}>
                        <Link to="/dashboard2" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to dashboard
                        </Link>
                    </div>
                    <div style={{marginLeft:"4%", marginRight:"4%"}}>
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
                                    <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Overview"</h3>
                                    <Accordion defaultActiveIndex={0} panels={panels2}/>
                                </Segment>
                            </Grid.Column>
                        </Grid>

                        {/* flow chart */}
                        <div className="row" style={{marginTop:30}}>

                            <Step.Group size='mini' widths={7}>

                                <Step href='/dashboard_overview' active>
                                <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                                <Step.Content>
                                    <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_images'>
                                <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                                <Step.Content>
                                    <Step.Title><b style={{color:'black'}}>Images</b></Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_colors'>
                                <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                                <Step.Content>
                                    <Step.Title>Colors</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_texts'>
                                <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                                <Step.Content>
                                    <Step.Title>Texts</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_typographies'>
                                <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                                <Step.Content>
                                    <Step.Title>Typographies</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_impression'>
                                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                                <Step.Content>
                                    <Step.Title>First impression</Step.Title>
                                </Step.Content>
                                </Step>

                            </Step.Group>

                        </div>


                        <div className="row">
                            <div style={{ display: "flex" }}>
                                <Button color='teal' 
                                    style={{ marginLeft: "auto" }}
                                    onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/dashboard_images"
                                            })
                                    }}
                                >Next: Images</Button>
                            </div>
                        </div>

                        <Segment placeholder style={{backgroundColor:'white'}}>
                            <Grid columns={2} stackable textAlign='center'>
                            <Divider vertical> </Divider>
                            <Grid.Row verticalAlign='top'>
                                <Grid.Column>
                                    <div className="" style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                                        <h4 className='heading center'><span className="highlight">Overview</span></h4>
                                        <img src={this.state.urls.full_url} width="80%" style={{paddingBottom:'10px'}} alt='example1'/>

                                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>homepage length</span><br/>
                                            <span style={{
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
                                                    {Math.floor(this.state.length/2)} pages
                                                </span>
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip1}
                                                >
                                                    <Icon name='question circle outline' />
                                                </OverlayTrigger>
                                                </p>



                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images in homepage</span><br/>
                                            <span style={{
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
                                                    {image_card_num} images
                                                </span>
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip2}
                                                >
                                                    <Icon name='question circle outline' />
                                                </OverlayTrigger>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average aesthetic score of all images</span>
                                            {/*{this.averageScore(this.state.full_images2, 0)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 0))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 0)))}
                                                &nbsp;&nbsp;
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip3}
                                                >
                                                    <Icon name='question circle outline' />
                                                </OverlayTrigger>
                                                </p>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average technical score of all images</span>
                                            {/*{this.averageScore(this.state.full_images2, 1)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 1))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 1)))}
                                                &nbsp;&nbsp;
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip4}
                                                >
                                                    <Icon name='question circle outline' />
                                                </OverlayTrigger>
                                                </p>
                                            </p>
                                            <p style={{fontSize:10, color:'gray', marginTop: -15}}>
                                                <a href="/term"
                                                    target="_blank">How's the score calculated?
                                                </a>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Word count in landing page</span><br/>  
                                            <span style={{
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
                                                {fu_text_count} words
                                            </span>
                                            <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip5}
                                                >
                                                    <Icon name='question circle outline' />
                                            </OverlayTrigger>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of typographies</span><br/> 
                                            <span style={{
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
                                                {fu_fonts_count}
                                            </span>
                                            <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip6}
                                                >
                                                    <Icon name='question circle outline' />
                                            </OverlayTrigger>
                                            </p>
                                        </Card>

                                    </div>
                                </Grid.Column>

                                <Grid.Column>
                                    <div className="" style={{backgroundColor:'#f0f7f2', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                                        <h4 className='heading center'><span className="highlight">Overview</span></h4>
                                        <img src={this.state.urls2.full_url} width="80%" style={{paddingBottom:'10px'}} alt='example1'/>

                                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>homepage length</span><br/>
                                            <span style={{
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
                                                    {Math.floor(this.state.length2/2)} pages
                                                </span></p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images in homepage</span><br/>
                                            <span style={{
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
                                                    {image_card_num2} images
                                                </span>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average aesthetic score of all images</span>
                                            {/*{this.averageScore(this.state.full_images2, 0)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 0))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 0)))}</p>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average technical score of all images</span>
                                            {/*{this.averageScore(this.state.full_images2, 1)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 1))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 1)))}</p>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Word count in landing page</span><br/>  
                                            <span style={{
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
                                                {fu_text_count2} words
                                            </span>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of typographies</span><br/> 
                                            <span style={{
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
                                                {fu_fonts_count2}
                                            </span>
                                            </p>
                                            
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
                                        pathname: "/dashboard_images"
                                        })
                                }}
                            >Next: Images</Button>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div style={{height:5}}>
                </div>
            </div>


            {/* 手机版本 */}
            <div className="mobile-only container">
                <div style={{marginLeft:-40}}>
                    <Dashboard_sidebar_mobile active={1} user={user}/>
                </div>
                <div style={{marginLeft:-15}}>
                    <Link to="/dashboard2" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to dashboard
                    </Link>
                </div>

                {/* 解释 */}
                <h2 className='heading' style={{marginLeft:'0%'}}>Review {review_num}</h2>
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
                            <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Overview"</h3>
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
                                <Step href='/dashboard_overview' active>
                                <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                                <Step.Content>
                                    <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_images'>
                                <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                                <Step.Content>
                                    <Step.Title>Images</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_colors'>
                                <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                                <Step.Content>
                                    <Step.Title>Colors</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_texts'>
                                <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                                <Step.Content>
                                    <Step.Title>Texts</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_typographies'>
                                <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                                <Step.Content>
                                    <Step.Title>Typographies</Step.Title>
                                </Step.Content>
                                </Step>

                                <Step style={{opacity: 0.5}} href='/dashboard_impression'>
                                <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                                <Step.Content>
                                    <Step.Title>First impression</Step.Title>
                                </Step.Content>
                                </Step>

                            </Step.Group>
                        : <Step.Group size="small">
                        <Step href='/dashboard_overview' active>
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                            <Step.Content>
                                <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
                            </Step.Content>
                            </Step>
                        </Step.Group>
                    }
                        

                </div>


                <div className="row">
                    <div style={{ display: "flex" }}>
                        <Button color='teal' 
                            size="small"
                            style={{ marginLeft: "auto" }}
                            onClick={()=> {
                                this.props.history.push({
                                    pathname: "/dashboard_images"
                                    })
                            }}
                        >Next: Images</Button>
                    </div>
                </div>

                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                        <h4 className='heading center'><span className="highlight">Overview</span></h4>
                        <img src={this.state.urls.full_url} width="100%" style={{paddingBottom:'10px'}} alt='example1'/>

                        <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>homepage length</span><br/>
                            <span style={{
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
                                    {Math.floor(this.state.length/2)} pages
                                </span>
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip1}
                                >
                                    <Icon name='question circle outline' />
                                </OverlayTrigger>
                                </p>



                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images in homepage</span><br/>
                            <span style={{
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
                                    {image_card_num} images
                                </span>
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip2}
                                >
                                    <Icon name='question circle outline' />
                                </OverlayTrigger>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average aesthetic score of all images</span>
                            {/*{this.averageScore(this.state.full_images2, 0)}*/}
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 0))} precision={0.5} max={10} size='small' readOnly/>
                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 0)))}
                                &nbsp;&nbsp;
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip3}
                                >
                                    <Icon name='question circle outline' />
                                </OverlayTrigger>
                                </p>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average technical score of all images</span>
                            {/*{this.averageScore(this.state.full_images2, 1)}*/}
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 1))} precision={0.5} max={10} size='small' readOnly/>
                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 1)))}
                                &nbsp;&nbsp;
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip4}
                                >
                                    <Icon name='question circle outline' />
                                </OverlayTrigger>
                                </p>
                            </p>
                            <p style={{fontSize:10, color:'gray', marginTop: -15}}>
                                <a href="/term"
                                    target="_blank">How's the score calculated?
                                </a>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Word count in landing page</span><br/>  
                            <span style={{
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
                                {fu_text_count} words
                            </span>
                            <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip5}
                                >
                                    <Icon name='question circle outline' />
                            </OverlayTrigger>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of typographies</span><br/> 
                            <span style={{
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
                                {fu_fonts_count}
                            </span>
                            <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip6}
                                >
                                    <Icon name='question circle outline' />
                            </OverlayTrigger>
                            </p>
                        </Card>
                    </Segment>


                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f0f7f2', textAlign:'center'}}>
                        <h4 className='heading center'><span className="highlight">Overview</span></h4>
                        <img src={this.state.urls2.full_url} width="100%" style={{paddingBottom:'10px'}} alt='example1'/>
                        <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>homepage length</span><br/>
                            <span style={{
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
                                    {Math.floor(this.state.length2/2)} pages
                                </span></p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images in homepage</span><br/>
                            <span style={{
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
                                    {image_card_num2} images
                                </span>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average aesthetic score of all images</span>
                            {/*{this.averageScore(this.state.full_images2, 0)}*/}
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 0))} precision={0.5} max={10} size='small' readOnly/>
                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 0)))}</p>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>The average technical score of all images</span>
                            {/*{this.averageScore(this.state.full_images2, 1)}*/}
                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 1))} precision={0.5} max={10} size='small' readOnly/>
                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 1)))}</p>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Word count in landing page</span><br/>  
                            <span style={{
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
                                {fu_text_count2} words
                            </span>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of typographies</span><br/> 
                            <span style={{
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
                                {fu_fonts_count2}
                            </span>
                            </p>
                            
                        </Card>
                    </Segment>

                <div className="row" style={{marginBottom:300}}>
                    <div style={{ display: "flex" }}>
                        <Button color='teal' 
                            size="small"
                            style={{ marginLeft: "auto" }}
                            onClick={()=> {
                                this.props.history.push({
                                    pathname: "/dashboard_images"
                                    })
                            }}
                        >Next: Images</Button>
                    </div>
                </div>
            
                <div style={{height:5}}>
                </div>

            </div>
        </>
    )

  }
}

export default Dashboard_overview;


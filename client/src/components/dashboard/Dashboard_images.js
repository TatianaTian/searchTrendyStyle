import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import AnalysisContext from '../context/AnalysisContext';
//import 'semantic-ui-css/semantic.min.css'
import { Icon, Step, Divider, Grid, Button, Segment, Card, Accordion, Label, Message  } from 'semantic-ui-react'
//import { Rating } from '@material-ui/core';
//import Rating from '@material-ui/lab/Rating';
import { Rating } from '@material-ui/lab';
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';

var store_url, review_num, review_store, product_category, user
class Dashboard_images extends Component {
  constructor(props) {
    super();
    this.state = {
        signedIn: localStorage.getItem('signedIn'),
        full_images: null,
        full_images2: null,
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
        var temp_urls = res.data.urls
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                full_images: temp_images,
                full_images2: res.data.full_images,
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



  static contextType = AnalysisContext;

  render() {
    console.log('this.state.full_Images:', this.state.full_images)

    if (this.state.full_images) console.log('most objects:', this.mostObjects(this.state.full_images))

    if (!this.state.full_images || !this.state.full_images){
        return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
    }

    const listArray = (list, color) => {
        const styled_list = list.map((emotion) =>{
            if (emotion !== null && emotion !== 'null'){
                return <span style={{
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
                    marginLeft:'5px',
                    }}>
                        {emotion}
                    </span>
            }
        });
        return styled_list
    }

    var image_card_list, image_card_list2
    var image_card_num = null
    var image_card_num2 = null
    if (this.state.full_images !== null && this.state.urls !== null){
        image_card_num = this.state.full_images.length
        const listImages = this.state.full_images 
        image_card_list = listImages.map((image, index)=>{
            
            var labels = null
            if (image.labels !== undefined && image.labels !== null ){
                labels = listArray(image.labels, '#f5faf6')
            }
            
            var objects = null
            if (image.objects !== undefined && image.objects !== null){
                objects = listArray(image.objects, '#f5faf6')
            }

            //console.log('index: ', index)

            return (
                <div className='row image-card'>
                    <p style={{color:'grey'}}>{index+1}</p>
                    {/*<p style={{color:'red'}}>image_id: {image.image_id}</p>*/}
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
                    <p className='navheading'><a href="/term" target="_blank">Aesthetic score</a> of this image:</p>
                
                    <Rating name="half-rating" defaultValue={this.nearestRating(image.aesthetic_score.toFixed(2))} precision={0.5} max={10} size='small' readOnly/>
                    <p style={{color:'grey'}}>{this.rating(this.nearestRating(image.aesthetic_score.toFixed(2)))}</p>
                    <p className='navheading' style={{marginTop:10}}><a href="/term" target="_blank">Technical score</a> of this image:</p>

                    <Rating name="half-rating" defaultValue={this.nearestRating(image.technical_score.toFixed(2))} precision={0.5} max={10} size='small' readOnly/>
                    <p style={{color:'grey'}}>{this.rating(this.nearestRating(image.technical_score.toFixed(2)))}</p>
                    <p className='navheading' style={{marginTop:10}}>Major objects in the image: </p>{objects}
                </div>
            </div>)
        })

        // generate comparison 
        image_card_num2 = this.state.full_images2.length
        const listImages2 = this.state.full_images2 
        //console.log(listImages)
        image_card_list2 = listImages2.map((image, index)=>{
            //console.log('image.labels')
            
            var objects = null
            if (image.objects !== undefined){
                objects = listArray(image.objects, '#f4e7be')
            }

            return (
                <div className='row image-card'>
                    <p style={{color:'grey'}}>{index+1}</p>
                <div className="col m6">
                    <p>original image</p>
                    <img 
                        src={this.state.urls2.image_or_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    <p>image with outlined objects</p>
                    {image.objects.length>0?
                        <img 
                        src={this.state.urls2.image_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    :
                        <img 
                        src={this.state.urls2.image_or_urls[image.image_id]}
                        width='100%' style={{paddingBottom:'10px'}} alt='image_example1'/>
                    }
                </div>
                <div className="col m6" style={{textAlign:'left'}}>
                    <p className='navheading'><a href="/term" target="_blank">Aesthetic score</a> of this image:</p>
                    
                    <Rating name="half-rating" defaultValue={this.nearestRating(image.aesthetic_score.toFixed(2))} precision={0.5} max={10} size='small' readOnly/>
                    <p style={{color:'grey'}}>{this.rating(this.nearestRating(image.aesthetic_score.toFixed(2)))}</p>
                    <p className='navheading' style={{marginTop:10}}><a href="/term" target="_blank">Technical score</a> of this image:</p>

                    <Rating name="half-rating" defaultValue={this.nearestRating(image.technical_score.toFixed(2))} precision={0.5} max={10} size='small' readOnly/> 
                    <p style={{color:'grey'}}>{this.rating(this.nearestRating(image.technical_score.toFixed(2)))}</p>
                    <p className='navheading' style={{marginTop:10}}>Major objects in the image: </p>{objects}
                </div>
            </div>)
        })
    }


    const panels2 = [
        {
            key: `panel-1`,
            title: {
              content: <Label color='blue' content={'Total number of images'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows the number of images in the '+ store_url + ' homepage. Having the right number of pictures will make the website look neat and catchy, effectively attracting customers and selling more products. If ' + store_url + ' has significantly more or fewer images than ' + review_store + '. You may consider adding/reducing pictures on the homepage.'}
                />
              ),
            },
        },
        {
            key: `panel-2`,
            title: {
              content: <Label color='blue' content={'Aesthetic score & technical score'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'Each of the store images has an aesthetic score and a technical score. The aesthetic score measures how customers perceive your store images from an aesthetic perspective; the technical score measures the picture technical quality (contrast, blurriness, exposure, brightness, etc.) The average aesthetic score & technical score indicate the overall quality of your store images. Successful e-commerce stores usually have both high aesthetic scores and high technical scores - compare your image scores with those of '+ review_store +' and see if you need to improve your image quality.'}
                />
              ),
            },
        },
        {
            key: `panel-3`,
            title: {
              content: <Label color='blue' content={'Major objects in the image'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'Each image has a few words to describe the noticeable objects displayed in the image. The objects are also outlined by green boxes in the pictures. This section helps inform if you are using the right pictures to market the store/products. For example, if a picture is intended to market a pet toy, but customers mainly see “person” and “grass” in the picture, you might consider shrinking the size of “person” and “grass” and focusing more on “pet” and “toy” in that image. Compare how customers understand yours and '+ review_store +'’s images differently and edit the pictures that do poorly in showcasing your products.'}
                  
                />
              ),
            },
        },
        {
            key: `panel-4`,
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
                <p style={{fontWeight:'bold'}}>Total number of images</p>
                <p className = "text_footnote" >
                It shows the number of images in the {store_url} homepage. Having the right amount of pictures will make the website look neat and catchy, effectively attracting customers and selling more products. If {store_url} has significantly more or fewer images than {review_store}. May consider adding/reducing pictures on your homepage.
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
                <p style={{fontWeight:'bold'}}>Average aesthetic score</p>
                <p className = "text_footnote" >
                We give each of your store image an aesthetic score. The aesthetic score measures how customers perceive your store images from an aesthetic perspective. The average aesthetic score indicates the overall quality of your store images. Successful e-commerce stores usually have high aesthetic scores - compare your image scores with those of {review_store} and see if you need to improve your image quality.
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
                <p style={{fontWeight:'bold'}}>Average technical score</p>
                <p className = "text_footnote" >
                We give each of your store image a technical score. The technical score measures the picture technical quality (contrast, blurriness, exposure, brightness, etc.) The average technical score indicates the overall quality of your store images. Successful e-commerce stores usually have high technical scores - compare your image scores with those of {review_store} and see if you need to improve your image quality.
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
                <p style={{fontWeight:'bold'}}>Top objects</p>
                <p className = "text_footnote" >
                They are the objects that you used the most often in store images. If the top objects are not the product you are selling, it indicates that you might be not using the effective pictures.
                </p>
            </Card>
            </Tooltip>
        );
    }

    console.log('this.state.full_images: ', this.state.full_images)


    return (
        <>
            {/* 电脑版本 */}
            {/* introduction/explaination */}
            <div className="desktop-only row">

                <div className="col s2">
                    <Dashboard_sidebar active={1} user={user}/>
                </div>

                <div className="col s10">

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
                                    <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Images"</h3>
                                    <Accordion defaultActiveIndex={0} panels={panels2}/>
                                </Segment>
                            </Grid.Column>
                        </Grid>

                        {/* flow chart */}
                        <div className="row" style={{marginTop:30}}>

                        <Step.Group size='mini' widths={7}>

                            <Step style={{opacity: 0.5}} href='/dashboard_overview'>
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                            <Step.Content>
                                <Step.Title><b style={{color:'black'}}>Overview</b></Step.Title>
                            </Step.Content>
                            </Step>

                            <Step href='/dashboard_images' active>
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
                            <div className="col s6">
                                <Button
                                    style={{ marginLeft: "auto" }}
                                    onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/dashboard_overview"
                                            })
                                    }}
                            >Last: Overview</Button>
                            </div>

                            <div style={{ display: "flex" }}>
                                <Button color='teal' 
                                    style={{ marginLeft: "auto" }}
                                    onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/dashboard_colors"
                                            })
                                    }}
                                >Next: Colors</Button>
                            </div>
                        </div>

                        <Segment placeholder style={{backgroundColor:'white'}}>
                            <Grid columns={2} stackable textAlign='center'>
                            <Divider vertical> </Divider>
                            <Grid.Row verticalAlign='top'>
                                <Grid.Column>
                                    <div className="" style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                                        <h4 className='heading center'><span className="highlight">Image Overview</span></h4>
                                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images</span><br/>
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
                                                {image_card_num} images
                                            </span>
                                            <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip1}
                                                >
                                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                            </OverlayTrigger>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>The average aesthetic score of all images 
                                            {/*{this.averageScore(this.state.full_images, 0)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 0))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 0)))}
                                                &nbsp;&nbsp;
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip2}
                                                >
                                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                                </p>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>The average technical score of all images
                                            {/*{this.averageScore(this.state.full_images, 1)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 1))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 1)))}
                                                &nbsp;&nbsp;
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip3}
                                                >
                                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                                </p>
                                            </p>
                                            <p style={{fontSize:10, color:'gray', marginTop: -15}}>
                                                <a href="/term"
                                                    target="_blank">How's the score calculated?
                                                </a>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>Top objects appeared in the store images</p>
                                            <span>{listArray(this.mostObjects(this.state.full_images), '#d3e9d7')}
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip4}
                                                >
                                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                            </span>
                                        </Card>
                                        <h4 className='heading center'><span className="highlight">Images Details</span></h4>
                                        {image_card_list}
                                    </div>
                                </Grid.Column>

                                <Grid.Column>
                                    <div className="" style={{backgroundColor:'#f0f7f2', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                                        
                                        <h4 className='heading center'><span className="highlight">Image Overview</span></h4>
                                        <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'> <span style={{fontWeight:'bold'}}>Total number of images</span><br/>
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
                                                {image_card_num2} images
                                            </span>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>The average aesthetic score of all images
                                            {/*{this.averageScore(this.state.full_images2, 0)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 0))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 0)))}</p>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>The average technical score of all images
                                            {/*{this.averageScore(this.state.full_images2, 1)}*/}
                                                <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 1))} precision={0.5} max={10} size='small' readOnly/>
                                                &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 1)))}</p>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>Top objects appeared in the store images</p>
                                            <span>{listArray(this.mostObjects(this.state.full_images2), '#f4e7be')}</span>
                                        </Card>
                                        <h4 className='heading center'><span className="highlight">Images Details</span></h4>
                                        {image_card_list2}
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
                                    pathname: "/dashboard_colors"
                                    })
                            }}
                        >Next: Colors</Button>
                    </div>
                </div>
                
                        <div style={{height:5}}>
        </div>
                    </div>
                </div>
            </div>





            {/* 手机版本 */}
            {/* introduction/explaination */}
            <div className="mobile-only container">
                <div style={{marginLeft:-40}}>
                    <Dashboard_sidebar_mobile active={1} user={user}/>
                </div>
                <div style={{marginLeft:-15}}>
                    <Link to="/dashboard2" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i> Back to dashboard
                    </Link>
                </div>
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
                            <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Images"</h3>
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
                            <Step style={{opacity: 0.5}} href='/dashboard_overview'>
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                            <Step.Content>
                                <Step.Title>Overview</Step.Title>
                            </Step.Content>
                            </Step>

                            <Step href='/dashboard_images' active>
                            <img src={process.env.PUBLIC_URL + '/dashboard_image.png'} className='image_icon_steps' alt='image_icon'/>
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
                    : <Step.Group size="small">
                    <Step href='/dashboard_images' active>
                    <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                    <Step.Content>
                        <Step.Title><b style={{color:'black'}}>Images</b></Step.Title>
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
                                    pathname: "/dashboard_overview"
                                    })
                            }}
                    >Last: Overview</Button>
                    </div>

                    <div style={{ display: "flex" }}>
                        <Button color='teal' 
                            size="small"
                            style={{ marginLeft: "auto" }}
                            onClick={()=> {
                                this.props.history.push({
                                    pathname: "/dashboard_colors"
                                    })
                            }}
                        >Next: Colors</Button>
                    </div>
                </div>

                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                    <h4 className='heading center'><span className="highlight">Image Overview</span></h4>
                    <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading'><span style={{fontWeight:'bold'}}>Total number of images</span><br/>
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
                            {image_card_num} images
                        </span>
                        <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip1}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>The average aesthetic score of all images 
                        {/*{this.averageScore(this.state.full_images, 0)}*/}
                            <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 0))} precision={0.5} max={10} size='small' readOnly/>
                            &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 0)))}
                            &nbsp;&nbsp;
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip2}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                            </p>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>The average technical score of all images
                        {/*{this.averageScore(this.state.full_images, 1)}*/}
                            <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images, 1))} precision={0.5} max={10} size='small' readOnly/>
                            &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images, 1)))}
                            &nbsp;&nbsp;
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip3}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                            </p>
                        </p>
                        <p style={{fontSize:10, color:'gray', marginTop: -15}}>
                            <a href="/term"
                                target="_blank">How's the score calculated?
                            </a>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>Top objects appeared in the store images</p>
                        <span>{listArray(this.mostObjects(this.state.full_images), '#d3e9d7')}
                            <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltip4}
                            >
                                <Icon name='question circle outline' style={{color:'grey'}}/>
                            </OverlayTrigger>
                        </span>
                    </Card>
                    <h4 className='heading center'><span className="highlight">Images Details</span></h4>
                    {image_card_list}
                </Segment>

                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f0f7f2', textAlign:'center'}}>    
                    <h4 className='heading center'><span className="highlight">Image Overview</span></h4>
                    <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                        <p className='subheading'> <span style={{fontWeight:'bold'}}>Total number of images</span><br/>
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
                            {image_card_num2} images
                        </span>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>The average aesthetic score of all images
                        {/*{this.averageScore(this.state.full_images2, 0)}*/}
                            <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 0))} precision={0.5} max={10} size='small' readOnly/>
                            &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 0)))}</p>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>The average technical score of all images
                        {/*{this.averageScore(this.state.full_images2, 1)}*/}
                            <p style={{color:'grey'}}><Rating name="half-rating" defaultValue={this.nearestRating(this.averageScore(this.state.full_images2, 1))} precision={0.5} max={10} size='small' readOnly/>
                            &nbsp;{this.rating(this.nearestRating(this.averageScore(this.state.full_images2, 1)))}</p>
                        </p>
                        <p className='subheading' style={{fontWeight:'bold'}}>Top objects appeared in the store images</p>
                        <span>{listArray(this.mostObjects(this.state.full_images2), '#f4e7be')}</span>
                    </Card>
                    <h4 className='heading center'><span className="highlight">Images Details</span></h4>
                    {image_card_list2}
                </Segment>

                <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/dashboard_colors"
                                })
                        }}
                    >Next: Colors</Button>
                </div>
            </div>
                
                <div style={{height:5}}>
                </div>
            
            </div>
        </>
    )

  }
}

export default Dashboard_images;


import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faSmile, faAngry, faMehRollingEyes, faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import AnalysisContext from '../context/AnalysisContext';
import { Icon, Step, Divider, Grid, Button, Segment, Card, Accordion, Label, Message } from 'semantic-ui-react';
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';

var store_url, review_num, review_store, product_category, user
class Comparison_texts extends Component {
  constructor(props) {
    super();
    this.state = {
        //signedIn: props.location.state,
        signedIn: localStorage.getItem('signedIn'),
        full_texts: null,
        full_texts2: null,
        urls: {},
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
        var temp_texts = res.data.full_texts
        //var temp_urls = res.data.urls
        console.log('start to request data2')
        axios
        .post("/api/scrape/fetch_data", {store_url: review_store})
        .then(res=>{
            this.setState({
                full_texts: temp_texts,
                full_texts2: res.data.full_texts,
            })
        })
    })
  }

  static contextType = AnalysisContext;

  render() {

    if (!this.state.full_texts || !this.state.full_texts2){
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
    
    var full_listKeywords, fu_text, fu_text_count, full_listKeywords2, fu_text2, fu_text_count2

    var num, pron, noun, adv, adj, verb, syntaxFonts1, syntaxFonts2
    if (this.state.full_texts !== null){
        fu_text = this.state.full_texts.text
        fu_text = fu_text.replace('undefined','')
        fu_text_count = this.state.full_texts.text_count

        const full_keywords = this.state.full_texts.text_keywords
        full_listKeywords = listArray(full_keywords, '#f4e7be')

        const full_syntax = this.state.full_texts.text_syntax
        console.log('full_syntax: ', full_syntax)
        num = full_syntax.NUM
        pron = full_syntax.PRON
        noun = full_syntax.NOUN
        adv = full_syntax.ADV
        adj = full_syntax.ADJ 
        verb = full_syntax.VERB

        const syntax = [`Adv: ${adv} words`, `Adj: ${adj} words`, `Noun: ${noun} words`, `Verb: ${verb} words`, `Number: ${num} words`, `Pronoun: ${pron} words`]
        syntaxFonts1 = listArray(syntax, '#f4e7be')


        // generate comparison
        fu_text2 = this.state.full_texts2.text
        fu_text_count2 = this.state.full_texts2.text_count

        const full_keywords2 = this.state.full_texts2.text_keywords
        full_listKeywords2 = listArray(full_keywords2, '#d3e9d7')

        const full_syntax2 = this.state.full_texts2.text_syntax
        num = full_syntax2.NUM
        pron = full_syntax2.PRON
        noun = full_syntax2.NOUN
        adv = full_syntax2.ADV
        adj = full_syntax2.ADJ 
        verb = full_syntax2.VERB

        const syntax2 = [`Adv: ${adv} words`, `Adj: ${adj} words`, `Noun: ${noun} words`, `Verb: ${verb} words`, `Number: ${num} words`, `Pronoun: ${pron} words`]
        syntaxFonts2 = listArray(syntax2, '#d3e9d7')
    }


    const panels2 = [
        {
            key: `panel-1`,
            title: {
              content: <Label color='blue' content={'Total count of words'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'It shows how many words you used in the homepage. Customers usually spend less than 20 seconds on the page, so make sure you have enough texts to introduce the store and product, but not too many to overwhelm potential customers. If '+ store_url +' uses significantly more or fewer words than '+ review_store +'. May consider adding/reducing texts on your homepage.'}
                />
              ),
            },
        },
        {
            key: `panel-2`,
            title: {
              content: <Label color='blue' content={'Keywords that customers could notice'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'Customers usually spend less than 5 seconds to read a paragraph of text. We listed the keywords that customers would notice after glimpsing the front page. Compare how your keywords are different from those of '+ review_store +'. If the current keywords are not the key information about your store/product, may consider refining the texts on your homepage.'}
                />
              ),
            },
        },
        {
            key: `panel-3`,
            title: {
              content: <Label color='blue' content={'Customers emotions triggered by the texts'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'We detected the tone of your paragraphs. Most stores keep their tone positive.'}
                />
              ),
            },
        },
        {
            key: `panel-4`,
            title: {
              content: <Label color='blue' content={'Syntax'} />,
            },
            content: {
              content: (
                <Message
                  info
                  header={''}
                  content={'How to write good and effective text? Should we mainly use nouns, verbs, or adjectives to describe the store and products? Syntax distribution is a good indicator of writing styles and product description effectiveness. Compare the top three types of syntax used by ' + review_store + ' and '+ store_url +'.'}
                />
              ),
            },
        },
        {
            key: `panel-5`,
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
                <p style={{fontWeight:'bold'}}>Top count of words</p>
                <p className = "text_footnote" >
                It shows how many words you used in the homepage. Customers usually spend less than 20 seconds on the page, so make sure you have enough texts to introduce the store and product, but not too many to overwhelm potential customers. If {store_url} uses significantly more or fewer words than {review_store}. May consider adding/reducing texts on your homepage.
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
                <p style={{fontWeight:'bold'}}>Text keywords</p>
                <p className = "text_footnote" >
                These are the keywords that customers would notice after glimpsing the front page. Compare how your keywords are different from those of {review_store}. Since customers usually spend less than 20 seconds on the front page, the keywords should deliver the key information about your store and products. If the current keywords are not the key information, may consider refining the texts on your homepage.
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
                <p style={{fontWeight:'bold'}}>Customers' emotion</p>
                <p className = "text_footnote" >
                We detected the tone of your paragraphs. Most stores keep their tone positive.
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
                <p style={{fontWeight:'bold'}}>Syntax</p>
                <p className = "text_footnote" >
                How to write good and effective text? Should we mainly use nouns, verbs, or adjectives to describe the store and products? Syntax distribution is a good indicator of writing styles and product description effectiveness. Compare the top three types of syntax used by {review_store} and {store_url}.
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
                <p style={{fontWeight:'bold'}}>All texts</p>
                <p className = "text_footnote" >
                We extracted all texts from your homepage. Since customers usually spend less than 20 seconds on the front page, using headlines and subheadlines to deliver key store/product information is essential. Do customers know what you are selling after reading the headlines and subheadlines?
                </p>
            </Card>
            </Tooltip>
        );
    }

    return (
        <>
            {/* 电脑版本 */}
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

                    {/* introduction/explaination */}
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
                                    </p>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Texts"</h3>
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

                            <Step href='/dashboard_texts' active>
                            <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                            <Step.Content>
                                <Step.Title><b style={{color:'black'}}>Texts</b></Step.Title>
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
                                            pathname: "/dashboard_colors"
                                            })
                                    }}
                            >Last: Colors</Button>
                            </div>

                            <div style={{ display: "flex" }}>
                                <Button color='teal' 
                                    style={{ marginLeft: "auto" }}
                                    onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/dashboard_typographies"
                                            })
                                    }}
                                >Next: Typographies</Button>
                            </div>
                        </div>

                        <Segment placeholder style={{backgroundColor:'white'}}>
                            <Grid columns={2} stackable textAlign='center'>
                            <Divider vertical> </Divider>
                            <Grid.Row verticalAlign='top'>
                                <Grid.Column>

                                <div style={{backgroundColor:'#f8efd4', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>
                                    <h4 className='heading center'><span className="highlight">Text Overview</span></h4>

                                    <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'> <span style={{fontWeight:'bold'}}>Total count of words</span><br/>
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
                                                {fu_text_count}
                                            </span>
                                                <OverlayTrigger
                                                        placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip1}
                                                    >
                                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Keywords that customers could notice after glimpsing</span>
                                            {full_listKeywords}
                                                <OverlayTrigger
                                                        placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip2}
                                                    >
                                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>Emotions that customers could read from the texts</p>
                                            <span><FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/>sadness
                                            &nbsp;
                                            <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                                            &nbsp;&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                                            &nbsp;
                                            <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear
                                                <OverlayTrigger
                                                        placement="right"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={renderTooltip3}
                                                    >
                                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                            </span>
                                            <p className='subheading' style={{fontWeight:'bold', marginTop:30}}>Syntax</p>
                                            <span>{syntaxFonts1}
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={renderTooltip4}
                                                >
                                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                                </OverlayTrigger>
                                            </span>
                                    </Card>


                                    <h4 className='navheading' style={{marginBottom:10}}>All text in the homepage
                                        &nbsp;&nbsp;
                                        <OverlayTrigger
                                            placement="right"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTooltip5}
                                        >
                                            <Icon name='question circle outline' style={{color:'grey'}}/>
                                        </OverlayTrigger>
                                    </h4> 
                                    
                                    {fu_text}
                                </div>

                                </Grid.Column>

                                <Grid.Column>
                                <div style={{backgroundColor:'#f0f7f2', paddingTop: '3px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%', borderRadius:10}}>

                                    <h4 className='heading center'><span className="highlight">Text Overview</span></h4>

                                    <Card style={{width:'80%', marginLeft:'10%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                                            <p className='subheading'> <span style={{fontWeight:'bold'}}>Total count of words</span><br/>
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
                                                {fu_text_count2}
                                            </span>
                                            </p>
                                            <p className='subheading'><span style={{fontWeight:'bold'}}>Keywords that customers could notice after glimpsing</span>
                                            {full_listKeywords2}
                                            </p>
                                            <p className='subheading' style={{fontWeight:'bold'}}>Emotions that customers could read from the texts</p>
                                            <span><FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/>sadness
                                            &nbsp;
                                            <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                                            &nbsp;&nbsp;&nbsp;
                                            <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                                            &nbsp;
                                            <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear</span>
                                            <p className='subheading' style={{fontWeight:'bold', marginTop:30}}>Syntax</p>
                                            <span>{syntaxFonts2}</span>
                                    </Card>



                                    <h4 className='navheading' style={{marginBottom:10, marginTop:25}}>All text in the homepage</h4> 
                                    {fu_text2}
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
                                pathname: "/dashboard_typographies"
                                })
                        }}
                    >Next: Typographies</Button>
                </div>
            </div>
                    </div>
                    <div style={{height:5}}>
        </div>
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
                            <h3 className='heading' style={{marginLeft:'0%'}}>How to read "Texts"</h3>
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
                            <Step style={{opacity: 0.5}} href='/dashboard_overview' >
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='image_icon'/>
                            <Step.Content>
                                <Step.Title>Overview</Step.Title>
                            </Step.Content>
                            </Step>

                            <Step style={{opacity: 0.5}} href='/dashboard_images'>
                            <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                            <Step.Content>
                                <Step.Title>Images</Step.Title>
                            </Step.Content>
                            </Step>

                            <Step style={{opacity: 0.5}} href='/dashboard_colors' >
                            <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                            <Step.Content>
                                <Step.Title>Colors</Step.Title>
                            </Step.Content>
                            </Step>

                            <Step href='/dashboard_texts' active>
                            <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                            <Step.Content>
                                <Step.Title><b style={{color:'black'}}>Texts</b></Step.Title>
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
                        <Step href='/dashboard_texts' active>
                            <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                            <Step.Content>
                                <Step.Title><b style={{color:'black'}}>Texts</b></Step.Title>
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
                                    pathname: "/dashboard_colors"
                                    })
                            }}
                    >Last: Colors</Button>
                    </div>

                    <div style={{ display: "flex" }}>
                        <Button color='teal' 
                            size="small"
                            style={{ marginLeft: "auto" }}
                            onClick={()=> {
                                this.props.history.push({
                                    pathname: "/dashboard_typographies"
                                    })
                            }}
                        >Next: Typographies</Button>
                    </div>
                </div>

                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f8efd4', textAlign:'center'}}>
                    <h4 className='heading center'><span className="highlight">Text Overview</span></h4>

                    <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                            <p className='subheading'> <span style={{fontWeight:'bold'}}>Total count of words</span><br/>
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
                                {fu_text_count}
                            </span>
                                <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip1}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Keywords that customers could notice after glimpsing</span>
                            {full_listKeywords}
                                <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip2}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                            </p>
                            <p className='subheading' style={{fontWeight:'bold'}}>Emotions that customers could read from the texts</p>
                            <span><FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/>sadness
                            &nbsp;
                            <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                            &nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                            &nbsp;
                            <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear
                                <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip3}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                            </span>
                            <p className='subheading' style={{fontWeight:'bold', marginTop:30}}>Syntax</p>
                            <span>{syntaxFonts1}
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip4}
                                >
                                    <Icon name='question circle outline' style={{color:'grey'}}/>
                                </OverlayTrigger>
                            </span>
                    </Card>


                    <h4 className='navheading' style={{marginBottom:10}}>All text in the homepage
                        &nbsp;&nbsp;
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip5}
                        >
                            <Icon name='question circle outline' style={{color:'grey'}}/>
                        </OverlayTrigger>
                    </h4> 
                        
                    {fu_text}
                </Segment>
        
                <Segment placeholder style={{backgroundColor:'white', width:'100%', backgroundColor:'#f0f7f2', textAlign:'center'}}>
                    <h4 className='heading center'><span className="highlight">Text Overview</span></h4>

                    <Card style={{width:'100%', paddingTop:10, paddingBottom:10, paddingLeft:10, paddingRight:10, textAlign:'left'}}>
                            <p className='subheading'> <span style={{fontWeight:'bold'}}>Total count of words</span><br/>
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
                                {fu_text_count2}
                            </span>
                            </p>
                            <p className='subheading'><span style={{fontWeight:'bold'}}>Keywords that customers could notice after glimpsing</span>
                            {full_listKeywords2}
                            </p>
                            <p className='subheading' style={{fontWeight:'bold'}}>Emotions that customers could read from the texts</p>
                            <span><FontAwesomeIcon icon={faSadTear} style={{color:'#ababab', fontSize:'30px'}}/>sadness
                            &nbsp;
                            <FontAwesomeIcon icon={faSmile} style={{color:'#26A69A', fontSize:'30px'}}/> joy
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faAngry} style={{color:'#ababab', fontSize:'30px'}}/> angry
                            &nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faMehRollingEyes} style={{color:'#ababab', fontSize:'30px'}}/> disgust
                            &nbsp;
                            <FontAwesomeIcon icon={faFrownOpen} style={{color:'#ababab', fontSize:'30px'}}/> fear</span>
                            <p className='subheading' style={{fontWeight:'bold', marginTop:30}}>Syntax</p>
                            <span>{syntaxFonts2}</span>
                    </Card>

                    <h4 className='navheading' style={{marginBottom:10, marginTop:25}}>All text in the homepage</h4> 
                    {fu_text2}
                </Segment>

                <div className="row" style={{marginBottom:300}}>
                <div style={{ display: "flex" }}>
                    <Button color='teal' 
                        size="small"
                        style={{ marginLeft: "auto" }}
                        onClick={()=> {
                            this.props.history.push({
                                pathname: "/dashboard_typographies"
                                })
                        }}
                    >Next: Typographies</Button>
                </div>
            </div>
                
                <div style={{height:5}}>
            </div>
            </div>
        </>
    )

  }
}

export default Comparison_texts;



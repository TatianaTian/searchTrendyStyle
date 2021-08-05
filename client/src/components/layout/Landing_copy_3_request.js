import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch, faCheckCircle, faHourglassHalf, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import Select from 'react-select';
import AnalysisContext from '../context/AnalysisContext';
import { Form, Input, Icon, Segment } from 'semantic-ui-react'


const options = [
  { value: 'Animals & Pet Supplies', label: 'Animals & Pet Supplies' },
  { value: 'Apparel', label: 'Apparel' },
  { value: 'Baby & Toddler', label: 'Baby & Toddler' },
  { value: 'Electronics & Accessories', label: 'Electronics & Accessories' },
  { value: 'Fashion Accessories', label: 'Fashion Accessories' },
  { value: 'Food & Beverages', label: 'Food & Beverages' },
  { value: 'Furniture & Home & Arts', label: 'Furniture & Home & Arts' },
  { value: 'Health & Beauty', label: 'Health & Beauty' },
  { value: 'Luggage & Bags', label: 'Luggage & Bags' },
  { value: 'Office/School Supplies', label: 'Office/School Supplies' },
  { value: 'Shoes', label: 'Shoes' },
  { value: 'Sporting Goods', label: 'Sporting Goods' },
  { value: 'Toys & Games', label: 'Toys & Games' },
];




const width = window.innerWidth
const height = window.innerHeight

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      url: "",
      loading: false,
      error_message:'',
      window: false,
      email: '',
      thankYou: false,
      emailError: '',
      selectedOption: null,
      progress: 5,
      image_num: 0,
      value: null,
      select: null,
      invitation_code: null,
      review_example: localStorage.getItem('review_example')? true : false,
      AS_example: localStorage.getItem('AS_example')? true : false
    };
  }

  static contextType = AnalysisContext;
  
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };  

  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`,
    }) 
  }

  handleSubmission = () => {

    //console.log('this.state.url: ', this.state.url)
    //console.log('this.state.selectedOption: ', this.state.selectedOption)
    //console.log('this.state.invitation_code: ', this.state.invitation_code)

    //console.log('submit this.state.review_example: ', this.state.review_example)
    //console.log('submit this.state.AS_example: ', this.state.AS_example)
    

    // check url is valid format
    if (this.state.url.substring(0,4) !== 'http'){
      this.setState({error_message:'Please enter a valid URL including http/https'})
    } else if (this.state.selectedOption === null){
      this.setState({error_message:'Please select a product category'})
    } else if (this.state.invitation_code.toUpperCase() !== 'CONVERTMORE' && this.state.invitation_code.toUpperCase() !== 'SELLMORE' && this.state.invitation_code.toUpperCase() !== 'TWEAKSTORE' ){ 
      this.setState({error_message:'Please enter a valid invitation code.'})
    } else if (/^http(s)?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(this.state.url)){
      this.setState({loading:true})
      this.setState({error_message:''})
      window.scrollTo(0, 0)

      {/* 记录leads数据 */}
      axios.post("/api/leads/initialize", {
          url: this.state.url,
          category: this.state.selectedOption.label,
          test: true,
          channel: this.state.invitation_code,
          review_example: this.state.review_example,
          review_example_button: this.state.review_example ? '1' : '0',
          AS_example: this.state.AS_example,
          AS_example_button: this.state.AS_example ? '1' : '0'
      }) 

      localStorage.setItem('product_category', this.state.selectedOption.label);

      {/* 分析店铺 */}
      axios
      .post("/api/scrape/scrape_png", {url: this.state.url})
      .then(res => {
        //console.log('res.data ', res.data)
        console.log('res.data(1,14) is ', res.data[0].substring(1,14))

        // if show error window
        
        if (res.data[0].substring(1,14) === 'cannot scrape'){
          console.log('cannot scrape')
          this.setState({loading:false})
          this.setState({window:true, progress: 5})
        } else {

          this.setState({progress: 34})
          console.log('this.state.progress: ', this.state.progress)

          axios
            .post("/api/scrape/scrape_pdf", {url: this.state.url})
            .then(res => {
              console.log('res.data: ', res.data)
              if (res.data[0].substring(1,14) === 'cannot scrape'){
                console.log('cannot scrape at pdf')
                this.setState({loading:false})
                this.setState({window:true, progress: 5})
              } else {

                this.setState({progress: 67})
                console.log('this.state.progress: ', this.state.progress)
 
                axios
                  .post("/api/scrape/scrape_pdf_p2", {url: this.state.url, num: res.data[1]})
                  .then(res=>{
                    if (res.data[0].substring(1,14) === 'cannot scrape'){
                      console.log('cannot scrape at pdf')
                      this.setState({loading:false})
                      this.setState({window:true, progress: 5})
                    } else {
                      console.log("res.data:")
                      console.log(res.data)
                      localStorage.setItem('store_url', res.data[1]);
                      localStorage.setItem('storefront_url', res.data[2]);
                      localStorage.setItem('product_category', this.state.selectedOption.label);

                      console.log('res.data[1]: ', res.data[1])
                      console.log('this.state.selectedOption.label: ', this.state.selectedOption.label)

                      this.props.history.push({
                        pathname: "/results",
                        state: { store: res.data[1], category: this.state.selectedOption.label }
                      })

                      {/* 记录进入results页面 */}
                      axios.post("/api/leads/update", {
                        url: this.state.url,
                        item: 'reached_results'
                      })
                    }
                  })
                  .catch(err=>{
                    console.log('err: ', err)
                    //console.log('timeout')
                    this.setState({loading:false})
                    this.setState({window:true, progress: 5})

                    {/* 记录crash */}
                    axios.post("/api/leads/update", {
                      url: this.state.url,
                      item: 'crash'
                    })
                  })
              }
            })
            .catch(err=>{
              console.log('err: ', err)
              //console.log('timeout')
              this.setState({loading:false})
              this.setState({window:true, progress: 5})

              {/* 记录crash */}
              axios.post("/api/leads/update", {
                url: this.state.url,
                item: 'crash'
              })
            })
        }
      })
      .catch(err=>{
        console.log('err: ', err)
        //console.log('timeout')
        this.setState({loading:false})
        this.setState({window:true, progress: 5})

        {/* 记录crash */}
        axios.post("/api/leads/update", {
          url: this.state.url,
          item: 'crash'
        })
      }
      
      )
    } else {
      this.setState({error_message:'Please enter a valid website url'})
    }

  }

  handleChange2 = (e, { value }) => this.setState({ value })

  handleClickCrashLink = () => {
      {/* 记录点击crash链接 */}
      axios.post("/api/leads/update", {
        url: this.state.url,
        item: 'crash_link'
      })
  }

  handleExample = (item) => {
    {/* 记录点击example */}
    if (item === 'review'){
      axios.post("/api/leads/update", {
        url: this.state.url,
        item: 'review_example_button',
        value: '2'
      })
    } else if (item === 'as'){
      axios.post("/api/leads/update", {
        url: this.state.url,
        item: 'AS_example_button',
        value: '2'
      })
    }
  }

  render() {
    const { selectedOption } = this.state;
    //console.log('this.state.review_example: ', this.state.review_example)
    //console.log('this.state.AS_example: ', this.state.AS_example)

    //console.log('this.context: ', this.context)
    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        //width: state.selectProps.width,
        //borderBottom: '1px dotted pink',
        padding: 5,
        zIndex: 9999,
        textAlign:'left'
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
      },
      //control: styles => ({ ...styles, borderColor:'transparent', borderBottomColor:'#9E9E9E', height:60, marginTop: -22, backgroundColor:'#f0f7f2'}),
      control: styles => ({ ...styles, borderRadius: 3, borderColor:'#DEDEDF', height:62, marginTop:20}),
      indicatorSeparator: styles => ({...styles, borderColor:'red'}),
      placeholder: styles => ({...styles, color:'#c7c7c7'})
    }


    console.log('reload the page')
    //console.log("localStorage.getItem('review_example'): ", localStorage.getItem('review_example'))
    


    const ProgressBar = (props) => {
      return (
          <div className="progress-bar">
            <Filler percentage={props.percentage} />
          </div>
        )
    }
    
    const Filler = (props) => {
      return <div className="filler" style={{ width: `${props.percentage}%` }} />
    }

    


    const window_desktop = (
      <div className="square window" style={{backgroundColor:'white'}}>
        <span className="navheading">
          <img src={process.env.PUBLIC_URL + '/sad.png'} height="50px" style={{paddingBottom:'10px'}} alt='sad'/>
          <br/>
          Sorry, we are experiencing a high volume of review requests now and cannot review your online store at the moment.
          Please make sure it's a <span className="highlight">valid website url</span> and try again in <span className="highlight">30 seconds</span>.
          Or, <a href="https://forms.gle/EbFRqspc75kFEys28" onClick={this.handleClickCrashLink}>leave your store URL here</a> - we will send your store review results by email.
        </span>
        <div className="center">
          <br/>
          <Button 
            variant="outline-light" 
            size="sm" 
            style={{backgroundColor:'#1b1b1c', marginBottom:20}}
            onClick={()=>this.setState({window: false})}
            >Return</Button>
        </div>
      </div>
    )
 
    const window_mobile = (
      <div className="shadow" style={{backgroundColor:'white', position:'absolute', width:width*0.9, marginLeft: width*0.05, paddingLeft:10, paddingRight:10, paddingTop:10, paddingBottom:10, zIndex:9999, borderRadius:20}}>
        <span className="navheading">
          <img src={process.env.PUBLIC_URL + '/sad.png'} height="50px" style={{paddingBottom:'10px'}} alt='sad'/>
          <br/>
          Sorry, we are experiencing a high volume of review requests now and cannot review your online store at the moment.
          Please make sure it's a <span className="highlight">valid website url</span> and try again in <span className="highlight">30 seconds</span>.
          Or, <a href="https://forms.gle/EbFRqspc75kFEys28" onClick={this.handleClickCrashLink}>leave your store URL here</a> - we will send your store review results by email.
        </span>
        <div className="center">
          <br/>
          <Button 
            variant="outline-light" 
            size="sm" 
            style={{backgroundColor:'#1b1b1c'}}
            onClick={()=>this.setState({window: false})}
            >Return</Button>
        </div>
      </div>
    )



    const main_content =  (
      <div style={{backgroundColor:'#f0f7f2', marginTop:-50}}>
        <div style={{ height: "75vh", backgroundColor:'#f0f7f2', paddingTop:50}} className="">
        {this.state.window
          ? <>
              <div className="desktop-only">
                {window_desktop}
              </div>
              <div className="mobile-only">
                {window_mobile}
              </div>
            </>
          : null
        }

      
      <div className="desktop-only" style={{backgroundColor:'#f0f7f2', paddingTop:60}}>
        <br/>
        <br/>
      </div>
 
      <div style={{backgroundColor:'#f0f7f2'}}>
        <div className="row container">
          <div className="col m6 s12 center-align">
            <img src={process.env.PUBLIC_URL + '/round2.png'} className="round_image" alt='round'/>
          </div>

          <div className="col m6 s12 center-align" style={{color:"#1b1b1c", marginTop:20}}>
            <h3 className="heading h3" style={{lineHeight:"1.25"}}>Your automated <span className="highlight">agency</span> that <span className="highlight">reviews</span> your e-commerce store</h3>
            <br/>
            <p className="prompt navheading" style={{color:"#4A4D50", paddingLeft:"10px", paddingRight:"10px", fontWeight:"normal"}}>
              Find how to improve your store first impression, colors, images, texts, and typographies
            </p>
            <br/>
            <Form>
                <div style={{paddingLeft:20, paddingRight:20}}>
                  <Form.Field
                      control={Input}
                      label='Store URL'
                      placeholder='Your store URL (e.g. https://www.shopify.com/)'
                      onChange={(f, data)=>{
                        //console.log('a: ',a) 
                        //console.log('b: ', b)
                        this.setState({url: data.value})
                      }}
                  />
                </div>
                <div className="col s12 m6" style={{paddingLeft:20, paddingRight:20}}>
                  <p style={{fontWeight:'bold', marginBottom:-15, marginTop:15}}>Product category</p>
                  <Select
                      label=''
                      value={selectedOption}
                      onChange={this.handleChange}
                      options={options}
                      placeholder='Product category'
                      styles={customStyles}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                        ...theme.colors,
                          text: 'white',
                          primary75: '#26A69A',
                          primary50: '#26A69A',
                          primary25: '#26A69A',
                          primary: '#26A69A',
                        },
                      })}
                    />
                </div>
                <div className="col s12 m6" style={{marginTop:15, paddingLeft:20, paddingRight:20}}>
                  <Form.Field
                    control={Input}
                    label='Invitation code'
                    placeholder={`Invitation code`}
                    onChange={(f, data)=>{
                      this.setState({invitation_code: data.value})
                      //console.log('c: ',c) 
                      //console.log('d: ', d)
                    }}
                  />
                </div>

              {/*</Form.Group>*/}
              {this.state.error_message===''? null: <p style={{color:'red'}}>{this.state.error_message}</p>}
              <button
                style={{
                  borderRadius: "10px",
                  letterSpacing: "1.5px",
                  marginTop: "2rem",
                  fontWeight:'bold',
                }}
                className="btn waves-effect waves-light hoverable accent-3 button_analyze"
                onClick={this.handleSubmission}
              >
                Analyze
              </button>
            </Form>
      
          </div>
        </div>
        <br/>
        <br/>
      </div>


      <div style={{backgroundColor:'#f0f7f2', paddingBottom:40}}>
        <div className="row container" > 
          <div className="col m5 s12" style={{marginLeft: 0.05*width}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c"}}>
              <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/test.png'} className='image_feature_icon' alt='test'/> Reviews</p>
              <p style={{color:'#4B4B4B'}}>The automated agency benchmarks your store to the successful online stores in the same product category</p>
              <Button
                style={{marginRight: 20, backgroundColor:'#1b1b1c', color:'#ffffff', fontWeight:"bold", borderRadius:20}}
                variant="outline-light" 
                size="sm" 
                onClick={()=>{
                  localStorage.setItem('review_example', true)
                  this.props.history.push({
                    pathname: "/overview_example",
                  })

                  //this.props.history.push({
                  //  pathname: "/results",
                  //  state: { store: 'thewirelessway.org', category: this.state.selectedOption.label }
                  //})

                }}
                >
                Example
              </Button>
            </div>
          </div>
        
         <div className="col m5 s12" style={{marginLeft: 0.05*width}}>  
            <div className="center-align feature-square" style={{color:"#1b1b1c"}}>
            <p className="prompt" style={{fontWeight:'bold'}}><img src={process.env.PUBLIC_URL + '/strategy_list.png'} className='image_feature_icon' alt='strategy_list'/> Actionable Strategies</p>
            <p style={{color:'#4B4B4B'}}>Then the automated agency finds what your store is missing and recommends actionable strategies</p>
                  <Button
                      style={{marginRight: 20, backgroundColor:'#1b1b1c', color:'#ffffff', fontWeight:"bold", borderRadius:20}}
                      variant="outline-light" 
                      size="sm" 
                      onClick={()=>{
                        localStorage.setItem('AS_example', true)
                        //this.setState({AS_example: true})
                        this.props.history.push({
                          pathname: "/as_example"
                        })
                      }}
                      >
                      Example
                  </Button>
            </div>
          </div>
        </div>
      </div>


      <br/>
      <br/>
      <br/>
      <br/>

      <div className="row center-align container"> 
          <h5 className='h5'>The automated agency evaluates...</h5>
      </ div>    
      <div className="row container">
        <div className="desktop-only">
          <div className="col m1">
          </div>
        </div>
        <div className="col m2 s6 center-align" style={{marginTop: 15}}>
          <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon' alt='layout'/>
          <p className="navheading">first impression</p>
        </div>
        <div className="col m2 s6 center-align" style={{marginTop: 15}}>
          <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon' alt='image_icon'/>
          <p className="navheading">image</p>
        </div>
        <div className="col m2 s6 center-align" style={{marginTop: 15}}>
          <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon' alt='color'/>
          <p className="navheading">color</p>
        </div>
        <div className="col m2 s6 center-align" style={{marginTop: 15}}>
          <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon' alt='typography'/>
          <p className="navheading">typography</p>
        </div>
        <div className="col m2 s6 center-align" style={{marginTop: 15}}>
          <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon' alt='text'/>
          <p className="navheading">text</p>
        </div>
      </div>


      <br/> 
      <br/>
      <br/>

      <div className="desktop-only">
        <br/>
        <br/>
      </div>

      <div className="row container">
        <h4 className="heading center-align h3">How it works</h4>
      </div>

      <div className="row container">
        <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
          <img src={process.env.PUBLIC_URL + '/website.png'} className='image_how_icon' alt='website'/>
        </div>
        <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
          <br/>
          <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Tell us about your store</h5>
          <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>Tell us your store URL and product categories. We will search for similar successful e-commerce stores and use those stores as the benchmark.</p>
        </div>
      </div>


      <div className="row mobile-only container">
        <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
          <img src={process.env.PUBLIC_URL + '/strategies.png'} className='image_how_icon' alt='strategies'/>
        </div>
        <div className="col s12 m6 center-align menu">
          <br/>
    
          <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Receive reviews & actionable strategies</h5>
          <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>The automated agency will evaluate your colors, typographies, layouts, and other visual contents against the most successful stores in your category, and recommend 
            actionable strategies on how to improve your store.
          </p>
        </div>
      </div>


      <div className="row desktop-only container">
        <div className="col s12 m6 center-align menu">
          <br/>
    
          <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Receive reviews & actionable strategies</h5>
          <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>The automated agency will evaluate your first impression, colors, images, typographies, and texts against the most successful stores in your category, and recommend 
            actionable strategies on how to improve your store.

          </p>
        </div>
        <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
          <img src={process.env.PUBLIC_URL + '/strategies.png'} className='image_how_icon' alt='strategies'/>
        </div>
      </div>

      <br/>
      <br/>

      <div className="row container">
        <br/>
        <p className="subheading center-align" style={{color:'grey'}}>Built with <FontAwesomeIcon icon={faHeart} style={{color:'#DD7B65'}}/> in New York City </p>
        <br/>
      </div>
    </div>
    </div>
    )


  
  if (this.state.loading){
    return <>
      <div className="desktop-only">
        <div className="loader-text navheading" style={{color:'#303030'}}>
          <p>Give us a second. We all wish it was as easy as pie <FontAwesomeIcon icon={faChartPie} style={{color:'#26A69A'}}/><br/>
          <span style={{color:'#909090', fontSize:'10px'}}>It will take about 2-3 minutes.</span>
          <ProgressBar percentage={this.state.progress} />

          <br/>
          <br/>
          Feel free to read the <a href="/overview_example" target="_blank">review example</a> and the <a href="/as_example" target="_blank">actionable strategy example</a> while waiting for your store 
          review <FontAwesomeIcon icon={faHourglassHalf} style={{color:'#26A69A'}}/>
          
          </p>
        </div>
        <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
        <br/>

        <div className="loader-text2">
          <div className="loading-card" style={{color:'#303030'}}>  
            <p className="navheading"> <span className="highlight">Free</span></p>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive 2 reviews about store colors, images, text, and typographies</span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Save the reviews after signup</span>
          </div>
        </div>

        <div className="loader-text3">
          <div className="loading-card" style={{color:'#303030'}}>  
            <p className="navheading"> <span className="highlight">Premium</span></p>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive additional 3 reviews</span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Obtain 1 well-prepared actionable strategy report</span><br/>
          </div>
        </div>
      </div>

      <div className="mobile-only">
        <div className="navheading" style={{color:'#303030', width:width*0.8, marginLeft: width*0.1, marginTop: 0.1*height}}>
          <p>Give us a second. We all wish it was as easy as pie <FontAwesomeIcon icon={faChartPie} style={{color:'#26A69A'}}/><br/>
          <span style={{color:'#909090', fontSize:'10px'}}>It will take about 2-3 minutes.</span>
          <ProgressBar percentage={this.state.progress} />

          <br/>
          <br/>
          Feel free to read the <a href="/overview_example" target="_blank">review example</a> and the <a href="/as_example" target="_blank">actionable strategy example</a> while waiting for your store 
          review <FontAwesomeIcon icon={faHourglassHalf} style={{color:'#26A69A'}}/>
          
          </p>
        </div>
        <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" alt='loader' style={{width: 120, height: 120, marginLeft:(width-120)/2}}/>
        <br/>

        <div >
          <div style={{backgroundColor:'#f0f7f2', color:'#4A4D50', width:width*0.8, marginLeft: width*0.1, paddingLeft:15, paddingRight:15, paddingTop:15, paddingBottom:15, borderRadius: 15}}>  
            <h3 className="navheading"> <span className="highlight">Free</span></h3>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp;&nbsp; Receive 2 reviews about store colors, images, text, and typographies</span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp;&nbsp; Save the reviews after signup</span>
          </div>
        </div>

        <div >
          <p style={{backgroundColor:'#f0f7f2', color:'#4A4D50', width:width*0.8, marginLeft: width*0.1, paddingLeft:15, paddingRight:15, paddingTop:15, paddingBottom:15, borderRadius: 15, marginTop:20}}>  
            <h3 className="navheading"> <span className="highlight">Premium</span></h3>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp;&nbsp; Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp;&nbsp; Receive additional 3 reviews</span><br/>
            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> &nbsp;&nbsp; Obtain 1 well-prepared actionable strategy report</span><br/>
          </p>
        </div>
      </div>

      <div className="overlay" style={{opacity:0.05}}>
        {main_content}
      </div>
      </>
  } else{
    return <>
    {main_content}
    </>
  }
  }
}

export default Landing;

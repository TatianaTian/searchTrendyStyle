import React, { Component } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import Scroll from 'react-scroll';
const ScrollLink = Scroll.Link;


class Analysis extends Component {

  constructor(props) {
    super(props);
    console.log('props.location.state ', props.location.state)
    this.state = {
      colors: props.location.state,
      emailError:'',
      thankYou:false,
      errorMessage:false
    };
  }

  render() {
    let colors = []
    let url_str = ''
    const n = this.state.colors.search('`@')
    const m = this.state.colors.search(';;;;;')
    let words = this.state.colors.substring(m+5, n)
    let emotions = words.split(',');
    


    const onEmailChange = e => {
      this.setState({ email: e.target.value });
    };

    const getOnList = e =>{
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/.test(this.state.email)){
        axios.post("/api/users/waitlist", {email: this.state.email})
        this.setState({thankYou: true})
      } 
      else {
        this.setState({thankYou: true})
      }
    }

    for (var i=0; i<this.state.colors.length-8; i++){
      var color = this.state.colors.substring(i,i+7)
      if (/#[a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9]/.test(color)){
        if (!colors.includes(color)){
          colors.push(color)
        }
      }
    }

    if (this.state.colors.substring(n+2, n+6)==='http'){
      url_str = this.state.colors.substring(n+2, )
    }

    colors.sort();

    const listItems = colors.map((color) =>
      color !== '#FFFFFF' ?
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
      :
      null
    );

    const listEmotions = emotions.map((emotion) =>
      <span style={{
        display: "inline-block", 
        borderRadius: "5px",
        backgroundColor:'#f0f7f2',
        paddingLeft:'15px',
        paddingRight:'15px',
        paddingTop: '5px',
        paddingBottom: '5px',
        fontSize:'18px',
        fontFamily:'monospace',
        marginTop:'10px',
        marginRight:'10px'
        }}>
          {emotion}
        </span>
    );

    
    return (
      <div style={{ }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12">
            {url_str === ''? null : 
              <>
                <h5 className="navheading h5" style={{color:"#1b1b1c"}}>Store website</h5>
                <p className="subheading">{url_str}</p>
              </>
            }
          <h5 className="navheading h5" style={{color:"#1b1b1c", marginTop: "30px"}}>Theme colors used in the store</h5>

          <div style={{
            backgroundColor:'#f0f7f2',
            marginTop: "30px",
            paddingTop: "30px",
            paddingBottom: "30px",
            borderRadius:"20px",
            paddingRight: "10px"
            }}
            className="color_section"
            >
            {listItems}
          </div>

          <h5 className="navheading h5" style={{color:"#1b1b1c", marginTop: "30px"}}>Customers' emotions triggered by your store colors</h5>

          <div style={{
            paddingTop: "20px",
            paddingBottom: "30px",
            borderRadius:"20px",
            }}>
            {listEmotions}
          </div>

          <br/>
          <br/>

          <div className="col s12 center"> 
            <span className="heading highlight h3" style={{color:"#1b1b1c", display:"inline-block"}}>Not</span><span className="heading" style={{color:"#1b1b1c", fontSize:"30px"}}> the right emotions?</span>
          </div>

          <br/>
          <br/>

          <div className="row center-align" style={{paddingTop: "50px"}}> 
            <h5 className='h5'>The automated agency will tweak your...</h5>
          </ div>    

          <div className="row">
            <div className="col m3 s6 center-align">
              <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon' alt='color'/>
              <p className="navheading">color</p>
            </div>
            <div className="col m3 s6 center-align">
              <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon' alt='typography'/>
              <p className="navheading">typography</p>
            </div>
            <div className="col m3 s6 center-align">
              <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon' alt='layout'/>
              <p className="navheading">layout</p>
            </div>
            <div className="col m3 s6 center-align">
              <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon' alt='image_icon'/>
              <p className="navheading">image</p>
            </div>
          </div>



          <Element id='early-access' name='early-access'>
            <div className="row center-align">
              <div className="col m3 s1">
              </div>

              {this.state.thankYou
              ?  
              <div className="col m6 s10" style={{backgroundColor:'#f0f7f2', borderRadius:"20px", paddingTop:"10px", paddingBottom:"30px"}}>
                <img src={process.env.PUBLIC_URL + '/celebrate.png'} height="80px" alt='celebrate'/>
                <h4 className="heading center-align get_early_access">Thank you for joining our early access list!</h4>
                <p style={{color:'#4B4B4B'}}>We will let you know as soon as we beta launch the automated e-commerce agency</p>
              </div>

              :  
              <div className="col m6 s10" style={{backgroundColor:'#f0f7f2', borderRadius:"20px", paddingTop:"10px", paddingBottom:"30px"}}>
                <h4 className="heading center-align get_early_access">Get early access</h4>
                <p style={{color:'#4B4B4B'}} className="mobile-only text">Build high revenue e-commerce stores with an automated agency!</p>
                <p style={{color:'#4B4B4B'}} className="desktop-only text">Your automated and affordable e-commerce agency that tweaks your store and recommends actionable strategies to build high revenue e-commerce stores!</p>
                <form className="text">
                  <div className="input-field col s12">
                    <input
                      onChange={onEmailChange}
                      value={this.state.email}
                      id="url"
                      type="email"
                    />
                    <label htmlFor="url" className="subheading">Email address </label>
                  </div>
                  
                  <div className="col s12 heading" style={{ paddingLeft: "11.250px" }}>
                    <button
                      style={{
                        borderRadius: "30px",
                        backgroundColor:"#1b1b1c",
                        borderColor:"#1b1b1c",
                        color:'white',
                      }}
                      type="submit"
                      className="waves-effect waves-light hoverable accent-3 button_access_nav"
                      onClick={getOnList}
                    >
                      <p className="navheading">Get early access</p>
                    </button>
                  </div>
                </form>
              </div>
              }

              <div className="col m3 s1">
              </div>
            </div>
           </Element>

          <br/>

          <div className="row">
            <div className="col m4 s12">
              <div className="feature-square center">                    
                  <span className="heading"> <img src={process.env.PUBLIC_URL + '/trophy.png'} className='image_feature_icon' alt='trophy'/> High-standard</span>  
                  <p>Benchmark your store to the most successful e-commerce stores in your category</p>
              </div>
            </div>
            <div className="col m4 s12">
              <div className="feature-square center">     
              <span className="heading"> <img src={process.env.PUBLIC_URL + '/test.png'} className='image_feature_icon' alt='test'/> Accurate</span>               
                <p>A/B test your visual contents and pinpoint the styles that convert the best</p>
              </div>
            </div>
            <div className="col m4 s12">
              <div className="feature-square center">                    
              <span className="heading"> <img src={process.env.PUBLIC_URL + '/money.png'} className='image_feature_icon' alt='money'/> Affordable</span>  
                <p>Eliminate traditionally expensive human consulting with superior technology</p>
              </div>
            </div>
          </div>
 
          <div className="row">
            <br/>
            <h4 className="heading center-align h3">How it works</h4>
          </div>

          <div className="row">
            <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
              <img src={process.env.PUBLIC_URL + '/website.png'} className='image_how_icon' alt='website'/>
            </div>
            <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
              <br/>
          
          
              <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Tell us about your store</h5>
              <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>Let us know your product types and target customers. We will search for similar successful e-commerce stores and use those stores as the benchmark.</p>
            </div>
          </div>

          <br/>

          <div className="row mobile-only">
            <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
              <img src={process.env.PUBLIC_URL + '/strategies.png'} className='image_how_icon' alt='strategies'/>
            </div>
            <div className="col s12 m6 center-align menu">
              <br/>
        
              <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Receive actionable strategies</h5>
              <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>The automated agency will evaluate your colors, typographies, layouts, and other visual contents against the most successful stores in your category, and recommend 
                actionable strategies on how to improve your store.
              </p>
            </div>
          </div>


          <div className="row desktop-only">
            <div className="col s12 m6 center-align menu">
              <br/>
        
              <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Receive actionable strategies</h5>
              <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>The automated agency will evaluate your colors, typographies, layouts, and other visual contents against the most successful stores in your category, and recommend 
                actionable strategies on how to improve your store.
              </p>
            </div>
            <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
              <img src={process.env.PUBLIC_URL + '/strategies.png'} className='image_how_icon' alt='strategies'/>
            </div>
          </div>


          <br/>

          <div className="row">
            <div className="col s12 m6 center-align menu" style={{color:"#1b1b1c"}}>
              <img src={process.env.PUBLIC_URL + '/fix3.png'} className='image_how_icon' alt='fix'/>
            </div>
            <div className="col s12 m6 center-align" style={{color:"#1b1b1c"}}>
              <br/>
      
              <h5 className="navheading h5 text" style={{textAlign:"left", color:'#4B4B4B'}}>Fix problems with one click</h5>
              <p className="subheading text" style={{textAlign:"left", color:'#4B4B4B'}}>Use our A/B simple testing tools to test recommended colors, typographies, layouts and images, and find the best visual contents that convert your customers!</p>
            </div>
          </div>

          <br/>
          <br/>
          <br/>
        </div>

        <div className="row center"> 
          <ScrollLink 
            to="early-access" 
            spy={true} 
            smooth={true} 
            duration={500} 
          >
            <button
              style={{
                borderRadius: "30px",
                backgroundColor:"#1b1b1c",
                borderColor:"#1b1b1c",
                color:'white',
              }}
              type="submit"
              className="waves-effect waves-light hoverable accent-3 button_access_nav"
            >
              <p className="navheading">Get early access</p>
            </button>
          </ScrollLink> 
        </div>


        <div className="row">
          <br/>
          <p className="subheading center-align" style={{color:'grey'}}>Built with <FontAwesomeIcon icon={faHeart} style={{color:'#DD7B65'}}/> in New York City </p>
          <br/>
        </div>
        </div>
      </div>
    );
  }
}

export default Analysis;

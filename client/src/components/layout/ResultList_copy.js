import React, { Component, useContext } from "react";
import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_signup_free from './Result_signup_free';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Segment } from 'semantic-ui-react';


class ResultList extends Component {
  static contextType = SigninContext;

  constructor() {
    super();
    this.state = {
        inbox: false,
        unlock_button: false,
        signup: false,
        email: null,
        password: null,
        repeatPwd: null,
        name:'tati',
        goPremium: false,
        signup_free: false,
        inbox_done: false,
        emailf:'',
        passwordf: '',
        repeatPwdf: ''
    };
  }

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.repeatPwd,
      paid: false,
      doneSurvey: this.context.survey

    };

    this.props.registerUser(newUser, this.props.history);
  };

  onSubmitFree = e => {
    e.preventDefault();

    const newUser = {
      email: this.state.emailf,
      password: this.state.passwordf,
      password2: this.state.repeatPwdf,
      paid: false,
      doneSurvey: this.context.survey
    };

    this.props.registerUser(newUser, this.props.history);
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const store_url = localStorage.getItem('store_url');
    const storefront_url = localStorage.getItem('storefront_url');

    console.log('storefront_url: ', storefront_url)
    

    const premium = (
        <div className ="container row">
              <div className="col m8 s12 payment-card" style={{paddingLeft:'25px', paddingRight:'25px', paddingTop: '25px'}}>

                <div className="col s6" >
                  <h5 className='heading'><span className="highlight">Premium</span></h5>
                  </div>
                  <div className="col s6" style={{textAlign:"right"}}>
                    <h5 className='heading' style={{marginRight: 20}}><span className="highlight">5 USD</span></h5>
                  </div>
                  
                  <div style={{marginLeft:'10px'}}>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> All features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> 3 additional reviews</span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> 1 well-prepared actionable strategy report</span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Superior refund policy</span>
                  </div>
                <br/>
              
  
          <div className="center">
                  <a
                  href="http://localhost:3000/strategy_example"
                  target="_blank"
                  >
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'#1b1b1c', color:'#fff'}}
                    >Read Strategy Example</Button>
                    </a>
    
              <br/>
              <br/>
                  <Button 
                      variant="outline-light" 
                      size="sm" 
                      //style={{marginTop:'20px'}}
                      onClick={()=> {
                          this.setState({signup:true})
                      }}
                      >Go Premium</Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                    style={{
                      
                      borderRadius: "3px",
                      letterSpacing: "1px",
                      marginTop: "1rem",
                      borderWidth:'0px',
                      backgroundColor:'#e9f6ef',
                      marginBottom: '30px'
                    }}
                    onClick={()=> {
                      this.setState({unlock_button:false})
                      this.setState({signup:false})
                  }}
                  >
                    Cancel
                  </button>
              </div>
          </div>
    
        </div>   
      )


    const sendToInbox = (
      <>
      <Button 
      variant="outline-light" 
      size="sm" 
      style={{backgroundColor:'#1b1b1c'}}
      onClick={()=>{this.state.inbox? this.setState({inbox: false}): this.setState({inbox: true})}}
      >
      Send to my inbox
      </Button>
      {this.state.inbox_done? <p style={{color:'green'}}><FontAwesomeIcon icon={faCheck}/> email sent your inbox</p>: null}

      {this.state.inbox? 
      <>      
      <div className="row">

          <div className="col m12 center ">
              <div className="row">
                  <form>
                      <div className="input-field col s12" >
                      <input
                          value={this.state.email}
                         // onChange={value=>{
                         //   console.log(value.target.value)
                         //   this.setState({email: value}
                          //    )}}
                          onChange={this.onChange}
                          id="email"
                          type="email"
                          />
                          <label>Email address </label>
                      </div>
                  </form> 
                  <br/>
       
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={()=>{
                    this.setState({inbox: false})
                    this.setState({inbox_done: true})
                  }}
                  >
                  Send
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                        style={{
                          
                          borderRadius: "3px",
                          letterSpacing: "1px",
                          marginTop: "1rem",
                          borderWidth:'0px',
                          backgroundColor:'#ffffff'
                        }}
                        onClick={()=> {
                          this.setState({inbox: false})
                      }}
                      >
                        Cancel
                      </button>
                  
              </div>
          </div>
      </div>
      </>
      : null
      }
  </>
    )



    const sign_up = (
      <>
      <Button 
      variant="outline-light" 
      size="sm" 
      style={{backgroundColor:'#1b1b1c'}}
      onClick={()=>{this.state.signup_free? this.setState({signup_free: false}): this.setState({signup_free: true})}}
      >
      Sign up
      </Button>

      {this.state.signup_free? 
      <>


<form noValidate onSubmit={this.onSubmitFree}>
    
    <div className="input-field col s12">
    <input
        onChange={this.onChange}
        value={this.state.emailf}
        id="emailf"
        type="email"

    />
    <label htmlFor="email">Email</label>

    </div>
    <div className="input-field col s12">
    <input
        onChange={this.onChange}
        value={this.state.passwordf}
        id="passwordf"
        type="password"
    />
    <label htmlFor="password">Password</label>

    </div>
    <div className="input-field col s12">

    <input
        onChange={this.onChange}
        value={this.state.repeatPwdf}
        id="repeatPwdf"
        type="password"
    />
    <label htmlFor="password2">Confirm Password</label>

    </div>
    <div className="col s12" style={{ paddingLeft: "11.250px" }}>

    </div>
    </form>

    <div className="center">
                      <Button 
                          variant="outline-light" 
                          size="sm" 
                          onClick={this.onSubmitFree}
                          >
                            Sign up</Button>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <button
                        style={{
                          borderRadius: "3px",
                          letterSpacing: "1px",
                          marginTop: "1rem",
                          borderWidth:'0px',
                          backgroundColor:'#ffffff'
                        }}
                        onClick={()=> {
                          this.setState({signup_free: false})
                      }}
                      >
                        Cancel
                      </button>

                      </div>
      </>
      : null
      }
  </>
    )





    const results = (

        <>
        <div className="container center">  

            <div style={{textAlign:'left', marginLeft:60, marginBottom: 30, marginTop: 30}}>
            <h5 className="prompt"><FontAwesomeIcon icon={faSearch} style={{color:'#80e98f'}}/> Store reviews for <span className="heading highlight" >{store_url}</span> is ready!
              Get started with the <span className='heading'>Free</span> reviews.
              </h5>
            </div>

            <div className="row free_square" >




              <Segment piled>


              <div style={{textAlign:"left", marginLeft: 20}}>
              <span className="row" >
              <div className="col s6" style={{marginLeft:-10}}>
                <h2 className='heading'>Free</h2>
                </div>
                <div className="col s6" style={{textAlign:"right"}}>
                  <h2 className='heading' style={{marginRight: 20}}>0 USD</h2>
                </div>
              </span>
              <div style={{color: '#696969'}}>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive 2 reviews about store colors, images, text, and typographies</span><br/>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Save the reviews after signup</span>
              </div>
              </div>
                
                
      
                
                </Segment>

                <div className="col m4 s12">
                <div className="result-card center">  
                <p className="prompt">Review 1</p>
                    <p>Compare store <span style={{textDecoration:'underline'}}>{store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.anthropologie.com</span></p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'#1b1b1c'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/comparison",
                          })
                    }}
                    >Read</Button>
                    <p></p>
                    <img src={process.env.PUBLIC_URL + '/example4.png'} width="100%" style={{paddingBottom:'10px'}} alt='example6'/>  
                </div>
                </div>

                <div className="col m4 s12">
                <div className="result-card center">     
                <p className="prompt">Review 2</p>
                    <p>Compare store <span style={{textDecoration:'underline'}}>{store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>shopthecurated.net</span></p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'#1b1b1c'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/survey"
                          })
                    }}
                    >Read</Button>
                    
                    <p></p>
                    <img src={process.env.PUBLIC_URL + '/example6.png'} width="100%" style={{paddingBottom:'10px'}} alt='example4'/>  
                </div>
                </div>


                <div className="col m4 s12">
                <div className="center">     
                  <p className="prompt">Sign up an account to save your reviews</p>
                    {sign_up}
                </div>
                </div>

                
              </div>
            <br/>



            <div className="row premium_square">
            <div style={{textAlign:"left", marginLeft: 20}}>
            <span className="row" >
              <div className="col s6" >
                <h5 className='heading'><span className="highlight">Premium</span></h5>
                </div>
                <div className="col s6" style={{textAlign:"right"}}>
                  <h5 className='heading' style={{marginRight: 20}}><span className="highlight">5 USD</span></h5>
                </div>
              </span>
              <div className="col s6" style={{color: '#696969'}}>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Include all features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Receive additional 3 reviews</span><br/>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Obtain 1 well-prepared actionable strategy report</span><br/>
              </div>
              <div className="col s6" style={{textAlign:"right"}}>
                <Button
                  style={{marginRight: 20, backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold"}}
                  variant="outline-light" 
                  size="sm" 
                  onClick={()=>this.setState({goPremium:true})}
                  >
                  Go Premium
                  </Button>
                </div>
              </div>


            
              <div className="col m12 s12">
                <div className="col m5 s12 result-card-strategy" style={{backgroundColor: "#ffffff", marginLeft: 20, marginRight: 20, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 25}}>                
                    <p className="prompt" style={{fontWeight:'bold'}}><span className="highlight">Actionable Strategies</span> for {store_url}</p>
                    <p >We benchmarked {store_url} to 20 successful online stores in the same product category. We found<span style={{textDecoration:'underline'}}> what {store_url} is missing</span> and recommended a list of actionable strategies. Check out our example below!</p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'#cfe5d5', color:'#1b1b1c'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/strategy_example"
                          })
                    }}
                    >Example</Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'grey', marginRight:'10px'}}
                    onClick={()=> {
                        this.setState({unlock_button:true})
                    }}
                    >Check strategies</Button>
                </div> 
                <div className="col m6 s12"> 

                <img 
                    src={storefront_url}
                    width="100%" style={{paddingBottom:'10px'}}alt='storefront'/>

                </div> 
            </div>



                <div className="col m4 s12">
                <div className="result-card-white center">                    
                <p className="prompt">Review 3</p>
                    <p>Compare store <span style={{textDecoration:'underline'}}>{store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.everlane.com</span></p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'grey'}}
                    onClick={()=> {
                        this.setState({unlock_button:true})
                    }}
                    >Read</Button>
                    <p></p>
                    <img src={process.env.PUBLIC_URL + '/example3.png'} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                </div>
                </div>

                <div className="col m4 s12">
                <div className="result-card-white center">  
                <p className="prompt">Review 4</p>
                    <p>Compare store <span style={{textDecoration:'underline'}}>{store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.stories.com</span></p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'grey'}}
                    onClick={()=> {
                        this.setState({unlock_button:true})
                    }}
                    >Read</Button>
                     <p></p>
                    <img src={process.env.PUBLIC_URL + '/example5.png'} width="100%" style={{paddingBottom:'10px'}} alt='example5'/>  
                </div>
                </div>

                <div className="col m4 s12">
                <div className="result-card-white center">     
                <p className="prompt">Review 5</p>
                    <p>Compare store <span style={{textDecoration:'underline'}}>{store_url}</span> to <span className="highlight" style={{fontWeight:'bold'}}>tatianatian.com</span></p>
                    <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'grey'}}
                    onClick={()=> {
                        this.setState({unlock_button:true})
                    }}
                    >Read</Button>
                    <p></p>
                    <img src={process.env.PUBLIC_URL + '/example7.png'} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
                </div>
                </div>

            </div> 
        </div>
        </>
    )


    return (
        
      (this.state.unlock_button?
        (this.state.signup?
            <>
            <div className="payment">
            
            <Result_signup_premium 
            callback={this.onSubmit}
            setState_unlockButton={()=>this.setState({unlock_button:false})}
            setState_goPremium={()=>this.setState({goPremium:false})}
            setState_signUp={()=>this.setState({signup:false})}
            onEmailChange={(e)=>{
              this.setState({ email: e.target.value })
              console.log(e.target.value)
            }}
            onPwdChange={(e)=>{
              this.setState({ password: e.target.value })
              console.log(e.target.value)
            }}
            onRepPwdChange={(e)=>{
              this.setState({ repeatPwd: e.target.value })
              console.log(e.target.value)
            }}
            />
            </div>
                <div className="overlay">
                {results}
            </div>
            </>
            :
            <>
            <div className="payment">
            {premium}
            </div>
                <div className="overlay">
                {results}
            </div>
            </>
          )
        :

        (this.state.goPremium?
          <>
          <div className="payment">
          <Result_signup_premium 
          callback={this.onSubmit}
          setState_unlockButton={()=>this.setState({unlock_button:false})}
          setState_goPremium={()=>this.setState({goPremium:false})}
          setState_signUp={()=>this.setState({signup:false})}
          onEmailChange={(e)=>{
            this.setState({ email: e.target.value })
            console.log(e.target.value)
          }}
          onPwdChange={(e)=>{
            this.setState({ password: e.target.value })
            console.log(e.target.value)
          }}
          onRepPwdChange={(e)=>{
            this.setState({ repeatPwd: e.target.value })
            console.log(e.target.value)
          }}
          />
          </div>
              <div className="overlay">
              {results}
          </div>
          </>
          :
          <>
          {results}
          </>
          )
      )
      
    )

  }
}

//export default ResultList;


ResultList.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(ResultList));


/*

                <div className="col m4 s12">
                <div className="center">     
                  <p className="prompt">How to save the reviews</p>
                    <p><b>Send to email address</b><br/>
                    <span style={{color:'grey'}}>review link valid for <span className="highlight" style={{fontWeight:'bold'}}>7 days</span></span>
                    </p> 
                    
                    {sendToInbox}
                    <p>-OR-</p>
                    <p><b>Sign up</b><br/>
                    <span style={{color:'grey'}}>reviews saved in the account <span className="highlight" style={{fontWeight:'bold'}}>forever</span></span></p> 
                    
                    {sign_up}

                </div>
                </div>

            */


            /* 

                            <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> Forever storage of the reviews after signup</span><br/>
                <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> 7-day storage of the reviews in an URL sent to your email</span>
            
            */
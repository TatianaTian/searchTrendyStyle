import React, { Component, useContext } from "react";
import { Button} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_main from './Result_main';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';

const width = window.innerWidth
const height = window.innerHeight

var store_url
class Prompt extends Component {
  static contextType = SigninContext;

  constructor() {
    super();
    //console.log('this.props: ', this.props)
    /*
    this.state = {
        inbox: false,
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
    };*/

  }

  componentDidMount() {
    window.scrollTo(0, 0)
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

  handleExample = () => {
    axios.post("/api/leads/update", {
      url: store_url,
      item: 'AS_example_button',
      value: '6'
    })
  }

  render() {

    store_url = localStorage.getItem('store_url');
    const storefront_url = localStorage.getItem('storefront_url');

//width:450, marginLeft:150, marginTop: 80
    const premium = (
        <div className ="container row">
              <div className="col s12 payment-card" style={{paddingTop: 3, paddingBottom: 3, paddingLeft:3, paddingRight: 3}}>
              <Segment>
                <div className="col s6" >
                  <h3 className='heading'><span className="highlight">Premium</span></h3>
                  </div>
                  <div className="col s6" style={{textAlign:"right"}}>
                    <h3 className='heading' style={{marginRight: 20}}><span className="highlight">5 USD</span></h3>
                  </div>
                  
                  <div style={{marginLeft:'10px', marginTop: 10}}>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> All features in <span style={{color:'black'}}><b>Free</b></span></span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> 3 additional reviews</span><br/>
                    <span><FontAwesomeIcon icon={faCheckCircle} style={{color:'#26A69A'}}/> 1 well-prepared actionable strategy report</span><br/>
                  </div>
                  <br/>

                  <div className="center">
                  <a
                  href="/as_example"
                  target="_blank"
                  onClick={this.handleExample}
                  >
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    style={{backgroundColor:'#009688', color:'white'}}
                    >Strategy Example</Button>
                    </a>
                  <br/>
                  <br/>
                  <Button 
                      variant="outline-light" 
                      size="sm" 
                      style={{backgroundColor:'#80e98f', color:'#1b1b1b', fontWeight:'bold'}}
                      onClick={()=> {
                          //this.setState({signup:true})
                          axios.post("/api/leads/update", {
                            url: store_url,
                            item: 'go_premium_button',
                            value: '2'
                          })
                          this.props.history.push({
                            pathname: "/promptGoPremium"
                          })
                      }}
                      >Go Premium</Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <button
                    style={{
                      borderRadius: "3px",
                      letterSpacing: "1px",
                      marginTop: "1rem",
                      borderWidth:'0px',
                      backgroundColor:'white',
                      marginBottom: '30px'
                    }}
                    onClick={()=> {
                      this.props.history.push({
                        pathname: "/results"
                      })
                  }}
                  >
                    Cancel
                  </button>
              </div>
            </Segment>
          </div>
        </div>   
      )

// <div className="payment" style={{width:width}}>


    return ( 
        <>
          <div className="desktop-only" style={{width:0.5*width, marginLeft:0.25*width, marginTop: 0.2*height}}>
              {premium}
          </div>
          <div className="mobile-only" style={{width:width*0.95, marginLeft: width*0.025, marginTop: 0.2*height}}>
              {premium}
          </div>
          <div className="overlay">
            <Result_main 
                store_url={store_url}
                history={this.props.history}
            />
          </div>
        </>
    )
  }
}


Prompt.propTypes = {
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
)(withRouter(Prompt));


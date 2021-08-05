import React, { Component, useContext } from "react";
import { Button} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_free from './Result_signup_free';
import Result_payment_finish from './Result_payment_finish';
import Result_main from './Result_main';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser, loginUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';
import AsyncLocalStorage from '@createnextapp/async-local-storage'

const width = window.innerWidth
const height = window.innerHeight

class PromptFreeSignup extends Component {
  static contextType = SigninContext;

  constructor(props) {
    super(props);
    console.log('this.props: ', this.props)
    this.state = {
        //email: null,
        //password: null,
        //repeatPwd: null,
        //name:'tati',
        errorMsg:'',
        signIn: false
    };
 
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    console.log("in componentDidMount")
  }
  

  onSubmit = (email, password, repeatPwd, store, setMsg, name, category) => {
    //e.preventDefault();

    console.log('arrived onSubmit')

    axios.post("/api/leads/update", {
      url: store,
      item: 'signup_button',
      value: '2'
    })
    
    const newUser = {
        name: name,
        email: email,
        password: password,
        password2: repeatPwd,
        paid: false,
        doneSurvey: this.context.survey,
        premium: false,
        store: store,
        category: category
    };

    console.log('newUser: ', newUser)
    
    this.props.registerUser(newUser, setMsg, this.props.history);
  };

  setMsg = (msg) => {
    this.setState({errorMsg: msg})
  }

  onSubmitSignin = (email, password) => {
    const userData = {
      email: email,
      password: password
    };

    console.log('arrived onSubmitSignin')
    this.props.loginUser(userData, this.setMsg, this.props.history)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  readData = async () => {
    return await AsyncLocalStorage.getItem('PromptSignIn')
  }


  render() {
    
    const store_url = localStorage.getItem('store_url');
    const storefront_url = localStorage.getItem('storefront_url');

    //data = await AsyncLocalStorage.getItem('@key') <div  style={{ width: width, marginLeft: -width*0.4}}>

    console.log('width: ', width)

    return ( 
        <>

        <div className="desktop-only" style={{width:1*width, marginLeft: width*0.12, marginTop: 0.08*height}}> 
          <Result_signup_free
              callback={this.onSubmit}
              setState_unlockButton={()=>this.setState({unlock_button:false})}
              setState_goPremium={()=>this.setState({goPremium:false})}
              setState_signUp={()=>this.setState({signup:false})}
              //signIn={this.state.signIn}
              //signIn= {this.readData()}
              signInAction={this.onSubmitSignin}
              navigate={(e)=>{
                  this.props.history.push({
                      pathname: "/results"
                  })
                  }}
              errorMsg = {this.state.errorMsg}
              />
        </div>
        
        <div className="mobile-only" style={{width:width*0.95, marginLeft: width*0.025, marginTop: 0.08*height}}>
          <Result_signup_free
              callback={this.onSubmit}
              setState_unlockButton={()=>this.setState({unlock_button:false})}
              setState_goPremium={()=>this.setState({goPremium:false})}
              setState_signUp={()=>this.setState({signup:false})}
              //signIn={this.state.signIn}
              //signIn= {this.readData()}
              signInAction={this.onSubmitSignin}
              navigate={(e)=>{
                  this.props.history.push({
                      pathname: "/results"
                  })
                  }}
              errorMsg = {this.state.errorMsg}
              />
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



PromptFreeSignup.propTypes = {
  loginUser: PropTypes.func.isRequired,
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
  { registerUser, loginUser }
)(withRouter(PromptFreeSignup));


import React, { Component, useContext } from "react";
import { Button} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_payment_finish from './Result_payment_finish';
import Result_main from './Result_main';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser, loginUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';


const width = window.innerWidth
const height = window.innerHeight

class PromptGoPremium extends Component {
  static contextType = SigninContext;

  constructor() {
    super();
    //console.log('this.props: ', this.props)
    this.state = {
        //email: null,
        //password: null,
        //repeatPwd: null,
        //name:'tati',
        errorMsg:'',
        finishPayment: false
    };
 
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    var query = new URLSearchParams(window.location.search);
    if (query.get("success")){
      var n = window.location.href.lastIndexOf("session_id=")
      const session_id = window.location.href.substring(n+11)
      var m = window.location.href.lastIndexOf("user_id=")
      const user_id = window.location.href.substring(m+8,n-1)

      console.log('session_id: ', session_id)
      console.log('user_id: ', user_id)
      axios
      .post("/api/checkout/check-session", {session_id, user_id})
      .then(res => {
        console.log('res: ', res)
        if (res.data.payment_status === 'paid'){
          this.setState({finishPayment: true})
        }
      })
    }
  }
  

  onSubmit = (email, password, repeatPwd, store, setMsg, name, category) => {
    //e.preventDefault();

    console.log('arrived onSubmit')
    axios.post("/api/leads/update", {
      url: store,
      item: 'signup_button',
      value: '3'
    })
    
    const newUser = {
        name: name,
        email: email,
        password: password,
        password2: repeatPwd,
        paid: false,
        doneSurvey: this.context.survey,
        premium: true,
        store: store,
        category: category
    };

    console.log('newUser: ', newUser)
    
    this.props.registerUser(newUser, setMsg, this.props.history);
  };



  onSubmitSignin = (email, password, setMsg) => {
    const userData = {
      email: email,
      password: password
    };

    console.log('arrived onSubmitSignin')
    this.props.loginUser(userData, setMsg, this.props.history)
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

//  componentDidMount() {

    /*
    if (query.get("success=true")) {
      console.log("hi it's success")
      return <p>Success!</p>
      
      console.log('success!')
      const updateUser = {
        id: localStorage.getItem('id'),
        paid: true 
      };
      this.props.updateUser(updateUser, this.props.history);
      localStorage.setItem('paid', 'true')
      this.setState({congrats:true})

    }
    if (query.get("canceled")) {
      this.setState({cancel:true})
    }*/
  //}

  render() {
    console.log('this.state.finishPayment: ', this.state.finishPayment)
    const store_url = localStorage.getItem('store_url');
    const storefront_url = localStorage.getItem('storefront_url');

    if (this.state.finishPayment) {
      return (
        <>
        <div className="desktop-only" style={{width:0.8*width, marginLeft:0.1*width, marginTop: 0.1*height}}>
          <Result_payment_finish 
            signIn={this.onSubmitSignin}
          />
        </div>

        <div className="mobile-only" style={{width:0.95*width, marginLeft:0.025*width, marginTop: 0.1*height}}>
          <Result_payment_finish 
            signIn={this.onSubmitSignin}
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
    // <div className="payment" style={{width:width*1.4, textAlign:'center', marginLeft:-width*0.6}}>

    return ( 
        <>    
          <div className="desktop-only" style={{width:width*0.8, marginLeft: width*0.1, marginTop: 0.08*height}}>
            <Result_signup_premium 
                callback={this.onSubmit}
                setState_unlockButton={()=>this.setState({unlock_button:false})}
                setState_goPremium={()=>this.setState({goPremium:false})}
                setState_signUp={()=>this.setState({signup:false})}
                navigate={(e)=>{
                    this.props.history.push({
                        pathname: "/results"
                    })
                    }}
                errorMsg = {this.state.errorMsg}
            />
          </div>

          <div className="mobile-only" style={{width:width*0.95, marginLeft: width*0.025, marginTop: 0.08*height}}>
            <Result_signup_premium 
                callback={this.onSubmit}
                setState_unlockButton={()=>this.setState({unlock_button:false})}
                setState_goPremium={()=>this.setState({goPremium:false})}
                setState_signUp={()=>this.setState({signup:false})}
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



PromptGoPremium.propTypes = {
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
)(withRouter(PromptGoPremium));


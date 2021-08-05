import React, { Component, useContext } from "react";
import { Button} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_signup_free from './Result_signup_free';
import Result_main from './Result_main';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';
import AsyncLocalStorage from '@createnextapp/async-local-storage';


var store_url, product_category
var image_urls = null
class ResultList extends Component {
  static contextType = SigninContext;

  constructor(props) {
    console.log('props: ', props)
    super();
    this.state = {
      image_urls: null,
      url: props.location.state ? props.location.state.store : null,
      c: props.location.state? props.location.state.category : null,
    };
  }

  componentDidMount = async () =>{
    store_url = this.state.url
    if (!store_url){
      store_url = localStorage.getItem('store_url');
    }

    console.log('store_url in componentDidMount: ', store_url)

    product_category = this.state.c
    if (!product_category){
      product_category = localStorage.getItem('product_category');
    }

    if (!this.state.url){
      this.setState({url: localStorage.getItem('store_url')})
    }

    if (!this.state.c){
      this.setState({c: localStorage.getItem('product_category')})
    }

    console.log('product_category in componentDidMount: ', product_category)
    
    localStorage.setItem('review_num', '')
    await AsyncLocalStorage.setItem('PromptSignIn', false)
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

    console.log('start to call result main store_url: ', this.state.url)
    console.log('start to call result main product_category: ', this.state.c)

    if (!this.state.url || !this.state.c){
      return null
    }

    return (
      <>
        <Result_main 
          store_url={this.state.url}
          history={this.props.history}
          product_category={this.state.c}
        />
      </>        
      )
  }
}

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



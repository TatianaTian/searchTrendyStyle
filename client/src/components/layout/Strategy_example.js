import React, { Component, useContext, useState, useEffect } from "react";
import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext';
import { Link } from "react-router-dom";



class Strategy_example extends Component {
  constructor() {
    super();
    this.state = {

    };
  }
  static contextType = SigninContext;

  render() {

    //const testSignin = useContext(SigninContext)
    //console.log('testSignin is: ', testSignin)

    const onChange = e => {
        this.setState({ url: e.target.value });
    };
      
    const onEmailChange = e => {
      this.setState({ email: e.target.value });
    };

    return (
        <>
        <div className="container">  
        {this.context.signin?
                <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                dashboard
                </Link>
            :
            <Link to="/results" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to
            dashboard
          </Link>
            }

                <div className="col s12">
                    <div className="result-card" style={{paddingTop: '25px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px'}}>
                        <h5 className='navheading'>Actionable Strategies</h5>
                    </div>
                </div>
        </div>
        </>
    )

  }
}

export default Strategy_example;



//{this.context.signin?
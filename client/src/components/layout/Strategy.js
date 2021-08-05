import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';

class Strategy extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {

    const onChange = e => {
        this.setState({ url: e.target.value });
    };
      
    const onEmailChange = e => {
      this.setState({ email: e.target.value });
    };

    return (
        <>
        <div className="container center">  

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

export default Strategy;




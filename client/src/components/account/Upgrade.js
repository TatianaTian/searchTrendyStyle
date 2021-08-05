import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Icon, Step, Divider, Grid, Segment, Header } from 'semantic-ui-react';

class Upgrade extends Component {
  static contextType = SigninContext;

  constructor(props) {
    super();
    this.state = {
        unlock_button: false,
        user: props.auth.user,
        congrats: false,
        cancel: false,
        contactUs: false
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    localStorage.setItem('signedIn', false)
    this.props.logoutUser(this.props.history);

    //this.props.history.push({
    //  pathname: "/results",
    //})
    
  };
  

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {

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
    }
  }
 

 
  render() {
    //const { user } = this.props.auth;
    console.log('this.state.user.doneSurvey: ', this.state.user.doneSurvey)
    localStorage.setItem('id', this.state.user.id)

    //console.log('window.innerHeight: ', window.innerHeight)
   
    return (      
      <>
      <div className="row" style={{backgroundColor:'#f0f7f2', height:window.innerHeight*1}}>
        <div className="col s2">
          <div class="ui left fixed vertical menu" style={{width:window.innerWidth/12*2}}>
            <div class="item">
                <Link
                    to="/dashboard2"
                >
                <img src={process.env.PUBLIC_URL + '/logo.png'} height="35px" alt='logo' style={{marginBottom: 30, marginTop: 20}}/>
              </Link>
            </div>
            <div class="center" style={{marginBottom: 50}}>
            <h3>Hi <span className="highlight">{this.state.user.name}</span>, <br/>
           welcome back!</h3>
            <p><b>Store url</b>: {this.state.user.store}</p>
            </div>
            <a class="item" href="http://localhost:3000/dashboard2" ><i class="list alternate outline icon"></i>Reviews</a>
            <a class="item" href="http://localhost:3000/dashboard3"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
            <a class="item active" href="http://localhost:3000/account"><i class="user outline icon"></i>Account</a>
          </div>
        </div>

        <div className="col s10" style={{backgroundColor:'#f0f7f2'}}>
            <div style={{paddingRight:50, paddingLeft:50}}>


                <div placeholder style={{backgroundColor:'#f0f7f2'}}>
                  <div style={{textAlign:"left", marginLeft: 20, marginTop: 50}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h2 className='heading'>Premium</h2>
                      </div>
                    </span>
                    </div>

                  <Grid columns={2} stackable textAlign=''>

                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>

                          </div>

                      </Grid.Column>

                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>

                          </div>

                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <div style={{marginLeft:10}}>
                    <button 
                        class="ui button teal"
                        onClick={()=>this.setState({contactUs: !this.state.contactUs})}
                    >Contact us</button>
                </div>

                {
                    this.state.contactUs
                    ?

                    <Grid columns={2} stackable textAlign=''>

                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>
                            <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Email address</p> 
                            <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>hello@haloy.co</p> 
                            <br/>
                            <p className="subheading" style={{marginLeft:10, fontWeight:'bold'}}>It's our goal to get back to you within 24 hours with a solution to your problem.</p> 
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                    :
                    null
                }


                  <div style={{marginLeft:10, marginTop:20}}>
                    <button 
                        class="ui button"
                        onClick={this.onLogoutClick}
                    >Log out</button>
                  </div>
                </div>

              </div>
   


        </div>
      </div>
      </>
    )
  }
}

Upgrade.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Upgrade);



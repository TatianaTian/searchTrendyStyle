import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Icon, Step, Divider, Grid, Segment, Header, Button } from 'semantic-ui-react';
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Dashboard_sidebar from '../dashboard/Dashboard_sidebar';

const width = window.innerWidth
const height = window.innerHeight

class Account extends Component {
  static contextType = SigninContext;

  constructor(props) {
     console.log('props: ', props.location.state)

    super();

    var premiumCard = false
    if (props.location.state){
        premiumCard = true
    }
    this.state = {
        user: props.auth.user,
        cancel: false,
        contactUs: false,
        ribbon: false,
        session_id: "",
        refreshed: false,
        showMenu: false
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

  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`,
    })
  }
 

  componentDidMount() {
    /*
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      var n = window.location.href.lastIndexOf("session_id=")
      const session_id = window.location.href.substring(n+11)
      console.log('session_id: ', session_id)
      axios
      .post("/api/checkout/check-session", {session_id, user_id: this.state.user.id})
      .then(res => {
        console.log('res: ', res)
        if (res.data.payment_status === 'paid'){
          this.setState({ribbon: true, tempPaid: true})
        }
      })
    }*/
    // refresh data
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    .then(res => {

        //console.log('res: ', res)
        this.setState({user: res.data, refreshed: true})
      
    })
    .catch(err =>
        console.log('err: ', err)
    );
  }
 
 

    // function to handle stripe payment
    handleClick = async (event) => {
      //const stripePromise = loadStripe("pk_test_51HeAu7EMg9ur2p3ywJ0E2bYT3MoYhlP7CJgh9pmoENmJNeZ9M3EWp9X6MiCR7phpWP0wZzvl7XPDspHGpMsoEXwY00aYEwjxIy");
      const stripePromise = loadStripe("pk_live_51HeAu7EMg9ur2p3yIZ0qQ3tJecu5WUZR9FE4vKsdrV8lSbiBYfYEOXSv9Zj4SJzl8xyHyhayoBbU8BF0ilo33MLX00q8vfcxwq");
      const stripe = await stripePromise;
  
      axios
          .post("/api/checkout/create-session", {afterSignup: true, user_id: this.state.user.id})
          //.post("/api/checkout/create-session")
          .then(async res => {
              //console.log('res create session: ', res)
              //this.setState({session_id: res.data.id})
              //const session = res.json()
              
              const session = res.data
              const result = await stripe.redirectToCheckout({
                  sessionId: session.id,
              });
              
              if (result.error) {
                  // If `redirectToCheckout` fails due to a browser or network
                  // error, display the localized error message to your customer
                  // using `result.error.message`.
                  console.log('error')
              }
          }) 
  };

 
  render() {
    //const { user } = this.props.auth;
    //console.log('this.state.user: ', this.state.user)
    //localStorage.setItem('id', this.state.user.id)

    //console.log('this.state.user: ', this.state.user)  

   
    if (!this.state.refreshed){
       return null
    }
    
    return (      
      <>
      <div className="row" style={{backgroundColor:'#F9F4EF', color:'#0C4A34', height:window.innerHeight*1}}>

      <div className="desktop-only">
          <div className="col s2">
            <Dashboard_sidebar active={3} user={this.state.user}/>
          </div>
          <div className="col s10" style={{backgroundColor:'#F9F4EF'}}>
            <div style={{paddingRight:50, paddingLeft:50}}>
                <div placeholder style={{backgroundColor:'#F9F4EF'}}>
                  <div style={{textAlign:"left", marginLeft: 20, marginTop: 50}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h2 className='heading'>Account</h2>
                      </div>
                    </span>
                    </div>
                  <Grid columns={2} stackable textAlign=''>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20, paddingBottom:35}}>
                          <br/>
                            <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Brand</p> 
                            <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>{this.state.user.store}</p> 

                            <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Email address</p> 
                            <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>{this.state.user.email}</p> 

                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <div style={{marginLeft:10}}>
                    <button
                      style={{
                        borderRadius: "5px",
                        letterSpacing: "1.5px",
                        marginTop: "2rem",
                        fontWeight:'bold',
                        backgroundColor:'#0C4A34',
                        color:'white',
                        height: '40px',
                        paddingLeft:'25px',
                        paddingRight:'25px',
                        marginLeft:'8px'
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                      onClick={()=>this.setState({contactUs: !this.state.contactUs})}
                    >
                      <h4>Contact us</h4>
                    </button>
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


                  <div style={{marginLeft:10, marginTop:10}}>
                    <button
                      style={{
                        borderRadius: "5px",
                        letterSpacing: "1.5px",
                        marginTop: "2rem",
                        fontWeight:'bold',
                        backgroundColor:'#C8C8C8',
                        color:'white',
                        height: '40px',
                        paddingLeft:'25px',
                        paddingRight:'25px',
                        marginLeft:'8px'
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                      onClick={this.onLogoutClick}
                    >
                      <h4>Log out</h4>
                    </button>
                  </div>
                </div>

              </div>
          </div>
        </div>

        <div className="mobile-only">
          <div style={{marginLeft:20, paddingTop:20}}>
            <Button
              style={{backgroundColor:'transparent'}}
              onClick={()=>this.setState({showMenu: !this.state.showMenu})}
            >
              <i class="bars icon" style={{fontSize:25, color:'#1b1b1c'}}/> 
            </Button>
            {
              this.state.showMenu
              ?    
            <div className="shadow-light" style={{backgroundColor:'white', width:0.8*width, borderRadius:10, paddingLeft:0, paddingRight:0, marginLeft:0.05*width, marginTop: 10, paddingBottom: 10}}>
              <div class="item">
                <Link
                    to="/"
                  >
                    <img src={process.env.PUBLIC_URL + '/vic-logo2.png'} height="25px" alt='logo' style={{marginBottom: 10, marginTop: 20, marginLeft:10}}/>
                </Link>
              </div>
              <div class="center" style={{marginBottom: 50}}>
                <h3>Hi <span className="highlight">{this.state.user.store}</span>!</h3>
              </div>
              <Segment vertical style={{textAlign:'center'}}>
                <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('dashboard_search')}><i class="search icon"></i>Start a Request</a>
              </Segment>
              <Segment vertical style={{textAlign:'center'}}>
                <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('dashboard_history')}><i class="list icon"></i>My Request</a>
              </Segment>
              <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
                <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('account')}><i class="user outline icon"></i>Account</a>
              </Segment>
            </div>
              : null
            }
          </div>

          <div className="col s12">
            <div style={{paddingRight:40, paddingLeft:0}}>
                <div>
                  <div style={{textAlign:"left", marginLeft: 20, marginTop: 50, color:'#0C4A34'}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h2 className='heading'>Account</h2>
                      </div>
                    </span>
                    </div>

                  <Grid columns={2} stackable textAlign=''>
                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', color:'black', borderRadius:5, marginLeft:0.07*width-22, width: 0.85*width, marginTop: 20, marginBottom:20}}>
                            <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Brand</p> 
                            <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>{this.state.user.store}</p> 

                            <p className="subheading" style={{marginLeft:10, color:'gray', marginBottom:-3}}>Email address</p> 
                            <p className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>{this.state.user.email}</p> 
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <div style={{marginLeft:20}}>
                    <button 
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          marginTop: "2rem",
                          fontWeight:'bold',
                          backgroundColor:'#0C4A34',
                          color:'white',
                          height: '40px',
                          paddingLeft:'25px',
                          paddingRight:'25px',
                          marginLeft:'8px'
                          }}
                        className="btn waves-effect waves-light hoverable accent-3"
                        onClick={()=>this.setState({contactUs: !this.state.contactUs})}
                    >Contact us</button>
                </div>

                {
                    this.state.contactUs
                    ?

                    <Grid columns={2} stackable textAlign=''>

                    <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0.07*width-22, width: 0.85*width, marginTop: 20, marginBottom:10}}>
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


                  <div style={{marginLeft:20, marginBottom: 50}}>
                    <button 
                      style={{
                        borderRadius: "5px",
                        letterSpacing: "1.5px",
                        marginTop: "2rem",
                        fontWeight:'bold',
                        backgroundColor:'#C8C8C8',
                        color:'white',
                        height: '40px',
                        paddingLeft:'25px',
                        paddingRight:'25px',
                        marginLeft:'8px'
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                      onClick={this.onLogoutClick}
                    >Log out</button>
                  </div>
                </div>

              </div>
            </div>
        
        </div>
      </div>
      </>
    )
  }
}

Account.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Account);



import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Button } from 'react-bootstrap';
import { Grid, Icon } from 'semantic-ui-react'


const width = window.innerWidth

class Navbar extends Component {

  render() {
    const start = window.location.href.lastIndexOf("/")
    const last = window.location.href.length
    const location = window.location.href.substring(start+1, last);
    //console.log('in Navbar: ',location)

    const locations = ['dashboard_search', 'dashboard_history', 'account']
    const locations_signup_in = ['login', 'register']
    //const account_exp = /^account/
    //const dashboard_exp = /^dashboard/
    
    const desktop_navbar = (
      
        locations.includes(location)?
        null
        :
          <div className="desktop-only" style={{textAlign:"right", backgroundColor:'#FEFDFD'}}>
            <div style={{backgroundColor:"#FEFDFD"}}>
              <Grid>
                <Grid.Column width={2}>
                <Link
                  to="/"
                  style={{
                    fontFamily: "monospace",
                    marginLeft:10,
                  }}
                >
                  <img src={process.env.PUBLIC_URL + '/vic-logo2.png'} height="40px" alt='logo' style={{marginTop:20}}/>
                </Link>
              </Grid.Column>
              <Grid.Column width={14}>

              </Grid.Column>
              </Grid>
                </div>
              </div>
    )

    const mobile_navbar = (
      
      locations.includes(location)?
      null
      :
        <div className="mobile-only" style={{backgroundColor:'#FEFDFD', paddingTop:10, paddingBottom:-40}}>
          
          <Grid column={3}>
            <Grid.Column width={12}>
              <Link
                to="/"
                style={{
                  fontFamily: "monospace",
                  marginLeft:10,
                }}
              >
                <img src={process.env.PUBLIC_URL + '/vic-logo2.png'} height="30px" alt='logo'/>
              </Link>
            </Grid.Column>
          </Grid>
          <br/>
        </div>
    )
    return (
      <>
      {desktop_navbar}
      {mobile_navbar}
    </>
    );
  }
}

export default Navbar;
//<div className="navbar-fixed"></div>  <nav className="z-depth-0"></nav>

/*
<div style={{textAlign:"right"}}>
<ScrollLink 
    to="early-access" 
    spy={true} 
    smooth={true} 
    duration={500} 
    //className='some-class' 
    //activeClass='some-active-class'
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
    <p className="navheading">Sign up</p>
  </button>
</ScrollLink>  
</div>


            <ScrollLink 
                to="early-access" 
                spy={true} 
                smooth={true} 
                duration={500} 
                //className='some-class' 
                //activeClass='some-active-class'
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
                <p className="navheading">Sign up</p>
              </button>
            </ScrollLink> 





                        <Link 
                to="/comparison_example"
                spy={true} 
                smooth={true} 
                duration={500} 
                //className='some-class' 
                //activeClass='some-active-class'
              >
               <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{
                    backgroundColor:'#1b1b1c',
                    borderRadius: "10px",
                    fontWeight:'bold',
                  }}
                  >Example
                </Button>
            </Link>  



*/
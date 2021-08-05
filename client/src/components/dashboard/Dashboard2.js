import React, { Component } from "react";
import { Button} from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SigninContext from '../context/SigninContext';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Icon, Grid, Button as Button2, Accordion } from 'semantic-ui-react';
import axios from "axios";
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';
import urls from '../../data/urls.json';

const width = window.innerWidth
class Dashboard2 extends Component {
  static contextType = SigninContext;
  constructor(props) {
    super();
    console.log('props: ', props)
    this.state = {

    };
  }


  componentDidMount() {


  }
 
  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`,
    })
  }

 
  render() {
  
  
    return (      
      <>
      <div className="desktop-only">
        <Grid>
          <Grid.Row className="center-align">
            <Grid.Column width={5}/>
            <Grid.Column width={6}>
              <button
                  style={{
                    borderRadius: "5px",
                    letterSpacing: "1.5px",
                    //marginTop: "3rem",
                    fontWeight:'bold',
                    backgroundColor:'#F9F4EF',
                    color:'#0C4A34',
                    height: '50px',
                    paddingLeft:'16px',
                    paddingRight:'16px',
                    marginRight:'20px'
                  }}
                className="btn waves-effect waves-light hoverable accent-3"
                onClick={() => this.handleNavigation('')}
              >
                  <h4>Home Page</h4>
              </button>
            </Grid.Column>
            <Grid.Column width={5}/>
          </Grid.Row>
          <img src={process.env.PUBLIC_URL + '/404.png'} width="40%" alt='logo' style={{marginBottom: 10, marginTop: 20, marginLeft:0.3*width}}/>
          <Grid.Row className="center-align">
            <Grid.Column width={5}/>
            <Grid.Column width={6}>
                    <button
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          fontWeight:'bold',
                          marginTop:'10px',
                          backgroundColor:'#DDE3DD',
                          color:'#0c4a34',
                          height: '40px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                          marginRight:'8px',
                          marginLeft:'8px'
                        }}
                        className="btn waves-effect waves-light hoverable accent-3"
                        onClick={() => this.handleNavigation('dashboard_search')}
                    >
                        <h4>Request New Styles</h4>
                    </button>
                    <a href="https://products.vicgarments.com/collections/all-products">
                    <button
                      style={{
                        borderRadius: "5px",
                        letterSpacing: "1.5px",
                        fontWeight:'bold',
                        marginTop:'10px',
                        backgroundColor:'#0C4A34',
                        color:'white',
                        height: '40px',
                        paddingLeft:'16px',
                        paddingRight:'16px',
                        marginLeft:'8px',
                        marginRight:'8px',
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                    >
                      <h4>Browse Existing Styles</h4>
                    </button>
                    </a>
            </Grid.Column>
            <Grid.Column width={5}/>
          </Grid.Row>
        </Grid>
        </div>

        <div className="mobile-only">
        <img src={process.env.PUBLIC_URL + '/404.png'} width="80%" alt='logo' style={{marginBottom: 10, marginTop: 20, marginLeft:0.1*width}}/>
        <Grid>
          <Grid.Row className="center-align">
            <Grid.Column width={2}/>
            <Grid.Column width={12}>
              <button
                  style={{
                    borderRadius: "5px",
                    letterSpacing: "1.5px",
                    //marginTop: "3rem",
                    fontWeight:'bold',
                    backgroundColor:'#DDE3DD',
                    color:'#0C4A34',
                    height: '40px',
                    paddingLeft:'16px',
                    paddingRight:'16px',
                    
                  }}
                className="btn waves-effect waves-light hoverable accent-3"
                onClick={() => this.handleNavigation('')}
              >
                  <h4>Go To Home</h4>
              </button>
            </Grid.Column>
            <Grid.Column width={2}/>
          </Grid.Row>
        </Grid>
        </div>
      </>
    )
  }
}

Dashboard2.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard2);




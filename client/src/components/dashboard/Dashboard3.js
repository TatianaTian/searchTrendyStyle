import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import SigninContext from '../context/SigninContext';
import { Icon, Divider, Grid, Segment, Button, Accordion, List, Card, Image, Table, Label, Menu, Checkbox } from 'semantic-ui-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
import { Doughnut, Bar} from 'react-chartjs-2';
import AS from '../../data/actionableStrategies.json';
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';


const height = window.innerHeight
const width = window.innerWidth


class Dashboard3 extends Component {
  static contextType = SigninContext;

  constructor(props) {
    console.log('props: ', props)
    super();
    this.state = {
        user: props.auth.user,
        historyData: null,
    };
  }

  

  componentDidMount() {
    console.log('did mount: ', this.state.user)
    {/* 更新用户数据 */}
    window.scrollTo(0, 0)
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    
    .then(res => {
        this.setState({user: res.data})
        console.log('res.data: ', res.data)
    })
    .catch(err => {console.log('err: ', err)});
  
    axios
    .post("/api/users/requestHistory", {userId: this.state.user.id})
    .then(res => {
        //this.setState({user: res.data})
        //console.log('res.data: ', res.data)
        this.setState({historyData: res.data})
    })
    .catch(err =>
      {
        console.log('err: ', err)
        this.setState({error: true})
      }
    );
  }

  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`,
    })
  }

   

  render() { 


    console.log("user: ", this.state.user)

      var history_results = null
      if (this.state.historyData){
        history_results = this.state.historyData.map((request, i)=>{
          return (
            <Grid.Column width={4}>
              <Card style={{marginTop:25}} className="center-align">
                <Image src={request.requested_style_url} wrapped ui={false} />
              <Card.Content>
                <Card.Header style={{color:'#0C4A34'}}>Style {i+1}</Card.Header>
                <Card.Meta>
                  {
                    request.delivered_details?
                    <Label color='green' horizontal style={{marginTop:10}}>
                      Done
                    </Label>:
                    <Label color='yellow' horizontal style={{marginTop:10}}>
                      Searching
                    </Label>
                  }
                </Card.Meta>
              </Card.Content>
            </Card>
          </Grid.Column>
          )
        })  
      }

      return <>
              <div className="desktop-only row">
                <div className="col s2">
                    <Dashboard_sidebar active={2} user={this.state.user}/>
                </div>
                <div className="col s10" style={{backgroundColor:'#F9F4EF', minHeight:window.innerHeight*1, color:'#0C4A34', paddingBottom:100}}>
                  <div style={{marginLeft:30}}> 
                    {
                      this.state.user.collection_link?
                    <a href={this.state.user.collection_link} target='_blank'>
                    <button
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          marginTop: "3rem",
                          fontWeight:'bold',
                          backgroundColor:'#0C4A34',
                          color:'white',
                          height: '50px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                      //onClick={() => this.handleNavigation('dashboard')}
                    >
                        <h4>Personal Store Link</h4>
                    </button>
                    </a>:
                      <p style={{marginTop: 50}}>Sit back and relax. Personal store link will be available within 24 hours.</p>
                    }
                    <p className="heading" style={{fontSize:20, marginTop:50}}>My Request</p>
                    <Grid style={{marginTop:10, backgroundColor:'#F9F4EF'}}>
                      {history_results}
                    </Grid>
                  </div>
                </div>
              </div>

              <div className="mobile-only" style={{backgroundColor:'#F9F4EF', minHeight:window.innerHeight*1, paddingBottom:100}}>
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
                    <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
                      <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('dashboard_history')}><i class="list icon"></i>My Request</a>
                    </Segment>
                    <Segment vertical style={{textAlign:'center'}}>
                      <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('account')}><i class="user outline icon"></i>Account</a>
                    </Segment>
                  </div>
                    : null
                  }

                  <div className="col s12">
                    <div style={{paddingRight:40, paddingLeft:0}}>
                    {
                      this.state.user.collection_link?
                    <a href={this.state.user.collection_link} target='_blank'>
                    <button
                        style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          marginTop: "3rem",
                          fontWeight:'bold',
                          backgroundColor:'#0C4A34',
                          color:'white',
                          height: '50px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                          marginLeft:'20px'
                        }}
                      className="btn waves-effect waves-light hoverable accent-3"
                      //onClick={() => this.handleNavigation('dashboard')}
                    >
                        <h4>Personal Store Link</h4>
                    </button>
                    </a>:
                      <p style={{marginTop: 50}}>Sit back and relax. Personal store link will be available within 24 hours.</p>
                    }
                      <div>
                        <div style={{textAlign:"left", marginLeft: 20, marginTop: 50, color:'#0C4A34'}}>
                          <span className="row" >
                              <h2 className='heading'>My Request</h2>
                          </span>
                        </div>
                        <Grid columns={1}>
                            <Grid.Column style={{marginLeft:20}}>
                              {history_results}
                            </Grid.Column>
                        </Grid>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          </>
        }
      }

Dashboard3.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard3);

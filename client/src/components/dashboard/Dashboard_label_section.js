import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import SigninContext from '../context/SigninContext';
import { Step, Grid, Segment, Checkbox, List, Menu } from 'semantic-ui-react';
import axios from "axios";
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';
import AS from '../../data/actionableStrategies.json';


const width = window.innerWidth

class Dashboard_label_section extends Component {
  static contextType = SigninContext;

  constructor(props) {
     console.log('props: ', props.location.state)

    super();

    var premiumCard = false
    if (props.location.state){
        premiumCard = true
    }
    this.state = {
        unlock_button: false,
        user: props.auth.user,
        congrats: false,
        cancel: false,
        contactUs: false,
        premium_card: premiumCard,
        ribbon: false,
        session_id: "",
        sections:[],
        style: [],
        err_msg:'',
        activeItem: '3'
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    localStorage.setItem('signedIn', false)
    this.props.logoutUser(this.props.history);
  };

  saveLabelResults = () =>{
      {/* validate所有checkbox是否有矛盾 */}
      if (this.state.sections.includes('7') && this.state.sections.length>1){
        this.setState({err_msg:"'My homepage includes none of the sections above' cannot be checked off with other sections at the same time."})
      } else if (this.state.sections.length === 0) {
        this.setState({err_msg:"Please follow the instructions to check off the sections"})
      } else if (this.state.style.length === 0){
        this.setState({err_msg:"Please follow the instructions to check off the style"})
      } else if (this.state.style.length > 1){
        this.setState({err_msg:"Please pick no more than one style"})
      } else {
        axios
            .post("/api/users/update", {id: this.state.user.id, sections: this.state.sections, style: this.state.style})
            .then(res => {
                axios
                .post("/api/users/update", {id: this.state.user.id, doneLabel: true})
                .then(res => {
                    this.props.history.push({
                        pathname: "/dashboard_history"
                        })
                })
                .catch(err =>
                    console.log('err: ', err)
                );
            })
            .catch(err =>
                console.log('err: ', err)
            );
        }
    }

  checkboxChangeHandler1 = (event, data) => {
    if (data.checked){
        this.setState({ sections: [...this.state.sections, data.name]})
      } else {
        var currentSections = this.state.sections
        const index = currentSections.indexOf(data.name);
        if (index > -1) {
            currentSections.splice(index, 1);
        }
        this.setState({ sections: currentSections });
      }
  };

  checkboxChangeHandler2 = (event, data) => {
      if (data.checked){
        this.setState({ style: [...this.state.style, data.name]})
      } else {
        var currentStyle = this.state.style
        const index = currentStyle.indexOf(data.name);
        if (index > -1) {
            currentStyle.splice(index, 1);
        }
        this.setState({ style: currentStyle });
      }
  };
 

  componentDidMount() {
    // refresh data
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    .then(res => {
        this.setState({user: res.data})
    })
    .catch(err =>
        console.log('err: ', err)
    );

  }
 

 
  render() {

    console.log('this.state.sections: ', this.state.sections)
    console.log('this.state.style: ', this.state.style)

    return (      
      <>
      <div className="row" style={{backgroundColor:'#f0f7f2'}}>

      <div className="desktop-only">
          <div className="col s2">
                <Dashboard_sidebar active={2} user={this.state.user}/>
          </div>
          <div className="col s10">

            <div style={{textAlign:'center', marginTop:30}}>
                <Step.Group ordered size='small'>
                    <Step completed>
                    <Step.Content>
                        <Step.Title>Label image</Step.Title>
                    </Step.Content>
                    </Step>

                    <Step completed>
                    <Step.Content>
                        <Step.Title>Label text</Step.Title>
                    </Step.Content>
                    </Step>

                    <Step active>
                    <Step.Content>
                        <Step.Title>Label Homepage Content Type</Step.Title>
                    </Step.Content>
                    </Step>
                </Step.Group>
            </div>

        <Grid verticalAlign='middle' style={{marginTop:30}}> 
          <Grid.Row>
            <Grid.Column width={5}>
                <Segment raised style={{marginLeft:25, marginRight:20}}>
                    <p style={{padding:20, color: '#696969'}}>
                    <h3 style={{fontWeight:'bold', color: '#1b1b1c'}}>Before we finalize your personalized strategies...</h3>

                    While we have already learnt a lot about {this.state.user.store}, we will need your inputs to finalize our recommendations so that they are perfectly tailored for you! The whole process should take less than 2 minutes. 

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label Homepage Content Type</span></h3>
                    Your homepage is your storefront. The quality, presentation, and content of the homepage play a critical role in your conversion rate. A website may offer the best products at the lowest prices, but if the homepage does not communicate it effectively, customers won't be able to find out.
                    <br/>
                    <br/>
                    From the list on the right side, check the content you already have on your homepage.

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Brand identity</span></h3>
                    Your brand is your baby and you know them the best! How would you describe your brand and how would you like your customers to perceive your brand? <b>(only pick one)</b>
                    <List celled style={{width:'90%', marginLeft:''}}>
                        <List.Item>
                            <List.Content style={{padding:3}}>
                                <List.Header>
                                    <Checkbox style={{textAlign:'left', paddingTop:5}}
                                        label= {AS[this.state.user.category].Theme_color.style_1_name}
                                        name='s1'
                                        onChange={this.checkboxChangeHandler2}
                                        />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content style={{padding:3}}>
                                <List.Header>
                                    <Checkbox style={{textAlign:'left', paddingTop:5}}
                                        label={AS[this.state.user.category].Theme_color.style_2_name}
                                        name='s2'
                                        onChange={this.checkboxChangeHandler2}
                                        />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Content style={{padding:3}}>
                                <List.Header>
                                    <Checkbox style={{textAlign:'left', paddingTop:5}}
                                        label= {AS[this.state.user.category].Theme_color.style_3_name}
                                        name='s3'
                                        onChange={this.checkboxChangeHandler2}
                                        />
                                </List.Header>
                            </List.Content>
                        </List.Item>
                        </List>
                    </p>
                </Segment>
            </Grid.Column>
            <Grid.Column width={10}>


              <List celled style={{width:'80%', marginLeft:'10%'}}>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Value proposition'
                                name='1'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Sale section'
                                name='2'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Product features, uniqueness or advantages'
                                name='3'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Social proof (reviews or testimonials)'
                                name='4'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Best seller section'
                                name='5'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Return policy'
                                name='6'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='My homepage includes none of the sections above'
                                name='7'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>

    

            <div style={{ textAlign:'center', marginTop: 50 }}>
                {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
                <Button 
                    style={{ marginLeft: 0, backgroundColor:'#E0E1E2', color:'#5A5A5A'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/dashboard_label_text"
                            })
                    }}
                >Last: Label text</Button>
                <Button color='teal' 
                    style={{ marginLeft: width/2.5 }}
                    onClick={()=> {this.saveLabelResults()}}
                >Done</Button>
            </div>
            <div style={{backgroundColor:'#f0f7f2', height:500}}>

            </div>

          </div>
        </div>



        <div className="mobile-only">
            <Dashboard_sidebar_mobile active={2} user={this.state.user}/>
          <div className="col s12">
            <div style={{textAlign:'center', marginTop:10}}>
                <Menu compact icon='labeled'>
                    <Menu.Item
                        name='1'
                        active={this.state.activeItem === '1'}
                        onClick={this.handleItemClick}
                    >
                        Label image
                    </Menu.Item>

                    <Menu.Item
                        name='2'
                        active={this.state.activeItem === '2'}
                        onClick={this.handleItemClick}
                    >
                        Label text
                    </Menu.Item>

                    <Menu.Item
                        name='3'
                        active={this.state.activeItem === '3'}
                        onClick={this.handleItemClick}
                    >

                        Label Content Type
                    </Menu.Item>
                </Menu>
            </div>

        <Grid verticalAlign='middle' style={{marginTop:20}}>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={14}>
                <Segment raised>
                    <p style={{padding:20, color: '#696969'}}>
                    <h3 style={{fontWeight:'bold', color: '#1b1b1c'}}>Before we finalize your personalized strategies...</h3>

                    While we have already learnt a lot about {this.state.user.store}, we will need your inputs to finalize our recommendations so that they are perfectly tailored for you! The whole process should take less than 2 minutes. 

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label Homepage Content Type</span></h3>
                    Your homepage is your storefront. The quality, presentation, and content of the homepage play a critical role in your conversion rate. A website may offer the best products at the lowest prices, but if the homepage does not communicate it effectively, customers won't be able to find out.
                    <br/>
                    <br/>
                    From the list below, check the content you already have on your homepage.
                    </p>
                </Segment>

                <List celled style={{width:'80%', marginLeft:'10%'}}>


                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Value proposition'
                                name='1'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Sale section'
                                name='2'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Product features, uniqueness or advantages'
                                name='3'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Social proof (reviews or testimonials)'
                                name='4'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Best seller section'
                                name='5'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='Return policy'
                                name='6'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content style={{padding:6}}>
                        <List.Header>
                            <Checkbox style={{textAlign:'left', paddingTop:5}}
                                label='My homepage includes none of the sections above'
                                name='7'
                                onChange={this.checkboxChangeHandler1}
                                />
                        </List.Header>
                    </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
            </Grid>

            <Grid verticalAlign='middle' style={{marginTop:20}}>
                <Grid.Column width={1}>
                </Grid.Column>
                <Grid.Column width={14}>
                    <Segment raised>
                        <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Brand identity</span></h3>
                        Your brand is your baby and you know them the best! How would you describe your brand and how would you like your customers to perceive your brand? <b>(only pick one)</b>
                    </Segment>
                        <List celled style={{width:'90%', marginLeft:''}}>
                            <List.Item>
                                <List.Content style={{padding:3}}>
                                    <List.Header>
                                        <Checkbox style={{textAlign:'left', paddingTop:5}}
                                            label={AS[this.state.user.category].Theme_color.style_1_name}
                                            name='s1'
                                            onChange={this.checkboxChangeHandler2}
                                            />
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content style={{padding:3}}>
                                    <List.Header>
                                        <Checkbox style={{textAlign:'left', paddingTop:5}}
                                            label={AS[this.state.user.category].Theme_color.style_2_name}
                                            name='s2'
                                            onChange={this.checkboxChangeHandler2}
                                            />
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content style={{padding:3}}>
                                    <List.Header>
                                        <Checkbox style={{textAlign:'left', paddingTop:5}}
                                            label={AS[this.state.user.category].Theme_color.style_3_name}
                                            name='s3'
                                            onChange={this.checkboxChangeHandler2}
                                            />
                                    </List.Header>
                                </List.Content>
                            </List.Item>
                            </List>
                </Grid.Column>
            </Grid>
    

            <div style={{ textAlign:'center', marginTop: 20, marginBottom:100 }}>
                {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
                <Button 
                    style={{ marginLeft: 0, backgroundColor:'#E0E1E2', color:'#5A5A5A'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/dashboard_label_text"
                            })
                    }}
                >Last</Button>
                <Button color='teal' 
                    style={{marginLeft:"20%"}}
                    onClick={()=> {this.saveLabelResults()}}
                >Done</Button>
            </div>
          

          </div>
        </div>


      </div>
      </>
    )
  }
}

Dashboard_label_section.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard_label_section);



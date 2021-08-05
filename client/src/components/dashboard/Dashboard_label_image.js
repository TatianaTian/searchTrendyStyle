import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import SigninContext from '../context/SigninContext';
import { Step, Grid, Segment, Checkbox, Menu } from 'semantic-ui-react';
import axios from "axios";
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';
import Dashboard_sidebar from './Dashboard_sidebar';


class Dashboard_label extends Component {
  static contextType = SigninContext;

  constructor(props) {
     console.log('props: ', props)

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
        urls: [],
        checkBox:[],
        checkBox0: false,
        err_msg: '',
        activeItem: '1'
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
    //console.log('user: ', this.state.user)
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    .then(res => {
          this.setState({user: res.data}) 

          {/* 读取有objects的图片链接 */}
          axios
          .post("/api/scrape/fetch_objects_urls", {store_url: res.data.store})
          .then(res => {
              console.log('res: ', res)
              this.setState({urls: res.data})
          })
          .catch(err =>
              console.log('err: ', err)
          );
    
    })
  }

  checkboxChangeHandler = (event, data) => {
    if (data.name === '0'){
      this.setState({ checkBox0: !this.state.checkBox0})
    } else {
      console.log('data: ',data)
      if (data.checked){
        this.setState({ checkBox: [...this.state.checkBox, data.name]})
      } else {
        var currentCheckBox = this.state.checkBox
        const index = currentCheckBox.indexOf(data.name);
        if (index > -1) {
          currentCheckBox.splice(index, 1);
        }
        this.setState({ checkBox: currentCheckBox });
      }
    }
  };

  handleLabelImage = () => {
    console.log('this.state.checkBox0: ', this.state.checkBox0)
    console.log('this.state.checkBox: ', this.state.checkBox)
    {/* validate所有checkbox是否有矛盾 */}
    if (this.state.checkBox0 && this.state.checkBox.length>0){
      this.setState({err_msg:"You clicked 'None of the pictures include any product I'm selling', but also checked off some images above. Please double check."})
    } else if (!this.state.checkBox0 && this.state.checkBox.length === 0){
      this.setState({err_msg:'Please follow the instructions to check off pictures.'})
    } else {
      //if (!this.state.checkBox0){
        axios
        .post("/api/users/update", {id: this.state.user.id, image_ids:this.state.checkBox})
        .then(res => {
            //console.log('res: ', res)
            this.props.history.push({
              pathname: "/dashboard_label_text"
              })
        })
        .catch(err =>
            console.log('err: ', err)
        );
      //}
    } 
  }

  render() {

    var image_list
    if (this.state.urls.length > 0){
        image_list = this.state.urls.map((img) =>{      
        if (img){
            return <>
            <span className="desktop-only">
            <img src={img.url} width='20%' style={{paddingTop:'10px',marginLeft:25}} alt='image_with_objects'/>
            <Checkbox
              name={img.image_id}
              onChange={this.checkboxChangeHandler}
          />
            </span>

            <span className="mobile-only">
              <img src={img.url} width='38%' style={{paddingTop:'10px',marginLeft:25}} alt='image_with_objects'/>
              <Checkbox
                name={img.image_id}
                onChange={this.checkboxChangeHandler}
              />
            </span>
            </>
        }
      });
    }


    if (this.state.urls.length===0){
        return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
    }


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
                    <Step active>
                    <Step.Content>
                        <Step.Title>Label image</Step.Title>
                       
                    </Step.Content>
                    </Step>

                    <Step>
                    <Step.Content>
                        <Step.Title>Label text</Step.Title>
                       
                    </Step.Content>
                    </Step>

                    <Step >
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

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label image</span></h3>
                    We highlighted all noticeable objects with green boxes in your first impression page. For each image listed, check the box if any of the outlined objects in that image is a product you are selling. If none of the images include your products, check the box at the bottom. 
                    </p>
                </Segment>
            </Grid.Column>
            <Grid.Column width={11}> 
                {image_list}
            </Grid.Column>
            </Grid.Row>
        </Grid>

          <div style={{textAlign:'center', marginTop: 20}}>
            <Checkbox
                style={{marginBottom:30, fontWeight:'bold'}}
                name='0'
                onChange={this.checkboxChangeHandler}
                label="None of the pictures include any product I'm selling"
            />
            <br/>
            {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
            <Button color='teal' 
                style={{ marginLeft: "auto" }}
                onClick={()=> {this.handleLabelImage()}}
            >Next: label text
            </Button>
          </div>
          <div style={{backgroundColor:'#f0f7f2', height:500}}>

          </div>

          </div>
        </div>

        <div className="mobile-only">
          <Dashboard_sidebar_mobile active={2} user={this.state.user}/>
          <div className="col s12">
            <div style={{textAlign:'center', marginTop: 10}}>
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

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label image</span></h3>
                    We highlighted all noticeable objects with green boxes in your first impression page. For each image listed, check the box if any of the outlined objects in that image is a product you are selling. If none of the images include your products, check the box at the bottom. 
                    </p>
                </Segment>
            </Grid.Column>
            <Grid.Column width={16}> 
                {image_list}
            </Grid.Column>

        </Grid>

          <div style={{textAlign:'center', marginTop: 20, marginBottom:100}}>
            <Checkbox
                style={{marginBottom:30, fontWeight:'bold'}}
                name='0'
                onChange={this.checkboxChangeHandler}
                label="None of the pictures include any product I'm selling"
            />
            <br/>
            {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
            <Button color='teal' 
                style={{ marginLeft: "auto" }}
                onClick={()=> {this.handleLabelImage()}}
            >Next: label text
            </Button>
          </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

Dashboard_label.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard_label);



import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import SigninContext from '../context/SigninContext';
import { Step, Grid, Segment, Table, Checkbox, Menu } from 'semantic-ui-react';
import axios from "axios";
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';


class Dashboard_label_text extends Component {
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
        keywords: [],
        keywords_1: [],
        keywords_2: [],
        keywords_3: [],
        err_msg:'',
        activeItem: '2'
    };


  }

  onLogoutClick = e => {
    e.preventDefault();
    localStorage.setItem('signedIn', false)
    this.props.logoutUser(this.props.history);
  };
 

  componentDidMount() {
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    .then(res => {
          this.setState({user: res.data}) 
          axios
          .post("/api/scrape/fetch_keywords", {store_url: res.data.store})
          .then(res => {
              console.log('res: ', res)
              this.setState({keywords: res.data[0]})
          })
          .catch(err =>
              console.log('err: ', err)
          );
    })
  }

  checkboxChangeHandler1 = (event, data) => {
      if (data.checked){
        this.setState({ keywords_1: [...this.state.keywords_1, data.name.substring(0,data.name.length-2)]})
      } else {
        var currentKeywords_1 = this.state.keywords_1
        const index = currentKeywords_1.indexOf(data.name.substring(0,data.name.length-2));
        if (index > -1) {
            currentKeywords_1.splice(index, 1);
        }
        this.setState({ keywords_1: currentKeywords_1 });
      }
  };

  checkboxChangeHandler2 = (event, data) => {
    if (data.checked){
        this.setState({ keywords_2: [...this.state.keywords_2, data.name.substring(0,data.name.length-2)]})
      } else {
        var currentKeywords_2 = this.state.keywords_2
        const index = currentKeywords_2.indexOf(data.name.substring(0,data.name.length-2));
        if (index > -1) {
            currentKeywords_2.splice(index, 1);
        }
        this.setState({ keywords_2: currentKeywords_2 });
      }
  };

  checkboxChangeHandler3 = (event, data) => {
    if (data.checked){
        this.setState({ keywords_3: [...this.state.keywords_3, data.name.substring(0,data.name.length-2)]})
      } else {
        var currentKeywords_3 = this.state.keywords_3
        const index = currentKeywords_3.indexOf(data.name.substring(0,data.name.length-2));
        if (index > -1) {
            currentKeywords_3.splice(index, 1);
        }
        this.setState({ keywords_3: currentKeywords_3 });
      }
  };

  handleLabelText = () => {

    {/* validate所有checkbox是否有矛盾 */}
    var duplicated_keywords = ''
    for (var i=0;i<this.state.keywords_3.length;i++){
        if (this.state.keywords_1.includes(this.state.keywords_3[i]) || this.state.keywords_2.includes(this.state.keywords_3[i])){
            duplicated_keywords += this.state.keywords_3[i] + ', '
        }
    }

    var missing_keywords = ''
    for (var j=0; j<this.state.keywords.length; j++){
        if (!this.state.keywords_1.includes(this.state.keywords[j]) && !this.state.keywords_2.includes(this.state.keywords[j]) && !this.state.keywords_3.includes(this.state.keywords[j])){
            missing_keywords += this.state.keywords[j] + ', '
        }
    }

    if (duplicated_keywords !== ''){
        this.setState({err_msg:`'None of these' cannot be checked off at the same time with other options: ${duplicated_keywords.substring(0,duplicated_keywords.length-2)}`})
    } else if (missing_keywords !== ''){
        this.setState({err_msg:`Labels for following keywords are missing: ${missing_keywords.substring(0,missing_keywords.length-2)}`})
    } else {
        axios
        .post("/api/users/update", {id: this.state.user.id, keywords_1:this.state.keywords_1, keywords_2:this.state.keywords_2, keywords_3:this.state.keywords_3 })
        .then(res => {
            //console.log('res: ', res)
            this.props.history.push({
                pathname: "/dashboard_label_section"
                })
        })
        .catch(err =>
            console.log('err: ', err)
        );
    }
  }
 
  render() {
    var keyword_list
    if (this.state.keywords.length > 0){
        keyword_list = this.state.keywords.map((keyword) =>{      
        if (keyword){
            return <>             
                    <Table.Row>
                        <Table.Cell>{keyword}</Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_1'}
                                onChange={this.checkboxChangeHandler1}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_2'}
                                onChange={this.checkboxChangeHandler2}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_3'}
                                onChange={this.checkboxChangeHandler3}
                            />
                        </Table.Cell>
                    </Table.Row>
                </>
        }
      });
    }


    var keyword_list_mobile
    if (this.state.keywords.length > 0){
        keyword_list_mobile = this.state.keywords.map((keyword) =>{      
        if (keyword){
            return <>
                    <Table.Row>
                        <Table.Cell>{keyword}</Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_1'}
                                onChange={this.checkboxChangeHandler1}
                            /> &nbsp;&nbsp;
                            Store/Product
                        </Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_2'}
                                onChange={this.checkboxChangeHandler2}
                            />&nbsp;&nbsp;
                            Important store/product feature
                        </Table.Cell>
                        <Table.Cell>
                            <Checkbox
                                name={keyword + '_3'}
                                onChange={this.checkboxChangeHandler3}
                            />&nbsp;&nbsp;
                            None of these
                        </Table.Cell>
                    </Table.Row>
                </>
        }
      });
    }





    if (this.state.keywords.length===0){
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
                    <Step completed>
                    <Step.Content>
                        <Step.Title>Label image</Step.Title>
                    </Step.Content>
                    </Step>

                    <Step active>
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

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label text</span></h3>
                    We extracted keywords from your homepage. Keywords need to tell customers important information about product/store and their features. Check the box if the keyword delivers the information. Otherwise, check 'none of these'.
                    </p>
                </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
                <div className="desktop-only">
                    <Table celled style={{marginLeft:20}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Keyword</Table.HeaderCell>
                                <Table.HeaderCell>Store/Product</Table.HeaderCell>
                                <Table.HeaderCell>Important store/product feature</Table.HeaderCell>
                                <Table.HeaderCell>None of these</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {keyword_list}
                        </Table.Body>
                    </Table>
                </div>
            </Grid.Column>
            </Grid.Row> 
        </Grid>

            <div style={{ textAlign:'center', marginTop: 50 }}>
                {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
                <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Button 
                                style={{ marginLeft: 0, backgroundColor:'#E0E1E2', color:'#5A5A5A'}}
                                onClick={()=> {
                                    this.props.history.push({
                                        pathname: "/dashboard_label_image"
                                        })
                                }}
                            >Last: Label image
                            </Button>
                        </Grid.Column>
                        <Grid.Column>
                            <Button color='teal' 
                                style={{}}
                                onClick={()=> { this.handleLabelText() }}
                            >Next: Label Content Type
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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

                    <h3 style={{fontWeight:'bold', color: '#1b1b1c',marginBottom:15}}><span className='highlight'>Label text</span></h3>
                    We extracted keywords from your homepage. Keywords need to tell customers important information about product/store and their features. Check the box if the keyword delivers the information. Otherwise, check 'none of these'.
                    </p>
                </Segment>
            </Grid.Column>
            <Grid.Column width={1}>
            </Grid.Column>
            <Grid.Column width={14}>
                <Table celled style={{}}>
                    <Table.Body>
                        {keyword_list_mobile}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>                    
           
            <div style={{ textAlign:'center', marginTop: 20, marginBottom:100 }}>
            {this.state.err_msg? <p style={{color:'red'}}>{this.state.err_msg}</p> : null}
                <Button 
                    style={{ marginLeft: 0, backgroundColor:'#E0E1E2', color:'#5A5A5A'}}
                    onClick={()=> {
                        this.props.history.push({
                            pathname: "/dashboard_label_image"
                            })
                    }}
                >Last</Button>
                <Button 
                    color='teal' 
                    style={{marginLeft:"20%"}}
                    onClick={()=> { this.handleLabelText() }}
                >Next</Button>
            </div>
          </div>
        </div>

      </div>
      </>
    )
  }
}

Dashboard_label_text.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard_label_text);



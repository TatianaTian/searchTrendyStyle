import React, { Component, useContext } from "react";
import { Button} from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import SigninContext from '../context/SigninContext'; 
import { TimestreamQuery } from "aws-sdk";
import Result_signup_premium from './Result_signup_premium';
import Result_signup_free from './Result_signup_free';
import Result_main from './Result_main';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Icon, Step, Divider, Grid, Segment, Image, Card, Checkbox, Form } from 'semantic-ui-react';
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import validator from "email-validator";


// http://localhost:3000/recovery?gopawsbeyond.com?3
var image_urls = null
const width = window.innerWidth

class Recovery extends Component {
  static contextType = SigninContext;

  constructor(props) {
    super();

    const search = props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    //const style_number = params.get('style'); // bar
    //if (style_number === null) style_number = 1

    //console.log('style_number: ', style_number)

    this.state = {
      image_urls: null,
      start: null,
      selected_styles: [],
      current_style: params.get('style')===null?1:parseInt(params.get('style'), 10),
      name: null, 
      email: null, 
      submittedName: '', 
      submittedEmail: '',
      error: null,
      submitted: false,
      checkedList:[],
      selectedOption1: null,
      selectedOption2: null,
      selectedOption3: null,
      currentMfr: [],
      menu:false
    };
  }
 
  componentDidMount = async () =>{
    //checkedList
    console.log('DidMount')
    window.scrollTo(0, 0)
    const updatedCheckListString = localStorage.getItem('checkedList').split(",")
    var updatedCheckList = []
    
    for (var i=0; i<updatedCheckListString.length; i++){
      var isTrueSet = (updatedCheckListString[i] === 'true');
      updatedCheckList.push(isTrueSet)
    }

    const updatedSelectedStylesString = localStorage.getItem('selectedStyles').split(",")
    console.log('updatedSelectedStylesString: ', updatedSelectedStylesString)
    var updatedSelectedStyles = []

    for (var i=0; i<updatedSelectedStylesString.length; i++){
      var inte = parseInt(updatedSelectedStylesString[i], 10)
      updatedSelectedStyles.push(inte)
    }

    console.log('updatedSelectedStyles: ', updatedSelectedStyles)
    //console.log('updatedCheckList: ', updatedCheckList)

    const option1 = localStorage.getItem('option1')
    const option2 = localStorage.getItem('option2')
    const option3 = localStorage.getItem('option3')

    this.setState({checkedList: updatedCheckList, 
      selected_styles: updatedSelectedStyles,
      selectedOption1: option1,
      selectedOption2: option2,
      selectedOption3: option3,
    })

    console.log('this.state.current_style: ', this.state.current_style)
    console.log('this.state.selected_styles: ', this.state.selected_styles)

    //搜索mongodb database
    axios.post("/api/users/searchMfr", {
      img_key: updatedSelectedStyles[this.state.current_style-1]
    }).then((res)=>{
      if (res){
        console.log("res.data: ", res.data)
        this.setState({currentMfr: [res.data.style1, res.data.style2, res.data.style3, res.data.style4, res.data.style5, res.data.style6]})
      }
    })

  }

  

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const { name, email } = this.state
    console.log('name: ', name)
    console.log('email: ', email)
    // 检查是否输入店名和邮箱
    if (name === null) this.setState({error:'please enter your store link'})
    else if (!validator.validate(email)) this.setState({error:'please enter a valid email address'})
    // 检查是否勾选了任何工厂货
    else if (!this.state.checkedList.includes(true)) this.setState({error:'no manufacturers are selected'})
    // 
    else {
      // 把勾选内容转换成string
      var mfrNumberlist = []
      for (var i=0; i<this.state.checkedList.length; i++){
        if (this.state.checkedList[i]===true){
          const index = Math.floor(i/6)
          const mod = i%6+1

          console.log('i: ', i)
          console.log('index: ', index)
          console.log('mod: ', mod)

          const mfrNumberString = this.state.selected_styles[index]+'-'+mod
          console.log('mfrNumberString: ', mfrNumberString)
          mfrNumberlist.push(mfrNumberString)
        }
      }

      axios.post("/api/users/mfrPress", {
        gender: 'women',
        category: this.state.selectedOption2,
        style: this.state.selectedOption3,
        stylePicNumber: this.state.selected_styles,
        //mfrNumber: ['2-2','2-4','3-1','3-4'],
        mfrNumber: mfrNumberlist,
        brandName: this.state.name,
        email: this.state.email
      }).then((res)=>{
        if (res){
          this.setState({ submitted: true})
        }
      })
    }
  }

  toggle = (i) => {
    console.log('i: ', i)
    console.log('checkedList: ', this.state.checkedList)
    console.log('current_style: ', this.state.current_style)

    const newCheckedList = this.state.checkedList
    const j = (this.state.current_style-1)*6+i
    newCheckedList[j] = !newCheckedList[j]
    
    console.log('newCheckedList: ', newCheckedList)
    this.setState({checkedList: newCheckedList})
    localStorage.setItem('checkedList', newCheckedList);
  }



  render() {
    const { name, email, submittedName, submittedEmail } = this.state

    console.log('checklist: ', this.state.checkedList)
    console.log('option1: ', this.state.selectedOption1)
    console.log('option2: ', this.state.selectedOption2)
    console.log('option3: ', this.state.selectedOption3)
    


    const step_navigation = this.state.selected_styles.map((listing, i)=>{
      console.log("i: ", i)
      console.log("this.state.current_style: ", this.state.current_style)
      const j = i+1
      if (j === this.state.current_style){
        return <>
        <a href={"https://www.whatspopulartoday.com/manufacturerlisting?style="+j}>
        <Step active>
          <Step.Content>
            <Image 
              src={'https://1688imgsearch.s3.amazonaws.com/style_recommendation/'+listing+'.png'} 
              wrapped 
              ui={false} 
              width='100%'
              />
          </Step.Content>
        </Step>
        </a>
      </>
      } else {
        return <>
        <a href={"https://www.whatspopulartoday.com/manufacturerlisting?style="+j}>
        <Step>
          <Step.Content>
            <Image 
              src={'https://1688imgsearch.s3.amazonaws.com/style_recommendation/'+listing+'.png'} 
              wrapped 
              ui={false} 
              width='100%'
              />
          </Step.Content>
        </Step>
        </a>
      </>
      }
    })

    const manufacturer_listings = this.state.currentMfr.map((listing, i)=>{
        const j = (this.state.current_style-1)*6+i
        //console.log('selected_styles: ', this.state.selected_styles)
  
        return (
          <Grid.Column width={5} >
          <Card style={{marginTop:25}} className="center-align">
          <Image src={listing.imageUrl} wrapped ui={false} />
          <Card.Content>
            <Card.Header style={{color:'#0C4A34'}}>{listing.price.toFixed(2)} USD</Card.Header>
            <Card.Description style={{color:'#0C4A34'}}>
              Minimum order quantity: {listing.moq}
              <br/>
              <br/>
            </Card.Description>
          </Card.Content>
          <Card.Content extra >
              {
                this.state.checkedList[j]===true?
                <Icon name='heart' size="large" style={{color: '#ED4956'}}/>
                : <Icon name='heart outline' size="large" style={{color: '#1b1b1c'}}/>
              }
              &nbsp; &nbsp; &nbsp;
              <Checkbox 
                label='Request full product info'
                onChange={()=>this.toggle(i)}
                checked={this.state.checkedList[j]}
              /> 
          </Card.Content>
        </Card>
        </Grid.Column>
        )
      })


    return (
      <>
      <div className="desktop-only">
      <div className="container">  
      <Grid>
        <Grid.Column width={3}>
          <div className="center-align">
            <h3 className="navheading">🔥 Trendy styles you selected</h3>
          </div>
          <Step.Group vertical>
            {step_navigation}
          </Step.Group>
        </Grid.Column>
        <Grid.Column width={13}>
          <div className="center-align">
            <h3 className="navheading">Same or similar products from manufacturers</h3>
            <p className="navheading"></p>
          </div>
          <Grid>
            {manufacturer_listings}
          </Grid>
        </Grid.Column>
      </Grid>


        <Grid columns={3}>
          <Grid.Column width={3}/>
            <Grid.Column width={10}>
            <div className="center-align">
            <Segment>
                <h3 className="navheading" style={{}}>Receive full product details within 24 hours</h3>
                <p>If you’d like to learn more about any of the products or buy a sample directly from the manufacturers, simply tell us your brand name and your email address. You will receive a personalized link to directly view the products and place orders. Believe it or not, you can start selling in 2 weeks! 
                </p>
            </Segment>
            {
              this.state.submitted?
              <h1 style={{color:'#0C4A34'}}>Success!</h1>
              :
              <>
              <Form>
                <Form.Group unstackable widths={2}>
                  <Form.Input
                    placeholder='Store Link'
                    name='name' 
                    value={name}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    placeholder='Email'
                    name='email'
                    value={email}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form>
              {
                  this.state.error?
                  this.state.error:
                  null
              }
              <br/>
              <button
                  style={{
                  borderRadius: "5px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  fontWeight:'bold',
                  backgroundColor:'#533eb5',
                  color:'white',
                  height: '50px',
                  paddingLeft:'16px',
                  paddingRight:'16px',
                  //marginRight:'8px'
                  //zIndex: -1
                  }}
                  className="btn waves-effect waves-light hoverable accent-3"
                  onClick={this.handleSubmit}
              >
              <p>Submit</p>
              </button>
              </>
            }

            </div>
          </Grid.Column>
          <Grid.Column width={3}/>
        </Grid>
      </div>
      <div style={{height:500}}>

      </div>
      </div>
      <div className="mobile-only">
      <div className="container">  
      {this.state.menu?null:
      <p className="navheading">Select a target style</p>}
      <Button
          style={{backgroundColor:'transparent'}}
          onClick={()=>this.setState({menu: !this.state.menu})}
        >
          <i class="bars icon" style={{fontSize:25, color:'#1b1b1c'}}/> 
        </Button>
        
      {this.state.menu?
      <>
      <div className="center-align navheading">
        <p>Select a target style</p>
      </div>
      <Grid>
        <Grid.Column width={4}/>
        <Grid.Column width={8}>
          <Step.Group vertical style={{backgroundColor:'black'}}>
            {step_navigation}
          </Step.Group>
        </Grid.Column>
      </Grid>
      </>
    :
    <> 
      <div className="center-align navheading">
        <p>Target style</p>
      
    <Image 
        src={'https://1688imgsearch.s3.amazonaws.com/style_recommendation/'+this.state.selected_styles[this.state.current_style-1]+'.png'} 
        wrapped 
        ui={false} 
        width='30%'
    />
    </div>
    </>
      }

          <div className="center-align navheading" style={{marginTop:30, width:'70%', marginLeft:'15%'}}>
            <p className="navheading">Same or similar products from manufacturers</p>
            {manufacturer_listings}
          </div>     

        <Grid columns={3} style={{marginTop:30}}>
          <Grid.Column width={1}/>
            <Grid.Column width={14}>
            <div className="center-align">
            <Segment>
                <h3 className="navheading" style={{}}>Receive full product details within 24 hours</h3>
                <p>If you’d like to learn more about any of the products or buy a sample directly from the manufacturers, simply tell us your brand name and your email address. You will receive a personalized link to directly view the products and place orders. Believe it or not, you can start selling in 2 weeks! 
                </p>
            </Segment>
            {
              this.state.submitted?
              <h1 style={{color:'#0C4A34'}}>Success!</h1>
              :
              <>
              <Form>
                <Form.Group widths={1}>
                  <Form.Input
                    placeholder='Store Link'
                    name='name' 
                    value={name}
                    onChange={this.handleChange}
                    style={{width:width*12/16}}
                  />
                  <Form.Input
                    placeholder='Email'
                    name='email'
                    value={email}
                    onChange={this.handleChange}
                    style={{width:width*12/16, marginTop:10}}
                  />
                </Form.Group>
              </Form>
              {
                  this.state.error?
                  this.state.error:
                  null
              }
              <br/>
              <button
                  style={{
                  borderRadius: "5px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                  fontWeight:'bold',
                  backgroundColor:'#533eb5',
                  color:'white',
                  height: '50px',
                  paddingLeft:'16px',
                  paddingRight:'16px',
                  //marginRight:'8px'
                  //zIndex: -1
                  }}
                  className="btn waves-effect waves-light hoverable accent-3"
                  onClick={this.handleSubmit}
              >
              <p>Submit</p>
              </button>
              </>
            }

            </div>
          </Grid.Column>
          <Grid.Column width={1}/>
        </Grid>
      </div>
      <div style={{height:100}}>

      </div>
      </div>
      </>        
      )
  }
}

Recovery.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Recovery));



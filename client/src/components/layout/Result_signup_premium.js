import React from 'react';
import SigninContext from '../context/SigninContext';
import {Button } from 'react-bootstrap';
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import Select from 'react-select';
import axios from "axios";

class Result_signup_premium extends React.Component  {
    
    constructor(props) {
        super();

        //console.log('props: ', props)
        this.state = {
            inbox: false,
            unlock_button: false,
            signup: false,
            name:'',
            store:'',
            email: '',
            password:'',
            repeatPwd:'',
            errorMsg: '',
            callback: props.callback,
            onNavigate:props.navigate,
            selectedOption: null
        };
      }


  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  validate = () => {
    var emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    var urlPatten = new RegExp(/^http(s)?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)

    if (!this.state.name){
      this.setState({errorMsg:'Please enter a name'})
    } else if (!urlPatten.test(this.state.store)){
      this.setState({errorMsg:'Please enter a valid store url including http/https'})
    } else if (!emailPattern.test(this.state.email)){
      this.setState({errorMsg:'Please enter a valid email address.'})
    } else if (!this.state.password){
        this.setState({errorMsg:'Please enter a password.'})
    } else if (!this.state.repeatPwd){
        this.setState({errorMsg:'Please confirm the password.'})
    } else if (this.state.password !== this.state.repeatPwd){
        this.setState({errorMsg:"Passwords don't match."})
    } else if (!this.state.selectedOption) {
      this.setState({errorMsg:"Please select a product category."})
    } else {
      this.setState({errorMsg:''})
      this.state.callback(this.state.email, this.state.password, this.state.repeatPwd, this.state.store, this.setMsg, this.state.name, this.state.selectedOption.label)
    }
  }

  setMsg = (msg) => {
    this.setState({errorMsg: msg})
  }

  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };  

  render() {

    //console.log('errorMsg: ', this.state.errorMsg)
    const { selectedOption } = this.state;

    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        //width: state.selectProps.width,
        //borderBottom: '1px dotted pink',
        padding: 5,
        zIndex: 9999,
        textAlign:"left"
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
      },
      control: styles => ({ ...styles, borderColor:'transparent', borderBottomColor:'#9E9E9E', height:60, marginTop: -22}),
      indicatorSeparator: styles => ({...styles, borderColor:'red'}),
      placeholder: styles => ({ ...styles, marginLeft:-8, color:'#8e8e8e'})
      
    }

    const options = [
      { value: 'Animals & Pet Supplies', label: 'Animals & Pet Supplies' },
      { value: 'Apparel', label: 'Apparel' },
      { value: 'Baby & Toddler', label: 'Baby & Toddler' },
      { value: 'Electronics & Accessories', label: 'Electronics & Accessories' },
      { value: 'Fashion Accessories', label: 'Fashion Accessories' },
      { value: 'Food & Beverages', label: 'Food & Beverages' },
      { value: 'Furniture & Home & Arts', label: 'Furniture & Home & Arts' },
      { value: 'Health & Beauty', label: 'Health & Beauty' },
      { value: 'Luggage & Bags', label: 'Luggage & Bags' },
      { value: 'Office/School Supplies', label: 'Office/School Supplies' },
      { value: 'Shoes', label: 'Shoes' },
      { value: 'Sporting Goods', label: 'Sporting Goods' },
      { value: 'Toys & Games', label: 'Toys & Games' },
    ];


    return (
        <div className ="container row">


        <div className="col m12 s12 payment-card" style={{paddingBottom:3, paddingTop: 3, paddingLeft: 3, paddingRight: 3}}>
        <Segment>
        <div style={{textAlign:"center"}}>
          <div className="desktop-only">
            <Step.Group ordered size="">
              <Step active>
                <Step.Content>
                  <Step.Title>Sign up</Step.Title>
                  <Step.Description>Sign up an account at Haloy</Step.Description>
                </Step.Content>
              </Step>

              <Step >
                <Step.Content>
                  <Step.Title>Payment</Step.Title>
                  <Step.Description>Confirm one-time payment</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
          </div>
          <div className="mobile-only">
            <Step.Group ordered size="mini">
              <Step active>
                <Step.Content>
                  <Step.Title>Sign up</Step.Title>
                  <Step.Description>Sign up an account at Haloy</Step.Description>
                </Step.Content>
              </Step>

              <Step >
                <Step.Content>
                  <Step.Title>Payment</Step.Title>
                  <Step.Description>Confirm one-time payment</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
          </div>
        </div>


        <h3 className='heading' style={{marginLeft:10}}><span className="highlight">Signup</span></h3>
        <p className="grey-text text-darken-1" style={{marginLeft:10}}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <div style={{marginLeft:10, marginRight:10, marginTop:30}}> 
              <Select
                value={selectedOption}
                onChange={this.handleChange}
                options={options}
                placeholder='Product category'
                styles={customStyles}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                  ...theme.colors,
                    text: 'white',
                    primary75: '#26A69A',
                    primary50: '#26A69A',
                    primary25: '#26A69A',
                    primary: '#26A69A',
                  },
                })}
            />
        </div>

        <form noValidate>

        <div className="input-field col s12">
          <input
              onChange={this.onChange}
              value={this.state.name}
              id="name"
              type="text"

          />
          <label htmlFor="name">Name</label>
          </div>

          <div className="input-field col s12">
            <input
                onChange={this.onChange}
                value={this.state.store}
                id="store"
                type="text"

            />
            <label htmlFor="name">Store Url</label>
          </div>

          <div className="input-field col s12">
          <input
              onChange={this.onChange}
              value={this.state.email}
              id="email"
              type="email"

          />
          <label htmlFor="email">Email</label>

          </div>
          <div className="input-field col s12">
          <input
              onChange={this.onChange}
              value={this.state.password}
              id="password"
              type="password"

          />
          <label htmlFor="password">Password</label>

          </div>
          <div className="input-field col s12">
          <input
              onChange={this.onChange}
              value={this.state.password2}
              id="repeatPwd"
              type="password"

          />
          <label htmlFor="password2">Confirm Password</label>

          </div>
          <div className="col s12" style={{ paddingLeft: "11.250px" }}>

          </div>
          </form>

          {
            this.state.errorMsg?
            <p style={{ paddingLeft: "11.250px", color:"#EA4A00" }}>{this.state.errorMsg}</p>
            :null
          }
          
        
          <div className="center">


          <SigninContext.Consumer>
            {({ signin, pay, survey, setValue }) => (
            <Button 
            variant="outline-light" 
            size="sm" 
            //style={{marginTop:'20px'}}
            onClick={()=> {

              setValue(true, true, survey)
              //call()
              //
              this.validate()
            }}
            >Go to payment</Button>
            )}</SigninContext.Consumer>


            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button
              style={{
                
                borderRadius: "3px",
                letterSpacing: "1px",
                marginTop: "1rem",
                borderWidth:'0px',
                backgroundColor:'white'
              }}
              onClick={()=> {
                this.state.onNavigate()
            }}
            >
              Cancel
            </button>
            <p></p>
        </div>
          
          <br/>
          <br/>
          </Segment>
    </div>

  </div>   

    )
  }
}

export default Result_signup_premium;
 
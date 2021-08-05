import React from 'react';
import SigninContext from '../context/SigninContext';
import {Button } from 'react-bootstrap';
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';
import AsyncLocalStorage from '@createnextapp/async-local-storage'


class Result_signin_free extends React.Component  {
    
    constructor(props) {
        console.log('error_message: ', props.errorMsg)
        super();
        this.state = {
            inbox: false,
            unlock_button: false,
            signup: false,
            name:'',
            email: '',
            password:'',
            repeatPwd:'',
            errorMsg: '',
            callback: props.callback,
            onNavigate:props.navigate,
            //signIn: props.signIn,
            //signIn: false,
            signIn: false,
            signInAction: props.signInAction,
        };
      } 

  componentDidMount (){
    const readData = async () => {
      const data = await AsyncLocalStorage.getItem('PromptSignIn')
      console.log('data: ', data)
      this.setState({'signIn': data})
    }
    readData()
  }


  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  validate = () => {
    if (!this.state.email){
      this.setState({errorMsg:'Please enter a valid email address.'})
    } else if (!this.state.password){
        this.setState({errorMsg:'Please enter a password.'})
    } else if (!this.state.repeatPwd){
        this.setState({errorMsg:'Please confirm the password.'})
    } else if (this.state.password !== this.state.repeatPwd){
        this.setState({errorMsg:"Passwords don't match."})
    } else {
      this.setState({errorMsg:''})
      this.state.callback(this.state.email, this.state.password, this.state.repeatPwd)
    }
  }

  setMsg = (msg) => {
    this.setState({errorMsg: msg})
  }

  validate_signin = () => {
    if (!this.state.email){
      this.setState({errorMsg:'Please enter a valid email address.'})
    } else if (!this.state.password){
        this.setState({errorMsg:'Please enter a password.'})
    } else {
      this.setState({errorMsg:''})
      this.state.signInAction(this.state.email, this.state.password, this.setMsg)
    }
  }

  render() {

    

    const signin = (

      <div className ="container row">
      <div className="col m8 s12 payment-card" style={{paddingBottom:3, paddingTop: 3, paddingLeft: 3, paddingRight: 3}}>
      <Segment>
      <div style={{textAlign:'center'}}>
        <div className="desktop-only">
          <Step.Group ordered size="">
            <Step completed>
              <Step.Content>
                <Step.Title>Signup</Step.Title>
                <Step.Description>Sign up an account at Haloy</Step.Description>
              </Step.Content>
            </Step>

            <Step active>
              <Step.Content>
                <Step.Title>Dashboard</Step.Title>
                <Step.Description>Log in to dashboard</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </div>

        <div className="mobile-only">
          <Step.Group ordered size="mini">
            <Step completed>
              <Step.Content>
                <Step.Title>Signup</Step.Title>
                <Step.Description>Sign up an account at Haloy</Step.Description>
              </Step.Content>
            </Step>

            <Step active>
              <Step.Content>
                <Step.Title>Dashboard</Step.Title>
                <Step.Description>Log in to dashboard</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        </div>
      </div>


      <h3 className='heading' style={{marginLeft:10}}><span className="highlight">Log in</span></h3>
      <form noValidate>

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
            this.validate_signin()
          }}
          >Go to dashboard</Button>
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
            onClick={async ()=> {
              await AsyncLocalStorage.setItem('PromptSignIn', false)
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

    return (
      <>
      {signin}
      </>
    )
    

  }
}

export default Result_signin_free;
 

/*

    if (this.state.signIn){
      return 
    }
    else {
      return (
        {signup}
      )
    }

    */
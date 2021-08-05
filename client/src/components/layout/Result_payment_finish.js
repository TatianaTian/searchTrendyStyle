import React from 'react';
import SigninContext from '../context/SigninContext';
import {Button } from 'react-bootstrap';
import { Icon, Step, Divider, Grid, Segment } from 'semantic-ui-react';

class Result_payment_finish extends React.Component  {
    
    constructor(props) {
        super();

        //console.log('props: ', props)
        this.state = {
            inbox: false,
            unlock_button: false,
            signup: false,
            email: '',
            password:'',
            errorMsg: '',
            callback: props.signIn,
            onNavigate:props.navigate,
        };
      }

      


  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  setMsg = (msg) => {
    this.setState({errorMsg: msg})
  }

  validate = () => {
    if (!this.state.email){
      this.setState({errorMsg:'Please enter a valid email address.'})
    } else if (!this.state.password){
        this.setState({errorMsg:'Please enter a password.'})
    } else {
      this.setState({errorMsg:''})
      this.state.callback(this.state.email, this.state.password, this.setMsg)
    }
  }

  render() {

    console.log('callback: ', this.state.callback)
    //console.log('errorMsg: ', this.state.errorMsg)


    return (
        <div className ="container row">


        <div className="col m12 s12 payment-card" style={{paddingBottom:3, paddingTop: 3, paddingLeft: 3, paddingRight: 3}}>
        <Segment>

        <div className="desktop-only" style={{textAlign:'center'}}>
          <Step.Group ordered size="">
            <Step completed>
              <Step.Content>
                <Step.Title>Signup</Step.Title>
                <Step.Description>Sign up an account at Haloy</Step.Description>
              </Step.Content>
            </Step>

            <Step completed>
              <Step.Content>
                <Step.Title>Payment</Step.Title>
                <Step.Description>Confirm one-time payment</Step.Description>
              </Step.Content>
            </Step>

          </Step.Group> 
        </div>

        <div className="mobile-only" style={{textAlign:'center'}}>
          <Step.Group ordered size="mini">
            <Step completed>
              <Step.Content>
                <Step.Title>Signup</Step.Title>
                <Step.Description>Sign up an account at Haloy</Step.Description>
              </Step.Content>
            </Step>

            <Step completed>
              <Step.Content>
                <Step.Title>Payment</Step.Title>
                <Step.Description>Confirm one-time payment</Step.Description>
              </Step.Content>
            </Step>

          </Step.Group> 
        </div>

        <div style={{textAlign:'center'}}>
        <img src={process.env.PUBLIC_URL + '/celebrate.png'} height="80px" alt='celebrate'/>
            <h2 className='heading'><span className="highlight">Payment completes!</span></h2>
        </div>



        <h3 className='heading' style={{marginLeft:10}}>Sign in to dashboard</h3>
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
              this.validate()
            }}
            >Sign in</Button>
            )}</SigninContext.Consumer>
        </div>
    

          <br/>
          <br/>
          <div>
          </div>
          
          </Segment>
    </div>

  </div>   

    )
  }
}

export default Result_payment_finish;
 
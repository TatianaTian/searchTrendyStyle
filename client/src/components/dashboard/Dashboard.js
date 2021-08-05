import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SigninContext from '../context/SigninContext';



class Dashboard extends Component {
  static contextType = SigninContext;

  constructor(props) {
    super();
    this.state = {
        unlock_button: false,
        user: props.auth.user,
        congrats: false,
        cancel: false
    };
  }

  onLogoutClick = e => {
    e.preventDefault();
    localStorage.setItem('signedIn', false)
    this.props.history.push({
      pathname: "/results",
    })
    this.props.logoutUser();
  };
  

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {

      console.log('success!')
      const updateUser = {
        id: localStorage.getItem('id'),
        paid: true 
      };
      this.props.updateUser(updateUser, this.props.history);
      localStorage.setItem('paid', 'true')
      this.setState({congrats:true})

    }
    if (query.get("canceled")) {
      this.setState({cancel:true})
    }
  }



  render() {
    //const { user } = this.props.auth;
    console.log('this.state.user.doneSurvey: ', this.state.user.doneSurvey)
    localStorage.setItem('id', this.state.user.id)

    const dashboard_paid = (
      <>
      <div className="container center">
        <div style={{textAlign:'left', marginBottom: 30, marginTop: 30}}>
              <h5 className="prompt"><FontAwesomeIcon icon={faSearch} style={{color:'#80e98f'}}/> Store reviews for <span className="heading highlight" >www.haloy.co</span> is ready!
              </h5>
            </div>  
          <div className="row">
              <div className="col m4 s12">
              <div className="result-card center">  
              <p className="prompt">Review 1</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>shopthecurated.net</span></p>
                  
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                        pathname: "/comparison",
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>

                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example6.png'} width="100%" style={{paddingBottom:'10px'}} alt='example6'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">     
              <p className="prompt">Review 2</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.anthropologie.com</span></p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, this.state.user.doneSurvey)
                      this.props.history.push({
                        pathname: "/survey",
                        })
                    localStorage.setItem('signedIn', true);
                    localStorage.setItem('doneSurvey', this.state.user.doneSurvey);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example4.png'} width="100%" style={{paddingBottom:'10px'}} alt='example4'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">                    
              <p className="prompt">Review 3</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.everlane.com</span></p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                        pathname: "/comparison",
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example3.png'} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
              </div>
              </div>
          </div>




          <div className="row">
              <div className="col m4 s12">
              <div className="result-card center">  
              <p className="prompt">Review 4</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.stories.com</span></p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                        pathname: "/comparison",
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                   <p></p>
                  <img src={process.env.PUBLIC_URL + '/example5.png'} width="100%" style={{paddingBottom:'10px'}} alt='example5'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">     
              <p className="prompt">Review 5</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>tatianatian.com</span></p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                        pathname: "/comparison",
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example1.png'} width="100%" style={{paddingBottom:'10px'}} alt='example1'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center" style={{backgroundColor: "#fadcac"}}>                    
              <p className="prompt" style={{fontWeight:'bold'}}><span className="highlight2">Actionable Strategies</span> for www.haloy.co</p>
                  <p >We benchmarked www.haloy.co to 20 successful online stores in the same product category. We found<span style={{textDecoration:'underline'}}> what www.haloy.co is missing</span> and recommended a list of actionable strategies. Check out our example below!</p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue  }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#cfe5d5', color:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                          pathname: "/strategy_example"
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Example</Button>
                  )}</SigninContext.Consumer>

                  <br/>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c', marginTop:'10px'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                    this.props.history.push({
                      pathname: "/strategy"
                    })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Check strategies</Button>
                  )}</SigninContext.Consumer>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example2.png'} width="100%" style={{paddingBottom:'10px'}} alt='example2'/>  
              </div>
              </div>
          </div>
          <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}

              className="waves-light white accent-3"
            >
              Logout
            </button>
            <br/>
            <br/>
            <br/>
      </div>
      </>

    )
  

    const dashboard_unpaid = (
      <>              
      <div className="container center">  
      <div style={{textAlign:'left', marginBottom: 30, marginTop: 30}}>
              <h5 className="prompt"><FontAwesomeIcon icon={faSearch} style={{color:'#80e98f'}}/> Store reviews for <span className="heading highlight" >www.haloy.co</span> is ready!
              Get started with the <span className='heading'>Free</span> reviews.
              </h5>
            </div>  
          <div className="row">
              <div className="col m4 s12">
              <div className="result-card center">  
              <p className="prompt">Review 1</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>shopthecurated.net</span></p>
              <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                        pathname: "/comparison",
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                  
                
                <p></p>
                  <img src={process.env.PUBLIC_URL + '/example6.png'} width="100%" style={{paddingBottom:'10px'}} alt='example6'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">     
              <p className="prompt">Review 2</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.anthropologie.com</span></p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, this.state.user.doneSurvey)
                      this.props.history.push({
                        pathname: "/survey",
                        })
                    localStorage.setItem('signedIn', true);
                    if (!localStorage.getItem('doneSurvey')){
                      localStorage.setItem('doneSurvey', this.state.user.doneSurvey);
                    }
                    //localStorage.setItem('doneSurvey', false);
                  }}
                  >Read</Button>
                  )}</SigninContext.Consumer>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example4.png'} width="100%" style={{paddingBottom:'10px'}} alt='example4'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">                    
              <p className="prompt">Review 3</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.everlane.com</span></p>
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'grey'}}
                  onClick={()=> {
                    this.setState({unlock_button: true})
                  }}
                  >Unlock</Button>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example3.png'} width="100%" style={{paddingBottom:'10px'}} alt='example3'/>  
              </div>
              </div>
          </div>




          <div className="row">
              <div className="col m4 s12">
              <div className="result-card center">  
              <p className="prompt">Review 4</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>www.stories.com</span></p>
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'grey'}}
                  onClick={()=> {
                    this.setState({unlock_button: true})
                  }}
                  >Unlock</Button>
                   <p></p>
                  <img src={process.env.PUBLIC_URL + '/example5.png'} width="100%" style={{paddingBottom:'10px'}} alt='example5'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center">     
              <p className="prompt">Review 5</p>
                  <p>Compare store <span style={{textDecoration:'underline'}}>www.haloy.co</span> to <span className="highlight" style={{fontWeight:'bold'}}>tatianatian.com</span></p>
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'grey'}}
                  onClick={()=> {
                    this.setState({unlock_button: true})
                  }}
                  >Unlock</Button>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example1.png'} width="100%" style={{paddingBottom:'10px'}} alt='example1'/>  
              </div>
              </div>

              <div className="col m4 s12">
              <div className="result-card center" style={{backgroundColor: "#fadcac"}}>                    
              <p className="prompt" style={{fontWeight:'bold'}}><span className="highlight2">Actionable Strategies</span> for www.haloy.co</p>
                  <p >We benchmarked www.haloy.co to 20 successful online stores in the same product category. We found<span style={{textDecoration:'underline'}}> what www.haloy.co is missing</span> and recommended a list of actionable strategies. Check out our example below!</p>
                  <SigninContext.Consumer>
                  {({ signin, pay, survey, setValue  }) => (
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'#cfe5d5', color:'#1b1b1c'}}
                  onClick={()=> {
                    setValue(true, pay, survey)
                      this.props.history.push({
                          pathname: "/strategy_example"
                        })
                    localStorage.setItem('signedIn', true);
                  }}
                  >Example</Button>
                  )}</SigninContext.Consumer>
                  
                  <br/>
                  <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{backgroundColor:'grey', marginTop:'10px'}}
                  onClick={()=> {
                    this.setState({unlock_button: true})
                  }}
                  >Unlock strategies</Button>
                  <p></p>
                  <img src={process.env.PUBLIC_URL + '/example2.png'} width="100%" style={{paddingBottom:'10px'}} alt='example2'/>  
              </div>
              </div>
          </div>
          <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              
              className="waves-light white accent-3"
            >
              Logout
            </button>
            <br/>
            <br/>
            <br/>
      </div>
      
      </>

    )

    console.log("localStorage.getItem('paid')")
    console.log(localStorage.getItem('paid'))
    console.log("congrats")
    console.log(this.state.congrats)


    return (      

      (this.state.congrats?
        <>
        <p>congrats!! this is how to use the report.</p>
        <Button 
          variant="outline-light" 
          size="sm" 
          style={{backgroundColor:'grey', marginTop:'10px'}}
          onClick={()=> {
            this.setState({congrats: false})
            this.props.history.push({
              pathname: "/dashboard"
            })
          }}
          >Got it</Button>
        <div className="overlay">
              {dashboard_unpaid}
          </div>
      </>
      :
      (this.state.cancel?
        <>
        <p>The order is cancelled.</p>
        <Button 
          variant="outline-light" 
          size="sm" 
          style={{backgroundColor:'grey', marginTop:'10px'}}
          onClick={()=> {
            this.setState({cancel: false})
            this.props.history.push({
              pathname: "/dashboard"
            })
          }}
          >cancel</Button>
        <div className="overlay">
              {dashboard_unpaid}
          </div>
      </>
      :

        
      ((this.state.user.paid || localStorage.getItem('paid') === 'true' || localStorage.getItem('paid') === true)?
          dashboard_paid
        :
        (this.state.unlock_button? 
          <>

          <div className="payment">
         
          
          </div>
              <div className="overlay">
              {dashboard_unpaid}
          </div>

          </>
      :
      <>
        {dashboard_unpaid}
      </>
      )
        )
        )
        )

    )
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(Dashboard);


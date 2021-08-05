import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import {Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from "axios";
import { Grid} from 'semantic-ui-react';
import validator from "email-validator";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      store: "",
      email: "",
      password: "",
      password2: "",
      errorMsg: null,
      errors: {},
      selectedOption: null
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard_search");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  validate = () => {
    var emailPattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

    if (!this.state.store){
      this.setState({errorMsg:'Please enter a brand name'})
    } else if (!this.state.name){
      this.setState({errorMsg:'Please enter a store link'})
    } else if (!validator.validate(this.state.email)){
      this.setState({errorMsg:'Please enter a valid email address.'})
    } else if (!this.state.password){
        this.setState({errorMsg:'Please enter a password.'})
    } else if (!this.state.password2){
        this.setState({errorMsg:'Please confirm the password.'})
    } else if (this.state.password !== this.state.password2){
        this.setState({errorMsg:"Passwords don't match."})
    } else {
      this.setState({errorMsg:''})
      this.onSubmit()
    }
  }

  
  onSubmit = () => {
    //e.preventDefault();
    const newUser = {
      storeLink: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      storeName: this.state.store,
    };
    this.props.registerUser(newUser, this.setMsg, this.props.history);
  };

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
    const { errors, selectedOption } = this.state;

    const customStyles = {
      menu: (provided, state) => ({
        ...provided,
        //width: state.selectProps.width,
        //borderBottom: '1px dotted pink',
        padding: 5,
        zIndex: 9999
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


    return (
      <div className="container">
        <Grid>
          <Grid.Row>
          </Grid.Row>
        </Grid>
        
        <div className="row">
          <div className="col s0 m2">
          </div>
          <div className="col s12 m8">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h2>
                <b>Register</b> below
              </h2>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>


            <form style={{marginTop:80}}>
              <div className="input-field col s12">
                <input
                    onChange={this.onChange}
                    value={this.state.store}
                    id="store"
                    type="text"
                />
                <label htmlFor="name">Brand Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label htmlFor="name">Store Link</label>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">{errors.email}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>



              {
                this.state.errorMsg ?
                <p style={{ paddingLeft: "11.250px"}}>{this.state.errorMsg}</p>
                :null
              }

              <div className="col s12" style={{ paddingLeft: "11.250px", marginBottom: 80 }}>

                  <Button
                  style={{
                    borderRadius: "5px",
                    letterSpacing: "1.5px",
                    marginTop: "2rem",
                    fontWeight:'bold',
                    backgroundColor:'#0C4A34',
                    color:'white',
                    height: '40px',
                    paddingLeft:'25px',
                    paddingRight:'25px',
                    marginLeft:'8px'
                  }}
                  //type="submit"
                  //onSubmit={this.validate}
                  onClick={this.validate}
                  className="btn btn-medium waves-effect waves-light hoverable accent-3"
                >
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
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
)(withRouter(Register));


/*
<Button
  style={{
    width: "150px",
    borderRadius: "3px",
    letterSpacing: "1.5px",
    marginTop: "1rem"
  }}
  //type="submit"
  //onSubmit={this.validate}
  onClick={this.validate}
  className="btn btn-medium waves-effect waves-light hoverable blue accent-3"
>
  Sign up
</Button>
*/
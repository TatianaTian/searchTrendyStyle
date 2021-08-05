import React, { Component, useState, useEffect } from "react";
import { updateUser } from "../../actions/authActions";


const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
);


class Checkout extends Component {
  constructor() {
    super();
    this.state = {
        message: ''
    };
  }


  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
        this.setState({message: "Order placed! You will receive an email confirmation."})
    }
    if (query.get("canceled")) {
        this.setState({message: "Order canceled -- continue to shop around and checkout when you're ready."})
    }
  }

  

  render() {


    return  <Message message={this.state.message} />

  }
}

export default Checkout;



//{this.context.signin?
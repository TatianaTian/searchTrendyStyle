import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import AsyncLocalStorage from '@createnextapp/async-local-storage'


import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";


// function to handle stripe payment
const handleClick = async (id) => {
  //const stripePromise = loadStripe("pk_test_51HeAu7EMg9ur2p3ywJ0E2bYiCR7phpWP0wZzvl7XPDspHGpMsoEXwY00aYEwjxIy");
  const stripePromise = loadStripe("pk_lzl8xyHyhayoBbU8BF0ilo33MLX00q8vfcxwq");
  
  const stripe = await stripePromise;

  axios
      .post("/api/checkout/create-session", {afterSignup: false, user_id: id})
      .then(async res => {
          console.log('res: ', res)
          //const session = res.json()
          const session = res.data
          const result = await stripe.redirectToCheckout({
              sessionId: session.id,
            });
            if (result.error) {
              // If `redirectToCheckout` fails due to a browser or network
              // error, display the localized error message to your customer
              // using `result.error.message`.
              console.log('error')
            }
      }) 
};

// Register User
export const registerUser =  (userData, setMsg, history) => dispatch => { 
  console.log('arrived register user')
  console.log(userData)

  axios
    .post("/api/users/register", userData)
    .then(async res => {
      if (res.status === 200){
        //console.log('history: ', history)
        history.push("/login")
        //setMsg("Success! Please log in to request styles.")
        /*
        if (userData.premium){
          handleClick(res.data._id)
        } else {
          //console.log("arrived register user no premium")
          //await AsyncLocalStorage.setItem('PromptSignIn', true)
          history.push("/dashboard_search")
        }*/
      }
    })
    .catch(err =>{
      console.log('something wrong with signing up')
      setMsg(err.response.data.msg)
    }
    );
};

// Login - get user token
export const loginUser = (userData, setMsg, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);
      localStorage.removeItem("doneSurvey");
      localStorage.removeItem("paid");
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      console.log('decoded:')
      console.log(decoded)

      history.push("/dashboard_search")
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      {
        //console.log('err: ', err)
        //console.log("setMsg: ", setMsg)
        setMsg(err.response.data.msg)
      }
      //dispatch({
       // type: GET_ERRORS,
       // payload: err.response.data
      //})
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = (history) => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  // direct to login page
  history.push("/login")
};

// update user
export const updateUser = (userData, history) => dispatch => {
  console.log('update user userData: ')
  console.log(userData)
  axios
    .post("/api/users/update", userData)
    .then(res => {
      
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

import React, { Component, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import SearchBmk from "./components/layout/SearchBmk";
import Analysis from "./components/layout/Analysis";
import Results from "./components/layout/ResultList";
import Prompt from "./components/layout/Prompt";
import PromptGoPremium from "./components/layout/PromptGoPremium";
import PromptFreeSignup from "./components/layout/PromptFreeSignup";
import PromptFreeSignin from "./components/layout/PromptFreeSignin";
import Comparison from "./components/layout/Comparison";
import Comparison_overview from "./components/layout/Comparison_overview";
import Comparison_images from "./components/layout/Comparison_images";
import Comparison_colors from "./components/layout/Comparison_colors";
import Comparison_texts from "./components/layout/Comparison_texts";
import Comparison_typographies from "./components/layout/Comparison_typographies";
import Comparison_strategies from "./components/layout/Comparison_strategies";
import Comparison_example from "./components/example/Comparison_example";
import Comparison_overview_example from "./components/example/Comparison_overview_example";
import Comparison_images_example from "./components/example/Comparison_images_example";
import Comparison_colors_example from "./components/example/Comparison_colors_example";
import Comparison_texts_example from "./components/example/Comparison_texts_example";
import Comparison_typographies_example from "./components/example/Comparison_typographies_example";
import AS_overview from "./components/layout/AS_overview";
import AS_example from "./components/example/AS_example";
import Dashboard_overview from "./components/dashboard/Dashboard_overview";
import Dashboard_images from "./components/dashboard/Dashboard_images";
import Dashboard_colors from "./components/dashboard/Dashboard_colors";
import Dashboard_texts from "./components/dashboard/Dashboard_texts";
import Dashboard_typographies from "./components/dashboard/Dashboard_typographies";
import Dashboard_strategies from "./components/dashboard/Dashboard_strategies";
import Dashboard_impression from "./components/dashboard/Dashboard_impression";
import Dashboard_analyze from "./components/dashboard/Dashboard_analyze";
import Dashboard_label_image from "./components/dashboard/Dashboard_label_image";
import Dashboard_label_text from "./components/dashboard/Dashboard_label_text";
import Dashboard_label_section from "./components/dashboard/Dashboard_label_section";
import Strategy from "./components/layout/Strategy";
import Survey from "./components/layout/Survey";
import Term from "./components/layout/Term";
import Checkout from "./components/layout/Checkout";
import Strategy_example from "./components/layout/Strategy_example";
import Recovery from "./components/layout/Recovery";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Dashboard2 from "./components/dashboard/Dashboard2";
import Dashboard3 from "./components/dashboard/Dashboard3";
import Account from "./components/account/Account";
import Upgrade from "./components/account/Upgrade";
import LanguageSwitcher from "./components/layout/LanguageSwitcher";
import SigninContext from './components/context/SigninContext';
import AnalysisContext from './components/context/AnalysisContext';
import 'semantic-ui-css/semantic.min.css'

import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}


class App extends Component {
  //setLanguage = language => {
  //  this.setState({ language });
  //};

  setValue = (signin, pay, survey) => {
    this.setState({signin})
    this.setState({pay})
    this.setState({survey})
  };

  setAnalysis = (analysis) => {
    this.setState({analysis})
  }


  state = {
    signin: false,
    pay:false,
    survey:false,
    analysis: null,
    setValue: this.setValue,
    setAnalysis: this.setAnalysis
  };



  render() {
    const Component = Dashboard;
    return (
      <Provider store={store}>
        <SigninContext.Provider value={this.state}>
        <AnalysisContext.Provider value={this.state}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/searchBmk" component={SearchBmk} />
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/trendystyles" component={Term} />
              <Route exact path="/manufacturerlisting" component={Recovery} />
              <PrivateRoute exact path="/dashboard_history" component={Dashboard3}/>
              <PrivateRoute exact path="/dashboard_search" component={Dashboard_analyze} />
              <PrivateRoute exact path="/account" component={Account} />
              <Route path="*" component={Dashboard2} />
            </Switch>
          </div>
        </Router>


        </AnalysisContext.Provider>
        </SigninContext.Provider>
        
      </Provider>
    );
  }
}
export default App;


/*
<Route exact path="/" component={Landing} />
            <Route exact path="/searchBmk" component={SearchBmk} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/analysis" component={Analysis} />
            <Route exact path="/results" component={Results} />
            <Route exact path="/prompt" component={Prompt} />
            <Route exact path="/promptGoPremium" component={PromptGoPremium} />
            <Route exact path="/promptFreeSignup" component={PromptFreeSignup} />
            <Route exact path="/promptFreeSignin" component={PromptFreeSignin} />
            <Route exact path="/comparison" component={Comparison} />
            <Route exact path="/strategy" component={Strategy} />
            <Route exact path="/survey" component={Survey} />
            <Route exact path="/shippingCalculator" component={Term} />
            <Route exact path="/strategy_example" component={Strategy_example} />
            <Route exact path="/example" component={Comparison_example} />
            <Route exact path="/colors_example" component={Comparison_colors_example} />
            <Route exact path="/images_example" component={Comparison_images_example} />
            <Route exact path="/texts_example" component={Comparison_texts_example} />
            <Route exact path="/typographies_example" component={Comparison_typographies_example} />
            <Route exact path="/overview_example" component={Comparison_overview_example} />
            <Route exact path="/overview" component={Comparison_overview} />
            <Route exact path="/images" component={Comparison_images} />
            <Route exact path="/colors" component={Comparison_colors} />
            <Route exact path="/texts" component={Comparison_texts} />
            <Route exact path="/typographies" component={Comparison_typographies} />
            <Route exact path="/strategies" component={Comparison_strategies} />
            <Route exact path="/as_overview" component={AS_overview} />
            <Route exact path="/as_example" component={AS_example} />
            <Route path="/recovery" component={Recovery} />
            <Route exact path="/checkout_premium_account" component={Checkout} />
            <Route exact path="/account" component={Account} />
            <Route exact path="/upgrade" component={Upgrade} />
            <Switch>Dashboard_analyze
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                <PrivateRoute exact path="/dashboard2" component={Dashboard2}/>
                <PrivateRoute exact path="/dashboard_history" component={Dashboard3}/>
                <PrivateRoute exact path="/dashboard_search" component={Dashboard_analyze} />
                <PrivateRoute exact path="/dashboard_overview" component={Dashboard_overview} />
                <PrivateRoute exact path="/dashboard_images" component={Dashboard_images} />
                <PrivateRoute exact path="/dashboard_colors" component={Dashboard_colors} />
                <PrivateRoute exact path="/dashboard_texts" component={Dashboard_texts} />
                <PrivateRoute exact path="/dashboard_typographies" component={Dashboard_typographies} />
                <PrivateRoute exact path="/dashboard_strategies" component={Dashboard_strategies} />
                <PrivateRoute exact path="/dashboard_impression" component={Dashboard_impression} />
                <PrivateRoute exact path="/dashboard_label_image" component={Dashboard_label_image} />
                <PrivateRoute exact path="/dashboard_label_text" component={Dashboard_label_text} />
                <PrivateRoute exact path="/dashboard_label_section" component={Dashboard_label_section} />

*/
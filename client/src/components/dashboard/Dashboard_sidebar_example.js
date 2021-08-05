import React from 'react';
import { Link } from "react-router-dom";
import { TextArea } from 'semantic-ui-react';


class Dashboard_sidebar_example extends React.Component  {
    
    constructor(props) {
        console.log('props: ', props)
        super();
        this.state = {
            active: props.active,
            user: props.user,
            feedback: true,
        }; 
      } 

  render() {
    return (
        <div class="ui left fixed vertical menu" style={{width:window.innerWidth/12*2}}>
            <div class="item">
            <Link
                to="/"
                >
                <img src={process.env.PUBLIC_URL + '/logo.png'} height="35px" alt='logo' style={{marginBottom: 30, marginTop: 20}}/>
            </Link>
            </div>
            <div class="center" style={{marginBottom: 50}}>
                <h3>Hi <span className="highlight">{this.state.user.name}</span>, <br/> welcome back!</h3>
                <b><p>Store url:</p></b>
                <TextArea disabled value={this.state.user.store} style={{borderColor:'transparent', paddingLeft:10, paddingRight:10, textAlign:'center'}}/>
            </div>

            {
                this.state.active === 1?
                <>
                    <a class="item active" href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                    <a class="item" href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                    <a class="item" href="/account"><i class="user outline icon"></i>Account</a>
                </>
                :
                    this.state.active === 2?
                    <>
                        <a class="item" href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                        <a class="item active" href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                        <a class="item" href="/account"><i class="user outline icon"></i>Account</a>
                    </>
                    :
                    <>
                        <a class="item" href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                        <a class="item" href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                        <a class="item active" href="/account"><i class="user outline icon"></i>Account</a>
                    </>

            }


      </div>
    )
  }
}

export default Dashboard_sidebar_example;
 
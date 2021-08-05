import React from 'react';
import { Segment, Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";


const width = window.innerWidth

class Dashboard_sidebar_mobile extends React.Component  {
     
    constructor(props) {
        console.log('props: ', props)
        super();
        this.state = {
            active: props.active,
            user: props.user,
            feedback: true
        };
      } 

  render() {
    return (
        <div style={{marginLeft:20, paddingTop:20}}>
        <Button
          style={{backgroundColor:'transparent'}}
          onClick={()=>this.setState({showMenu: !this.state.showMenu})}
        >
          <i class="bars icon" style={{fontSize:25, color:'#1b1b1c'}}/>
        </Button>
        {
          this.state.showMenu
          ?    <div className="shadow-light" style={{backgroundColor:'white', width:0.8*width, borderRadius:10, paddingLeft:0, paddingRight:0, marginLeft:0.05*width, marginTop: 10, paddingBottom: 10}}>
          <div class="item">
            <Link
                to="/dashboard2"
              >
                <img src={process.env.PUBLIC_URL + '/logo.png'} height="25px" alt='logo' style={{marginBottom: 30, marginTop: 20, marginLeft:10}}/>
            </Link>
          </div>
          <div class="center" style={{marginBottom: 50}}>
            <h3>Hi <span className="highlight">{this.state.user.name}</span>, <br/> welcome back!</h3>
            <p><b>Store url</b>: {this.state.user.store}</p>
          </div>


        {
            this.state.active === 1
            ? <>
                <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
                    <a style={{color:'#1b1b1c'}} href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                </Segment>
                <Segment vertical style={{textAlign:'center'}}>
                    <a style={{color:'#1b1b1c'}} href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                </Segment>
                <Segment vertical style={{textAlign:'center'}}>
                    <a style={{color:'#1b1b1c'}} href="/account"><i class="user outline icon"></i>Account</a>
                </Segment>
            </>
            : this.state.active === 2 
                ?   <>
                    <Segment vertical style={{textAlign:'center'}}>
                        <a style={{color:'#1b1b1c'}} href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                    </Segment>
                    <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
                        <a style={{color:'#1b1b1c'}} href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                    </Segment>
                    <Segment vertical style={{textAlign:'center'}}>
                        <a style={{color:'#1b1b1c'}} href="/account"><i class="user outline icon"></i>Account</a>
                    </Segment>
                    </>
                :
                    <>
                    <Segment vertical style={{textAlign:'center'}}>
                        <a style={{color:'#1b1b1c'}} href="/dashboard2"><i class="list alternate outline icon"></i>Reviews</a>
                    </Segment>
                    <Segment vertical style={{textAlign:'center'}}>
                        <a style={{color:'#1b1b1c'}} href="/dashboard_history"><i class="lightbulb outline icon"></i>Actionable Strategies</a>
                    </Segment>
                    <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
                        <a style={{ color:'#1b1b1c'}} href="/account"><i class="user outline icon"></i>Account</a>
                    </Segment>
                    </>
        }
        </div>
          : null
        }
      </div>
    )
  }
}

export default Dashboard_sidebar_mobile;
 
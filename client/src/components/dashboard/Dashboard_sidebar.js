import React from 'react';
import { Card, Button, Segment, TextArea } from 'semantic-ui-react';
import { Link } from "react-router-dom";


class Dashboard_sidebar extends React.Component  {
    
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
      console.log("user: ", this.state.user)
    return (
        <div class="ui left fixed vertical menu" style={{width:window.innerWidth/12*2}}>
            <div class="item">
            <Link
                to="/"
                >
                <img src={process.env.PUBLIC_URL + '/vic-logo2.png'} height="35px" alt='logo' style={{marginBottom: 30, marginTop: 20}}/>
            </Link>
            </div>
            <div class="center" style={{marginBottom: 50}}>
                <h3>Hi <span className="highlight">{this.state.user.store}</span>!</h3>                
            </div>

            {
                this.state.active === 1?
                <>
                    <a class="item active" href="/dashboard_search"><i class="search icon"></i>Start a Request</a>
                    <a class="item" href="/dashboard_history"><i class="list icon"></i>My Request</a>
                    <a class="item" href="/account"><i class="user outline icon"></i>Account</a>
                </>
                :
                    this.state.active === 2?
                    <>
                        <a class="item" href="/dashboard_search"><i class="search icon"></i>Start a Request</a>
                        <a class="item active" href="/dashboard_history"><i class="list icon"></i>My Request</a>
                        <a class="item" href="/account"><i class="user outline icon"></i>Account</a>
                    </>
                    :
                    <>
                        <a class="item" href="/dashboard_search"><i class="search icon"></i>Start a Request</a>
                        <a class="item" href="/dashboard_history"><i class="list icon"></i>My Request</a>
                        <a class="item active" href="/account"><i class="user outline icon"></i>Account</a>
                    </>

            }

            {
                !this.state.feedback?
                <div style={{width:"80%", marginLeft:"10%", position: 'absolute', bottom:30}}>
                    <Card>
                        <Card.Content>  
                            <Card.Header>Feedback</Card.Header>
                            <Card.Meta>Let us know how we did and tell us what features you would like us to develop for your store.</Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='red' onClick={()=>this.setState({feedback:false})}>
                                    No
                                </Button>
                                <Button basic color='green' onClick={()=>{
                                    window.open("https://forms.gle/RScKN46RgUZwwWk87", "_blank")
                                }}>
                                    Yes
                                </Button>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
                : null 
            }


      </div>
    )
  }
}

export default Dashboard_sidebar;
 
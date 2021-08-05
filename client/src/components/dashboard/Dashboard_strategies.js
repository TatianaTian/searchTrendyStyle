import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AnalysisContext from '../context/AnalysisContext';
import { Icon, Step, Segment, Button  } from 'semantic-ui-react'
import Dashboard_sidebar from './Dashboard_sidebar';


var store_url, review_num, username
const height = window.innerHeight

class Dashboard_strategies extends Component {
  constructor(props) {
    super();
    this.state = {
        signedIn: localStorage.getItem('signedIn'),
        urls: {}
    };
  }

  

  componentDidMount() {
    store_url = localStorage.getItem('store_url');
    review_num = localStorage.getItem('review_number')
    username = localStorage.getItem("username");

    console.log(store_url)
    console.log('start to request data')
    axios
    .post("/api/scrape/fetch_data", {store_url: store_url})
    .then(res => {
        this.setState({
            urls: res.data.urls
        })
    })
  }

  static contextType = AnalysisContext;

  render() {

    return (
        <>
            <div className="desktop-only row">
                <div className="col s2">
                    <Dashboard_sidebar active={1} user={this.state.user}/>
                </div>

                <div className="col s10" style={{paddingRight:80, paddingLeft:80, paddingTop:40, backgroundColor:'#f0f7f2', height:height}}>
                    <Link to="/dashboard2" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back to
                        dashboard
                    </Link>
                    {/* introduction/explaination */}
                    <Segment.Group>
                        <Segment>
                            <h2 className='heading'>Review {review_num}</h2>
                            This review compared <u>{store_url}</u> against <u>anthropoligie.com</u> in first impression, colors, images, texts, and typographies. Pay attention to how <u>{store_url}</u> is different from <u>anthropoligie.com</u> in these aspects.
                        </Segment>
                    </Segment.Group>


                    {/* flow chart */}
                    <div className="row">

                    <Step.Group size='mini' widths={6}>

                        <Step style={{opacity: 0.8, color:'grey'}} href='/dashboard_images'>
                        <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='image_icon'/>
                        <Step.Content>
                            <Step.Title>Images</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.8, color:'grey'}} href='/dashboard_colors'>
                        <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='color'/>
                        <Step.Content>
                            <Step.Title>Colors</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.8, color:'grey'}} href='/dashboard_texts'>
                        <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='text'/>
                        <Step.Content>
                            <Step.Title>Texts</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.8, color:'grey'}} href='/dashboard_typographies'>
                        <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='typography'/>
                        <Step.Content>
                            <Step.Title>Typographies</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step style={{opacity: 0.8, color:'grey'}} href='/dashboard_impression'>
                        <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                        <Step.Content>
                            <Step.Title>First impression</Step.Title>
                        </Step.Content>
                        </Step>

                        <Step href='/dashboard_strategies' active style={{color:'grey'}}>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title><b style={{color:'black'}}>Actionable Strategies</b></Step.Title>
                        </Step.Content>
                        </Step>

                    </Step.Group>

                    </div>


                    <div className="row">
                        <div className="col s6">
                            <Button
                                style={{ marginLeft: "auto" }}
                                onClick={()=> {
                                    this.props.history.push({
                                        pathname: "/dashboard_impression"
                                        })
                                }}
                        >Last: First Impression</Button>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col m3 desktop-only">
                        </div>
                        <div className="col m6 s12">
                            <p className="center"><b>{store_url}</b></p>
                            <div className="result-card" style={{backgroundColor:'#f8efd4', paddingTop: '25px', paddingLeft:'25px', paddingRight:'25px', paddingBottom:'25px', width:'100%'}}>
                                <h5 className='heading center'><span className="highlight">Actionable Strategies</span></h5>
                                <p className='subheading'>                
                                We benchmarked your store to 20 successful online stores in your category. 
                                Haloy found what <span style={{textDecoration:'underline'}}>{store_url}</span> is missing and recommended a list of actionable strategies. 
                                Check out our example below!</p> 
                                <div className="center">
                                <Button 
                                variant="outline-light" 
                                size="sm" 
                                style={{backgroundColor:'#cfe5d5', color:'#1b1b1c'}}
                                onClick={()=> {
                                    this.props.history.push({
                                        pathname: "/strategy_example"
                                    })
                                }}
                                >Example</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    style={{backgroundColor:'#1b1b1c', color:'white'}}
                                    onClick={()=> {
                                        this.props.history.push({
                                            pathname: "/dashboard_history"
                                        })
                                    }}
                                    >Check strategies</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

  }
}

export default Dashboard_strategies;



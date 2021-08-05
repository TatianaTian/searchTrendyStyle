import React, { Component } from "react";
//import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCheckCircle, faHourglassHalf, faChartPie } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import AnalysisContext from '../context/AnalysisContext';
import { Form, Input, Grid, Card, Image, Icon, Checkbox, Segment, Header, Button } from 'semantic-ui-react';
import Dashboard_sidebar from './Dashboard_sidebar';
import Dashboard_sidebar_mobile from './Dashboard_sidebar_mobile';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageUploader from "react-images-upload";
import ImageUploading from "react-images-uploading";
import data from './data.json';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
const imageConversion = require("image-conversion")



const width = window.innerWidth
const height = window.innerHeight
var detailUrlList = []
const maxNumber = 69;

class Dashboard_analyze extends Component {
  constructor(props) {
    //console.log('props: ', props)
    super();
    this.state = {
      user: props.auth.user,
      url: "",
      loading: false,
      error_message:'',
      window: false,
      email: '',
      thankYou: false,
      emailError: '',
      selectedOption: null,
      progress: 5,
      image_num: 0,
      value: null,
      select: null,
      invitation_code: null,
      review_example: localStorage.getItem('review_example')? true : false,
      AS_example: localStorage.getItem('AS_example')? true : false,
      pictures: [],
      uploadSuccess: false,
      uploadPending: false,
      searchPending: false,
      resultsSuccess: false,
      submitSuccess: false,
      img_key: null,
      submitError: null,
      uploadError: null,
      checked: false,
      checkedList: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      all_results: [],
      images: [], 
      setImages: []
    };
    //this.onDrop = this.onDrop.bind(this);
  }
  static contextType = AnalysisContext;
  
  onChange = (imageList, addUpdateIndex) => {
    // data for submit
    //console.log(imageList, addUpdateIndex);
    console.log('imageList: ', imageList[0]['file'])
    console.log('addUpdateIndex: ', addUpdateIndex)
    //setImages(imageList);
    this.setState({images: imageList, uploadPending: true, uploadSuccess: false, searchPending: false, uploadError: null, submitSuccess: false})

    const changeUploadStatus = (status) => {
      this.setState({uploadPending: false, uploadSuccess: status, img_key})
    }

    const img_key = this.state.user.id + Math.floor(Math.random() * 100000)

    console.log('img_key: ', img_key)


    axios
    .post("/api/scrape/image_upload",{img_key})
    .then((data)=>{
      console.log('data: ', data)
      var signedPutUrl = data.data;

      // upload the picture to S3
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', signedPutUrl)
      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                console.log('Image successfully uploaded to S3')
                changeUploadStatus(true)
              } else {
                  console.log('Error while sending the image to S3')
              }
          }
      }
      xhr.setRequestHeader('Content-Type', 'image/jpeg')

      // 缩小图片
      imageConversion.compressAccurately(imageList[0]['file'],300).then(res=>{
        //The res in the promise is a compressed Blob type (which can be treated as a File type) file;
        console.log('in imageConversion');
        console.log('shrink image: ', res);
        xhr.send(res, error => console.log('error is ',error));
      })

      //xhr.send(imageList[0]['file'], error => console.log('error is ',error));
    })
    .catch(err => {
      console.log('err: ', err)
      this.setState({uploadPending: false, uploadError: "Something wrong with uploading the picture. Please try again."})
    });
  };

  componentDidMount() {
    {/* 更新用户数据 */}
    window.scrollTo(0, 0)
    axios
    .post("/api/users/refreshData", {id: this.state.user.id})
    
    .then(res => {
        this.setState({user: res.data})
        console.log('res.data: ', res.data)
    })
    .catch(err => {console.log('err: ', err)});
  }
  
  handleSubmitPreview = () => {
    if (this.state.img_key !== null && detailUrlList.length>0){
      axios
      .post("/api/users/requestDetails", 
        {
          userId: this.state.user.id,
          img_key: this.state.img_key,
          more_info_product: detailUrlList
        })
      .then(res => {
          console.log('res.data: ', res.data)
          if (res.data === true){
            this.setState({submitSuccess: true, resultsSuccess: false, uploadSuccess: false})
            window.scrollTo(0, 0)
          }
      })
      .catch(err => {
        console.log('err: ', err)
        this.setState({submitError: err.message})
      });
    } else {
      this.setState({submitError: "please select at least one style."})
    }
  }

  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };  

  handleNavigation = (page) => {
    this.props.history.push({
      pathname: `/${page}`, 
    })
  }

  handleChange2 = (e, { value }) => this.setState({ value })

  onSearch = () => {
    console.log('entered onSearch')
    var all_results = this.state.all_results
    this.setState({searchPending: true, resultsSuccess: false, submitError: null, submitSuccess: false,
      checkedList: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false, false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    })
    axios
    .post("https://cors-universal.herokuapp.com/http://52.3.253.145/calcsign.aspx", 
        {
          "endpoint":"com.alibaba.linkplus:alibaba.cross.similar.offer.search-1",
          "parameters":{
              "picUrl":"https://1688imgsearch.s3.amazonaws.com/search_style_images/"+this.state.img_key,
              "page":1,
          }
      }
    )
    .then(res => {
      console.log('Page 1 res.data: ', res.data)
      axios
      .get("https://cors-universal.herokuapp.com/"+res.data)
      .then(response => {
        console.log('Page 1 response.data.success: ', response.data.success)
        console.log('Page 1 response.data.result.total: ', response.data.result.total)
        if (response.data.success){
            const resultsPage1 = response.data.result.result
            if (response.data.result.total>20){
              axios
              .post("https://cors-universal.herokuapp.com/http://52.3.253.145/calcsign.aspx", 
                  {
                    "endpoint":"com.alibaba.linkplus:alibaba.cross.similar.offer.search-1",
                    "parameters":{
                        "picUrl":"https://1688imgsearch.s3.amazonaws.com/search_style_images/"+this.state.img_key,
                        "page":2,
                    }
                }
              )
              .then(res => {
                console.log('Page 2 res.data: ', res.data)
                axios
                .get("https://cors-universal.herokuapp.com/"+res.data)
                .then(response => {
                  console.log('Page 2 response.data.success: ', response.data.success)
                  console.log('Page 2 response.data.result.total: ', response.data.result.total)
                  if (response.data.success){
                    const resultsPage2 = response.data.result.result 
                    all_results = resultsPage1.concat(resultsPage2);
                    detailUrlList = []
                    this.setState({all_results, resultsSuccess: true, searchPending: false})
                  } else {
                    all_results = resultsPage1
                    this.setState({all_results, resultsSuccess: true, searchPending: false})
                  }
                })
                .catch(err => {
                  console.log('error: ', err)
                  this.setState({uploadError: 'Something wrong with searching. Please try again.', uploadPending: false})
                })
              })
              .catch (err => {
                this.setState({uploadError: 'Something wrong with searching. Please try again.', uploadPending: false})
              })
            } else {
              all_results = resultsPage1
              detailUrlList = []
              this.setState({all_results, resultsSuccess: true, searchPending: false})
            }
        } else {
          this.setState({ resultsSuccess: true, searchPending: false})
        }
      })
      .catch(err => {
        console.log('error: ', err)
        this.setState({uploadError: 'Something wrong with searching. Please try again.', uploadPending: false})
      })
    })
    .catch(err => {
      console.log('error: ', err)
      this.setState({uploadError: 'Something wrong with searching. Please try again.', uploadPending: false})
    })
    //this.setState({resultsSuccess: true})
  }

  toggle = (i) => {
    console.log('i: ', i)
    console.log('checkedList: ', this.state.checkedList)
    const newCheckedList = this.state.checkedList
    newCheckedList[i] = !newCheckedList[i]
    const deUrl = this.state.all_results[i].detailUrl

    if (newCheckedList[i]){
      detailUrlList.push(this.state.all_results[i].detailUrl)
    } else {
      detailUrlList = detailUrlList.filter(function(value, index, arr, ){ 
        //return value !== this.state.all_results[i].detailUrl;
        return value !== deUrl
      });
    }
    
    console.log('newCheckedList: ', newCheckedList)
    this.setState({checkedList: newCheckedList})
  }

  render() {
    console.log('this.state.resultsSuccess: ', this.state.resultsSuccess)
    console.log('detailUrlList: ', detailUrlList)
    console.log('this.state.all_results: ', this.state.all_results)

    //const search_results = data.result.result.map((listing, i)=>{
    const search_results = this.state.all_results.map((listing, i)=>{
          const askPrice = listing.oldPrice/100/6*1.25
          const askPrice2Decimal = askPrice.toFixed(2)
          return (
            <>
            <div className="desktop-only">
            <Grid.Column width={4} >
            <Card style={{marginTop:25}}>
            <Image src={listing.imageUrl} wrapped ui={false} />
            <Card.Content>
              <Card.Header style={{color:'#0C4A34'}}>${askPrice2Decimal}</Card.Header>
              <Card.Meta>
                <span className='date'>Style {i+1}</span>
              </Card.Meta>
              <Card.Description style={{color:'#0C4A34'}}>
                Minimum order quantity: {listing.quantityBegin}
              </Card.Description>
            </Card.Content>
            <Card.Content extra >
              <a>
                <Checkbox 
                  label='Request full product details'
                  onChange={()=>this.toggle(i)}
                  checked={this.state.checkedList[i]}
                />
              </a>
            </Card.Content>
          </Card>
          </Grid.Column>
          </div>
          <div className="mobile-only">
          <Grid.Column width={16} >
            <Card style={{marginTop:25}}>
                  <Image src={listing.imageUrl} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header style={{color:'#0C4A34'}}>${askPrice2Decimal}</Card.Header>
                    <Card.Meta>
                      <span className='date'>Style {i+1}</span>
                    </Card.Meta>
                    <Card.Description style={{color:'#0C4A34'}}>
                      Minimum order quantity: {listing.quantityBegin}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra >
                    <a>
                      <Checkbox 
                        label='Request full product details'
                        onChange={()=>this.toggle(i)}
                        checked={this.state.checkedList[i]}
                      />
                    </a>
                  </Card.Content>
                </Card>
            </Grid.Column>

            </div>
            </>
          )
        })  


    const next_step = (
      <>
      <p style={{marginTop:20}}>Found {this.state.all_results.length} results</p>
      <p className="heading" style={{fontSize:20, marginTop:20}}>Next Step</p>
      <Accordion preExpanded={['a']} className="accordion" style={{marginTop:0}}>
        <AccordionItem uuid="a">
            <AccordionItemHeading>
                <AccordionItemButton>
                    <span className="navheading h5" style={{fontSize:20, color:"#0C4A34", lineHeight: 1.5}}><Icon name='list' /> Pick your favorites to get full product details</span>
                </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="accordion__panel">
                <p className="desktop-only" style={{ paddingLeft:20, paddingRight:20, paddingBottom:40}}>
                    We found {this.state.all_results.length} products based on your submission. Please check the box under each product if you want to learn more or place an order. Some have the same image and even pricing - they may be produced from different manufacturers. Just select one of them and we will find the best one! Once you click ‘Submit’, we will be in touch with you shortly. 
                </p>
                <p className="mobile-only" style={{ paddingLeft:5, paddingRight:5, paddingBottom:20, paddingTop:20}}>
                    We found {this.state.all_results.length} products based on your submission. Please check the box under each product if you want to learn more or place an order. Some have the same image and even pricing - they may be produced from different manufacturers. Just select one of them and we will find the best one! Once you click ‘Submit’, we will be in touch with you shortly. 
                </p>
            </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem uuid="b">
            <AccordionItemHeading>
                <AccordionItemButton>
                  <span className="navheading h5" style={{fontSize:20, color:"#0C4A34", lineHeight: 1.5}}><Icon name='shopping cart'/> Shop directly at your personal collection </span>
                </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
                <p className="desktop-only" style={{ paddingLeft:20, paddingRight:20, paddingBottom:40}}>
                  We will add the products you selected to your personal collection. If this is your first time using V.I.C., the collection link will be created and emailed to you in 24 hours. Otherwise, you will be notified by email once we completed adding products to your site. You could also go to ‘My Request’ to check the status of each product.
                </p>
                <p className="mobile-only" style={{ paddingLeft:5, paddingRight:5, paddingBottom:20, paddingTop:20}}>
                  We will add the products you selected to your personal collection. If this is your first time using V.I.C., the collection link will be created and emailed to you in 24 hours. Otherwise, you will be notified by email once we completed adding products to your site. You could also go to ‘My Request’ to check the status of each product.
                </p>
            </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
      </>
    )

    const main_desktop = (
      <div className="desktop-only row">
      <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={3}>
              <Dashboard_sidebar active={1} user={this.state.user}/>
            </Grid.Column>
            <Grid.Column width={13}>
              <Grid columns={3} style={{backgroundColor:'#F9F4EF'}}>
                  <Grid.Row className="center-align">
                      <Grid.Column width={4}/>
                      <Grid.Column width={8}>
                          <h2 className='heading' style={{marginLeft:0, marginTop:100}}>Upload a style picture</h2>
                          {/*}
                          <ImageUploader
                              withIcon={true}
                              buttonText="Choose image"
                              onChange={this.onDrop}
                              imgExtension={[".jpg", ".png", ".jpeg"]}
                              maxFileSize={5242880}
                              withPreview={true}
                            />
                            */}


                            <Segment placeholder style={{backgroundColor:'white'}} >
                                <Header icon>
                                <Icon name='upload' />
                                
                                <ImageUploading
                                    multiple
                                    value={this.state.images}
                                    onChange={this.onChange}
                                    maxNumber={maxNumber}
                                    dataURLKey="data_url"
                                    multiple={false}
                                  >
                                    {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging, 
                                      dragProps
                                    }) => (
                                      // write your building UI
                                      <div className="upload__image-wrapper">
                                        <button
                                          //style={isDragging ? { color: "red" } : null}
                                          className="btn waves-effect waves-light hoverable accent-3"
                                          style={{
                                            borderRadius: "0px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem",
                                            fontWeight:'bold',
                                            backgroundColor:'#DDE3DD',
                                            color:'#0c4a34',
                                            height: '50px',
                                            paddingLeft:'16px',
                                            paddingRight:'16px',
                                            //marginBottom: '30px'
                                          }}
                                          onClick={onImageUpload}
                                          {...dragProps}
                                        >
                                          Choose image
                                        </button>
                                        {imageList.map((image, index) => (
                                          <div key={index} className="image-item" style={{marginTop:'30px'}}>
                                            <img src={image.data_url} alt="" width="100" />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </ImageUploading>
                                </Header>
                            </Segment>









                            {
                              this.state.uploadPending?
                              <Icon loading name='spinner' />:
                              null
                            }
                            {
                              this.state.uploadError?
                              <p>{this.state.uploadError}</p>:
                              null
                            }
                            {
                              this.state.uploadSuccess?
                              <button
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
                                //marginLeft:'8px'
                                }}
                              className="btn waves-effect waves-light hoverable accent-3"
                              onClick={this.onSearch}
                            >
                              <h4>Search</h4>
                            </button>:
                              null
                            }
                            {
                              this.state.searchPending?
                              <div style={{marginTop:10}}>
                              <Icon loading name='spinner' />
                              </div>:
                              null
                            }
                            {
                              this.state.resultsSuccess?
                              next_step:
                              null
                            }
                            {
                              this.state.submitSuccess?
                              <Segment >
                                <Header icon>
                                  <Icon name='checkmark'style={{color:'#0C4A34'}}/>
                                  Submitted!
                                </Header>
                            </Segment>:
                            null
                            }
                      </Grid.Column>
                      <Grid.Column width={4}/>
                  </Grid.Row>
                  <Grid.Row style={{marginLeft:25, marginTop:30}}>
                        {
                          this.state.resultsSuccess?
                          <>
                            <p className="heading" style={{fontSize:20, marginTop:20}}>Product Previews</p>
                          <Grid>
                          {search_results}
                          </Grid>
                          </>
                          :null
                        }
                  </Grid.Row>
                  <Grid.Row className="center-align" style={{marginBottom:200}}>
                      <Grid.Column width={4}/>
                      <Grid.Column width={8}>
                        {
                            this.state.resultsSuccess?
                            <button
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
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmitPreview}
                              >
                                <h4>Submit</h4>
                            </button>:
                            null
                                }
                        </Grid.Column>
                        <Grid.Column width={4}/>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>                
        </Grid>
      </div>
    )

    const main_mobile = (
      <div className="mobile-only row">
        <div style={{marginLeft:20, paddingTop:80}}>
        <Button
          style={{backgroundColor:'transparent'}}
          onClick={()=>this.setState({showMenu: !this.state.showMenu})}
        >
          <i class="bars icon" style={{fontSize:25, color:'#1b1b1c'}}/> 
        </Button>
        {
          this.state.showMenu
          ?    
          <div className="shadow-light" style={{backgroundColor:'white', width:0.8*width, borderRadius:10, paddingLeft:0, paddingRight:0, marginLeft:0.05*width, marginTop: 10, paddingBottom: 10}}>
            <div class="item">
              <Link
                  to="/"
                >
                  <img src={process.env.PUBLIC_URL + '/vic-logo2.png'} height="25px" alt='logo' style={{marginBottom: 10, marginTop: 20, marginLeft:10}}/>
              </Link>
            </div>
            <div class="center" style={{marginBottom: 50}}>
              <h3>Hi <span className="highlight">{this.state.user.store}</span>!</h3>
            </div>
            <Segment vertical style={{backgroundColor:'#F2F2F2', textAlign:'center'}}>
              <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('dashboard_search')}><i class="search icon"></i>Start a Request</a>
            </Segment>
            <Segment vertical style={{textAlign:'center'}}>
              <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('dashboard_history')}><i class="list icon"></i>My Request</a>
            </Segment>
            <Segment vertical style={{textAlign:'center'}}>
              <a style={{color:'#1b1b1c'}} onClick={()=>this.handleNavigation('account')}><i class="user outline icon"></i>Account</a>
            </Segment>
          </div>
          : null
        }

        <Grid columns={1}>
          <Grid.Row>
            <Grid.Column>
              <Grid columns={1} style={{backgroundColor:'#F9F4EF'}}>
                  <Grid.Row className="center-align">
                      <Grid.Column width={2}/>
                      <Grid.Column width={12} style={{marginLeft:-10}}>
                          <h2 className='heading' style={{marginLeft:0, marginTop:100}}>Upload a style picture</h2>
                          {/* 
                          <ImageUploader
                              withIcon={true}
                            buttonText="Choose image"
                              onChange={this.onDrop}
                              imgExtension={[".jpg", ".png"]}
                              maxFileSize={5242880}
                              withPreview={true}
                            />
                            */}

                            <Segment placeholder style={{backgroundColor:'white'}} >
                                <Header icon>
                                <Icon name='upload' />
                                <ImageUploading
                                    multiple
                                    value={this.state.images}
                                    onChange={this.onChange}
                                    maxNumber={maxNumber}
                                    dataURLKey="data_url"
                                    multiple={false}
                                  >
                                    {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging, 
                                      dragProps
                                    }) => (
                                      // write your building UI
                                      <div className="upload__image-wrapper">
                                        <button
                                          //style={isDragging ? { color: "red" } : null}
                                          className="btn waves-effect waves-light hoverable accent-3"
                                          style={{
                                            borderRadius: "0px",
                                            letterSpacing: "1.5px",
                                            marginTop: "1rem",
                                            fontWeight:'bold',
                                            backgroundColor:'#DDE3DD',
                                            color:'#0c4a34',
                                            height: '50px',
                                            paddingLeft:'16px',
                                            paddingRight:'16px',
                                            //marginBottom: '30px'
                                          }}
                                          onClick={onImageUpload}
                                          {...dragProps}
                                        >
                                          Choose image
                                        </button>
                                        {imageList.map((image, index) => (
                                          <div key={index} className="image-item" style={{marginTop:'30px'}}>
                                            <img src={image.data_url} alt="" width="100" />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </ImageUploading>  
                                </Header>
                            </Segment>

                            {
                              this.state.uploadPending?
                              <Icon loading name='spinner' />:
                              null
                            }
                            {
                              this.state.uploadError?
                              <p>{this.state.uploadError}</p>:
                              null
                            }
                            {
                              this.state.uploadSuccess?
                              <button
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
                                //marginLeft:'8px'
                                }}
                              className="btn waves-effect waves-light hoverable accent-3"
                              onClick={this.onSearch}
                            >
                              <h4>Search</h4>
                            </button>:
                              null
                            }
                            {
                              this.state.searchPending?
                              <div style={{marginTop:10}}>
                              <Icon loading name='spinner' />
                              </div>:
                              null
                            }
                            {
                              this.state.resultsSuccess?
                              next_step:
                              null
                            }
                            {
                              this.state.submitSuccess?
                              <Segment >
                                <Header icon>
                                  <Icon name='checkmark'style={{color:'#0C4A34'}}/>
                                  Submitted!
                                </Header>
                            </Segment>:
                            null
                            }
                      </Grid.Column>
                      <Grid.Column width={2}/>
                  </Grid.Row>
                  <Grid.Row style={{marginLeft:25, marginTop:30}}>
                        {
                          this.state.resultsSuccess?
                          <>
                            <p className="heading" style={{fontSize:20, marginTop:20}}>Product Previews</p>
                          <Grid>
                              {search_results}
                          </Grid>
                          </>
                          :null
                        }
                  </Grid.Row>
                  <Grid.Row className="center-align" style={{marginBottom:100}}>
                      <Grid.Column width={2}/>
                      <Grid.Column width={12} style={{marginLeft:-10}}>
                        {
                            this.state.resultsSuccess?
                            <button
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
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmitPreview}
                              >
                                <h4>Submit</h4>
                            </button>:
                            null
                                }
                        </Grid.Column>
                        <Grid.Column width={2}/>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>                
        </Grid>


      </div>
      </div>
    )

    const main_content =  (
      <div style={{backgroundColor:'#F9F4EF', marginTop:-50, minHeight:window.innerHeight*1.1, paddingBottom:100, color:'#0C4A34'}}>
            {/* 电脑版本 */}
            {main_desktop}
            {main_mobile}
      </div>
    )


  
    return <>
    {main_content}
    </>
  }
}

Dashboard_analyze.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(
    mapStateToProps,
    {  }
  )(Dashboard_analyze);
  

//export default Dashboard_analyze;

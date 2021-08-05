import React, { Component } from "react";
import {Button } from 'react-bootstrap';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch, faCheckCircle, faHourglassHalf, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Element } from 'react-scroll';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import Select from 'react-select';
import AnalysisContext from '../context/AnalysisContext';
import { Form, Card, Image, Checkbox,Grid } from 'semantic-ui-react'

const options = [
  { value: 'clothing', label: 'clothing' },
  { value: 'accessories', label: 'accessories' },
  { value: 'pet', label: 'pet' },
];

const width = window.innerWidth
const height = window.innerHeight
var detailUrlList = []

class SearchBmk extends Component {
  constructor() { 
    super();
    this.state = {
      name: null,
      all_results: [],
      checkedList: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      submitSuccess: false,
      submitError: null,
    };
  }

  static contextType = AnalysisContext;
  
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  onSearch = () => {
    detailUrlList = []
    console.log('this.state.name: ', this.state.name)
    this.setState({
      checkedList: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      submitSuccess: false,
      all_results: []
    })
    axios
    .post("https://cors-universal.herokuapp.com/http://52.3.253.145/calcsign.aspx", 
        {
          "endpoint":"com.alibaba.linkplus:alibaba.cross.similar.offer.search-1",
          "parameters":{
              "picUrl":"https://1688imgsearch.s3.amazonaws.com/style_recommendation/"+this.state.name+'.png',
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
          this.setState({all_results: response.data.result.result})
        }
      })
      .catch(err => {
        console.log('error: ', err)
        this.setState({uploadError: 'Something wrong with searching. Please try again.'})
      })
    })
    .catch(err => {
      console.log('error: ', err)
      this.setState({uploadError: 'Something wrong with searching. Please try again.', uploadPending: false})
    })
  }
 
  toggle = (i) => {
    console.log('i: ', i)
    console.log('checkedList: ', this.state.checkedList)
    const newCheckedList = this.state.checkedList
    newCheckedList[i] = !newCheckedList[i]
    const deUrl = this.state.all_results[i].detailUrl

    if (newCheckedList[i]){
      detailUrlList.push({
        url: this.state.all_results[i].detailUrl,
        price: this.state.all_results[i].oldPrice/100/6*1.25.toFixed(2),
        moq: this.state.all_results[i].quantityBegin,
        imageUrl: this.state.all_results[i].imageUrl
      })
    } else {
      detailUrlList = detailUrlList.filter(function(value, index, arr, ){ 
        //return value !== this.state.all_results[i].detailUrl;
        return value.url !== deUrl
      });
    }
    
    console.log('newCheckedList: ', newCheckedList)
    this.setState({checkedList: newCheckedList})
  }

  handleSubmitPreview = () => {
    if (this.state.name !== null && detailUrlList.length === 6){
      axios
      .post("/api/users/styleMatchMfr", 
        {
          img_key: this.state.name,
          more_info_product: detailUrlList,
        })
      .then(res => {
          console.log('res.data: ', res.data)
          if (res.data === true){
            this.setState({submitSuccess: true})
            window.scrollTo(0, 0)
          }
      })
      .catch(err => {
        console.log('err: ', err)
        this.setState({submitError: err.message})
      }); 
    } else {
      this.setState({submitError: "please select 6 styles only and make sure image number is entered"})
    }
  }


  render() {
    const { name, submitSuccess } = this.state
    console.log('this.state.all_results: ', this.state.all_results)
    console.log('detailUrlList: ', detailUrlList)
    console.log('submitSuccess: ', submitSuccess)

    //const search_results = data.result.result.map((listing, i)=>{
    const search_results = this.state.all_results.map((listing, i)=>{
          const askPrice = listing.oldPrice/100/6*1.25
          const askPrice2Decimal = askPrice.toFixed(2)
          return (
            <>
            <div className="desktop-only">
            <Grid.Column width={3} >
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

    return <>
    <div className="container">
    <Form>
        <Form.Group unstackable widths={2}>
          <Form.Input
            placeholder='Brand Name'
            name='name'
            value={name}
            onChange={this.handleChange}
          />
        </Form.Group>
      </Form>
      <button
          style={{
          borderRadius: "5px",
          letterSpacing: "1.5px",
          marginTop: "1rem",
          fontWeight:'bold',
          backgroundColor:'#f8e1fb',
          color:'#B0283E',
          height: '50px',
          paddingLeft:'16px',
          paddingRight:'16px',
          //marginRight:'8px'
          //zIndex: -1
          }}
          className="btn waves-effect waves-light hoverable accent-3"
          onClick={this.onSearch}
      >
      <p>Search</p>
      </button>
      <Image src={"https://1688imgsearch.s3.amazonaws.com/style_recommendation/"+this.state.name+".png"} wrapped ui={false} width="20%"/>
     {
       this.state.submitSuccess?
       null:
       <>
       <Grid>
       {search_results}
       </Grid>

       <button
           style={{
           borderRadius: "5px",
           letterSpacing: "1.5px",
           marginTop: "1rem",
           fontWeight:'bold',
           backgroundColor:'#f8e1fb',
           color:'#B0283E',
           height: '50px',
           paddingLeft:'16px',
           paddingRight:'16px',
           //marginRight:'8px'
           //zIndex: -1
           }}
           className="btn waves-effect waves-light hoverable accent-3"
           onClick={this.handleSubmitPreview}
       >
       <p>Submit</p>
       </button>
       {
         this.state.submitError?
         <p>{this.state.submitError}</p>:
         null
       }
       </>
     }
      </div>
    </>
  
  }
}

export default SearchBmk;

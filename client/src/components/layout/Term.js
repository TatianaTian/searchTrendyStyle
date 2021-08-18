import React, { Component } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Select from 'react-select';
import axios from "axios";
import variableStyles from '../../data/variableStyles.json';

import { Form, Input, Grid, Divider, Segment, Card, Image, Checkbox, Icon } from 'semantic-ui-react'

const options = [
    'DHL (1-2 weeks)', 
    'USPS (1 month)', 
    'Ocean (1-2 month)'
];

const width = window.innerWidth
const height = window.innerHeight

class Term extends Component {
  constructor(props) {
    super();
    this.state = {
        defaultOption: options[0],
        unitWeight: '', 
        quantity: '', 
        selected: null,
        error: null,
        price: null,
        selectedOption1: props.location.state.option1,
        selectedOption2: props.location.state.option2,
        selectedOption3: props.location.state.option3,
        checkedList: [false, false, false],
        toggleChecked: true
    };
    //console.log('props: ', props)
  }

  componentDidMount = async () =>{
    window.scrollTo(0, 0)
  }

  handleNavigation = (page, selectedStyles) => {
    this.props.history.push({
        pathname: `/${page}`,
        state: { selectedStyles: selectedStyles, option1: this.state.selectedOption1, option2: this.state.selectedOption2, option3: this.state.selectedOption3}
        }) 
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  _onSelect = (option) => {
    this.setState({selected: option}) 
  }

  handleChange3 = (selected, index) => {
    console.log('selected: ', selected)
    console.log('index: ', index)
    if (index===2) {
      this.setState({ selectedOption2:  selected, checkedList:[]})
      //this.updateSelection(selected, this.state.selectedOption3)
    }
    if (index===3) {
      this.setState({ selectedOption3:  selected, checkedList:[]})
      //this.updateSelection(this.state.selectedOption2, selected)
    }
    
    //this.setState({ index:  selected})
  };

  toggle = (i) => {
    console.log('i: ', i)
    console.log('checkedList: ', this.state.checkedList)
    const newCheckedList = this.state.checkedList
    newCheckedList[i] = !newCheckedList[i]
    console.log('newCheckedList: ', newCheckedList)
    this.setState({checkedList: newCheckedList})
  }

  toggle2 = () => this.setState((prevState) => ({ toggleChecked: !prevState.toggleChecked }))

  updateStyle = (selectedOption2, selectedOption3) => {
    var allVariableStyles = []
    if (selectedOption2 && selectedOption3){
      for (var i=0; i<selectedOption2.length; i++){
        for (var j=0; j<selectedOption3.length; j++){
          const key1 = selectedOption2[i].value
          const key2 = selectedOption3[j].value
          if (variableStyles[key1][key2]){
            for (var k=0; k<variableStyles[key1][key2].length;k++){
              if (!allVariableStyles.includes(variableStyles[key1][key2][k])){
                allVariableStyles.push(variableStyles[key1][key2][k])
              }
            }
          }
        }
      }
    }
    return allVariableStyles
  }

  handleSubmit = () => {
    //检查是否勾选了任何style
    if (this.state.checkedList.includes(true)){
        this.setState({error:null})
        var selectedStyles = []
        //const key = this.state.selectedOption1.value+'-'+this.state.selectedOption2.value+'-'+this.state.selectedOption3.value
        var allVariableStyles = this.updateStyle(this.state.selectedOption2, this.state.selectedOption3)

        for (var i=0; i<this.state.checkedList.length; i++){
          if (this.state.checkedList[i]===true) selectedStyles.push(allVariableStyles[i])
        }

        console.log('selectedStyles: ', selectedStyles)
        const check = []
        for (var i=0; i<12; i++){
          check.push(false) 
        }

        var option2String = ''
        var option3String = ''
        for (var i=0; i<this.state.selectedOption2.length;i++){
          option2String += ','+this.state.selectedOption2[i].value
        }
        for (var i=0; i<this.state.selectedOption3.length;i++){
          option3String += ','+this.state.selectedOption3[i].value
        }

        console.log('option2String: ', option2String)
        console.log('option3String: ', option3String)

        localStorage.setItem('checkedList', check);
        localStorage.setItem('selectedStyles', selectedStyles)
        localStorage.setItem('option2', option2String)
        localStorage.setItem('option3', option3String)

        //this.handleNavigation('manufacturerlisting', selectedStyles)
        
        axios.post("/api/users/stylePress", {
            gender: 'NO-women',
            category: option2String,
            style: option3String,
            //stylePicNumber: ['2','5']
            stylePicNumber: selectedStyles
          }).then((res)=>{
            if (res){
                this.handleNavigation('manufacturerlisting', selectedStyles)
            }
          })
    } else {
        this.setState({error:"Please select the styles you like ❤️"})
    }
  }

  handleSubmitYes = () => {
    //检查是否勾选了任何style
    if (this.state.checkedList.includes(true)){
        this.setState({error:null})
        var selectedStyles = []
        //const key = this.state.selectedOption1.value+'-'+this.state.selectedOption2.value+'-'+this.state.selectedOption3.value
        var allVariableStyles = this.updateStyle(this.state.selectedOption2, this.state.selectedOption3)

        for (var i=0; i<this.state.checkedList.length; i++){
          if (this.state.checkedList[i]===true) selectedStyles.push(allVariableStyles[i])
        }

        console.log('selectedStyles: ', selectedStyles)
        const check = []
        for (var i=0; i<12; i++){
          check.push(false) 
        }

        var option2String = ''
        var option3String = ''
        for (var i=0; i<this.state.selectedOption2.length;i++){
          option2String += ','+this.state.selectedOption2[i].value
        }
        for (var i=0; i<this.state.selectedOption3.length;i++){
          option3String += ','+this.state.selectedOption3[i].value
        }

        console.log('option2String: ', option2String)
        console.log('option3String: ', option3String)

        localStorage.setItem('checkedList', check);
        localStorage.setItem('selectedStyles', selectedStyles)
        localStorage.setItem('option2', option2String)
        localStorage.setItem('option3', option3String)

        //this.handleNavigation('manufacturerlisting', selectedStyles)
        
        axios.post("/api/users/stylePress", {
            gender: 'YES-women',
            category: option2String,
            style: option3String,
            stylePicNumber: selectedStyles
          }).then((res)=>{
            if (res){
                //this.handleNavigation('manufacturerlisting', selectedStyles)
            }
          })
    } else {
        this.setState({error:"Please select the styles you like ❤️"})
    }
  }

  handleNewSearch = () => {
    axios.post("/api/users/landingPress", {
        gender: this.state.selectedOption1.value,
        category: this.state.selectedOption2.value,
        style: this.state.selectedOption3.value
      })
  }

  render() {

    const { defaultOption, unitWeight, quantity, selected, error, price, selectedOption1, selectedOption2, selectedOption3 } = this.state
    
    console.log('checklist: ', this.state.checkedList)

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    console.log('date:', date)
    console.log('month:', month)
    console.log('year:', year)

    const options1 = [
        { value: 'women', label: 'Women' },
        { value: 'men', label: 'Men' },
      ];

      const options2 = [
        { value: 'tops', label: 'Tops' },
        { value: 'dress', label: 'Dress' },
        { value: 'two-piece set', label: 'Two-piece Set' },
        { value: 'jumpsuits/rompers/bodysuit', label: 'Jumpsuits/rompers/bodysuit' },
        { value: 'blazer', label: 'Blazer' },
        { value: 'bottoms', label: 'Bottoms' },
        { value: 'sweaters', label: 'Sweaters' },
        { value: 'outerwear', label: 'Outerwear' },
        { value: 'costumes/accessories', label: 'Costumes/accessories' },
        { value: 'loungewear', label: 'Loungewear' },
        { value: 'activewear', label: 'Activewear' },
        { value: 'partywear', label: 'Partywear' },
        { value: 'beachwear', label: 'Beachwear' },
      ];
  
      const options3 = [
        { value: 'sexy', label: 'Sexy' },
        { value: 'cutout', label: 'Cutout' },
        { value: 'basics', label: 'Basics' },
        { value: 'cute', label: 'Cute' },
        { value: 'floral', label: 'Floral' },
        { value: 'chic', label: 'Chic' },
        { value: 'comfy', label: 'Comfy' },
        { value: 'edgy', label: 'Edgy' },
        { value: 'family look', label: 'Family look' },
        { value: 'seamless', label: 'Seamless' },
        { value: 'bright color', label: 'Bright color' },
        { value: 'cotton linen', label: 'Cotton linen' },
        { value: 'tie dye', label: 'Tie dye' },
        { value: 'prints', label: 'Prints' },
        { value: 'gen z', label: 'Gen Z' },
      ];

    var allVariableStyles = this.updateStyle(selectedOption2, selectedOption3)

    console.log('allVariableStyles: ',  allVariableStyles)

    const styles=allVariableStyles.map((listing, i)=>{
        //const image_url = 'https://1688imgsearch.s3.amazonaws.com/search_style_images/'+listing
        console.log('listing: ', listing)
        return (
          <>
          <div className="desktop-only">
            <Grid.Column width={4} >
              <Card style={{marginTop:25}} className="center-align">
              <Image src={
                  'https://1688imgsearch.s3.amazonaws.com/style_recommendation/'+listing+'.png'
              } wrapped ui={false} />
              <Card.Content extra >
              {
                  this.state.checkedList[i]?
                  <Icon name='heart' size="large" style={{color: '#ED4956'}}/>
                  : <Icon name='heart outline' size="large" style={{color: '#1b1b1c'}}/>
              } &nbsp; &nbsp;
                  <Checkbox 
                    label='Love the style!'
                    onChange={()=>this.toggle(i)}
                    checked={this.state.checkedList[i]}
                  /> 
              </Card.Content>
            </Card>
          </Grid.Column>
        </div>
        <div className="mobile-only">
  
              <Card style={{marginTop:25, marginLeft:22}} className="center-align">
              <Image src={
                  'https://1688imgsearch.s3.amazonaws.com/style_recommendation/'+listing+'.png'
              } wrapped ui={false} />
              <Card.Content extra >
              {
                  this.state.checkedList[i]?
                  <Icon name='heart' size="large" style={{color: '#ED4956'}}/>
                  : <Icon name='heart outline' size="large" style={{color: '#1b1b1c'}}/>
              } &nbsp; &nbsp;
                  <Checkbox 
                    label='Love the style!'
                    onChange={()=>this.toggle(i)}
                    checked={this.state.checkedList[i]}
                  /> 
              </Card.Content>
            </Card>
  
        </div> 
          </> 
        )
      })  

    return (
        <>
        <div style={{ backgroundColor: "#FEFDFD", color:'#0c4a34', height:height}}>
        <div className="container" >  
            <h4 className='heading center h3' style={{color:'black'}}> &nbsp; <span className="highlight2">Trendy Styles</span></h4>
            <p className="navheading center" style={{color:"black", marginTop:10}}>Backed by Google Trends Finder and public search data</p>
            <p className="navheading center" style={{color:"black", marginTop:10}}>Last time update: {year}-{month}-{date}</p>

            <div className="desktop-only">
            <Grid column={4}>
              <Grid.Row>
                <Grid.Column width={3}/>
                <Grid.Column width={5}>
                      <Select
                        placeholder='Trendy category'
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={selectedOption2}
                        onChange={(selected)=>this.handleChange3(selected, 2)}
                        options={options2}/>
                </Grid.Column>
                <Grid.Column width={5}>
                      <Select
                          placeholder='Trendy style'
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={selectedOption3}
                          onChange={(selected)=>this.handleChange3(selected, 3)}
                          options={options3}
                          />
                </Grid.Column>
                <Grid.Column width={3}/>
              </Grid.Row>
            </Grid> 

            </div>

            <div className="mobile-only">
              <Grid column={3}>
                <Grid.Row>
                  <Grid.Column width={2}/>
                  <Grid.Column width={12}>
                        <Select
                          placeholder='Trendy category'
                          isMulti
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={selectedOption2}
                          onChange={(selected)=>this.handleChange3(selected, 2)}
                          options={options2}/>
                          <br/>
                      <Select
                            placeholder='Trendy style'
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedOption3}
                            onChange={(selected)=>this.handleChange3(selected, 3)}
                            options={options3}
                            />
                  </Grid.Column>
                  <Grid.Column width={2}/>
                </Grid.Row>
              </Grid>
            </div>

              <div className="center">
                <p className="navheading center" style={{color:"black", marginTop:10}}>Click 'Love the style!' for styles you like and find out how much they might cost to source!</p>
              </div>

              <div style={{width:'120%'}}>
                <Grid>
                {styles}
              </Grid>
             </div>
            </div>

          <div className="center desktop-only" style={{marginTop:0}}>
            <Grid columns={3}>
              <Grid.Column width={4}/>
              <Grid.Column width={8}>
                <p className="heading h3" style={{color:"black", marginTop:60}}>Do you want more <span className="highlight">personalized</span> style suggestions hand-picked by our stylists? They are tailored to your brand and customers.
                <br/><span className="highlight" style={{color:'#4b3cf0'}}>And for free!</span></p>
              </Grid.Column>
              <Grid.Column width={4}/>
            </Grid>

            <Grid columns={3} style={{backgroundColor:'#FCAE9E', marginTop:30, paddingBottom:20, paddingTop:20}}>
              <Grid.Column width={2}/>
              <Grid.Column width={12}>
                <Grid columns={4}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={3}>
                    <p className="heading" style={{color:'#4b3cf0', fontSize:70}}>40%</p>
                  </Grid.Column>
                  <Grid.Column width={9}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                          }}>
                    <p className="left-align h5" style={{color:"black", marginTop:0}}><a href="https://sites.duke.edu/tianchengchen/files/2020/12/jmp_tc.pdf" target="_blank" style={{color:'#4b3cf0', fontWeight:'900'}}><u>Latest Study</u></a> found that additional market intelligence data alongside online sellers' own storefront data helps them choose better products to sell, which leads to 40% growth in sales.</p>
                  </Grid.Column>
                  <Grid.Column width={2}/>
                </Grid>

                <Grid columns={4}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={3}>
                    <p className="heading" style={{color:'#4b3cf0', fontSize:70}}>1k+</p>
                  </Grid.Column>
                  <Grid.Column width={9}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                          }}>
                    <p className="left-align h5" style={{color:"black", marginTop:0}}>Fashion brands leverage our service when making sourcing decisions, effectively improving new product launch performance. <span style={{color:'#4b3cf0', fontWeight:'900'}}>95%</span> of users come back at least once. </p>
                  </Grid.Column>
                  <Grid.Column width={2}/>
                </Grid>
              </Grid.Column>
              <Grid.Column width={2}/>
            </Grid>

            <Grid columns={3} style={{marginTop:30, paddingBottom:20, paddingTop:20}}>
              <Grid.Column width={2}/>
              <Grid.Column width={12} >
                <Grid columns={6}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={3}>
                    <img src={process.env.PUBLIC_URL + '/test_logo1.png'} alt='payment' style={{width:'30%'}}/>
                    <p className="navheading" style={{fontWeight:'900'}}>@_ztstyle_</p>
                  </Grid.Column>
                  <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❝</span>
                  </Grid.Column>
                  <Grid.Column width={8} 
                    style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                    }}>
                    <p className="left-align h5" style={{color:"black"}}>In the past, I made my product sourcing decisions simply through internet browsing and personal preferences... I love working with whatspopulartoday! They really help elevate my new product sourcing game. They seem to understand what my customers want better than I do!</p>
                  </Grid.Column>
                  <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❞</span>
                  </Grid.Column>
                  <Grid.Column width={1}/>
                </Grid>

                <Grid columns={4}>
                  <Grid.Column width={2}/>
                  <Grid.Column width={3}>
                    <img src={process.env.PUBLIC_URL + '/test_logo2.png'} alt='payment' style={{width:'30%'}}/>
                    <p className="navheading" style={{fontWeight:'900'}}>@elariaboutique</p>
                  </Grid.Column>
                  <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❝</span>
                  </Grid.Column>
                  <Grid.Column width={8}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                  }}>
                    <p className="left-align h5" style={{color:"black", marginTop:30}}>I'd recommend whatspopulartoday to any independent boutique stores or brand owners! There's simply no better place to start your new product sourcing.</p>
                  </Grid.Column>
                  <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❞</span>
                  </Grid.Column>
                  <Grid.Column width={1}/>
                </Grid>
              </Grid.Column>
              <Grid.Column width={2}/>
            </Grid>
          </div>

          <div className="center mobile-only" style={{marginTop:0, marginBottom:-50}}>
            <Grid columns={3}>
              <Grid.Column width={1}/>
              <Grid.Column width={14}>
                <p className="heading h3" style={{color:"black", marginTop:60}}>Do you want more <span className="highlight">personalized</span> style suggestions hand-picked by our stylists? They are tailored to your brand and customers.
                <br/><span className="highlight" style={{color:'#4b3cf0'}}>And for free!</span></p>
              </Grid.Column>
              <Grid.Column width={1}/>
            </Grid>

            <Grid columns={3} style={{backgroundColor:'#FCAE9E', marginTop:30, paddingBottom:20, paddingTop:20}}>
              <Grid.Column width={1}/>
              <Grid.Column width={14}>
                <p className="heading" style={{color:'#4b3cf0', fontSize:70}}>40%</p>
                <p className="left-align h5" style={{color:"black", marginTop:-50}}><span style={{color:'#4b3cf0'}}>Latest Study</span> found that additional market intelligence data alongside online sellers' own storefront data helps them choose better products to sell, which leads to 40% growth in sales.</p>
                <p className="heading" style={{color:'#4b3cf0', fontSize:70}}>1k+</p>
                <p className="left-align h5" style={{color:"black", marginTop:-50}}>Fashion brands leverage our service when making sourcing decisions, effectively improving new product launch performance. 95% of users come back at least once. </p>
              </Grid.Column>
              <Grid.Column width={2}/>
            </Grid>

            <Grid columns={3} style={{marginTop:30, paddingBottom:20, paddingTop:20}}>
              <Grid.Column width={1}/>
              <Grid.Column width={14} >
                    <img src={process.env.PUBLIC_URL + '/test_logo1.png'} alt='payment' style={{width:'30%'}}/>
                    <p className="navheading" style={{fontWeight:'900'}}>@_ztstyle_</p>
                    <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❝</span>
                    </Grid.Column>
                    <Grid.Column width={8} 
                      style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                      }}>
                      <p className="left-align h5" style={{color:"black"}}>In the past, I made my product sourcing decisions simply through internet browsing and personal preferences... I love working with whatspopulartoday! They really help elevate my new product sourcing game. They seem to understand what my customers want better than I do!</p>
                    </Grid.Column>
                    <Grid.Column width={1}>
                      <span style={{fontSize:30}}>❞</span>
                    </Grid.Column>
                    
                    <img src={process.env.PUBLIC_URL + '/test_logo2.png'} alt='payment' style={{width:'30%'}}/>
                    <p className="navheading" style={{fontWeight:'900'}}>@elariaboutique</p>
                    <Grid.Column width={1}>
                    <span style={{fontSize:30}}>❝</span>
                    </Grid.Column>
                    <Grid.Column width={8} 
                      style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                      }}>
                      <p className="left-align h5" style={{color:"black"}}>I'd recommend whatspopulartoday to any independent boutique stores or brand owners! There's simply no better place to start your new product sourcing.</p>
                    </Grid.Column>
                    <Grid.Column width={1}>
                      <span style={{fontSize:30}}>❞</span>
                    </Grid.Column>
              </Grid.Column>
              <Grid.Column width={1}/>
            </Grid>
          </div>


            {/*
              <Grid columns={3} style={{marginTop:50}}>
                <Grid.Row>
                  <Grid.Column width={5}/>
                  <Grid.Column width={6}>
                      <div className="center-align">
                          <Segment>
                          <h3 className="navheading">Check <span className="highlight">where</span> and <span className="highlight">how much</span> you can source these trendy styles <br/> 
                          <span style={{color:'grey'}}>and</span> <br/>
                          get <span className="highlight">personalized</span> style recommendation!</h3>

                          </Segment>
                      </div>
                  </Grid.Column>
                  <Grid.Column width={5}/>
                  </Grid.Row>
            </Grid> 
            */}

        {/*
                  <div className="desktop-only">
                    <Grid column={3} >
                      <Grid.Column width={5}/>
                      <Grid.Column width={6}>
                        <div style={{marginTop: 50}} className="navheading center-align">
                          <h3>Do you want <span className="highlight">personalized</span> trendy style inspirations hand-picked by our stylists, <span className="highlight">tailored</span> to your brand and customers? All for <span className="highlight">free</span>!</h3> 
                        </div>
                      </Grid.Column>
                      <Grid.Column width={5}/>
                    </Grid>
                  </div>
                  <div className="mobile-only">
                    <Grid column={3} >
                      <Grid.Column width={1}/>
                      <Grid.Column width={14}>
                        <div style={{marginTop: 50}} className="navheading center-align">
                          <h3>Do you want <span className="highlight">personalized</span> trendy style inspirations hand-picked by our stylists, <span className="highlight">tailored</span> to your brand and customers? All for <span className="highlight">free</span>!</h3> 
                        </div>
                      </Grid.Column>
                      <Grid.Column width={1}/>
                    </Grid>
                  </div>
          */}

                  <div className="center" style={{marginTop:10, marginBottom:20}}>
                          {
                              error?
                              error:
                              null
                          }
                          <br/>

                          {
                            this.state.checkedList.includes(true)?
                            <a href="https://i5ljx6kp4i5.typeform.com/to/KReXYXep">
                            <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#4b3cf0',
                                  color:'white',
                                  height: '80px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  width:'250px',
                                  marginRight:'15px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmitYes}
                            >
                              <p><span className="h5 navheading" style={{fontWeight:'900'}}>YES</span><br/>Answer 4 questions in 2 mins</p>
                            </button>
                            </a>:
                            <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#4b3cf0',
                                  color:'white',
                                  height: '80px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  width:'250px',
                                  marginLeft:'15px',
                                  marginRight:'15px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmit}
                            >
                              <p><span className="h5 navheading" style={{fontWeight:'900'}}>YES</span><br/>Answer 4 questions in 2 mins</p>
                            </button>    
                              }

                              <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#989898',
                                  color:'white',
                                  height: '80px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  marginLeft:'15px',
                                  marginRight:'15px',
                                  width:'250px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmit}
                            >
                              <p><span className="h5 navheading" style={{fontWeight:'900'}}>NO</span><br/>Find out how much these might cost to source</p>
                            </button>
                      </div>
                      <div className="center desktop-only" style={{marginTop:60}}>
                        <Grid Columns={3}>
                          <Grid.Column width={4}/>
                          <Grid.Column width={8}>
                            <p className="navheading" style={{color:'black'}}>We protect your data! You decide what you want to share with us and we won't disclose your store information to any third parties. You can read more about our privacy policy or contact ziqi@vicgarments.com if you have any questions </p>
                          </Grid.Column>
                          <Grid.Column width={4}/>
                        </Grid>
                      </div>

                      <div className="center mobile-only" style={{marginTop:60}}>
                        <Grid Columns={3}>
                          <Grid.Column width={2}/>
                          <Grid.Column width={12}>
                            <p className="navheading" style={{color:'black'}}>We protect your data! You decide what you want to share with us and we won't disclose your store information to any third parties. You can read more about our privacy policy or contact ziqi@vicgarments.com if you have any questions </p>
                          </Grid.Column>
                          <Grid.Column width={2}/>
                        </Grid>
                      </div>

              <div style={{height:200}}>
              </div>
        </div>
        
        </>
    )

  }
}

export default Term;




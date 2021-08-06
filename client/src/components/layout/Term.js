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
            gender: 'women',
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
        { value: 'tops', label: '#Tops' },
        { value: 'dress', label: '#Dress' },
        { value: 'two-piece set', label: '#Two-piece Set' },
        { value: 'jumpsuits/rompers/bodysuit', label: '#Jumpsuits/rompers/bodysuit' },
        { value: 'blazer', label: '#Blazer' },
        { value: 'bottoms', label: '#Bottoms' },
        { value: 'sweaters', label: '#Sweaters' },
        { value: 'outerwear', label: '#Outerwear' },
        { value: 'costumes/accessories', label: '#Costumes/accessories' },
        { value: 'loungewear', label: '#Loungewear' },
        { value: 'activewear', label: '#Activewear' },
        { value: 'partywear', label: '#Partywear' },
        { value: 'beachwear', label: '#Beachwear' },
      ];
  
      const options3 = [
        { value: 'sexy', label: '#Sexy' },
        { value: 'cutout', label: '#Cutout' },
        { value: 'basics', label: '#Basics' },
        { value: 'cute', label: '#Cute' },
        { value: 'floral', label: '#Floral' },
        { value: 'chic', label: '#Chic' },
        { value: 'comfy', label: '#Comfy' },
        { value: 'edgy', label: '#Edgy' },
        { value: 'family look', label: '#Family look' },
        { value: 'seamless', label: '#Seamless' },
        { value: 'bright color', label: '#Bright color' },
        { value: 'cotton linen', label: '#Cotton linen' },
        { value: 'tie dye', label: '#Tie dye' },
        { value: 'prints', label: '#Prints' },
        { value: 'gen z', label: '#Gen Z' },
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
            <h4 className='heading center h3'> &nbsp; <span className="highlight">Trendy Styles</span></h4>
            <p className="navheading center" style={{color:"black", marginTop:10}}>Backed by Google Trends Finder and public search data</p>
            <p className="navheading center" style={{color:"black", marginTop:10}}>Last time update: {year}-{month}-{date}</p>

            <div className="desktop-only">
              {/*
              <Grid column={3}>
                <Grid.Column width={5}/>
                <Grid.Column width={6}>
                  <Segment className="center-align">
                    <h3>Get Personalized Recommendation For Free</h3>
                    <p className="navheading">We could better recommend styles to your store based on <span className="highlight">public trendy style data</span> and <span className="highlight">your store's unique traits</span> in 24 hours <span className="highlight">for free</span>!</p>
                    <a href="https://i5ljx6kp4i5.typeform.com/to/KReXYXep" target="_blank">
                      <button
                          style={{
                          borderRadius: "5px",
                          letterSpacing: "1.5px",
                          //marginTop: "1rem",
                          fontWeight:'bold',
                          backgroundColor:'#0c4a34',
                          color:'white',
                          height: '40px',
                          paddingLeft:'16px',
                          paddingRight:'16px',
                          }}
                          className="btn waves-effect waves-light hoverable accent-3"
                      >
                      <p>Go</p>
                      </button>
                    </a>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={5}/>
              </Grid> */}
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

                  <div className="desktop-only">
                    <Grid column={3} >
                      <Grid.Column width={5}/>
                      <Grid.Column width={6}>
                        <div style={{marginTop: 50}} className="navheading center-align">
                          <h3>Do you want more personalized trendy styles hand-picked by our stylists, <span className="highlight">tailored</span> to your brand and customers? All for <span className="highlight">free</span>!</h3> 
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
                          <h3>Do you want more personalized trendy styles hand-picked by our stylists, <span className="highlight">tailored</span> to your brand and customers? All for <span className="highlight">free</span>!</h3> 
                        </div>
                      </Grid.Column>
                      <Grid.Column width={1}/>
                    </Grid>
                  </div>

                  <div className="center" style={{marginTop:10, marginBottom:20}}>
                          {
                              error?
                              error:
                              null
                          }
                          <br/>

                          {
                            this.state.checkedList.includes(true)?
                            <a href="https://i5ljx6kp4i5.typeform.com/to/KReXYXep" target="_blank">
                            <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "0rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#0c4a34',
                                  color:'white',
                                  height: '50px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  width:'80px',
                                  marginRight:'15px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                //onClick={this.handleSubmit}
                            >
                              <p>YES</p>
                            </button>
                            </a>:
                            <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "0rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#0c4a34',
                                  color:'white',
                                  height: '50px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  width:'80px',
                                  marginRight:'15px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmit}
                            >
                              <p>YES</p>
                            </button>    
                              }

                              <button
                                style={{
                                  borderRadius: "5px",
                                  letterSpacing: "1.5px",
                                  marginTop: "0rem",
                                  fontWeight:'bold',
                                  backgroundColor:'#989898',
                                  color:'white',
                                  height: '50px',
                                  paddingLeft:'16px',
                                  paddingRight:'16px',
                                  marginLeft:'15px',
                                  width:'80px'
                                }}
                                className="btn waves-effect waves-light hoverable accent-3"
                                onClick={this.handleSubmit}
                            >
                              <p>NO</p>
                            </button>
                      </div>
              <div style={{height:200}}>
              </div>
        </div>
        </div>
        </>
    )

  }
}

export default Term;




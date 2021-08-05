import React, { Component } from "react";
import { } from 'react-bootstrap';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, updateUser } from "../../actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";
import SigninContext from '../context/SigninContext';
import LanguageSwitcher from '../layout/LanguageSwitcher';
import { faCheckCircle, faRibbon, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Icon, Step, Divider, Grid, Segment, Header, Button, Accordion, Checkbox, Card, List, Table } from 'semantic-ui-react';
import axios from "axios";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {HorizontalBar, Line, Doughnut, Bar} from 'react-chartjs-2';
import AS from '../../data/actionableStrategies.json';
import Dashboard_sidebar from '../dashboard/Dashboard_sidebar_example';
import Dashboard_sidebar_mobile from '../dashboard/Dashboard_sidebar_mobile_example';


const width = window.innerWidth
const height = window.innerHeight

var page_length = 0
var image_number = 0
var text_count = 0
var font_number = 0
var text_count_front = 0

var category

var section_number = 0
var first_screen_aesthetic_score = 0
var count = 0 
var barChartData1, barChartData2, barChartData3, barChartData4, barChartData5, barChartData6, barChartData7, barChartData8, barChartData9, barChartData10
var barChartData11, barChartData12, barChartData13,barChartData14,barChartData15,barChartData16,barChartData17, barChartData18, doughnutChartData, doughnutChartData2


  
const doughnutChartOptions = {
  maintainAspectRatio: true,
  cutoutPercentage:70,
  tooltips:{
    enabled:true,
  },
  legend: {
            display: true,
          },
  pieceLabel: {
    render: 'value' + '%',
    fontColor: "white",
  }
  };

  
const barChartOptions = {
  legend: {
            display: false,
          },
  scales: {
            xAxes: [{
              ticks: {
                min: 0,
                max: 10,
                callback: function(value) {
                    return value
                }
              },
              scaleLabel: {
                display: true,
                labelString: "Page length"
              }
            },],
            yAxes: [{
              barPercentage: 0.3,
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
            },],
          },
  };

  const barChartOptions3 = {
    legend: {
              display: false,
            },
    scales: {
              xAxes: [{
                ticks: {
                  min: 0,
                  max: 10,
                  callback: function(value) {
                      return value
                  }
                },
                scaleLabel: {
                  display: true,
                  labelString: "Number of images used in the homepage"
                }
              },],
              yAxes: [{
                barPercentage: 0.3,
                gridLines: {
                  color: "rgba(0, 0, 0, 0)",
              }
              },],
            },
    };

    const barChartOptions5 = {
      legend: {
                display: false,
              },
      scales: {
                xAxes: [{
                  ticks: {
                    min: 0,
                    max: 10,
                    callback: function(value) {
                        return value
                    }
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Image aesthetic score"
                  }
                },],
                yAxes: [{
                  barPercentage: 0.3,
                  gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
                },],
              },
      };

      const barChartOptions7 = {
        legend: {
                  display: false,
                },
        scales: {
                  xAxes: [{
                    ticks: {
                      min: 0,
                      max: 10,
                      callback: function(value) {
                          return value
                      }
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Image technical score"
                    }
                  },],
                  yAxes: [{
                    barPercentage: 0.3,
                    gridLines: {
                      color: "rgba(0, 0, 0, 0)",
                  }
                  },],
                },
        };

        const barChartOptions9 = {
          legend: {
                    display: false,
                  },
          scales: {
                    xAxes: [{
                      ticks: {
                        min: 0,
                        max: 10,
                        callback: function(value) {
                            return value
                        }
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "% of images that contain store products"
                      }
                    },],
                    yAxes: [{
                      barPercentage: 0.3,
                      gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                    },],
                  },
          };

          const barChartOptions10 = {
            legend: {
                      display: false,
                    },
            scales: {
                      xAxes: [{
                        ticks: {
                          min: 0,
                          max: 10,
                          callback: function(value) {
                              return value
                          }
                        },
                        scaleLabel: {
                          display: true,
                          labelString: "text count in the homepage"
                        }
                      },],
                      yAxes: [{
                        barPercentage: 0.3,
                        gridLines: {
                          color: "rgba(0, 0, 0, 0)",
                      }
                      },],
                    },
            };

            const barChartOptions12 = {
              legend: {
                        display: false,
                      },
              scales: {
                        xAxes: [{
                          ticks: {
                            min: 0,
                            max: 10,
                            callback: function(value) {
                                return value
                            }
                          },
                          scaleLabel: {
                            display: true,
                            labelString: "number of fonts used in the store"
                          }
                        },],
                        yAxes: [{
                          barPercentage: 0.3,
                          gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                        }
                        },],
                      },
              };

        const barChartOptions13 = {
          legend: {
                    display: false,
                  },
          scales: {
                    xAxes: [{
                      ticks: {
                        min: 0,
                        max: 10,
                        callback: function(value) {
                            return value
                        }
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "text count on the first screen page"
                      }
                    },],
                    yAxes: [{
                      barPercentage: 0.3,
                      gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                    }
                    },],
                  },
          };

          const barChartOptions14 = {
            legend: {
                      display: false,
                    },
            scales: {
                      xAxes: [{
                        ticks: {
                          min: 0,
                          max: 10,
                          callback: function(value) {
                              return value
                          }
                        },
                        scaleLabel: {
                          display: true,
                          labelString: "First screen page aesthetic quality"
                        }
                      },],
                      yAxes: [{
                        barPercentage: 0.3,
                        gridLines: {
                          color: "rgba(0, 0, 0, 0)",
                      }
                      },],
                    },
            };

class AS_example extends Component {
  static contextType = SigninContext;

  constructor(props) {
    console.log('props: ', props)
    super();
    this.state = {
        unlock_button: false,
        user: null,
        congrats: false,
        cancel: false,
        activeIndex: -1,
        activeIndex1: -1,
        activeIndex2: -1,
        activeIndex3: -1,
        activeIndex4: -1,
        activeIndex5: -1,
        imageObjectsDone: false,
        textKeywordsDone: false,
        overviewSectionDone:false,
        frontTextKeywordsDone:false,
        frontImageObjectsDone: false,
        images:[],
        image_object_urls:[],
        image_effective_ratio: 0,
        text_effective_ratio: 0,
        text_effective_ratio_front: 0,
        first_page_aesthetic_store: 0,
        first_page_url: '',
        first_page_effective: false,
        problem_list:[],
        loading: true,
        color_list: [],
        color_category_list: [],
        theme_color: false,
        no_effect_all_store_list: [],
        no_effect_front_list: [],
        error: false
    };
  }


  componentDidMount() {
    
    {/* 更新用户数据 */}
    axios
    .post("/api/users/refreshData", {id: '5fd6bea267f0c82e3b7f962c'})
    .then(res => {
        this.setState({user: res.data})
        category = res.data.category
        if (!res.data.doneLabel){
          this.props.history.push("/dashboard_label_image");
        } else {
              {/* 读取用户网店 text, font, image数量信息 */}
              axios
              .post("/api/scrape/fetch_store_number", {store_url: this.state.user.store})
              .then(res => {
                  //console.log('res.data 数量: ', res.data)
                  page_length = Math.floor(res.data.page_length/2)
                  image_number = res.data.image_number
                  text_count = res.data.text_count
                  font_number = res.data.font_number
                  text_count_front = res.data.text_count_front

                  {/* 读取有objects的所有图片链接 */}
                  axios
                  .post("/api/scrape/fetch_objects_urls", {store_url: this.state.user.store})
                  .then(res => {
                      const effect_list = this.state.user.labelResults.image_id.split(",")
                      if (effect_list.includes('1')){
                        this.setState({first_page_effective: true})
                      }
                      this.setState({image_effective_ratio: effect_list.length/res.data.length})
                      this.setState({image_object_urls: res.data})

                      {/* 读取text keywords */} 
                      axios
                      .post("/api/scrape/fetch_keywords", {store_url: this.state.user.store})
                      .then(res => {
                          const not_effect_words_list = this.state.user.labelResults.keyword.keywords_3.split(",")
                          this.setState({text_effective_ratio: 1 - not_effect_words_list.length/res.data[0].length})

                          {/* 过滤出no effect words - all store 和 front 分开 */}
                          var no_effect_all_store_list = []
                          var no_effect_front_list = []
                          for (var i=0; i<not_effect_words_list.length;i++){
                            if (res.data[0].includes(not_effect_words_list[i]))  no_effect_all_store_list.push(not_effect_words_list[i])
                            if (res.data[1].includes(not_effect_words_list[i]))  no_effect_front_list.push(not_effect_words_list[i])
                          }
                          this.setState({no_effect_all_store_list: no_effect_all_store_list, no_effect_front_list: no_effect_front_list})


                          var not_effect_words_list_front = []
                          for (var i=0; i<not_effect_words_list.length; i++){
                            if (res.data[1].includes(not_effect_words_list[i])){
                              not_effect_words_list_front.push(not_effect_words_list[i])
                            }
                          }
                          this.setState({text_effective_ratio_front: 1 - not_effect_words_list_front.length/res.data[1].length})

                          {/* 读取 front page 颜色 */}
                          axios
                          .post("/api/scrape/fetch_colors", {store_url: this.state.user.store})
                          .then(res => {
                              const filteredArray = res.data[0].filter(value => AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_color_category`].includes(value));
                              if (filteredArray.length===AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_color_category`].length) this.setState({theme_color: true})
                              this.setState({color_category_list: res.data[0], color_list: res.data[1]})

                              {/* 罗列问题 list */}
                              if (page_length<AS[category].Page_length.Min || page_length>AS[category].Page_length.Max) this.setState({problem_list: [...this.state.problem_list, 'Page length']})
                              if (section_number < AS.All_graphs.Home_section.Min) this.setState({problem_list: [...this.state.problem_list, 'homepage section']})
                              if (image_number<AS[category].Image_number.Min || image_number>AS[category].Image_number.Max) this.setState({problem_list: [...this.state.problem_list, 'Total number of images']})
                              if (count > 0) this.setState({problem_list: [...this.state.problem_list, 'Store picture quality']})
                              if (this.state.image_effective_ratio < AS[category].Image_effectiveness.Min) this.setState({problem_list: [...this.state.problem_list, 'Store picture effectiveness']})
                              if (filteredArray.length<AS[category].Theme_color.Min) this.setState({problem_list: [...this.state.problem_list, 'Theme colors']})
                              if (text_count<AS[category].Text_count.Min || text_count>AS[category].Text_count.Max) this.setState({problem_list: [...this.state.problem_list, 'Text count']})
                              if (this.state.text_effective_ratio < AS.All_graphs.Text_effectiveness.Min) this.setState({problem_list: [...this.state.problem_list, 'Text effectiveness']})
                              if (font_number<AS[category].Font_count.Min || font_number>AS[category].Font_count.Max) this.setState({problem_list: [...this.state.problem_list, 'Font count']})
                              if (first_screen_aesthetic_score < AS[category].Image_effectiveness_first.Min) this.setState({problem_list: [...this.state.problem_list, 'First screen page aesthetic quality']})
                              if (!this.state.first_page_effective) this.setState({problem_list: [...this.state.problem_list, 'Image effectiveness on the first screen page']})
                              if (text_count_front<AS[category].Text_count_first.Min || text_count_front>AS[category].Text_count_first.Max) this.setState({problem_list: [...this.state.problem_list, 'Text count on the first screen']})
                              if (this.state.text_effective_ratio_front<AS.All_graphs.Text_effectiveness_first.Min) this.setState({problem_list: [...this.state.problem_list, 'Text effectiveness on the first screen']})
                              
                              this.setState({loading: false})
                          })
                          .catch(err => {
                            console.log('err: ', err)
                            this.setState({error: true})
                          }
                          );
                      })
                      .catch(err =>
                        {
                          console.log('err: ', err)
                          this.setState({error: true})
                        }
                      ); 
                  })
                  .catch(err =>
                    {
                      console.log('err: ', err)
                      this.setState({error: true})
                    }
                  );
              })
              .catch(err =>
                {
                  console.log('err: ', err)
                  this.setState({error: true})
                }
              );
              {/* 读取images的所有图片链接 */}
              axios
              .post("/api/scrape/fetch_images_urls", {store_url: this.state.user.store})
              .then(res => {
                  this.setState({images: res.data})
              })
              .catch(err =>
                {
                  console.log('err: ', err)
                  this.setState({error: true})
                }
            );
        }
    })
    .catch(err =>
      {
        console.log('err: ', err)
        this.setState({error: true})
      }
    );
  }


  onLogoutClick = e => {
    e.preventDefault();
    localStorage.setItem('signedIn', false)
    this.props.history.push({
      pathname: "/results",
    })
    this.props.logoutUser();
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeIndex: newIndex })
  }


  handleClick1 = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex1 } = this.state
    const newIndex = activeIndex1 === index ? -1 : index
    this.setState({ activeIndex1: newIndex })
  }

  handleClick2 = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex2 } = this.state
    const newIndex = activeIndex2 === index ? -1 : index
    this.setState({ activeIndex2: newIndex })
  }

  handleClick3 = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex3 } = this.state
    const newIndex = activeIndex3 === index ? -1 : index
    this.setState({ activeIndex3: newIndex })
  }

  handleClick4 = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex4 } = this.state
    const newIndex = activeIndex4 === index ? -1 : index
    this.setState({ activeIndex4: newIndex })
  }

  handleClick5 = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex5 } = this.state
    const newIndex = activeIndex5 === index ? -1 : index
    this.setState({ activeIndex5: newIndex })
  }
  
  

  render() {
    
    //console.log('this.state.image_object_urls: ', this.state.image_object_urls)
    //console.log('this.state.user: ', this.state.user)

    function renderTooltip1(props) {
      return (
          <Tooltip id="button-tooltip" {...props}
          style={{
          backgroundColor: '#80e98f',
          padding: '3px 3px 3px 3px',
          color: '#1b1b1c',
          borderRadius: 5,
          ...props.style,
          }}
          >
              <Card style={{width:300, padding:10}}>
              <p style={{fontWeight:'bold'}}>Page number</p>
              <p className = "text_footnote" >
              The page number is how many pages long the homepage is. The number varies when shoppers use different screen size devices, but we measured 
              the length across all e-commerce stores on the same scale. That being said, the homepage that is 4-page long is double the length of a 2-page homepage.
              </p>
          </Card>
          </Tooltip>
      );
  }

    if (category) {
        barChartData1 = {
           labels: AS[category].Page_length.Labels,
           datasets: [
             {
               backgroundColor: AS[category].Page_length.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Page_length.Data
             }
           ],
         };
         
        barChartData2 = {
           labels:AS.All_graphs.Page_length.Labels,
           datasets: [
             {
               backgroundColor: AS.All_graphs.Page_length.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Page_length.Data,
             }
           ],
         };
         
         
        barChartData3 = {
           labels: AS.All_graphs.Image_number.Labels,
           datasets: [
             {
               backgroundColor: AS.All_graphs.Image_number.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_number.Data
             }
           ],
         };
         
         
        barChartData4 = {
           labels: AS[category].Image_number.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Image_number.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_number.Data
             }
           ],
         };
         
        barChartData5 = {
           labels: AS.All_graphs.Image_aesthetic.Labels,
           datasets: [
             {
               backgroundColor:AS.All_graphs.Image_aesthetic.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_aesthetic.Data,
             }
           ],
         };
         
        barChartData6 = {
           labels: AS[category].Image_aesthetic.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Image_aesthetic.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_aesthetic.Data
             }
           ],
         };
         
        barChartData7 = {
           labels: AS.All_graphs.Image_technical.Labels,
           datasets: [
             {
               backgroundColor:AS.All_graphs.Image_technical.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_technical.Data
             }
           ],
         };
         
        barChartData8 = {
           labels: AS[category].Image_technical.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Image_technical.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_technical.Data
             }
           ],
         };
         
        barChartData9 = {
           labels: AS.All_graphs.Image_effectiveness.Labels,
           datasets: [
             {
               backgroundColor: AS.All_graphs.Image_effectiveness.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_effectiveness.Data
             }
           ],
         };
         
        barChartData18 = {
           labels: AS[category].Image_effectiveness.Labels,
           datasets: [
             {
               backgroundColor: AS[category].Image_effectiveness.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_effectiveness.Data
             }
           ],
         };
         
        barChartData10 = {
           labels: AS.All_graphs.Text_count.Labels,
           datasets: [
             {
               backgroundColor:AS.All_graphs.Text_count.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Text_count.Data
             }
           ],
         };
         
         barChartData11 = {
           labels: AS[category].Text_count.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Text_count.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Text_count.Data
             }
           ],
         };
         
         
         barChartData12 = {
           labels: AS.All_graphs.Font_count.Labels,
           datasets: [
             {
               backgroundColor:AS.All_graphs.Font_count.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Font_count.Data
             }
           ],
         };
         
         
         barChartData17 = {
           labels: AS[category].Font_count.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Font_count.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Font_count.Data
             }
           ],
         };
         
         
         barChartData13 = {
           labels: AS.All_graphs.Text_count_first.Labels,
           datasets: [
             {
               backgroundColor:AS.All_graphs.Text_count_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Text_count_first.Data
             }
           ],
         };
         
         barChartData14 = {
           labels: AS[category].Text_count_first.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Text_count_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Text_count_first.Data
             }
           ],
         };
         
         barChartData15 = {
           labels: AS.All_graphs.Image_aesthetic_first.Labels, 
           datasets: [
             {
               backgroundColor:AS.All_graphs.Image_aesthetic_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_aesthetic_first.Data
             }
           ],
         };
         
         barChartData16 = {
           labels: AS[category].Image_aesthetic_first.Labels,
           datasets: [
             {
               backgroundColor:AS[category].Image_aesthetic_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_aesthetic_first.Data
             }
           ],
         };
       
         doughnutChartData = {
           labels: AS.All_graphs.Image_effectiveness_first.Labels,
           datasets: [
             {
               backgroundColor: AS.All_graphs.Image_effectiveness_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS.All_graphs.Image_effectiveness_first.Data,
             }
           ],
         };
         
         doughnutChartData2 = {
           labels: AS[category].Image_effectiveness_first.Labels,
           datasets: [
             {
               backgroundColor: AS[category].Image_effectiveness_first.Background_color,
               borderColor: 'rgba(0, 0, 0, 0)',
               borderWidth: 2,
               data: AS[category].Image_effectiveness_first.Data,
         
             }
           ],
         };
       
       
       }

    console.log('barChartData1: ', barChartData1)




    var no_object_list 
    var first_object_url = ''
    

    if (this.state.image_object_urls.length>0){
      no_object_list = this.state.image_object_urls.map((image)=>{
        if (image){
          if (!this.state.user.labelResults.image_id.includes(image.image_id) && image.image_id !== '1'){
            return <img src={image.url} width='50%' style={{paddingBottom:'10px'}} alt='no_objects_image'/>
          } else if (image.image_id === '1'){
            first_object_url = image.url
          }
        }
      })
    }

    if (!this.state.user){
      return null
    } else {
      category = this.state.user.category
    }

    var not_aesthetic_list
    var not_technical_list
    var first_screen_url = ''
    if (this.state.images.length>0){
        not_aesthetic_list = this.state.images.map((image) =>{
        if (image){
          if (image.image_id !== '1'){
            //console.log('image.image_id: ', image.image_id)
            //console.log('image.aesthetic_score: ', image.aesthetic_score)
            if (image.aesthetic_score<AS[category].Image_aesthetic.Min){
              //console.log(image.image_id)
              count += 1
              return <img src={image.url} width='50%' style={{paddingBottom:'10px'}} alt='unqualified_image'/>
            }
          } else {
            first_screen_aesthetic_score = image.aesthetic_score
            first_screen_url = image.url
          }
        }
      });
        
      not_technical_list = this.state.images.map((image) =>{
          if (image){
            //console.log('image.image_id: ', image.image_id)
            //console.log('image.technical_score: ', image.technical_score)
            if (image.technical_score<AS[category].Image_technical.Min && image.image_id !== '1'){
              //console.log(image.image_id)
              count += 1
              return <img src={image.url} width='50%' style={{paddingBottom:'10px'}} alt='unqualified_image'/>
            }
          }
        });
    }

    var summary_list = this.state.problem_list.map((problem)=>{
      return (
        <List.Item style={{padding:10}}>
          <List.Content style={{fontWeight:'bold'}}>
          <Icon name='attention' style={{color:'#FF4c4c'}}/> {problem}
          </List.Content>
      </List.Item>
      )
    })

    var used_sections, no_sections
    if (this.state.user){
        used_sections = this.state.user.labelResults.section.split(",")
        no_sections = ['1','2','3','4','5','6'].filter((number)=>{return !used_sections.includes(number)})
    }
    //console.log('this.state.user: ', this.state.user.labelResults.section.split(","))
    
    var used_sections_list 
    var no_section_list
    if (used_sections.length>0){
      if (!used_sections.includes('7')){
        used_sections_list = used_sections.map((section)=>{
          return <p>{AS.All_graphs.Home_section.Map[section]}</p>
        })
        no_section_list = no_sections.map((section)=>{
          //return <p>{AS.All_graphs.Home_section.Map[section]}</p>
          return <List.Item>
            <List.Content>
              <List.Header>{AS.All_graphs.Home_section.Map[section]}</List.Header>
            </List.Content>
          </List.Item>
        })
      }
      else if (used_sections.includes('7')){
        no_section_list = ['1','2','3','4','5','6'].map((section)=>{
          //return <p>hi {AS.All_graphs.Home_section.Map[section]}</p>
          return <List.Item>
            <List.Content>
              <List.Header>{AS.All_graphs.Home_section.Map[section]}</List.Header>
            </List.Content>
          </List.Item>
        })
      }
    }
    section_number = used_sections.length



    var text_no_effect_all_list
    if (this.state.no_effect_all_store_list.length>0){
      text_no_effect_all_list = this.state.no_effect_all_store_list.map((keyword) => {
        return (
          <>
            <span 
              style={{
                display: "inline-block", 
                borderRadius: "5px",
                backgroundColor: '#f4e7be',
                paddingLeft:'15px',
                paddingRight:'15px',
                paddingTop: '5px',
                paddingBottom: '5px',
                fontSize:'15px',
                fontFamily:'monospace',
                marginTop:'5px',
                marginRight:'10px'
            }}>
                {keyword}
            </span>
          </>
        )
      });
    }

    var text_no_effect_front_list
    if (this.state.no_effect_front_list.length>0){
      text_no_effect_front_list = this.state.no_effect_front_list.map((keyword) => {
        return (
          <>
            <span 
              style={{
                display: "inline-block", 
                borderRadius: "5px",
                backgroundColor: '#f4e7be',
                paddingLeft:'15px',
                paddingRight:'15px',
                paddingTop: '5px',
                paddingBottom: '5px',
                fontSize:'15px',
                fontFamily:'monospace',
                marginTop:'5px',
                marginRight:'10px'
            }}>
                {keyword}
            </span>
          </>
        )
      });
    }

    var color_list
    if (this.state.color_list.length>0){
      color_list = this.state.color_list.map((color) => {
        return (
          <>
            <span style={{
                display: "inline-block",  
                backgroundColor:color.color,
                borderRadius:"10px",
                marginLeft: "15px",
                borderColor:'red',
                width:55,
                height:55
                }} className="color_block">
                <div style={{textAlign:"center", color:"#404040", marginTop: 59}}>
                    {color.color}
                </div>
            </span>
          </>
        )
      });
    }
 
    var color_list_rec = AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_color_code`].map((color) => {
      return (
        <>
          <span style={{
              display: "inline-block",  
              backgroundColor:color,
              borderRadius:"10px",
              marginLeft: "15px",
              borderColor:'red',
              width:55,
              height:55
              }} className="color_block">
              <div style={{textAlign:"center", color:"#404040", marginTop: 59}}>
                  {color}
              </div>
          </span>
        </>
      )
    });

    var color_style
    if (this.state.user.labelResults.style){
      color_style = AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_name`].split(",").map((word) => {
        return (
          <>
            <span 
              style={{
                display: "inline-block", 
                borderRadius: "5px",
                backgroundColor: '#f4e7be',
                paddingLeft:'15px',
                paddingRight:'15px',
                paddingTop: '5px',
                paddingBottom: '5px',
                fontSize:'15px',
                fontFamily:'monospace',
                marginTop:'5px',
                marginRight:'10px',
                color:'black'
            }}>
                {word}
            </span>
          </>
        )
      });      
    }        
    
    

    var color_category_list
    if (this.state.color_category_list.length>0){
      color_category_list = this.state.color_category_list.map((category) => {
        return (
          <>
            <span 
              style={{
                display: "inline-block", 
                borderRadius: "5px",
                backgroundColor: '#f4e7be',
                paddingLeft:'15px',
                paddingRight:'15px',
                paddingTop: '5px',
                paddingBottom: '5px',
                fontSize:'15px',
                fontFamily:'monospace',
                marginTop:'5px',
                marginRight:'10px'
            }}>
                {category}
            </span>
          </>
        )
      });
    }

    var color_category_list_rec = AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_color_category`].map((category) => {
      return (
        <>
          <span 
            style={{
              display: "inline-block", 
              borderRadius: "5px",
              backgroundColor: '#f4e7be',
              paddingLeft:'15px',
              paddingRight:'15px',
              paddingTop: '5px',
              paddingBottom: '5px',
              fontSize:'15px',
              fontFamily:'monospace',
              marginTop:'5px',
              marginRight:'10px'
          }}>
              {category}
          </span>
        </>
      )
    });
    
    
    if (this.state.loading){
      return <img src={process.env.PUBLIC_URL + '/loader.gif'} height="500px" className="loader" alt='loader'/>
    }

    if (this.state.error){
      return (
        <div className ="container row">
          <div className="col s3">
          </div>
          <div className="col s6" style={{paddingTop: 3, paddingBottom: 3, paddingLeft:3, paddingRight: 3, marginTop: 0.3*height}}>
          <Segment>
            <div style={{textAlign:'center'}} >
                <h3 className='heading'>Something went wrong</h3>
                <br/>
                <p>If you have already paid but are not able to load the actionable strategy page, send us an email at <span style={{fontWeight:"1000"}}>hello@haloy.co</span>.
                  We will get back to you with a solution within <span style={{fontWeight:"1000"}}>24 hours</span>.</p>
              </div>
              <div className="center">
              <br/>
              <br/>
              <Button 
                  variant="outline-light" 
                  size="sm" 
                  style={{ color:'#1b1b1b', fontWeight:'bold'}}
                  onClick={()=> {
                      this.props.history.push({
                        pathname: "/dashboard2"
                      })
                  }}
                  >RETURN
              </Button>
            </div>
          </Segment>
          </div>
      </div>   
      )
    }

   
    return (      
      <>
      <div className="row" style={{backgroundColor:'#f0f7f2', height:window.innerHeight*1}}>
        <div className="desktop-only">
          <div className="col s2">
            <Dashboard_sidebar active={2} user={this.state.user}/>
          </div>

          <div className="col s10" style={{backgroundColor:'#f0f7f2'}}>
            <div style={{paddingRight:50, paddingLeft:50}}>
                <div placeholder style={{backgroundColor:'#f0f7f2'}}>
                  <div style={{textAlign:"left", marginLeft: 20, marginTop: 50}}>
                    <span className="row" >
                    <div className="col s6" style={{marginLeft:-10}}>
                      <h2 className='heading'>Example Actionable Strategies</h2>
                      <h5>for {this.state.user.store} &nbsp;&nbsp;&nbsp;<span style={{color:"#696969", fontWeight:'normal'}}>(all data below are for example - not real analysis)</span></h5>
                      
                      </div>
                    </span>
                    </div>

                    {this.state.user.paid
                            ?null
                            :<div style={{marginLeft:20}}>
                              <Button
                              style={{marginRight: 20, backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold", marginBottom:30}}
                              variant="outline-light" 
                              size="sm" 
                              onClick={()=>{
                                axios.post("/api/leads/update", {
                                  url: this.state.user.store,
                                  item: 'go_premium_button',
                                  value: '6'
                                })
                                this.props.history.push({
                                  pathname: "/account",
                                  state: true
                                })
                              }}
                              >
                              GO PREMIUM
                              </Button>
                            </div>
                          }


                  <Grid columns={2} stackable>
                    <Grid.Row verticalAlign='top'>
                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:30, marginRight:20, width:'90%'}}>
                      <img src={process.env.PUBLIC_URL + '/strategy_list.png'} className='image_icon_steps' alt='layout'/>
                      <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Summary</span>
                      <p style={{fontWeight:'', marginLeft:10, marginTop:10, color:'#696969'}}>
                        In traditional retail, visual merchandising build communication with customers through the elements that impact their senses. That’s why it is a common practice to spray the smell of freshly-baked bread near the bakery shelves in a supermarket or highlight new cookie packages brighter.  You must also notice that bakery, fresh fruits and vegetables are mostly placed at the point of entry to set a pleasant atmosphere with the help of colours and smells.
                      <br/><br/>
                        Much like visual merchandising’s many benefits for traditional physical stores, it’s even more critical for use in e-commerce stores since the visual is the only medium between you and your customers. The homepage is your showcase, the category and product pages are the shelves. <b>Winning the battle of visual merchandising will directly lead to increased key online metrics such as engagement, time on site, conversion rate, and average order value (AOV) and we are here to help you get there.</b>
                        <br/><br/>
                        <b>Below is a list of a few areas that we see opportunities of improvements for your store. Scroll down to read more details.</b>
                      </p>
                      {
                        !this.state.user.paid?
                        <a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                        :
                        <List celled>
                          {summary_list}
                      </List>
                      }
                      </div>
                      </Grid.Column>
                       
                      <Grid.Column>
                      <img src={first_screen_url} className='' alt='front page' style={{borderRadius:8}}/>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Divider style={{marginLeft:25}}/>
                  <h3 className='heading' style={{marginLeft:20}}>Details</h3>


                  <Grid columns={3} stackable textAlign='center'>
      

                    <List divided verticalAlign='middle' style={{marginTop:5, marginLeft:20}}>
                      <List.Item>
                        <List.Content>
                          <p style={{color: '#696969',textAlign:'left'}}><Icon name='checkmark' style={{color:'#329932'}}/> Great job - no actionable strategies are recommended.</p>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <p style={{color: '#696969',textAlign:'left'}}><Icon name='attention' style={{color:'#FF4c4c'}}/> Need to improve the section - actionable strategies are recommended.</p>
                        </List.Content>
                      </List.Item>
                    </List>       
                   

                    <Grid.Row verticalAlign='top'>
                    <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 0, marginBottom:20}}>
                          <br/>
      
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Overview</span>
        
                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                              <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                                {/* page length 部分 */}
                                <Accordion.Title
                                  active={this.state.activeIndex === 0}
                                  index={0}
                                  onClick={this.handleClick}
                                  style={{color:'#1b1b1c', textAlign:'left'}}
                                >
                                    {
                                      page_length<AS[category].Page_length.Min?
                                      <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      : page_length <= AS[category].Page_length.Max?
                                        <Icon name='checkmark' style={{color:'#329932'}}/>
                                        :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }
                                    <Icon name='dropdown' /> Page length
                                </Accordion.Title>

                              <Accordion.Content active={this.state.activeIndex === 0}>
                                  <div class="ui raised segment" style={{padding:20}}>
                                    <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                    <a>
                                    {
                                      page_length<AS[category].Page_length.Min
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Page_length.AS_below_min}
                                        </p>
                                      : page_length <= AS[category].Page_length.Max
                                        ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            {AS[category].Page_length.AS_in_range}
                                          </p>
                                        : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            {AS[category].Page_length.AS_above_max} 
                                          </p>
                                    }</a>
                                  </div>

                                  <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                    We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepages are usually <b>3-10</b> pages long. 
                                  
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip1}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>

                                  </p>
                                  <Bar 
                                    data={barChartData2}
                                    options={barChartOptions}
                                  />
                                  <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                    We also studied dozens of high performing e-commerce sellers of all size within <b>{this.state.user.category}</b> category, and found out that the homepage of a top e-commerce store of <b>{this.state.user.category}</b> category are usually <b>{AS[this.state.user.category].Page_length.Min}-{AS[this.state.user.category].Page_length.Max}</b> pages long. Your homepage is <b>{page_length}</b> pages long.
                                  </p>
                                  <Bar 
                                      data={barChartData1}
                                      options={barChartOptions}
                                  />
                              </Accordion.Content>


                              {/* home section 部分 */}
                              <Accordion.Title
                                active={this.state.activeIndex === 1}
                                index={1}
                                onClick={this.handleClick}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                                > 

                                  {
                                    section_number < AS.All_graphs.Home_section.Min
                                    ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    : <Icon name='checkmark' style={{color:'#329932'}}/>
                                  } 

                                  <Icon name='dropdown' /> homepage content type
                              </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 1}>
                                  <p style={{color: '#696969', textAlign:'left'}}>Your homepage is the only open door to your customers. Our study of hundreds of successful e-commerce stores shows that the type of information is equally, if not more important than the amount.</p>
                                  <div class="ui raised segment" style={{padding:20}}>
                                    <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                    <a>{
                                      section_number < AS.All_graphs.Home_section.Min
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS.All_graphs.Home_section.AS_below_min}
                                        </p>
                                      :  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS.All_graphs.Home_section.AS_in_range}
                                        </p>
                                    }</a>
                                   {/* <p>include sections: </p>
                                      {used_sections_list} */}
                                      {
                                        section_number < AS.All_graphs.Home_section.Min
                                        ? <List celled style={{textAlign:'left'}}>
                                        {no_section_list}
                                      </List>
                                        : null
                                      }

                                  </div>
                              </Accordion.Content>

                          </Accordion>
                          </>
                            
                            }

                            <br/>
                            <br/>

                        </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 0, marginBottom:20}}>
                            <br/>
                        
                            <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Images</span>

                            <br/>
                            <br/>

                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                              {/* Total number of images 部分 */}
                              <Accordion.Title
                                active={this.state.activeIndex1 === 0}
                                index={0}
                                onClick={this.handleClick1}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                              >

                                  {
                                      image_number<AS[category].Image_number.Min?
                                      <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      : image_number<=AS[category].Image_number.Max?
                                        <Icon name='checkmark' style={{color:'#329932'}}/>
                                        :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }

                                  <Icon name='dropdown' />Total number of images
                              </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex1 === 0}>
                              <div class="ui raised segment" style={{padding:20}}>
                                  <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  
                                  <a>{
                                    image_number<AS[category].Image_number.Min
                                    ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Image_number.AS_below_min}
                                      </p>

                                    : image_number<=AS[category].Image_number.Max
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Image_number.AS_in_range}
                                        </p>
                                      : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Image_number.AS_above_max}
                                        </p>
                                    }</a>
                                </div>

                                <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>7- 21</b> images
                                </p>
                                <Bar 
                                      data={barChartData3}
                                      options={barChartOptions3}
                                    />
                                <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Image_number.Min}-{AS[this.state.user.category].Image_number.Max}</b> images. Your homepage has <b>{image_number}</b> images.
                                </p>
                                <Bar 
                                      data={barChartData4}
                                      options={barChartOptions3}
                                    />
                            </Accordion.Content>

                            {/* Store image quality 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex1 === 1}
                              index={1}
                              onClick={this.handleClick1}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                              {
                                count === 0
                                ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                              }

                                <Icon name='dropdown' /> Store picture quality
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex1 === 1}>

                            <p style={{color: '#696969', textAlign:'left'}}>People are visual creatures, and it’s well-documented that we are 65% more likely to remember a piece of information if we saw an image with it. Since customers can’t touch your product, you have to entice them with fantastic images to get them to reach the checkout. Needless to say, images of poor quality push customers away from your site and hurt your brand. <b>We analyze images from the aesthetic and technical perspectives. Below we have identified some images with room for improvement.</b></p> 
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a>
                                      {
                                        not_aesthetic_list.length === 0 
                                        ?  AS[category].Image_aesthetic.AS_in_range
                                        : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            The following images are rated as 'poor' for their aesthetic scores. Consider improving or swapping out these images. 
                                            If you are curious about how the aesthetic scoring system works, check <u><a href="/term" target="_blank" style={{color:'#696969'}}>here</a></u>. If you need help in specific strategies in improving your image aesthetics, contact us at <span style={{color:"#696969"}}>hello@haloy.co</span> and we will get in touch with you!
                                          </p>
                                      }
                                      
                                    </a> 
                                  </p>
                                  {not_aesthetic_list}
                                  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a>
                                      {
                                        not_technical_list.length === 0
                                        ? AS[category].Image_technical.AS_in_range
                                        :<p style={{textAlign:'left', fontWeight:'bold'}}>
                                            The following images are rated as 'poor' for their technical scores. Consider improving or swapping out these images. 
                                            If you are curious about how the technical scoring system works, check <u><a href="/term" target="_blank" style={{color:'#696969'}}>here</a></u>. If you need help in specific strategies in improving your image techniques, contact us at <span style={{color:"#696969"}}>hello@haloy.co</span> and we will get in touch with you!
                                        </p>
                                      }
                                      </a>
                                  </p>
                                  {not_technical_list}
                              </div>

                            <p style={{fontWeight:'bold'}}>Image aesthetic and technical quality</p>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage images have at least <b>"good"</b> rating aesthetic scores and technical scores.
                            </p>
                              <Bar 
                                    data={barChartData5}
                                    options={barChartOptions5}
                                  />
                              <Bar 
                                    data={barChartData7}
                                    options={barChartOptions7}
                                  />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually have at least <b>"good"</b> rating aesthetic scores and technical scores.
                            </p>
                              <Bar 
                                    data={barChartData6}
                                    options={barChartOptions5}
                                  />
                               <Bar 
                                    data={barChartData8}
                                    options={barChartOptions7}
                                  />

                            </Accordion.Content>

                            {/* Store image effectiveness 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex1 === 2}
                              index={2}
                              onClick={this.handleClick1}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >

                              {
                                this.state.image_effective_ratio < AS[category].Image_effectiveness.Min
                                ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                : <Icon name='checkmark' style={{color:'#329932'}}/>
                              }

                                <Icon name='dropdown' /> Store picture effectiveness
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex1 === 2}>
                              <p style={{color: '#696969', textAlign:'left'}}>
                              Study has shown that 25 percent of first-time buyers depend solely on the homepage content and navigation to determine what type of products the site sells. <b>Thus, it is crucial that you are telling a clear and coherent story with your homepage by presenting images of your products.</b>
                              </p>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.image_effective_ratio < AS[category].Image_effectiveness.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Image_effectiveness.AS_below_min}</a>
                                    </p>
                                  : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Image_effectiveness.AS_in_range}</a>
                                    </p>
                                
                                }
                                {no_object_list}
                              </div>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              Our intensive study of successful e-commerce store tells us that picture is usually effective when the customers could easily notice the product in the image. <b>Most successful stores usually have more than 75% of the store images contain their real products.</b>
                            </p>
                            <Bar 
                                data={barChartData9}
                                options={barChartOptions9}
                              />
                            </Accordion.Content>

                        </Accordion>
                        </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>

                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 0, marginBottom:20}}>
                      <br/>


                      <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Colors</span>


                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :
                            <>
                              <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                                {/* Theme color 部分 */}
                                <Accordion.Title
                                  active={this.state.activeIndex2 === 0}
                                  index={0}
                                  onClick={this.handleClick2}
                                  style={{color:'#1b1b1c', textAlign:'left'}}
                                >

                                    {
                                      this.state.theme_color
                                      ?<Icon name='checkmark' style={{color:'#329932'}}/>
                                      :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }

                                    <Icon name='dropdown' />Theme colors
                                </Accordion.Title>

                              <Accordion.Content active={this.state.activeIndex2 === 0}>

                              <p style={{color:'#696969', textAlign:"left"}}>Colors have a powerful effect on our emotions. And these emotions play a major role in how we behave as consumers. Brand color psychology provides a framework for understanding how and why we interact with the brands in our lives. While effect that colors have on our emotions differs from person to person based on gender, cultural context, personal experience, and neurological variances, there are some general guidelines that have been borne out by countless color psychology studies. </p>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.theme_color
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Theme_color.AS_same_color_category}</a>
                                    </p>
                                  : <>
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Theme_color.AS_not_same_color_category}</a>
                                    </p>
                                    <p style={{fontWeight:'bold', textAlign:'left'}}>The brand identity you selected</p>
                                    <p style={{color:'#696969', textAlign:'left', marginTop:-10}}>{color_style}</p>
                                    <p style={{fontWeight:'bold', marginTop:15, textAlign:'left'}}>Based on your brand identity, we recommend colors below and have found a store for you to get some inspirations!</p>
                                    {color_list_rec} <br/>
                                    {color_category_list_rec}
                                    <p style={{fontWeight:'bold', marginTop:15, textAlign:'left'}}>Example store</p>
                                    <a href={AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_example`]} target='_blank'><p style={{color:'#696969', textAlign:'left', marginTop:-10}}>{AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_example`]}</p></a>
                                    </>
                                }
                              </div>
                                    {/*{color_list} <br/>
                                    {color_category_list}<br/>*/}
           
                              </Accordion.Content>
                          </Accordion>
                          </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>


                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>
                      <br/>


                      <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Texts</span>


                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                              {/* Text count 部分 */}
                              <Accordion.Title
                                  active={this.state.activeIndex3 === 0}
                                  index={0}
                                  onClick={this.handleClick3}
                                  style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                              >

                                  {
                                    text_count<AS[category].Text_count.Min
                                    ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    : text_count<=AS[category].Text_count.Max
                                      ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                      : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  }

                                  <Icon name='dropdown' />Text count
                              </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex3 === 0}>
                                <p style={{color: '#696969', textAlign:'left'}}>When we read, we've all had experiences struggling with too much content and losing the thesis. Conversely, we also had experience with barely abstract images and a few words, grappling with confusions. Same extremes apply to your store homepage. <b>The key to text count for your store homepage is finding a good balance in between.</b></p>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  text_count<AS[category].Text_count.Min
                                  ? <a><p style={{textAlign:'left', fontWeight:'bold'}}>
                                      {AS[category].Text_count.AS_below_min}
                                    </p></a>
                                  : text_count<=AS[category].Text_count.Max
                                    ? <a><p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Text_count.AS_in_range}
                                      </p></a>
                                    : <a><p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Text_count.AS_above_max}
                                      </p></a>
                                }
                              </div>

                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>0-400</b> words 
                            </p>
                            <Bar 
                                data={barChartData10}
                                options={barChartOptions10}
                              />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Text_count.Min}-{AS[this.state.user.category].Text_count.Max}</b> words. Your homepage includes <b>{text_count}</b> words. 
                            </p>
                            <Bar 
                                data={barChartData11}
                                options={barChartOptions10}
                              />
                            </Accordion.Content>

                            {/* Text effectiveness 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex3 === 1}
                              index={1}
                              onClick={this.handleClick3}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                                {
                                  this.state.text_effective_ratio >= AS.All_graphs.Text_effectiveness.Min
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> Text effectiveness
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex3 === 1}>
                              <p style={{color: '#696969', textAlign:'left'}}>We extracted keywords from hundreds of e-commerce stores, and found that almost all keywords from successful e-commerce stores are either directly about their products or delivering important information about their products/stores. </p>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.text_effective_ratio >= AS.All_graphs.Text_effectiveness.Min
                                  ? <a><p style={{textAlign:'left', fontWeight:'bold'}}>
                                      {AS.All_graphs.Text_effectiveness.AS_in_range}
                                    </p></a>
                                  : <a><p style={{textAlign:'left', fontWeight:'bold'}}>
                                      {AS.All_graphs.Text_effectiveness.AS_below_min}
                                    </p></a>
                                }
                                {text_no_effect_all_list}
                              </div>

                            </Accordion.Content>
                        </Accordion>
                        </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>


                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>
                          <br/>
                          <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='layout'/>
                          <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Typographies</span>
                          <br/>
                          <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            : <>
                                <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                                  {/* Font count 部分 */}
                                  <Accordion.Title
                                      active={this.state.activeIndex4 === 0}
                                      index={0}
                                      onClick={this.handleClick4}
                                      style={{color:'#1b1b1c', textAlign:'left'}}
                                  >
                                      {
                                        font_number<AS[category].Font_count.Min?
                                        <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                        : font_number<=AS[category].Font_count.Max?
                                          <Icon name='checkmark' style={{color:'#329932'}}/>
                                          :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      }
                                      <Icon name='dropdown'/> Font count
                                  </Accordion.Title>

                                <Accordion.Content active={this.state.activeIndex4 === 0}>
                                <p style={{color: '#696969',textAlign:'left'}}>How many fonts should I use? We got this question from many online sellers. The truth is, using too many fonts, you might lose the coherence. Using only one font, you might end up failing to highlight certain key features. It's again a science of good balance! </p>
                                <div class="ui raised segment" style={{padding:20}}>
                                  <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  {font_number<AS[category].Font_count.Min
                                  ?
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_below_min}</a>
                                    </p>
                                  : font_number<=AS[category].Font_count.Max?
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_in_range}</a>
                                    </p>
                                    : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_above_max}</a>
                                    </p>
                                  }
                                </div>

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>3-9</b> fonts.
                                </p>
                              <Bar 
                                data={barChartData12}
                                options={barChartOptions12}
                              />

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Font_count.Min}-{AS[this.state.user.category].Font_count.Max}</b> fonts. Your store has <b>{font_number}</b> fonts.
                              </p>

                              <Bar 
                                data={barChartData17}
                                options={barChartOptions12}
                              />
                            </Accordion.Content>
                        </Accordion>
                        </>
                            }
                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:20, marginRight:20, marginTop: 20, marginBottom:20}}>
                          <br/>
      
                            <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>First Impression</span>
        
                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :
                            <>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                            
                            {/* First screen 美观质量部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={4}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                            >
                                {
                                  first_screen_aesthetic_score >= AS[category].Image_aesthetic_first.Min
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> First screen page aesthetic quality
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex5 === 4}>
                                <p style={{color: '#696969', textAlign:'left'}}>The aesthetics of the first image that your customers see plays a critical role in forming their first impression on your product, brand and all.</p>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>

                                {first_screen_aesthetic_score >= AS[category].Image_aesthetic_first.Min
                                ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a> {AS[category].Image_aesthetic_first.AS_in_range}</a>
                                  </p> 
                               : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a> {AS[category].Image_aesthetic_first.AS_below_min}</a>
                                  </p>
                                } 
                                <img src={first_screen_url} width='100%' style={{paddingBottom:'10px'}} alt='first_screen'/>
                            </div>


                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's website first impression page has at least <b>"good" (above 5.5)</b> aesthetic rating.
                              </p>
                                <Bar 
                                      data={barChartData15}
                                      options={barChartOptions14}
                                    />

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's website first impression page has at least <b>"good (above 5.5)"</b> aesthetic rating. The aesthetic score of your first screen page is <b>{first_screen_aesthetic_score.toFixed(1)}</b>.
                              </p>
                              <Bar 
                                    data={barChartData16}
                                    options={barChartOptions14}
                                  />

                            </Accordion.Content>

                            {/* First screen effectiveness 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={0}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                            >

                                {
                                  this.state.first_page_effective
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }

                                <Icon name='dropdown' /> Image effectiveness on the first screen page
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex5 === 0}>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.first_page_effective
                                  ? <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS[category].Image_effectiveness_first.AS_in_range}</a>
                                    </p>
                                  : <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS[category].Image_effectiveness_first.AS_below_min}</a>
                                    </p>
                                }
                                <img src={first_object_url} width='100%' style={{paddingBottom:'10px'}} alt='first_screen'/>
                              </div>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We studied hundreds of high performing e-commerce sellers of all size and found out that <b>95%</b> of a top e-commerce store's website first impression page displays their store products.
                            </p>
                            <Doughnut
                              height="150vh"
                              data={doughnutChartData}
                              options={doughnutChartOptions}
                          />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that <b>{AS[this.state.user.category].Image_effectiveness_first.Ratio}%</b> of e-commerce store's website first impression page of this category display their products.
                            </p>
                            <Doughnut
                              height="150vh"
                              data={doughnutChartData2}
                              options={doughnutChartOptions}
                          />
                            </Accordion.Content>

                            {/* 首页 Text count 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={2}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                                {
                                  text_count_front<AS[category].Text_count_first.Min
                                  ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  : text_count_front<=AS[category].Text_count_first.Max
                                    ?<Icon name='checkmark' style={{color:'#329932'}}/>
                                    : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> Text count on the first screen
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex5 === 2}>

                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  text_count_front<AS[category].Text_count_first.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Text_count_first.AS_below_min}</a>
                                    </p>
                                  : text_count_front<=AS[category].Text_count_first.Max
                                    ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Text_count_first.AS_in_range}</a>
                                      </p>
                                    : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Text_count_first.AS_above_max}</a>
                                      </p>
                                }
                              </div>
                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's website first impression page usually contains <b>below 100</b> words
                              </p>
                              <Bar 
                                  data={barChartData13}
                                  options={barChartOptions13}
                                />
                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's website first impression page of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Text_count_first.Min}-{AS[this.state.user.category].Text_count_first.Max}</b> words. Your first screen page includes <b>{text_count_front}</b> words.
                              </p>
                              <Bar 
                                  data={barChartData14}
                                  options={barChartOptions13}
                                />
                            </Accordion.Content>

                            
                            {/* 首页 Text effectiveness 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={3}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                            >
         
                                {
                                  this.state.text_effective_ratio_front<AS.All_graphs.Text_effectiveness_first.Min
                                  ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  : <Icon name='checkmark' style={{color:'#329932'}}/>
                                }

                                <Icon name='dropdown' />Text effectiveness on the first screen
                            </Accordion.Title>
                            
                            <Accordion.Content active={this.state.activeIndex5 === 3}>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.text_effective_ratio_front<AS.All_graphs.Text_effectiveness_first.Min
                                  ? <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:"bold"}}>{AS.All_graphs.Text_effectiveness_first.AS_below_min}</a>
                                    </p>
                                  : <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:"bold"}}>{AS.All_graphs.Text_effectiveness_first.AS_in_range}</a>
                                    </p>
                                }
                                {text_no_effect_front_list}
                              </div>
                            </Accordion.Content>

                            </Accordion>
                            </>
                            }
                            <br/>
                            <br/>

                        </div>
                      </Grid.Column>

                      <Grid.Column>
                      </Grid.Column>

                    </Grid.Row>
                  </Grid>
                </div>

            </div>
          </div>
        </div>




        {/* 手机部分 */}
        <div className="mobile-only">
       
            <Dashboard_sidebar_mobile active={2} user={this.state.user}/>


          <div className="col s12" style={{backgroundColor:'#f0f7f2'}}>
            <div style={{paddingLeft:0}}>
                <div placeholder style={{backgroundColor:'#f0f7f2'}}>
                  <div style={{textAlign:"left", marginLeft: 20, marginTop: 20}}>
                    <span className="row" >
                    <div className="col s12" style={{marginLeft:-10}}>
                    <h2 className='heading'>Example Actionable Strategies</h2>
                    <h5>for {this.state.user.store}
                    <p style={{color:"#696969", fontWeight:"normal"}}>(all data below are for example - not real analysis)</p></h5>
                      </div>
                      </span>
                    </div>

                    {this.state.user.paid
                            ?null
                            :<div style={{marginLeft:20}}>
                              <Button
                              style={{marginRight: 20, backgroundColor:'#80e98f', color:'#1b1b1c', fontWeight:"bold", marginBottom:30}}
                              variant="outline-light" 
                              size="sm" 
                              onClick={()=>{
                                axios.post("/api/leads/update", {
                                  url: this.state.user.store,
                                  item: 'go_premium_button',
                                  value: '6'
                                })
                                this.props.history.push({
                                  pathname: "/account",
                                  state: true
                                })
                              }}
                              >
                              GO PREMIUM
                              </Button>
                            </div>
                          }


                  <Grid columns={2} stackable>
                    <Grid.Row verticalAlign='top'>
                      <Grid.Column>
                        <img src={first_screen_url} className='' alt='front page' style={{borderRadius:8}}/>
                      </Grid.Column>

                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, width:'100%'}}>
                        <img src={process.env.PUBLIC_URL + '/strategy_list.png'} className='image_icon_steps' alt='layout'/>
                        <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Summary</span>
 
                        <p style={{fontWeight:'', marginLeft:10, marginTop:10, color:'#696969'}}>
                        In traditional retail, visual merchandising build communication with customers through the elements that impact their senses. That’s why it is a common practice to spray the smell of freshly-baked bread near the bakery shelves in a supermarket or highlight new cookie packages brighter.  You must also notice that bakery, fresh fruits and vegetables are mostly placed at the point of entry to set a pleasant atmosphere with the help of colours and smells.
                      <br/><br/>
                        Much like visual merchandising’s many benefits for traditional physical stores, it’s even more critical for use in e-commerce stores since the visual is the only medium between you and your customers. The homepage is your showcase, the category and product pages are the shelves. <b>Winning the battle of visual merchandising will directly lead to increased key online metrics such as engagement, time on site, conversion rate, and average order value (AOV) and we are here to help you get there.</b> 
                        <br/><br/>
                        <b>Below is a list of a few areas that we see opportunities of improvements for your store. Scroll down to read more details.</b>
                      </p>
                     
                        {
                          !this.state.user.paid?
                          <a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                          :
                          <List celled>
                            {summary_list}
                        </List>
                        }
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Divider style={{marginLeft:25}}/>
                  <h3 className='heading' style={{marginLeft:20}}>Details</h3>
                  <Grid columns={3} stackable textAlign='center'>
                    <List divided verticalAlign='middle' style={{marginTop:5, marginLeft:5}}>
                      <List.Item>
                        <List.Content>
                          <p style={{color: '#696969',textAlign:'left'}}><Icon name='checkmark' style={{color:'#329932'}}/> Great job - no actionable strategies are recommended.</p>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <p style={{color: '#696969',textAlign:'left'}}><Icon name='attention' style={{color:'#FF4c4c'}}/> Need to improve the section - actionable strategies are recommended.</p>
                        </List.Content>
                      </List.Item>
                    </List>       
                   

                    <Grid.Row verticalAlign='top'>
                    <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                          <br/>
      
                            <img src={process.env.PUBLIC_URL + '/overview.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Overview</span>
        
                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                              <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                                {/* page length 部分 */}
                                <Accordion.Title
                                  active={this.state.activeIndex === 0}
                                  index={0}
                                  onClick={this.handleClick}
                                  style={{color:'#1b1b1c', textAlign:'left'}}
                                >
                                    {
                                      page_length<AS[category].Page_length.Min?
                                      <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      : page_length <= AS[category].Page_length.Max?
                                        <Icon name='checkmark' style={{color:'#329932'}}/>
                                        :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }
                                    <Icon name='dropdown' /> Page length
                                </Accordion.Title>

                              <Accordion.Content active={this.state.activeIndex === 0}>
              
                              <div class="ui raised segment" style={{padding:20}}>
                                    <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                    <a>
                                    {
                                      page_length<AS[category].Page_length.Min
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Page_length.AS_below_min}
                                        </p>
                                      : page_length <= AS[category].Page_length.Max
                                        ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            {AS[category].Page_length.AS_in_range}
                                          </p>
                                        : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            {AS[category].Page_length.AS_above_max}
                                          </p>
                                    }</a>
                                  </div>

                                  <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                    We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepages are usually <b>3-10</b> pages long. 
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip1}
                                    >
                                        <Icon name='question circle outline' style={{color:'grey'}}/>
                                    </OverlayTrigger>
                                  </p>
                                  <Bar 
                                    data={barChartData2}
                                    options={barChartOptions}
                                  />
                                  <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                    We also studied dozens of high performing e-commerce sellers of all size within <b>{this.state.user.category}</b> category, and found out that the homepage of a top e-commerce store of <b>{this.state.user.category}</b> category are usually <b>{AS[this.state.user.category].Page_length.Min}-{AS[this.state.user.category].Page_length.Max}</b> pages long. Your homepage is <b>{page_length}</b> pages long.
                                  </p>
                                  <Bar 
                                      data={barChartData1}
                                      options={barChartOptions}
                                  />
                              </Accordion.Content>


                              {/* home section 部分 */}
                              <Accordion.Title
                                active={this.state.activeIndex === 1}
                                index={1}
                                onClick={this.handleClick}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                                >

                                  {
                                    section_number < AS.All_graphs.Home_section.Min
                                    ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    : <Icon name='checkmark' style={{color:'#329932'}}/>
                                  }

                                  <Icon name='dropdown' /> homepage content type
                              </Accordion.Title>
                                <Accordion.Content active={this.state.activeIndex === 1}>
                                <p style={{color: '#696969', textAlign:'left'}}>Your homepage is the only open door to your customers. Our study of hundreds of successful e-commerce stores shows that the type of information is equally, if not more important than the amount.</p>
                                <div class="ui raised segment" style={{padding:20}}>
                                    <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                    <a>{
                                      section_number < AS.All_graphs.Home_section.Min
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS.All_graphs.Home_section.AS_below_min}
                                        </p>
                                      :  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS.All_graphs.Home_section.AS_in_range}
                                        </p>
                                    }</a>
                                   {/* <p>include sections: </p>
                                      {used_sections_list} */}
                                      <List celled style={{textAlign:'left'}}>
                                        {no_section_list}
                                      </List>
                                  </div>
                              </Accordion.Content>

                          </Accordion>
                          </>
                            
                            }

                            <br/>
                            <br/>

                        </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                            <br/>
                        
                            <img src={process.env.PUBLIC_URL + '/image.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Images</span>

                            <br/>
                            <br/>

                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                              {/* Total number of images 部分 */}
                              <Accordion.Title
                                active={this.state.activeIndex1 === 0}
                                index={0}
                                onClick={this.handleClick1}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                              >

                                  {
                                      image_number<AS[category].Image_number.Min?
                                      <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      : image_number<=AS[category].Image_number.Max?
                                        <Icon name='checkmark' style={{color:'#329932'}}/>
                                        :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }

                                  <Icon name='dropdown' />Total number of images
                              </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex1 === 0}>
                            <div class="ui raised segment" style={{padding:20}}>
                                  <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  
                                  <a>{
                                    image_number<AS[category].Image_number.Min
                                    ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Image_number.AS_below_min}
                                      </p>

                                    : image_number<=AS[category].Image_number.Max
                                      ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Image_number.AS_in_range}
                                        </p>
                                      : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                          {AS[category].Image_number.AS_above_max}
                                        </p>
                                    }</a>
                                </div>

                                <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>7- 21</b> images
                                </p>
                                <Bar 
                                      data={barChartData3}
                                      options={barChartOptions3}
                                    />
                                <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Image_number.Min}-{AS[this.state.user.category].Image_number.Max}</b> images. Your homepage has <b>{image_number}</b> images.
                                </p>
                                <Bar 
                                      data={barChartData4}
                                      options={barChartOptions3}
                                    />
                            </Accordion.Content>

                            {/* Store image quality 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex1 === 1}
                              index={1}
                              onClick={this.handleClick1}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                              {
                                count === 0
                                ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                              }

                                <Icon name='dropdown' /> Store picture quality
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex1 === 1}>

                            <p style={{color: '#696969', textAlign:'left'}}>People are visual creatures, and it’s well-documented that we are 65% more likely to remember a piece of information if we saw an image with it. Since customers can’t touch your product, you have to entice them with fantastic images to get them to reach the checkout. Needless to say, images of poor quality push customers away from your site and hurt your brand. <b>We analyze images from the aesthetic and technical perspectives. Below we have identified some images with room for improvement.</b></p> 
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a>
                                      {
                                        not_aesthetic_list.length === 0 
                                        ?  AS[category].Image_aesthetic.AS_in_range
                                        : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                            The following images are rated as 'poor' for their aesthetic scores. Consider improving or swapping out these images. 
                                            If you are curious about how the aesthetic scoring system works, check <u><a href="/term" target="_blank" style={{color:'#696969'}}>here</a></u>. If you need help in specific strategies in improving your image aesthetics, contact us at <span style={{color:"#696969"}}>hello@haloy.co</span> and we will get in touch with you!
                                          </p>
                                      }
                                      
                                    </a>
                                  </p>
                                  {not_aesthetic_list}
                                  <p style={{textAlign:'left', fontWeight:'bold'}}>
                                    <a>
                                      {
                                        not_technical_list.length === 0
                                        ? AS[category].Image_technical.AS_in_range
                                        :<p style={{textAlign:'left', fontWeight:'bold'}}>
                                            The following images are rated as 'poor' for their technical scores. Consider improving or swapping out these images. 
                                            If you are curious about how the technical scoring system works, check <u><a href="/term" target="_blank" style={{color:'#696969'}}>here</a></u>. If you need help in specific strategies in improving your image techniques, contact us at <span style={{color:"#696969"}}>hello@haloy.co</span> and we will get in touch with you!
                                        </p>
                                      }
                                      </a>
                                  </p>
                                  {not_technical_list}
                              </div>

                            <p style={{fontWeight:'bold'}}>Image aesthetic and technical quality</p>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage images have at least <b>"good"</b> rating aesthetic scores and technical scores.
                            </p>
                              <Bar 
                                    data={barChartData5}
                                    options={barChartOptions5}
                                  />
                              <Bar 
                                    data={barChartData7}
                                    options={barChartOptions7}
                                  />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually have at least <b>"good"</b> rating aesthetic scores and technical scores.
                            </p>
                              <Bar 
                                    data={barChartData6}
                                    options={barChartOptions5}
                                  />
                               <Bar 
                                    data={barChartData8}
                                    options={barChartOptions7}
                                  />
                            </Accordion.Content>

                            {/* Store image effectiveness 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex1 === 2}
                              index={2}
                              onClick={this.handleClick1}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >

                              {
                                this.state.image_effective_ratio < AS[category].Image_effectiveness.Min
                                ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                : <Icon name='checkmark' style={{color:'#329932'}}/>
                              }

                                <Icon name='dropdown' /> Store picture effectiveness
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex1 === 2}>
                              <p style={{color: '#696969', textAlign:'left'}}>
                              Study has shown that 25 percent of first-time buyers depend solely on the homepage content and navigation to determine what type of products the site sells. <b>Thus, it is crucial that you are telling a clear and coherent story with your homepage by presenting images of your products.</b>
                              </p>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.image_effective_ratio < AS[category].Image_effectiveness.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Image_effectiveness.AS_below_min}</a>
                                    </p>
                                  : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Image_effectiveness.AS_in_range}</a>
                                    </p>
                                
                                }
                                {no_object_list}
                              </div>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              Our intensive study of successful e-commerce store tells us that picture is usually effective when the customers could easily notice the product in the image. <b>Most successful stores usually have more than 75% of the store images contain their real products.</b>
                            </p>
                            <Bar 
                                data={barChartData9}
                                options={barChartOptions9}
                              />
                            </Accordion.Content>

                        </Accordion>
                        </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>

                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                      <br/>


                      <img src={process.env.PUBLIC_URL + '/color.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Colors</span>


                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :
                            <>
                              <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                                {/* Theme color 部分 */}
                                <Accordion.Title
                                  active={this.state.activeIndex2 === 0}
                                  index={0}
                                  onClick={this.handleClick2}
                                  style={{color:'#1b1b1c', textAlign:'left'}}
                                >

                                    {
                                      this.state.theme_color
                                      ?<Icon name='checkmark' style={{color:'#329932'}}/>
                                      :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    }

                                    <Icon name='dropdown' />Theme colors
                                </Accordion.Title>

                              <Accordion.Content active={this.state.activeIndex2 === 0}>
                              <p style={{color:'#696969', textAlign:"left"}}>Colors have a powerful effect on our emotions. And these emotions play a major role in how we behave as consumers. Brand color psychology provides a framework for understanding how and why we interact with the brands in our lives. While effect that colors have on our emotions differs from person to person based on gender, cultural context, personal experience, and neurological variances, there are some general guidelines that have been borne out by countless color psychology studies. </p>
                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.theme_color
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Theme_color.AS_same_color_category}</a>
                                    </p>
                                  : <>
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Theme_color.AS_not_same_color_category}</a>
                                    </p>
                                    <p style={{fontWeight:'bold', textAlign:'left'}}>The brand identity you selected</p>
                                    <p style={{color:'#696969', textAlign:'left', marginTop:-10}}>{color_style}</p>
                                    <p style={{fontWeight:'bold', marginTop:15, textAlign:'left'}}>Based on your brand identity, we recommend colors below and have found a store for you to get some inspirations!</p>
                                    {color_list_rec} <br/>
                                    {color_category_list_rec}
                                    <p style={{fontWeight:'bold', marginTop:15, textAlign:'left'}}>Example store</p>
                                    <p style={{color:'#696969', textAlign:'left', marginTop:-10}}>{AS[category].Theme_color[`style_${this.state.user.labelResults.style.substring(1,2)}_example`]}</p>
                                    </>
                                }
                              </div>
                              </Accordion.Content>
                          </Accordion>
                          </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>


                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                      <br/>


                      <img src={process.env.PUBLIC_URL + '/text.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Texts</span>


                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :<>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>

                              {/* Text count 部分 */}
                              <Accordion.Title
                                  active={this.state.activeIndex3 === 0}
                                  index={0}
                                  onClick={this.handleClick3}
                                  style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                              >

                                  {
                                    text_count<AS[category].Text_count.Min
                                    ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                    : text_count<=AS[category].Text_count.Max
                                      ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                      : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  }

                                  <Icon name='dropdown' />Text count
                              </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex3 === 0}>

                            <p style={{color: '#696969', textAlign:'left'}}>When we read, we've all had experiences struggling with too much content and losing the thesis. Conversely, we also had experience with barely abstract images and a few words, grappling with confusions. Same extremes apply to your store homepage. <b>The key to text count for your store homepage is finding a good balance in between.</b></p>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  text_count<AS[category].Text_count.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      {AS[category].Text_count.AS_below_min}
                                    </p>
                                  : text_count<=AS[category].Text_count.Max
                                    ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Text_count.AS_in_range}
                                      </p>
                                    : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        {AS[category].Text_count.AS_above_max}
                                      </p>
                                }
                              </div>

                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>0-400</b> words 
                            </p>
                            <Bar 
                                data={barChartData10}
                                options={barChartOptions10}
                              />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Text_count.Min}-{AS[this.state.user.category].Text_count.Max}</b> words. Your homepage includes <b>{text_count}</b> words. 
                            </p>
                            <Bar 
                                data={barChartData11}
                                options={barChartOptions10}
                              />
                            </Accordion.Content>

                            {/* Text effectiveness 部分 */}
                            <Accordion.Title
                              active={this.state.activeIndex3 === 1}
                              index={1}
                              onClick={this.handleClick3}
                              style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                                {
                                  this.state.text_effective_ratio >= AS.All_graphs.Text_effectiveness.Min
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> Text effectiveness
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex3 === 1}>
                            <p style={{color: '#696969', textAlign:'left'}}>We extracted keywords from hundreds of e-commerce stores, and found that almost all keywords from successful e-commerce stores are either directly about their products or delivering important information about their products/stores. </p>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.text_effective_ratio >= AS.All_graphs.Text_effectiveness.Min
                                  ? <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS.All_graphs.Text_effectiveness.AS_in_range}</a>
                                    </p>
                                  : <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS.All_graphs.Text_effectiveness.AS_below_min}</a>
                                    </p>
                                }
                                {text_no_effect_all_list}
                              </div>

                            </Accordion.Content>
                        </Accordion>
                        </>
                            }

                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>


                      <Grid.Column>
                      <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                          <br/>
                          <img src={process.env.PUBLIC_URL + '/typographies.png'} className='image_icon_steps' alt='layout'/>
                          <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>Typographies</span>
                          <br/>
                          <br/>
                            
                            {!this.state.user.paid
                            ? <a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            : <>
                                <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                                  {/* Font count 部分 */}
                                  <Accordion.Title
                                      active={this.state.activeIndex4 === 0}
                                      index={0}
                                      onClick={this.handleClick4}
                                      style={{color:'#1b1b1c', textAlign:'left'}}
                                  >
                                      {
                                        font_number<AS[category].Font_count.Min?
                                        <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                        : font_number<=AS[category].Font_count.Max?
                                          <Icon name='checkmark' style={{color:'#329932'}}/>
                                          :<Icon name='attention' style={{color:'#FF4c4c'}}/>
                                      }
                                      <Icon name='dropdown'/> Font count
                                  </Accordion.Title>

                                <Accordion.Content active={this.state.activeIndex4 === 0}>

                                <p style={{color: '#696969',textAlign:'left'}}>How many fonts should I use? We got this question from many online sellers. The truth is, using too many fonts, you might lose the coherence. Using only one font, you might end up failing to highlight certain key features. It's again a science of good balance! </p>
                                <div class="ui raised segment" style={{padding:20}}>
                                  <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                  {font_number<AS[category].Font_count.Min
                                  ?
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_below_min}</a>
                                    </p>
                                  : font_number<=AS[category].Font_count.Max?
                                    <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_in_range}</a>
                                    </p>
                                    : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Font_count.AS_above_max}</a>
                                    </p>
                                  }
                                </div>

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's homepage usually contains <b>3-9</b> fonts.
                                </p>
                              <Bar 
                                data={barChartData12}
                                options={barChartOptions12}
                              />

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's homepage of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Font_count.Min}-{AS[this.state.user.category].Font_count.Max}</b> fonts. Your store has <b>{font_number}</b> fonts.
                              </p>

                              <Bar 
                                data={barChartData17}
                                options={barChartOptions12}
                              />
                            </Accordion.Content>
                        </Accordion>
                        </>
                            }
                            <br/>
                            <br/>

                            </div>
                      </Grid.Column>

                      <Grid.Column>
                        <div class="ui raised segment" style={{backgroundColor:'white', borderRadius:5, marginLeft:0, marginRight:20, marginTop: 0}}>
                          <br/>
      
                            <img src={process.env.PUBLIC_URL + '/layout.png'} className='image_icon_steps' alt='layout'/>
                            <span className="prompt" style={{marginLeft:10, fontWeight:'bold'}}>First Impression</span>
        
                            <br/>
                            <br/>
                            
                            {!this.state.user.paid
                            ?<a href="/as_example" target="_blank"><Button content='Standard' basic style={{textAlign:'center'}}>Example</Button></a>
                            :
                            <>
                            <Accordion styled style={{width:'100%', marginLeft:'0%', marginBottom:30, marginTop:20, backgroundColor:'#F7F7F7'}}>
                            
                            {/* First screen 美观质量部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={4}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                            >
                                {
                                  first_screen_aesthetic_score >= AS[category].Image_aesthetic_first.Min
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> First screen page aesthetic quality
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex5 === 4}>
                              <p style={{color: '#696969', textAlign:'left'}}>The aesthetics of the first image that your customers see plays a critical role in forming their first impression on your product, brand and all.</p>
                              <div class="ui raised segment" style={{padding:20}}>
                                  <p style={{fontWeight:'bold'}}>Actionable strategies</p>

                                  {first_screen_aesthetic_score >= AS[category].Image_aesthetic_first.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a> {AS[category].Image_aesthetic_first.AS_in_range}</a>
                                    </p> 
                                : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a> {AS[category].Image_aesthetic_first.AS_below_min}</a>
                                    </p>
                                  } 
                                  <img src={first_screen_url} width='100%' style={{paddingBottom:'10px'}} alt='first_screen'/>
                              </div>


                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's website first impression page has at least <b>"good" (above 5.5)</b> aesthetic rating.
                              </p>
                                <Bar 
                                      data={barChartData15}
                                      options={barChartOptions14}
                                    />

                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We also studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's website first impression page has at least <b>"good (above 5.5)"</b> aesthetic rating. The aesthetic score of your first screen page is <b>{first_screen_aesthetic_score.toFixed(1)}</b>.
                              </p>
                                <Bar 
                                      data={barChartData16}
                                      options={barChartOptions14}
                                    />

                            </Accordion.Content>

                            {/* First screen effectiveness 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={0}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left', textAlign:'left'}}
                            >

                                {
                                  this.state.first_page_effective
                                  ? <Icon name='checkmark' style={{color:'#329932'}}/>
                                  : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }

                                <Icon name='dropdown' /> Image effectiveness on the first screen page
                            </Accordion.Title>
                            <Accordion.Content active={this.state.activeIndex5 === 0}>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.first_page_effective
                                  ? <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS[category].Image_effectiveness_first.AS_in_range}</a>
                                    </p>
                                  : <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:'bold'}}>{AS[category].Image_effectiveness_first.AS_below_min}</a>
                                    </p>
                                }
                                <img src={first_object_url} width='100%' style={{paddingBottom:'10px'}} alt='first_screen'/>
                              </div>
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We studied hundreds of high performing e-commerce sellers of all size and found out that <b>95%</b> of a top e-commerce store's website first impression page displays their store products.
                            </p>
                            <Doughnut
                              height="150vh"
                              data={doughnutChartData}
                              options={doughnutChartOptions}
                          />
                            <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                            We studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that <b>{AS[this.state.user.category].Image_effectiveness_first.Ratio}%</b> of e-commerce store's website first impression page of this category display their products.
                            </p>
                            <Doughnut
                              height="150vh"
                              data={doughnutChartData2}
                              options={doughnutChartOptions}
                          />
                            </Accordion.Content>

                            {/* 首页 Text count 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={2}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                            >
                                {
                                  text_count_front<AS[category].Text_count_first.Min
                                  ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  : text_count_front<=AS[category].Text_count_first.Max
                                    ?<Icon name='checkmark' style={{color:'#329932'}}/>
                                    : <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                }
                                <Icon name='dropdown' /> Text count on the first screen
                            </Accordion.Title>

                            <Accordion.Content active={this.state.activeIndex5 === 2}>

                              <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  text_count_front<AS[category].Text_count_first.Min
                                  ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                      <a>{AS[category].Text_count_first.AS_below_min}</a>
                                    </p>
                                  : text_count_front<=AS[category].Text_count_first.Max
                                    ? <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Text_count_first.AS_in_range}</a>
                                      </p>
                                    : <p style={{textAlign:'left', fontWeight:'bold'}}>
                                        <a>{AS[category].Text_count_first.AS_above_max}</a>
                                      </p>
                                }
                              </div>
                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied hundreds of high performing e-commerce sellers of all size and found out that a top e-commerce store's website first impression page usually contains <b>below 100</b> words
                              </p>
                              <Bar 
                                  data={barChartData13}
                                  options={barChartOptions13}
                                />
                              <p style={{color: '#696969', width:'90%', marginLeft:'5%', textAlign:'left'}}>
                              We studied dozens of high performing e-commerce sellers of all size in <b>{this.state.user.category}</b> category, and found out that e-commerce store's website first impression page of <b>{this.state.user.category}</b> category usually contains <b>{AS[this.state.user.category].Text_count_first.Min}-{AS[this.state.user.category].Text_count_first.Max}</b> words. Your first screen page includes <b>{text_count_front}</b> words.
                              </p>
                              <Bar 
                                  data={barChartData14}
                                  options={barChartOptions13}
                                />
                            </Accordion.Content>

                            
                            {/* 首页 Text effectiveness 部分 */}
                            <Accordion.Title
                                active={this.state.activeIndex5 === 0}
                                index={3}
                                onClick={this.handleClick5}
                                style={{color:'#1b1b1c', textAlign:'left'}}
                            >
         
                                {
                                  this.state.text_effective_ratio_front<AS.All_graphs.Text_effectiveness_first.Min
                                  ? <Icon name='attention' style={{color:'#FF4c4c'}}/>
                                  : <Icon name='checkmark' style={{color:'#329932'}}/>
                                }

                                <Icon name='dropdown' />Text effectiveness on the first screen
                            </Accordion.Title>
                            
                            <Accordion.Content active={this.state.activeIndex5 === 3}>
                            <div class="ui raised segment" style={{padding:20}}>
                                <p style={{fontWeight:'bold'}}>Actionable strategies</p>
                                {
                                  this.state.text_effective_ratio_front<AS.All_graphs.Text_effectiveness_first.Min
                                  ? <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:"bold"}}>{AS.All_graphs.Text_effectiveness_first.AS_below_min}</a>
                                    </p>
                                  : <p style={{color: '#696969', textAlign:'left'}}>
                                      <a style={{fontWeight:"bold"}}>{AS.All_graphs.Text_effectiveness_first.AS_in_range}</a>
                                    </p>
                                }
                                {text_no_effect_front_list}
                              </div>
                            </Accordion.Content>

                            </Accordion>
                            </>
                            }
                            <br/>
                            <br/>

                        </div>
                      </Grid.Column>

                      <Grid.Column>
                      </Grid.Column>

                    </Grid.Row>
                  </Grid>
                </div>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

AS_example.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, updateUser }
)(AS_example);

import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import base64 from 'base-64';
import { BASE_URL } from './Keys';
import axios from 'axios';
import { compareSync } from 'bcryptjs';




class Index extends Component {

  state = {
    isAuth: false,
    passedProps: this.props.location.regdata,
    data: this.props.location.data,
    cookie: Cookies.get('SSID'),
    isLoading: true,
    showData: [],
  }


  componentDidMount() {
    let config = {
      headers: {
        authToken: Cookies.get('SSID'),
      }
    }
    if(Cookies.get('oauth2') && Cookies.get('SSID') && Cookies.get('NETID') && Cookies.get('APISID')){
      this.setState({
        isAuth: true,
      })
      let userType = base64.decode(Cookies.get('NETID'));
      let userId = base64.decode(Cookies.get('oauth2'));
      let userMobile = base64.decode(Cookies.get('APISID'));
      if(userType === 'student'){
        axios.post(`${BASE_URL}/api/v1/institute/getAllClassesStudent/`, {
          studentId: userId
        }, config)
        .then(res => {
          this.setState({
            isLoading: false,
            showData: res.data["data"]
          })
        })
        .catch(err => console.log(err))
      }
    }
  else if(this.state.data){
    console.log('HI from data')
    const userType = base64.encode(`${this.state.data.userData.type}`)
    const userName = base64.encode(`${this.state.data.userData.name}`)
    const userId = base64.encode(`${this.state.data.userData.userId}`)
    console.log(userType)
    console.log(userName)
    console.log(userId)
    Cookies.set('NETID', userType, {expires: new Date(Date.now()+2592000)})
    Cookies.set('srftoken', userName, {expires: new Date(Date.now()+2592000)})
    Cookies.set('oauth2', userId, {expires: new Date(Date.now()+2592000)})
    if(base64.decode(userType) === 'student'){
      axios.post(`${BASE_URL}/api/v1/institute/getAllClassesStudent/`, {
        studentId: base64.decode(userId)
      }, config)
      .then(res => {
        this.setState({
          isLoading: false,
          showData: res.data["data"]
        })
      })
      .catch(err => console.log(err))
    }
    this.setState({
      isAuth: true,
    })
  }else if(this.state.passedProps){
    console.log('HI from passedprops')
    const userType = base64.encode(`${this.state.passedProps.userName}`)
    const userName = base64.encode(`${this.state.passedProps.userType}`)
    const userId = base64.encode(`${this.state.passedProps.userEmail}`)
    const userMobile = base64.encode(`${this.state.passedProps.userMobile}`)
    console.log(userType)
    console.log(userName)
    console.log(userId)
    Cookies.set('NETID', userType, {expires: new Date(Date.now()+2592000)})
    Cookies.set('srftoken', userName, {expires: new Date(Date.now()+2592000)})
    Cookies.set('oauth2', userId, {expires: new Date(Date.now()+2592000)})
    Cookies.set('APISID', userMobile, {expires: new Date(Date.now()+2592000)})
    if(base64.decode(userType) === 'student'){
      axios.post(`${BASE_URL}/api/v1/institute/getAllClassesStudent/`, {
        studentId: base64.decode(userId)
      }, config)
      .then(res => {
        this.setState({
          isLoading: false,
          showData: res.data["data"]
        })
      })
      .catch(err => console.log(err))
    }
    this.setState({
      isAuth: true,
    })
  }
  else{
    console.log("nodata")
  }
 }

  handliclick = () => {
    console.log(this.state.showData)
  }



  render() {
    const items = this.state.showData.map((showData, key) =>
    <p key={showData.classid}>{showData.Institute}</p>
    );

      if(this.state.isAuth){
        return (
          <div>
          {this.state.isLoading ?
          <h1>Loading.....</h1>
          :
          <div>
          <h3 onClick={this.handliclick}>
            {items}
          </h3>
          </div>
          }
          </div>
        )
      }else{
          return (
            <h1>Sorry not allowed please <Link to={{pathname: "/"}}>log in</Link> to continue</h1>
          )
      }
  }
}

export default Index

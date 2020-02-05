import React, { Component } from 'react'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';


class Profile extends Component {

    state = {
        passedProps: null,
        data: this.props.location.data,
        cookie: Cookies.get('SSID'),
        isAuth: false,
      }
    
    componentDidMount() {
      this.setState({
        passedProps: this.props.location.state,
    })
    if(Cookies.get('SSID') && Cookies.get('oauth2')){
      this.setState({
        isAuth: true,
      })
    }
   }

    handliclick = () => {
        console.log(this.state)
        console.log(Cookies.get('SSID'))
    }

  render() {
    console.log(Cookies.get('oauth2'))
      if(this.state.isAuth){
        return (
            <h1 onClick={this.handliclick}>this is profile page</h1>
        )
      }else{
        console.log(this.state)
          return(
            <h1>Sorry not allowed please <Link to={{pathname: "/"}}>log in</Link> to continue</h1>
          )
        }
  }
}

export default Profile

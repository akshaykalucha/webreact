import React, { Component } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from './Keys';
import "../styles/Index.css";



export class Register extends Component {
    state = {
        passedProps: this.props.location.state,
        name: '',
        email: '',
        type: '',
        isRegistered: false,
        isLoading: false,
    }

    globalvar = {
        userName: '',
        userEmail: '',
        userType: '',
        userMobile: '',
        userId: '',
        
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submitRegistrationFOrm = (event) => {
        this.setState({
            isLoading: true,
        })
        event.preventDefault();
        this.globalvar.userMobile = this.state.passedProps.userMobileNum
        this.globalvar.userEmail = this.state.email
        this.globalvar.userName = this.state.name
        this.globalvar.userType = this.state.type
        this.setState({
            name: '',
            email: '',
            type: ''
        })
        let config = {
            headers: {
              SECRETKEY: Cookies.get('SSID'),
            }
          }
        axios.post(`${BASE_URL}/api/v1/account/registration/`, this.globalvar, config)
        .then(res => {
            console.log(res)
            if(res["data"]["Type"] === "Success"){
                this.globalvar.userId = res.data.data.userId
                console.log(this.globalvar)
                this.setState({
                    isRegistered: true,
                    isLoading: false,
                })
            }else{
                console.log("Error")
            }
        })
        .catch(err => {
            this.setState({
                isLoading: false,
            })
            console.log(err.response)
        })

    }

    render() {
        if(this.state.passedProps){
            return (
                <div>
                {this.state.isLoading ?
                    <h1>Loading...</h1>
                :
                <div>
                {!this.state.isRegistered ?
                    <form onSubmit={this.submitRegistrationFOrm}>
                        <input type="text" onChange={this.handleChange} name="name" value={this.state.name} placeholder="Enter Name..."></input>
                        <input type="email" onChange={this.handleChange} name="email" value={this.state.email} placeholder="Enter Email..."></input><br/>
                        <input type="text" onChange={this.handleChange} name="type" value={this.state.type} placeholder="Enter Type..."></input>
                            <button>SIGN UP</button>
                    </form>
                    :
                    <Link to={{ pathname: "/index", regdata: this.globalvar }}>Next</Link>
                    }
                </div>
                }
                </div>
            )
        }else{
            return(
                <h1>Sorry not allowed please <Link to={{pathname: "/"}}>log in</Link> to continue</h1>
            )
        }
    }
}

export default Register

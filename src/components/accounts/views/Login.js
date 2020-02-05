import React, { Component } from 'react'
import axios from 'axios';
import{
    Link,
    Redirect,
} from 'react-router-dom';
import base64 from 'base-64'
import Cookies from 'js-cookie';
import "../styles/Main.css";
import { BASE_URL } from './Keys';


export class Form extends Component {
    state = {
        userMobile: "",
        isSuccess: 0,
        otp: '',
        otpSuccess: null,
        isAuth: false,
        redirect: false,
        isLoading: false,
    }

    globalvar = {
        userMobileNum: '',
        otpnum: '',
        otpSuccess: null,
        isAuth: false
    }

    existingData = {
        userData: null,
        token: null
    }

    HandleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }


    HandleSubmit = (event) => {
        console.log(BASE_URL)
        this.setState({
            isLoading: true,
        })
        event.preventDefault();
        const mobileLength = this.state.userMobile.length
        if(mobileLength === 0 ){
            alert('Please input a ten digit mobile number')
        }else{
            const k = {
                userMobile: this.state.userMobile
            }
            this.globalvar.userMobileNum = k.userMobile
            this.setState({
                userMobile: ''
            })
            axios.post(`${BASE_URL}/api/v1/account/login/`, k)
            .then(res => {
                const resType = res.data.Type
                console.log(res.data)
                if(resType === "Success"){
                    this.setState({
                        isSuccess: 1,
                        isLoading: false,
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                })
                console.log(err)
            })
        }
    }


    HandleOTPSubmit = (event) => {
        this.setState({
            isLoading: true,
        })
        event.preventDefault();
        const otplen = this.state.otp.length
        if(otplen === 0){
            alert('Please enter correct otp')
        }else{
            this.globalvar.otpnum = this.state.otp
            this.setState({
                otp: ''
            })
            const OTPcheck = {
                userMobile: this.globalvar.userMobileNum,
                otp: this.globalvar.otpnum
            }
            axios.post(`${BASE_URL}/api/v1/account/OTPCheck/`, OTPcheck)
            .then(res => {
                this.setState({
                    isLoading: false,
                })
                console.log(res)
                if(res.data.user === "ExistingUser"){
                    this.setState({
                        isLoading: false,
                    })
                    const Data = res["data"]["user-data"]
                    const Token = res["data"]["token"]
                    this.existingData.userData = Data
                    Cookies.set('SSID', Token, {expires: new Date(Date.now()+2592000)})
                    this.existingData.token = Token
                    const mobum = base64.encode(this.globalvar.userMobileNum)
                    Cookies.set('APISID', mobum, {expires: new Date(Date.now()+2592000)})
                    this.globalvar.isAuth = this.state.isAuth
                    this.setState({
                        isAuth: true,
                        redirect: true
                    })
                }
                else if(res.data.Type === "Success"){
                    this.setState({
                        isLoading: false,
                    })
                    alert('otp verified successfully')
                    this.setState({
                        otpSuccess: true,
                        isAuth: true
                    })
                    const Token = res["data"]["token"]
                    Cookies.set('SSID', Token, {expires: new Date(Date.now()+2592000)})
                    this.globalvar.otpSuccess = this.state.otpSuccess
                    this.globalvar.isAuth = this.state.isAuth
                    console.log(this.state)
                    console.log(this.globalvar)
                    console.log('-----isExistingser-------')
                    console.log(res.data.user)
                }else{
                    this.setState({
                        otpSuccess:0,
                        isLoading: false
                    })
                    alert('otp verification unsuccessfull, please try again')
                }
            }).catch(err => {
                this.setState({
                    isLoading: false,
                })
                alert('wrong OTP please try again')
            })
        }
    }

    render() {
        if(Cookies.get('SSID') && Cookies.get('oauth2') && Cookies.get('NETID') && Cookies.get('APISID')){
    
            return <Redirect to={{ pathname:'/index' }}/>;
        }
        if(this.state.redirect){
            return <Redirect to={{ pathname:'/index', state: this.globalvar, data: this.existingData }}/>;
        }
        if(this.state.isSuccess === 0){
            return (
                <div>
                    {this.state.isLoading ?
                        <h1>Loading...</h1>
                        :
                        <div>
                        <div className="container">
                            <div className="wrap-login100">
                                <div className="form">
                                    <form className="mobileform" onSubmit={this.HandleSubmit}>
                                        <input type="text" pattern="[789][0-9]{9}" onChange={this.HandleChange} name="userMobile" value={this.state.userMobile} required />
                                        <label for="userMobile" className="label-name">
                                            <span className="content-name">Mobile No.</span>
                                        </label>                                    
                                    </form><br></br>
                                    <button className="sendbutton">GET OTP</button>
                                </div>                            
                            </div>
                        </div>
                    </div>
                    }
                </div>


        )
        }else if(this.state.isSuccess === 1){
            return(
                <div>
                {this.state.isLoading ?
                <h1>Loading...</h1>
                :
                <div className="container">
                    <div className="wrap-login100">
                        <div className="otpdiv">
                            <form className="otpform" onSubmit={this.HandleOTPSubmit}>
                                <input type="text" pattern="[0-9]{4}" onChange={this.HandleChange} name="otp" value={this.state.otp} placeholder="Enter OTP..."></input>
                                {!this.state.otpSuccess ?
                                <button className="otpbutton">Verify OTP</button> : 
                                <button className="otpbutton">
                                    <Link to={{ pathname: "/register", state: this.globalvar }}>Next</Link>
                                </button>
                                }
                            </form>
                        </div>
                    </div> 
                </div>
                }
                </div>
            )
        }
    }
}

export default Form

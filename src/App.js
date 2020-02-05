// import './App.css';
import React, { Component } from 'react';
import GLOBAL_ROUTE from './components/accounts/urls/GLOBAL_ROUTE';
import { BrowserRouter as Router } from 'react-router-dom'

export class App extends Component {
  render() {
    return (
      <Router>
        <GLOBAL_ROUTE />
      </Router>
    )
  }
}

export default App


/* global google */

import React, { Component } from 'react'

import './bootswatch.css'

// import './App.css'

import Geosuggest from './Geosuggest/Geosuggest.jsx';

import { Navbar, NavItem, Nav, Grid, Row, Col } from "react-bootstrap"

const PLACES = [
  { name: "Boston", zip: "02108" },
  { name: "Los Angeles", zip: "90014" },
  { name: "New York", zip: "10023" },
  { name: "Honolulu", zip: "96813" }
]

class WeatherDisplay extends Component {
  constructor() {
    super()
    this.state = {
      weatherData: null,
      lastLat: null,
      lastLong: null
    }
  }

  componentDidMount() {
    const zip = this.props.zip
    const lat = this.props.lat
    const lon = this.props.lon
    const URL = "http://api.openweathermap.org/data/2.5/weather?zip=" +
      zip + ",us" +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial"
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json })
    })
    // const URL = "api.openweathermap.org/data/2.5/weather?lat=" + lat +
    // "&lon=" + lon +
    // "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial"
    // fetch(URL).then(res => res.json()).then(json => {
    //   this.setState({ weatherData: json })
    // })
    this.watchID = navigator.geolocation.watchPosition((position) => {
    console.log(position)
      this.setState({
        // If there are no new values set the current ones
        lastLat: position.coords.latitude || this.state.lastLat,
        lastLong: position.coords.longitude || this.state.lastLong
      })
    })
  }
  render() {
    const weatherData = this.state.weatherData
    if (!weatherData) return <div>Loading</div>
    const weather = weatherData.weather[0]
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png"
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description} />
        </h1>
        <p>Current: {weatherData.main.temp}°</p>
        <p>High: {weatherData.main.temp_max}°</p>
        <p>Low: {weatherData.main.temp_min}°</p>
        <p>Wind Speed: {weatherData.wind.speed} mi/hr</p>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      activePlace: 0
    }
  }

  //
  //  When a suggest got selected
  //  @param  {Object} suggest The suggest
  //
  onSuggestSelect(suggest) {
    console.log(suggest); // eslint-disable-line
  }

  render() {
    const fixtures = [
      {label: 'New York', location: {lat: 40.7033127, lng: -73.979681}},
      {label: 'Rio', location: {lat: -22.066452, lng: -42.9232368}},
      {label: 'Tokyo', location: {lat: 35.673343, lng: 139.710388}}
    ]
    const activePlace = this.state.activePlace
    return (
      <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <span>Sanfa</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
        <Grid>
          <Row>
            <Col md={4} sm={4}>
              <h3>Select a city</h3>
              <div>
              <Geosuggest
              onSuggestSelect={this.onSuggestSelect}
              fixtures={fixtures}
              location={new google.maps.LatLng(53.558572, 9.9278215)}
              radius="20"
              / >
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={4}>
              <Nav
                bsStyle="pills"
                stacked
                activeKey={activePlace}
                onClick={index => {
                  this.setState({ activePlace: index })
                }} >
                {<NavItem><h3>Curent Location</h3></NavItem>}
              </Nav>
            </Col>
            <Col md={8} sm={8}>
              <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App

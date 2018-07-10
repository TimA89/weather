import React, { Component } from 'react'
import './App.css'
// import "bootstrap/dist/css/bootstrap.css"
import './bootswatch.css'

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
      weatherData: null
    }
  }

  componentDidMount() {
    const zip = this.props.zip
    const URL = "http://api.openweathermap.org/data/2.5/weather?zip=" +
      zip + ",us" +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial"
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json })
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

  render() {
    const activePlace = this.state.activePlace
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Your Weather
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Row>
            <Col md={4} sm={4}>
              <h3>Select a city</h3>
              <Nav
                bsStyle="pills"
                stacked
                activeKey={activePlace}
                onSelect={index => {
                  this.setState({ activePlace: index })
                }} >
                {PLACES.map((place, index) => (
                  <NavItem key={index} eventKey={index}>{place.name}</NavItem>
                ))}
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

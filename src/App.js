import React, { Component } from 'react'
// import './App.css'
// import "bootstrap/dist/css/bootstrap.css"
import './bootswatch.css'

import { Navbar, NavItem, Nav, Grid, Row, Col, NavDropdown, MenuItem, FormGroup, FormControl, Button } from "react-bootstrap"

const PLACES = [
  { name: "Boston", zip: "02108" },
  { name: "Los Angeles", zip: "90014" },
  { name: "New York", zip: "10023" },
  { name: "Honolulu", zip: "96813" }
]

const divStyle = {
  float: 'right'
}

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
    const URL = "http://api.openweathermap.org/data/2.5/weather?zip=" +
      zip + ",us" +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial"
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json })
    })
    this.watchID = navigator.geolocation.watchPosition((position) => {
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

  render() {
    const activePlace = this.state.activePlace
    return (
      <div>
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand style={divStyle}>
            <span>React-Bootstrap</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
      </Navbar>
        <Grid>
          <Row>
            <Col md={4} sm={4}>
              <h3>Select a city</h3>
              <Navbar.Form pullLeft>
                <FormGroup>
                  <FormControl type="text" placeholder="Search" />
                // </FormGroup>{' '}
                <Button type="submit">Submit</Button>
              </Navbar.Form>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={4}>
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

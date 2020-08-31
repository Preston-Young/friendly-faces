import React, { Component } from 'react';
import './App.css';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Particles from 'react-particles-js';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';

const particlesOptions = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState( {user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // Calculate bounds of face
  calculateFaceLocation = (data) => {
    const faceBounds = data.outputs[0].data.regions[0].region_info.bounding_box;
    const inputImage = document.getElementById('input-image');
    const width = Number(inputImage.width);
    const height = Number(inputImage.height);
    return {
      leftCol: faceBounds.left_col*width,
      topRow: faceBounds.top_row*height,
      rightCol: width - (faceBounds.right_col*width),
      bottomRow: height - (faceBounds.bottom_row*height)
    }
  }

  // Drawing box around face
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // Image URL input
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  // Submitting image -> detect faces -> draw box -> increment user entry count by 1
  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count} )); // only update entries, don't create new user
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(console.log);
  }

  // Set route to certain page
  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
      this.setState({imageUrl: ""});
    }
    this.setState({route: route});
  }

  render() {
    const {imageUrl, box, route, isSignedIn} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
                params={particlesOptions}
              />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank user={this.state.user} />
              <ImageLinkForm onInputChange={this.onInputChange} 
              onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
          }
      </div>
    );
  }
}

export default App;

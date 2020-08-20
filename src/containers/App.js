import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
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

const app = new Clarifai.App({
  apiKey: 'f1ad064465ec4cacaf547ce77ddc9b07'
 });

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

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

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then( response => this.displayFaceBox(this.calculateFaceLocation(response)) )
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
                params={particlesOptions}
              />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;

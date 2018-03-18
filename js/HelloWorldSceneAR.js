'use strict';

import React, { Component } from 'react';
import {StyleSheet, requireNativeComponent, findNodeHandle,
  Platform,
  NativeModules,
  ViewPropTypes} from 'react-native';
import {
  ViroARScene,
  ViroText,
} from 'react-viro';

const CameraManager: Object = NativeModules.RNCameraManager ||
  NativeModules.RNCameraModule || {
    stubbed: true,
    Type: {
      back: 1,
    },
    AutoFocus: {
      on: 1,
    },
    FlashMode: {
      off: 1,
    },
    WhiteBalance: {},
    BarCodeType: {},
    FaceDetection: {
      fast: 1,
      Mode: {},
      Landmarks: {
        none: 0,
      },
      Classifications: {
        none: 0,
      },
    },
};

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      geo_lat: null,
      get_lon: null,
      geo_error: null
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          text: "Lat: " + position.coords.latitude + ", Lon: " + position.coords.longitude,
          geo_lat: position.coords.latitude,
          geo_lon: position.coords.longitude,
          geo_error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <ViroARScene onTrackingInitialized={this._onInitialized} >
        <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
      </ViroARScene>
    );
  }

  _onInitialized() {
    this.setState({
      text : "Hello World!"
    });
  }

  async takePictureAsync(options?: PictureOptions) {
    if (!options) {
      options = {};
    }
    if (!options.quality) {
      options.quality = 1;
    }
    return await CameraManager.takePicture(options, 1);
  }

}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldSceneAR;

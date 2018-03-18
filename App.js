/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  Slider
} from 'react-native';

import {
  ViroSceneNavigator,
  ViroARSceneNavigator
} from 'react-viro';

import { RNCamera } from 'react-native-camera';
import { captureScreen} from 'react-native-view-shot';
import BackgroundTimer from 'react-native-background-timer';

/*
 TODO: Insert your API key below
 */
var sharedProps = {
  apiKey:"77538844-AEC9-4DEB-87DC-42FC549ED399",
}

// Sets the default scene you want for AR and VR
var InitialARScene = require('./js/HelloWorldSceneAR');
var InitialVRScene = require('./js/HelloWorldScene');

var UNSET = "UNSET";
var VR_NAVIGATOR_TYPE = "VR";
var AR_NAVIGATOR_TYPE = "AR";

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = AR_NAVIGATOR_TYPE;

export default class ViroSample extends Component {
  constructor() {
    super();

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps,
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      photoId: 1,
      showGallery: false,
      photos: [],
      faces: []
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getVRNavigator = this._getVRNavigator.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(this);
    this._exitViro = this._exitViro.bind(this);
  }

  componentDidMount() {
    // Start a timer that runs once after X milliseconds
    this.timeoutId = BackgroundTimer.setInterval(() => {
      console.log('tac');
      if(this.sceneNavigator) {
        console.log(this.sceneNavigator.takeScreenshot)
        this.sceneNavigator.takeScreenshot("test.jpg", false)
        .then((success, url, error) => {
            console.log(sucess);
            console.log(url);
            console.log(error);
        });
      }

      /*
          var img_json = JSON.stringify({ "image": uri })
          fetch('https://sixhackathon2018-server.azurewebsites.net/image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': img_json.length
              },
              body: img_json
            })
            .then((response) => response.json())*/
    }, 5000);

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
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
    BackgroundTimer.clearTimeout(this.timeoutId);
  }

  takePicture = async function() {
      RNCamera.takePictureAsync().then(data => {
        console.log('data: ', data);
      });
  };

  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == VR_NAVIGATOR_TYPE) {
      return this.renderCamera();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    }
  }

  // Presents the user with a choice of an AR or VR experience
  _getExperienceSelector() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >

          <Text style={localStyles.titleText}>
            Choose your desired experience:
          </Text>

          <TouchableHighlight style={localStyles.buttons}
            onPress={this._getExperienceButtonOnPress(AR_NAVIGATOR_TYPE)}
            underlayColor={'#68a0ff'} >

            <Text style={localStyles.buttonText}>AR</Text>
          </TouchableHighlight>

          <TouchableHighlight style={localStyles.buttons}
            onPress={this._getExperienceButtonOnPress(VR_NAVIGATOR_TYPE)}
            underlayColor={'#68a0ff'} >

            <Text style={localStyles.buttonText}>VR</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    this.sceneNavigator = <ViroARSceneNavigator
     {...this.state.sharedProps}
      initialScene={{scene: InitialARScene}} />
    return this.sceneNavigator
  }
  
  // Returns the ViroSceneNavigator which will start the VR experience
  _getVRNavigator() {
    return (
      <ViroSceneNavigator {...this.state.sharedProps}
        initialScene={{scene: InitialVRScene}} onExitViro={this._exitViro}/>
    );
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}

        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        focusDepth={this.state.depth}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
      />
    );
  }


  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _getExperienceButtonOnPress(navigatorType) {
    return () => {
      this.setState({
        navigatorType : navigatorType
      })
    }
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType : UNSET
    })
  }
}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

module.exports = ViroSample

import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { AuthSession } from 'expo';
import axios from 'axios';
import { Platform } from '@unimodules/core';
import Dialog from 'react-native-popup-dialog';

export default class App extends React.Component {
  state = {
    CameraPermission: null,
    answer: null,
    data: null,
    uri: null,
    open: false,
    request: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ CameraPermission: status === 'granted' });
  }

  picture = async () => {
    const picture = await this.camera.takePictureAsync(
      (params = { base64: true })
    );
    base64 = picture.base64
    console.log("picture")
    this.setState({uri: picture.uri, request: true})
  };

  flask = async () => {
    axios.post("https://eyesight-backend.herokuapp.com/", {"base_64": base64})
    .then(res => {
      this.setState({
        answer: res.data.answer, 
        data: res.data.data, 
        request: false
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    var base64 = null
    let uri = this.state.uri
    if (this.state.request) {
      this.flask()
    }
    const { CameraPermission } = this.state;
    if (CameraPermission === null) {
      return <View />;
    } else if (CameraPermission === false) {
      alert(
        'Access to camera is required for this app. Please go to settings and enable access.'
      );
      return <View />;
    } else {
      return (
        <View style={styles.container}>
          {this.state.uri != null ? (
            <View style={styles.view} key={uri}>
              <Image style={{ flex: 1}} source={{ uri }} />
              <Dialog visible={true}>
                <View style={{padding: 40}}>
                  {this.state.request? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    <Text>{this.state.answer}</Text>
                  )}
                </View>
              </Dialog>
            </View>
          ) : (
            <Camera
              ref={ref => {
                this.camera = ref;
              }}
            >
              <View style={styles.view}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.picture.bind(this)}
                >
                  <Text style={styles.text}>IDENTIFY</Text>
                </TouchableOpacity>
              </View>
            </Camera>
          )}
        </View>
      );
    }
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  button: {
    fontFamily: 'Arial',
    height: 80,
    width: 80,
    justifyContent: 'center',
    borderWidth: 5,
    borderRadius: 200,
    borderRightColor: 'cyan',
    borderLeftColor: 'darkblue',
    borderTopColor: 'orange',
    borderBottomColor: 'darkgreen',
    alignSelf: 'flex-end',
    marginBottom: 28
  },
  text: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  }
};

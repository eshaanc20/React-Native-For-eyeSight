import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Modal} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { AuthSession } from 'expo';
import axios from 'axios';
import { Platform } from '@unimodules/core';

export default class App extends React.Component {
  state = {
    CameraPermission: null,
    answer: null,
    data: null,
    uri: null,
    open: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ CameraPermission: status === 'granted' });
  }

  picture = async () => {
    const picture = await this.camera.takePictureAsync(
      (params = { base64: true })
    );
    axios.post("https://eyesight-backend.herokuapp.com/", {"base_64": picture.base64})
      .then(res => {
        this.setState({
          answer: res.data.answer, 
          data: res.data.data, 
          uri: picture.uri
        })
      })
      .catch(err => {
        console.log(err)
      })
  };

  render() {
    let uri = this.state.uri
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
          {this.state.answer != null ? (
            <View style={styles.view} key={uri}>
              <Image style={{ width: 250, height: 400 }} source={{ uri }} />
              <Modal animationType="slide" visible={true}>
                <Text>{this.state.answer}</Text>
              </Modal>
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

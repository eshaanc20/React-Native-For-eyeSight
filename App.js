import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { AuthSession } from 'expo';
import axios from 'axios';
import { Platform } from '@unimodules/core';
import Dialog, { DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import PieChart from 'react-native-pie'
import Chart from './Components/Chart';
import LinearGradient from 'react-native-linear-gradient';

export default class App extends React.Component {
  state = {
    CameraPermission: null,
    answer: ['green'],
    uri: '',
    open: false,
    reset: false,
    request: false,
    colors: null
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
    this.setState({uri: picture.uri, request: true, open: true})
  };

  flask = async () => {
    axios.post("https://eyesight-backend.herokuapp.com/", {"base_64": base64})
      .then(res => {
        let data = Object.entries(res.data.data)
        data.sort((a, b) => {
          return a[1] - b[1]
        })
        let sum = 0
        var colors = []
        var pixels = []
        data.map(data => {
          if (data[1] < 800) {
            pixels.push(0);
          } else {
            pixels.push(data[1])
            sum += data[1]
          }
          colors.push(data[0])
        })
        let pieChart = []
        pixels.map(pixel => {
          pieChart.push((pixel/sum) * 100)
        })
        var colorsHEX = []
        colors.map(color => {
          switch (color) {
            case "Orange":
              colorsHEX.push("#d66e06")
              break;
            case "Red":
              colorsHEX.push("#d60202")
              break;
            case "Gold":
              colorsHEX.push("#e0b107")
              break;
            case "Yellow":
              colorsHEX.push("#f2e70c")
              break;
            case "Green":
              colorsHEX.push("#4bbd11")
              break;
            case "Teal":
              colorsHEX.push("#11bd95")
              break;
            case "Blue":
              colorsHEX.push("#317eeb")
              break;
            case "Purple":
              colorsHEX.push("#5542d4")
              break;
            case "Pink":
              colorsHEX.push("#d334d9")
              break;
            case "Brown":
              colorsHEX.push("#806161")
              break;
            case "Gray":
              colorsHEX.push("#828282")
              break;
            case "White":
              colorsHEX.push("#f5f5f5")
              break;
            case "Black":
              colorsHEX.push("#212020")
              break;
            case "Cyan":
              colorsHEX.push("#0cc5cf")
              break;
          }
        })
        console.log(res.data.answer)
        this.setState({
          answer: res.data.answer, 
          colors: colorsHEX, 
          pieChart: pieChart,
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
    var backgroundColors = [
      'rgb(106, 57, 171)',
      'rgb(151, 52, 160)',
      'rgb(197, 57, 92)',
      'rgb(231, 166, 73)',
      'rgb(181, 70, 92)'
    ]
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
              {this.state.open == false ?
                <LinearGradient colors={['#4c669f']}>
                  <View style={{alignSelf: 'flex-end', justifyContent: 'center'}}> 
                    <View style={{marginBottom: 250}}>
                      <Text style={{textAlign: 'center', fontSize: 40, fontFamily: 'Arial', fontWeight: '800', marginBottom: 20}}>eyeSight</Text>
                      <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Arial'}}>
                        App helps identify the most dominant color in an image and provides 
                        information about other colors in the image.
                      </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <TouchableOpacity 
                        style={styles.button2}
                        onPress={() => {
                          this.setState({
                            answer: null,
                            uri: null,
                            open: false,
                            reset: false,
                            request: false,
                            colors: null
                          })
                        }}
                      >
                        <Text style={{fontSize: 20, alignSelf: 'center'}}>Start</Text>
                      </TouchableOpacity> 
                    </View>
                  </View>
                </LinearGradient>
                : 
                <Image style={{ flex: 1}} source={{ uri }} />}
              <Dialog 
                visible={this.state.open}
                dialogTitle={<DialogTitle title="Color Analysis"/>}
              >
                <View style={{padding: 40}}>
                  {this.state.request? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    <View>
                      <Chart pieChart={this.state.pieChart} colors={this.state.colors}/>
                      {this.state.answer.map((answer,index) => {
                        return(<Text key={index} style={{fontSize: 24, textAlign: 'center', marginTop: 15}}>{answer}</Text>)
                      })}
                      <View style={{alignItems: 'center', marginTop: 20, borderRadius: 10, backgroundColor: '#189bf2'}}>
                        <TouchableOpacity 
                          onPress={() => this.setState({
                            open: false,
                            reset: true
                          })}
                          >
                          <Text style={{textAlign: 'center', fontSize: 16, padding: 8, color: 'white'}}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
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
  button2: {
    fontFamily: 'Arial',
    height: 60,
    width: 110,
    borderWidth: 5,
    borderRadius: 20,
    borderRightColor: 'cyan',
    borderLeftColor: 'darkblue',
    borderTopColor: 'orange',
    borderBottomColor: 'darkgreen',
    marginBottom: 28,
    justifyContent: 'center',
    borderRadius: 10,
  },
  text: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  }
};
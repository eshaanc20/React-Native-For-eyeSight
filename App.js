import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image, Modal, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { AuthSession } from 'expo';
import axios from 'axios';
import { Platform } from '@unimodules/core';
import Dialog, { DialogFooter, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import PieChart from 'react-native-pie'

export default class App extends React.Component {
  state = {
    CameraPermission: null,
    answer: null,
    uri: null,
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
          pixels.push(data[1])
          sum += data[1]
          colors.push(data[0])
        })
        let pieChart = []
        pixels.map(pixel => {
          pieChart.push((pixel/sum) * 100)
        })
        var colorsHEX = []
        colors.map(color => {
          switch (color) {
            case "Light blue":
              colorsHEX.push("#6BCCF9")
              break;
            case "Orange":
              colorsHEX.push("#DC7633")
              break;
            case "Dark Orange":
              colorsHEX.push("#CB4335")
              break;
            case "Dark Red":
              colorsHEX.push("#C9290F")
              break;
            case "Red":
              colorsHEX.push("#E8280A")
              break;
            case "Gold":
              colorsHEX.push("#DCB000")
              break;
            case "Yellow":
              colorsHEX.push("#F3EC00")
              break;
            case "Light Green":
              colorsHEX.push("#8AE409")
              break;
            case "Green":
              colorsHEX.push("#00C129")
              break;
            case "Teal":
              colorsHEX.push("#26B277")
              break;
            case "Dark Green":
              colorsHEX.push("#007B1A")
              break;
            case "Dark Blue":
              colorsHEX.push("#0050B7")
              break;
            case "Black":
              colorsHEX.push("black")
              break;
            case "White":
              colorsHEX.push("white")
              break;
          }
        })
        let count = 100
        pieChart.map((data, index) => {
          pieChart[index] = (100 - data)/100 * count
          count = count - ((100 - data)/100 * count)
        })
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
                <View style={{alignSelf: 'flex-end', justifyContent: 'center'}}> 
                  <View style={{marginBottom: 250}}>
                    <Text style={{textAlign: 'center', fontSize: 40, fontFamily: 'Arial', fontWeight: '800', marginBottom: 20}}>eyeSight</Text>
                    <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Arial'}}>
                      App helps identify the most dominant color in an image and provides 
                      information about other colors in the image.
                    </Text>
                  </View>
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
                : 
                <Image style={{ flex: 1}} source={{ uri }} />}
              <Dialog 
                visible={this.state.open}
                dialogTitle={<DialogTitle title="Color Analysis"/>}>
                <View style={{padding: 40}}>
                  {this.state.request? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    <View>
                      <PieChart
                        radius={90}
                        series={this.state.pieChart}
                        colors={this.state.colors}
                      />
                      <Text style={{fontSize: 28, textAlign: 'center', marginTop: 20}}>{this.state.answer}</Text>
                      <TouchableOpacity 
                        onPress={() => this.setState({
                          open: false,
                          reset: true
                        })}
                        >
                        <Text>Close</Text>
                      </TouchableOpacity>
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
    margin: 'auto',
    marginBottom: 28,
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  }
};
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';


export default class Add extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      cameraType: 'back',
      mirrorMode: false,
      imageUri: null
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          ratio={'1:1'}
          style={styles.preview}
          type={this.state.cameraType}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          // onGoogleVisionBarcodesDetected={({ barcodes }) => {
          //   console.log(barcodes);
          // }}
        />
        <View style={{flexDirection:'row',justifyContent:'center'}}>
        <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.changeCamera.bind(this)} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SWAP </Text>
        </TouchableOpacity>
        </View>
        {this.state.imageUri && <Image source={{uri:this.state.imageUri}} style={{flex:1}}/>}
        
      </View>
    );
  }
  changeCamera(){
    if(this.state.cameraType==='back'){
      this.setState({
        cameraType: 'front'
      })
    }
    else{
      this.setState({
        cameraType: 'back'
      })
    }
  }
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        imageUri:data.uri
      })
      console.log(data.uri);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    
  },
});
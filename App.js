import React, { useState } from "react";
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, 
        Modal, Image, Platform, PermissionsAndroid } from "react-native";
import { RNCamera } from "react-native-camera";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


export default function App(){
  const [type, setType] = useState(RNCamera.Constants.Type.back);
  const [open, setOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  async function takePicture(camera){
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    setCapturedPhoto(data.uri);
    setOpen(true);

    savePicture(data.uri);
  }

  async function hasAndroidPermission() {
    const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  async function savePicture(data) {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
  
    CameraRoll.save(data, 'photo')
    .then((res) => {
      console.log('SALVO COM SUCESSO: ' + res)
    })
    .catch((err) => {
      console.log('ERROR AO SALVAR: ' + err)
    })
  };

  function changeCam(){
    setType( type === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back );
  }

  function openAlbum(){
    const options = {
      title: 'Selecione uma foto',
      chooseFromLibraryButtonTitle: 'Buscar uma foto do album..',
      noData: true,
      mediaType: 'photo'
    }
    const ImagePicker = require('react-native-image-picker');

    ImagePicker.launchImageLibrary(options, (response) => {

      if(response.didCancel){
        console.log('IMAGE CANCELADO...');
      }else if(response.error){
        console.log('ERROR AO CARREGAR: '+ response.error);
      }else{
        setCapturedPhoto(response.uri);
        setOpen(true);
      }
       
    })

  }

  return(
    <View style={styles.container}>
      <StatusBar hidden={true} />
      
      <RNCamera
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permissão para usar a câmera',
          message: 'Nós precisamos usar sua câmera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancelar'  
        }}
      >
        {({camera, status, recordAudioPermissionStatus}) => {
          if(status !== 'READY') return <View/>;
            return(
              <View style={{marginBottom: 35, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}
              >
                <TouchableOpacity  
                  onPress={() => takePicture(camera)}
                  style={styles.capture}
                >
                  <Text style={{ color: '#121212', fontSize: 15 }}>Tirar foto</Text>
                </TouchableOpacity>

                <TouchableOpacity  
                  onPress={openAlbum}
                  style={styles.capture}
                >
                  <Text style={{ color: '#121212', fontSize: 15 }}>Album</Text>
                </TouchableOpacity>

              </View>
            )
        }}

      </RNCamera>

      <View style={styles.camPosition}>
        <TouchableOpacity
          onPress={changeCam}
        >
          <Text style={{ color: '#121212', fontSize: 15 }} >Trocar</Text>
        </TouchableOpacity>
      </View>

      { capturedPhoto &&
        
        <Modal
          animationType="slide" 
          transparent={false} 
          visible={open}
        >
  
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20,}}>

           <Image
              resizeMode="contain"
              style={{width: 350, height: 550, borderRadius: 15}}
              source={{uri: capturedPhoto }}
            />

            <TouchableOpacity style={{margin: 10}} onPress={() => setOpen(false)}>
    
              <Text style={styles.buttonFechar}>Fechar</Text>
    
            </TouchableOpacity>
    
          </View>
  
        </Modal>
        }
      

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
  },
  preview:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture:{
    flex: 0,
    backgroundColor: '#FFF',
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    borderRadius: 5
  },
  buttonFechar:{
    fontSize: 20,
    color: '#FFF',
    backgroundColor: '#121212',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  camPosition:{
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    height: 45,
    position: 'absolute',
    right: 25,
    top: 60
  }
})
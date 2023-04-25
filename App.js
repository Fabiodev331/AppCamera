import React from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";

export default function App(){
  return(
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={{ color: '#121212'}}>APPCAM</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    
  }
})
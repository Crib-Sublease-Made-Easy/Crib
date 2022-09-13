import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Button,
  Keyboard
} from 'react-native';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import Modal from "react-native-modal";


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export function DiscoverModalCotent({visible}){

    const [searchModal, setsearchModal] = useState(visible)
    useEffect(()=>{
        setsearchModal(visible)
    },[visible])
    return(
    <Modal style={{margin: 0, padding: 0, height:HEIGHT, width:WIDTH, }} backdropColor='white' 
            backdropOpacity={0.9} isVisible={searchModal} animationIn="fadeIn" animationInTiming={300} animationOut="fadeOut" animationOutTiming={300}>
                <BlurView
                style={{position:'absolute', width:WIDTH, height:HEIGHT}}
              
                blurType="light"
                blurAmount={15}
                reducedTransparencyFallbackColor="white"
                />
                <SafeAreaView>
                
                    <DiscoverModalCotent/>
               
                <Button hitSlop={WIDTH*0.05} onPress={()=> setsearchModal(false)} title="ress" > </Button>
                <Text> Hello</Text>
                </SafeAreaView>
    </Modal>
    )
}
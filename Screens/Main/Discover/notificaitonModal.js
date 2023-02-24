import Modal from "react-native-modal";
import styled from 'styled-components/native';
import React, {useState, useEffect, useRef, useCallback, useContext,} from 'react';

import { Linking, AppState } from "react-native";


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
    Keyboard,
    TextInput,
    Image,
    ActivityIndicator,
    Pressable,
    Animated as RNAnimated,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback
    
  } from 'react-native';

  import Lottie from 'lottie-react-native';

import { HEIGHT, PRIMARYCOLOR, WIDTH } from "../../../sharedUtils";
import OneSignal from "react-native-onesignal";

const ModalView = styled.View`
    width: ${WIDTH*0.8}px
    height: ${HEIGHT*0.55}px;
    background-color: white
    border-radius: 15px
    shadow-offset: 0 0
    shadow-color: black;
    shadow-radius: 20px;
    shadow-opacity: 0.3;
    elevation: 5
    
    padding-vertical: ${HEIGHT*0.02}px
    padding-left:${WIDTH*0.05}px
    flex-direction: column
   
`

const SubtitleText = styled.Text`
  font-size: ${HEIGHT*0.025}px
  font-weight: 500;
  color: black
  margin-top: ${HEIGHT*0.02}px
  width: ${WIDTH*0.7}px
`

const ContextText = styled.Text`
    color: black
    width: ${WIDTH*0.7}px
    margin-top: ${HEIGHT*0.02}px

`

const EnableButton = styled.Pressable`
  width: ${WIDTH*0.5}px
  height: ${HEIGHT*0.065}px
  border-radius: 30px
  background-color: ${PRIMARYCOLOR}
  justify-content: center
  align-items: center
  margin-top: ${HEIGHT*0.02}px 
  align-self: flex-start
`

const EnableButtonText = styled.Text`
  color: white
  font-size: ${HEIGHT*0.017}px
  font-weight: 700;

`


export default function NotificationModal({notifModalVisible, close}){

    const [notifPermission, setNotifPermission] = useState()

    useEffect(()=>{
        getNotificationStatus()
    },[AppState.currentState])

    async function getNotificationStatus(){
        console.log("hello")
        const device = await OneSignal.getDeviceState();
        setNotifPermission(device.isSubscribed)
        if(device.isSubscribed){
            console.log("hello")
            close()
        }
    }

    async function openSettings(){
        await Linking.openSettings();
        close()
    }
    return (
       
            <Modal animationInTiming={700} animationOutTiming={700} backdropOpacity={0.5} isVisible={notifModalVisible} style={{flex: 1, justifyContent:'center', alignItems:'center'}} onBackdropPress={close}>
                
                <ModalView>
                    <View style={{}}>
                    <Lottie source={require('../../../postingfirstpage.json')}  autoPlay loop style={{width:WIDTH*0.5, height: WIDTH*0.5,}}/>
                    {!notifPermission ? 
                    <>
                        <SubtitleText>Get notified when subleases are up!</SubtitleText>
                        <ContextText>By enabling notifications, you will be notified right away when people are interested in your sublease.</ContextText>
                    </>
                    :
                    <Text>Yes</Text>
                    }
                    </View>
                    <EnableButton onPress={openSettings}>
                        <EnableButtonText >Enable notification</EnableButtonText>
                    </EnableButton>
                </ModalView>
                <Pressable onPress={close} style={{position:'absolute', bottom: HEIGHT*0.1}}>
                    <EnableButtonText >Not now</EnableButtonText>
                </Pressable>

                
            </Modal>
       
    )

}


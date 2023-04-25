import Modal from "react-native-modal";
import styled from 'styled-components/native';
import React, {useState, useEffect, useRef, useCallback, useContext,} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';


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

import { HEIGHT, PRIMARYCOLOR, WIDTH, EXTRALIGHT } from "../../../../sharedUtils";
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
    flex-direction: column
`

const SubtitleText = styled.Text`
  font-size: ${HEIGHT*0.04}px
  font-weight: 500;
  color: black
  margin-top: ${HEIGHT*0.02}px
  width: ${WIDTH*0.7}px
  align-self: center
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
  align-self: center
  position: absolute
  bottom: ${HEIGHT*0.025}px
  color: ${PRIMARYCOLOR}
  font-size: ${HEIGHT*0.017}px
  font-weight: 700;

`

const TYPE = [
    {name: "Looking for a sublease"},
    {name:"Posting a sublease"},
    {name: "Both"},
]

const OptionTypeContainer = styled.Pressable`
    align-self: center
    width: ${WIDTH*0.7}px
    padding-vertical: 10px
    border-radius: 10px
    border-width: 1.5px
    border-color: #E0E0E0
    margin-top:${HEIGHT*0.015}px
    padding-left: ${WIDTH*0.03}px
`

const OptionType = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: #545454
`


export default function UserTypeModal({subleaseTypeModalVisible, close}){

    const [subleaseType, setSubleaseType] = useState("")

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
    
    async function handleSubmit(){
        console.log("Hello")
        close()
    }
    return (
       
            <Modal animationInTiming={700} animationOutTiming={700} backdropOpacity={0.5} isVisible={subleaseTypeModalVisible} style={{flex: 1, justifyContent:'center', alignItems:'center'}} onBackdropPress={close}>
                
                <ModalView>
                    <View>
                    <>
                        <Ionicons style={{paddingLeft: WIDTH*0.025}} name="search-circle-outline" size={50} />
                        <SubtitleText>What brings you to <Text style={{fontWeight:'700'}}>Crib?</Text></SubtitleText>
                        {/* <ContextText>By enabling notifications, you will be notified right away when people are interested in your sublease.</ContextText> */}
                    </>
                    
                 
                    </View>
                    {/* <EnableButton onPress={openSettings}>
                        <EnableButtonText >Enable notification</EnableButtonText>
                    </EnableButton> */}
                    <View style={{marginTop:HEIGHT*0.02}}>
                    {
                        TYPE.map((item) => {
                            return (
                                <OptionTypeContainer onPress={()=>setSubleaseType(item.name)} key={"optiontype"+item.name} style={{backgroundColor: subleaseType == item.name ? PRIMARYCOLOR : 'white'}}>
                                    <OptionType style={{color: subleaseType == item.name ? 'white' : 'black'}}>{item.name}</OptionType>
                                </OptionTypeContainer>
                            )
                        })
                    }
                    </View>
                    <View style={{flex: 1, display:'flex', flexDirection:'row', justifyContent:'center'}}>
                        <Pressable disabled={subleaseType== "" ? true : false}  onPress={handleSubmit} style={{position:'absolute', bottom: 0, justifyContent:'center', alignItems:'center', display: subleaseType == "" ? 'none' : 'flex'}}>
                            <EnableButtonText>Submit</EnableButtonText>
                        </Pressable>
                    </View>
                </ModalView>
                
                    
                

                
            </Modal>
       
    )

}


import React, { useState, useEffect, useContext } from 'react';

import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Pressable
} from 'react-native';

import { Container, Heading, HeadingImageContainer, SubtitleText, 
    ModalView, ModalHeaderText, UserNumberText, ModalOptionContainer, ModalOption,
    InputFollowUpContainer} from './login_otpStyle';

import { ContinueButton , ContinueText, } from '../../sharedUtils';

import OTPInputField from  './login_otpStyle'
import { UserContext } from '../../UserContext';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR } from '../../sharedUtils';

import Modal from "react-native-modal";


export default function Login_OTP({navigation, route}){

    const {user, login} = useContext(UserContext);
    const [code, setCode] = useState('')
    const [pinReady, setpinReady] = useState(false)
    const [authyID, setauthyID] = useState(route.authy_id)
    const [smsErrorModal, setSMSErrorModal] = useState(false)
    const [laoding, setLoading] = useState(false)

    console.log(route.authy_id)
    const MAX_CODE_LENGTH = 6;

    useEffect(()=> {
        setauthyID(route.authy_id)
        if(code.length == 6){
            userLogin();
        }
        return
    },[code])

    async function userLogin(){ 
        
        let oneSignalUserId = await SecureStorage.getItem('oneSignalUserID');
       
      
        console.log("TOKEN")
        console.log(code);
        console.log("AuthyID")
        console.log(route.authy_id);
        let success = false
        fetch('https://sublease-app.herokuapp.com/users/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: route.authy_id,
                token: code,
                phoneNumber: route.phoneNumber,
                oneSignalUserId: oneSignalUserId
            })
        })
        .then( res => {
            if(res.status == 200){          
                success =true
            } else{
                alert("Incorrect code.")
                setCode("")
                success=false
            }
            
            return res.json()
        }).then( async data =>{
            console.log(success)
            if(success){
                console.log("LOGIN_OTP", data.loggedIn.firstName)
                try{
                    await SecureStorage.setItem("accessToken", data.token.accessToken)
                    await SecureStorage.setItem("profilePic", data.loggedIn.profilePic)
                    await SecureStorage.setItem("userId", data.loggedIn._id)
                    await SecureStorage.setItem("firstName", data.loggedIn.firstName)
                    await SecureStorage.setItem("lastName", data.loggedIn.lastName)
                    await SecureStorage.setItem("refreshToken", data.token.refreshToken)

                    await AsyncStorage.setItem("userId", data.loggedIn._id)
                    await AsyncStorage.setItem("firstName", data.loggedIn.firstName)
                    await AsyncStorage.setItem("lastName", data.loggedIn.lastName)
                    await AsyncStorage.setItem("profilePic", data.loggedIn.profilePic)
                    await AsyncStorage.setItem("userId", data.loggedIn._id)
                    connectSendbird()
                }
                catch{e=>{
                    console.log(e)
                }}

                
                login(data.loggedIn._id);
                
            }

        })
    }

    const connectSendbird = async () => {
        const UID = await SecureStorage.getItem("userId");
        if (UID != undefined) {
          try {
            console.log("connecting to sendbird")
         
            sb.connect(UID, function (user, error) {
              if (error) {
                // Handle error.
                console.log("sendbird error")
                console.log(error)
              }
              else {
                console.log("sendbird connected")
              }
              // The user is connected to Sendbird server.
            });
            // The user is connected to the Sendbird server.
          } catch (err) {
            // Handle error.
            console.log("SENDBIRD ERROR")
          }
        }
      }
    function backToLogin(){
        navigation.reset(
            {index: 0 , routes: [{ name: 'Login'}]}
            
        )
    }

    function resendSMS(){
       
        fetch('https://sublease-app.herokuapp.com/users/OTP/step2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: route.authy_id
            })
        })
        .then(res => res.json()).then(data =>{
            console.log("STEP2");
            console.log(data);
            if(data.response.success != true){
                alert("invalid in step 2.")
            }
        })
        setLoading(false)
        setSMSErrorModal(false)
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            
            <Container>
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
                <ScrollView>
                    <HeadingImageContainer>
                        <Heading>Enter OTP</Heading>
                        <SubtitleText>Please enter the one time password sent to you through sms</SubtitleText>
                    </HeadingImageContainer>
                    <InputFollowUpContainer>
                    <OTPInputField
                        setPinReady={pinReady}
                        code={code}
                        keypad="none"
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                    />
                    <Pressable onPress={()=>setSMSErrorModal(true)}>
                        <SubtitleText>Didn't recieve SMS?</SubtitleText>
                    </Pressable>
                    </InputFollowUpContainer>
                </ScrollView>
                <ContinueButton style={{marginBottom: HEIGHT*0.1}} onPress={()=> login('test')}>
                    <ContinueText>Continue</ContinueText>
                </ContinueButton>
                </KeyboardAvoidingView>
            </Container>
            <Modal isVisible={smsErrorModal} animationIn= 'zoomIn' animationOut='zoomOut'
            style={{padding:0, margin: 0, justifyContent:'center', alignItems:'center', flex:1}}>
            <TouchableWithoutFeedback onPress={()=>setSMSErrorModal(false)}>
            <View style={{width:WIDTH, height: HEIGHT,justifyContent:'center', alignItems:'center'}}>
                <ModalView>
                    <ModalHeaderText>
                        Is this number correct?
                    </ModalHeaderText>
                    <UserNumberText>
                        +1 ({route.phoneNumber.slice(0, 3)})-{route.phoneNumber.slice(3,6)}-{route.phoneNumber.slice(6, 10)}
                    </UserNumberText>
                    <ModalOptionContainer>
                        <ModalOption onPress={()=> {setSMSErrorModal(false),  backToLogin()}}>
                            <Text style={{}}>No</Text>
                        </ModalOption>
                        <ModalOption onPress={resendSMS}>
                            <Text style={{color: PRIMARYCOLOR}}>Resend code</Text>
                        </ModalOption>
                    </ModalOptionContainer>
                </ModalView>
            </View>
            </TouchableWithoutFeedback>
           
            </Modal>
        </SafeAreaView>
    )
}

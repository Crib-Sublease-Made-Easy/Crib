import React, { useState, useEffect, useContext } from 'react';

import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
  View,
  Pressable
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { Container, Heading, HeadingImageContainer, SubtitleText, 
    ModalView, ModalHeaderText, UserNumberText, ModalOptionContainer, ModalOption,
    InputFollowUpContainer} from './login_otpStyle';

import { ContinueButton , ContinueText, } from '../../sharedUtils';

import OTPInputField from  './login_otpStyle'
import { UserContext } from '../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR } from '../../sharedUtils';

import Modal from "react-native-modal";

export default function Login_OTP({navigation, route}){

    const {login, sb} = useContext(UserContext);
    const [code, setCode] = useState('')
    const [pinReady, setpinReady] = useState(false)
    const [authyID, setauthyID] = useState(route.authy_id)
    const [smsErrorModal, setSMSErrorModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const MAX_CODE_LENGTH = 6;

    useEffect(()=> {
        setauthyID(route.authy_id)
    },[])

    async function userLogin(){ 

        if(code.length != 6){
            alert("Incorrect code!")
            return;
        }
        setLoading(true)
        let oneSignalUserId = await EncryptedStorage.getItem('oneSignalUserID');
       
    
        await fetch('https://crib-llc.herokuapp.com/users/login', {
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
        .then( async res => {
            if(res.status == 200){          
                const data = await res.json();
                try{
                    OneSignal.disablePush(false);
                    if(data.token.accessToken != undefined){
                        await EncryptedStorage.setItem("accessToken", data.token.accessToken)
                    }
                    if(data.loggedIn.profilePic != undefined){
                        await EncryptedStorage.setItem("profilePic", data.loggedIn.profilePic)
                    }
                    if(data.loggedIn._id != undefined){
                        await EncryptedStorage.setItem("userId", data.loggedIn._id)
                    }
                    if(data.loggedIn.firstName != undefined){
                        await EncryptedStorage.setItem("firstName", data.loggedIn.firstName)
                    }
                    if(data.loggedIn.lastName != undefined){
                        await EncryptedStorage.setItem("lastName", data.loggedIn.lastName)
                    }
                    if(data.token.refreshToken != undefined){
                        await EncryptedStorage.setItem("refreshToken", data.token.refreshToken)
                    }
                    if(data.loggedIn._id != undefined){
                        await AsyncStorage.setItem("userId", data.loggedIn._id)
                    }
                    if(data.loggedIn.firstName != undefined){
                        await AsyncStorage.setItem("firstName", data.loggedIn.firstName)
                    }
                    if(data.loggedIn.lastName != undefined){
                        await AsyncStorage.setItem("lastName", data.loggedIn.lastName)
                    }
                    if(data.loggedIn.profilePic != undefined){
                        await AsyncStorage.setItem("profilePic", data.loggedIn.profilePic)
                    }
                    if(data.token.oneSignalId != undefined && data.token.oneSignalId != null){
                        await EncryptedStorage.setItem("oneSignalUserId", data.token.oneSignalId)
                    }
                    connectSendbird(data.loggedIn._id)
                }
                catch{e=>{
                    console.log(e)
                }}

                setLoading(false)
                login(data.loggedIn._id)
                navigation.reset(
                    {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                )

            } 
            else if(res.status == 400){
                setLoading(false)
                alert("Incorrect code.")
                setCode("")
            }
            else{
                setLoading(false)
                alert("An error occured. Please try again later!")
                navigation.reset(
                    {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                )
            }
        })
        .catch( e=>{
            alert("An error occured. Please try again later!")
            navigation.reset(
                {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
            )
        })
    }

    const connectSendbird = async (UID) => {
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
            console.log(err)
            console.log("SENDBIRD ERROR")
            }
        }    
    }

    
    function backToLogin(){
        navigation.reset(
            {index: 0 , routes: [{ name: 'Login', wrongPhoneNumber: true}]}
        )
    }

    function resendSMS(){
       
        fetch('https://crib-llc.herokuapp.com/users/OTP/step2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: route.authy_id
            })
        })
        .then(res => {
            setSMSErrorModal(false)
            if(res.status == 201){
                alert("Message successfully sent!")
                setLoading(false)
            }
            else if(res.status == 401){
                alert("Invalid phone number, please try again!")
                setLoading(false)
                backToLogin
            }
            else{
                alert("An error has occured. Please try again later!")
                setLoading(false)
            }
        }).catch( e=>{
            alert("An error has occured. Please try again later!")
        })
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            
            <Container>
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
                <ScrollView>
                    <HeadingImageContainer>
                        <Heading>Enter OTP</Heading>
                        <SubtitleText>A one time password was sent to you.</SubtitleText>
                    </HeadingImageContainer>
                    <InputFollowUpContainer>
                    <OTPInputField
                        setPinReady={pinReady}
                        code={code}
                        keypad="none"
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                    />
                    <Pressable disabled={loading} style={{marginTop: HEIGHT*0.025}} onPress={()=>setSMSErrorModal(true)}>
                        <SubtitleText>Didn't recieve SMS?</SubtitleText>
                    </Pressable>
                    </InputFollowUpContainer>
                </ScrollView>
                <ContinueButton disabled={loading} style={{marginBottom: HEIGHT*0.1}} onPress={userLogin}>
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
                        +{route.countryCode[0]} {route.phoneNumber}
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

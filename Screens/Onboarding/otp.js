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
import OneSignal from 'react-native-onesignal';

import { Container, Heading, SignupForm, ButtonText, StandardButtonStyle, StandardInputStyle,
    HeadingImageContainer,PhoneNumberContainer, ContinueButton, ContinueText, SubtitleText, 
    ModalView, ModalHeaderText, UserNumberText, ModalOptionContainer, ModalOption} from './otpStyle';

import OTPInputField from  './otpStyle'
import { UserContext } from '../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import {PRIMARYCOLOR} from '../../sharedUtils'

import Modal from "react-native-modal";


export default function OTPScreen({navigation, route}){

    const {login, sb} = useContext(UserContext);
    const [phoneNumber, setphoneNumber] = useState('')
    const [code, setCode] = useState('')
    const [pinReady, setpinReady] = useState(false)
    const [authyID, setauthyID] = useState(route.params.authy_id)
    const [smsErrorModal, setSMSErrorModal] = useState(false)
    const [laoding, setLoading] = useState(false)

    const MAX_CODE_LENGTH = 6;

    useEffect(()=> {
        setauthyID(route.params.authy_id)
        

    },[])

    async function signupStep3(){ 
        console.log("hello")
        setLoading(true)
        try{
            let oneSignalUserId = await EncryptedStorage.getItem('oneSignalUserID');
            if(oneSignalUserId != undefined){
                const formData = new FormData();

                formData.append("firstName", route.params.firstName);                     
                formData.append("lastName", route.params.lastName);  
                formData.append("dob", route.params.age);      
                formData.append("gender", route.params.gender);
                formData.append("phoneNumber", route.params.phoneNumber);                       
                formData.append("occupation", route.params.occupation)
                formData.append("school", route.params.school);                       
                formData.append("email", route.params.email);      
                formData.append("token", code);      
                formData.append("authy_id", route.params.authy_id);      
                formData.append("oneSignalUserId", oneSignalUserId);    
                formData.append("type", route.params.type)  

        
                var array = route.params.profilePic.split(".");
                formData.append("userImage", {
                    uri: route.params.profilePic,
                    type: 'image/' + array[1],
                    name: 'someName',
                });

                fetch('https://crib-llc.herokuapp.com/users/OTP/step3', {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: formData
                })
                .then(async res => {
                    const data = await res.json();
                    if(res.status == 201){
                
                        try {
                            sb.connect(data.createdUser._id, function(user, error) {
                                if (error) {
                                    // Handle error.
                                    console.log("sendbird error")
                                }
                                else{
                                    console.log("sendbird connected")
                                    sb.updateCurrentUserInfo(data.createdUser.firstName, data.createdUser.profilePic, (user, err) => {
                                        if (!err) {
                                            console.log("Successfully updated current user")
                                        } else {
                                            console.log("Error with updating current user", err)
                                        }
                                    });
                                }
                                // The user is connected to Sendbird server.
                            });
                            // The user is connected to the Sendbird server.
                        } catch (err) {
                            alert("An error has occured.")
                        }
                    
                        try{
                            OneSignal.disablePush(false);
                            //Create sendbird user here with userid
                            if(data.token.accessToken != undefined){
                                await EncryptedStorage.setItem("accessToken", data.token.accessToken)
                            }
                            if( data.createdUser.profilePic != undefined){
                                await EncryptedStorage.setItem("profilePic", data.createdUser.profilePic)
                            }
                            if( data.createdUser._id != undefined){
                                await EncryptedStorage.setItem("userId", data.createdUser._id)
                            }
                            if(data.createdUser.firstName != undefined){
                                await EncryptedStorage.setItem("firstName", data.createdUser.firstName)
                            }
                            if(data.createdUser.lastName != undefined){
                                await EncryptedStorage.setItem("lastName", data.createdUser.lastName)
                            }
                            if(data.token.refreshToken != undefined){
                                await EncryptedStorage.setItem("refreshToken", data.token.refreshToken)
                            }
                            connectSendbird()
                        }
                        catch{e=>{
                            console.log(e)
                        }}
                        
                        setLoading(false)
                        login(data.createdUser._id);
                        navigation.reset(
                            {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                        )
                    }
                    else if(res.status == 500){
                        alert("Error occured while creating account. Please try again later!")
                    }
                    else{
                        alert("Incorrect code.")
                        setCode("")
                        setLoading(false)
                    }

                })
                .catch( e => {
                    setLoading(false)
                    alert("Error occured while creating account. Please try again later!")
                    navigation.reset(
                        {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                    )
                })
            }
        }
        catch{
            alert("Error. Please try again later!")
        }
         setLoading(false)
        
    }
  const connectSendbird = async () => {
    const UID = await EncryptedStorage.getItem("userId");
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
    function backToPhoneNumber(){
        setSMSErrorModal(false)
        navigation.reset(
            {index: 0 , routes: [{ name: 'PhoneNumber', 
            params: {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            email: route.params.email,
            password: route.params.password, 
            wrongPhoneNumber: true
        }}]}
            
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
                authy_id: route.params.authy_id
            })
        })
        .then(res => {
            if(res.status == 201){
                alert("Message successfully sent!")
                setLoading(false)
                setSMSErrorModal(false)
            }
            else if(res.status == 401){
                alert("Invalid phone number, please try again!")
                setLoading(false)
                setSMSErrorModal(false)
                backToPhoneNumber
            }
            else{
                alert("An error has occured. Please try again later!")
                setLoading(false)
                setSMSErrorModal(false)
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
                    <Heading>Enter OTP</Heading>
                    <SubtitleText>A one time password was sent to you.</SubtitleText>
                    <HeadingImageContainer>
                        
                        <Image source={require('../../assets/otp.jpg')} style={{ height: HEIGHT*0.1, width: HEIGHT*0.15, alignSelf: 'center', }}/>
                    </HeadingImageContainer>
                    
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
                </ScrollView>
                <ContinueButton onPress={()=> signupStep3()}>
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
                        +1 ({route.params.phoneNumber.slice(0, 3)})-{route.params.phoneNumber.slice(3,6)}-{route.params.phoneNumber.slice(6, 10)}
                    </UserNumberText>
                    <ModalOptionContainer>
                        <ModalOption onPress={()=> {setSMSErrorModal(false), backToPhoneNumber()}}>
                            <Text>No</Text>
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

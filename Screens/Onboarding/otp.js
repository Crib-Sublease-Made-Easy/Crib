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

const PRIMARYCOLOR = '#8559E3'

import Modal from "react-native-modal";
import { LIGHTGREY } from '../../sharedUtils';


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
        if(code.length == 6){
            signupStep3();
        }

    },[code])

    async function signupStep3(){ 
        setLoading(true)
        let oneSignalUserId = await EncryptedStorage.getItem('oneSignalUserID');
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
        .then(res => res.json()).then(async data =>{
            console.log("STEP3");
            console.log(data);

            if(data.message != "User account created successfully"){
                alert("Incorrect code.")
                setCode("")
                setLoading(false)
            }
            else{

                //The USER_ID below should be unique to your Sendbird application.
                try {
                    console.log("connecting to sendbird")
                    sb.connect(data.createdUser._id, function(user, error) {
                        if (error) {
                            // Handle error.
                            console.log("sendbird error")
                            console.log(err)
                        }
                        else{
                            console.log("sendbird connected")
                            sb.updateCurrentUserInfo(data.createdUser.firstName, data.createdUser.profilePic, (user, err) => {
                                if (!err) {
                                    console.log("Successfully updated current user", err)
                                  } else {
                                    console.log("Error with updating current user", err)
                                  }
                            });
                        }
                        // The user is connected to Sendbird server.
                    });
                    // The user is connected to the Sendbird server.
                } catch (err) {
                    // Handle error.
                }
                try{
                    OneSignal.disablePush(false);
                    //Create sendbird user here with userid
                    //store user info in

                    await EncryptedStorage.setItem("accessToken", data.token.accessToken)
                    await EncryptedStorage.setItem("profilePic", data.createdUser.profilePic)
                    await EncryptedStorage.setItem("userId", data.createdUser._id)
                    await EncryptedStorage.setItem("firstName", data.createdUser.firstName)
                    await EncryptedStorage.setItem("lastName", data.createdUser.lastName)
                    await EncryptedStorage.setItem("refreshToken", data.token.refreshToken)
                  


                    connectSendbird()

                }
                catch{e=>{
                    console.log(e)
                }}
                
                setTimeout(()=>{setLoading(false)},2000)
                login(data.createdUser._id);
                navigation.navigate("DiscoverTabs")

            }
        })
    }
  const connectSendbird = async () => {
    const UID = await EncryptedStorage.getItem("userId");
    if (UID != undefined) {
      try {
     
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
            backAgain: true
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
        .then(res => res.json()).then(data =>{
            console.log("STEP2");
            if(data.response.success != true){
                alert("invalid in step 2.")
            }
        })
        setLoading(false)
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            
            <Container>
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
                <ScrollView style={{minHeight: HEIGHT*0.5}}>
                    <Pressable onPress={()=> navigation.navigate("DiscoverTabs")} style={{flexDirection:'row', width: WIDTH*0.8, alignSelf:'center', justifyContent:'flex-end'}}>
                      
                      <Text style={{color: 'black', fontSize: HEIGHT*0.02, textAlign:'right'}}>Exit</Text>
                    </Pressable>
                    <HeadingImageContainer>
                        <Heading>Enter OTP</Heading>
                        <SubtitleText>Please enter the one time password sent to you through sms</SubtitleText>
                        <Image source={require('../../assets/otp.jpg')} style={{ height: HEIGHT*0.15, width: HEIGHT*0.2, alignSelf: 'center', }}/>
                    </HeadingImageContainer>
                    
                    {/* <OTPInputField
                        setPinReady={pinReady}
                        code={code}
                        keypad="none"
                        setCode={setCode}
                        maxLength={MAX_CODE_LENGTH}
                    /> */}
                    <TextInput 
                    keyboardType = "number-pad"
                    maxLength={6}
                    onChangeText={(value) => setCode(value)}
                    style={{width: WIDTH*0.8, paddingVertical: HEIGHT*0.01, marginTop: HEIGHT*0.05, paddingLeft: WIDTH*0.025, backgroundColor: LIGHTGREY, alignSelf: 'center',}}>

                    </TextInput>
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

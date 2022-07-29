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

import { Container, Heading, SignupForm, ButtonText, StandardButtonStyle, StandardInputStyle,
    HeadingImageContainer,PhoneNumberContainer, ContinueButton, ContinueText, SubtitleText, 
    ModalView, ModalHeaderText, UserNumberText, ModalOptionContainer, ModalOption} from './otpStyle';

import OTPInputField from  './otpStyle'
import { UserContext } from '../../UserContext';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#8559E3'

import Modal from "react-native-modal";


export default function OTPScreen({navigation, route}){

    const {user, login} = useContext(UserContext);
    const [phoneNumber, setphoneNumber] = useState('')
    const [code, setCode] = useState('')
    const [pinReady, setpinReady] = useState(false)
    const [authyID, setauthyID] = useState('')
    const [smsErrorModal, setSMSErrorModal] = useState(false)
    const [laoding, setLoading] = useState(false)

    const MAX_CODE_LENGTH = 6;

    useEffect(()=> {
        setauthyID(route.authyID)
        if(code.length == 6){
            signupStep3();
        }

    },[code])

    async function signupStep3(){ 
        setLoading(true)
        console.log("TOKEN")
        console.log(code);
        console.log("AuthyID")
        console.log(authyID);
        fetch('https://sublease-app.herokuapp.com/users/OTP/step3', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: authyID,
                token: code,
                email: route.email
            })
        })
        .then(res => res.json()).then(async data =>{
            console.log("STEP3");
            console.log(data);

            if(data.messge != "Success"){
                alert("Incorrect code.")
                setCode("")
                setLoading(false)
            }
            else{

                await SecureStorage.setItem("accessToken", data.token.accessToken)
                await SecureStorage.setItem("refreshToken", data.token.refreshToken)
                await SecureStorage.setItem("profilePic", route.profilePic)
                await SecureStorage.setItem("email", route.email)
                console.log("got")
                setTimeout(()=>{setLoading(false)},2000)
                login(route.email);
            }
        })
    }

    function backToPhoneNumber(){
        navigation.reset(
            {index: 0 , routes: [{ name: 'PhoneNumber', 
            fistName: route.firstName, 
            lastName: route.lastName,
            age: route.age,
            gender: route.gender,
            profilePic: route.profilePic,
            school: route.school,
            email: route.email,
            password: route.password, }]}
            
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
                authy_id: authyID
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
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            
            <Container>
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
                <ScrollView>
                    <HeadingImageContainer>
                        <Heading>Enter OTP</Heading>
                        <SubtitleText>Please enter the one time password sent to you through sms</SubtitleText>
                        <Image source={require('../../assets/otp.jpg')} style={{ height: HEIGHT*0.15, width: HEIGHT*0.2, alignSelf: 'center', }}/>
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
                <ContinueButton onPress={()=> login('test')}>
                    <ContinueText>Continue</ContinueText>
                </ContinueButton>
                </KeyboardAvoidingView>
            </Container>
            <Modal isVisible={smsErrorModal} animationIn= 'zoomIn' animationOut='zoomOut'
            style={{padding:0, margin: 0, justifyContent:'center', alignItems:'center'}}>
                <ModalView>
                    <ModalHeaderText>
                        Is this number correct?
                    </ModalHeaderText>
                    <UserNumberText>
                        +1 ({route.phoneNumber.slice(0, 3)})-{route.phoneNumber.slice(3,6)}-{route.phoneNumber.slice(6, 10)}
                    </UserNumberText>
                    <ModalOptionContainer>
                        <ModalOption onPress={()=> {setSMSErrorModal(false), backToPhoneNumber()}}>
                            <Text>No</Text>
                        </ModalOption>
                        <ModalOption>
                            <Text style={{color: PRIMARYCOLOR}}>Resend code</Text>
                        </ModalOption>
                    </ModalOptionContainer>
                </ModalView>
            </Modal>
        </SafeAreaView>
    )
}

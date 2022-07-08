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

    const MAX_CODE_LENGTH = 6;

    useEffect(()=> {
        if(code.length == 6){
            signupStep3();
        }

    },[code, authyID])


    async function signup(){
        const data = route.params;
        fetch('https://sublease-app.herokuapp.com/users/signup', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: data.firstName,
                lastName:data.lastName,
                age: data.age,
                phoneNumber: phoneNumber,
                email: data.email,
                password: data.password,
                gender: data.gender,
                profilePic: 'haha'
            })
        }).then( e =>{
            if(e.status == 409){
                alert("Account Exists. Please log in.")
                navigation.navigate('Login')
            }
            if(e.status == 400 || e.status == 404){
                alert("Fuck")
            }
            else{
                login(data.email);
                console.log(e)
            }
        })
    }
    async function signupStep1(){
 
        if(phoneNumber.length == 10 && route.params.email != ""){
            const res =  await fetch('https://sublease-app.herokuapp.com/users/OTP/step1', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    email: route.params.email
                })
            }) 
            .then(res => res.json()).then(data =>{
                console.log("STEP1");
                console.log(data);
                if(data.response.success != true){
                    alert("invalid in step 1.")
                }
                else{
                    signupStep2(data.id);
                }

            })   
        }
        else if(phoneNumber.length != 10){
            alert("Phone number is incorrect")
        }
        else if(route.params.email == ""){
            alert("Email is incorrect")
        }
    }

    function signupStep2(id){
        setauthyID(id);
        fetch('https://sublease-app.herokuapp.com/users/OTP/step2', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: id
            })
        })
        .then(res => res.json()).then(data =>{
            console.log("STEP2");
            console.log(data);
            if(data.response.success != true){
                alert("invalid in step 2.")
            }
        })
    }

    function signupStep3(){
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
                token: code
            })
        })
        .then(res => res.json()).then(data =>{
            console.log("STEP3");
            console.log(data);
            if(data.response.success != "true"){
                alert("invalid in step 3.")
            }
            else{
                signup;
                login(route.params.email);
            }
        })
    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            
            <Container>
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
                <ScrollView>
                    <HeadingImageContainer>
                        <Heading>Enter OTP</Heading>
                        <Image source={require('../../assets/otp.jpg')} style={{ height: HEIGHT*0.2, width: HEIGHT*0.3, alignSelf: 'center', }}/>
                    </HeadingImageContainer>
                    
                    <OTPInputField
                        setPinReady={pinReady}
                        code={code}
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
                        +1 608 999 1395
                    </UserNumberText>
                    <ModalOptionContainer>
                        <ModalOption onPress={()=> {setSMSErrorModal(false, navigation.goBack())}}>
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

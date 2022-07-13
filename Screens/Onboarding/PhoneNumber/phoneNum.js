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
    Pressable,
    Animated,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HEIGHT, WIDTH } from '../../../sharedUtils';

import {Header, ProgressBarContainer, SubtitleText, TitleText, ContinueText, ContinueButton,
    GeneralTextInput, TextInputContainer} from './phoneNumStyle';

export default function PhoneNumberScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState('')
    const [authyID, setauthyID] = useState('')

    async function signupStep1(){
        console.log("Stepping 1")
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
        navigation.navigate("otp",
        {
            fistName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            email: route.params.email,
            password: route.params.password,
            phoneNumber: phoneNumber,
            authyID: id
        })
    }

    

    function checkInput(){
    //     if(phoneNumber.length != 10){
    //         alert("Phone number is invalid")
    //     }
    //    else{
    //         navigation.navigate("otp")
    //    }
        signupStep1()

    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
           
            <ScrollView>
                <TitleText>Enter your phone number</TitleText>
                <SubtitleText>We will send you a OTP to verify your number</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput value={phoneNumber} onChangeText={(value)=> setPhoneNumber(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"  />
                </TextInputContainer>
            </ScrollView>
          

            <ContinueButton onPress={checkInput}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
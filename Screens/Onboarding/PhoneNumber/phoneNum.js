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

    function checkInput(){
    //     if(phoneNumber.length != 10){
    //         alert("Phone number is invalid")
    //     }
    //    else{
    //         navigation.navigate("otp")
    //    }
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
            phoneNumber: phoneNumber
        })

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
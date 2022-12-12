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

import { HEIGHT, WIDTH, ContinueButton, ContinueText } from '../../sharedUtils';

import Lottie from 'lottie-react-native';


import {Header, ProgressBarContainer, SubtitleText, TitleText,
    GeneralTextInput, TextInputContainer} from './loginStyle';

export default function LoginScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passedPhoneNumber, setPassedPhoneNumber]= useState("")
    const [loading, setLoading] = useState(false)
   

    async function signupStep1(){
        
        const number = phoneNumber.replace(/[^\d]/g, '').substring(0,10);
        
      
        await fetch('https://crib-llc.herokuapp.com/users/authy', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: number,
            })
        }) 
        .then(async res => {
            
            if(res.status == 200){
                const data = await res.json();
                if(data.authy_id != undefined && number != undefined && number != null){
                    signupStep2(data.authy_id, number)
                }
                else{
                    alert("An error has occured. Please try again!")
                }
            }
            else if(res.status == 401){
                alert("User doesn't exist, please sign up.")
                setLoading(false)
                setPhoneNumber("")
                setPassedPhoneNumber("")
                navigation.navigate("FirstLastName")
            }
            else{
                alert("An error has occured. Please try again later!")
                setLoading(false)
                setPhoneNumber("")
                setPassedPhoneNumber("")
                navigation.reset(
                    {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                )
            }
        })
        .catch( e => {
            alert("An error has occured. Please try again later!")
        })
    }

    async function signupStep2(authy_id, number){
       
        await fetch('https://crib-llc.herokuapp.com/users/OTP/step2', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authy_id: authy_id,
            })
        }) 
        .then(res => {
         
            if(res.status == 201){
                // console.log("LOGGED INNN")
                navigation.reset({index: 0 , routes: [{ name: 'Login_OTP', authy_id: authy_id, phoneNumber: number }]})
            }
            else{
                alert('ERROR OCCURED')
            }
        })
        .catch( e => {
            alert("An error has occured. Please try again later!")
        })
    }

    

    function checkInput(){
        if(passedPhoneNumber.length < 10){
            alert("Phone number is invalid")
        }
        else{
            setLoading(true)
            signupStep1()
        }
    }

    const handleInput = (e) => {
        // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
        const formattedPhoneNumber = formatPhoneNumber(e);
        // we'll set the input value using our setInputValue

        setPhoneNumber(formattedPhoneNumber)
    };


    function formatPhoneNumber(value){
        if (!value) return value;
        setPassedPhoneNumber(value)
        // clean the input for any non-digit values.
        let number = value.replace(/[^\d]/g, '');
        setPassedPhoneNumber(number)
        // phoneNumberLength is used to know when to apply our formatting for the phone number
        const phoneNumberLength = number.length;
      
        if (phoneNumberLength < 4) return number;

        if (phoneNumberLength < 7) {
            return `(${number.slice(0, 3)})-${number.slice(3)}`;
        }
        return `(${number.slice(0, 3)})-${number.slice(
            3,
            6
        )}-${number.slice(6, 10)}`;
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <Header>
                <Pressable hitSlop={WIDTH*0.025} onPress={()=> route.wrongPhoneNumber == undefined ? navigation.goBack() : navigation.reset(
            {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
            )}>
                   
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false}>
                <TitleText>Login with your phone number</TitleText>
                <SubtitleText>We will send you a one time password to verify your number</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput editable={!loading} value={phoneNumber} onChangeText={(value)=> handleInput(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"/>
                        
                    
                </TextInputContainer>
            </ScrollView>

            <ContinueButton disabled={loading} loading={loading} onPress={checkInput}>
            {loading ?
                <Lottie source={require('../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.05, height: WIDTH*0.05, }}/>
            :
                <ContinueText>Continue</ContinueText>
            }
            </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
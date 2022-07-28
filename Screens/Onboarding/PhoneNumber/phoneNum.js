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

import Lottie from 'lottie-react-native';


import {Header, ProgressBarContainer, SubtitleText, TitleText, ContinueText, ContinueButton,
    GeneralTextInput, TextInputContainer} from './phoneNumStyle';

export default function PhoneNumberScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passedPhoneNumber, setPassedPhoneNumber]= useState("")
    const [loading, setLoading] = useState(false)
    console.log(passedPhoneNumber)
    async function signupStep1(){
        console.log("Stepping 1")
        const res =  await fetch('https://sublease-app.herokuapp.com/users/OTP/step1', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: passedPhoneNumber,
                email: route.email
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
        navigation.reset(
            {index: 0 , routes: [{ name: 'otp', 
            fistName: route.firstName, 
            lastName: route.lastName,
            age: route.age,
            gender: route.gender,
            profilePic: route.profilePic,
            school: route.school,
            email: route.email,
            password: route.password,
            phoneNumber: passedPhoneNumber,
            authy_id: id}]}
        )
        setLoading(false)
    }

    

    function checkInput(){
        if(passedPhoneNumber.length != 10){
            alert("Phone number is invalid")
        }
       else{
            setLoading(true)
            console.log("Will sign up")
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
                {/* <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                   
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable> */}
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false}>
                <TitleText>Enter your phone number</TitleText>
                <SubtitleText>We will send you a one time password to verify your number</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput editable={!loading} value={phoneNumber} onChangeText={(value)=> handleInput(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"/>
                        
                    
                </TextInputContainer>
            </ScrollView>
          

            <ContinueButton disabled={loading} loading={loading} onPress={checkInput}>
            {loading ?
                <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
            :
                <ContinueText>Continue</ContinueText>
            }
            </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
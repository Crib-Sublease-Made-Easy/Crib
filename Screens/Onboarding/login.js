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

import { HEIGHT, WIDTH, ContinueButton, ContinueText, GetFAIconsInBlack } from '../../sharedUtils';

import Lottie from 'lottie-react-native';


import {Header, ProgressBarContainer, SubtitleText, TitleText,
    GeneralTextInput, TextInputContainer} from './loginStyle';

export default function LoginScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passedPhoneNumber, setPassedPhoneNumber]= useState("")
    const [loading, setLoading] = useState(false)

    async function signupStep1(){
        
        const number = phoneNumber.replace(/[^\d]/g, '');
      
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
        .then(res => res.json()).then(async data =>{
            if(data.authy_id != undefined){
                // navigation.navigate('Login_OTP')
                signupStep2(data.authy_id, number)
            }
            else{
                alert("User doesn't exist, please sign up.")
                setLoading(false)
                setPhoneNumber("")
                navigation.navigate("FirstLastName")
            }
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
                    console.log("LOGGED INNN")
                    navigation.reset({index: 0 , routes: [{ name: 'Login_OTP', authy_id: authy_id, phoneNumber: number }]})
                }
                else{
                    alert('ERROR OCCURED')
                }

                return res.json()
        }).then (resp => console.log("DATA 2", resp))
    }

    

    function checkInput(){
        console.log(passedPhoneNumber)
        if(passedPhoneNumber.length != 10){
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
        setPassedPhoneNumber(number.substring(0,10))
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
        <SafeAreaView style={{flex: 1,  height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView 
           
            behavior='padding' style={{flex:1, backgroundColor:'white'}}>
            <Header>
                {route.backAgain? 
                <Pressable onPress={()=> navigation.navigate("DiscoverTabs")} style={{flexDirection:'row', width: WIDTH*0.8, alignSelf:'center', justifyContent:'flex-end'}}>
                    <Text style={{color: 'black', fontSize: HEIGHT*0.02, padding: WIDTH*0.02}}>Exit</Text>
                </Pressable>
                :
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {GetFAIconsInBlack("Back")}
                </Pressable>
                }
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false} style={{backgroundColor:'white', minHeight: HEIGHT*0.45608}}>
                <TitleText>Login with your phone number</TitleText>
                <SubtitleText>We will send you a one time password to verify your number</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput editable={!loading} value={phoneNumber} onChangeText={(value)=> handleInput(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"/>
                        
                    
                </TextInputContainer>
            </ScrollView>
          

            <ContinueButton disabled={loading} loading={loading} onPress={checkInput}>
            {loading ?
                <Lottie source={require('../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
            :
                <ContinueText>Continue</ContinueText>
            }
            </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
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
        console.log("PHONENUMBER  ", passedPhoneNumber);
        console.log("EMAIL  ", route.params.email);
        fetch('https://sublease-app.herokuapp.com/users/OTP/step1', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: passedPhoneNumber,
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
                console.log("GOING TO STEP2")
                signupStep2(data.response.user.id);
            }

        })   
    }
    function signupStep2(id){
        console.log("STEP2");
        console.log("ID", id)
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
            console.log("STEP2 in data");
            console.log(data);
            if(data.response.success != true){
                alert("invalid in step 2.")
            }
            else{
                navigation.reset(
                    {index: 0 , routes: [{ name: 'otp', params:{
                    firstName: route.params.firstName, 
                    lastName: route.params.lastName,
                    age: route.params.age,
                    gender: route.params.gender,
                    profilePic: route.params.profilePic,
                    school: route.params.school,
                    occupation: route.params.occupation,
                    email: route.params.email,
                    password: route.params.password,
                    phoneNumber: passedPhoneNumber,
                    authy_id: id}}]}
                )
            }
        })
        
        setLoading(false)
    }

    async function signup(){
        setLoading(true)
        // console.log(route.params.firstName)
        // console.log(route.params.lastName)
        // console.log(route.params.gender)
        // console.log(route.params.school)
        // console.log(route.params.occupation)
        // console.log(route.params.email)
        // console.log(route.params.profilePic)
        // console.log(password)
       
        console.log("Tryin to sign up.")
        if(passedPhoneNumber.length == 10){
            console.log("Inside Signup")
            const res =  await fetch('https://sublease-app.herokuapp.com/users/check', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: passedPhoneNumber
                })
            }).then(res => res.json()).then(async data =>{
                if(data.message == 'This is a valid phone number'){
                    signupStep1()
                }
                else if(data.message == 'User already has an account with this phone number'){
                    alert("Account with phone number exist, please login.")
                    navigation.reset({index: 0 , routes: [{ name: 'Login'}]})
                }
                console.log(data)
            }).catch(e=>
                console.log(e)
            )
        }
        else{
            console.log("Something is missing.")
        }
        setTimeout(()=>{
            setLoading(false)
        },2000)
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
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                   
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
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
          

            <ContinueButton disabled={loading} loading={loading} onPress={signup}>
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
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

import { HEIGHT, WIDTH, PRIMARYCOLOR, ContinueButton, ContinueText, ProgressText, DARKGREY, MEDIUMGREY, GOOGLEBLUE, SignUpHeader, GetFAIconWithColor } from '../../../sharedUtils';

import Lottie from 'lottie-react-native';


import {Header, ProgressBarContainer, SubtitleText, TitleText, 
    GeneralTextInput, TextInputContainer, FollowUpContainer, FollowUpText} from './phoneNumStyle';

export default function PhoneNumberScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passedPhoneNumber, setPassedPhoneNumber]= useState("")
    const [loading, setLoading] = useState(false)
    const [agreement, setAgreement] = useState(false)
    const [privacyagreement, setPrivacyAgreement] = useState(false)
    
    async function signupStep1(){
        console.log("Stepping 1")
        fetch('https://crib-llc.herokuapp.com/users/OTP/step1', {
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
            if(data.error != undefined){
                if(data.error.error_code == 60027){
                    alert("Invalid Email Address")

                    navigation.navigate("Email", {
                        firstName: route.params.firstName, 
                        lastName: route.params.lastName,
                        age: route.params.age,
                        gender: route.params.gender,
                        profilePic: route.params.profilePic,
                        school: route.params.school,
                        occupation: route.params.occupation});
                }
            }
            else{
                console.log("GOING TO STEP2")
                signupStep2(data.response.user.id);
            }

        })   
    }
    function signupStep2(id){
        console.log("STEP2");
        fetch('https://crib-llc.herokuapp.com/users/OTP/step2', {
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
        console.log("Tryin to sign up.")
        if(!agreement || !privacyagreement){
            if(!agreement){
                alert("You have to agree to Crib Terms and Services to proceed.")
            }
            else if(!privacyagreement){
                alert("You have to agree to Crib Privacy Policy to proceed.")
            }
        }
        else if (passedPhoneNumber.length != 10){
            alert("Incorrect phone number.")
        }
        else{
            setLoading(true)
            console.log("Inside Signup")
            const res =  await fetch('https://crib-llc.herokuapp.com/users/check', {
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
                    navigation.reset({index: 0 , routes: [{ name: 'ProfileTabs'}]})
                }
            }).catch(e=>
                console.log(e)
            )
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
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
            <SignUpHeader>
                
                    {
                    route.params.backAgain? 
                    <Pressable onPress={()=> navigation.navigate("DiscoverTabs")} style={{flexDirection:'row', justifyContent:'center'}}>
                      
                        <Text style={{color: 'black', fontSize: HEIGHT*0.02, padding: WIDTH*0.02}}>Exit</Text>
                    </Pressable>
                    :
                    <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                     {GetFAIconWithColor("ArrowLeft", "black")}
                    </Pressable>
                    }
               
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  8 / 9</ProgressText>
            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false} style={{minHeight: HEIGHT*0.45}}>
                <TitleText>Enter your phone number</TitleText>
                <SubtitleText>We will send you a one time password</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput editable={!loading} value={phoneNumber} onChangeText={(value)=> handleInput(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"/>
                        
                    
                </TextInputContainer>
                <FollowUpContainer>
                    <Pressable onPress={()=> setAgreement(!agreement)} style={{padding: WIDTH*0.01, borderRadius: 5, backgroundColor: agreement ? PRIMARYCOLOR : MEDIUMGREY}}>
                        {GetFAIconWithColor("Check", "white")}
                    </Pressable>
                    <FollowUpText>I agree to Crib <Text onPress={()=>navigation.navigate('TermsAndService')} style={{textDecorationLine:'underline', color:GOOGLEBLUE}}>Terms and Services</Text>.</FollowUpText>
                </FollowUpContainer>
                <FollowUpContainer>
                    <Pressable onPress={()=> setPrivacyAgreement(!privacyagreement)} style={{padding: WIDTH*0.01, borderRadius: 5, backgroundColor: privacyagreement ? PRIMARYCOLOR : MEDIUMGREY}}>
                    {GetFAIconWithColor("Check", "white")}
                    </Pressable>
                    <FollowUpText>I agree to Crib <Text onPress={()=>navigation.navigate('Privacy')} style={{textDecorationLine:'underline', color:GOOGLEBLUE}}>Privacy Policy</Text>.</FollowUpText>
                </FollowUpContainer>
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
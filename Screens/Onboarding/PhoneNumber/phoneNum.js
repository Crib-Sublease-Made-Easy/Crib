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


import { HEIGHT, WIDTH, PRIMARYCOLOR, ContinueButton, ContinueText, ProgressText, DARKGREY, MEDIUMGREY, GOOGLEBLUE, SignUpHeader, SignUpBackButtonPressable } from '../../../sharedUtils';

import Lottie from 'lottie-react-native';


import {Header, ProgressBarContainer, SubtitleText, TitleText, 
    GeneralTextInput, TextInputContainer, FollowUpContainer, FollowUpText} from './phoneNumStyle';

export default function PhoneNumberScreen({navigation, route}){
    const [phoneNumber, setPhoneNumber] = useState("")
    const [passedPhoneNumber, setPassedPhoneNumber]= useState("")
    const [loading, setLoading] = useState(false)
    const [agreement, setAgreement] = useState(false)
    async function signupStep1(){
        console.log("INSIDE STEP 1")
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
        .then(async res => {
            const data = await res.json();
            if(res.status == 201){
                if(data.response.user.id != undefined){
                    signupStep2(data.response.user.id);
                }
                else{
                    alert("An error has occured.")
                }
            }
            else if(data.error != undefined){
                alert("Invalid Email Address")
                navigation.navigate("Email", {
                    firstName: route.params.firstName, 
                    lastName: route.params.lastName,
                    age: route.params.age,
                    gender: route.params.gender,
                    profilePic: route.params.profilePic,
                    school: route.params.school,
                    occupation: route.params.occupation
                });
            }
            else{
                alert("An error has occured. Please try again later!")
                navigation.reset(
                    {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                )
            }
        })
        .catch( e => {

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
        .then(async res => {
            const test = await res.json()
            if(res.status == 201){
                setLoading(false)

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
            else{
                setLoading(false)
                alert("An error has occured. Please try again later!")
                navigation.reset(
                    {index: 0 , routes: [{ name: 'DiscoverTabs'}]}
                )
            }
        })
        .catch( e => {
            alert("An error has occured!")
        }) 
    }

    async function signup(){
        if(!agreement){
            if(!agreement){
                alert("You have to agree to Crib Terms and Services and Privacy policy to proceed.")
            }
        }
        else if (passedPhoneNumber.length != 10){
            alert("Incorrect phone number.")
        }
        else{
            setLoading(true)
            await fetch('https://crib-llc.herokuapp.com/users/check', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: passedPhoneNumber
                })
            }).then(async res => {
                if(res.status == 200){
                    signupStep1()
                }
                else if(res.status == 409){
                    alert("Account with phone number exist, please login.")
                    setLoading(false)
                    navigation.reset({index: 0 , routes: [{ name: 'ProfileTabs'}]})
                }
                else{
                    alert("An error has occured. Please try again later!")
                    setLoading(false)
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
                {route.params.wrongPhoneNumber == undefined && 
                <SignUpBackButtonPressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack() }>
                    <Ionicons name='arrow-back-outline' size={25} />
                </SignUpBackButtonPressable>
                }
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  8 / 9</ProgressText>
            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false}>
                <TitleText>Enter your phone number</TitleText>
                <SubtitleText>We will send you a one time password</SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput editable={!loading} value={phoneNumber} onChangeText={(value)=> handleInput(value)}
                    keyboardType = "number-pad" placeholder="xxx-xxx-xxxx"/>
                        
                    
                </TextInputContainer>
                <FollowUpContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> setAgreement(!agreement)}>
                        <Ionicons size={25} name={'checkbox'} color={agreement ? PRIMARYCOLOR : MEDIUMGREY} />
                    </Pressable>
                    <FollowUpText>I agree to Crib <Text onPress={()=>navigation.navigate('TermsAndService')} style={{textDecorationLine:'underline', color:GOOGLEBLUE}}>Terms and Services</Text> and <Text onPress={()=>navigation.navigate('Privacy')} style={{textDecorationLine:'underline', color:GOOGLEBLUE}}>Privacy Policy</Text>.</FollowUpText>
                </FollowUpContainer>
                
            </ScrollView>
          

            <ContinueButton disabled={loading} loading={loading} onPress={signup}>
            {loading ?
                <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.05, height: WIDTH*0.05}}/>
            :
                <ContinueText>Continue</ContinueText>
            }
            </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
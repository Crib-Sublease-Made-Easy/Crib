import * as React  from 'react';
import { useState, useContext, createContext } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
    Text
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';


import { WIDTH, HEIGHT, OnlyLetters, ProgressText, ContinueButton, ContinueText, SignUpHeader, SignUpBackButtonPressable } from '../../../sharedUtils';

import { Header, ProgressBarContainer, TitleText, GeneralTextInput, 
    TextInputContainer,} from './firstLastNameStyle';

import Lottie from 'lottie-react-native';

export default function FirstLastNameScreen({navigation, route}){
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)

    function checkInput(){
        
        if(firstName == ""){
            alert("First name cannot be empty.")
        }
        else if(lastName == ""){
            alert("Last name cannot be empty.")
        }
        else if(!OnlyLetters(firstName)){
            alert("First name can only contain letters.")
        }
        else if(!OnlyLetters(lastName)){
            alert("Last name can only contain letters.")
        }
        else if(firstName.length > 30){
            alert("First name can only be less than 30 letters.")
        }
        else if(lastName.length > 30){
            alert("Last name can only be less than 30 letters.")
        }
        else{      
            navigation.navigate("Age", {firstName: firstName.trim(), lastName: lastName.trim()})
        }
        
    }

    function backToLanding(){
        navigation.goBack()
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} >
           
            <SignUpHeader>
                <SignUpBackButtonPressable hitSlop={WIDTH*0.025} onPress={backToLanding}>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </SignUpBackButtonPressable>
            </SignUpHeader>
            
            <ProgressBarContainer>
                <ProgressText>Step  1 / 9</ProgressText>
            </ProgressBarContainer>

            <ScrollView scrollEnabled={false}>
                <TitleText>Tell us a bit about yourself ...</TitleText>
                <TextInputContainer>
                    <GeneralTextInput value={firstName} onChangeText={(value)=>setFirstName(value)} placeholder="First Name"  />
                    <GeneralTextInput value={lastName} onChangeText={(value)=>setLastName(value)} placeholder="Last Name"  />
                </TextInputContainer>
            </ScrollView>

            <ContinueButton loading={loading} onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
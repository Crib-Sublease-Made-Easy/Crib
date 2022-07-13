import * as React  from 'react';
import { useState, useContext, createContext } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    Pressable
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { WIDTH, HEIGHT, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR , OnlyLetters,  ProgressBarCapacity, ProgressBar } from '../../../sharedUtils';

import { Header, ProgressBarContainer, TitleText, GeneralTextInput, ContinueButton, ContinueText,
    TextInputContainer,} from './firstLastNameStyle';

export default function FirstLastNameScreen({navigation, route}){
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    function checkInput(){
        // if(firstName == ""){
        //     alert("First name cannot be empty.")
        // }
        // else if(lastName == ""){
        //     alert("Last name cannot be empty.")
        // }
        // else if(!OnlyLetters(firstName)){
        //     alert("First name can only contain letters.")
        // }
        // else if(!OnlyLetters(lastName)){
        //     alert("Last name can only contain letters.")
        // }
        // else{
        //     navigation.navigate("Age")
        // }
        console.log("hello")
       
        navigation.navigate("Age", {firstName: firstName, lastName: lastName})
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} >
           
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
            
            <ProgressBarContainer>
                {/* <ProgressBarCapacity>
                    <ProgressBar>

                    </ProgressBar>
                </ProgressBarCapacity> */}

            </ProgressBarContainer>

            <ScrollView>
                <TitleText>Tell us a bit about you ...</TitleText>
                <TextInputContainer>
                    <GeneralTextInput value={firstName} onChangeText={(value)=>setFirstName(value)} placeholder="First Name"  />
                    <GeneralTextInput value={lastName} onChangeText={(value)=>setLastName(value)} placeholder="Last Name"  />
                </TextInputContainer>
            </ScrollView>

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
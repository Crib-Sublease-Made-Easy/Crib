import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    Pressable,
    KeyboardAvoidingView
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

  
import { HEIGHT, WIDTH, ContainsSpace, ContinueButton, ContinueText, ProgressText, SignUpHeader, GetFAIconWithColor, } from '../../../sharedUtils';


import {Header, ProgressBarContainer, SubtitleText, TitleText, 
    GeneralTextInput, TextInputContainer} from './emailStyle';

export default function EmailScreen({navigation, route}){
    const [email, setEmail] = useState("")

    function checkInput(){
        let stringAfterAt = email.indexOf("@") == -1 ? undefined : email.substring(email.indexOf("@"));
        if(email == ""){
            alert("Email is required.")
        }
        else if(email.indexOf("@") == -1){
            alert("Please enter a valid email.")
        }
        else if(ContainsSpace(email.trim())){
            alert("Please enter a valid email.")
        }
        else if(stringAfterAt.indexOf(".") == -1){
            alert("Please enter a valid email.")
        }
        else if(email.substring(email.lastIndexOf(".")) == "."){
            alert("Please enter a valid email.")
        }
        else if(email.indexOf("@") != email.lastIndexOf("@")){
            alert("Please enter a valid email.")
        }
        //Need to also check the front part of the string whatever is before @
        else{
            navigation.navigate("PhoneNumber",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: route.params.gender,
                profilePic: route.params.profilePic,
                school: route.params.school,
                occupation: route.params.occupation,
                email: email.toLocaleLowerCase().trim(),
            })
        }
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
           <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <SignUpHeader>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                   {GetFAIconWithColor("ArrowLeft", 'black')}
                </Pressable>
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  7 / 9</ProgressText>
            </ProgressBarContainer>
           
            <ScrollView style={{minHeight: HEIGHT*0.4}}>
                <TitleText>What is your email?</TitleText>
                <SubtitleText>We will keep you updated </SubtitleText>
                <TextInputContainer>
                    <GeneralTextInput value={email} onChangeText={(value)=> setEmail(value)} placeholder="Ex: lighthouse@gmail.com"  />
                </TextInputContainer>
            </ScrollView>
          

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
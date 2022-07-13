import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    Pressable,
    KeyboardAvoidingView
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

  
import { HEIGHT, WIDTH } from '../../../sharedUtils';


import {Header, ProgressBarContainer, SubtitleText, TitleText, ContinueText, ContinueButton,
    GeneralTextInput, TextInputContainer} from './emailStyle';

export default function EmailScreen({navigation, route}){
    const [email, setEmail] = useState("")

    function checkInput(){
        console.log("hello")
        console.log(route.params.firstName)
        console.log(route.params.lastName)
        console.log(route.params.gender)
        console.log(route.params.school)
        console.log(route.params.occupation)
        console.log(route.params.email)
        console.log(route.params.profilePic)
        
        navigation.navigate("Password",
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            occupation: route.params.occupation,
            email: email,
        })
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
           <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
           
            <ScrollView>
                <TitleText>What email can we contact you?</TitleText>
                <SubtitleText>This will be your login credential</SubtitleText>
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
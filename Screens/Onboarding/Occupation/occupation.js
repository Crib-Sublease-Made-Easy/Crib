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
    KeyboardAvoidingView
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import { HEIGHT, WIDTH, DARKGREY, ContinueButton, ContinueText, ProgressText, SignUpHeader, GetFAIconWithColor } from '../../../sharedUtils';

import {Header, ProgressBarContainer, SubtitleText, TitleText,
    GeneralTextInput, TextInputContainer, FollowUpContainer, FollowUpText} from './occupationStyle';

export default function OccupationScreen({navigation, route}){
    const [occupation, setOccupation] = useState("")

    function checkInput(){

        if(occupation.length > 30){
            alert("Job title cannot be greater than 30 character.")
        }
        else{
            navigation.navigate("Email",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: route.params.gender,
                profilePic: route.params.profilePic,
                school: route.params.school,
                occupation: occupation.trim()
            })
        }
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
           <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
                <SignUpHeader>
                    <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                        {/* <FontAwesome name='arrow-left' size={25} /> */}
                        {GetFAIconWithColor("ArrowLeft", "black")}
                    </Pressable>
                </SignUpHeader>
                    
                <ProgressBarContainer>
                    <ProgressText> Step  6 / 9</ProgressText>
                </ProgressBarContainer>

                <ScrollView scrollEnabled={false} style={{minHeight: HEIGHT*0.4}}>
                    <TitleText>Occupation (Optional)</TitleText>
                    <SubtitleText>Choose your latest occupation</SubtitleText>
                    <TextInputContainer >
                        <GeneralTextInput value={occupation} onChangeText={(value)=> setOccupation(value)} placeholder="Ex: Plumber"  />
                    </TextInputContainer>

                
                </ScrollView>


                <ContinueButton onPress={()=> checkInput()}>
                    <ContinueText>Continue</ContinueText>
                </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
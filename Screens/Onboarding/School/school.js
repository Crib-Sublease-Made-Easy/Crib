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

import uniList from '../../../universityList.json'

import Ionicons from 'react-native-vector-icons/Ionicons';


  
import { HEIGHT, WIDTH , LIGHTGREY, DARKGREY, ContinueButton, ContinueText, ProgressText, SignUpHeader, SignUpBackButtonPressable} from '../../../sharedUtils';

import {Header, ProgressBarContainer, SubtitleText, TitleText,  FollowUpContainer, FollowUpText,
    GeneralTextInput, TextInputContainer} from './schoolStyle';


export default function SchoolScreen({navigation, route}){
    const [school, setSchool] = useState("")

    function checkInput(){
        if(school.length > 50){
            alert("Name of school cannot be greater than 50 characters.")
        }
        else{        
            navigation.navigate("Occupation",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: route.params.gender,
                profilePic: route.params.profilePic,
                school: school.trim(),
            })
        }
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
           <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
            <SignUpHeader>
                <SignUpBackButtonPressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </SignUpBackButtonPressable>
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  5 / 9</ProgressText>
            </ProgressBarContainer>
           
            <ScrollView scrollEnabled={false}>
            
                <TitleText>School (Optional)</TitleText>
                <SubtitleText>Choose your latest education</SubtitleText>
                <TextInputContainer >
                    <GeneralTextInput  value={school} onChangeText={(value)=> setSchool(value)} placeholder="Ex: University of Wisconsin - Madison"  />
                </TextInputContainer>
            
            </ScrollView>
          

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
        </KeyboardAvoidingView> 
        </SafeAreaView>
    )
}
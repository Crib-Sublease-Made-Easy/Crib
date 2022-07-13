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

import { HEIGHT, WIDTH, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR, MEDIUMGREY } from '../../../sharedUtils';


const GENDERS = ["Men", "Women", "Others", "Perfer not to say"]

import { AgeContainer, Header, ProgressBarContainer, SubtitleText, TitleText, GenderRowContainer, GenderName,
    GenderInputContainer, ContinueText, ContinueButton } from './genderStyle';

export default function GenderScreen({navigation, route}){
    console.log(route.params.firstName)
    console.log(route.params.lastName)
    const [gender, setGender] = useState("")

    function checkInput(){
        // if(gender == ""){
        //     alert("Please slect an option.")
        // }
        // else{
        //     navigation.navigate("ProfilePic")
        // }
        console.log("hello")
        console.log(route.params.firstName)
        console.log(route.params.lastName)
        console.log(route.params.gender)
        console.log(route.params.school)
        console.log(route.params.occupation)
        console.log(route.params.email)
      
        navigation.navigate("ProfilePic",
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: gender
        })
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>

            <ScrollView>
                <TitleText>What is your gender?</TitleText>
                <SubtitleText>This will be showed to others</SubtitleText>
                <GenderInputContainer>
                    {GENDERS.map((value)=>(
                    <GenderRowContainer key = {value + "RowContainer" }>
                        <GenderName>{value}</GenderName>
                        <Pressable onPress={()=>setGender(value)}>
                            <Ionicons name='checkbox' size={25} color={ gender == value ? PRIMARYCOLOR : MEDIUMGREY}/>
                        </Pressable>
                    </GenderRowContainer>
                    ))}
                </GenderInputContainer>
            </ScrollView>

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )
}
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

import { HEIGHT, WIDTH, PRIMARYCOLOR, SignUpHeader, MEDIUMGREY, ContinueButton, ContinueText, ProgressText, GetFAIconWithColor } from '../../../sharedUtils';


const GENDERS = [
    {name: "Male", icon: 'male-outline'},
    {name:"Female", icon: 'female-outline'},
    {name: "Other", icon: 'male-female-outline'},
    {name: "Prefer not to say", icon: 'close-outline'}
]

import { AgeContainer, Header, ProgressBarContainer, SubtitleText, TitleText, GenderRowContainer, GenderName,
    GenderInputContainer, } from './genderStyle';

export default function GenderScreen({navigation, route}){
   
    const [gender, setGender] = useState("")

    function checkInput(){
        if(gender == ""){
            alert("Please slect an option.")
        }
        else{
            navigation.navigate("ProfilePic",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: gender
            })
        }  
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
            <SignUpHeader>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    {GetFAIconWithColor("ArrowLeft", "black")}
                </Pressable>
            </SignUpHeader>
                
            <ProgressBarContainer>
                <ProgressText>Step  3 / 9</ProgressText>
            </ProgressBarContainer>

            <ScrollView scrollEnabled={false}>
                <TitleText>What is your gender?</TitleText>
                <SubtitleText>Select gender that you identify with most</SubtitleText>
                <GenderInputContainer>
                    {GENDERS.map((value)=>(
                    <GenderRowContainer key = {value.name + "RowContainer" } onPress={()=> setGender(value.name)}>
                        <View style={{ flexDirection:'row', alignItems:'center'}}>
                      
                        <GenderName>{value.name}</GenderName>
                        </View>
                        <Pressable onPress={()=>setGender(value.name)} style={{padding: WIDTH*0.01, backgroundColor: gender==value.name ? PRIMARYCOLOR : MEDIUMGREY, borderRadius:5}}>
                           {GetFAIconWithColor("Check", "white")}
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